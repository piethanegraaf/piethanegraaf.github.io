// The guard as a core function (opencode plan): one host-neutral request in, one decision out.
// The core reads LEERHARNAS_ROOT when it loads, so the project is made before the dynamic import.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { makeProject } from "./helpers.mjs";

const p = makeProject();
process.env.LEERHARNAS_ROOT = p.root;
process.env.LEERHARNAS_DATA = p.learn;
const { guard } = await import("../core/guard.mjs");
after(() => p.cleanup());

const write = (file, todo = { before: "", after: "class A {}" }) => guard({ kind: "write", tool: "test-edit", file: p.abs(file), todo, sessionId: "core1" });
const shell = (command, cwd = p.root) => guard({ kind: "shell", tool: "test-shell", command, shell: "bash", cwd, sessionId: "core1" });

test("core guard: a write at L2 is denied with a reason, at L4 allowed", () => {
  const r = write("opdrachten/02-x/A.cs");
  assert.equal(r.decision, "deny");
  assert.match(r.reason, /demo\.l2/);
  assert.equal(write("opdrachten/04-x/A.cs").decision, "allow");
});

test("core guard: L1 allows a skeleton that keeps TODO(human), denies filling it or an edit without text", () => {
  const f = "opdrachten/01-x/A.cs";
  assert.equal(write(f, { before: "", after: "void M() { // TODO(human)\n}" }).decision, "allow");
  assert.equal(write(f, { before: "// TODO(human)", after: "return 42;" }).decision, "deny");
  assert.equal(write(f, null).decision, "deny", "an edit without a diff is denied at L1");
});

test("core guard: the record is not written, the diary is", () => {
  assert.equal(write(".learning/skills.json").decision, "deny");
  assert.equal(write(".learning/state/session-x.json").decision, "deny");
  assert.equal(write(".learning/diary/2026-11-16.md").decision, "allow");
});

test("core guard: a build in an L2 folder is denied, a read-only command is not; other tools pass", () => {
  assert.equal(shell("dotnet test", p.abs("opdrachten/02-x")).decision, "deny");
  assert.equal(shell("git status").decision, "allow");
  assert.equal(guard({ kind: "other", tool: "read" }).decision, "allow");
});

test("core guard: deny events land in the shared event log", () => {
  write("opdrachten/03-x/B.cs");
  assert.ok(p.events().some((e) => e.type === "deny" && e.tool === "test-edit" && e.level === "L3"));
});

test("core guard: an MCP tool is denied unless settings.allowedMcp names it, its server or *", async () => {
  const fs = await import("node:fs");
  const mcp = (name) => guard({ kind: "mcp", tool: name, name }).decision;
  assert.equal(mcp("mcp__files__write_file"), "deny");
  const data = p.skills();
  for (const allowed of [["mcp__files__write_file"], ["files"], ["mcp__files__*"], ["*"]]) {
    data.settings.allowedMcp = allowed;
    fs.writeFileSync(p.abs(".learning/skills.json"), JSON.stringify(data));
    assert.equal(mcp("mcp__files__write_file"), "allow", JSON.stringify(allowed));
  }
  data.settings.allowedMcp = ["other"];
  fs.writeFileSync(p.abs(".learning/skills.json"), JSON.stringify(data));
  assert.equal(mcp("mcp__files__write_file"), "deny");
  delete data.settings.allowedMcp;
  fs.writeFileSync(p.abs(".learning/skills.json"), JSON.stringify(data));
});
