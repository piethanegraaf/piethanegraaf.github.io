// opencode adapter: a permission evaluation (ctx.permission.hook("evaluate")) to guard requests of the core.
//
//   edit      resources are the target paths (project-relative inside the project, absolute outside);
//             metadata.files[] = { file, patch, status } carries the unified diff, which gives the text before and
//             after for the TODO(human) rule at L1 (removed and added lines).
//   shell     resources are the subcommands from opencode's scanner, without the working directory. The full command
//             and its cwd come from the shell hook create.before (see recentShell), which runs just before.
//   read-like actions are not judged here (reads are allowed, as on Claude Code).
//   execute   (Code Mode) is denied: nested tools would run outside this mapping.
//   any other action is an MCP tool (<server>_<tool>, resource "*"): denied, unless settings.allowedMcp names it.
//
// Shapes from opencode's source (packages/plugin/src/promise/permission.ts, packages/core/src/file-write.ts,
// packages/core/src/tool/plugin/shell.ts; dev branch, commit b75b158).
import path from "node:path";

export const READ_ACTIONS = new Set(["read", "glob", "grep", "skill", "question", "webfetch", "websearch", "external_directory",
  "subagent", "experimental_image_generate", "opencode_list_mcp_resources", "opencode_read_mcp_resource", "opencode_watch_mcp_event"]);

// The lines a unified diff removes and adds, as text before and after.
export function diffText(patch) {
  const before = [], after = [];
  for (const line of String(patch ?? "").split(/\r?\n/)) {
    if (line.startsWith("---") || line.startsWith("+++") || line.startsWith("@@")) continue;
    if (line.startsWith("-")) before.push(line.slice(1));
    else if (line.startsWith("+")) after.push(line.slice(1));
  }
  return { before: before.join("\n"), after: after.join("\n") };
}

const absolute = (root, p) => (path.isAbsolute(String(p)) || /^[a-zA-Z]:[\\/]/.test(String(p)) ? path.resolve(String(p)) : path.resolve(root, String(p)));
const shellKind = (shell) => (/pwsh|powershell/i.test(String(shell ?? "")) ? "powershell" : "bash");

// { requests, deny } for one evaluation. requests go to core guard() in order; deny is a reason to deny without
// asking the core (Code Mode, an MCP tool). `shell` is the recorded invocation for a shell evaluation, or null.
export function toRequests(ev, { root, rootSid, shell = null, allowedMcp = [] }) {
  const tool = `opencode:${ev.action}`;
  const base = { tool, sessionId: rootSid ?? ev.sessionID ?? null };
  if (ev.action === "edit") {
    const files = Array.isArray(ev.metadata?.files) ? ev.metadata.files : [];
    const byFile = new Map(files.map((f) => [absolute(root, f.file), f]));
    return {
      requests: (ev.resources ?? []).map((r) => {
        const file = absolute(root, r);
        const f = byFile.get(file);
        const todo = !f ? null : f.status === "deleted" ? { before: "x", after: "" } : diffText(f.patch);
        return { ...base, kind: "write", file, todo };
      }),
    };
  }
  if (ev.action === "shell") {
    if (shell) return { requests: [{ ...base, kind: "shell", command: shell.command, shell: shellKind(shell.shell), cwd: shell.cwd }] };
    return { requests: (ev.resources ?? []).map((command) => ({ ...base, kind: "shell", command: String(command), shell: "bash", cwd: root })) };
  }
  if (READ_ACTIONS.has(ev.action)) return { requests: [] };
  if (ev.action === "execute") return { requests: [], deny: "codemode" };
  const allowed = Array.isArray(allowedMcp) ? allowedMcp.map(String) : [];
  if (allowed.includes("*") || allowed.includes(ev.action)) return { requests: [] };
  return { requests: [], deny: "mcp" };
}

// The invocations of the shell hook, newest last: a shell evaluation is matched to the newest one whose command holds
// every scanned subcommand. Entries older than `ttl` ms are dropped.
export function shellLog({ ttl = 30_000, max = 20 } = {}) {
  let items = [];
  const prune = (now) => { items = items.filter((x) => now - x.at <= ttl).slice(-max); };
  return {
    add(inv, now = Date.now()) { items.push({ command: String(inv.command ?? ""), cwd: String(inv.cwd ?? ""), shell: inv.shell, at: now }); prune(now); },
    match(resources, now = Date.now()) {
      prune(now);
      const want = (resources ?? []).map(String).filter(Boolean);
      for (let i = items.length - 1; i >= 0; i--) if (want.length && want.every((r) => items[i].command.includes(r))) return items[i];
      return null;
    },
  };
}

// A static rule of the core (core/rules.mjs) as an opencode permission rule, or null when its glob cannot be
// written in opencode's simpler wildcards (there `*` also matches /). Leaving a rule out is safe: the hook decides.
export function toOpencodeRule(rule, root) {
  let p = String(rule.pattern).split("\\").join("/");
  const rootSlash = path.resolve(root).split("\\").join("/").replace(/\/$/, "");
  if (p.toLowerCase().startsWith(rootSlash.toLowerCase() + "/")) p = p.slice(rootSlash.length + 1);
  const m = p.match(/^(.*)\/\*\*\/\*\.([\w-]+)$/);
  if (m && !m[1].includes("**")) p = `${m[1]}/*.${m[2]}`;
  else if (/\/\*\*$/.test(p) && !p.slice(0, -3).includes("**")) p = `${p.slice(0, -3)}/*`;
  else if (p.includes("**")) return null;
  return { action: rule.action, resource: p, effect: "deny" };
}
