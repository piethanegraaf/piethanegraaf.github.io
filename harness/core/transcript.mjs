// One message shape for both hosts (opencode plan, "Reading the conversation"). Each adapter maps its own
// transcript to a list of messages, one per host entry, in order:
//
//   { role, text, toolCalls: [{ name, agent }], at }
//
// role: "learner"   words the learner typed (agent reports, notifications and reminders left out)
//       "assistant" the model's answer text
//       "notice"    harness or host messages the learner did not type (synthetic, system, meta)
//       "tool"      tool results
//       "shell"     the learner's own ! runs
//       "other"     anything else
// text is the plain text (for a learner message: only the learner's own words). at is ms or null.
// The mapping keeps one message per entry, so an index in the messages is the same index in the host's list.

export const ROLES = ["learner", "assistant", "notice", "tool", "shell", "other"];

export const message = (role, text = "", toolCalls = [], at = null) =>
  ({ role: ROLES.includes(role) ? role : "other", text: String(text ?? ""), toolCalls, at });

// The index of the learner's last message, or -1.
export function lastLearnerIndex(msgs) {
  for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].role === "learner") return i;
  return -1;
}

// The current turn: everything after the learner's last message.
//   answer  the model's text in the turn, plus `lastMessage` when the host gives the final answer separately
//           (Claude Code: last_assistant_message, which may not be in the transcript yet)
//   earlier the model's answers before the learner's last message (for the explanation check)
export function turnOf(msgs, lastMessage = null) {
  const idx = lastLearnerIndex(msgs);
  const answer = [...msgs.slice(idx + 1).filter((m) => m.role === "assistant").map((m) => m.text), lastMessage ?? ""].join("\n");
  const earlier = msgs.slice(0, Math.max(0, idx)).filter((m) => m.role === "assistant").map((m) => m.text);
  return { idx, answer, earlier, learner: idx >= 0 ? msgs[idx] : null };
}

// Did the turn start an agent (the demotion analyst)? Hosts name the tool differently (Task, Agent, subagent);
// the adapter fills `agent` with the agent's name.
export const turnStartedAgent = (msgs, idx, agent) =>
  msgs.slice(idx + 1).some((m) => m.toolCalls.some((c) => c.agent === agent));
