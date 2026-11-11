// UserPromptSubmit: hint ladder + task outcomes + explanation check + end of session.
// For each prompt: (1) work out which (micro)skill it is about, (2) decide whether a new hint rung
// unlocks (only after a visible attempt or the stuck timer), (3) inject that as context for Claude.
// Messages come from i18n/<settings.language>.json; recognition always uses Dutch and English (patterns.mjs).
import fs from "node:fs";
import path from "node:path";
import {
  readStdin, loadSkills, findSkill, globToRegex, logEvent, loadSession, saveSession, skillForPath, familyOf,
  taskStats, ROOT, levelName, isMicro, microsOf, keywordMap, logTask, pendingTasks, levelAdvice, learnerText,
  settingsOf, codeExtRe, toolingRe, touch, activeMinutesSince, startTask, effectiveLevel, isPlacementPending, isReviewDue,
  afterTask, allTasks, readEvents, openOffer, promote, exerciseDirs, newWorkSignal, beginNewWork, noteExplanationWords,
  taskRung, taskLogged, addMicro, t,
} from "./lib.mjs";
import {
  HINT, SOLUTION, SOLVED_STRONG, SOLVED_WEAK, CODE_CONTEXT, NOT_SOLVED, END, RESUME, ATTEMPT, CHECKING,
  STUCK, DONT_KNOW, MORE_EXPLANATION, errorSignature, promotionAnswer, microAnswer,
} from "./patterns.mjs";

const rungName = (n) => t(`rung.${n}`);

let input;
try { input = JSON.parse(await readStdin()); } catch { process.exit(0); }
const sid = input.session_id ?? "onbekend";
// Agent reports, task notifications and system reminders also arrive here as prompts. They are
// not the learner's words: no skill detection, no hint rung, no task, no lastPrompt, no output.
const originKind = typeof input.origin === "string" ? input.origin : input.origin?.kind ?? null;
const { own, why: ignoredWhy } = learnerText(input.prompt, originKind);
if (own === null) {
  logEvent({ type: "prompt-ignored", why: ignoredWhy, fields: Object.keys(input).sort().join(","), session: sid });
  process.exit(0);
}
const prompt = own;
let data;
try { data = loadSkills(); } catch { process.exit(0); }

const settings = settingsOf(data);
const T = settings.stuckTimerMinutes;
// Tooling words (settings.toolingTerms): "it works" about the environment is not a solved task.
const TOOLING_RE = toolingRe(data);
const CODE_FILE = codeExtRe(data);
const now = Date.now();
const st = touch(loadSession(sid), now, data);
const ctx = [];

// The learner's last message, so reflect-gate can check an explanation against it.
st.lastPrompt = prompt.slice(0, 4000);
st.lastPromptAt = now;
// And every own message since a task was logged, per open task: the explanation check judges them
// together (setup review of 11 Nov, S1). A task logged by this prompt is not open yet, so its own
// "tests groen" message does not count towards its explanation.
noteExplanationWords(st, prompt, pendingTasks().map((x) => x.tid));

// New work since the last logged task (setup review of 11 Nov, S3): code changed in another exercise
// folder, or the full name of another exercise folder or a #id of another family in this prompt.
// Then a new task begins, before any hint for it is given.
{
  const why = newWorkSignal(data, st, { prompt, scanCode: true });
  if (why) {
    beginNewWork(st, why, { session: sid, now });
    const reason = { "code-elsewhere": "pg.taskStart.code", "prompt-exercise": "pg.taskStart.exercise", "prompt-id": "pg.taskStart.id" }[why];
    ctx.push(t("pg.taskStart", { why: reason ? t(reason) : why }));
  }
}

// ---------- 0. Answer to a promotion proposal (setup review §9.6) ----------
// The learner decides: only the learner's OWN prompt promotes, never Claude's text. "ja, doorzetten"
// (optionally with the id) confirms an open proposal. A bare "nee" or "later" right after a proposal
// declines it: it then only comes back after a new task that meets the criterion again.
let promotedMsg = null;
{
  const ans = promotionAnswer(prompt);
  const fresh = st.lastOffer?.fresh ? st.lastOffer : null;
  if (st.lastOffer) st.lastOffer.fresh = false;
  if (ans?.answer === "yes") {
    const named = ans.id ? findSkill(data, ans.id) : null;
    const open = (named ? [named] : data.skills).filter((s) => s.kind !== "zone")
      .map((s) => ({ s, a: openOffer(data, s) })).filter((x) => x.a);
    let pick = named ? open[0] ?? null : open.find((x) => fresh && x.s.id === fresh.skill) ?? null;
    if (!pick && !named) {
      const live = open.filter((x) => !x.a.declined);
      if (live.length === 1) pick = live[0];
      else if (live.length > 1) ctx.push(t("pg.promote.which", { list: live.map((x) => `${x.s.id} ${x.a.from} → ${x.a.to}`).join(", ") }));
    }
    if (pick) {
      const r = promote(data, pick.s, pick.a);
      if (r.ok) { promotedMsg = r.message; st.lastOffer = null; st.proposals = []; }
      ctx.push(t(r.ok ? "pg.promote.done" : "pg.promote.refused", { msg: r.message, id: pick.s.id, from: pick.a.from }));
      logEvent({ type: r.ok ? "promotion-confirmed" : "promotion-refused", skill: pick.s.id, from: pick.a.from, to: pick.a.to, session: sid });
    } else if (!ctx.length) ctx.push(t("pg.promote.none", { id: ans.id ?? "-" }));
  } else if (ans?.answer === "no" && fresh) {
    logEvent({ type: "promotion-declined", skill: fresh.skill, level: fresh.from, to: fresh.to, lastTid: fresh.lastTid, session: sid });
    st.lastOffer = null; st.proposals = [];
    ctx.push(t("pg.promote.declined", { id: fresh.skill }));
  }
}

// ---------- 0b. Answer to a proposal for a microskill (setup review of 11 Nov, afternoon, #22) ----------
// Only the learner's own "ja, toevoegen" (optionally with the id) adds it: the latest open proposal, or
// the one with that id. A bare "nee" right after a proposal declines it; it is not shown again in this session.
let microMsg = null;
{
  const ans = microAnswer(prompt);
  const offers = Array.isArray(st.microOffers) ? st.microOffers : [];
  const fresh = new Set(offers.filter((o) => o.fresh).map((o) => o.id));
  for (const o of offers) o.fresh = false;
  if (ans?.answer === "yes") {
    const pick = ans.id ? offers.find((o) => o.id === ans.id) : offers[offers.length - 1];
    const parent = pick ? findSkill(data, pick.parent) : null;
    if (!pick) ctx.push(t("pg.micro.none", { id: ans.id ?? "-" }));
    else if (!parent || findSkill(data, pick.id)) ctx.push(t("pg.micro.gone", { id: pick.id }));
    else {
      addMicro(data, parent, { id: pick.id, title: pick.title, level: pick.level, keywords: pick.keywords, note: t("note.byProposal"), by: "learner", via: "voorstel" });
      microMsg = t("micro.added", { id: pick.id, level: pick.level, name: levelName(pick.level), parent: parent.id, plevel: parent.level });
      ctx.push(t("pg.micro.done", { msg: microMsg }));
    }
    if (pick) st.microOffers = offers.filter((o) => o !== pick);
  } else if (ans?.answer === "no" && fresh.size) {
    for (const o of offers.filter((x) => fresh.has(x.id))) logEvent({ type: "micro-declined", skill: o.id, parent: o.parent, session: sid });
    st.microOffers = offers.filter((o) => !fresh.has(o.id));
    ctx.push(t("pg.micro.declined", { ids: [...fresh].join(", ") }));
  }
}

// ---------- 1. Skill detection ----------
const SKIP_DIR = /^(bin|obj|\.vs|\.idea|\.git|\.claude|\.learning|node_modules)$/i;

// The code file the learner changed most recently since `since` (anywhere in the project).
function latestChangedCode(since) {
  let best = null, budget = 4000;
  const walk = (dir) => {
    let entries = [];
    try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (budget-- <= 0) return;
      const f = (dir ? dir + "/" : "") + e.name;
      if (e.isDirectory()) { if (!SKIP_DIR.test(e.name)) walk(f); continue; }
      if (!CODE_FILE.test(e.name)) continue;
      try { const m = fs.statSync(path.join(ROOT, f)).mtimeMs; if (m > since && (!best || m > best.mtime)) best = { file: f, mtime: m }; } catch { /* skip */ }
    }
  };
  walk("");
  return best;
}

// The folder decides the family (setup review 3.3): check.mjs and `done` set st.folderSkill, and a
// code file changed more recently than that is the second signal. A keyword may then only choose a
// microskill within that family; another family needs #id or the name of an exercise.
function folderFamily() {
  const latest = latestChangedCode(Math.max(st.folderSkillAt ?? 0, st.startedAt ?? 0));
  if (latest) {
    const s = skillForPath(data, latest.file);
    if (s && s.kind !== "zone") { st.folderSkill = familyOf(s); st.folderSkillAt = latest.mtime; }
  }
  const f = st.folderSkill ? findSkill(data, st.folderSkill) : null;
  return f ? familyOf(f) : null;
}
const folderFam = folderFamily();

// A deliberate switch (#id or the name of an exercise) also moves the folder lock.
let explicit = false;
function detectSkill() {
  const p = prompt.toLowerCase();
  const tag = p.match(/#([a-z]+(?:\.[a-z0-9-]+)+)/);
  if (tag && findSkill(data, tag[1])) { explicit = true; return findSkill(data, tag[1]); }
  const kw = keywordMap(data);
  const scores = new Map();
  let best = null;
  let activeScore = 0;
  // Exercise names first: they may switch to another family, also when the folder is known.
  const byExercise = new Set();
  for (const s of data.skills) {
    if (s.kind === "zone") continue;
    for (const d of exerciseDirs(s)) {
      const name = d.split("/").pop().toLowerCase();          // "21-bankrekening"
      const bare = name.replace(/^\d+-/, "");                  // "bankrekening"
      if (p.includes(name) || (bare.length > 4 && (p.includes(bare) || p.includes(bare.replace(/-/g, " "))))) byExercise.add(s.id);
    }
  }
  const lockedTo = byExercise.size ? null : folderFam;
  for (const s of data.skills) {
    if (s.kind === "zone") continue;
    if (lockedTo && familyOf(s) !== lockedTo) continue;
    let score = byExercise.has(s.id) ? 5 : 0;
    // Microskill keywords are more specific: they weigh double.
    for (const k of kw[s.id] ?? []) if (k && p.includes(k)) score += isMicro(s) ? 2 : 1;
    scores.set(s.id, score);
    if (s.id === st.activeSkill) activeScore = score;
    if (score > 0 && (!best || score > best.score || (score === best.score && s.id === st.activeSkill))) best = { s, score, byExercise: byExercise.has(s.id) };
  }
  // A parent wins (e.g. by exercise name)? Then prefer its best-matching microskill.
  if (best && !isMicro(best.s)) {
    const m = microsOf(data, best.s.id).map((x) => ({ s: x, score: scores.get(x.id) ?? 0 })).sort((a, b) => b.score - a.score)[0];
    if (m && m.score > 0) best = { ...best, s: m.s };
  }
  const active = st.activeSkill ? findSkill(data, st.activeSkill) : null;
  // The folder is known but the session skill is from another family: the folder wins.
  if (!best && lockedTo && familyOf(active) !== lockedTo) return findSkill(data, lockedTo);
  // Sticky: a few loose keywords do not switch skills (a tie stays too). Staying within the same family is always allowed.
  if (best && active && best.s.id !== active.id && familyOf(best.s) !== familyOf(active) && !best.byExercise && best.score <= activeScore + 2) {
    return active;
  }
  if (best?.byExercise) explicit = true;
  return best?.s ?? null;
}

const detected = detectSkill();
if (detected && explicit && familyOf(detected) !== folderFam) { st.folderSkill = familyOf(detected); st.folderSkillAt = now; }
if (detected && detected.id !== st.activeSkill) {
  const prev = st.activeSkill ? findSkill(data, st.activeSkill) : null;
  const sameFamily = prev && (prev.id === detected.parent || prev.parent === detected.id || (prev.parent && prev.parent === detected.parent));
  st.activeSkill = detected.id;
  // Another family gets its own ladder (rung back to 0), but maxRung is kept until a task is logged:
  // the help was really given, and a misdetected skill must not erase it (10 Nov 2026: hints for
  // one skill's code were logged under another skill and the tasks showed rung 0).
  if (!sameFamily) { st.rung = 0; st.lastRungAt = null; st.lastRungActive = null; st.taskStartedAt = now; st.taskStartedActive = st.activeMs; }
}
const skill = st.activeSkill ? findSkill(data, st.activeSkill) : null;
// The effective level: an open placement counts as L2, a due L4 review as L3 (S4, S2).
const level = skill ? effectiveLevel(data, skill) : settings.defaultLevel;
const placementOpen = skill ? isPlacementPending(data, skill) : false;

// Notices from the Stop hook or a "!" run (automatic demotion, placement): tell the learner.
if (Array.isArray(st.notices) && st.notices.length) {
  ctx.push(t("pg.notices", { list: st.notices.join("\n") }));
  st.notices = [];
}
// A proposal the harness showed the learner after the last answer (promotion, transfer task, §9.6).
if (Array.isArray(st.proposals) && st.proposals.length) {
  ctx.push(t("pg.proposals", { list: st.proposals.join("\n\n") }));
  st.proposals = [];
}
// A transfer task runs (/mastery-check, §9.4): no hints and no code until the learner is done.
if (st.transfer?.skill) ctx.push(t("pg.transfer", { id: st.transfer.skill }));

// A due L4 review comes by in real work (S2): this time the learner does it, once per session.
{
  const parent = skill && isMicro(skill) ? findSkill(data, skill.parent) : null;
  const due = [skill, parent].find((s) => isReviewDue(s));
  st.reviewNoticed = st.reviewNoticed ?? [];
  if (due && !st.reviewNoticed.includes(due.id)) {
    st.reviewNoticed.push(due.id);
    logEvent({ type: "review-due", skill: due.id, session: sid });
    ctx.push(t("pg.review", { id: due.id }));
  }
}

// ---------- 2. Signals ----------
function changedSince(since) {
  const owner = skill && isMicro(skill) ? findSkill(data, skill.parent) : skill;
  const roots = owner && (owner.paths ?? []).some((p) => !p.startsWith("**")) ? exerciseDirs(owner) : [""];
  const out = [];
  let budget = 4000;
  const walk = (dir) => {
    let entries = [];
    try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (budget-- <= 0 || out.length >= 5) return;
      if (e.isDirectory()) {
        if (/^(bin|obj|\.vs|\.idea|\.git|\.claude|\.learning|node_modules)$/i.test(e.name)) continue;
        walk((dir ? dir + "/" : "") + e.name);
      } else if (CODE_FILE.test(e.name)) {
        const f = (dir ? dir + "/" : "") + e.name;
        try { if (fs.statSync(path.join(ROOT, f)).mtimeMs > since) out.push(f); } catch { /* skip */ }
      }
    }
  };
  roots.forEach(walk);
  return out;
}

const wantsSolution = SOLUTION.test(prompt);
const textAttempt = ATTEMPT.test(prompt);
const wantsHint = HINT.test(prompt) || wantsSolution || textAttempt;
const isQuestion = /\?/.test(prompt) || CHECKING.test(prompt);
const since = st.lastRungAt ?? st.taskStartedAt ?? st.startedAt;
const weak = SOLVED_WEAK.test(prompt) && !TOOLING_RE.test(prompt) &&
  (CODE_CONTEXT.test(prompt) || changedSince(st.taskStartedAt ?? st.startedAt).length > 0);
const recentlyLogged = st.lastTaskAt && now - st.lastTaskAt < 10 * 60000; // check.mjs or done just logged it
const solved = (SOLVED_STRONG.test(prompt) || weak) && !NOT_SOLVED.test(prompt) && !isQuestion && !recentlyLogged;
const ending = END.test(prompt);
const changed = wantsHint ? changedSince(since) : [];
const attempt = textAttempt || changed.length > 0;
// The stuck timer counts ACTIVE minutes since the last hint: a break does not unlock a rung (setup review 3.5).
const minutes = st.lastRungAt ? activeMinutesSince(st, st.lastRungActive) : null;
const timerUp = minutes !== null && minutes >= T;
const attemptWhy = changed.length ? t("pg.attemptWhy.changed", { files: changed.slice(0, 2).join(", ") })
  : textAttempt ? t("pg.attemptWhy.text") : "";
// Placement signals (S4): the same error or test outcome twice, and whether there was an own attempt.
const errSig = errorSignature(prompt);
const sameError = Boolean(errSig) && errSig === st.lastErrorSig;
if (errSig) st.lastErrorSig = errSig;
if (attempt) st.attempted = true;

// ---------- 3. Outcomes ----------
if (solved && skill) {
  // All help since the last task, plus review help about this task's concept (S3).
  const { rung: m, reviewRung } = taskRung(data, st, skill.id);
  const success = m < 5;
  const mins = activeMinutesSince(st, st.taskStartedActive);
  const tk = logTask({ skill: skill.id, success, maxRung: m, minutes: mins, source: "chat", session: sid, level, reviewRung: reviewRung > (st.maxRung ?? 0) ? reviewRung : 0,
    tid: st.openTid });
  // Honest words (#27): independent only at rung 0; at rung 1-2 solved with help up to that rung.
  const verdict = t(!success ? "pg.verdict.fail" : m === 0 ? "pg.verdict.solo" : m <= 2 ? "pg.verdict.ok" : "pg.verdict.help", { rung: m });
  ctx.push(t("pg.taskLogged", { id: skill.id, tid: tk.tid, rung: m, verdict }));
  const after = afterTask(data, skill.id, tk);
  if (success && m <= 2) {
    // What becomes possible once this task is explained (§9.2); the harness itself makes the proposal.
    const adv = levelAdvice(data, skill, { assume: [tk.tid] });
    ctx.push(t("pg.signal", {
      how: m === 0 ? t("pg.signal.noHint") : t("pg.signal.upTo", { rung: m }),
      advice: adv?.dir === "up" ? t("pg.signal.advice", { text: adv.text, id: adv.id, from: adv.from, to: adv.to })
        : adv?.dir === "transfer" ? t("pg.signal.transfer", { text: adv.text, show: adv.show }) : "",
    }));
  }
  if (!isMicro(skill) && microsOf(data, skill.id).length === 0) ctx.push(t("pg.noMicros", { id: skill.id }));
  if (after.messages.length) ctx.push(t("pg.notices", { list: after.messages.join("\n") }));
  if (after.pending) st.demotionPending = after.pending;
  taskLogged(st, tk, now);
}

// ---------- 3b. Explanation check (consolidation) ----------
const pending = pendingTasks();
if (pending.length) {
  const list = pending.slice(-5).map((x) => `${x.skill} [${x.tid}]${x.what ? ` (${x.what})` : ""}`).join("; ");
  ctx.push(t("pg.pending", { list }));
}

// ---------- 3c. Demotion analyst (S3a) ----------
// The criterion was met for a parent skill: Claude calls the read-only agent demotie-analist after
// the learner's current point, and puts its JSON in the marker [demotie {...}]. The Stop hook checks
// the JSON and that the agent really ran in that turn. Without that, nothing changes automatically.
if (st.demotionPending && settings.autoDemote) {
  const dp = st.demotionPending;
  const byTid = new Map(allTasks().map((x) => [x.tid, x]));
  const tests = new Map(readEvents().filter((e) => e.type === "test-green").map((e) => [e.tid, e.tests]));
  const tdir = input.transcript_path ? path.dirname(String(input.transcript_path)) : null;
  const taken = (dp.tids ?? []).map((tid) => byTid.get(tid)).filter(Boolean).map((x) => ({
    tid: x.tid, wat: x.what ?? null, tests: tests.get(x.tid) ?? [], map: x.dir ?? null, hoogsteTrede: x.maxRung ?? 0,
    gelukt: Boolean(x.success && (x.maxRung ?? 0) <= 2), sessie: x.session ?? null, tijd: x.at,
    transcript: tdir && x.session ? path.join(tdir, `${x.session}.jsonl`) : null,
  }));
  const micros = microsOf(data, dp.skill).map((m) => ({ id: m.id, titel: m.title, trefwoorden: m.keywords ?? [], niveau: m.level }));
  const analystInput = { ouder: dp.skill, niveau: findSkill(data, dp.skill)?.level ?? null, reden: dp.reason, taken, microvaardigheden: micros };
  ctx.push(t("pg.analyst", { id: dp.skill, input: JSON.stringify(analystInput) }));
}

// ---------- 4. Hint ladder per level ----------
// A new skill (placement open, S4): try first. A rung only goes up when the learner says they are
// stuck, shares the same error or test outcome twice, or admits not knowing the concept; never on
// time. An explicit request for more explanation, after an own attempt, may go straight higher.
const placementWhy = () => {
  if (STUCK.test(prompt)) return t("pg.why.saysStuck");
  if (sameError) return t("pg.why.sameError");
  if (DONT_KNOW.test(prompt)) return t("pg.why.dontKnow");
  return null;
};
const asksMore = placementOpen && st.attempted && MORE_EXPLANATION.test(prompt);
st.placementNoticed = st.placementNoticed ?? [];
if (placementOpen && (wantsHint || asksMore) && !solved && level === "L2" && !st.placementNoticed.includes(skill.id)) {
  st.placementNoticed.push(skill.id);
  ctx.push(t("pg.placement", { id: skill.id }));
}
if ((wantsHint || asksMore) && !solved && st.transfer?.skill) {
  // During the transfer task no rung unlocks: help ends the transfer task instead (§9.4).
  logEvent({ type: "hint-hold", skill: skill?.id ?? null, rung: st.rung, session: sid, transfer: true });
  ctx.push(t("pg.transferHint", { id: st.transfer.skill }));
} else if ((wantsHint || asksMore) && !solved) {
  if (level === "L2") {
    let why = null, ceilingOnly = false;
    if (wantsSolution && st.rung >= 4) { st.rung = 5; why = t("pg.why.solutionAfter4"); }
    else if (asksMore && st.rung < 4) { st.rung = 4; why = t("pg.why.asksMore"); ceilingOnly = true; }
    else if (placementOpen) { const w = placementWhy(); if (w) { st.rung = Math.min(st.rung + 1, 4); why = w; } }
    else if (st.rung === 0) { st.rung = 1; why = t("pg.why.first"); }
    else if (attempt || timerUp) { st.rung = Math.min(st.rung + 1, 4); why = attempt ? attemptWhy : t("pg.why.stuck", { min: minutes, timer: T }); }

    if (why) {
      // A ceiling (asked for more explanation) is logged by the [trede N] Claude really gives, not by the ceiling.
      if (!ceilingOnly) st.maxRung = Math.max(st.maxRung ?? 0, st.rung);
      st.lastRungAt = now;
      st.lastRungActive = st.activeMs;
      logEvent({ type: "hint-unlock", skill: skill?.id ?? null, rung: st.rung, reason: why, session: sid });
      ctx.push(st.rung === 5 ? t("pg.rung5") : ceilingOnly ? t("pg.unlockedUpTo", { rung: st.rung, mark: t("pg.rungMark") })
        : t("pg.unlocked", { rung: st.rung, name: rungName(st.rung), why }));
    } else if (st.rung === 5) {
      ctx.push(t("pg.rung5reached"));
    } else if (placementOpen) {
      logEvent({ type: "hint-hold", skill: skill?.id ?? null, rung: st.rung, session: sid, placement: true });
      ctx.push(t("pg.holdPlacement", { rung: st.rung, name: rungName(st.rung) }));
    } else {
      const left = Math.max(0, T - (minutes ?? 0));
      logEvent({ type: "hint-hold", skill: skill?.id ?? null, rung: st.rung, session: sid });
      ctx.push(t("pg.hold", { min: minutes, left, rung: st.rung, name: rungName(st.rung) }));
    }
    if (wantsSolution && st.rung < 5) ctx.push(t("pg.wantsSolution", { rung: st.rung }));
  } else if (level === "L3") {
    ctx.push((attempt ? t("pg.L3.attempt", { why: attemptWhy }) : t("pg.L3.noAttempt")) + " " + t("pg.L3.tail", { mark: t("pg.rungMark") }));
  } else if (level === "L1") {
    ctx.push(t("pg.L1", { mark: t("pg.rungMark") }));
  } else if (level === "L0") {
    ctx.push(t("pg.L0"));
  }
}

// ---------- 5. End of session & reflection nudge ----------
if (RESUME.test(prompt) && st.endRequested) {
  st.endRequested = false; st.reflectBlocks = 0;
}
if (ending) {
  st.endRequested = true; st.reflectBlocks = 0;
  logEvent({ type: "end-request", session: sid });
  ctx.push(t("pg.end", { sid, pending: pending.length ? t("pg.end.pending", { n: pending.length }) : "" }));
} else if (!st.nudged && (st.activeMs ?? 0) > 60 * 60000) {
  st.nudged = true;
  ctx.push(t("pg.hour"));
}

// ---------- 6. Output ----------
if (skill || wantsHint || ctx.length) {
  const stats = skill ? taskStats(skill.id, 10, isMicro(skill) ? null : data) : null;
  const name = skill ? (isMicro(skill) ? t("pg.head.micro", { id: skill.id, parent: skill.parent }) : skill.id) : null;
  // The help given for this task so far (#23): the highest rung, with review help about this concept.
  // st.rung is only the unlocked rung of the L2 ladder; at L3 it stays 0 while [trede N] is logged.
  const given = skill ? taskRung(data, st, skill.id).rung : 0;
  const givenText = given ? t("pg.head.given", { rung: given }) : t("pg.head.givenNone");
  const head = skill
    ? t("pg.head", {
      name, level, levelName: levelName(level),
      help: level === "L2" ? `${t("pg.head.unlocked", { rung: st.rung, rungName: rungName(st.rung) })} · ${givenText}` : givenText,
      stats: stats.n ? t("pg.head.stats", { ok: stats.ok, n: stats.n, pct: Math.round(settings.targetSuccess * 100) }) : t("pg.head.noTasks"),
      pending: stats.pending ? t("pg.head.pending", { n: stats.pending }) : "",
    })
    : t("pg.head.unknown", { level });
  const systemMessage = [promotedMsg, microMsg].filter(Boolean).join("\n\n");
  process.stdout.write(JSON.stringify({
    ...(systemMessage ? { systemMessage } : {}),
    hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: [head, ...ctx].join("\n") },
  }));
}
saveSession(sid, st);
