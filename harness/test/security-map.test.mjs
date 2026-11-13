// Secure code as a first niche for juniors (research §2.13): the four security skills of the junior-dotnet
// map, the security analyser in check.mjs, the securityAnalyzer setting, the export that keeps the free
// texts of security tasks at home, and the rule that examples never teach an insecure pattern.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { HARNESS, makeProject, fakeSkills, run } from "./helpers.mjs";
import { securityWarnings, SECURITY_RULE, SECURITY_ANALYZER_ARGS, isSensitive, DEFAULT_SETTINGS } from "../hooks/lib.mjs";

const MAP = path.join(HARNESS, "maps", "junior-dotnet");
const load = (file) => JSON.parse(fs.readFileSync(path.join(MAP, file), "utf8"));
const SEC = ["security.output-encoding", "security.sql-params", "security.secrets-config", "security.ai-review"];
const SID = "test-sessie";

test("junior-dotnet: security.basics is four sensitive skills at L2, and the analyser is on", () => {
  const map = load("skills.json");
  const ids = map.skills.map((s) => s.id);
  assert.ok(!ids.includes("security.basics"));
  for (const id of SEC) {
    const s = map.skills.find((x) => x.id === id);
    assert.ok(s, id);
    assert.equal(s.level, "L2", id);
    assert.deepEqual(s.paths, [], `${id}: security cuts across files`);
    assert.equal(s.sensitive, true, id);
  }
  assert.equal(map.skills.filter((s) => s.kind !== "zone").length, 13);
  assert.ok(ids.includes("review.ai-code"), "the general review skill stays");
  assert.equal(map.settings.securityAnalyzer, true);
  assert.equal(DEFAULT_SETTINGS.securityAnalyzer, false, "off for every other map");
  assert.equal(JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", "ood", "skills.json"), "utf8")).settings.securityAnalyzer, undefined);
});

test("junior-dotnet: the keywords send a security prompt to the right skill", () => {
  const map = load("skills.json");
  const kw = load("keywords.json");
  for (const id of SEC) assert.ok(kw[id]?.length >= 5, `${id}: keywords`);
  assert.ok(!("security.basics" in kw));
  // As prompt-gate scores it: one point per keyword in the prompt; the first highest score wins.
  const pick = (prompt) => {
    const p = prompt.toLowerCase();
    let best = null;
    for (const s of map.skills) {
      if (s.kind === "zone") continue;
      const score = (kw[s.id] ?? []).filter((k) => p.includes(k)).length;
      if (score > 0 && (!best || score > best.score)) best = { id: s.id, score };
    }
    return best?.id ?? null;
  };
  assert.equal(pick("Hoe voorkom ik sql injection als ik FromSqlRaw gebruik?"), "security.sql-params");
  assert.equal(pick("De zoekterm komt zo in de HTML terecht, is dat XSS?"), "security.output-encoding");
  assert.equal(pick("Where do I keep the connection string and the API key?"), "security.secrets-config");
  assert.equal(pick("Is deze code kwetsbaar voor een aanvaller?"), "security.ai-review");
  assert.equal(pick("Waarom is async void hier een probleem?"), "cs.async", "other skills keep their prompts");
  assert.equal(pick("Kunnen we deze code veilig refactoren?"), "refactor.safe", "'veilig' alone is not a security prompt");
});

test("junior-dotnet notes: the attacker question, the three-part explanation, no fixing at L1-L3", () => {
  const en = fs.readFileSync(path.join(MAP, "notes.en.md"), "utf8");
  const nl = fs.readFileSync(path.join(MAP, "notes.nl.md"), "utf8");
  assert.match(en, /What does an attacker control here\?/);
  assert.match(nl, /Wat heeft een aanvaller hier in handen\?/);
  assert.match(en, /from 1 to 5/);
  assert.match(nl, /van 1 tot 5/);
  assert.match(en, /do not fix them/);
  assert.match(nl, /los je ze niet op/);
});

test("the rule for examples is in the rules of every map, in both languages", () => {
  const en = fs.readFileSync(path.join(HARNESS, "templates", "leerharnas.en.md"), "utf8");
  const nl = fs.readFileSync(path.join(HARNESS, "templates", "leerharnas.nl.md"), "utf8");
  assert.match(en, /\*\*Examples never teach an insecure pattern\.\*\*[^\n]*rung 4[^\n]*rung 5[^\n]*L0, in every map/);
  assert.match(nl, /\*\*Voorbeelden leren nooit een onveilig patroon aan\.\*\*[^\n]*trede 4[^\n]*trede 5[^\n]*L0, in elke kaart/);
  for (const s of [en, nl]) assert.match(s, /System\.Random/);
});

test("securityWarnings: security rules only, once per place, without the project suffix", () => {
  const out = [
    "  Restoring packages...",
    "C:\\work\\Shop\\Data\\OrderRepository.cs(12,17): warning CA2100: Review if the query string passed to 'SqlCommand.SqlCommand(string)' accepts any user input [C:\\work\\Shop\\Shop.csproj]",
    "C:\\work\\Shop\\Data\\OrderRepository.cs(12,17): warning CA2100: Review if the query string passed to 'SqlCommand.SqlCommand(string)' accepts any user input [C:\\work\\Shop\\Shop.csproj]",
    "/home/ci/Shop/Auth/Tokens.cs(8,20,8,40): warning CA5394: Random is an insecure random number generator. [/home/ci/Shop/Shop.csproj]",
    "C:\\work\\Shop\\Util.cs(3,5): warning CA1822: Member 'X' does not access instance data and can be marked as static [C:\\work\\Shop\\Shop.csproj]",
    "C:\\work\\Shop\\Util.cs(4,5): warning CS0168: The variable 'e' is declared but never used [C:\\work\\Shop\\Shop.csproj]",
    "C:\\work\\Shop\\Web\\Search.cs(30,9): error CA3001: an error is not a warning [C:\\work\\Shop\\Shop.csproj]",
  ].join("\r\n");
  const list = securityWarnings(out);
  assert.deepEqual(list.map((w) => [w.rule, w.line]), [["CA2100", 12], ["CA5394", 8]]);
  assert.equal(list[0].file, "C:\\work\\Shop\\Data\\OrderRepository.cs");
  assert.equal(list[0].message, "Review if the query string passed to 'SqlCommand.SqlCommand(string)' accepts any user input");
  for (const r of ["CA2100", "CA2153", "CA2300", "CA3001", "CA3075", "CA5350", "CA5405"]) assert.ok(SECURITY_RULE.test(r), r);
  for (const r of ["CA1822", "CA2007", "CA1062", "CA5000"]) assert.ok(!SECURITY_RULE.test(r), r);
  assert.deepEqual(securityWarnings(""), []);
});

test("the analyser arguments: all security rules, never as errors, no change to the project", () => {
  assert.ok(SECURITY_ANALYZER_ARGS.includes("-p:AnalysisModeSecurity=All"));
  assert.ok(SECURITY_ANALYZER_ARGS.includes("-p:CodeAnalysisTreatWarningsAsErrors=false"));
  assert.ok(SECURITY_ANALYZER_ARGS.every((a) => a.startsWith("-p:")), "properties on the command line only");
});

function trx(dir) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "run.trx"), `<?xml version="1.0"?><TestRun><TestDefinitions><UnitTest name="Een" id="id0"><TestMethod codeBase="x.dll" className="Demo.Tests" name="Een" /></UnitTest></TestDefinitions><Results><UnitTestResult testId="id0" testName="Een" outcome="Passed" /></Results></TestRun>`);
  return dir;
}

test("check.mjs with securityAnalyzer: lists the warnings, asks for an explanation, logs rules without paths", () => {
  const p = makeProject({ skills: fakeSkills({ securityAnalyzer: true }), files: { "opdrachten/02-lijst/Repo.cs": "class Repo {}" } });
  try {
    const file = p.abs("opdrachten/02-lijst/Repo.cs");
    const out = `${file}(12,17): warning CA2100: Review if the query string accepts any user input [${p.abs("opdrachten/02-lijst/Lijst.csproj")}]\n`;
    const r = p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-1")), LEERHARNAS_DOTNET_OUT: out });
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /Security-analyser: 1 waarschuwing/);
    assert.match(r.stdout, /CA2100 {2}opdrachten\/02-lijst\/Repo\.cs:12 {2}Review if the query string/);
    assert.match(r.stdout, /wat een aanvaller hier in handen heeft/);
    const ev = p.events().filter((e) => e.type === "security-warnings");
    assert.equal(ev.length, 1);
    assert.deepEqual([ev[0].n, ev[0].rules, ev[0].dir], [1, ["CA2100"], "opdrachten/02-lijst"]);
    assert.ok(!JSON.stringify(ev[0]).includes("Repo.cs"), "no file names in the event");

    // A clean run says that clean is not proof.
    const r2 = p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-2")), LEERHARNAS_DOTNET_OUT: "" });
    assert.match(r2.stdout, /geen waarschuwingen\. Dat betekent niet dat de code veilig is/);
  } finally { p.cleanup(); }
});

test("check.mjs without securityAnalyzer: no analyser section and no event", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/Repo.cs": "class Repo {}" } });
  try {
    const out = `${p.abs("opdrachten/02-lijst/Repo.cs")}(12,17): warning CA2100: Review [x.csproj]\n`;
    const r = p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-1")), LEERHARNAS_DOTNET_OUT: out });
    assert.equal(r.code, 0, r.stderr);
    assert.doesNotMatch(r.stdout, /Security-analyser/);
    assert.equal(p.events().filter((e) => e.type === "security-warnings").length, 0);
  } finally { p.cleanup(); }
});

test("skill.mjs setting securityAnalyzer true|false, and nothing else", () => {
  const p = makeProject();
  try {
    let r = p.cli("skill.mjs", ["setting", "securityAnalyzer", "true"]);
    assert.equal(r.code, 0, r.stderr);
    assert.equal(p.skills().settings.securityAnalyzer, true);
    r = p.cli("skill.mjs", ["setting", "securityAnalyzer", "false"]);
    assert.equal(p.skills().settings.securityAnalyzer, false);
    r = p.cli("skill.mjs", ["setting", "securityAnalyzer", "ja"]);
    assert.notEqual(r.code, 0);
    assert.match(r.stdout + r.stderr, /securityAnalyzer true\|false/);
    assert.equal(p.events().filter((e) => e.type === "setting" && e.key === "securityAnalyzer").length, 2);
  } finally { p.cleanup(); }
});

test("isSensitive: the skill itself, and its microskills", () => {
  const data = { skills: [
    { id: "security.sql-params", sensitive: true },
    { id: "security.sql-params.dapper", parent: "security.sql-params" },
    { id: "cs.async" },
  ] };
  assert.equal(isSensitive(data, "security.sql-params"), true);
  assert.equal(isSensitive(data, "security.sql-params.dapper"), true);
  assert.equal(isSensitive(data, "cs.async"), false);
  assert.equal(isSensitive(data, null), false);
  assert.equal(isSensitive(data, "bestaat.niet"), false);
});

test("export: tasks of a sensitive skill keep their numbers, not their texts", () => {
  const skills = fakeSkills();
  skills.skills.push(
    { id: "security.sql-params", title: "Geparametriseerde queries", level: "L2", paths: [], sensitive: true, placement: "done",
      history: [{ at: "2026-11-12", from: "L2", to: "L1", note: "lek in KlantRepository gevonden" }] },
    { id: "security.sql-params.dapper", parent: "security.sql-params", title: "Dapper in KlantRepository", level: "L2", placement: "done" },
  );
  const at = (m) => `2026-11-13T10:${String(m).padStart(2, "0")}:00.000Z`;
  const p = makeProject({
    skills,
    events: [
      { at: at(0), type: "task", tid: "s1", skill: "security.sql-params", success: true, maxRung: 2, source: "check", what: "KlantRepository_Zoek_IsVeilig" },
      { at: at(1), type: "explain-rejected", tid: "s1", by: "claude", reasons: ["noem de query in KlantRepository"] },
      { at: at(2), type: "task-explained", tid: "s1", skill: "security.sql-params", text: "De zoekterm in KlantRepository ging zo in de query, omdat hij geplakt werd" },
      { at: at(3), type: "task-correct", tid: "s1", skill: "security.sql-params", from: 2, maxRung: 3, reason: "hint over KlantRepository" },
      { at: at(4), type: "task", tid: "s2", skill: "security.sql-params.dapper", success: true, maxRung: 0, source: "done", what: "Dapper-query in KlantRepository" },
      { at: at(5), type: "task", tid: "d1", skill: "demo.l2", success: true, maxRung: 1, source: "check", what: "TestEen" },
      { at: at(6), type: "task-explained", tid: "d1", skill: "demo.l2", text: "het werkt omdat de lus bij nul begint" },
    ],
  });
  try {
    const out = path.join(p.root, "progress.json");
    const r = run(path.join(HARNESS, "export.mjs"), [p.root, "--out", out, "--allow-untranslated"]);
    assert.equal(r.code, 0, r.stderr);
    const json = JSON.parse(fs.readFileSync(out, "utf8"));
    assert.ok(!JSON.stringify(json).includes("KlantRepository"), "no vulnerable spot goes online");
    const s1 = json.tasks.find((x) => x.id === "s1");
    assert.deepEqual([s1.skill, s1.maxRung, s1.explained, s1.withheld, s1.what, s1.explanation], ["security.sql-params", 3, true, true, null, null]);
    assert.deepEqual(s1.rejections[0].reasons, []);
    assert.equal(s1.corrections[0].reason, null);
    assert.equal(json.tasks.find((x) => x.id === "s2").withheld, true, "a microskill inherits it");
    const d1 = json.tasks.find((x) => x.id === "d1");
    assert.deepEqual([d1.what, d1.withheld], ["TestEen", undefined]);
    assert.match(d1.explanation, /lus bij nul/);
    assert.equal(json.skills.find((s) => s.id === "security.sql-params.dapper").title, "security.sql-params.dapper");
    assert.equal(json.skills.find((s) => s.id === "security.sql-params").history[0].note, null);
  } finally { p.cleanup(); }
});
