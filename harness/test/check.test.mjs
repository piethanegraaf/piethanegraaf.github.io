// check.mjs: red -> green is a task, green -> red is a regression, red again -> green is repair (no task).
// Uses LEERHARNAS_TRX_DIR with handwritten trx files, so no dotnet is needed.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject, run, HOOKS } from "./helpers.mjs";

const SID = "test-sessie";

function trx(dir, results) {
  fs.mkdirSync(dir, { recursive: true });
  const defs = Object.keys(results).map((n, i) =>
    `<UnitTest name="${n}" id="id${i}"><TestMethod codeBase="x.dll" className="Demo.Tests" name="${n}" /></UnitTest>`).join("");
  const res = Object.entries(results).map(([n, outcome], i) => outcome === "Passed"
    ? `<UnitTestResult testId="id${i}" testName="${n}" outcome="Passed" />`
    : `<UnitTestResult testId="id${i}" testName="${n}" outcome="Failed"><Output><ErrorInfo><Message>Expected: 3&#xD;&#xA;But was: 2</Message></ErrorInfo></Output></UnitTestResult>`).join("");
  fs.writeFileSync(path.join(dir, "run.trx"), `<?xml version="1.0"?><TestRun><TestDefinitions>${defs}</TestDefinitions><Results>${res}</Results></TestRun>`);
  return dir;
}

test("baseline, new green (task with session rung), regression and repair", () => {
  const p = makeProject({
    files: { "opdrachten/02-lijst/Lijst.cs": "class Lijst {}" },
    sessions: { [SID]: { startedAt: Date.now(), activeSkill: "demo.l2", rung: 2, maxRung: 2, lastRungAt: null, taskStartedAt: Date.now() } },
  });
  const runCheck = (n, results) => p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs(`trx-${n}`), results) });
  try {
    // 1. First run: baseline, nothing is logged as a task.
    let r = runCheck(1, { Een: "Failed", Twee: "Passed" });
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /1 groen · 1 rood/);
    assert.match(r.stdout, /Expected: 3/);
    assert.match(r.stdout, /basislijn/);
    assert.equal(p.events().filter((e) => e.type === "task").length, 0);

    // 2. Red -> green: one task for the skill of the folder, with the highest rung of the session.
    r = runCheck(2, { Een: "Passed", Twee: "Passed" });
    assert.match(r.stdout, /Nieuw groen: Een/);
    let tasks = p.events().filter((e) => e.type === "task");
    assert.equal(tasks.length, 1);
    assert.deepEqual([tasks[0].skill, tasks[0].maxRung, tasks[0].source, tasks[0].success], ["demo.l2", 2, "check", true]);
    assert.equal(p.session(SID).maxRung, 0, "the session ladder starts again after a task");

    // 3. Green -> red: a regression.
    r = runCheck(3, { Een: "Failed", Twee: "Passed" });
    assert.match(r.stdout, /Was groen, nu rood: Een/);
    const reg = p.events().filter((e) => e.type === "regression");
    assert.equal(reg.length, 1);
    assert.deepEqual(reg[0].tests, ["Demo.Tests.Een"]);

    // 4. Red again -> green: repair after a regression, not a new task.
    r = runCheck(4, { Een: "Passed", Twee: "Passed" });
    assert.match(r.stdout, /Weer groen: Een/);
    assert.equal(p.events().filter((e) => e.type === "regression-fixed").length, 1);
    tasks = p.events().filter((e) => e.type === "task");
    assert.equal(tasks.length, 1, "repair must not count as a new task");
  } finally { p.cleanup(); }
});

test("the folder decides the session skill (a guessed skill from another family is replaced)", () => {
  const p = makeProject({
    files: { "opdrachten/02-lijst/Lijst.cs": "" },
    sessions: { [SID]: { startedAt: Date.now(), activeSkill: "demo.l3", rung: 1, maxRung: 1, taskStartedAt: Date.now() } },
  });
  try {
    p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-a"), { Een: "Failed" }) });
    assert.equal(p.session(SID).activeSkill, "demo.l2");
    assert.equal(p.session(SID).maxRung, 1, "help that was given is kept");
  } finally { p.cleanup(); }
});

test("an active microskill of the same family gets the task", () => {
  const p = makeProject({
    files: { "opdrachten/02-lijst/Lijst.cs": "" },
    sessions: { [SID]: { startedAt: Date.now(), activeSkill: "demo.l2.micro", rung: 0, maxRung: 0, taskStartedAt: Date.now() } },
  });
  try {
    p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-a"), { Een: "Failed" }) });
    p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-b"), { Een: "Passed" }) });
    const t = p.events().find((e) => e.type === "task");
    assert.equal(t.skill, "demo.l2.micro");
  } finally { p.cleanup(); }
});

test("no trx files: build failed, nothing is logged", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/Lijst.cs": "" } });
  try {
    fs.mkdirSync(p.abs("leeg"), { recursive: true });
    const r = p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: p.abs("leeg") });
    assert.equal(r.code, 1);
    assert.match(r.stdout, /GEEN tests gedraaid/);
    assert.equal(p.events().length, 0);
  } finally { p.cleanup(); }
});

// ---------- Setup review 3.2: a compile error is the starting point ----------
const CS_ERROR = "Lijst.cs(3,5): error CS0246: The type or namespace name 'Student' could not be found [Lijst.csproj]";

test("a compile error is remembered: the first green after it is new green, not a baseline", () => {
  const p = makeProject({
    files: { "opdrachten/02-lijst/Lijst.cs": "" },
    sessions: { [SID]: { startedAt: Date.now(), lastActiveAt: Date.now(), activeSkill: "demo.l2", rung: 1, maxRung: 1, taskStartedAt: Date.now() } },
  });
  try {
    fs.mkdirSync(p.abs("leeg"), { recursive: true });
    let r = p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: p.abs("leeg"), LEERHARNAS_DOTNET_OUT: CS_ERROR });
    assert.equal(r.code, 1);
    assert.match(r.stdout, /Compileerfout genoteerd/);
    assert.equal(p.events().filter((e) => e.type === "build-failed").length, 1);

    r = p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-ok"), { Een: "Passed", Twee: "Failed" }) });
    assert.match(r.stdout, /Nieuw groen: Een/);
    assert.doesNotMatch(r.stdout, /basislijn/);
    const tasks = p.events().filter((e) => e.type === "task");
    assert.deepEqual(tasks.map((x) => [x.skill, x.what, x.maxRung]), [["demo.l2", "Een", 1]]);
    const store = JSON.parse(fs.readFileSync(path.join(p.state, "tests.json"), "utf8"));
    assert.equal(store["opdrachten/02-lijst::#build"], undefined, "the starting point is used once");

    // Twee turns green later: a normal new green.
    p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-ok2"), { Een: "Passed", Twee: "Passed" }) });
    assert.equal(p.events().filter((e) => e.type === "task").length, 2);
  } finally { p.cleanup(); }
});

test("a tooling error (NETSDK, MSB) is not a starting point", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/Lijst.cs": "" } });
  try {
    fs.mkdirSync(p.abs("leeg"), { recursive: true });
    p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: p.abs("leeg"), LEERHARNAS_DOTNET_OUT: "error NETSDK1045: The current .NET SDK does not support targeting .NET 10.0." });
    const r = p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-a"), { Een: "Passed" }) });
    assert.match(r.stdout, /basislijn/);
    assert.equal(p.events().filter((e) => e.type === "task").length, 0);
  } finally { p.cleanup(); }
});

test("green, then a compile error, then green again is no task and no repair", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/Lijst.cs": "" } });
  try {
    fs.mkdirSync(p.abs("leeg"), { recursive: true });
    p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-a"), { Een: "Passed" }) });
    p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: p.abs("leeg"), LEERHARNAS_DOTNET_OUT: CS_ERROR });
    const r = p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-b"), { Een: "Passed" }) });
    assert.doesNotMatch(r.stdout, /Nieuw groen|Weer groen/);
    assert.equal(p.events().filter((e) => ["task", "regression-fixed"].includes(e.type)).length, 0);
  } finally { p.cleanup(); }
});

// ---------- Setup review §4 ----------
test("global.json with an older SDK than the project, without rollForward, gives a warning", () => {
  const csproj = "<Project><PropertyGroup><TargetFramework>net10.0</TargetFramework></PropertyGroup></Project>";
  const p = makeProject({ files: {
    "opdrachten/02-lijst/global.json": JSON.stringify({ sdk: { version: "8.0.100" } }),
    "opdrachten/02-lijst/Lijst.csproj": csproj,
    "opdrachten/02-ok/global.json": JSON.stringify({ sdk: { version: "8.0.100", rollForward: "latestMajor" } }),
    "opdrachten/02-ok/Ok.csproj": csproj,
  } });
  try {
    let r = p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-a"), { Een: "Passed" }) });
    assert.match(r.stdout, /global\.json vraagt SDK 8\.0\.100.*net10\.0/);
    r = p.cli("check.mjs", ["opdrachten/02-ok"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-b"), { Een: "Passed" }) });
    assert.doesNotMatch(r.stdout, /global\.json vraagt/);
  } finally { p.cleanup(); }
});

test("a folder relative to the project also works when the shell stands in another folder", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/Lijst.cs": "", "opdrachten/03-x/X.cs": "" } });
  try {
    const r = run(path.join(HOOKS, "check.mjs"), ["opdrachten/02-lijst"], {
      env: { ...p.env, LEERHARNAS_TRX_DIR: trx(p.abs("trx-a"), { Een: "Passed" }) }, cwd: p.abs("opdrachten/03-x"),
    });
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /Resultaat opdrachten\/02-lijst/);
  } finally { p.cleanup(); }
});

test("check.mjs sets the folder skill of the session (it locks the skill detection)", () => {
  const p = makeProject({
    files: { "opdrachten/02-lijst/Lijst.cs": "" },
    sessions: { [SID]: { startedAt: Date.now(), lastActiveAt: Date.now(), activeSkill: "demo.l2.micro" } },
  });
  try {
    p.cli("check.mjs", ["opdrachten/02-lijst"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-a"), { Een: "Failed" }) });
    const st = p.session(SID);
    assert.equal(st.folderSkill, "demo.l2");
    assert.equal(st.activeSkill, "demo.l2.micro", "a microskill of the same family stays active");
  } finally { p.cleanup(); }
});
