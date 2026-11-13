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
