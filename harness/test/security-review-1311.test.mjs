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
