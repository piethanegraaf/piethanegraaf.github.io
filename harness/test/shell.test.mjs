// shell.mjs: a command is split into the simple commands it really runs (setup review 3.4).
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCommand, commandName } from "../hooks/shell.mjs";

const argvs = (cmd) => parseCommand(cmd).commands.map((c) => c.argv);

test("separators: && || ; | & and new lines give separate commands", () => {
  assert.deepEqual(argvs("cd 06 && dotnet --list-sdks | grep -i \"msbuild\""), [["cd", "06"], ["dotnet", "--list-sdks"], ["grep", "-i", "msbuild"]]);
  assert.deepEqual(argvs("a || b; c & d\ne"), [["a"], ["b"], ["c"], ["d"], ["e"]]);
});

test("quotes: the content is one word, and a quoted program counts as the program", () => {
  const c = parseCommand('& "C:\\Program Files\\Microsoft Visual Studio\\MSBuild.exe" x.sln').commands;
  assert.equal(c.length, 1);
  assert.equal(commandName(c[0].argv[0]), "msbuild");
  assert.deepEqual(c[0].argv.slice(1), ["x.sln"]);
});

test("redirects give file targets; 2>&1 and arrows do not", () => {
  const [c] = parseCommand("echo x > opdrachten/02-lijst/Lijst.cs 2>&1").commands;
  assert.deepEqual([c.argv, c.redirects], [["echo", "x"], ["opdrachten/02-lijst/Lijst.cs"]]);
  assert.deepEqual(parseCommand('grep -n x => x Lijst.cs').commands[0].redirects, []);
  assert.deepEqual(parseCommand("a >> log.txt").commands[0].redirects, ["log.txt"]);
});

test("nested shells and wrappers are looked through", () => {
  assert.deepEqual(argvs('bash -c "cd x && dotnet test"'), [["cd", "x"], ["dotnet", "test"]]);
  assert.deepEqual(argvs('powershell -NoProfile -Command "dotnet build; echo ok"'), [["dotnet", "build"], ["echo", "ok"]]);
  assert.deepEqual(argvs('cmd /c "dotnet test"'), [["dotnet", "test"]]);
  assert.deepEqual(argvs("FOO=1 sudo dotnet test --no-build"), [["dotnet", "test", "--no-build"]]);
  assert.deepEqual(argvs('Start-Process dotnet -ArgumentList "test" -NoNewWindow -Wait'), [["dotnet", "test"]]);
  assert.deepEqual(argvs("ls | xargs -n 1 dotnet build"), [["ls"], ["dotnet", "build"]]);
});

test("command substitution is a command of its own", () => {
  assert.deepEqual(argvs('echo "$(dotnet test)"').slice(-1), [["dotnet", "test"]]);
  assert.deepEqual(argvs("echo `dotnet test`").slice(-1), [["dotnet", "test"]]);
});

test("eval, iex and encoded PowerShell are opaque", () => {
  assert.equal(parseCommand('eval "dotnet test"').opaque, true);
  assert.equal(parseCommand('iex "dotnet test"').opaque, true);
  assert.equal(parseCommand("Invoke-Expression $x").opaque, true);
  assert.equal(parseCommand("powershell -EncodedCommand ZABvAHQAbgBlAHQA").opaque, true);
  assert.equal(parseCommand("dotnet test").opaque, false);
});
