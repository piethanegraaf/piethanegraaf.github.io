#!/usr/bin/env node
// Leerharnas installer. No dependencies, no network, no shell: it only copies files into the target folder
// (and, only with --user-guard, into ~/.claude/; see user/user-guard.mjs).
//
//   node harness/install.mjs <doelmap> [--map ood|junior-dotnet|security-dotnet] [--lang nl|en] [--course "<vak>"] [--exam JJJJ-MM-DD] [--dry-run] [--yes]
//   node harness/install.mjs <doelmap> --update [--dry-run] [--yes] [--force]
//   node harness/install.mjs <doelmap> --user-guard [--remove] [--dry-run] [--yes]   (graded work closed from other folders, #61)
//
// - It first shows what will happen. It only changes files with --yes, or after "j" in an interactive terminal.
// - Every existing file that changes is first copied to .claude/leerharnas-backup/<tijd>/.
// - --update replaces the harness code (hooks, the diary, mastery-check and update-dashboard skills, .claude/leerharnas.md) and merges the hooks into
//   .claude/settings.json. It never replaces data (.learning/) and never your own CLAUDE.md.
// - --update while a practice session runs in the target (a session state active in the last idleMinutes,
//   default 20) would change the rules under that session. In a terminal it asks first; with --yes or
//   without a terminal it stops, unless --force is given too (setup review of 11 Nov, afternoon, #30).
// - --learning-dir <absolute path> (setup of 13 Nov, #53): this folder uses the record of another folder, for example
//   the repo of a graded assignment with the .learning/ of the practice folder, so a task there counts for the same
//   skill. It goes in .claude/leerharnas.local.json, which is not in git (it holds an absolute path). No .learning/
//   is made here, and the record there is never changed. --update keeps it.
// - A map with exercises (security-dotnet) puts them in oefeningen/. An exercise that is already there is never
//   replaced: it is the learner's work.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import readline from "node:readline/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { t, setLanguage } from "./core/i18n.mjs";
import { hostText } from "./core/host.mjs";

const HARNESS = path.dirname(fileURLToPath(import.meta.url));
const VERSION = JSON.parse(fs.readFileSync(path.join(HARNESS, "package.json"), "utf8")).version;
const MANIFEST = ".claude/leerharnas.json";
const LOCAL = ".claude/leerharnas.local.json";
const BACKUP_DIR = ".claude/leerharnas-backup";
// Where the exercises of a map go (security-dotnet); the paths of its skills point here.
const EXERCISES_DIR = "oefeningen";
const IMPORT_LINE = "@.claude/leerharnas.md";
// opencode (opencode plan): the same harness in .opencode/, with a plugin instead of hooks in settings.
const OC_MANIFEST = ".opencode/leerharnas.json";
const OC_LOCAL = ".opencode/leerharnas.local.json";
const OC_BACKUP_DIR = ".opencode/leerharnas-backup";
const AGENTS_BEGIN = "<!-- leerharnas:begin -->";
const AGENTS_END = "<!-- leerharnas:end -->";
const HOST_OPTS = ["claude-code", "opencode", "both"];
const LANGS = ["nl", "en"];
const HOOKS = [
  { event: "SessionStart", script: "session-start.mjs" },
  { event: "UserPromptSubmit", script: "prompt-gate.mjs" },
  { event: "Stop", script: "reflect-gate.mjs" },
  { event: "PreToolUse", script: "guard.mjs", matcher: "Edit|Write|MultiEdit|NotebookEdit|Bash|PowerShell" },
  // The end of a session, for the catch-up diary at the next start (review of 13 Nov, night, #56).
  { event: "SessionEnd", script: "session-end.mjs" },
];
// A hook command of this harness, also an older one with an absolute path.
const HARNESS_CMD = /(^|[\s"'\\/])\.claude[\\/]hooks[\\/](session-start|prompt-gate|reflect-gate|guard|session-end)\.mjs/i;
const hookCommand = (script) => `node "$CLAUDE_PROJECT_DIR/.claude/hooks/${script}"`;

const fail = (key, vars) => { console.error(t("install.error", { msg: t(key, vars) })); process.exit(1); };
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const readText = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };

// ---------- 1. Arguments ----------
function parseArgs(argv) {
  const o = { target: null, update: false, dryRun: false, yes: false, force: false, map: null, lang: null, course: null, exam: null, learningDir: null,
    userGuard: false, remove: false, host: "claude-code" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => { if (i + 1 >= argv.length) fail("install.needsValue", { opt: a }); return argv[++i]; };
    if (a === "--update") o.update = true;
    else if (a === "--dry-run") o.dryRun = true;
    else if (a === "--yes" || a === "-y") o.yes = true;
    else if (a === "--force") o.force = true;
    else if (a === "--map") o.map = val();
    else if (a === "--lang") o.lang = val();
    else if (a === "--course") o.course = val();
    else if (a === "--exam") o.exam = val();
    else if (a === "--learning-dir") o.learningDir = val();
    else if (a === "--host") o.host = val();
    else if (a === "--user-guard") o.userGuard = true;
    else if (a === "--remove") o.remove = true;
    else if (a === "--help" || a === "-h") { usage(); process.exit(0); }
    else if (a.startsWith("-")) fail("install.unknownOption", { opt: a });
    else if (!o.target) o.target = a;
    else fail("install.unexpectedArg", { arg: a });
  }
  return o;
}

function usage() {
  console.log(t("install.usage"));
}

// Messages before the language is known: the --lang option, or Dutch.
setLanguage(process.argv.includes("--lang") ? process.argv[process.argv.indexOf("--lang") + 1] : "nl");
const opts = parseArgs(process.argv.slice(2));
if (!opts.target) { usage(); process.exit(1); }
if (!HOST_OPTS.includes(opts.host)) fail("install.badHost", { host: opts.host });
// Which hosts this run installs or updates: Claude Code (.claude/), opencode (.opencode/), or both on one record.
const withCC = opts.host !== "opencode";
const withOC = opts.host !== "claude-code";
// The user-level gate for opencode belongs to release 2 (graded work on opencode).
if (opts.userGuard && opts.host !== "claude-code") fail("install.ocUserGuard");
// A leading ~ is the home folder. PowerShell passes it to node as it is (it only expands ~ in its own commands), so
// "~/code/oefen" would otherwise become a folder named "~" in the current folder.
const expandHome = (p) => (typeof p === "string" ? p.replace(/^~(?=$|[\\/])/, os.homedir()) : p);
const TARGET = path.resolve(expandHome(opts.target));
if (!fs.existsSync(TARGET) || !fs.statSync(TARGET).isDirectory()) fail("install.noTarget", { dir: TARGET });
{
  const r = path.relative(HARNESS, TARGET);
  if (!r.startsWith("..") && !path.isAbsolute(r)) fail("install.selfTarget");
}

// ---------- 1b. The user-level gate for graded work (review of 13 Nov, night, #61) ----------
// Only with --user-guard: then the installer writes in ~/.claude/ (and nowhere else), after showing the plan.
if (opts.remove && !opts.userGuard) fail("install.unknownOption", { opt: "--remove" });
if (opts.userGuard) {
  const { planUserGuard, applyUserGuard, gradedPathsOf } = await import("./user/user-guard.mjs");
  setLanguage(opts.lang ?? gradedPathsOf(TARGET).lang);
  const home = os.homedir();
  const shownPath = (p) => p.split(home).join("~").split(path.sep).join("/");
  const r = planUserGuard({ folder: TARGET, remove: opts.remove, t });
  if (r.error) fail(r.error, { dir: TARGET });
  console.log(t(opts.remove ? "install.userGuard.headRemove" : "install.userGuard.head", { dir: shownPath(path.join(home, ".claude")) }));
  if (!opts.remove) console.log(t("install.userGuard.what", { paths: r.info.paths.join(", "), names: r.info.names.join(", ") || "-" }));
  const width = Math.max(...r.plan.map((p) => t(`install.action.${p.action}`).length));
  for (const p of r.plan) console.log(`  ${t(`install.action.${p.action}`).padEnd(width)}  ${shownPath(p.file)}`);
  if (r.plan.every((p) => p.action === "same")) { console.log("\n" + t("install.upToDate")); process.exit(0); }
  if (opts.dryRun) { console.log("\n" + t("install.dryRun")); process.exit(0); }
  if (!opts.yes) {
    if (!process.stdin.isTTY) { console.log("\n" + t("install.needYes")); process.exit(0); }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = (await rl.question("\n" + t("install.userGuard.confirm") + " ")).trim().toLowerCase();
    rl.close();
    if (!["j", "ja", "y", "yes"].includes(answer)) { console.log(t("install.aborted")); process.exit(0); }
  }
  const done = applyUserGuard(r);
  console.log("\n" + t(opts.remove ? "install.userGuard.removed" : "install.userGuard.done", { backup: done.backups ? t("install.doneBackup", { dir: shownPath(done.backup) }) : "" }));
  process.exit(0);
}

// Every path this script writes must stay inside the target folder.
function inTarget(rel) {
  if (typeof rel !== "string" || !/^[\w.@-]+(\/[\w.@-]+)*$/.test(rel) || rel.split("/").includes("..")) fail("install.badPath", { path: rel });
  const abs = path.resolve(TARGET, rel);
  const r = path.relative(TARGET, abs);
  if (!r || r.startsWith("..") || path.isAbsolute(r)) fail("install.outsidePath", { path: rel });
  return abs;
}

// ---------- 2. Current state of the target ----------
function readManifest(rel) {
  const text = readText(inTarget(rel));
  if (text === null) return null;
  try { return JSON.parse(text); } catch { return fail("install.badManifest", { file: rel }); }
}
const ccManifest = withCC ? readManifest(MANIFEST) : null;
const ocManifest = withOC ? readManifest(OC_MANIFEST) : null;
// The manifest that gives the map and the language: Claude Code's when it is installed, else opencode's.
let manifest = ccManifest ?? ocManifest;
const legacy = withCC && !ccManifest && fs.existsSync(inTarget(".claude/hooks/guard.mjs"));
if (withCC) {
  if (!opts.update && (ccManifest || legacy)) fail("install.already");
  if (opts.update && !ccManifest && !legacy) fail("install.notInstalled");
}
if (withOC) {
  if (!opts.update && ocManifest) fail("install.already");
  if (opts.update && !ocManifest) fail("install.notInstalled");
}
// opencode next to an existing Claude Code install: the map and the language come from that install.
if (!manifest && withOC && !withCC) manifest = readManifest(MANIFEST);

// One record for two folders (#53): --learning-dir, or the one an earlier install wrote in .claude/leerharnas.local.json.
let localConfig = null;
try { localConfig = JSON.parse(readText(inTarget(LOCAL)) ?? readText(inTarget(OC_LOCAL)) ?? "null"); } catch { /* an unreadable file is replaced */ }
const learningDirRaw = opts.learningDir ?? (typeof localConfig?.learningDir === "string" ? localConfig.learningDir : null);
const learningDir = learningDirRaw === null ? null : path.resolve(expandHome(learningDirRaw).replace(/^\/([a-zA-Z])\//, "$1:/"));
if (learningDir !== null) {
  const absolute = path.isAbsolute(learningDirRaw) || /^\/[a-zA-Z]\//.test(learningDirRaw);
  if (!absolute || !fs.existsSync(path.join(learningDir, "skills.json"))) fail("install.badLearningDir", { dir: learningDirRaw });
  const r = path.relative(TARGET, learningDir);
  if (!r.startsWith("..") && !path.isAbsolute(r)) fail("install.badLearningDir", { dir: learningDirRaw });
}
const recordFile = learningDir ? path.join(learningDir, "skills.json") : inTarget(".learning/skills.json");

let existingSettings = null;
try { existingSettings = JSON.parse(readText(recordFile) ?? "null")?.settings ?? null; } catch { /* data stays untouched */ }

const lang = opts.lang ?? manifest?.language ?? existingSettings?.language ?? "nl";
const mapId = opts.map ?? manifest?.map ?? "ood";
setLanguage(lang);
if (!LANGS.includes(lang)) fail("install.badLang");
if (!/^[a-z0-9-]+$/.test(mapId) || !fs.existsSync(path.join(HARNESS, "maps", mapId, "skills.json"))) fail("install.badMap", { map: mapId });
if (opts.exam !== null && !/^\d{4}-\d{2}-\d{2}$/.test(opts.exam)) fail("install.badExam");
if (opts.course !== null && !/^[^\r\n<>]{1,80}$/.test(opts.course)) fail("install.badCourse");
if (opts.update && (opts.exam !== null || opts.course !== null)) fail("install.updateNoSettings");
// Release 1 of the opencode version covers practice folders only: graded work stays on Claude Code (opencode plan).
{
  const g = existingSettings?.graded;
  if (withOC && g && typeof g === "object" && Array.isArray(g.paths) && g.paths.length) fail("install.ocGraded");
}

// A file in the language of choice; falls back to Dutch while a translation is missing.
function localized(dir, base) {
  for (const l of [lang, "nl"]) {
    const p = path.join(dir, `${base}.${l}.md`);
    if (fs.existsSync(p)) {
      if (l !== lang) notes.push(t("install.noTranslation", { file: path.relative(HARNESS, p), lang }));
      return fs.readFileSync(p, "utf8");
    }
  }
  return null;
}

// ---------- 2b. Which opencode is installed ----------
const notes = [];
// The released opencode 1.x rejects the V2 "permissions" and "policies" in .opencode/opencode.jsonc and then does
// not start at all, not even without the harness ("V2 permissions are not supported by OpenCode V1"; live test of
// 16 Nov with 1.19.5). So with only a 1.x on the PATH the installer stops before it writes anything. opencode2, or a
// build that is not a 1.x release (a dev build is 0.0.0-...), goes on. opencode 2 is the npm package @opencode/cli
// (commands opencode and opencode2); opencode 1 is opencode-ai. Tested: 2.3.0 starts with the config, loads the
// plugin and blocks with the guard (17 Nov 2026). --force goes on anyway, for example to
// prepare a folder for opencode 2. Not found (on Windows the npm shim is a .cmd, which is not started without a
// shell): a notice. The check starts the program with an argument list and only reads its version.
function opencodeRelease(bin) {
  const r = spawnSync(bin, ["--version"], { encoding: "utf8", timeout: 10000, windowsHide: true });
  if (r.error || r.status !== 0) return null;
  // opencode 1 prints "1.19.6", opencode 2 "opencode v2.3.0".
  return String(r.stdout).trim().split(/\s+/).map((w) => w.replace(/^v/, "")).find((w) => /^\d+\.\d+\.\d+/.test(w)) ?? "?";
}
if (withOC) {
  const v2 = opencodeRelease("opencode2");
  const v = v2 === null ? opencodeRelease("opencode") : null;
  if (v !== null && /^1\.\d+\.\d+$/.test(v)) {
    if (!opts.force) fail("install.ocV1", { version: v });
    notes.push(t("install.ocV1Forced", { version: v }));
  } else if (v2 === null && v === null) notes.push(t("install.ocVersionUnknown"));
}

// ---------- 3. What the files should look like ----------
const code = new Map(); // rel -> content (owned by the harness, replaced on update)
// The hooks (Claude Code) or the gates and the CLI (opencode), the core next to them, and the messages.
function hostCode(dir) {
  for (const f of fs.readdirSync(path.join(HARNESS, "hooks")).filter((f) => f.endsWith(".mjs")).sort()) {
    code.set(`${dir}/hooks/${f}`, fs.readFileSync(path.join(HARNESS, "hooks", f), "utf8"));
  }
  // The host-neutral core (opencode plan): the hooks import it from ../core/, so it sits next to <dir>/hooks/.
  for (const f of fs.readdirSync(path.join(HARNESS, "core")).filter((f) => f.endsWith(".mjs")).sort()) {
    code.set(`${dir}/core/${f}`, fs.readFileSync(path.join(HARNESS, "core", f), "utf8"));
  }
  // Messages for all languages, so `skill.mjs setting language` works without reinstalling.
  for (const f of fs.readdirSync(path.join(HARNESS, "i18n")).filter((f) => /^[a-z]{2}\.json$/.test(f)).sort()) {
    code.set(`${dir}/hooks/i18n/${f}`, fs.readFileSync(path.join(HARNESS, "i18n", f), "utf8"));
  }
}
if (withCC) hostCode(".claude");
// The skills: the diary, the transfer task for the step to L4 (setup review §9.4), and the update of the
// dashboard after /diary (second setup review of 11 Nov, S8). harness/skills/ is their only source:
// the repo's own .claude/skills/update-dashboard/ points here.
const skillTexts = ["diary", "mastery-check", "update-dashboard"].map((name) => {
  const skill = localized(path.join(HARNESS, "skills", name), "SKILL");
  if (skill === null) fail("install.noSkill");
  return [name, skill];
});
// The read-only agent that decides which level goes down (automatic demotion, setup review S3a).
const agentTexts = fs.readdirSync(path.join(HARNESS, "agents")).filter((f) => /^[a-z-]+\.nl\.md$/.test(f)).sort()
  .map((f) => { const name = f.replace(/\.nl\.md$/, ""); return [name, localized(path.join(HARNESS, "agents"), name)]; });
const rules = localized(path.join(HARNESS, "templates"), "leerharnas");
if (rules === null) fail("install.noRules");
const mapNotes = localized(path.join(HARNESS, "maps", mapId), "notes");
const rulesText = rules.trimEnd() + "\n" + (mapNotes ? "\n" + mapNotes.trimEnd() + "\n" : "");
if (withCC) {
  for (const [name, skill] of skillTexts) code.set(`.claude/skills/${name}/SKILL.md`, skill);
  for (const [name, text] of agentTexts) code.set(`.claude/agents/${name}.md`, text);
  code.set(".claude/leerharnas.md", rulesText);
}
if (withOC) {
  hostCode(".opencode");
  // The plugin: opencode loads .opencode/plugins/<id>/ through its index; package.json makes .js an ES module.
  code.set(".opencode/plugins/leerharnas/index.js", fs.readFileSync(path.join(HARNESS, "hosts", "opencode", "plugin.mjs"), "utf8"));
  for (const f of ["messages.mjs", "map.mjs", "models.json"]) code.set(`.opencode/plugins/leerharnas/${f}`, fs.readFileSync(path.join(HARNESS, "hosts", "opencode", f), "utf8"));
  code.set(".opencode/plugins/leerharnas/package.json", JSON.stringify({ private: true, type: "module" }, null, 2) + "\n");
  for (const [name, skill] of skillTexts) code.set(`.opencode/skills/${name}/SKILL.md`, hostText(skill, "opencode"));
  for (const [name, text] of agentTexts) code.set(`.opencode/agents/${name}.md`, opencodeAgent(text));
  code.set(".opencode/leerharnas.md", hostText(rulesText, "opencode"));
  code.set(".opencode/opencode.jsonc", opencodeConfig());
}

// A Claude Code agent file as an opencode agent: the same prompt, as a subagent that may only read.
function opencodeAgent(text) {
  const m = String(text).match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const front = m ? m[1] : "";
  const body = m ? m[2] : String(text);
  const description = (front.match(/^description:\s*(.*)$/m) ?? [])[1] ?? "";
  const deny = ["edit", "shell", "subagent", "execute", "webfetch", "websearch"];
  return ["---", `description: ${JSON.stringify(description.trim())}`, "mode: subagent", "permissions:",
    ...deny.flatMap((a) => [`  - action: ${a}`, `    resource: "*"`, "    effect: deny"]), "---", hostText(body, "opencode")].join("\n").replace(/\s*$/, "\n");
}

// .opencode/opencode.jsonc: owned by the harness (the learner's own settings go in opencode.json(c) in the project
// root, or in ~/.config/opencode/). The rules as instructions, Code Mode off, and policies that never let the model
// write the record or the harness of either host (Security model, layer 1). The diary is not here: /diary writes it.
function opencodeConfig() {
  const protectedEdits = [".learning/skills.json", ".learning/state/*",
    ".claude/hooks/*", ".claude/core/*", ".claude/settings.json", ".claude/settings.local.json", ".claude/leerharnas*",
    ".claude/skills/diary/*", ".claude/skills/mastery-check/*", ".claude/skills/update-dashboard/*", ".claude/agents/demotie-analist.md",
    ".opencode/hooks/*", ".opencode/core/*", ".opencode/plugin/*", ".opencode/plugins/*", ".opencode/tool/*", ".opencode/tools/*", ".opencode/leerharnas*", ".opencode/opencode.json*",
    ".opencode/skills/diary/*", ".opencode/skills/mastery-check/*", ".opencode/skills/update-dashboard/*", ".opencode/agents/demotie-analist.md",
    "opencode.json*", "*/.config/opencode/*"];
  const cfg = {
    $schema: "https://opencode.ai/config.json",
    instructions: [".opencode/leerharnas.md"],
    permissions: [{ action: "execute", resource: "*", effect: "deny" }],
    policies: protectedEdits.map((r) => ({ action: "tool.use", resource: `edit:${r}`, effect: "deny" })),
  };
  return `// ${t("install.ocConfigComment")}\n` + JSON.stringify(cfg, null, 2) + "\n";
}

// The harness block in AGENTS.md: a pointer to the rules and the canary (without a status line the harness is off).
function agentsBlock() {
  const text = localized(path.join(HARNESS, "templates"), "AGENTS.block");
  if (text === null) fail("install.noRules");
  return `${AGENTS_BEGIN}\n${text.trim()}\n${AGENTS_END}`;
}

function mergeSettings(text) {
  let cfg = {};
  if (text !== null) {
    try { cfg = JSON.parse(text); } catch { fail("install.badSettings"); }
    if (!cfg || typeof cfg !== "object" || Array.isArray(cfg)) fail("install.settingsNotObject");
  }
  const hooks = {};
  for (const [ev, groups] of Object.entries(cfg.hooks ?? {})) {
    const kept = (Array.isArray(groups) ? groups : [])
      .map((g) => ({ ...g, hooks: (g.hooks ?? []).filter((h) => !HARNESS_CMD.test(String(h?.command ?? ""))) }))
      .filter((g) => g.hooks.length);
    if (kept.length) hooks[ev] = kept;
  }
  for (const h of HOOKS) {
    const group = { ...(h.matcher ? { matcher: h.matcher } : {}), hooks: [{ type: "command", command: hookCommand(h.script) }] };
    hooks[h.event] = [...(hooks[h.event] ?? []), group];
  }
  // Claude Code's suggestion for your next prompt can give away a hint (setup review §4): off,
  // unless you chose otherwise yourself.
  return JSON.stringify({ promptSuggestionEnabled: false, ...cfg, hooks }, null, 2) + "\n";
}

// A text in the map can be { nl, en }: the record gets the language of choice (Dutch as fallback).
const pickLang = (v) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] ?? v.nl ?? Object.values(v)[0] : v);

function initialSkills() {
  const map = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", mapId, "skills.json"), "utf8"));
  if (map._info !== undefined) map._info = pickLang(map._info);
  map.skills = (map.skills ?? []).map((s) => ({ ...s, title: pickLang(s.title) }));
  map.settings = { ...(map.settings ?? {}), language: lang };
  if (opts.course !== null) map.settings.course = opts.course;
  if (opts.exam !== null) map.settings.examDate = opts.exam;
  return JSON.stringify({ ...map, updated: new Date().toLocaleDateString("sv-SE") }, null, 2) + "\n";
}

function withGitignore(text) {
  const lines = (text ?? "").split(/\r?\n/).map((l) => l.trim());
  const wanted = [".learning/", ...(withCC ? [`${BACKUP_DIR}/`, LOCAL] : []), ...(withOC ? [`${OC_BACKUP_DIR}/`, OC_LOCAL] : [])];
  const missing = wanted.filter((l) => !lines.includes(l) && !lines.includes("/" + l));
  if (!missing.length) return null;
  const head = text === null ? "" : text.replace(/\s*$/, "\n\n");
  return head + t("install.gitignoreComment") + "\n" + missing.join("\n") + "\n";
}

// ---------- 4. The plan ----------
const plan = [];
// action: new | same | replace | delete | merge | keep | mkdir | append, shown through t("install.action.*").
const noteVars = { map: mapId, line: IMPORT_LINE };
const add = (rel, action, content, note = "") => plan.push({ rel, action, content, note: note ? t(`install.note.${note}`, noteVars) : "" });

for (const [rel, content] of code) {
  const cur = readText(inTarget(rel));
  if (cur === null) add(rel, "new", content);
  else if (cur === content) add(rel, "same");
  else {
    const changedByUser = manifest?.files?.[rel] && manifest.files[rel] !== sha256(cur);
    add(rel, "replace", content, changedByUser || legacy ? "localBackup" : "backup");
  }
}
for (const m of [ccManifest, ocManifest]) {
  for (const rel of Object.keys(m?.files ?? {})) {
    if (!code.has(rel) && readText(inTarget(rel)) !== null) add(rel, "delete", null, "obsolete");
  }
}
if (withCC) {
  const rel = ".claude/settings.json";
  const cur = readText(inTarget(rel));
  const next = mergeSettings(cur);
  if (cur === null) add(rel, "new", next, "hooks");
  else if (cur === next) add(rel, "same");
  else add(rel, "merge", next, "mergeSettings");
}
if (learningDir) {
  // The record of another folder: nothing is made here, and the record there is never changed.
  noteVars.dir = learningDir.split(path.sep).join("/");
  if (opts.exam !== null || opts.course !== null) notes.push(t("install.learningDirSettings"));
  add(".learning/", "keep", null, "learningDir");
  const next = JSON.stringify({ learningDir }, null, 2) + "\n";
  for (const local of [withCC ? LOCAL : null, withOC ? OC_LOCAL : null].filter(Boolean)) {
    const cur = readText(inTarget(local));
    if (cur === null) add(local, "new", next);
    else if (cur === next) add(local, "same");
    else add(local, "replace", next, "backup");
  }
} else {
  for (const [rel, make] of [[".learning/skills.json", initialSkills], [".learning/keywords.json", () => fs.readFileSync(path.join(HARNESS, "maps", mapId, "keywords.json"), "utf8")]]) {
    if (readText(inTarget(rel)) === null) add(rel, "new", make(), "map");
    else add(rel, "keep", null, "data");
  }
  if (!fs.existsSync(inTarget(".learning/diary"))) add(".learning/diary/", "mkdir", null);
}
// The exercises of a map (security-dotnet): maps/<id>/exercises/<exercise>/ goes to oefeningen/<exercise>/,
// with README.<lang>.md as README.md. They are the learner's work from then on: an exercise that is already
// there is never replaced, also not by --update; a new exercise in a later version does arrive.
const EXERCISES = path.join(HARNESS, "maps", mapId, "exercises");
if (fs.existsSync(EXERCISES)) {
  const filesOf = (dir, base = "") => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) return /^(bin|obj|\.vs|\.idea)$/i.test(e.name) ? [] : filesOf(path.join(dir, e.name), rel);
    const m = e.name.match(/^README\.([a-z]{2})\.md$/);
    if (m && m[1] !== lang) return [];
    return [{ rel: m ? (base ? `${base}/README.md` : "README.md") : rel, content: fs.readFileSync(path.join(dir, e.name), "utf8") }];
  });
  const entries = fs.readdirSync(EXERCISES, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  for (const e of entries) {
    if (e.isDirectory()) {
      const rel = `${EXERCISES_DIR}/${e.name}/`;
      if (fs.existsSync(inTarget(rel.replace(/\/$/, "")))) add(rel, "keep", null, "exerciseKept");
      else add(rel, "new", filesOf(path.join(EXERCISES, e.name)), "exercise");
    }
  }
  // The overview of all exercises, in the language of choice.
  const overview = localized(EXERCISES, "README");
  if (overview !== null && readText(inTarget(`${EXERCISES_DIR}/README.md`)) === null) add(`${EXERCISES_DIR}/README.md`, "new", overview);
}
if (withCC) {
  const rel = "CLAUDE.md";
  const cur = readText(inTarget(rel));
  if (cur === null) add(rel, "new", localized(path.join(HARNESS, "templates"), "CLAUDE.project"), "claudeNew");
  else if (cur.split(/\r?\n/).some((l) => l.trim() === IMPORT_LINE)) add(rel, "keep", null, "yours");
  else add(rel, "append", cur.replace(/\s*$/, "\n\n") + IMPORT_LINE + "\n", "importAdded");
}
if (withOC) {
  // AGENTS.md is the learner's: only the marked block is the harness's. A new file gets the block and room for your own.
  const rel = "AGENTS.md";
  const cur = readText(inTarget(rel));
  const block = agentsBlock();
  if (cur === null) add(rel, "new", `# AGENTS.md\n\n${block}\n\n${t("install.agentsOwn")}\n`, "agentsNew");
  else {
    const a = cur.indexOf(AGENTS_BEGIN), b = cur.indexOf(AGENTS_END);
    const next = a !== -1 && b > a ? cur.slice(0, a) + block + cur.slice(b + AGENTS_END.length) : cur.replace(/\s*$/, "\n\n") + block + "\n";
    if (next === cur) add(rel, "same");
    else add(rel, a !== -1 ? "replace" : "append", next, "agentsBlock");
  }
}
{
  const rel = ".gitignore";
  const cur = readText(inTarget(rel));
  const next = withGitignore(cur);
  if (next === null) add(rel, "same");
  else add(rel, cur === null ? "new" : "append", next, cur === null ? "gitignore" : "gitignoreBackup");
}

// The most recently active session in the target, when it was active within idleMinutes (default 20):
// { minutes, idle }, or null. Active = the last prompt or "!" run (lastActiveAt, lastPromptAt) or the
// last write of the session file by a hook. The hooks cannot tell practice from talk about the harness,
// so any session in the folder counts.
function activeSession(now = Date.now()) {
  const idleSetting = Number(existingSettings?.idleMinutes);
  const idle = idleSetting > 0 ? idleSetting : 20;
  let dir;
  try { dir = learningDir ? path.join(learningDir, "state") : inTarget(".learning/state"); } catch { return null; }
  let files = [];
  try { files = fs.readdirSync(dir).filter((f) => /^session-.*\.json$/.test(f)); } catch { return null; }
  let last = 0;
  for (const f of files) {
    const p = path.join(dir, f);
    let seen = 0;
    try { seen = fs.statSync(p).mtimeMs; } catch { continue; }
    try {
      const st = JSON.parse(fs.readFileSync(p, "utf8"));
      for (const k of ["lastActiveAt", "lastPromptAt"]) if (Number(st?.[k]) > seen) seen = Number(st[k]);
    } catch { /* an unreadable session file still counts by its time */ }
    if (seen > last) last = seen;
  }
  const ago = now - last;
  return last && ago >= 0 && ago < idle * 60000 ? { minutes: Math.floor(ago / 60000), idle } : null;
}

// ---------- 5. Show, confirm, apply ----------
const changes = plan.filter((p) => !["same", "keep"].includes(p.action));
console.log(t("install.head", { version: VERSION, mode: t(opts.update ? "install.mode.update" : "install.mode.install"), dir: TARGET }));
console.log(t("install.mapLang", { map: mapId, lang, legacy: legacy ? t("install.legacy") : "" })
  + (opts.host !== "claude-code" ? t("install.hostLine", { host: opts.host }) : "") + "\n");
const label = (a) => t(`install.action.${a}`);
const width = Math.max(...plan.map((p) => label(p.action).length));
for (const p of plan) console.log(`  ${label(p.action).padEnd(width)}  ${p.rel}${p.note ? `  (${p.note})` : ""}`);
for (const n of [...new Set(notes)]) console.log("\n" + t("install.notice", { text: n }));

if (!changes.length) { console.log("\n" + t("install.upToDate")); process.exit(0); }

// A practice session that is running now: its rules and hooks would change under it (#30).
const session = opts.update ? activeSession() : null;
if (session) {
  console.log("\n" + t("install.sessionActive", { min: session.minutes, idle: session.idle }));
  if (!opts.dryRun && !opts.force) {
    if (opts.yes || !process.stdin.isTTY) { console.log(t("install.sessionStop", { idle: session.idle })); process.exit(1); }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = (await rl.question(t("install.sessionConfirm") + " ")).trim().toLowerCase();
    rl.close();
    if (!["j", "ja", "y", "yes"].includes(answer)) { console.log(t("install.aborted")); process.exit(0); }
  } else if (opts.force && !opts.dryRun) console.log(t("install.sessionForced"));
}
if (opts.dryRun) { console.log("\n" + t("install.dryRun")); process.exit(0); }
if (!opts.yes) {
  if (!process.stdin.isTTY) { console.log("\n" + t("install.needYes")); process.exit(0); }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question("\n" + t("install.confirm") + " ")).trim().toLowerCase();
  rl.close();
  if (!["j", "ja", "y", "yes"].includes(answer)) { console.log(t("install.aborted")); process.exit(0); }
}

const stamp = new Date().toISOString().replace(/[:]/g, "-").replace(/\..*$/, "");
const backupRoot = `${withCC ? BACKUP_DIR : OC_BACKUP_DIR}/${stamp}`;
let backups = 0;
for (const p of changes) {
  const abs = inTarget(p.rel.replace(/\/$/, ""));
  if (["replace", "delete", "merge", "append"].includes(p.action) && fs.existsSync(abs)) {
    const dest = inTarget(`${backupRoot}/${p.rel}`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(abs, dest);
    backups++;
  }
}
for (const p of changes) {
  const abs = inTarget(p.rel.replace(/\/$/, ""));
  if (p.action === "mkdir") fs.mkdirSync(abs, { recursive: true });
  else if (p.action === "delete") fs.rmSync(abs);
  else if (Array.isArray(p.content)) {
    // A folder with its files (an exercise).
    for (const f of p.content) {
      const dest = inTarget(p.rel + f.rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, f.content);
    }
  }
  else {
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, p.content);
  }
}
const now = new Date().toISOString();
// One manifest per host, each with its own files (both hosts can share one folder and one record).
for (const [on, rel, prefix, m, host] of [[withCC, MANIFEST, ".claude/", ccManifest, "claude-code"], [withOC, OC_MANIFEST, ".opencode/", ocManifest, "opencode"]]) {
  if (!on) continue;
  const files = Object.fromEntries([...code].filter(([r]) => r.startsWith(prefix)).map(([r, c]) => [r, sha256(c)]));
  fs.writeFileSync(inTarget(rel), JSON.stringify({
    name: "leerharnas", version: VERSION, map: mapId, language: lang, ...(host === "opencode" ? { host } : {}),
    installedAt: m?.installedAt ?? now, updatedAt: now, files,
  }, null, 2) + "\n");
}

console.log("\n" + t("install.done", { n: changes.length, backup: backups ? t("install.doneBackup", { dir: backupRoot }) : "" }));
if (!opts.update && withCC) console.log(t("install.next", { dir: TARGET }));
if (!opts.update && !withCC) console.log(hostText(t("install.next", { dir: TARGET }), "opencode"));
if (!opts.update && fs.existsSync(EXERCISES)) console.log(t("install.nextExercises", { dir: EXERCISES_DIR }));
