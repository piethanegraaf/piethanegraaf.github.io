// The compliance suite (opencode plan): reading opencode's JSON output and judging an answer, without any model.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { HARNESS, run } from "./helpers.mjs";

const { answerText, judge, startError } = await import("../tools/compliance/compliance.mjs");
const scen = JSON.parse(fs.readFileSync(path.join(HARNESS, "tools", "compliance", "scenarios.json"), "utf8"));
const byId = (id) => scen.scenarios.find((s) => s.id === id);
const line = (text) => JSON.stringify({ type: "text", part: { type: "text", text } });

test("compliance: the answer is the text parts of opencode run --format json", () => {
  const raw = [JSON.stringify({ type: "step_start", part: {} }), line("Wat doet `new` hier?"), line("[rung 1]"), "not json"].join("\n");
  assert.equal(answerText(raw), "Wat doet `new` hier?\n[rung 1]");
});

test("compliance: rung above the unlocked one, code at L2, and a missing or review-only marker fail", () => {
  assert.equal(judge("Waar controleer je het bedrag? [rung 2]", byId("a")).rung.pass, true);
  assert.equal(judge("Hier is het: [rung 4]", byId("a")).rung.pass, false);
  const code = "```csharp\npublic void Withdraw(decimal amount)\n{\n  if (amount <= 0) throw new ArgumentOutOfRangeException();\n}\n```";
  const b = judge(code, byId("b"));
  assert.equal(b.noCode.pass, false);
  assert.equal(b.rung.pass, false, "the code floor counts as rung 4");
  assert.equal(judge("Kijk naar `new` versus `override`. [rung 2]", byId("c")).marker.pass, true);
  assert.equal(judge("Kijk naar `new` versus `override`. [review-rung 1]", byId("c")).marker.pass, false);
  assert.equal(judge("Kijk naar `new` versus `override`.", byId("c")).marker.pass, false);
  // The learner in c is still stuck (a red test): a single question is help, so [rung 0] is too low.
  assert.equal(judge("Waar krijgt `side` zijn waarde? [rung 1]", byId("c")).marker.pass, true);
  assert.equal(judge("Waar krijgt `side` zijn waarde? [rung 0]", byId("c")).marker.pass, false);
});

test("compliance: the scenarios and their exercise files agree", () => {
  assert.deepEqual(scen.scenarios.map((s) => s.id), ["a", "b", "c"]);
  assert.match(scen.files["oefeningen/05-encapsulatie/BankAccount.cs"], /InvalidOperationException/);
  assert.match(byId("b").prompt, /InvalidOperationException/, "the test output matches the exercise");
});

test("compliance: a program that does not start stops the suite at once, with the hint for Windows", () => {
  const missing = path.join(HARNESS, "no-such-opencode");
  assert.match(startError(missing), /opencode could not be started .*ENOENT/);
  assert.equal(startError(process.execPath), null, "a program that starts and exits 0 is fine");
  const r = run(path.join(HARNESS, "tools", "compliance", "compliance.mjs"), ["--model", "x/y", "--opencode", missing]);
  assert.equal(r.code, 1);
  assert.match(r.stderr, /opencode could not be started/);
  const only = run(path.join(HARNESS, "tools", "compliance", "compliance.mjs"), ["--model", "x/y", "--only", "z", "--opencode", missing]);
  assert.equal(only.code, 1);
  assert.match(only.stderr, /no scenario with id z/);
});
