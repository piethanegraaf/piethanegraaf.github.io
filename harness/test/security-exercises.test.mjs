// The security-dotnet practice map: eight exercises in oefeningen/, paths per skill, L2 for the rest, the
// installer that copies them once, and check.mjs that ties a green test in an exercise to its skill.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { HARNESS, run, decision, readJsonl } from "./helpers.mjs";
import { globToRegex } from "../hooks/lib.mjs";

const MAP = path.join(HARNESS, "maps", "security-dotnet");
const EX = path.join(MAP, "exercises");
const INSTALL = path.join(HARNESS, "install.mjs");
const load = (file) => JSON.parse(fs.readFileSync(path.join(MAP, file), "utf8"));
const exercises = () => fs.readdirSync(EX, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort();
const covers = (skill, p) => (skill.paths ?? []).some((g) => globToRegex(g).test(p));
const cleanEnv = () => { const e = { ...process.env }; delete e.LEERHARNAS_ROOT; delete e.LEERHARNAS_DATA; return e; };
const install = (target, ...args) => run(INSTALL, [target, ...args], { env: cleanEnv() });
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-secex-"));

test("security-dotnet: four skills at L2 with paths, L2 for the rest, the analyser on, nothing withheld", () => {
  const map = load("skills.json");
  assert.equal(map.settings.defaultLevel, "L2", "like the OOD map: the AI writes no code outside the exercises either");
  assert.equal(map.settings.securityAnalyzer, true);
  const skills = map.skills.filter((s) => s.kind !== "zone");
  assert.deepEqual(skills.map((s) => s.id), ["security.sql-params", "security.output-encoding", "security.secrets-config", "security.ai-review"]);
  for (const s of skills) {
    assert.equal(s.level, "L2", s.id);
    assert.equal(s.paths.length, 2, `${s.id}: two exercises`);
    assert.ok(!s.sensitive, `${s.id}: practice code, so the explanations may go online`);
  }
  const kw = load("keywords.json");
  for (const s of skills) assert.ok(kw[s.id]?.length >= 5, s.id);
});

test("security-dotnet: eight exercises, each covered by exactly one skill, in both languages, without build output", () => {
  const map = load("skills.json");
  const names = exercises();
  assert.equal(names.length, 8);
  for (const n of names) {
    assert.match(n, /^0[1-8]-[a-z0-9-]+$/, n);
    const owners = map.skills.filter((s) => covers(s, `oefeningen/${n}/Code.cs`));
    assert.equal(owners.length, 1, `${n}: one skill`);
    const files = fs.readdirSync(path.join(EX, n), { recursive: true }).map((f) => String(f).split(path.sep).join("/"));
    for (const f of ["README.nl.md", "README.en.md"]) assert.ok(files.includes(f), `${n}/${f}`);
    assert.equal(files.filter((f) => f.endsWith(".csproj")).length, 1, `${n}: one test project`);
    assert.ok(files.some((f) => /Tests?\.cs$/.test(f)), `${n}: tests`);
    assert.ok(!files.some((f) => /(^|\/)(bin|obj)(\/|$)/.test(f)), `${n}: no build output`);
    const csproj = fs.readFileSync(path.join(EX, n, files.find((f) => f.endsWith(".csproj"))), "utf8");
    assert.match(csproj, /<TargetFramework>net10\.0<\/TargetFramework>/, `${n}: .NET 10 (LTS)`);
  }
  for (const f of ["README.nl.md", "README.en.md"]) assert.ok(fs.existsSync(path.join(EX, f)), f);
  // The skill of each pair: 01-02 SQL, 03-04 output, 05-06 secrets, 07-08 AI review.
  const skillOf = (n) => map.skills.find((s) => covers(s, `oefeningen/${n}/x.cs`))?.id;
  assert.deepEqual(names.map(skillOf), ["security.sql-params", "security.sql-params", "security.output-encoding", "security.output-encoding",
    "security.secrets-config", "security.secrets-config", "security.ai-review", "security.ai-review"]);
});

test("install --map security-dotnet: the exercises in oefeningen/ in the chosen language, and the guard protects them", () => {
  const d = tmp();
  try {
    const r = install(d, "--map", "security-dotnet", "--lang", "en", "--yes");
    assert.equal(r.code, 0, r.stderr);
    for (const n of exercises()) {
      assert.ok(fs.existsSync(path.join(d, "oefeningen", n, "README.md")), n);
      assert.ok(!fs.existsSync(path.join(d, "oefeningen", n, "README.nl.md")), `${n}: one language`);
      assert.equal(fs.readFileSync(path.join(d, "oefeningen", n, "README.md"), "utf8"), fs.readFileSync(path.join(EX, n, "README.en.md"), "utf8"));
    }
    assert.equal(fs.readFileSync(path.join(d, "oefeningen", "README.md"), "utf8"), fs.readFileSync(path.join(EX, "README.en.md"), "utf8"));
    assert.match(r.stdout, /oefeningen\/01-sql-search\//);
    assert.match(r.stdout, /check\.mjs oefeningen\/01-sql-search/);
    const skills = JSON.parse(fs.readFileSync(path.join(d, ".learning", "skills.json"), "utf8"));
    assert.equal(skills.settings.defaultLevel, "L2");
    assert.match(fs.readFileSync(path.join(d, ".claude", "leerharnas.md"), "utf8"), /About this map: secure coding in C#\/.NET/);

    const guard = (tool_input, cwd = d) => run(path.join(d, ".claude/hooks/guard.mjs"), [], {
      env: cleanEnv(), cwd: d, input: JSON.stringify({ tool_name: tool_input.command ? "Bash" : "Write", tool_input, cwd }),
    });
    const first = exercises()[0];
    const code = fs.readdirSync(path.join(d, "oefeningen", first)).find((f) => f.endsWith(".cs"));
    assert.equal(decision(guard({ file_path: path.join(d, "oefeningen", first, code), content: "" })), "deny", "exercise code: L2 until placed");
    assert.equal(decision(guard({ file_path: path.join(d, "src", "Scratch.cs"), content: "" })), "deny", "unmapped code is L2 too");
    assert.equal(decision(guard({ command: "dotnet test" }, path.join(d, "oefeningen", first))), "deny");
    assert.equal(decision(guard({ file_path: path.join(d, "voorbeelden", "x", "Demo.cs"), content: "" })), "allow", "the examples zone");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("install --update: an exercise you worked on stays as it is, a missing one comes back", () => {
  const d = tmp();
  try {
    assert.equal(install(d, "--map", "security-dotnet", "--lang", "nl", "--yes").code, 0);
    const [first, second] = exercises();
    const file = path.join(d, "oefeningen", first, "README.md");
    fs.writeFileSync(file, "mijn eigen aantekeningen");
    fs.rmSync(path.join(d, "oefeningen", second), { recursive: true });
    const r = install(d, "--update", "--yes");
    assert.equal(r.code, 0, r.stderr);
    assert.equal(fs.readFileSync(file, "utf8"), "mijn eigen aantekeningen");
    assert.match(r.stdout, new RegExp(`oefeningen/${first}/\\s+\\(bestaat al: jouw werk blijft staan\\)`));
    assert.equal(fs.readFileSync(path.join(d, "oefeningen", second, "README.md"), "utf8"), fs.readFileSync(path.join(EX, second, "README.nl.md"), "utf8"));
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("the other maps have no exercises: install puts nothing in oefeningen/", () => {
  const d = tmp();
  try {
    assert.equal(install(d, "--map", "junior-dotnet", "--lang", "en", "--yes").code, 0);
    assert.ok(!fs.existsSync(path.join(d, "oefeningen")));
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("check.mjs in an installed exercise: the folder decides the skill, red then green is a task", () => {
  const d = tmp();
  try {
    assert.equal(install(d, "--map", "security-dotnet", "--lang", "nl", "--yes").code, 0);
    const trx = (dir, outcome) => {
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "run.trx"), `<?xml version="1.0"?><TestRun><TestDefinitions><UnitTest name="Search_with_injection_string_returns_no_rows" id="id0"><TestMethod codeBase="x.dll" className="SqlSearch.Tests" name="Search_with_injection_string_returns_no_rows" /></UnitTest></TestDefinitions><Results><UnitTestResult testId="id0" testName="Search_with_injection_string_returns_no_rows" outcome="${outcome}" /></Results></TestRun>`);
      return dir;
    };
    const check = (n, outcome) => run(path.join(d, ".claude/hooks/check.mjs"), [`oefeningen/${exercises()[0]}`],
      { env: { ...cleanEnv(), LEERHARNAS_TRX_DIR: trx(path.join(d, `trx-${n}`), outcome), LEERHARNAS_DOTNET_OUT: "" }, cwd: d });
    let r = check(1, "Failed");
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /Security-analyser: geen waarschuwingen/, "the analyser is on in this map");
    r = check(2, "Passed");
    const tasks = readJsonl(path.join(d, ".learning", "state", "events.jsonl")).filter((e) => e.type === "task");
    assert.equal(tasks.length, 1);
    assert.equal(tasks[0].skill, "security.sql-params");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});
