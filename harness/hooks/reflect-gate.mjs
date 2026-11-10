// Stop hook. Two jobs:
// 1. Read Claude's last answer from the transcript and process the markers in it (both languages):
//    [trede N] / [rung N]                     -> honest logging of help given (also at L1/L3, where the hook does not unlock rungs)
//    [uitleg-ok <tid>] / [explain-ok <tid>]   -> task counts, but ONLY if the learner's own message also passes checkExplanation()
//    [uitleg-nee <tid>] / [explain-no <tid>]  -> logged; task stays open
// 2. When the learner said they want to stop, Claude may only finish once the
//    diary entry (with reflection) for this session exists. Blocks at most 2x per stop request.
import fs from "node:fs";
import {
  readStdin, loadSession, saveSession, diaryHasSession, logEvent, pendingTasks, checkExplanation, isLearnerEntry,
  loadSkills, t,
} from "./lib.mjs";
import { RUNG_MARK, EXPLAIN_MARK } from "./patterns.mjs";

let input;
try { input = JSON.parse(await readStdin()); } catch { process.exit(0); }
const sid = input.session_id ?? "onbekend";
const st = loadSession(sid);
try { loadSkills(); } catch { /* messages stay in the default language */ }

const block = (reason) => {
  saveSession(sid, st);
  process.stdout.write(JSON.stringify({ decision: "block", reason }));
  process.exit(0);
};

// ---------- 1. Markers in the last answer ----------
function readTranscript(p) {
  try {
    return fs.readFileSync(p, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}
const textOf = (e) => {
  const c = e?.message?.content;
  if (typeof c === "string") return c;
  return Array.isArray(c) ? c.filter((p) => p.type === "text").map((p) => p.text).join("\n") : "";
};
// Only messages the learner typed mark the start of "the last answer"; agent reports, task
// notifications and reminders in between do not (see isLearnerEntry in lib.mjs).
const entries = readTranscript(input.transcript_path);
let lastPromptIdx = -1;
for (let i = entries.length - 1; i >= 0; i--) if (isLearnerEntry(entries[i])) { lastPromptIdx = i; break; }
const answer = entries.slice(lastPromptIdx + 1).filter((e) => e.type === "assistant").map(textOf).join("\n");
const earlierClaude = entries.slice(0, Math.max(0, lastPromptIdx)).filter((e) => e.type === "assistant").map(textOf);

for (const m of answer.matchAll(RUNG_MARK)) {
  const n = Number(m[1]);
  if (n > (st.maxRung ?? 0)) {
    st.maxRung = n;
    logEvent({ type: "rung-mark", skill: st.activeSkill ?? null, rung: n, session: sid });
  }
}

const pending = new Map(pendingTasks().map((task) => [task.tid, task]));
st.explainChecked = st.explainChecked ?? [];
for (const m of answer.matchAll(EXPLAIN_MARK)) {
  const verdict = m[1].toLowerCase() === "ok" ? "ok" : "nee";
  const tid = m[2];
  // Evaluate each (marker, learner message) pair once; a new explanation attempt is checked again.
  const key = `${verdict}:${tid}:${st.lastPromptAt ?? 0}`;
  if (!pending.has(tid) || st.explainChecked.includes(key)) continue;
  st.explainChecked = [...st.explainChecked.slice(-50), key];
  if (verdict === "nee") { logEvent({ type: "explain-rejected", tid, by: "claude", session: sid }); continue; }
  const chk = checkExplanation(st.lastPrompt ?? "", earlierClaude);
  if (chk.ok) {
    logEvent({ type: "task-explained", tid, skill: pending.get(tid).skill, text: String(st.lastPrompt ?? "").slice(0, 600), session: sid });
  } else {
    logEvent({ type: "explain-rejected", tid, by: "hook", reasons: chk.reasons, session: sid });
    if (!input.stop_hook_active) block(t("rg.badExplain", { tid, reasons: chk.reasons.join("; ") }));
  }
}

// ---------- 2. End of session: diary ----------
if (input.stop_hook_active || !st.endRequested) { saveSession(sid, st); process.exit(0); }

if (diaryHasSession(sid)) {
  st.endRequested = false;
  saveSession(sid, st);
  process.exit(0);
}

// Never nag endlessly: at most 2 blocks per stop request.
st.reflectBlocks = (st.reflectBlocks ?? 0) + 1;
if (st.reflectBlocks > 2) { st.endRequested = false; st.reflectBlocks = 0; saveSession(sid, st); process.exit(0); }
logEvent({ type: "reflect-block", session: sid });
block(t("rg.diary", { sid }));
