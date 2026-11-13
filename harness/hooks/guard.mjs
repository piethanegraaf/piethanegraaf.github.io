// PreToolUse guard: the AI may not write, delete, build or test code that belongs
// to a skill at L1-L3. It may also not change the skill record. Only the learner does that.
//
// Matcher: Edit|Write|MultiEdit|NotebookEdit|Bash|PowerShell
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  readStdin, loadSkills, levelForPath, skillForPath, isOverrideActive, logEvent, rel, isHarnessPath,
  codeExtRe, buildRes, PROTECTED, levelName, t, ROOT, isRecordFile, gradedOf, isGradedPath, isGradedDir, mentionsGraded, protectedDirOf, holdsProtected,
  loadSession, saveSession,
} from "./lib.mjs";
import { parseCommand, commandName } from "./shell.mjs";

// Learner code (settings.codeExtensions) and build commands (settings.buildCommands): see lib.mjs.
// Only commands that build, run or test code (or change the project) are blocked.
// Information commands such as `dotnet --list-sdks` or `dotnet --info` are tooling (L4) and allowed.
// A shell command is split into its simple commands first (shell.mjs), and each one is judged by
// the program it runs: "msbuild" in a grep pattern is not a build (setup review 3.4).
const WRITE_PROGRAMS = new Set(["cp", "mv", "rm", "del", "erase", "copy", "move", "ren", "rename", "tee", "touch", "truncate", "dd",
  "set-content", "sc", "add-content", "ac", "out-file", "new-item", "ni", "copy-item", "cpi", "move-item", "mi",
  "remove-item", "ri", "rename-item", "rni", "clear-content", "clc", "install", "rsync", "ln", "unzip", "tar"]);
// A command that writes the files it names (not counting redirects, which have their own targets).
function writesFiles(argv, raw) {
  const name = commandName(argv[0]);
  if (WRITE_PROGRAMS.has(name)) return true;
  if (name === "sed" && argv.some((a) => /^-[a-z]*i/i.test(a) || a === "--in-place")) return true;
  if (name === "perl" && argv.some((a) => /^-[a-z]*i/.test(a))) return true;
  // "git stash list" and "git stash show" only read (review of 13 Nov, night, #60).
  if (name === "git" && /^stash$/i.test(argv[1] ?? "") && /^(list|show)$/i.test(argv[2] ?? "")) return false;
  if (name === "git" && /^(checkout|restore|reset|stash|apply|rm|mv|clean)$/i.test(argv[1] ?? "")) return true;
  return /WriteAll(Text|Lines|Bytes)|\bAppendAll(Text|Lines)\b/i.test(raw);
}
// Everything except list/status changes the learner's record. RECORD_CMD is only a first, textual check; the
// decision is made on the parsed words (security review of 13 Nov, V1: a quoted subcommand passed the regex).
const RECORD_CMD = /skill\.mjs["']?\s+(set|review|override|untask|correct|add-micro|add|done|setting|paths|replay)\b/i;
const CLI_READ = new Set(["list", "status", "since-export"]);
// The scripts in .claude/hooks/ that Claude may run itself: the CLI (read commands only), the test runner (a
// build, judged below) and the scaffold of graded work. Every other hook script changes state when run by hand.
const HOOK_SCRIPTS_RUNNABLE = new Set(["skill.mjs", "check.mjs", "scaffold.mjs"]);
// Programs that delete or move the paths they name (security review V3): a folder that holds the harness or the
// record may not be one of them. For a move, only the sources count (the last word is where it goes).
const DELETES = new Set(["rm", "rmdir", "rd", "del", "erase", "remove-item", "ri", "unlink"]);
const MOVES = new Set(["mv", "move", "move-item", "mi", "ren", "rename", "rename-item", "rni"]);
const TODO = "TODO(human)";
const CD = new Set(["cd", "pushd", "set-location", "sl", "chdir", "push-location"]);
const NOWHERE = /^(\/dev\/null|\$null|nul)$/i;
// An allowed program (second setup review of 11 Nov, S8): the dashboard export of the harness repo,
// `node <repo or its worktree>/harness/export.mjs <practice folder> [--dry-run]`, run from a practice
// session after /diary (skill update-dashboard). It reads the record, writes the dashboard data in the
// repo, and here only the mark .learning/state/last-export.json (a moment and three totals). It changes
// no level, task or event. So it is no build of learner code (also not when settings.buildCommands has
// node) and no write to the record. Only a script outside this project counts, and never --out into it.
const EXPORT_SCRIPT = /(^|[\\/])harness[\\/]export\.mjs$/i;
// Graded work (setup of 13 Nov, #49, #54): in settings.graded.paths Claude writes nothing, at no level and
// with no override, also outside this project. Besides the programs above, these also change files there.
const GRADED_WRITE_PROGRAMS = new Set(["mkdir", "md", "rmdir", "rd", "patch", "unlink", "chmod", "attrib", "robocopy", "xcopy", "7z"]);
// git commands that only read. Every other git command (add, commit, push, switch, init ...) changes the repo.
const GIT_READ = new Set(["status", "log", "diff", "show", "blame", "grep", "ls-files", "ls-tree", "rev-parse", "describe",
  "shortlog", "reflog", "cat-file", "help", "version", "--version"]);
// Subcommands that only read with some arguments (review of 13 Nov, night, #60): "git remote -v" was refused
// as a write in graded work. `rest` = the arguments after the subcommand.
function gitReadOnly(sub, rest) {
  if (GIT_READ.has(sub)) return true;
  const flagsIn = (allowed) => rest.every((a) => allowed.includes(a));
  if (sub === "remote") {
    const r = rest.filter((a) => a !== "-v" && a !== "--verbose");
    return !r.length || r[0] === "show" || r[0] === "get-url";
  }
  if (sub === "branch") {
    const flags = ["-a", "--all", "-r", "--remotes", "--list", "-l", "--show-current", "-v", "-vv", "--verbose", "--no-color"];
    // With --list a pattern may follow; without it, a name creates a branch.
    return flagsIn(flags) || (rest.some((a) => a === "--list" || a === "-l") && rest.every((a) => flags.includes(a) || !/^-/.test(a)));
  }
  if (sub === "config") return rest.some((a) => ["--get", "--get-all", "--get-regexp", "--list", "-l"].includes(a));
  if (sub === "stash") return rest[0] === "list" || rest[0] === "show";
  if (sub === "tag") return !rest.length || rest[0] === "-l" || rest[0] === "--list";
  return false;
}
// Deterministic tooling that graded work allows (review of 13 Nov, night, #55): a generator or a fixed command
// makes the content, not the AI. Only these; Write and Edit stay blocked there, and so do git commit and push
// (version control is graded) and the pipeline or Dockerfile (written by the student). Every allowed command
// becomes a row "tooling (no AI content)" in the AI-use log. Returns the command for the log, or null.
const TOOLING_TEMPLATES = new Set(["sln", "console", "classlib", "nunit", "xunit", "gitignore"]);
function gradedTooling(name, args, redirects, cwd) {
  if (redirects.length) return null;
  // --force overwrites files that already exist, so a generator with it is not plain scaffolding.
  if (args.some((a) => /^--force$/i.test(a))) return null;
  const words = args.filter((a) => !/^-/.test(a));
  if (name === "dotnet") {
    const sub = (args[0] ?? "").toLowerCase();
    if (sub === "new") return TOOLING_TEMPLATES.has((words[1] ?? "").toLowerCase()) ? "dotnet" : null;
    if (sub === "sln" && words.map((w) => w.toLowerCase()).includes("add")) return "dotnet";
    if (sub === "add" && words.some((w) => /^(reference|package)$/i.test(w))) return "dotnet";
    return null;
  }
  if (name === "git") {
    let k = 0;
    while (k < args.length && /^-/.test(args[k])) k += /^-(C|c)$/.test(args[k]) || /^--(git-dir|work-tree)$/.test(args[k]) ? 2 : 1;
    const sub = (args[k] ?? "").toLowerCase(), next = args[k + 1] ?? "";
    if (sub === "init") return "git";
    if (sub === "remote" && next === "add") return "git";
    if (sub === "branch" && ["-m", "-M", "--move"].includes(next)) return "git";
    return null;
  }
  if (name === "mkdir" || name === "md") return name;
  // The scaffold script of this harness only (.claude/hooks/scaffold.mjs, protected like every hook): a script
  // with that name elsewhere could be written by Claude itself.
  if (name === "node") {
    const script = args.find((a) => !/^-/.test(a));
    if (script && path.resolve(cwd, script).toLowerCase() === path.join(ROOT, ".claude", "hooks", "scaffold.mjs").toLowerCase()) return "scaffold";
  }
  return null;
}
// Programs that run code given inline (node -e, python -c ...): the guard cannot see which files it writes.
const INLINE_CODE = [["node", /^(-e|--eval|-p|--print)$/], ["deno", /^eval$/], ["python", /^-c$/], ["python3", /^-c$/], ["py", /^-c$/],
  ["ruby", /^-e$/], ["perl", /^-e$/], ["php", /^-r$/]];

function deny(reason, event) {
  logEvent({ type: "deny", ...event, reason });
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason },
  }));
  process.exit(0);
}

const count = (s, sub) => (s ? String(s).split(sub).length - 1 : 0);

function describe(level, skill) {
  const name = skill ? `'${skill.title}' (${skill.id})` : t("guard.unmapped");
  return t("guard.describe", { name, level, levelName: levelName(level) });
}

function protectedReason(level, skill, what) {
  return t("guard.protected", { what, describe: describe(level, skill), advice: t(`guard.advice.${level}`), id: skill ? skill.id : "*" });
}

let input;
try { input = JSON.parse(await readStdin()); } catch { process.exit(0); }
const tool = input.tool_name ?? "";

// Claude Code treats a crashed hook as "no objection". So for the tools this guard judges,
// an unexpected error becomes a deny with the error message: fail closed, not open.
const GUARDED = new Set(["Edit", "Write", "MultiEdit", "NotebookEdit", "Bash", "PowerShell"]);
const failClosed = (e) => {
  try {
    if (GUARDED.has(tool)) {
      process.stdout.write(JSON.stringify({ hookSpecificOutput: {
        hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: t("guard.crash", { error: String(e?.message ?? e).slice(0, 200) }) } }));
    }
  } finally { process.exit(0); }
};
process.on("uncaughtException", failClosed);
process.on("unhandledRejection", failClosed);
const ti = input.tool_input ?? {};

let data;
try {
  data = loadSkills();
} catch {
  // Fail closed for code: if the record is unreadable, all project code counts as L2.
  data = { settings: { defaultLevel: "L2" }, skills: [] };
}
const CODE_EXT = codeExtRe(data);
const BUILD_RES = buildRes(data);
const GRADED = gradedOf(data);
// A path for the log: project-relative, or with ~ for the home folder (never the full home path).
const shown = (p) => rel(p) ?? String(p).split(os.homedir()).join("~");
const gradedDeny = (what, event) => deny(t("guard.graded", { what, max: GRADED.maxRung, level: GRADED.aiLevel }), { ...event, graded: true });

// 1) The skill record and state belong to the learner (also a record in another folder, learningDir #53).
if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
  const file = ti.file_path ?? ti.notebook_path;
  if (isRecordFile(file)) {
    deny(t("guard.recordFile"), { tool, file: shown(file) });
  }
  if (isHarnessPath(rel(file))) deny(t("guard.harness"), { tool, file: rel(file) });
  // 2) Graded work: every file, inside or outside this project (#54), whatever the level.
  if (file && isGradedPath(data, file, ROOT, GRADED)) gradedDeny(t("guard.what.gradedWrite", { file: shown(file) }), { tool, file: shown(file) });
  if (!file || !CODE_EXT.test(file)) process.exit(0);

  const { inProject, level, skill } = levelForPath(data, file);
  if (!inProject || !PROTECTED.has(level)) process.exit(0);
  if (skill && isOverrideActive(skill.id)) { logEvent({ type: "override-used", tool, file: rel(file), skill: skill.id }); process.exit(0); }
  if (!skill && isOverrideActive("*")) { logEvent({ type: "override-used", tool, file: rel(file), skill: "*" }); process.exit(0); }

  if (level === "L1") {
    // Allowed: scaffolding that leaves TODO(human) gaps. Not allowed: filling or removing gaps.
    let before = "", after = "";
    if (tool === "Write") {
      try { before = fs.readFileSync(path.resolve(ROOT, file), "utf8"); } catch { before = ""; }
      after = ti.content ?? "";
      if (count(after, TODO) > 0 && count(after, TODO) >= count(before, TODO)) process.exit(0);
    } else {
      const edits = tool === "MultiEdit" ? (ti.edits ?? []) : [{ old_string: ti.old_string, new_string: ti.new_string ?? ti.new_source }];
      before = edits.map((e) => e.old_string ?? "").join("\n");
      after = edits.map((e) => e.new_string ?? "").join("\n");
      if (count(after, TODO) > 0 && count(after, TODO) >= count(before, TODO)) process.exit(0);
    }
  }
  deny(protectedReason(level, skill, t("guard.what.write", { file: rel(file) })), { tool, file: rel(file), skill: skill?.id ?? null, level });
}

if (tool === "Bash" || tool === "PowerShell") {
  const cmd = String(ti.command ?? "");
  const short = cmd.slice(0, 200);
  if (RECORD_CMD.test(cmd)) deny(t("guard.recordCmd"), { tool, cmd: short });
  // Bash removes quotes and backslash escapes before it runs a word; PowerShell does not (V1, V2, V3).
  const parsed = parseCommand(cmd, { shell: tool === "PowerShell" ? "powershell" : "bash" });
  // eval, iex, Invoke-Expression, powershell -EncodedCommand: the guard cannot see what runs.
  if (parsed.opaque) deny(t("guard.opaque"), { tool, cmd: short });

  // A path as the shell sees it: ~ and variables expanded, /c/... is C:/..., relative to cwd (security review V2:
  // `${HOME}/eindopdracht` and `$USERPROFILE/...` hid graded work). HOME and USERPROFILE are the home folder, PWD
  // the working folder, any other variable its value in this environment.
  const home = os.homedir();
  const envGet = (n) => {
    const k = n.toUpperCase();
    if (k === "HOME" || k === "USERPROFILE") return home;
    const hit = Object.keys(process.env).find((e) => e.toUpperCase() === k);
    return hit ? process.env[hit] : undefined;
  };
  // { text, unknown }: the word expanded, and the index where something starts that the guard cannot know (an
  // unknown variable, a command substitution, brace expansion), or -1.
  const expand = (word, cwd) => {
    let s = String(word).replace(/^~(?=$|[\\/])/, home);
    s = s.replace(/\$\{(?:env:)?([A-Za-z_][A-Za-z0-9_]*)\}|\$(?:env:)?([A-Za-z_][A-Za-z0-9_]*)/gi, (m, a, b) => {
      const n = a ?? b;
      const v = n.toUpperCase() === "PWD" ? cwd : envGet(n);
      return v === undefined ? m : v;
    });
    const u = s.match(/\$[{(A-Za-z_']|``|\{[^{}]*(,|\.\.)[^{}]*\}/);
    return { text: s, unknown: u ? u.index : -1 };
  };
  const unresolvedWordAt = (cwd, w) => expand(w, cwd).unknown !== -1;
  const resolvePath = (cwd, p) => path.resolve(cwd, expand(p, cwd).text.replace(/^\/([a-zA-Z])\//, "$1:/"));
  // Could this word point into graded work? A word the guard cannot resolve counts when its known part (the folder
  // before the unknown part) is graded, or when nothing of it is known.
  // Brace expansion {a,b}: every alternative is a path of its own (at most 32).
  const braces = (s) => {
    const m = s.match(/\{([^{}]*,[^{}]*)\}/);
    if (!m) return [s];
    return m[1].split(",").slice(0, 32).flatMap((alt) => braces(s.slice(0, m.index) + alt + s.slice(m.index + m[0].length))).slice(0, 32);
  };
  const mayBeGraded = (cwd, w) => {
    const variants = braces(String(w));
    if (variants.length > 1) return variants.some((v) => mayBeGraded(cwd, v));
    const e = expand(w, cwd);
    if (e.unknown === -1) return isGradedPath(data, resolvePath(cwd, w), ROOT, GRADED);
    const prefix = e.text.slice(0, e.unknown);
    if (!prefix) return true;
    const dir = /[\\/]/.test(prefix) ? path.resolve(cwd, prefix.replace(/[^\\/]*$/, "").replace(/^\/([a-zA-Z])\//, "$1:/")) : cwd;
    return isGradedDir(data, dir, ROOT, GRADED) || isGradedPath(data, dir, ROOT, GRADED);
  };
  const looksLikePath = (w) => /[\\/]/.test(w) || CODE_EXT.test(w) || /^\.\.?$/.test(w);
  // A word that is, or stands for, a folder: it ends in / or is ".", it has a glob, it exists as a folder, or it
  // does not exist and has no extension (V4).
  const folderish = (abs, w) => {
    if (/[\\/]$|(^|[\\/])\.\.?$|[*?]/.test(w)) return true;
    try { return fs.statSync(abs).isDirectory(); } catch { return !/\.[A-Za-z0-9]{1,8}$/.test(w); }
  };

  // Which skills does this command touch? Per simple command: the working directory at that point
  // (cd, pushd, Set-Location) plus the paths in its arguments. A directory gets a probe file inside it.
  const hits = new Map(); // skill id -> { level, skill, building }
  const addPath = (p, building) => {
    const r = rel(p);
    if (r !== null && /^\.(claude|learning)\//i.test(r)) return; // harness scripts/data are not learner code
    const { inProject, level, skill } = levelForPath(data, p);
    if (!inProject) return;
    const key = skill?.id ?? "(standaard)";
    hits.set(key, { level, skill, building: building || hits.get(key)?.building || false });
  };
  let cwd = input.cwd ?? process.cwd();
  // false after a cd to a folder the guard cannot resolve ($X, $(...)): from then on graded work fails closed (V2).
  let cwdKnown = true;
  const allowedTooling = [];
  for (const { argv, redirects, raw } of parsed.commands) {
    const name = commandName(argv[0]);
    const args = argv.slice(1);
    // The learner's CLI and the other hook scripts, decided on the parsed words (V1): skill.mjs only with a
    // read command, and no hook script that changes state when run by hand (prompt-gate, reflect-gate ...).
    {
      const k = argv.findIndex((w) => /\.mjs$/i.test(w) && rel(resolvePath(cwd, w))?.toLowerCase().startsWith(".claude/hooks/"));
      if (k !== -1 && !HOOK_SCRIPTS_RUNNABLE.has(commandName(argv[k]))) deny(t("guard.harness"), { tool, cmd: short });
      // skill.mjs by name, wherever it is (a copy outside .claude/hooks/ writes the same record).
      const s = argv.findIndex((w) => commandName(w) === "skill.mjs");
      if (s !== -1) {
        const sub = argv.slice(s + 1).find((a) => !/^-/.test(a));
        if (sub !== undefined && !CLI_READ.has(sub.toLowerCase())) deny(t("guard.recordCmd"), { tool, cmd: short });
      }
    }
    if (CD.has(name)) {
      const target = args.find((a) => !/^-/.test(a));
      if (target) {
        const e = expand(target, cwd);
        if (e.unknown !== -1) cwdKnown = false;
        else if (path.isAbsolute(e.text) || /^\/[a-zA-Z]\//.test(e.text)) cwdKnown = true;
        cwd = resolvePath(cwd, target);
      }
      continue;
    }
    // Graded work: deterministic tooling is allowed and logged (#55). Only when it is about graded work;
    // elsewhere the same command is judged as before (dotnet new is a build at L1-L3).
    if (GRADED) {
      const kind = gradedTooling(name, args, redirects, cwd);
      const aboutGraded = kind && (isGradedDir(data, cwd, ROOT, GRADED) || mentionsGraded(GRADED, raw)
        || args.some((a) => !/^-/.test(a) && isGradedPath(data, resolvePath(cwd, a), ROOT, GRADED)));
      if (aboutGraded) { allowedTooling.push(raw.trim().replace(/\s+/g, " ").slice(0, 200)); continue; }
    }
    // Writes: redirect targets, plus the files named by a command that writes (cp, sed -i, Set-Content ...).
    const targets = redirects.filter((r) => !NOWHERE.test(r)).map((r) => resolvePath(cwd, r));
    const writes = argv.length > 0 && writesFiles(argv, raw);
    // Every word of a program that writes, also a bare name after cd ("cd .learning && tee skills.json", V3).
    if (writes) for (const a of args) if (!/^-/.test(a)) targets.push(resolvePath(cwd, a));
    // Deleting or moving a folder that holds the harness or the record (rm -rf ., mv <project> x), V3.
    {
      const words = args.filter((a) => !/^-/.test(a));
      const gone = DELETES.has(name) ? words : MOVES.has(name) ? words.slice(0, -1) : [];
      for (const a of gone) {
        const kind = holdsProtected(resolvePath(cwd, a));
        if (kind) deny(t(kind === "record" ? "guard.recordCmd" : "guard.harness"), { tool, cmd: short });
      }
    }
    // A download names its output with an option, or lands in the working folder (review of 13 Nov, night:
    // the arc42 zip is fetched with curl, and must never land in graded work this way).
    if (name === "curl" || name === "wget") {
      let named = false;
      for (let k = 0; k < args.length; k++) {
        if (/^(-o|--output|--output-document)$/.test(args[k]) || (name === "wget" && args[k] === "-O")) {
          if (args[k + 1]) { targets.push(resolvePath(cwd, args[k + 1])); named = true; }
        } else if (name === "wget" && /^(-P|--directory-prefix)$/.test(args[k]) && args[k + 1]) { targets.push(path.join(resolvePath(cwd, args[k + 1]), "__download__")); named = true; }
      }
      const remoteName = name === "curl" && args.some((a) => /^(-O|--remote-name|--remote-name-all)$/.test(a) || /^-[a-zA-Z]*O[a-zA-Z]*$/.test(a));
      if (remoteName || (name === "wget" && !named)) targets.push(path.join(cwd, "__download__"));
    }
    for (const p of targets) {
      const r = rel(p);
      if (isRecordFile(p)) deny(t("guard.recordCmd"), { tool, cmd: short });
      if (isHarnessPath(r)) deny(t("guard.harness"), { tool, cmd: short });
      const dir = protectedDirOf(p);
      if (dir) deny(t(dir === "record" ? "guard.recordCmd" : "guard.harness"), { tool, cmd: short });
      if (CODE_EXT.test(p)) addPath(p, false);
    }
    // Folders as the target (security review V4): rm -rf <exercise>, cp -r … <exercise>, tar -C, unzip -d and
    // git checkout -- <folder> reach every code file inside. Only a folder of a skill of the map counts, not
    // an unmapped one (rm -rf build, bin, obj stay free).
    if (writes || name === "git") {
      const words = args.filter((a) => !/^-/.test(a));
      const folders = [];
      if (DELETES.has(name)) folders.push(...words.filter((w) => !CODE_EXT.test(w)));
      if (MOVES.has(name) || ["cp", "copy", "copy-item", "cpi", "rsync", "install", "ln"].includes(name)) {
        const dest = words.at(-1), sources = words.slice(0, -1);
        const carriesCode = sources.some((s) => CODE_EXT.test(s) || /[*?]/.test(s) || /\.(zip|tar|tgz|gz|7z)$/i.test(s) || folderish(resolvePath(cwd, s), s));
        if (dest !== undefined && sources.length && carriesCode && !CODE_EXT.test(dest)) folders.push(dest);
        if (MOVES.has(name)) folders.push(...sources.filter((w) => !CODE_EXT.test(w)));
      }
      if (name === "tar" && args.some((a) => /^-?[a-zA-Z]*x/.test(a) || a === "--extract")) {
        const k = args.findIndex((a) => a === "-C" || a === "--directory");
        const eq = args.find((a) => /^--directory=/.test(a));
        folders.push(k !== -1 && args[k + 1] ? args[k + 1] : eq ? eq.slice(12) : ".");
      }
      if (name === "unzip") {
        const k = args.indexOf("-d");
        folders.push(k !== -1 && args[k + 1] ? args[k + 1] : ".");
      }
      if (name === "git") {
        const sub = (args[0] ?? "").toLowerCase();
        const dd = args.indexOf("--");
        if (sub === "checkout" || sub === "restore") {
          const paths = dd !== -1 ? args.slice(dd + 1) : sub === "restore" ? words.slice(1) : [];
          folders.push(...paths.filter((w) => !CODE_EXT.test(w)));
          for (const w of paths) if (CODE_EXT.test(w)) addPath(resolvePath(cwd, w), false);
        }
        if (sub === "clean") folders.push(...(words.length > 1 ? words.slice(1) : ["."]));
      }
      for (const w of folders) {
        const abs = resolvePath(cwd, w);
        if (!folderish(abs, w)) continue;
        const probe = path.join(/[*?]/.test(w) ? abs.replace(/[\\/][^\\/]*[*?].*$/, "") : abs, "__probe__.cs");
        if (skillForPath(data, probe)) addPath(probe, false);
      }
    }
    // Graded work (#49, #54): any write there, by any program, also outside this project.
    if (GRADED) {
      // The words as the shell will see them, for a graded folder named through a variable (V2).
      const seen = [name, ...args.map((a) => expand(a, cwd).text)].join(" ");
      const names = mentionsGraded(GRADED, raw) || mentionsGraded(GRADED, seen);
      // Why: a path the guard could not resolve gets its own message (write the path out in full).
      const unresolvedWord = (w) => expand(w, cwd).unknown !== -1;
      let unresolved = false;
      const gradedWrite = (() => {
        if (targets.some((p) => isGradedPath(data, p, ROOT, GRADED))) return true;
        if (redirects.some((r) => !NOWHERE.test(r) && mayBeGraded(cwd, r))) { unresolved = redirects.some(unresolvedWord); return true; }
        const wide = writes || GRADED_WRITE_PROGRAMS.has(name);
        // Every argument of a program that writes, also one without a slash ("touch Bank.cs", "mkdir Domain"), and
        // one the guard cannot resolve.
        if (wide && args.some((a) => !/^-/.test(a) && mayBeGraded(cwd, a))) { unresolved = args.some((a) => !/^-/.test(a) && unresolvedWord(a)); return true; }
        // A write the arguments do not show ([IO.File]::WriteAllText(...), a program without paths): the folder decides.
        if (wide && (isGradedDir(data, cwd, ROOT, GRADED) || names)) return true;
        // After a cd the guard could not follow, any write may land in graded work: fail closed (V2).
        if (!cwdKnown && (wide || redirects.some((r) => !NOWHERE.test(r)))) { unresolved = true; return true; }
        // git: a command that changes the repo, in a graded folder (git -C <dir> or the working folder).
        if (name === "git") {
          let k = 0, dir = cwd, dirUnknown = !cwdKnown;
          while (k < args.length && /^-/.test(args[k])) {
            if (/^-C$/.test(args[k])) {
              const w = args[k + 1] ?? ".";
              dirUnknown = expand(w, cwd).unknown !== -1 && mayBeGraded(cwd, w);
              dir = resolvePath(cwd, w);
            }
            k += /^-(C|c)$/.test(args[k]) || /^--(git-dir|work-tree)$/.test(args[k]) ? 2 : 1;
          }
          const sub = (args[k] ?? "").toLowerCase();
          if (sub && !gitReadOnly(sub, args.slice(k + 1)) && (dirUnknown || isGradedDir(data, dir, ROOT, GRADED) || names)) { unresolved = dirUnknown; return true; }
        }
        // Inline code (node -e, python -c ...): in a graded folder, or naming one.
        const inline = INLINE_CODE.find(([prog]) => prog === name);
        if (inline && args.some((a) => inline[1].test(a)) && (!cwdKnown || isGradedDir(data, cwd, ROOT, GRADED) || names)) return true;
        return false;
      })();
      if (gradedWrite) gradedDeny(t(unresolved ? "guard.what.gradedUnresolved" : "guard.what.gradedShell"), { tool, cmd: short });
    }
    // The dashboard export (see EXPORT_SCRIPT): allowed, unless --out points into this project.
    const script = name === "node" ? args.find((a) => !/^-/.test(a)) : null;
    if (script && EXPORT_SCRIPT.test(script) && rel(resolvePath(cwd, script)) === null) {
      const k = args.indexOf("--out");
      if (k !== -1 && args[k + 1] !== undefined && rel(resolvePath(cwd, args[k + 1])) !== null) deny(t("guard.exportOut"), { tool, cmd: short });
      continue;
    }
    // Builds: a build pattern that matches at the START of the command (the program itself), or check.mjs run by node.
    const line = [name, ...args].join(" ");
    const isCheck = name === "node" && args.some((a) => !/^-/.test(a) && commandName(a) === "check.mjs");
    const isBuild = isCheck || BUILD_RES.some((re) => re.exec(line)?.index === 0);
    if (!isBuild) continue;
    // Graded work: building or testing it is the student's own step too, as at L2 (#49).
    if (GRADED) {
      const k = args.findIndex((a) => commandName(a) === "check.mjs");
      const dirs = isCheck ? [args[k + 1] && !/^-/.test(args[k + 1]) ? args[k + 1] : "."]
        : args.filter((a) => !/^-/.test(a) && !/^https?:/i.test(a) && looksLikePath(a));
      const all = dirs.length ? dirs.map((a) => resolvePath(cwd, a)) : [cwd];
      const unknown = dirs.length ? dirs.some((a) => unresolvedWordAt(cwd, a) && mayBeGraded(cwd, a)) : !cwdKnown;
      if (unknown || all.some((d) => isGradedPath(data, d, ROOT, GRADED) || isGradedDir(data, d, ROOT, GRADED))) {
        gradedDeny(t("guard.what.gradedBuild"), { tool, cmd: short, building: true });
      }
    }
    if (isCheck) {
      // check.mjs [folder]: the folder after the script, or the working directory.
      const k = args.findIndex((a) => commandName(a) === "check.mjs");
      const folder = args[k + 1] && !/^-/.test(args[k + 1]) ? args[k + 1] : ".";
      addPath(path.join(resolvePath(cwd, folder), "__probe__.cs"), true);
      continue;
    }
    // The paths the build names, or else the working directory.
    const named = args.filter((a) => !/^-/.test(a) && !/^https?:/i.test(a) && looksLikePath(a));
    if (!named.length) addPath(path.join(cwd, "__probe__.cs"), true);
    for (const a of named) {
      const abs = resolvePath(cwd, a);
      addPath(CODE_EXT.test(a) ? abs : path.join(abs, "__probe__.cs"), true);
    }
  }
  for (const [, { level, skill, building }] of hits) {
    if (!PROTECTED.has(level)) continue;
    if (isOverrideActive(skill ? skill.id : "*")) { logEvent({ type: "override-used", tool, skill: skill?.id ?? "*", cmd: short }); continue; }
    deny(protectedReason(level, skill, t(building ? "guard.what.build" : "guard.what.shellWrite")) + (building ? " " + t("guard.buildAsk") : ""),
      { tool, cmd: short, skill: skill?.id ?? null, level });
  }
  // Allowed tooling in graded work (#55): the Stop hook writes a row per command in the AI-use log.
  if (allowedTooling.length) {
    const sid = input.session_id ?? null;
    const cmds = allowedTooling.map((c) => c.split(os.homedir()).join("~"));
    for (const c of cmds) logEvent({ type: "graded-tooling", cmd: c, session: sid });
    if (sid) {
      const st = loadSession(sid);
      st.gradedTooling = [...(Array.isArray(st.gradedTooling) ? st.gradedTooling : []), ...cmds].slice(-20);
      saveSession(sid, st);
    }
  }
}
process.exit(0);
