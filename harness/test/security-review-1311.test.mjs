// Security review of 13 November 2026 (research/security-review-2026-11-13.md): one test block per finding,
// each with the reproduced bypass and a control that must keep working.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { makeProject, decision } from "./helpers.mjs";
import { parseCommand } from "../hooks/shell.mjs";

let p;
before(() => { p = makeProject({ files: { "opdrachten/02-lijst/Lijst.cs": "class Lijst {}\n" } }); });
after(() => p.cleanup());

const bash = (command, cwd = p.root) => p.hook("guard.mjs", { tool_name: "Bash", tool_input: { command }, cwd });
const ps = (command, cwd = p.root) => p.hook("guard.mjs", { tool_name: "PowerShell", tool_input: { command }, cwd });

// ---------- V1 (high): the subcommand of skill.mjs, decided on the parsed words ----------
test("V1: a quoted or escaped subcommand of skill.mjs is denied, in Bash and PowerShell", () => {
  for (const cmd of [
    "node .claude/hooks/skill.mjs 'override' '*' 600 x",
    'node .claude/hooks/skill.mjs "set" demo.l2 L4',
    'node .claude/hooks/skill.mjs "setting" graded off',
    "node .claude/hooks/skill.mjs ''set demo.l2 L4",
    "node .claude/hooks/skill.mjs s\\et demo.l2 L4",
    "node ./.claude/hooks/skill.mjs \"paths\" demo.l2 add 'x/**'",
    "cd .claude/hooks && node skill.mjs 'done' demo.l2 x",
  ]) {
    assert.equal(decision(bash(cmd)), "deny", `bash: ${cmd}`);
  }
  for (const cmd of ["node .claude/hooks/skill.mjs 'override' '*' 600 x", 'node .claude/hooks/skill.mjs "set" demo.l2 L4']) {
    assert.equal(decision(ps(cmd)), "deny", `powershell: ${cmd}`);
  }
  // Control: the read commands stay allowed, also quoted.
  for (const cmd of ["node .claude/hooks/skill.mjs list", "node .claude/hooks/skill.mjs 'status'", 'node .claude/hooks/skill.mjs "since-export"']) {
    assert.equal(decision(bash(cmd)), "allow", cmd);
  }
});

test("V1: other hook scripts may not be run by hand; check.mjs and scaffold.mjs are judged as before", () => {
  for (const cmd of ["echo '{}' | node .claude/hooks/prompt-gate.mjs", "node .claude/hooks/reflect-gate.mjs", "node .claude/hooks/guard.mjs"]) {
    assert.equal(decision(bash(cmd)), "deny", cmd);
  }
  assert.equal(decision(bash("node .claude/hooks/check.mjs opdrachten/02-lijst")), "deny", "a build of L2 code");
  assert.equal(decision(bash("node .claude/hooks/check.mjs opdrachten/04-x")), "allow", "a build of L4 code");
});

test("V1: bash removes backslash escapes before it runs a word; PowerShell keeps backslashes", () => {
  const argv = (cmd, shell) => parseCommand(cmd, { shell }).commands.map((c) => c.argv);
  assert.deepEqual(argv("rm .claud\\e/hooks/guard.mjs", "bash"), [["rm", ".claude/hooks/guard.mjs"]]);
  assert.deepEqual(argv('echo "a\\"b" \\\nnext', "bash"), [["echo", 'a"b', "next"]]);
  assert.deepEqual(argv("echo 'a\\b'", "bash"), [["echo", "a\\b"]]);
  assert.deepEqual(argv("Get-Content C:\\Users\\x.txt", "powershell"), [["Get-Content", "C:\\Users\\x.txt"]]);
  assert.deepEqual(argv('bash -c "rm .claud\\e/x"', "powershell"), [["rm", ".claude/x"]]);
  assert.deepEqual(argv('bash -c "rm .claud\\\\e/x"', "powershell"), [["rm", ".claud\\e/x"]], "\\\\ is one backslash in bash");
});

// ---------- V2 (high): graded work behind a variable, an escape or brace expansion ----------
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fakeSkills } from "./helpers.mjs";

// A fake home folder (HOME and USERPROFILE for the hook) with the graded repo inside it.
function gradedHome() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-home-"));
  const repo = path.join(home, "eindopdracht");
  fs.mkdirSync(path.join(repo, "src"), { recursive: true });
  const g = makeProject({ skills: fakeSkills() });
  const data = g.skills();
  data.settings.graded = { paths: [repo.split(path.sep).join("/")], aiLevel: 1, maxRung: 4 };
  fs.writeFileSync(path.join(g.learn, "skills.json"), JSON.stringify(data, null, 2));
  const env = { HOME: home, USERPROFILE: home };
  const run = (tool, command, cwd = g.root) => decision(g.hook("guard.mjs", { tool_name: tool, tool_input: { command }, cwd }, env));
  return { g, home, repo, run, done: () => { g.cleanup(); fs.rmSync(home, { recursive: true, force: true }); } };
}

test("V2: a graded path behind ${HOME}, $USERPROFILE, an escape or braces is denied", () => {
  const { run, done } = gradedHome();
  try {
    for (const cmd of [
      "cp /tmp/sol.cs ${HOME}/eindopdracht/src/Bank.cs",
      "cp x ${HOME}/eindopdracht/ai-verantwoording/logboek.md",
      "echo hi > ${HOME}/eindopdracht/src/Bank.cs",
      "cp x $USERPROFILE/eindopdracht/notes.md",
      String.raw`cp x ~/eindopdrach\t/Bank.cs`,
      "cp x ~/{eindopdracht,zz}/Bank.cs",
      "cd ${HOME}/eindopdracht && git add -A && git commit -m x && git push",
      "git -C ${HOME}/eindopdracht commit -am x",
    ]) assert.equal(run("Bash", cmd), "deny", cmd);
    assert.equal(run("PowerShell", "Copy-Item x ${env:USERPROFILE}/eindopdracht/Bank.cs"), "deny");
    // Controls: the plain forms stay denied, reading stays allowed.
    assert.equal(run("Bash", "cp x ~/eindopdracht/Bank.cs"), "deny");
    assert.equal(run("Bash", "cat ${HOME}/eindopdracht/src/Bank.cs"), "allow");
    assert.equal(run("Bash", "git -C ${HOME}/eindopdracht status"), "allow");
  } finally { done(); }
});

test("V2: with graded work set, a write the guard cannot resolve fails closed; a known folder is fine", () => {
  const { run, done } = gradedHome();
  try {
    for (const cmd of ["cp x $NIET_GEZET/Bank.cs", "cd $(mktemp -d) && cp x Bank.cs", "cp x \"$f\"", "echo x > $LOG"]) {
      assert.equal(run("Bash", cmd), "deny", cmd);
    }
    // A variable inside a known folder outside graded work, and an unknown variable that only reads.
    assert.equal(run("Bash", "cp x notes/$f.txt"), "allow");
    assert.equal(run("Bash", "cat $NIET_GEZET/x"), "allow");
  } finally { done(); }
});

test("V2: braces still separate a block, but not inside a word", () => {
  const argv = (cmd) => parseCommand(cmd).commands.map((c) => c.argv);
  assert.deepEqual(argv("cp a ${HOME}/b"), [["cp", "a", "${HOME}/b"]]);
  assert.deepEqual(argv("{ echo a; echo b; }"), [["echo", "a"], ["echo", "b"]]);
  assert.deepEqual(argv("cp x ~/{a,b}/c"), [["cp", "x", "~/{a,b}/c"]]);
});

// ---------- V3 (medium): whole folders of the harness and the record ----------
test("V3: a protected folder as the target, or a bare name after cd, is denied", () => {
  for (const cmd of [
    "rm -rf .claude/hooks", "rm -rf .claude/hooks/", "mv .claude .claude-off", "cd .claude && rm -rf hooks",
    "cd .claude/hooks && rm guard.mjs", "rm -rf .learning", "mv .learning .learning-off", "rm -rf .learning/state",
    "cd .learning && echo '{}' | tee skills.json", "cp -r /tmp/evil/. .claude/hooks", "rm -rf .",
  ]) assert.equal(decision(bash(cmd)), "deny", cmd);
  assert.equal(decision(bash(String.raw`rm .claud\e/hooks/guard.mjs`)), "deny", "escape");
  assert.equal(decision(bash(String.raw`echo '{}' > .learning/skills.jso\n`)), "deny", "escape");
  assert.equal(decision(ps(String.raw`Remove-Item -Recurse -Force .claude\hooks`)), "deny", "PowerShell");
  assert.equal(decision(bash("rm guard.mjs", p.abs(".claude/hooks"))), "deny", "cwd inside the hooks folder");
  // Controls: ordinary files and folders, and moving something INTO the project, stay allowed.
  for (const cmd of ["rm notes.txt", "rm -rf build", "mv a.txt b.txt", "mv /tmp/x.txt .", "cp README.md docs/", "tee log.txt"]) {
    assert.equal(decision(bash(cmd)), "allow", cmd);
  }
});

// ---------- V4 (medium): a folder of protected code as the target ----------
test("V4: deleting, replacing or extracting into a folder of an L1-L3 skill is denied", () => {
  for (const cmd of [
    "rm -rf opdrachten/02-lijst", "rm -rf opdrachten/02-lijst/*", "cp -r /tmp/solution/. opdrachten/02-lijst",
    "cp /tmp/sol.cs opdrachten/02-lijst/", "mv /tmp/sol opdrachten/02-lijst", "tar -xf sol.tar -C opdrachten/02-lijst",
    "unzip sol.zip -d opdrachten/02-lijst", "git checkout solution-branch -- opdrachten/02-lijst",
    "git restore --source=sol opdrachten/02-lijst", "git clean -fd opdrachten/02-lijst",
  ]) assert.equal(decision(bash(cmd)), "deny", cmd);
  assert.equal(decision(bash("rm -rf .", p.abs("opdrachten/02-lijst"))), "deny", "cd into the exercise, then rm -rf .");
  assert.equal(decision(bash("cp /tmp/sol/* .", p.abs("opdrachten/02-lijst"))), "deny", "a glob into the exercise");
  assert.equal(decision(ps("Remove-Item -Recurse opdrachten/02-lijst")), "deny", "PowerShell");
  assert.equal(decision(bash(String.raw`cp /tmp/sol.txt opdrachten/02-lijst/Lijst.c\s`)), "deny", "escaped extension");
  // Controls: an L4 folder, an unmapped folder (build output), and a plain file into an exercise.
  for (const cmd of ["rm -rf opdrachten/04-x", "rm -rf build", "rm -rf bin obj", "cp README.md opdrachten/02-lijst/", "tar -tf sol.tar"]) {
    assert.equal(decision(bash(cmd)), "allow", cmd);
  }
});

// ---------- V5 (medium): the user-level files of the harness ----------
import { HARNESS, run } from "./helpers.mjs";

test("V5: the project guard denies writes to ~/.claude/settings*.json and ~/.claude/leerharnas/", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-home-"));
  try {
    const env = { HOME: home, USERPROFILE: home };
    const guard = (tool, tool_input) => decision(p.hook("guard.mjs", { tool_name: tool, tool_input, cwd: p.root }, env));
    const f = (rel) => path.join(home, ".claude", rel);
    assert.equal(guard("Write", { file_path: f("leerharnas/graded.json"), content: '{"paths":[]}' }), "deny");
    assert.equal(guard("Write", { file_path: f("settings.json"), content: '{"disableAllHooks":true}' }), "deny");
    assert.equal(guard("Edit", { file_path: f("leerharnas/graded-gate.mjs"), old_string: "a", new_string: "b" }), "deny");
    for (const cmd of ["echo '{\"paths\":[]}' > ~/.claude/leerharnas/graded.json", "echo x > ${HOME}/.claude/settings.json", "rm -rf ~/.claude/leerharnas", "rm -rf ~/.claude"]) {
      assert.equal(guard("Bash", { command: cmd }), "deny", cmd);
    }
    assert.equal(guard("PowerShell", { command: "Set-Content $HOME/.claude/settings.json '{}'" }), "deny");
    // Controls: reading, and other files in ~/.claude.
    assert.equal(guard("Bash", { command: "cat ~/.claude/settings.json" }), "allow");
    assert.equal(guard("Write", { file_path: f("plans/plan.md"), content: "x" }), "allow");
  } finally { fs.rmSync(home, { recursive: true, force: true }); }
});

test("V5: the user-level gate protects its own files from other projects", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-home-"));
  const other = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-other-"));
  try {
    fs.mkdirSync(path.join(home, ".claude", "leerharnas"), { recursive: true });
    fs.writeFileSync(path.join(home, ".claude", "leerharnas", "graded.json"), JSON.stringify({ paths: [path.join(home, "eindopdracht").split(path.sep).join("/")] }));
    const gate = (tool_input) => decision(run(path.join(HARNESS, "user", "graded-gate.mjs"), [], {
      input: JSON.stringify({ hook_event_name: "PreToolUse", tool_name: tool_input.command ? "Bash" : "Write", tool_input, cwd: other }),
      env: { ...process.env, HOME: home, USERPROFILE: home }, cwd: other,
    }));
    assert.equal(gate({ file_path: path.join(home, ".claude", "leerharnas", "graded.json"), content: "{}" }), "deny");
    assert.equal(gate({ file_path: path.join(home, ".claude", "settings.json"), content: "{}" }), "deny");
    assert.equal(gate({ command: "echo '{}' > ~/.claude/leerharnas/graded.json" }), "deny");
    assert.equal(gate({ command: "cat ~/.claude/settings.json" }), "allow", "reading");
    assert.equal(gate({ file_path: path.join(other, "x.txt"), content: "x" }), "allow", "another project");
  } finally { fs.rmSync(home, { recursive: true, force: true }); fs.rmSync(other, { recursive: true, force: true }); }
});
