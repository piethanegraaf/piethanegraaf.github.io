// Stop hook. Two jobs:
// 1. Read Claude's last answer from the transcript and process the markers in it:
//    [trede N]          -> honest logging of help given (also at L1/L3, where the hook does not unlock rungs)
//    [uitleg-ok <tid>]  -> task counts, but ONLY if the learner's own message also passes checkExplanation()
//    [uitleg-nee <tid>] -> logged; task stays open
// 2. When the learner said they want to stop, Claude may only finish once the
//    diary entry (with reflection) for this session exists. Blocks at most 2x per stop request.
import fs from "node:fs";
import {
  readStdin, loadSession, saveSession, diaryHasSession, logEvent, pendingTasks, checkExplanation, isLearnerEntry,
} from "./lib.mjs";

let input;
try { input = JSON.parse(await readStdin()); } catch { process.exit(0); }
const sid = input.session_id ?? "onbekend";
const st = loadSession(sid);

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

for (const m of answer.matchAll(/\[trede ([1-5])\]/gi)) {
  const n = Number(m[1]);
  if (n > (st.maxRung ?? 0)) {
    st.maxRung = n;
    logEvent({ type: "rung-mark", skill: st.activeSkill ?? null, rung: n, session: sid });
  }
}

const pending = new Map(pendingTasks().map((t) => [t.tid, t]));
st.explainChecked = st.explainChecked ?? [];
for (const m of answer.matchAll(/\[uitleg-(ok|nee) ([a-z0-9]+)\]/gi)) {
  const [, verdict, tid] = m;
  // Evaluate each (marker, learner message) pair once; a new explanation attempt is checked again.
  const key = `${verdict.toLowerCase()}:${tid}:${st.lastPromptAt ?? 0}`;
  if (!pending.has(tid) || st.explainChecked.includes(key)) continue;
  st.explainChecked = [...st.explainChecked.slice(-50), key];
  if (verdict.toLowerCase() === "nee") { logEvent({ type: "explain-rejected", tid, by: "claude", session: sid }); continue; }
  const chk = checkExplanation(st.lastPrompt ?? "", earlierClaude);
  if (chk.ok) {
    logEvent({ type: "task-explained", tid, skill: pending.get(tid).skill, text: String(st.lastPrompt ?? "").slice(0, 600), session: sid });
  } else {
    logEvent({ type: "explain-rejected", tid, by: "hook", reasons: chk.reasons, session: sid });
    if (!input.stop_hook_active) {
      block(`Leerharnas: je zette [uitleg-ok ${tid}], maar de uitleg van de student haalt de harde check niet: ${chk.reasons.join("; ")}. ` +
        `De taak telt dus NIET. Zeg dat eerlijk tegen de student, noem kort wat er ontbreekt (geen voorzet van de inhoud) ` +
        `en vraag de uitleg opnieuw, in eigen woorden. Zet pas weer [uitleg-ok ${tid}] na een nieuwe uitleg.`);
    }
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
block(`Leerharnas: de student wil stoppen, maar er is nog geen dagboekentry voor deze sessie. ` +
  `Voer de skill /diary uit: stel de 3 reflectievragen, wacht op de antwoorden en neem ze letterlijk over. ` +
  `Zet <!-- sessie: ${sid} --> in de entry. Wil de student niet reflecteren, noteer dan "overgeslagen" (met de marker).`);
