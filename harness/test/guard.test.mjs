// guard.mjs: what the AI may and may not do per level.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject, decision } from "./helpers.mjs";

let p;
before(() => {
  p = makeProject({ files: { "opdrachten/01-gaten/Gaten.cs": "class A { // TODO(human): kern\n}\n" } });
});
after(() => p.cleanup());

const write = (rel, content = "class X {}") => p.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: p.abs(rel), content }, cwd: p.root });
const edit = (rel, old_string, new_string) => p.hook("guard.mjs", { tool_name: "Edit", tool_input: { file_path: p.abs(rel), old_string, new_string }, cwd: p.root });
const bash = (command, cwd = p.root) => p.hook("guard.mjs", { tool_name: "Bash", tool_input: { command }, cwd });

test("L2 code: writing is denied and logged", () => {
  const r = write("opdrachten/02-lijst/Lijst.cs");
  assert.equal(decision(r), "deny");
  assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /demo\.l2/);
  assert.ok(p.events().some((e) => e.type === "deny" && e.skill === "demo.l2"));
});

test("L3 code: writing is denied", () => {
  assert.equal(decision(write("opdrachten/03-x/X.cs")), "deny");
});

test("L4 code and the examples zone: writing is allowed", () => {
  assert.equal(decision(write("opdrachten/04-x/X.cs")), "allow");
  assert.equal(decision(write("voorbeelden/demo/Voorbeeld.cs")), "allow");
});

test("unmapped project code gets defaultLevel (L2): denied", () => {
  assert.equal(decision(write("eigen/Los.cs")), "deny");
});

test("files that are not code, and files outside the project, are allowed", () => {
  assert.equal(decision(write("opdrachten/02-lijst/README.md", "# notes")), "allow");
  assert.equal(decision(p.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: "/elders/buiten/X.cs", content: "" } })), "allow");
});

test("L1: a skeleton that keeps the TODO(human) gaps is allowed, filling a gap is denied", () => {
  assert.equal(decision(write("opdrachten/01-nieuw/Nieuw.cs", "class B {\n  // TODO(human): kern\n}\n")), "allow");
  assert.equal(decision(edit("opdrachten/01-gaten/Gaten.cs", "// TODO(human): kern", "return 42;")), "deny");
  assert.equal(decision(write("opdrachten/01-gaten/Gaten.cs", "class A { int K() => 42; }\n")), "deny");
});

test("codeExtensions from settings decide what code is", () => {
  const q = makeProject({ skills: fakeSkillsWithPy() });
  try {
    const r = q.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: q.abs("opdrachten/02-x/main.py"), content: "" } });
    assert.equal(decision(r), "deny");
    const cs = q.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: q.abs("opdrachten/02-x/X.cs"), content: "" } });
    assert.equal(decision(cs), "allow");
  } finally { q.cleanup(); }
});

test("the skill record and state can never be written by the AI", () => {
  assert.equal(decision(write(".learning/skills.json", "{}")), "deny");
  assert.equal(decision(write(".learning/state/events.jsonl", "")), "deny");
  assert.equal(decision(bash("echo {} > .learning/skills.json")), "deny");
});

test("the harness itself (hooks, settings.json, diary skill, rules) can never be written by the AI", () => {
  for (const rel of [".claude/hooks/guard.mjs", ".claude/settings.json", ".claude/settings.local.json",
    ".claude/skills/diary/SKILL.md", ".claude/skills/mastery-check/SKILL.md", ".claude/leerharnas.md", ".claude/leerharnas.json"]) {
    assert.equal(decision(write(rel, "x")), "deny", rel);
  }
  assert.equal(decision(bash("rm .claude/hooks/guard.mjs")), "deny");
  assert.equal(decision(bash("sed -i 's/deny/allow/' .claude/hooks/guard.mjs")), "deny");
  assert.equal(decision(bash("node .claude/hooks/skill.mjs list")), "allow");
  assert.equal(decision(write(".claude/agents/helper.md", "x")), "allow");
  // The demotion analyst decides about levels: Claude may not rewrite it (setup review S3a).
  assert.equal(decision(write(".claude/agents/demotie-analist.md", "x")), "deny");
});

test("record commands are denied, list and status are allowed", () => {
  assert.equal(decision(bash("node .claude/hooks/skill.mjs set demo.l2 L3 \"klaar\"")), "deny");
  assert.equal(decision(bash("node .claude/hooks/skill.mjs override * 30 \"x\"")), "deny");
  assert.equal(decision(bash("node .claude/hooks/skill.mjs correct abc schrap \"x\"")), "deny");
  assert.equal(decision(bash("node .claude/hooks/skill.mjs done demo.l2 \"x\"")), "deny");
  assert.equal(decision(bash("node .claude/hooks/skill.mjs status")), "allow");
});

test("building or testing L2 code is denied, information commands are allowed", () => {
  const dir = p.abs("opdrachten/02-lijst");
  assert.equal(decision(bash("dotnet test", dir)), "deny");
  assert.equal(decision(bash(`dotnet build "${dir}"`)), "deny");
  assert.equal(decision(bash("node .claude/hooks/check.mjs opdrachten/02-lijst")), "deny");
  assert.equal(decision(bash("dotnet --info", dir)), "allow");
  assert.equal(decision(bash("dotnet test", p.abs("opdrachten/04-x"))), "allow");
});

// Setup review 3.4: a build is recognised by the program, not by a word in its arguments.
test("a build word in a grep pattern or a path is not a build", () => {
  const dir = p.abs("opdrachten/02-lijst");
  // The command that was refused on 10 Nov 2026: cd into an L2 folder, then only information and grep.
  assert.equal(decision(bash(`cd "${dir}" && dotnet --list-sdks | grep -i "msbuild"`)), "allow");
  assert.equal(decision(bash("sed -n 1p .claude/hooks/check.mjs")), "allow");
  assert.equal(decision(bash("grep -rn check.mjs .claude/hooks/")), "allow");
});

test("a build is found through call operators, nested shells and later commands", () => {
  const dir = p.abs("opdrachten/02-lijst");
  assert.equal(decision(bash(`& "C:\\Program Files\\Microsoft Visual Studio\\MSBuild.exe" Lijst.csproj`, dir)), "deny");
  assert.equal(decision(bash('bash -c "dotnet test"', dir)), "deny");
  assert.equal(decision(bash('powershell -Command "dotnet test"', dir)), "deny");
  assert.equal(decision(bash(`echo start; cd "${dir}" && dotnet test`)), "deny");
  assert.equal(decision(bash("dotnet test opdrachten/04-x")), "allow", "the named L4 folder decides, not the working directory");
});

test("eval and iex are refused: the guard cannot see what they run", () => {
  const r = bash('eval "dotnet test"');
  assert.equal(decision(r), "deny");
  assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /eval/);
  assert.equal(decision(bash("iex 'dotnet test'")), "deny");
});

// Setup review 3.6: reading the state is fine; only writing to it is refused.
test("reading the state while writing elsewhere is allowed; writing to the state is not", () => {
  assert.equal(decision(bash("cat .learning/state/tests.json > scratch.txt")), "allow");
  assert.equal(decision(bash("node -e \"console.log(1)\" > out.txt && cat .learning/skills.json")), "allow");
  assert.equal(decision(bash("cp backup.json .learning/skills.json")), "deny");
  assert.equal(decision(bash("echo x >> .learning/state/events.jsonl")), "deny");
});

test("only the real harness files are protected, not every path with 'leerharnas' in it", () => {
  assert.equal(decision(bash("cp a.jsonl ~/.claude/leerharnas-backup/")), "allow");
  assert.equal(decision(write(".claude/leerharnas-backup/2026/x.md", "x")), "allow");
  assert.equal(decision(bash("cp x.mjs .claude/hooks/guard.mjs")), "deny");
  assert.equal(decision(write(".claude/leerharnas.md", "x")), "deny");
});

test("the harness records and replay are learner commands", () => {
  assert.equal(decision(bash("node .claude/hooks/skill.mjs replay x.jsonl")), "deny");
});

test("shell writes to code are denied; harmless redirects and lambdas are not writes", () => {
  assert.equal(decision(bash("echo x > opdrachten/02-lijst/Lijst.cs")), "deny");
  assert.equal(decision(bash("cat opdrachten/02-lijst/Lijst.cs 2>/dev/null")), "allow");
  assert.equal(decision(bash("grep -n \"x => x\" opdrachten/02-lijst/Lijst.cs")), "allow");
});

test("an active override lets the AI write that skill's code, and is logged", () => {
  const q = makeProject({});
  try {
    const until = new Date(Date.now() + 10 * 60000).toISOString();
    writeFile(q, ".learning/state/overrides.json", JSON.stringify([{ skill: "demo.l2", reason: "test", from: new Date().toISOString(), until }]));
    const r = q.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: q.abs("opdrachten/02-x/X.cs"), content: "" } });
    assert.equal(decision(r), "allow");
    assert.ok(q.events().some((e) => e.type === "override-used" && e.skill === "demo.l2"));
    const l3 = q.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: q.abs("opdrachten/03-x/X.cs"), content: "" } });
    assert.equal(decision(l3), "deny");
  } finally { q.cleanup(); }
});

test("an unreadable record fails closed: project code counts as L2", () => {
  const q = makeProject({});
  try {
    writeFile(q, ".learning/skills.json", "{ kapot");
    const r = q.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: q.abs("opdrachten/04-x/X.cs"), content: "" } });
    assert.equal(decision(r), "deny");
  } finally { q.cleanup(); }
});

test("an unexpected error in the guard fails closed, not open", () => {
  const q = makeProject({ skills: { settings: {}, skills: { kapot: true } } }); // valid JSON, wrong shape
  try {
    const r = q.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: q.abs("opdrachten/04-x/X.cs"), content: "" } });
    assert.equal(decision(r), "deny");
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /guard/i);
    const ok = q.hook("guard.mjs", { tool_name: "Read", tool_input: { file_path: q.abs("README.md") } });
    assert.equal(decision(ok), "allow", "tools the guard does not judge stay allowed");
  } finally { q.cleanup(); }
});

function fakeSkillsWithPy() {
  return {
    settings: { defaultLevel: "L4", codeExtensions: ["py"] },
    skills: [{ id: "py.basis", title: "Python", level: "L2", paths: ["opdrachten/02-*/**"] }],
  };
}

function writeFile(q, rel, content) {
  fs.mkdirSync(path.dirname(q.abs(rel)), { recursive: true });
  fs.writeFileSync(q.abs(rel), content);
}
