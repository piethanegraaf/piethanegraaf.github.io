// The rung floor (opencode plan, free models #1): a code block at L2/L3 is help of rung 4 or 5, marker or not.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject } from "./helpers.mjs";
import { codeFloor } from "../core/floor.mjs";

const data = { settings: { codeExtensions: ["cs", "csproj"] }, skills: [] };
const block = (lang, n) => "```" + lang + "\n" + Array.from({ length: n }, (_, i) => `int x${i} = ${i};`).join("\n") + "\n```";

test("floor: a short block in the learner's language is rung 4, a longer one rung 5", () => {
  assert.deepEqual(codeFloor(`Look:\n${block("csharp", 3)}`, data), { rung: 4, lines: 3 });
  assert.deepEqual(codeFloor(block("cs", 12), data), { rung: 5, lines: 12 });
  assert.equal(codeFloor(block("", 2), data).rung, 4, "an untagged block that looks like code");
});

test("floor: commands, output, text, pseudocode and other languages do not count", () => {
  assert.equal(codeFloor("```bash\n! node .claude/hooks/check.mjs opdrachten/02\n```", data).rung, 0);
  assert.equal(codeFloor("```\n! node .claude/hooks/check.mjs opdrachten/02\n```", data).rung, 0);
  assert.equal(codeFloor("```text\nif saldo < bedrag: weiger\n```", data).rung, 0);
  assert.equal(codeFloor("```\nals het saldo te laag is\n  weiger de opname\n```", data).rung, 0);
  assert.equal(codeFloor(block("python", 4), data).rung, 0, "not the learner's language");
  assert.equal(codeFloor("```mermaid\nclassDiagram\n  A <|-- B\n```", data).rung, 0);
  assert.equal(codeFloor("No code here, `x = 1;` inline is fine.", data).rung, 0);
});

test("floor: reflect-gate logs rung 5 for a 12-line block without a marker at L2, and nothing at L4", () => {
  const sid = "floor-1";
  const p = makeProject({ sessions: { [sid]: { activeSkill: "demo.l2", folderSkill: "demo.l2", maxRung: 0, rung: 1 } } });
  try {
    const file = path.join(p.root, "t.jsonl");
    fs.writeFileSync(file, JSON.stringify({ type: "user", message: { content: "Hoe schrijf ik Opnemen?" } }) + "\n");
    const r = p.hook("reflect-gate.mjs", { session_id: sid, transcript_path: file, last_assistant_message: `Zo:\n${block("csharp", 12)}` });
    assert.equal(r.code, 0, r.stderr);
    assert.equal(p.session(sid).maxRung, 5);
    assert.ok(p.events().some((e) => e.type === "rung-mark" && e.rung === 5 && e.floor === true));
  } finally { p.cleanup(); }
  const q = makeProject({ sessions: { [sid]: { activeSkill: "demo.l4", folderSkill: "demo.l4", maxRung: 0 } } });
  try {
    const file = path.join(q.root, "t.jsonl");
    fs.writeFileSync(file, JSON.stringify({ type: "user", message: { content: "Schrijf Opnemen" } }) + "\n");
    q.hook("reflect-gate.mjs", { session_id: sid, transcript_path: file, last_assistant_message: block("csharp", 12) });
    assert.equal(q.session(sid).maxRung ?? 0, 0, "L4: the AI may write code");
  } finally { q.cleanup(); }
});
