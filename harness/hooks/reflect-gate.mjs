// Stop hook. Two jobs:
// 1. Read Claude's last answer and process the markers in it (both languages):
//    [trede N] / [rung N]                     -> honest logging of help given (also at L1/L3, where the hook does not unlock rungs)
//    [uitleg-ok <tid>] / [explain-ok <tid>]   -> task counts, but ONLY if the learner's own message also passes checkExplanation()
//    [uitleg-nee <tid>] / [explain-no <tid>]  -> logged; task stays open
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
  applyVerdict, findVerdict, lapseTasks, t,
} from "./lib.mjs";
import { RUNG_MARK, EXPLAIN_MARK } from "./patterns.mjs";

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
for (const m of answer.matchAll(RUNG_MARK)) {
  const n = Number(m[1]);
  if (n > (st.maxRung ?? 0)) {
    st.maxRung = n;
    logEvent({ type: "rung-mark", skill: rungSkill, rung: n, session: sid });
  }
}

const pending = new Map(pendingTasks().map((task) => [task.tid, task]));
st.explainChecked = st.explainChecked ?? [];
for (const m of answer.matchAll(EXPLAIN_MARK)) {
  const verdict = m[1].toLowerCase() === "ok" ? "ok" : "nee";
  const tid = m[2];
  // Evaluate each (marker, learner message) pair once; a new explanation attempt is checked again.
  const key = `${verdict}:${tid}:${promptKey}`;
  if (!pending.has(tid) || st.explainChecked.includes(key)) continue;
  st.explainChecked = [...st.explainChecked.slice(-50), key];
  if (verdict === "nee") { logEvent({ type: "explain-rejected", tid, by: "claude", session: sid }); continue; }
  const chk = checkExplanation(learnerMsg, earlierClaude);
  if (chk.ok) {
    const skillId = pending.get(tid).skill;
    logEvent({ type: "task-explained", tid, skill: skillId, text: String(learnerMsg).slice(0, 600), session: sid });
    pending.delete(tid);
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

// ---------- 1b. Verdict of the demotion analyst (S3a) ----------
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
