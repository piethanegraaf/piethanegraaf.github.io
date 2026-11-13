// User-level gate for graded work (review of 13 Nov, night, #61). Installed with
// `node harness/install.mjs <folder> --user-guard` into ~/.claude/leerharnas/, and registered in
// ~/.claude/settings.json, so it runs in EVERY project. It only acts on the graded work named in
// ~/.claude/leerharnas/graded.json, and only in projects outside it (inside, the project's own harness rules).
//
//   UserPromptSubmit: a prompt that names the graded work (its full path, its folder name, or one of the
//                     names in the config, such as the solution) is blocked: "this belongs in a session there".
//   PreToolUse:       every tool on a path of the graded work is denied, reading too (Read, Grep, Glob, a shell
//                     command that names it). Allowed: the setup itself, .claude/ and CLAUDE.md in the graded
//                     folder, and the installer of the harness with the folder as its target.
//
// No dependencies and no record: other projects have no harness. Errors fail closed only when the input names
// the graded work; otherwise this gate stays out of the way of every other project.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const CONFIG = path.join(os.homedir(), ".claude", "leerharnas", "graded.json");
const norm = (p) => String(p ?? "").replace(/\\+/g, "/").replace(/^\/([a-zA-Z])\//, "$1:/").replace(/\/+$/, "").toLowerCase();
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function readStdin() {
  return new Promise((resolve) => {
    let s = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (d) => { s += d; });
    process.stdin.on("end", () => resolve(s));
  });
}

let cfg;
try { cfg = JSON.parse(fs.readFileSync(CONFIG, "utf8")); } catch { process.exit(0); }
const bases = (Array.isArray(cfg?.paths) ? cfg.paths : []).filter((x) => typeof x === "string" && x.trim()).map(norm);
if (!bases.length) process.exit(0);
const names = [...new Set([...bases.map((b) => b.split("/").pop()), ...(Array.isArray(cfg.names) ? cfg.names : []).map((n) => String(n).toLowerCase())])]
  .filter((n) => n.length >= 5);
const msg = (key, fallback) => (typeof cfg.messages?.[key] === "string" ? cfg.messages[key] : fallback);
const home = norm(os.homedir());

const inside = (abs, base) => abs === base || abs.startsWith(base + "/");
// The part of a path below a graded folder, "" for the folder itself, or null when it is not in one.
function tailOf(p) {
  const a = norm(p);
  for (const b of bases) if (inside(a, b)) return a.slice(b.length).replace(/^\//, "");
  return null;
}
// The setup itself may be read and changed from elsewhere (#61): .claude/ and CLAUDE.md of the graded folder.
const setupTail = (tail) => tail === "claude.md" || tail === ".claude" || tail.startsWith(".claude/");

// Every place in a text where it names graded work, with what follows: { tail } per occurrence.
function occurrences(text) {
  let s = String(text ?? "").replace(/\\+/g, "/").toLowerCase();
  s = s.replace(/(^|[\s"'=(])~\//g, `$1${home}/`).replace(/(^|[\s"'=(])\$home\//g, `$1${home}/`).replace(/(^|[\s"'=(])\/([a-z])\//g, "$1$2:/");
  const out = [];
  const tailAt = (i) => (s.slice(i).match(/^\/([^\s"'`|;&<>)]*)/)?.[1] ?? "").replace(/\/+$/, "");
  for (const b of bases) {
    for (let i = s.indexOf(b); i !== -1; i = s.indexOf(b, i + 1)) {
      const end = i + b.length;
      if (end < s.length && !/[\s"'`/|;&<>)]/.test(s[end])) continue;
      out.push({ tail: tailAt(end) });
    }
  }
  for (const n of names) {
    const re = new RegExp(`(^|[^\\p{L}\\p{N}_.-])${escapeRe(n)}(?=$|[^\\p{L}\\p{N}_-])`, "gu");
    for (const m of s.matchAll(re)) {
      const end = m.index + m[0].length;
      // Already counted as part of a full path.
      if (bases.some((b) => s.slice(Math.max(0, end - b.length), end) === b)) continue;
      out.push({ tail: tailAt(end) });
    }
  }
  return out;
}

function deny(reason) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason } }));
  process.exit(0);
}

let raw = "";
try {
  raw = await readStdin();
  const input = JSON.parse(raw);
  const project = norm(input.cwd ?? process.env.CLAUDE_PROJECT_DIR ?? process.cwd());
  // In the graded project itself its own harness decides.
  if (bases.some((b) => inside(project, b))) process.exit(0);
  const event = input.hook_event_name;
  const blockText = msg("prompt", "Leerharnas: deze vraag gaat over beoordeeld werk. Stel hem in een sessie in die map zelf.");
  const denyText = msg("tool", "Leerharnas: beoordeeld werk is dicht vanuit een andere map.");

  if (event === "UserPromptSubmit") {
    if (occurrences(input.prompt).length) {
      process.stdout.write(JSON.stringify({ decision: "block", reason: blockText }));
    }
    process.exit(0);
  }
  if (event === "PreToolUse") {
    const ti = input.tool_input ?? {};
    const cwd = input.cwd ?? process.cwd();
    for (const k of ["file_path", "notebook_path", "path"]) {
      if (typeof ti[k] !== "string" || !ti[k]) continue;
      const tail = tailOf(path.resolve(cwd, ti[k].replace(/^\/([a-zA-Z])\//, "$1:/")));
      if (tail !== null && !setupTail(tail)) deny(denyText);
    }
    // A glob or pattern that names the folder (Glob, Grep), and every other text field such as a shell command.
    for (const k of Object.keys(ti)) {
      if (["file_path", "notebook_path", "path"].includes(k) || typeof ti[k] !== "string") continue;
      const occ = occurrences(ti[k]);
      if (!occ.length) continue;
      const installer = k === "command" && /\binstall\.mjs\b/i.test(ti[k]);
      if (occ.some((o) => !(setupTail(o.tail) || (installer && o.tail === "")))) deny(denyText);
    }
    // A command run with its working folder inside the graded work ("cd" in an earlier command).
    if (typeof ti.command === "string" && tailOf(cwd) !== null) deny(denyText);
  }
  process.exit(0);
} catch {
  // Fail closed only when the input is about the graded work.
  if (raw && occurrences(raw).length) deny(msg("tool", "Leerharnas: beoordeeld werk is dicht vanuit een andere map."));
  process.exit(0);
}
