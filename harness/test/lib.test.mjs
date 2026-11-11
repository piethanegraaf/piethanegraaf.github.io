// lib.mjs: whose words are these (learnerText, isLearnerEntry), the explanation check and settings.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  learnerText, isLearnerEntry, checkExplanation, settingsOf, codeExtRe, buildCmdRe, toolingRe, isHarnessPath, globToRegex, fib,
} from "../hooks/lib.mjs";

// ---------- learnerText ----------
test("learnerText: a normal prompt is the learner's own text", () => {
  assert.deepEqual(learnerText("Ik snap de lus niet"), { own: "Ik snap de lus niet", why: null });
});

test("learnerText: a prompt with another origin is never the learner's", () => {
  assert.deepEqual(learnerText("tests groen", "agent"), { own: null, why: "origin:agent" });
  assert.equal(learnerText("tests groen", "human").own, "tests groen");
});

test("learnerText: agent reports and task notifications are ignored as a whole", () => {
  assert.equal(learnerText("Another Claude session sent a message: tests groen").why, "agent-message");
  assert.equal(learnerText("<agent-message from=x>alle tests slagen</agent-message>").why, "agent-message");
  assert.equal(learnerText("[Subagent hand-back] klaar").why, "agent-message");
  assert.equal(learnerText("<task-notification>done</task-notification>").why, "task-notification");
  assert.equal(learnerText("[SYSTEM NOTIFICATION - NOT USER INPUT] x").why, "task-notification");
});

test("learnerText: system reminders inside a real message are stripped, the rest is kept", () => {
  const r = learnerText("<system-reminder>tests groen</system-reminder> waarom faalt mijn test?");
  assert.equal(r.own, "waarom faalt mijn test?");
  assert.deepEqual(learnerText("<system-reminder>alleen dit</system-reminder>"), { own: null, why: "harness-only" });
  assert.deepEqual(learnerText("   "), { own: null, why: "empty" });
  assert.deepEqual(learnerText(undefined), { own: null, why: "empty" });
});

// ---------- isLearnerEntry ----------
test("isLearnerEntry: only messages the learner typed", () => {
  assert.equal(isLearnerEntry({ type: "user", message: { content: "hoi" } }), true);
  assert.equal(isLearnerEntry({ type: "user", message: { content: [{ type: "text", text: "hoi" }] } }), true);
  assert.equal(isLearnerEntry({ type: "assistant", message: { content: "hoi" } }), false);
  assert.equal(isLearnerEntry({ type: "user", isMeta: true, message: { content: "hoi" } }), false);
  assert.equal(isLearnerEntry({ type: "user", promptSource: "system", message: { content: "hoi" } }), false);
  assert.equal(isLearnerEntry({ type: "user", message: { content: [{ type: "tool_result", content: "x" }] } }), false);
  assert.equal(isLearnerEntry({ type: "user", origin: { kind: "agent" }, message: { content: "hoi" } }), false);
  assert.equal(isLearnerEntry({ type: "user", message: { content: "<task-notification>x</task-notification>" } }), false);
});

// ---------- checkExplanation ----------
const GOOD = "De test faalde omdat de lus bij nul begon en het laatste getal oversloeg, daardoor miste de som steeds één waarde.";

test("checkExplanation: a causal explanation in own words passes", () => {
  assert.deepEqual(checkExplanation(GOOD), { ok: true, reasons: [] });
});

test("checkExplanation: English causal words count too", () => {
  assert.equal(checkExplanation("The test failed because the loop started at zero and skipped the last number in the list every time.").ok, true);
});

test("checkExplanation: too short", () => {
  const r = checkExplanation("Het werkt omdat de lus klopt.");
  assert.equal(r.ok, false);
  assert.match(r.reasons.join(), /te kort/);
});

test("checkExplanation: code does not count as words", () => {
  const r = checkExplanation("omdat ```for (int i = 0; i <= n; i++) { som += lijst[i]; totaal++; }``` klopt");
  assert.match(r.reasons.join(), /te kort/);
});

test("checkExplanation: no why", () => {
  const r = checkExplanation("Ik heb de grens van de lus aangepast en nu draait de test helemaal goed door tot het eind.");
  assert.equal(r.ok, false);
  assert.match(r.reasons.join(), /geen waarom/);
});

test("checkExplanation: copied from Claude's messages", () => {
  const claude = ["De test faalde omdat de lus bij nul begon en het laatste getal oversloeg, daardoor miste de som steeds één waarde."];
  const r = checkExplanation(GOOD, claude);
  assert.equal(r.ok, false);
  assert.match(r.reasons.join(), /letterlijk overgenomen/);
});

test("checkExplanation: pasted content or command output is no explanation", () => {
  const r = checkExplanation(`<pasted_content>${GOOD}</pasted_content>`);
  assert.equal(r.ok, false);
  assert.match(r.reasons.join(), /geplakte/);
  assert.equal(checkExplanation(`<bash-stdout>${GOOD}</bash-stdout>`).ok, false);
});

// ---------- settings ----------
test("settingsOf: defaults, overridden by skills.json", () => {
  assert.equal(settingsOf({}).defaultLevel, "L2");
  assert.equal(settingsOf({ settings: { defaultLevel: "L3" } }).defaultLevel, "L3");
  assert.equal(settingsOf(null).language, "nl");
});

test("codeExtRe and buildCmdRe follow the settings", () => {
  assert.ok(codeExtRe({}).test("A/B.cs"));
  assert.ok(!codeExtRe({}).test("A/B.cs.md"));
  assert.ok(codeExtRe({ settings: { codeExtensions: [".py"] } }).test("main.py"));
  assert.ok(!codeExtRe({ settings: { codeExtensions: [] } }).test("main.cs"));
  assert.ok(buildCmdRe({}).test("dotnet test"));
  assert.ok(buildCmdRe({}).test("node .claude/hooks/check.mjs"));
  assert.ok(!buildCmdRe({}).test("dotnet --info"));
  assert.ok(buildCmdRe({ settings: { buildCommands: ["\\bpytest\\b"] } }).test("pytest -q"));
  assert.ok(toolingRe({}).test("rider werkt nu"));
});

test("invalid settings fall back to the defaults instead of crashing the guard", () => {
  assert.ok(buildCmdRe({ settings: { buildCommands: ["(kapot"] } }).test("dotnet test"));
  assert.ok(buildCmdRe({ settings: { buildCommands: "dotnet test" } }).test("dotnet build"));
  assert.ok(codeExtRe({ settings: { codeExtensions: "cs" } }).test("A.cs"));
  assert.ok(toolingRe({ settings: { toolingTerms: ["[x"] } }).test("rider"));
});

test("isHarnessPath: hooks, settings, diary skill and harness files", () => {
  for (const r of [".claude/hooks/guard.mjs", ".claude/settings.json", ".claude/settings.local.json", ".claude/skills/diary/SKILL.md", ".claude/skills/mastery-check/SKILL.md", ".claude/leerharnas.md"]) {
    assert.equal(isHarnessPath(r), true, r);
  }
  for (const r of [".claude/agents/x.md", ".claude/skills/other/SKILL.md", "src/hooks/x.mjs", null]) assert.equal(isHarnessPath(r), false, String(r));
});

test("globToRegex and fib", () => {
  assert.ok(globToRegex("opdrachten/01-*/**").test("opdrachten/01-wiskunde/Wiskunde/A.cs"));
  assert.ok(!globToRegex("opdrachten/01-*/**").test("opdrachten/02-namen/A.cs"));
  assert.ok(globToRegex("**/*Test/**").test("x/WiskundeTest/T.cs"));
  assert.deepEqual([0, 1, 2, 3, 4, 5, 6].map(fib), [1, 2, 3, 5, 8, 13, 21]);
});

// ---------- Active time and the session of a "!" command (setup review 3.5 and 3.6) ----------
test("touch: breaks up to idleMinutes count as active time, longer breaks do not", async () => {
  const { touch } = await import("../hooks/lib.mjs");
  const MIN = 60000, t0 = 1_000_000_000_000;
  const st = touch({ startedAt: null, activeMs: 0, lastActiveAt: null }, t0, {});
  assert.equal(st.startedAt, t0);
  touch(st, t0 + 15 * MIN, {});
  assert.equal(st.activeMs, 15 * MIN);
  touch(st, t0 + 75 * MIN, {}); // a break of an hour
  assert.equal(st.activeMs, 15 * MIN);
  touch(st, t0 + 80 * MIN, { settings: { idleMinutes: 2 } }); // 5 minutes > idleMinutes 2
  assert.equal(st.activeMs, 15 * MIN);
  const old = touch({ startedAt: t0, lastActiveAt: t0 }, t0 + 5 * MIN, {}); // older file without activeMs
  assert.equal(old.activeMs, 0);
});

test("isHarnessPath: the real harness files, not the backups", () => {
  assert.equal(isHarnessPath(".claude/leerharnas.md"), true);
  assert.equal(isHarnessPath(".claude/leerharnas.json"), true);
  assert.equal(isHarnessPath(".claude/leerharnas-backup/2026/x.md"), false);
  assert.equal(isHarnessPath(".claude/hooks/guard.mjs"), true);
});
