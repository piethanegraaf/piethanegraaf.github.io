// opencode adapter: session messages (ctx.session.context) to the transcript shapes of the harness.
//
// The gates (prompt-gate, reflect-gate) read a transcript in Claude Code's JSONL format. toClaudeEntries() writes
// opencode's messages in that format, so the same gate code judges both hosts:
//   user                     -> a learner entry (the learner's own words)
//   synthetic, system, skill -> a meta entry (never the learner's words)
//   shell                    -> a meta entry (the learner's own ! run, shown as <bash-input>)
//   assistant                -> an assistant entry with its text and tool calls; the subagent tool becomes Task with
//                               subagent_type, so the demotion analyst is recognised as on Claude Code
//   finished tool            -> a tool_result entry after the assistant entry
// Other message types (compaction, idle, agent or model switches) are left out.
//
// Shapes from opencode's source (packages/schema/src/session-message.ts, dev branch, commit b75b158).

const iso = (ms) => (Number.isFinite(ms) ? new Date(ms).toISOString() : undefined);
const created = (m) => iso(Number(m?.time?.created));
const textOfContent = (content) => (Array.isArray(content) ? content.filter((c) => c?.type === "text").map((c) => c.text).join("\n") : "");

export function toClaudeEntries(messages) {
  const out = [];
  for (const m of messages ?? []) {
    const timestamp = created(m);
    switch (m?.type) {
      case "user":
        out.push({ type: "user", timestamp, origin: { kind: "human" }, message: { role: "user", content: String(m.text ?? "") } });
        break;
      case "synthetic":
      case "system":
      case "skill":
        out.push({ type: "user", timestamp, isMeta: true, message: { role: "user", content: String(m.text ?? "") } });
        break;
      case "shell":
        out.push({ type: "user", timestamp, isMeta: true, message: { role: "user", content: `<bash-input>${String(m.command ?? "")}</bash-input>` } });
        break;
      case "assistant": {
        const parts = [];
        const results = [];
        for (const c of Array.isArray(m.content) ? m.content : []) {
          if (c?.type === "text") parts.push({ type: "text", text: String(c.text ?? "") });
          else if (c?.type === "tool") {
            const input = c.state?.input && typeof c.state.input === "object" ? c.state.input : {};
            const sub = c.name === "subagent";
            parts.push({ type: "tool_use", id: String(c.id ?? ""), name: sub ? "Task" : String(c.name ?? ""),
              input: sub ? { ...input, subagent_type: input.agent ?? input.subagent_type ?? null } : input });
            if (c.state?.status === "completed" || c.state?.status === "error") {
              results.push({ type: "user", timestamp: iso(Number(c.time?.completed ?? c.time?.ended)) ?? timestamp,
                message: { role: "user", content: [{ type: "tool_result", tool_use_id: String(c.id ?? ""), content: textOfContent(c.state.content) }] } });
            }
          }
        }
        out.push({ type: "assistant", timestamp, message: { role: "assistant", content: parts } });
        out.push(...results);
        break;
      }
      default:
        break;
    }
  }
  return out;
}

// The text of the model's last answer (all text parts of the last assistant message).
export function lastAssistantText(messages) {
  for (let i = (messages?.length ?? 0) - 1; i >= 0; i--) {
    const m = messages[i];
    if (m?.type === "assistant") return (Array.isArray(m.content) ? m.content : []).filter((c) => c?.type === "text").map((c) => c.text).join("\n");
    if (m?.type === "user") return "";
  }
  return "";
}

export const toJsonl = (entries) => entries.map((e) => JSON.stringify(e)).join("\n") + (entries.length ? "\n" : "");
