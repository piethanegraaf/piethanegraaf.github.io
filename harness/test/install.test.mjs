// install.mjs: shows first, never overwrites without a backup, --update never touches data.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { HARNESS, run, decision } from "./helpers.mjs";

const INSTALL = path.join(HARNESS, "install.mjs");
// The installed hooks must find their project on their own: no test variables.
const cleanEnv = () => { const e = { ...process.env }; delete e.LEERHARNAS_ROOT; delete e.LEERHARNAS_DATA; return e; };
const install = (target, ...args) => run(INSTALL, [target, ...args], { env: cleanEnv() });
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-install-"));
const read = (dir, rel) => fs.readFileSync(path.join(dir, rel), "utf8");
const exists = (dir, rel) => fs.existsSync(path.join(dir, rel));
const listAll = (dir) => fs.readdirSync(dir, { recursive: true }).map((f) => String(f).split(path.sep).join("/")).sort();

test("without --yes it only shows the plan and writes nothing", () => {
  const d = tmp();
  try {
    const r = install(d);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /nieuw\s+\.claude\/hooks\/guard\.mjs/);
    assert.match(r.stdout, /--yes/);
    assert.deepEqual(listAll(d), []);
    assert.deepEqual(listAll((install(d, "--dry-run", "--yes"), d)), [], "--dry-run wins over --yes");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("a fresh install: code, data from the map, settings with $CLAUDE_PROJECT_DIR, CLAUDE.md, .gitignore", () => {
  const d = tmp();
  try {
    const r = install(d, "--course", "OOD", "--exam", "2027-01-20", "--yes");
    assert.equal(r.code, 0, r.stderr);
    for (const f of ["guard.mjs", "lib.mjs", "prompt-gate.mjs", "reflect-gate.mjs", "session-start.mjs", "skill.mjs", "check.mjs"]) {
      assert.ok(exists(d, `.claude/hooks/${f}`), f);
    }
    assert.ok(exists(d, ".claude/skills/diary/SKILL.md"));
    assert.match(read(d, ".claude/skills/mastery-check/SKILL.md"), /^---\r?\nname: mastery-check\r?\n[\s\S]*\[transfer-start <id>\]/);
    assert.match(read(d, ".claude/agents/demotie-analist.md"), /^---\r?\nname: demotie-analist\r?\n/);
    assert.match(read(d, ".claude/leerharnas.md"), /Over dit vak/);
    assert.ok(exists(d, ".learning/diary"));

    const settings = JSON.parse(read(d, ".claude/settings.json"));
    const cmds = Object.values(settings.hooks).flat().flatMap((g) => g.hooks.map((h) => h.command));
    // Five hooks since the review of 13 Nov, night (#56: SessionEnd).
    assert.equal(cmds.length, 5);
    assert.match(settings.hooks.SessionEnd[0].hooks[0].command, /session-end\.mjs"$/);
    for (const c of cmds) assert.match(c, /^node "\$CLAUDE_PROJECT_DIR\/\.claude\/hooks\/[a-z-]+\.mjs"$/);
    assert.equal(settings.hooks.PreToolUse[0].matcher, "Edit|Write|MultiEdit|NotebookEdit|Bash|PowerShell");
    assert.ok(!read(d, ".claude/settings.json").includes(d), "no absolute paths");
    assert.equal(settings.promptSuggestionEnabled, false, "prompt suggestions can give away hints (setup review §4)");

    const skills = JSON.parse(read(d, ".learning/skills.json"));
    assert.equal(skills.settings.course, "OOD");
    assert.equal(skills.settings.examDate, "2027-01-20");
    assert.equal(skills.settings.language, "nl");
    assert.ok(skills.skills.every((s) => !s.history && !s.evidence && !s.parent), "a map has no progress");

    assert.match(read(d, "CLAUDE.md"), /^@\.claude\/leerharnas\.md$/m);
    assert.match(read(d, ".gitignore"), /^\.learning\/$/m);
    const manifest = JSON.parse(read(d, ".claude/leerharnas.json"));
    assert.equal(manifest.map, "ood");
    assert.ok(manifest.files[".claude/hooks/guard.mjs"]);

    assert.match(install(d, "--yes").stderr, /--update/, "a second install is refused");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("--lang en: English rules, diary skill, titles and messages", () => {
  const d = tmp();
  try {
    const plan = install(d, "--lang", "en");
    assert.match(plan.stdout, /^Learning harness .* · installing in /);
    assert.match(plan.stdout, /new\s+\.claude\/hooks\/guard\.mjs/);
    assert.match(plan.stdout, /Run it again with --yes/);
    assert.match(install(d, "--lang", "en", "--exam", "tomorrow").stderr, /^Error: --exam must be YYYY-MM-DD/);
    const r = install(d, "--lang", "en", "--yes");
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /Done: \d+ change\(s\)\.[\s\S]*Next steps:/);
    assert.match(read(d, ".claude/leerharnas.md"), /^# Learning harness/);
    assert.match(read(d, ".claude/leerharnas.md"), /About this course/);
    assert.match(read(d, ".claude/skills/diary/SKILL.md"), /<!-- session: <session-id> -->/);
    assert.match(read(d, "CLAUDE.md"), /Own agreements/);
    assert.ok(exists(d, ".claude/hooks/i18n/en.json") && exists(d, ".claude/hooks/i18n/nl.json"));
    const skills = JSON.parse(read(d, ".learning/skills.json"));
    assert.equal(skills.settings.language, "en");
    assert.equal(skills.skills.find((s) => s.id === "ood.overerving").title, "Inheritance, : base(...), abstract, override");
    assert.match(skills._info, /^Skill map/);
    const start = run(path.join(d, ".claude/hooks/session-start.mjs"), [], { env: cleanEnv(), cwd: d, input: "{}" });
    assert.match(start.json.systemMessage, /^Learning harness: 29 skills/);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("the installed hooks work in the target folder", () => {
  const d = tmp();
  try {
    install(d, "--yes");
    const guard = (rel) => run(path.join(d, ".claude/hooks/guard.mjs"), [], {
      env: cleanEnv(), cwd: d,
      input: JSON.stringify({ tool_name: "Write", tool_input: { file_path: path.join(d, rel), content: "" }, cwd: d }),
    });
    assert.equal(decision(guard("ood-opdrachten-01/05-de-auto/Auto/Auto.cs")), "deny");
    assert.equal(decision(guard("voorbeelden/ood.overerving/Dier.cs")), "allow");
    assert.equal(decision(guard(".claude/settings.json")), "deny");
    // The build patterns come from the map's settings: a build in an L2 folder is blocked too.
    const bash = (command, rel) => run(path.join(d, ".claude/hooks/guard.mjs"), [], {
      env: cleanEnv(), cwd: d,
      input: JSON.stringify({ tool_name: "Bash", tool_input: { command }, cwd: path.join(d, rel) }),
    });
    assert.equal(decision(bash("dotnet build", "ood-opdrachten-01/05-de-auto")), "deny");
    assert.equal(decision(bash("dotnet test", "ood-opdrachten-01/05-de-auto")), "deny");
    assert.equal(decision(bash("dotnet --info", "ood-opdrachten-01/05-de-auto")), "allow");
    const start = run(path.join(d, ".claude/hooks/session-start.mjs"), [], { env: cleanEnv(), cwd: d, input: "{}" });
    assert.match(start.json.hookSpecificOutput.additionalContext, /LEERHARNAS ACTIEF/);
    const list = run(path.join(d, ".claude/hooks/skill.mjs"), ["list"], { env: cleanEnv(), cwd: d });
    assert.match(list.stdout, /ood\.overerving/);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("the junior-dotnet map: unmapped code is L4, the skills being learned are protected", () => {
  const d = tmp();
  try {
    const r = install(d, "--map", "junior-dotnet", "--lang", "en", "--yes");
    assert.equal(r.code, 0, r.stderr);
    const skills = JSON.parse(read(d, ".learning/skills.json"));
    assert.equal(skills.settings.defaultLevel, "L4");
    assert.equal(skills.settings.language, "en");
    assert.match(skills._info, /^Example skill map for a junior developer at work/);
    assert.equal(skills.skills.find((s) => s.id === "web.api").title, "ASP.NET Core APIs: controllers or minimal APIs, routing, model binding, status codes");
    assert.equal(JSON.parse(read(d, ".claude/leerharnas.json")).map, "junior-dotnet");
    assert.match(read(d, ".claude/leerharnas.md"), /About this map: a junior developer at work/);
    const guard = (tool_input, cwd = d) => run(path.join(d, ".claude/hooks/guard.mjs"), [], {
      env: cleanEnv(), cwd: d,
      input: JSON.stringify({ tool_name: tool_input.command ? "Bash" : "Write", tool_input, cwd }),
    });
    const write = (rel) => guard({ file_path: path.join(d, rel), content: "" });
    assert.equal(decision(write("src/Shop/Domain/Order.cs")), "allow", "unmapped: L4, the AI may write it");
    assert.equal(decision(write("src/Shop.Api/Controllers/OrdersController.cs")), "deny", "web.api: L2 until placed");
    assert.equal(decision(write("tests/Shop.Tests/OrderTests.cs")), "deny", "test.unit: L2 until placed");
    assert.equal(decision(write("voorbeelden/cs.async/Demo.cs")), "allow", "the examples zone");
    assert.equal(decision(guard({ command: "dotnet test" }, path.join(d, "tests/Shop.Tests"))), "deny");
    assert.equal(decision(guard({ command: "dotnet build" }, path.join(d, "src/Shop/Domain"))), "allow");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("--update replaces code with a backup, and never touches data or your CLAUDE.md", () => {
  const d = tmp();
  try {
    install(d, "--yes");
    fs.appendFileSync(path.join(d, ".claude/hooks/guard.mjs"), "\n// eigen aanpassing\n");
    const skills = read(d, ".learning/skills.json").replace('"level": "L2"', '"level": "L3"');
    fs.writeFileSync(path.join(d, ".learning/skills.json"), skills);
    fs.writeFileSync(path.join(d, ".learning/keywords.json"), "{\"eigen\": [\"x\"]}\n");
    fs.writeFileSync(path.join(d, "CLAUDE.md"), "# Mijn afspraken\n\n@.claude/leerharnas.md\n");

    const plan = install(d, "--update");
    assert.match(plan.stdout, /vervangen\s+\.claude\/hooks\/guard\.mjs\s+\(lokaal aangepast, backup\)/);
    assert.match(plan.stdout, /behouden\s+\.learning\/skills\.json/);

    const r = install(d, "--update", "--yes");
    assert.equal(r.code, 0, r.stderr);
    assert.ok(!read(d, ".claude/hooks/guard.mjs").includes("eigen aanpassing"));
    assert.equal(read(d, ".learning/skills.json"), skills);
    assert.equal(read(d, ".learning/keywords.json"), "{\"eigen\": [\"x\"]}\n");
    assert.equal(read(d, "CLAUDE.md"), "# Mijn afspraken\n\n@.claude/leerharnas.md\n");
    const backups = listAll(path.join(d, ".claude/leerharnas-backup"));
    const saved = backups.find((f) => f.endsWith(".claude/hooks/guard.mjs"));
    assert.ok(saved, "backup of the changed hook");
    assert.match(fs.readFileSync(path.join(d, ".claude/leerharnas-backup", saved), "utf8"), /eigen aanpassing/);

    assert.match(install(d, "--update", "--yes").stdout, /Alles is al bijgewerkt/);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("--update of an older install: absolute hook paths are replaced, your own settings and hooks stay", () => {
  const d = tmp();
  try {
    fs.mkdirSync(path.join(d, ".claude/hooks"), { recursive: true });
    fs.writeFileSync(path.join(d, ".claude/hooks/guard.mjs"), "// oud\n");
    const abs = path.join(d, ".claude/hooks").split(path.sep).join("/");
    fs.writeFileSync(path.join(d, ".claude/settings.json"), JSON.stringify({
      permissions: { allow: ["Bash(git status)"] },
      promptSuggestionEnabled: true,
      hooks: {
        PreToolUse: [
          { matcher: "Edit|Write", hooks: [{ type: "command", command: `node "${abs}/guard.mjs"` }] },
          { matcher: "Bash", hooks: [{ type: "command", command: "node scripts/eigen-hook.mjs" }] },
        ],
        Stop: [{ hooks: [{ type: "command", command: `node "${abs}/reflect-gate.mjs"` }] }],
      },
    }, null, 2));
    fs.writeFileSync(path.join(d, "CLAUDE.md"), "# Eigen\n");

    const r = install(d, "--update", "--yes");
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /oudere installatie/);
    const s = JSON.parse(read(d, ".claude/settings.json"));
    assert.deepEqual(s.permissions, { allow: ["Bash(git status)"] });
    assert.equal(s.promptSuggestionEnabled, true, "your own choice stays");
    const cmds = Object.values(s.hooks).flat().flatMap((g) => g.hooks.map((h) => h.command));
    assert.ok(cmds.includes("node scripts/eigen-hook.mjs"));
    assert.ok(!cmds.some((c) => c.includes(abs)), "absolute paths are gone");
    assert.equal(cmds.filter((c) => c.includes("$CLAUDE_PROJECT_DIR")).length, 5);
    assert.match(read(d, "CLAUDE.md"), /^# Eigen\n\n@\.claude\/leerharnas\.md\n$/);
    assert.ok(exists(d, ".learning/skills.json"), "missing data is created");
    const backups = listAll(path.join(d, ".claude/leerharnas-backup"));
    for (const f of [".claude/settings.json", "CLAUDE.md", ".claude/hooks/guard.mjs"]) assert.ok(backups.some((b) => b.endsWith(f)), f);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("refuses: invalid settings.json, update without install, unknown options, the harness folder itself", () => {
  const d = tmp();
  try {
    fs.mkdirSync(path.join(d, ".claude"), { recursive: true });
    fs.writeFileSync(path.join(d, ".claude/settings.json"), "{ kapot");
    const r = install(d, "--yes");
    assert.equal(r.code, 1);
    assert.match(r.stderr, /geen geldige JSON/);
    assert.deepEqual(listAll(d), [".claude", ".claude/settings.json"], "nothing was written");
    assert.match(install(tmp(), "--update").stderr, /nog geen harnas/);
    assert.match(install(d, "--wat").stderr, /onbekende optie/);
    assert.match(install(d, "--exam", "morgen").stderr, /JJJJ-MM-DD/);
    assert.match(install(HARNESS, "--yes").stderr, /harnas-map zelf/);
    assert.match(install(path.join(d, "bestaat-niet")).stderr, /bestaat niet/);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});
