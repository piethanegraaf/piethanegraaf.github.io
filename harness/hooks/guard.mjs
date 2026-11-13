// PreToolUse guard: the AI may not write, delete, build or test code that belongs
// to a skill at L1-L3. It may also not change the skill record. Only the learner does that.
//
// Matcher: Edit|Write|MultiEdit|NotebookEdit|Bash|PowerShell
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  readStdin, loadSkills, levelForPath, isOverrideActive, logEvent, rel, isHarnessPath,
  codeExtRe, buildRes, PROTECTED, levelName, t, ROOT, isRecordFile, gradedOf, isGradedPath, isGradedDir, mentionsGraded,
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
// Everything except list/status changes the learner's record.
const RECORD_CMD = /skill\.mjs["']?\s+(set|review|override|untask|correct|add-micro|add|done|setting|paths|replay)\b/i;
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
  const parsed = parseCommand(cmd);
  // eval, iex, Invoke-Expression, powershell -EncodedCommand: the guard cannot see what runs.
  if (parsed.opaque) deny(t("guard.opaque"), { tool, cmd: short });

  // A path as the shell sees it: ~ and $HOME are the home folder, /c/... is C:/..., relative to cwd.
  const home = os.homedir();
  const resolvePath = (cwd, p) => path.resolve(cwd, String(p)
    .replace(/^~(?=$|[\\/])/, home).replace(/^\$(HOME|env:USERPROFILE)(?=$|[\\/])/i, home)
    .replace(/^\/([a-zA-Z])\//, "$1:/"));
  const looksLikePath = (w) => /[\\/]/.test(w) || CODE_EXT.test(w) || /^\.\.?$/.test(w);

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
  const allowedTooling = [];
  for (const { argv, redirects, raw } of parsed.commands) {
    const name = commandName(argv[0]);
    const args = argv.slice(1);
    if (CD.has(name)) {
      const target = args.find((a) => !/^-/.test(a));
      if (target) cwd = resolvePath(cwd, target);
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
    if (writes) for (const a of args) if (!/^-/.test(a) && looksLikePath(a)) targets.push(resolvePath(cwd, a));
    for (const p of targets) {
      const r = rel(p);
      if (isRecordFile(p)) deny(t("guard.recordCmd"), { tool, cmd: short });
      if (isHarnessPath(r)) deny(t("guard.harness"), { tool, cmd: short });
      if (CODE_EXT.test(p)) addPath(p, false);
    }
    // Graded work (#49, #54): any write there, by any program, also outside this project.
    if (GRADED) {
      const gradedWrite = (() => {
        if (targets.some((p) => isGradedPath(data, p, ROOT, GRADED))) return true;
        const wide = writes || GRADED_WRITE_PROGRAMS.has(name);
        // Every argument of a program that writes, also one without a slash ("touch Bank.cs", "mkdir Domain").
        if (wide && args.some((a) => !/^-/.test(a) && isGradedPath(data, resolvePath(cwd, a), ROOT, GRADED))) return true;
        // A write the arguments do not show ([IO.File]::WriteAllText(...), a program without paths): the folder decides.
        if (wide && (isGradedDir(data, cwd, ROOT, GRADED) || mentionsGraded(GRADED, raw))) return true;
        // git: a command that changes the repo, in a graded folder (git -C <dir> or the working folder).
        if (name === "git") {
          let k = 0, dir = cwd;
          while (k < args.length && /^-/.test(args[k])) {
            if (/^-C$/.test(args[k])) dir = resolvePath(cwd, args[k + 1] ?? ".");
            k += /^-(C|c)$/.test(args[k]) || /^--(git-dir|work-tree)$/.test(args[k]) ? 2 : 1;
          }
          const sub = (args[k] ?? "").toLowerCase();
          if (sub && !gitReadOnly(sub, args.slice(k + 1)) && (isGradedDir(data, dir, ROOT, GRADED) || mentionsGraded(GRADED, raw))) return true;
        }
        // Inline code (node -e, python -c ...): in a graded folder, or naming one.
        const inline = INLINE_CODE.find(([prog]) => prog === name);
        if (inline && args.some((a) => inline[1].test(a)) && (isGradedDir(data, cwd, ROOT, GRADED) || mentionsGraded(GRADED, raw))) return true;
        return false;
      })();
      if (gradedWrite) gradedDeny(t("guard.what.gradedShell"), { tool, cmd: short });
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
      if (all.some((d) => isGradedPath(data, d, ROOT, GRADED) || isGradedDir(data, d, ROOT, GRADED))) {
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
