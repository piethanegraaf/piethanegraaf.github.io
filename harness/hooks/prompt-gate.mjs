// UserPromptSubmit: hint ladder + task outcomes + explanation check + end of session.
// For each prompt: (1) work out which (micro)skill it is about, (2) decide whether a new hint rung
// unlocks (only after a visible attempt or the stuck timer), (3) inject that as context for Claude.
// Messages come from i18n/<settings.language>.json; recognition always uses Dutch and English (patterns.mjs).
import fs from "node:fs";
import path from "node:path";
import {
  readStdin, loadSkills, findSkill, globToRegex, logEvent, loadSession, saveSession,
  taskStats, ROOT, levelName, isMicro, microsOf, keywordMap, logTask, pendingTasks, levelAdvice, learnerText,
  settingsOf, codeExtRe, toolingRe, t,
} from "./lib.mjs";
import {
  HINT, SOLUTION, SOLVED_STRONG, SOLVED_WEAK, CODE_CONTEXT, NOT_SOLVED, END, RESUME, ATTEMPT, CHECKING,
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
const st = loadSession(sid);
const ctx = [];

// The learner's last message, so reflect-gate can check an explanation against it.
st.lastPrompt = prompt.slice(0, 4000);
st.lastPromptAt = now;

// ---------- 1. Skill detection ----------
function exerciseDirs(skill) {
  const dirs = [];
  for (const pat of skill.paths ?? []) {
    if (pat.startsWith("**")) continue;
    const literal = pat.split(/[*?]/)[0];
    const parent = literal.includes("/") ? literal.slice(0, literal.lastIndexOf("/")) : "";
    let entries = [];
    try { entries = fs.readdirSync(path.join(ROOT, parent), { withFileTypes: true }); } catch { continue; }
    const re = globToRegex(pat);
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const r = (parent ? parent + "/" : "") + e.name;
      if (re.test(r + "/x.cs")) dirs.push(r);
    }
  }
  return dirs;
}

function detectSkill() {
  const p = prompt.toLowerCase();
  const tag = p.match(/#([a-z]+(?:\.[a-z0-9-]+)+)/);
  if (tag && findSkill(data, tag[1])) return findSkill(data, tag[1]);
  const kw = keywordMap(data);
  const scores = new Map();
  let best = null;
  let activeScore = 0;
  for (const s of data.skills) {
    if (s.kind === "zone") continue;
    let score = 0, byExercise = false;
    for (const d of exerciseDirs(s)) {
      const name = d.split("/").pop().toLowerCase();          // "21-bankrekening"
      const bare = name.replace(/^\d+-/, "");                  // "bankrekening"
      if (p.includes(name) || (bare.length > 4 && (p.includes(bare) || p.includes(bare.replace(/-/g, " "))))) { score += 5; byExercise = true; }
    }
    // Microskill keywords are more specific: they weigh double.
    for (const k of kw[s.id] ?? []) if (k && p.includes(k)) score += isMicro(s) ? 2 : 1;
    scores.set(s.id, score);
    if (s.id === st.activeSkill) activeScore = score;
    if (score > 0 && (!best || score > best.score || (score === best.score && s.id === st.activeSkill))) best = { s, score, byExercise };
  }
  // A parent wins (e.g. by exercise name)? Then prefer its best-matching microskill.
  if (best && !isMicro(best.s)) {
    const m = microsOf(data, best.s.id).map((x) => ({ s: x, score: scores.get(x.id) ?? 0 })).sort((a, b) => b.score - a.score)[0];
    if (m && m.score > 0) best = { ...best, s: m.s };
  }
  // Sticky: a few loose keywords do not switch skills. Staying within the same family is always allowed.
  const active = st.activeSkill ? findSkill(data, st.activeSkill) : null;
  const family = (s) => (isMicro(s) ? s.parent : s.id);
  if (best && active && best.s.id !== active.id && family(best.s) !== family(active) && !best.byExercise && best.score < activeScore + 2) {
    return active;
  }
  return best?.s ?? null;
}

const detected = detectSkill();
if (detected && detected.id !== st.activeSkill) {
  const prev = st.activeSkill ? findSkill(data, st.activeSkill) : null;
  const sameFamily = prev && (prev.id === detected.parent || prev.parent === detected.id || (prev.parent && prev.parent === detected.parent));
  st.activeSkill = detected.id;
  // Another family gets its own ladder (rung back to 0), but maxRung is kept until a task is logged:
  // the help was really given, and a misdetected skill must not erase it (10 Nov 2026: hints for
  // one skill's code were logged under another skill and the tasks showed rung 0).
  if (!sameFamily) { st.rung = 0; st.lastRungAt = null; st.taskStartedAt = now; }
}
const skill = st.activeSkill ? findSkill(data, st.activeSkill) : null;
const level = skill ? skill.level : settings.defaultLevel;

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
const minutes = st.lastRungAt ? Math.round((now - st.lastRungAt) / 60000) : null;
const timerUp = minutes !== null && minutes >= T;
const attemptWhy = changed.length ? t("pg.attemptWhy.changed", { files: changed.slice(0, 2).join(", ") })
  : textAttempt ? t("pg.attemptWhy.text") : "";

// ---------- 3. Outcomes ----------
if (solved && skill) {
  const success = (st.maxRung ?? 0) < 5;
  const mins = Math.round((now - (st.taskStartedAt ?? now)) / 60000);
  const m = st.maxRung ?? 0;
  const tk = logTask({ skill: skill.id, success, maxRung: m, minutes: mins, source: "chat", session: sid });
  const verdict = t(!success ? "pg.verdict.fail" : m <= 2 ? "pg.verdict.ok" : "pg.verdict.help");
  ctx.push(t("pg.taskLogged", { id: skill.id, tid: tk.tid, rung: m, verdict }));
  if (success && m <= 2) {
    const adv = levelAdvice(data, skill);
    ctx.push(t("pg.signal", {
      how: m === 0 ? t("pg.signal.noHint") : t("pg.signal.upTo", { rung: m }),
      advice: adv?.dir === "up" ? t("pg.signal.advice", { text: adv.text, cmd: adv.cmd }) : "",
    }));
  }
  if (!isMicro(skill) && microsOf(data, skill.id).length === 0) ctx.push(t("pg.noMicros", { id: skill.id }));
  st.rung = 0; st.maxRung = 0; st.lastRungAt = null; st.taskStartedAt = now; st.lastTaskAt = now;
}

// ---------- 3b. Explanation check (consolidation) ----------
const pending = pendingTasks();
if (pending.length) {
  const list = pending.slice(-5).map((x) => `${x.skill} [${x.tid}]${x.what ? ` (${x.what})` : ""}`).join("; ");
  ctx.push(t("pg.pending", { list }));
}

// ---------- 4. Hint ladder per level ----------
if (wantsHint && !solved) {
  if (level === "L2") {
    let why = null;
    if (wantsSolution && st.rung >= 4) { st.rung = 5; why = t("pg.why.solutionAfter4"); }
    else if (st.rung === 0) { st.rung = 1; why = t("pg.why.first"); }
    else if (attempt || timerUp) { st.rung = Math.min(st.rung + 1, 4); why = attempt ? attemptWhy : t("pg.why.stuck", { min: minutes, timer: T }); }

    if (why) {
      st.maxRung = Math.max(st.maxRung ?? 0, st.rung);
      st.lastRungAt = now;
      logEvent({ type: "hint-unlock", skill: skill?.id ?? null, rung: st.rung, reason: why, session: sid });
      ctx.push(st.rung === 5 ? t("pg.rung5") : t("pg.unlocked", { rung: st.rung, name: rungName(st.rung), why }));
    } else if (st.rung === 5) {
      ctx.push(t("pg.rung5reached"));
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
} else if (!st.nudged && now - st.startedAt > 60 * 60000) {
  st.nudged = true;
  ctx.push(t("pg.hour"));
}

// ---------- 6. Output ----------
if (skill || wantsHint || ctx.length) {
  const stats = skill ? taskStats(skill.id, 10, isMicro(skill) ? null : data) : null;
  const name = skill ? (isMicro(skill) ? t("pg.head.micro", { id: skill.id, parent: skill.parent }) : skill.id) : null;
  const head = skill
    ? t("pg.head", {
      name, level, levelName: levelName(level), rung: st.rung, rungName: rungName(st.rung),
      stats: stats.n ? t("pg.head.stats", { ok: stats.ok, n: stats.n, pct: Math.round(settings.targetSuccess * 100) }) : t("pg.head.noTasks"),
      pending: stats.pending ? t("pg.head.pending", { n: stats.pending }) : "",
    })
    : t("pg.head.unknown", { level });
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: [head, ...ctx].join("\n") },
  }));
}
saveSession(sid, st);
