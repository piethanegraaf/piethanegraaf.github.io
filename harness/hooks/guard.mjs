// PreToolUse guard: the AI may not write, delete, build or test code that belongs
// to a skill at L1-L3. It may also not change the skill record. Only the learner does that.
//
// Matcher: Edit|Write|MultiEdit|NotebookEdit|Bash|PowerShell
import fs from "node:fs";
import path from "node:path";
import {
  readStdin, loadSkills, levelForPath, skillForPath, isOverrideActive, logEvent, rel,
  PROTECTED, LEVEL_NAMES, ROOT,
} from "./lib.mjs";

const CODE_EXT = /\.(cs|csproj|sln|slnx)$/i;
const CODE_IN_CMD = /\.(cs|csproj|sln|slnx)\b/i;
// Only commands that build, run or test code (or change the project) are blocked.
// Information commands such as `dotnet --list-sdks`, `dotnet --info` or `snek ...` are tooling (L4) and allowed.
const BUILD_CMD = /\bdotnet(\.exe)?\s+(build|test|run|watch|publish|pack|new|add|remove|restore|msbuild|vstest|format|exec|sln)\b|\b(msbuild|csc|devenv|vstest(\.console)?)\b|check\.mjs/i;
const WRITE_CMD = /(>|\bSet-Content\b|\bAdd-Content\b|\bOut-File\b|\bNew-Item\b|\btee\b|\bsed\s+-i|\bperl\s+-p?i|\bcp\b|\bmv\b|\brm\b|\bdel\b|\bCopy-Item\b|\bMove-Item\b|\bRemove-Item\b|\bRename-Item\b|WriteAll(Text|Lines)|\bgit\s+(checkout|restore|reset|stash|apply)\b)/i;
// Redirects to nowhere and arrows (=> in C# lambdas, -> in text) are not writes.
const stripHarmless = (c) => c
  .replace(/\d?>&\d/g, " ")
  .replace(/\d?>>?\s*(\/dev\/null|\$null|nul)\b/gi, " ")
  .replace(/[=-]>/g, " ");
// Everything except list/status changes the learner's record.
const RECORD_CMD = /skill\.mjs["']?\s+(set|review|override|untask|add-micro|done|setting)\b/i;
const TODO = "TODO(human)";

function deny(reason, event) {
  logEvent({ type: "deny", ...event, reason });
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "deny", permissionDecisionReason: reason },
  }));
  process.exit(0);
}

const count = (s, sub) => (s ? String(s).split(sub).length - 1 : 0);

function describe(level, skill) {
  const name = skill ? `'${skill.title}' (${skill.id})` : "niet-gekoppelde code (standaardniveau)";
  return `${name} staat op ${level} ${LEVEL_NAMES[level] ?? ""}`;
}

function protectedReason(level, skill, what) {
  const advice = {
    L1: "Je mag alleen een skelet schrijven waarin de kern als TODO(human) open blijft. Vul nooit een TODO(human) zelf in.",
    L2: "Geef de volgende hint uit de hintladder in plaats van code.",
    L3: "Geef pas feedback of een review nadat de student het zelf heeft geprobeerd.",
  }[level];
  return `Leerharnas: ${what} geblokkeerd. ${describe(level, skill)}, dus de student doet dit zelf. ${advice} ` +
    `Probeer dit niet via een andere weg (scripts, andere tools). Wil de student het toch laten doen, dan typt die zelf: ` +
    `! node .claude/hooks/skill.mjs override ${skill ? skill.id : "*"} 30 "<reden>"  (wordt gelogd).`;
}

let input;
try { input = JSON.parse(await readStdin()); } catch { process.exit(0); }
const tool = input.tool_name ?? "";
const ti = input.tool_input ?? {};

let data;
try {
  data = loadSkills();
} catch {
  // Fail closed for code: if the record is unreadable, all project code counts as L2.
  data = { settings: { defaultLevel: "L2" }, skills: [] };
}

// 1) The skill record and state belong to the learner.
const isRecordPath = (p) => {
  const r = rel(p);
  return r !== null && (/^\.learning\/skills\.json$/i.test(r) || /^\.learning\/state\//i.test(r));
};

if (["Edit", "Write", "MultiEdit", "NotebookEdit"].includes(tool)) {
  const file = ti.file_path ?? ti.notebook_path;
  if (isRecordPath(file)) {
    deny("Leerharnas: het vaardighedenregister en de state wijzigt alleen de student, via `! node .claude/hooks/skill.mjs ...`. Stel de wijziging voor in plaats van hem uit te voeren.",
      { tool, file: rel(file) });
  }
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
  deny(protectedReason(level, skill, `code schrijven in ${rel(file)}`), { tool, file: rel(file), skill: skill?.id ?? null, level });
}

if (tool === "Bash" || tool === "PowerShell") {
  const cmd = String(ti.command ?? "");
  if (RECORD_CMD.test(cmd) || (/skills\.json|\.learning[\\/]+state/i.test(cmd) && WRITE_CMD.test(stripHarmless(cmd)))) {
    deny("Leerharnas: niveaus, taken, herhalingen en overrides zet alleen de student zelf (met `!` voor het commando). Je mag `node .claude/hooks/skill.mjs list` en `status` wel draaien.",
      { tool, cmd: cmd.slice(0, 200) });
  }
  const building = BUILD_CMD.test(cmd);
  const writing = CODE_IN_CMD.test(cmd) && WRITE_CMD.test(stripHarmless(cmd));
  if (!building && !writing) process.exit(0);

  // Which skills does this command touch? The working directory plus any path segments in the command.
  const hits = new Map();
  // A leading `cd <dir> &&` (or `;`) sets the effective working directory.
  const cdm = cmd.match(/^\s*cd\s+(?:"([^"]+)"|'([^']+)'|(\S+))\s*(?:&&|;)/);
  const cwd = cdm ? path.resolve(input.cwd ?? process.cwd(), (cdm[1] ?? cdm[2] ?? cdm[3]).replace(/^\/([a-zA-Z])\//, "$1:/")) : (input.cwd ?? process.cwd());
  const addPath = (p) => {
    const r = rel(p);
    if (r !== null && /^\.(claude|learning)\//i.test(r)) return; // harness scripts/data are not learner code
    const { inProject, level, skill } = levelForPath(data, p);
    if (inProject) hits.set(skill?.id ?? "(standaard)", { level, skill });
  };
  addPath(path.join(cwd, "__probe__.cs"));
  // Path-like tokens in the command, resolved against cwd. A directory gets a probe file inside it.
  for (const tok of cmd.split(/[\s"'`=;|&()]+/)) {
    if (!/[\\/]/.test(tok) && !CODE_EXT.test(tok)) continue;
    if (/^-/.test(tok) || /^https?:/i.test(tok)) continue;
    const abs = path.resolve(cwd, tok.replace(/^\/([a-zA-Z])\//, "$1:/"));
    addPath(CODE_EXT.test(tok) ? abs : path.join(abs, "__probe__.cs"));
  }
  for (const [, { level, skill }] of hits) {
    if (!PROTECTED.has(level)) continue;
    if (isOverrideActive(skill ? skill.id : "*")) { logEvent({ type: "override-used", tool, skill: skill?.id ?? "*", cmd: cmd.slice(0, 200) }); continue; }
    deny(protectedReason(level, skill, building ? "bouwen/testen" : "code wijzigen via de shell") +
      (building ? " Vraag de student zelf te bouwen/testen en de uitkomst of foutmelding te delen." : ""),
      { tool, cmd: cmd.slice(0, 200), skill: skill?.id ?? null, level });
  }
}
process.exit(0);
