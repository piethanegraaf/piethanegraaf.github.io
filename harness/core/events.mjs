// The core contract (opencode plan): the five events an adapter sends in, and the decisions it gets back.
// Adapters only translate: host input -> one of these events -> core -> decision -> host output.
//
//   SessionStarted   { sid, at, resumed }                                   -> { context, notices }
//   PromptSubmitted  { sid, text, origin, at }                              -> { status, notices }
//   ToolRequested    { sid, agent, kind, paths, commands, diff }            -> { decision: "allow" } | { decision: "deny", reason }
//   TurnEnded        { sid, answer, turn, learnerSinceTask }                -> { notices, continue, logRows, exportText }
//   SessionEnded     { sid, at, reason }                                    -> nothing
//
// Status of the port: ToolRequested is implemented by core/guard.mjs (as a guard request, see there), the
// turn of TurnEnded by core/transcript.mjs, and the static rules of the Security model by core/rules.mjs.
// The other gates still run inside the Claude Code hook scripts and move here one by one.

export const EVENT_KINDS = ["SessionStarted", "PromptSubmitted", "ToolRequested", "TurnEnded", "SessionEnded"];
export const TOOL_KINDS = ["edit", "delete", "shell", "read", "subagent", "other"];

// A ToolRequested event to guard requests (core/guard.mjs): one per path for edits and deletes, one per
// command for shell. The adapter judges them in order and denies on the first deny.
//   diff: { [path]: { before, after } } with the text around TODO(human) (removed and added lines of a patch).
export function toGuardRequests(ev) {
  const base = { tool: ev.tool ?? ev.kind, sessionId: ev.rootSid ?? ev.sid ?? null };
  if (ev.kind === "edit" || ev.kind === "delete") {
    return (ev.paths ?? []).map((file) => ({ ...base, kind: "write", file,
      todo: ev.kind === "delete" ? { before: "", after: "" } : ev.diff?.[file] ?? null }));
  }
  if (ev.kind === "shell") {
    return (ev.commands ?? []).map((command) => ({ ...base, kind: "shell", command, shell: ev.shell ?? "bash", cwd: ev.cwd }));
  }
  return [{ ...base, kind: "other" }];
}
