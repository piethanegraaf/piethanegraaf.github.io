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
  for (const { argv, redirects, raw } of parsed.commands) {
    const name = commandName(argv[0]);
    const args = argv.slice(1);
    if (CD.has(name)) {
      const target = args.find((a) => !/^-/.test(a));
      if (target) cwd = resolvePath(cwd, target);
      continue;
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
          if (sub && !GIT_READ.has(sub) && (isGradedDir(data, dir, ROOT, GRADED) || mentionsGraded(GRADED, raw))) return true;
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
}
process.exit(0);
