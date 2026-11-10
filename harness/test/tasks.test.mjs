// Task corrections (skill.mjs correct / untask) and how allTasks applies them.
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeProject, fakeSkills } from "./helpers.mjs";

const at = "2026-11-10T12:00:00.000Z";
const task = (tid, maxRung, extra = {}) => ({ at, type: "task", tid, skill: "demo.l2", success: maxRung < 5, maxRung, source: "check", ...extra });
const explained = (tid) => ({ at, type: "task-explained", tid, skill: "demo.l2", text: "uitleg" });

function project() {
  return makeProject({ events: [task("t1", 0), explained("t1"), task("t2", 1), explained("t2"), task("t3", 0)] });
}

test("correct trede: raises the rung of one task, logged with reason", () => {
  const p = project();
  try {
    const r = p.cli("skill.mjs", ["correct", "t1", "trede", "2", "hulp was niet gelogd"]);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /trede 0 -> 2/);
    const ev = p.events().find((e) => e.type === "task-correct");
    assert.deepEqual([ev.tid, ev.from, ev.maxRung, ev.reason], ["t1", 0, 2, "hulp was niet gelogd"]);
  } finally { p.cleanup(); }
});

test("correct trede: lower or equal is refused (evidence may not look better than it was)", () => {
  const p = project();
  try {
    const r = p.cli("skill.mjs", ["correct", "t2", "trede", "1", "x"]);
    assert.equal(r.code, 1);
    assert.match(r.stderr, /alleen omhoog/);
    assert.equal(p.events().filter((e) => e.type === "task-correct").length, 0);
  } finally { p.cleanup(); }
});

test("correct trede 5: the task now counts as not solved", () => {
  const p = project();
  try {
    p.cli("skill.mjs", ["correct", "t1", "trede", "5", "uitwerking gekregen"]);
    const r = p.cli("skill.mjs", ["list"]);
    assert.match(r.stdout, /demo\.l2\s+1\/2 gelukt/); // t1 failed now, t2 ok, t3 still waits for explanation
  } finally { p.cleanup(); }
});

test("correct: needs a reason and a known task", () => {
  const p = project();
  try {
    assert.equal(p.cli("skill.mjs", ["correct", "t1", "trede", "3"]).code, 1);
    assert.equal(p.cli("skill.mjs", ["correct", "t1", "schrap"]).code, 1);
    assert.match(p.cli("skill.mjs", ["correct", "onbekend", "trede", "3", "x"]).stderr, /Onbekende taak/);
  } finally { p.cleanup(); }
});

test("correct schrap: voids exactly that task", () => {
  const p = project();
  try {
    const r = p.cli("skill.mjs", ["correct", "t1", "schrap", "herstel van een regressie"]);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /Nu 1\/1 gelukt/);
    const status = p.cli("skill.mjs", ["status"]).stdout;
    assert.match(status, /demo\.l2 \[t3\]/); // t3 still waits for an explanation
  } finally { p.cleanup(); }
});

test("a promotion is refused while a task still waits for an explanation", () => {
  const p = project();
  try {
    const r = p.cli("skill.mjs", ["set", "demo.l2", "L3", "x"]);
    assert.equal(r.code, 1);
    assert.match(r.stderr, /t3/);
    assert.equal(p.skills().skills.find((s) => s.id === "demo.l2").level, "L2");
    assert.equal(p.cli("skill.mjs", ["set", "demo.l2", "L1", "terug"]).code, 0); // lowering is always allowed
  } finally { p.cleanup(); }
});

test("promotion and relapse signals in status (both languages)", () => {
  const ev = [];
  for (let i = 1; i <= 5; i++) ev.push(task(`u${i}`, i % 2), explained(`u${i}`));
  const up = makeProject({ events: ev });
  try {
    const r = up.cli("skill.mjs", ["status"]);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /↑ demo\.l2: 5\/5 gelukt \(≥ 85%\)/);
    assert.match(r.stdout, /skill\.mjs set demo\.l2 L3 "5\/5 gelukt"/);
  } finally { up.cleanup(); }
  const down = makeProject({ events: [task("d1", 5), explained("d1"), task("d2", 5), explained("d2")],
    skills: { ...fakeSkills({ language: "en" }) } });
  try {
    const r = down.cli("skill.mjs", ["status"]);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /↓ demo\.l2: two tasks in a row failed/);
    assert.match(r.stdout, /set demo\.l2 L1 "2 failed in a row"/);
  } finally { down.cleanup(); }
});

test("setting: course and language are validated and stored", () => {
  const p = project();
  try {
    assert.equal(p.cli("skill.mjs", ["setting", "course", "Object-Oriented", "Design"]).code, 0);
    assert.equal(p.skills().settings.course, "Object-Oriented Design");
    assert.equal(p.cli("skill.mjs", ["setting", "language", "en"]).code, 0);
    assert.equal(p.cli("skill.mjs", ["setting", "language", "de"]).code, 1);
    assert.equal(p.cli("skill.mjs", ["setting", "examDate", "20-01-2027"]).code, 1);
    assert.equal(p.cli("skill.mjs", ["setting", "nope", "x"]).code, 1);
  } finally { p.cleanup(); }
});
