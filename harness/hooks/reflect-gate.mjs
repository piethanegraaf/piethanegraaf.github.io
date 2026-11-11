// Stop hook. Two jobs:
// 1. Read Claude's last answer and process the markers in it (both languages):
//    [trede N] / [rung N]                     -> honest logging of help given (also at L1/L3, where the hook does not unlock rungs)
//    [trede N #id] / [rung N #id]             -> the same, and help about a concept of another family is also logged for
//                                                that concept (concept-help; setup review of 11 Nov, afternoon, #26)
//    [micro-voorstel <id> "titel" "trefwoorden"] -> the harness shows a proposal for a microskill, when this session
//                                                has evidence of real help for that family (#22); "ja, toevoegen" adds it
//    [review-trede N #id] / [review-rung N #id] -> help in a review after a task: only counts for a next task about
//                                                that concept (setup review of 11 Nov, S3); otherwise an ordinary rung
//    [uitleg-ok <tid>] / [explain-ok <tid>]   -> task counts, but ONLY if the learner's own words since the task was
//                                                logged, together, also pass checkExplanation() (S1)
//    [uitleg-nee <tid>] / [explain-no <tid>]  -> logged; task stays open
//    [transfer-start|ok|nee <id>]             -> the transfer task of /mastery-check (setup review §9.4);
//                                                ok only without help since the start AND when the learner's message passes checkExplanation()
//    Right after an explanation that meets a promotion criterion, the harness itself shows the
//    proposal to the learner (§9.2, §9.6). The learner confirms with "ja, doorzetten" (prompt-gate).
// 2. When the learner said they want to stop, Claude may only finish once the
//    diary entry (with reflection) for this session exists. Blocks at most 2x per stop request.
//
// The answer = the text in the transcript after the learner's last message PLUS the field
// last_assistant_message of the Stop input. Claude Code writes the transcript through a queue that
// is flushed every 100 ms and not before this hook, so the last text is often not in the file yet
// (setup review 3.1: 10 of 19 markers were missed). Counting twice is impossible: a rung is only
// logged when it is higher than maxRung, and an explanation marker has a dedupe key.
import {
  readStdin, loadSession, saveSession, sessionExists, diaryHasSession, logEvent, pendingTasks, checkExplanation,
  isLearnerEntry, learnerEntryText, entryText, readTranscript, loadSkills, findSkill, familyIds, autoDemote,
  applyVerdict, findVerdict, lapseTasks, promotionAdvice, offerIsNew, offerText, newWorkSignal, beginNewWork, explanationText,
  noteConceptHelp, checkMicroProposal, microOfferText, readEvents, t,
} from "./lib.mjs";
import { RUNG_MARK, REVIEW_RUNG_MARK, EXPLAIN_MARK, TRANSFER_MARK, MICRO_MARK, parseMicroMark } from "./patterns.mjs";

let input;
try { input = JSON.parse(await readStdin()); } catch { process.exit(0); }
const sid = input.session_id ?? "onbekend";
// No learner prompt in this session yet (prompt-gate creates the file): nothing to judge, and no
// empty session file either (setup review 3.5).
if (!sessionExists(sid)) process.exit(0);
const st = loadSession(sid);
let data = null;
try { data = loadSkills(); } catch { /* messages stay in the default language */ }

// Automatic changes (demotion, verdict of the analyst): shown to the learner now, and passed to
// Claude with the next prompt (st.notices, read by prompt-gate).
const notices = [];
const notice = (m) => { if (m) { notices.push(m); st.notices = [...(st.notices ?? []), m].slice(-10); } };
// A proposal (promotion or transfer task): shown to the learner now, and passed to Claude with the
// next prompt as a proposal the learner answers (st.proposals), not as something already done.
const proposal = (m) => { if (m) { notices.push(m); st.proposals = [...(st.proposals ?? []), m].slice(-5); } };
const block = (reason) => {
  saveSession(sid, st);
  process.stdout.write(JSON.stringify({ decision: "block", reason, ...(notices.length ? { systemMessage: notices.join("\n\n") } : {}) }));
  process.exit(0);
};
const done = () => {
  saveSession(sid, st);
  if (notices.length) process.stdout.write(JSON.stringify({ systemMessage: notices.join("\n\n") }));
  process.exit(0);
};
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

// ---------- 1. Markers in the last answer ----------
const lastMessage = typeof input.last_assistant_message === "string" ? input.last_assistant_message : null;
let entries = readTranscript(input.transcript_path);
// Without the field (older Claude Code): read the transcript again, 3x with 150 ms in between.
if (lastMessage === null) for (let k = 0; k < 3; k++) { sleep(150); entries = readTranscript(input.transcript_path); }

// Only messages the learner typed mark the start of "the last answer"; agent reports, task
// notifications and reminders in between do not (see isLearnerEntry in lib.mjs).
let lastPromptIdx = -1;
for (let i = entries.length - 1; i >= 0; i--) if (isLearnerEntry(entries[i])) { lastPromptIdx = i; break; }
const answer = [...entries.slice(lastPromptIdx + 1).filter((e) => e.type === "assistant").map(entryText), lastMessage ?? ""].join("\n");
const earlierClaude = entries.slice(0, Math.max(0, lastPromptIdx)).filter((e) => e.type === "assistant").map(entryText);
// The explanation is checked against the learner's message in the transcript, not against
// st.lastPrompt: "!" commands skip prompt-gate, so that can be an older prompt (setup review 3.6).
const learner = lastPromptIdx >= 0 ? entries[lastPromptIdx] : null;
const learnerMsg = (learner && learnerEntryText(learner)) ?? st.lastPrompt ?? "";
const promptKey = learner?.uuid ?? st.lastPromptAt ?? 0;

// A rung belongs to the skill of the folder; within that family the (more specific) active skill.
const folder = data && st.folderSkill ? findSkill(data, st.folderSkill) : null;
const rungSkill = folder && !(st.activeSkill && familyIds(data, folder.id).includes(st.activeSkill)) ? folder.id : st.activeSkill ?? null;
const rungMark = (n, extra = {}) => {
  // During a transfer task every hint counts: the transfer only passes without any help (§9.4).
  if (st.transfer) st.transfer.maxRung = Math.max(st.transfer.maxRung ?? 0, n);
  if (n > (st.maxRung ?? 0)) {
    st.maxRung = n;
    logEvent({ type: "rung-mark", skill: rungSkill, rung: n, session: sid, ...extra });
  }
};
// [trede N #id]: the task keeps the rung (honest: it was made with that help), and help about a concept
// of another family is also logged for that concept (#26). Without a valid id it is an ordinary rung.
for (const m of answer.matchAll(RUNG_MARK)) {
  const n = Number(m[1]);
  rungMark(n);
  if (m[2] && data) noteConceptHelp(data, st, m[2], n, { taskSkill: rungSkill, session: sid });
}

// Help in a review after a task: [review-trede N #id] (setup review of 11 Nov, S3/S16). It counts as
// review help only right after a logged task, without a signal of new work since, and with a concept
// id from skills.json. Then it does not raise st.maxRung: it only counts for the next task when that
// task is about the same concept. Otherwise it is an ordinary [trede N] (the cautious side).
const reviewMarks = [...answer.matchAll(REVIEW_RUNG_MARK)];
if (reviewMarks.length && st.lastTask && data) {
  const why = newWorkSignal(data, st, { scanCode: true });
  if (why) beginNewWork(st, why, { session: sid });
}
for (const m of reviewMarks) {
  const n = Number(m[1]);
  const concept = m[2] && data ? findSkill(data, m[2]) : null;
  if (!concept || concept.kind === "zone" || !st.lastTask) { rungMark(n, { review: true }); continue; }
  if (st.transfer) st.transfer.maxRung = Math.max(st.transfer.maxRung ?? 0, n);
  st.reviewHelp = st.reviewHelp ?? [];
  const before = st.reviewHelp.filter((r) => r.skill === concept.id).reduce((a, r) => Math.max(a, r.rung), 0);
  if (n > before) {
    st.reviewHelp.push({ skill: concept.id, rung: n, at: Date.now() });
    logEvent({ type: "review-help", skill: concept.id, rung: n, reviewOf: st.lastTask.tid, session: sid });
  }
}

const pending = new Map(pendingTasks().map((task) => [task.tid, task]));
st.explainChecked = st.explainChecked ?? [];
const explainedSkills = new Set();
for (const m of answer.matchAll(EXPLAIN_MARK)) {
  const verdict = m[1].toLowerCase() === "ok" ? "ok" : "nee";
  const tid = m[2];
  // Evaluate each (marker, learner message) pair once; a new explanation attempt is checked again.
  const key = `${verdict}:${tid}:${promptKey}`;
  if (!pending.has(tid) || st.explainChecked.includes(key)) continue;
  st.explainChecked = [...st.explainChecked.slice(-50), key];
  if (verdict === "nee") { logEvent({ type: "explain-rejected", tid, by: "claude", session: sid }); continue; }
  // All of the learner's own messages since the task was logged, judged together (setup review of
  // 11 Nov, S1): the same requirements, on the whole answer instead of the last message only.
  const text = explanationText(st, tid, learnerMsg);
  const chk = checkExplanation(text, earlierClaude);
  if (chk.ok) {
    const skillId = pending.get(tid).skill;
    logEvent({ type: "task-explained", tid, skill: skillId, text: text.slice(0, 1000), session: sid });
    if (st.explainWords) delete st.explainWords[tid];
    pending.delete(tid);
    explainedSkills.add(skillId);
    // Explained tasks are the evidence for automatic demotion (S3): a microskill goes down now,
    // for a parent the demotion analyst decides first.
    if (data) {
      const r = autoDemote(data, skillId);
      for (const m of r?.messages ?? []) notice(m);
      if (r?.pending && !st.demotionPending) { st.demotionPending = r.pending; logEvent({ type: "demotion-pending", skill: r.pending.skill, tids: r.pending.tids, session: sid }); }
    }
  } else {
    logEvent({ type: "explain-rejected", tid, by: "hook", reasons: chk.reasons, session: sid });
    if (!input.stop_hook_active) block(t("rg.badExplain", { tid, reasons: chk.reasons.join("; ") }));
  }
}

// ---------- 1a. Transfer task (/mastery-check, setup review §9.4) ----------
// [transfer-start <id>] starts it (only on L2 or L3). From then on every [trede N] counts against
// it. [transfer-ok <id>] passes it only without any help and when the learner's own message (the
// answers to the why-questions) passes the same check as an explanation. [transfer-nee <id>] ends it.
// A refused marker blocks only after the proposals (1b), so a proposal from the same turn is not lost.
let transferBlock = null;
for (const m of answer.matchAll(TRANSFER_MARK)) {
  const kind = m[1].toLowerCase(), s = data ? findSkill(data, m[2]) : null;
  const key = `transfer:${kind}:${m[2]}:${promptKey}`;
  if (!s || s.kind === "zone" || st.explainChecked.includes(key)) continue;
  st.explainChecked = [...st.explainChecked.slice(-50), key];
  if (kind === "start") {
    if (!["L2", "L3"].includes(s.level)) {
      logEvent({ type: "transfer-rejected", skill: s.id, why: "level", level: s.level, session: sid });
      transferBlock = transferBlock ?? t("rg.transferLevel", { id: s.id, level: s.level });
      continue;
    }
    st.transfer = { skill: s.id, startedAt: Date.now(), maxRung: 0 };
    logEvent({ type: "transfer-start", skill: s.id, session: sid });
    continue;
  }
  if (st.transfer?.skill !== s.id) continue;
  if (kind === "ok") {
    const rung = st.transfer.maxRung ?? 0;
    if (rung > 0) {
      logEvent({ type: "transfer-failed", skill: s.id, why: "help", rung, session: sid });
      st.transfer = null;
      notice(t("rg.transferHelp", { id: s.id, rung }));
      continue;
    }
    const chk = checkExplanation(learnerMsg, earlierClaude);
    if (!chk.ok) {
      logEvent({ type: "transfer-rejected", skill: s.id, why: "explanation", reasons: chk.reasons, session: sid });
      transferBlock = transferBlock ?? t("rg.transferBad", { id: s.id, reasons: chk.reasons.join("; ") });
      continue;
    }
    logEvent({ type: "transfer-passed", skill: s.id, text: String(learnerMsg).slice(0, 600), session: sid });
    st.transfer = null;
    notice(t("rg.transferPassed", { id: s.id }));
    explainedSkills.add(s.id);
  } else {
    logEvent({ type: "transfer-failed", skill: s.id, why: "claude", session: sid });
    st.transfer = null;
    notice(t("rg.transferFailed", { id: s.id }));
  }
}

// ---------- 1b. Promotion proposal right after the explanation (setup review §9.2, §9.6) ----------
// The harness shows it to the learner itself, with the evidence. Promoting stays the learner's
// decision: prompt-gate only promotes on the learner's own "ja, doorzetten".
if (data) {
  const seen = new Set();
  for (const id of explainedSkills) {
    const s = findSkill(data, id);
    for (const x of [s, s?.parent ? findSkill(data, s.parent) : null]) {
      if (!x || seen.has(x.id)) continue;
      seen.add(x.id);
      const a = promotionAdvice(data, x);
      if (!a || !offerIsNew(x, a)) continue;
      if (a.dir === "up") {
        const text = offerText(a);
        proposal(text);
        st.lastOffer = { skill: x.id, from: a.from, to: a.to, lastTid: a.lastTid, fresh: true };
      } else proposal(t("offer.transfer", { text: a.text, show: a.show }));
      logEvent({ type: "promotion-offered", skill: x.id, from: x.level, to: a.to ?? "transfer", lastTid: a.lastTid, session: sid });
    }
  }
}

// ---------- 1d. Proposal for a microskill (setup review of 11 Nov, afternoon, #22) ----------
// Claude names it; the harness checks the marker and the evidence of this session, and shows it to
// the learner. Only the learner's own "ja, toevoegen" adds it (prompt-gate). A proposal that is still
// open, or that the learner declined in this session, is not shown again.
let microBlock = null;
if (data) {
  for (const m of answer.matchAll(MICRO_MARK)) {
    const key = `micro:${m[1].trim()}:${promptKey}`;
    if (st.explainChecked.includes(key)) continue;
    st.explainChecked = [...st.explainChecked.slice(-50), key];
    const r = checkMicroProposal(data, sid, parseMicroMark(m[1]));
    if (!r.ok) {
      logEvent({ type: "micro-rejected", marker: m[0].slice(0, 200), why: r.error, session: sid });
      microBlock = microBlock ?? t("rg.microBad", { error: r.error });
      continue;
    }
    const o = r.offer;
    const open = Array.isArray(st.microOffers) ? st.microOffers : [];
    if (open.some((x) => x.id === o.id)) continue;
    if (readEvents().some((e) => e.type === "micro-declined" && e.skill === o.id && e.session === sid)) continue;
    st.microOffers = [...open, { ...o, fresh: true, at: Date.now() }].slice(-3);
    proposal(microOfferText(data, o));
    logEvent({ type: "micro-offered", skill: o.id, parent: o.parent, level: o.level, title: o.title, keywords: o.keywords, evidence: o.why.kind, rung: o.why.rung, session: sid });
  }
}
if (transferBlock && !input.stop_hook_active) block(transferBlock);
if (microBlock && !input.stop_hook_active) block(microBlock);

// ---------- 1c. Verdict of the demotion analyst (S3a) ----------
// Only with a pending demotion, and only when the agent demonstrably ran in this turn.
if (st.demotionPending && data) {
  const found = findVerdict(answer);
  if (found) {
    const turn = entries.slice(lastPromptIdx + 1);
    const agentRan = turn.some((e) => e.type === "assistant" && Array.isArray(e.message?.content) && e.message.content.some((p) =>
      p.type === "tool_use" && ["Task", "Agent"].includes(p.name) && p.input?.subagent_type === "demotie-analist"));
    if (!agentRan) {
      logEvent({ type: "demotion-rejected", why: "no-agent", session: sid });
      if (!input.stop_hook_active) block(t("rg.verdictNoAgent"));
    } else {
      const r = found.json ? applyVerdict(data, st.demotionPending, found.json) : { ok: false, error: found.error };
      if (r.ok) { r.messages.forEach(notice); st.demotionPending = null; }
      else {
        logEvent({ type: "demotion-rejected", why: r.error, session: sid });
        if (!input.stop_hook_active) block(t("rg.verdictBad", { error: r.error }));
      }
    }
  }
}

// ---------- 2. End of session: diary ----------
if (input.stop_hook_active || !st.endRequested) done();

if (diaryHasSession(sid)) {
  // The session ends: explanations are only asked right away, so open tasks lapse now (S1). A
  // pending demotion that the analyst did not judge in this session changes nothing (S3a).
  lapseTasks("session-end", (x) => x.session && x.session !== sid, sid);
  st.demotionPending = null;
  st.endRequested = false;
  done();
}

// Never nag endlessly: at most 2 blocks per stop request.
st.reflectBlocks = (st.reflectBlocks ?? 0) + 1;
if (st.reflectBlocks > 2) { st.endRequested = false; st.reflectBlocks = 0; done(); }
logEvent({ type: "reflect-block", session: sid });
block(t("rg.diary", { sid }));
