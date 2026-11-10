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

const fail = (msg) => { console.error(`Fout: ${msg}`); process.exit(1); };
const sha256 = (s) => crypto.createHash("sha256").update(s).digest("hex");
const readText = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };

// ---------- 1. Arguments ----------
function parseArgs(argv) {
  const o = { target: null, update: false, dryRun: false, yes: false, map: null, lang: null, course: null, exam: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => { if (i + 1 >= argv.length) fail(`${a} heeft een waarde nodig`); return argv[++i]; };
    if (a === "--update") o.update = true;
    else if (a === "--dry-run") o.dryRun = true;
    else if (a === "--yes" || a === "-y") o.yes = true;
    else if (a === "--map") o.map = val();
    else if (a === "--lang") o.lang = val();
    else if (a === "--course") o.course = val();
    else if (a === "--exam") o.exam = val();
    else if (a === "--help" || a === "-h") { usage(); process.exit(0); }
    else if (a.startsWith("-")) fail(`onbekende optie ${a}`);
    else if (!o.target) o.target = a;
    else fail(`onverwacht argument ${a}`);
  }
  return o;
}

function usage() {
  console.log(`Gebruik:
  node harness/install.mjs <doelmap> [--map ood] [--lang nl|en] [--course "<vak>"] [--exam JJJJ-MM-DD] [--dry-run] [--yes]
  node harness/install.mjs <doelmap> --update [--dry-run] [--yes]

Zonder --yes toont het script alleen wat er zou gebeuren.`);
}

const opts = parseArgs(process.argv.slice(2));
if (!opts.target) { usage(); process.exit(1); }
const TARGET = path.resolve(opts.target);
if (!fs.existsSync(TARGET) || !fs.statSync(TARGET).isDirectory()) fail(`de doelmap bestaat niet: ${TARGET}`);
{
  const r = path.relative(HARNESS, TARGET);
  if (!r.startsWith("..") && !path.isAbsolute(r)) fail("installeer niet in de harnas-map zelf");
}

// Every path this script writes must stay inside the target folder.
function inTarget(rel) {
  if (typeof rel !== "string" || !/^[\w.@-]+(\/[\w.@-]+)*$/.test(rel) || rel.split("/").includes("..")) fail(`ongeldig pad ${rel}`);
  const abs = path.resolve(TARGET, rel);
  const r = path.relative(TARGET, abs);
  if (!r || r.startsWith("..") || path.isAbsolute(r)) fail(`pad buiten de doelmap: ${rel}`);
  return abs;
}

// ---------- 2. Current state of the target ----------
let manifest = null;
const manifestText = readText(inTarget(MANIFEST));
if (manifestText !== null) {
  try { manifest = JSON.parse(manifestText); } catch { fail(`${MANIFEST} is geen geldige JSON. Herstel of verwijder het bestand.`); }
}
const legacy = !manifest && fs.existsSync(inTarget(".claude/hooks/guard.mjs"));
if (!opts.update && (manifest || legacy)) fail("de harnas staat al in deze map. Gebruik --update om de code bij te werken.");
if (opts.update && !manifest && !legacy) fail("er staat nog geen harnas in deze map. Installeer eerst zonder --update.");

let existingSettings = null;
try { existingSettings = JSON.parse(readText(inTarget(".learning/skills.json")) ?? "null")?.settings ?? null; } catch { /* data stays untouched */ }

const lang = opts.lang ?? manifest?.language ?? existingSettings?.language ?? "nl";
const mapId = opts.map ?? manifest?.map ?? "ood";
if (!LANGS.includes(lang)) fail(`taal moet ${LANGS.join(" of ")} zijn`);
if (!/^[a-z0-9-]+$/.test(mapId) || !fs.existsSync(path.join(HARNESS, "maps", mapId, "skills.json"))) fail(`onbekende kaart '${mapId}'`);
if (opts.exam !== null && !/^\d{4}-\d{2}-\d{2}$/.test(opts.exam)) fail("--exam moet JJJJ-MM-DD zijn");
if (opts.course !== null && !/^[^\r\n<>]{1,80}$/.test(opts.course)) fail("--course: hooguit 80 tekens, zonder < of >");
if (opts.update && (opts.exam !== null || opts.course !== null)) fail("--exam en --course gelden alleen bij installeren. Gebruik daarna `skill.mjs setting`.");

// A file in the language of choice; falls back to Dutch while a translation is missing.
function localized(dir, base) {
  for (const l of [lang, "nl"]) {
    const p = path.join(dir, `${base}.${l}.md`);
    if (fs.existsSync(p)) {
      if (l !== lang) notes.push(`${path.relative(HARNESS, p)}: nog geen vertaling in '${lang}', de Nederlandse versie wordt gebruikt.`);
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
const skill = localized(path.join(HARNESS, "skills", "diary"), "SKILL");
if (skill === null) fail("de diary-skill ontbreekt in de harnas");
code.set(".claude/skills/diary/SKILL.md", skill);
const rules = localized(path.join(HARNESS, "templates"), "leerharnas");
if (rules === null) fail("templates/leerharnas.<taal>.md ontbreekt");
const mapNotes = localized(path.join(HARNESS, "maps", mapId), "notes");
code.set(".claude/leerharnas.md", rules.trimEnd() + "\n" + (mapNotes ? "\n" + mapNotes.trimEnd() + "\n" : ""));

function mergeSettings(text) {
  let cfg = {};
  if (text !== null) {
    try { cfg = JSON.parse(text); } catch { fail(".claude/settings.json is geen geldige JSON. Herstel het bestand eerst; er is niets gewijzigd."); }
    if (!cfg || typeof cfg !== "object" || Array.isArray(cfg)) fail(".claude/settings.json moet een JSON-object zijn");
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
  return JSON.stringify({ ...cfg, hooks }, null, 2) + "\n";
}

function initialSkills() {
  const map = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", mapId, "skills.json"), "utf8"));
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
  return head + "# Leerharnas: persoonlijke leerdata en backups niet delen\n" + missing.join("\n") + "\n";
}

// ---------- 4. The plan ----------
const plan = [];
const add = (rel, action, content, note = "") => plan.push({ rel, action, content, note });

for (const [rel, content] of code) {
  const cur = readText(inTarget(rel));
  if (cur === null) add(rel, "nieuw", content);
  else if (cur === content) add(rel, "ongewijzigd");
  else {
    const changedByUser = manifest?.files?.[rel] && manifest.files[rel] !== sha256(cur);
    add(rel, "vervangen", content, changedByUser || legacy ? "lokaal aangepast, backup" : "backup");
  }
}
for (const rel of Object.keys(manifest?.files ?? {})) {
  if (!code.has(rel) && readText(inTarget(rel)) !== null) add(rel, "verwijderen", null, "niet meer in de harnas, backup");
}
{
  const rel = ".claude/settings.json";
  const cur = readText(inTarget(rel));
  const next = mergeSettings(cur);
  if (cur === null) add(rel, "nieuw", next, "hooks van de harnas");
  else if (cur === next) add(rel, "ongewijzigd");
  else add(rel, "samenvoegen", next, "eigen instellingen blijven, hooks van de harnas bijgewerkt, backup");
}
for (const [rel, make] of [[".learning/skills.json", initialSkills], [".learning/keywords.json", () => fs.readFileSync(path.join(HARNESS, "maps", mapId, "keywords.json"), "utf8")]]) {
  if (readText(inTarget(rel)) === null) add(rel, "nieuw", make(), `kaart '${mapId}'`);
  else add(rel, "behouden", null, "data, wordt nooit vervangen");
}
if (!fs.existsSync(inTarget(".learning/diary"))) add(".learning/diary/", "nieuwe map", null);
{
  const rel = "CLAUDE.md";
  const cur = readText(inTarget(rel));
  if (cur === null) add(rel, "nieuw", localized(path.join(HARNESS, "templates"), "CLAUDE.project"), "van jou, verwijst naar .claude/leerharnas.md");
  else if (cur.split(/\r?\n/).some((l) => l.trim() === IMPORT_LINE)) add(rel, "behouden", null, "van jou");
  else add(rel, "aanvullen", cur.replace(/\s*$/, "\n\n") + IMPORT_LINE + "\n", `regel ${IMPORT_LINE} toegevoegd, backup`);
}
{
  const rel = ".gitignore";
  const cur = readText(inTarget(rel));
  const next = withGitignore(cur);
  if (next === null) add(rel, "ongewijzigd");
  else add(rel, cur === null ? "nieuw" : "aanvullen", next, "leerdata en backups uitsluiten" + (cur === null ? "" : ", backup"));
}

// ---------- 5. Show, confirm, apply ----------
const changes = plan.filter((p) => !["ongewijzigd", "behouden"].includes(p.action));
console.log(`Leerharnas ${VERSION} · ${opts.update ? "bijwerken" : "installeren"} in ${TARGET}`);
console.log(`Kaart: ${mapId} · taal: ${lang}${legacy ? " · oudere installatie zonder manifest gevonden" : ""}\n`);
const width = Math.max(...plan.map((p) => p.action.length));
for (const p of plan) console.log(`  ${p.action.padEnd(width)}  ${p.rel}${p.note ? `  (${p.note})` : ""}`);
for (const n of [...new Set(notes)]) console.log(`\nLet op: ${n}`);

if (!changes.length) { console.log("\nAlles is al bijgewerkt. Er is niets gewijzigd."); process.exit(0); }
if (opts.dryRun) { console.log("\n--dry-run: er is niets gewijzigd."); process.exit(0); }
if (!opts.yes) {
  if (!process.stdin.isTTY) { console.log("\nEr is niets gewijzigd. Draai het opnieuw met --yes om dit uit te voeren."); process.exit(0); }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = (await rl.question("\nDoorgaan? [j/N] ")).trim().toLowerCase();
  rl.close();
  if (!["j", "ja", "y", "yes"].includes(answer)) { console.log("Afgebroken. Er is niets gewijzigd."); process.exit(0); }
}

const stamp = new Date().toISOString().replace(/[:]/g, "-").replace(/\..*$/, "");
const backupRoot = `${BACKUP_DIR}/${stamp}`;
let backups = 0;
for (const p of changes) {
  const abs = inTarget(p.rel.replace(/\/$/, ""));
  if (["vervangen", "verwijderen", "samenvoegen", "aanvullen"].includes(p.action) && fs.existsSync(abs)) {
    const dest = inTarget(`${backupRoot}/${p.rel}`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(abs, dest);
    backups++;
  }
}
for (const p of changes) {
  const abs = inTarget(p.rel.replace(/\/$/, ""));
  if (p.action === "nieuwe map") fs.mkdirSync(abs, { recursive: true });
  else if (p.action === "verwijderen") fs.rmSync(abs);
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

console.log(`\nKlaar: ${changes.length} wijziging(en)${backups ? `, backup in ${backupRoot}/` : ""}.`);
if (!opts.update) {
  console.log(`Volgende stappen:
  1. Start Claude Code in ${TARGET}.
  2. Zet je toetsdatum:  ! node .claude/hooks/skill.mjs setting examDate JJJJ-MM-DD
  3. Bekijk je vaardigheden:  ! node .claude/hooks/skill.mjs list`);
}
