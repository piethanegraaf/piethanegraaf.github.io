// PreToolUse guard: the AI may not write, delete, build or test code that belongs
// to a skill at L1-L3. It may also not change the skill record. Only the learner does that.
//
// Matcher: Edit|Write|MultiEdit|NotebookEdit|Bash|PowerShell
//
// The Claude Code adapter of the guard (opencode plan): it turns the tool call on stdin into a host-neutral
// request, asks core/guard.mjs for the decision and writes it in Claude Code's hook format. It decides nothing.
import fs from "node:fs";
import path from "node:path";
import { readStdin, t, ROOT } from "../core/lib.mjs";
import { guard } from "../core/guard.mjs";

let input;
try { input = JSON.parse(await readStdin()); } catch { process.exit(0); }
const tool = input.tool_name ?? "";

const denyOut = (reason) => process.stdout.write(JSON.stringify({
  hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason },
}));

// Claude Code treats a crashed hook as "no objection". So for the tools this guard judges,
// an unexpected error becomes a deny with the error message: fail closed, not open.
const GUARDED = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit", "Bash", "PowerShell"]);
const failClosed = (e) => {
  try {
    if (GUARDED.has(tool) || /^mcp__/.test(tool)) denyOut(t("guard.crash", { error: String(e?.message ?? e).slice(0, 200) }));
  } finally { process.exit(0); }
};
process.on("uncaughtException", failClosed);
process.on("unhandledRejection", failClosed);
const ti = input.tool_input ?? {};

// The text before and after a write, for the TODO(human) rule at L1.
function todoText() {
  if (tool === "Write") {
    let before = "";
    try { before = fs.readFileSync(path.resolve(ROOT, ti.file_path ?? ""), "utf8"); } catch { before = ""; }
    return { before, after: ti.content ?? "" };
  }
  const edits = tool === "MultiEdit" ? (ti.edits ?? []) : [{ old_string: ti.old_string, new_string: ti.new_string ?? ti.new_source }];
  return { before: edits.map((e) => e.old_string ?? "").join("\n"), after: edits.map((e) => e.new_string ?? "").join("\n") };
}

let req;
if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
  req = { kind: "write", tool, file: ti.file_path ?? ti.notebook_path, todo: todoText(), sessionId: input.session_id ?? null };
} else if (tool === "Bash" || tool === "PowerShell") {
  req = { kind: "shell", tool, command: String(ti.command ?? ""), shell: tool === "PowerShell" ? "powershell" : "bash",
    cwd: input.cwd ?? process.cwd(), sessionId: input.session_id ?? null };
} else if (/^mcp__/.test(tool)) {
  req = { kind: "mcp", tool, name: tool, sessionId: input.session_id ?? null };
} else {
  req = { kind: "other", tool };
}

const result = guard(req);
if (result.decision === "deny") denyOut(result.reason);
process.exit(0);
