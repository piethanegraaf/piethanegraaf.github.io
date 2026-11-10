#!/usr/bin/env node
// Leerharnas installer. No dependencies, no network, no shell: it only copies files into the target folder.
//
//   node harness/install.mjs <doelmap> [--map ood] [--lang nl|en] [--course "<vak>"] [--exam JJJJ-MM-DD] [--dry-run] [--yes]
//   node harness/install.mjs <doelmap> --update [--dry-run] [--yes]
//
// - It first shows what will happen. It only changes files with --yes, or after "j" in an interactive terminal.
// - Every existing file that changes is first copied to .claude/leerharnas-backup/<tijd>/.
// - --update replaces the harness code (hooks, diary skill, .claude/leerharnas.md) and merges the hooks into
//   .claude/settings.json. It never replaces data (.learning/) and never your own CLAUDE.md.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { t, setLanguage } from "./hooks/i18n.mjs";

const HARNESS = path.dirname(fileURLToPath(import.meta.url));
const VERSION = JSON.parse(fs.readFileSync(path.join(HARNESS, "package.json"), "utf8")).version;
const MANIFEST = ".claude/leerharnas.json";
const BACKUP_DIR = ".claude/leerharnas-backup";
const IMPORT_LINE = "@.claude/leerharnas.md";
const LANGS = ["nl", "en"];
const HOOKS = [
  { event: "SessionStart", script: "session-start.mjs" },
  { event: "UserPromptSubmit", script: "prompt-gate.mjs" },
  { event: "Stop", script: "reflect-gate.mjs" },
  { event: "PreToolUse", script: "guard.mjs", matcher: "Edit|Write|MultiEdit|NotebookEdit|Bash|PowerShell" },
];
// A hook command of this harness, also an older one with an absolute path.
const HARNESS_CMD = /(^|[\s"'\\/])\.claude[\\/]hooks[\\/](session-start|prompt-gate|reflect-gate|guard)\.mjs/i;
const hookCommand = (script) => `node "$CLAUDE_PROJECT_DIR/.claude/hooks/${script}"`;

const fail = (key, vars) => { console.error(t("install.error", { msg: t(key, vars) })); process.exit(1); };
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const readText = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };

// ---------- 1. Arguments ----------
function parseArgs(argv) {
  const o = { target: null, update: false, dryRun: false, yes: false, map: null, lang: null, course: null, exam: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => { if (i + 1 >= argv.length) fail("install.needsValue", { opt: a }); return argv[++i]; };
    if (a === "--update") o.update = true;
    else if (a === "--dry-run") o.dryRun = true;
    else if (a === "--yes" || a === "-y") o.yes = true;
    else if (a === "--map") o.map = val();
    else if (a === "--lang") o.lang = val();
    else if (a === "--course") o.course = val();
    else if (a === "--exam") o.exam = val();
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
const TARGET = path.resolve(opts.target);
if (!fs.existsSync(TARGET) || !fs.statSync(TARGET).isDirectory()) fail("install.noTarget", { dir: TARGET });
{
  const r = path.relative(HARNESS, TARGET);
  if (!r.startsWith("..") && !path.isAbsolute(r)) fail("install.selfTarget");
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
let manifest = null;
const manifestText = readText(inTarget(MANIFEST));
if (manifestText !== null) {
  try { manifest = JSON.parse(manifestText); } catch { fail("install.badManifest", { file: MANIFEST }); }
}
const legacy = !manifest && fs.existsSync(inTarget(".claude/hooks/guard.mjs"));
if (!opts.update && (manifest || legacy)) fail("install.already");
if (opts.update && !manifest && !legacy) fail("install.notInstalled");

let existingSettings = null;
try { existingSettings = JSON.parse(readText(inTarget(".learning/skills.json")) ?? "null")?.settings ?? null; } catch { /* data stays untouched */ }

const lang = opts.lang ?? manifest?.language ?? existingSettings?.language ?? "nl";
const mapId = opts.map ?? manifest?.map ?? "ood";
setLanguage(lang);
if (!LANGS.includes(lang)) fail("install.badLang");
if (!/^[a-z0-9-]+$/.test(mapId) || !fs.existsSync(path.join(HARNESS, "maps", mapId, "skills.json"))) fail("install.badMap", { map: mapId });
if (opts.exam !== null && !/^\d{4}-\d{2}-\d{2}$/.test(opts.exam)) fail("install.badExam");
if (opts.course !== null && !/^[^\r\n<>]{1,80}$/.test(opts.course)) fail("install.badCourse");
if (opts.update && (opts.exam !== null || opts.course !== null)) fail("install.updateNoSettings");

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

// ---------- 3. What the files should look like ----------
const notes = [];
const code = new Map(); // rel -> content (owned by the harness, replaced on update)
for (const f of fs.readdirSync(path.join(HARNESS, "hooks")).filter((f) => f.endsWith(".mjs")).sort()) {
  code.set(`.claude/hooks/${f}`, fs.readFileSync(path.join(HARNESS, "hooks", f), "utf8"));
}
// Messages for all languages, so `skill.mjs setting language` works without reinstalling.
for (const f of fs.readdirSync(path.join(HARNESS, "i18n")).filter((f) => /^[a-z]{2}\.json$/.test(f)).sort()) {
  code.set(`.claude/hooks/i18n/${f}`, fs.readFileSync(path.join(HARNESS, "i18n", f), "utf8"));
}
const skill = localized(path.join(HARNESS, "skills", "diary"), "SKILL");
if (skill === null) fail("install.noSkill");
code.set(".claude/skills/diary/SKILL.md", skill);
const rules = localized(path.join(HARNESS, "templates"), "leerharnas");
if (rules === null) fail("install.noRules");
const mapNotes = localized(path.join(HARNESS, "maps", mapId), "notes");
code.set(".claude/leerharnas.md", rules.trimEnd() + "\n" + (mapNotes ? "\n" + mapNotes.trimEnd() + "\n" : ""));

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
  const missing = [".learning/", `${BACKUP_DIR}/`].filter((l) => !lines.includes(l) && !lines.includes("/" + l));
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
for (const rel of Object.keys(manifest?.files ?? {})) {
  if (!code.has(rel) && readText(inTarget(rel)) !== null) add(rel, "delete", null, "obsolete");
}
{
  const rel = ".claude/settings.json";
  const cur = readText(inTarget(rel));
  const next = mergeSettings(cur);
  if (cur === null) add(rel, "new", next, "hooks");
  else if (cur === next) add(rel, "same");
  else add(rel, "merge", next, "mergeSettings");
}
for (const [rel, make] of [[".learning/skills.json", initialSkills], [".learning/keywords.json", () => fs.readFileSync(path.join(HARNESS, "maps", mapId, "keywords.json"), "utf8")]]) {
  if (readText(inTarget(rel)) === null) add(rel, "new", make(), "map");
  else add(rel, "keep", null, "data");
}
if (!fs.existsSync(inTarget(".learning/diary"))) add(".learning/diary/", "mkdir", null);
{
  const rel = "CLAUDE.md";
  const cur = readText(inTarget(rel));
  if (cur === null) add(rel, "new", localized(path.join(HARNESS, "templates"), "CLAUDE.project"), "claudeNew");
  else if (cur.split(/\r?\n/).some((l) => l.trim() === IMPORT_LINE)) add(rel, "keep", null, "yours");
  else add(rel, "append", cur.replace(/\s*$/, "\n\n") + IMPORT_LINE + "\n", "importAdded");
}
{
  const rel = ".gitignore";
  const cur = readText(inTarget(rel));
  const next = withGitignore(cur);
  if (next === null) add(rel, "same");
  else add(rel, cur === null ? "new" : "append", next, cur === null ? "gitignore" : "gitignoreBackup");
}

// ---------- 5. Show, confirm, apply ----------
const changes = plan.filter((p) => !["same", "keep"].includes(p.action));
console.log(t("install.head", { version: VERSION, mode: t(opts.update ? "install.mode.update" : "install.mode.install"), dir: TARGET }));
console.log(t("install.mapLang", { map: mapId, lang, legacy: legacy ? t("install.legacy") : "" }) + "\n");
const label = (a) => t(`install.action.${a}`);
const width = Math.max(...plan.map((p) => label(p.action).length));
for (const p of plan) console.log(`  ${label(p.action).padEnd(width)}  ${p.rel}${p.note ? `  (${p.note})` : ""}`);
for (const n of [...new Set(notes)]) console.log("\n" + t("install.notice", { text: n }));

if (!changes.length) { console.log("\n" + t("install.upToDate")); process.exit(0); }
if (opts.dryRun) { console.log("\n" + t("install.dryRun")); process.exit(0); }
if (!opts.yes) {
  if (!process.stdin.isTTY) { console.log("\n" + t("install.needYes")); process.exit(0); }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question("\n" + t("install.confirm") + " ")).trim().toLowerCase();
  rl.close();
  if (!["j", "ja", "y", "yes"].includes(answer)) { console.log(t("install.aborted")); process.exit(0); }
}

const stamp = new Date().toISOString().replace(/[:]/g, "-").replace(/\..*$/, "");
const backupRoot = `${BACKUP_DIR}/${stamp}`;
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
  else {
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, p.content);
  }
}
const now = new Date().toISOString();
const files = Object.fromEntries([...code].map(([rel, c]) => [rel, sha256(c)]));
fs.writeFileSync(inTarget(MANIFEST), JSON.stringify({
  name: "leerharnas", version: VERSION, map: mapId, language: lang,
  installedAt: manifest?.installedAt ?? now, updatedAt: now, files,
}, null, 2) + "\n");

console.log("\n" + t("install.done", { n: changes.length, backup: backups ? t("install.doneBackup", { dir: backupRoot }) : "" }));
if (!opts.update) console.log(t("install.next", { dir: TARGET }));
