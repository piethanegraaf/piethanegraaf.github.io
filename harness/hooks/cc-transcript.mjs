// Claude Code adapter: its transcript JSONL entries to the shared message shape (core/transcript.mjs).
// One message per entry, so indexes stay the same as in the entries.
import { isLearnerEntry, learnerEntryText, entryText } from "../core/lib.mjs";
import { message } from "../core/transcript.mjs";

const atOf = (e) => { const t = Date.parse(e?.timestamp ?? ""); return Number.isFinite(t) ? t : null; };

function toolCallsOf(e) {
  const c = e?.message?.content;
  if (!Array.isArray(c)) return [];
  return c.filter((p) => p?.type === "tool_use").map((p) => ({ name: String(p.name ?? ""), agent: p.input?.subagent_type ?? null }));
}

export function fromClaudeCode(entries) {
  return (entries ?? []).map((e) => {
    if (e?.type === "assistant") return message("assistant", entryText(e), toolCallsOf(e), atOf(e));
    if (e?.type === "user") {
      if (isLearnerEntry(e)) return message("learner", learnerEntryText(e), [], atOf(e));
      const c = e.message?.content;
      if (Array.isArray(c) && c.some((p) => p?.type === "tool_result")) return message("tool", "", [], atOf(e));
      return message("notice", entryText(e), [], atOf(e));
    }
    return message("other", "", [], atOf(e));
  });
}
