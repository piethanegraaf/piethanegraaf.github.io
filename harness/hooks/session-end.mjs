// SessionEnd (review of 13 Nov, night, #56): when a session closes (exit, /clear, logout), the harness notes
// when, and whether there was work without a diary entry. The next start offers a short catch-up diary for
// such a session (session-start.mjs). This hook asks nothing and blocks nothing: the session is already over.
import { readStdin, sessionExists, loadSession, saveSession, logEvent, diaryHasSession, sessionWork } from "./lib.mjs";

let input = {};
try { input = JSON.parse(await readStdin()); } catch { process.exit(0); }
const sid = input.session_id;
if (!sid || !sessionExists(sid)) process.exit(0);
try {
  const st = loadSession(sid);
  const diary = diaryHasSession(sid, { all: true });
  const work = sessionWork(sid, st);
  st.endedAt = Date.now();
  st.endReason = typeof input.reason === "string" ? input.reason.slice(0, 40) : null;
  saveSession(sid, st);
  logEvent({ type: "session-end", reason: st.endReason, diary, work: work.has, session: sid });
} catch { /* never fail at the end of a session */ }
process.exit(0);
