// prompt-gate.mjs: the folder decides the family (setup review 3.3) and the stuck timer, the
// session hour and the task minutes count active time only (setup review 3.5).
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeProject, fakeSkills } from "./helpers.mjs";

const SID = "pg-sessie";
const MIN = 60000;

// fakeSkills plus a microskill from ANOTHER family whose keyword ("string") is in an everyday question.
function skills() {
  const s = fakeSkills();
  s.skills.push({ id: "demo.l3.strings", parent: "demo.l3", title: "Strings", level: "L3", keywords: ["string"], placement: "done" });
  return s;
}
function project(session, files = {}) {
  const p = makeProject({ skills: skills(), sessions: { [SID]: session }, files });
  const prompt = (text) => p.hook("prompt-gate.mjs", { session_id: SID, prompt: text, cwd: p.root });
  const ctx = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";
  return { p, prompt, ctx };
}
const base = (extra = {}) => {
  const now = Date.now();
  return { startedAt: now - 10 * MIN, lastActiveAt: now - MIN, activeMs: 9 * MIN, activeSkill: "demo.l2", rung: 0, maxRung: 0, ...extra };
};

// ---------- 3.3 The folder decides ----------
test("with a known folder, a keyword of another family does not switch the skill", () => {
  const { p, prompt, ctx } = project(base({ folderSkill: "demo.l2", folderSkillAt: Date.now() + MIN }));
  try {
    const r = prompt("waarom is die string leeg?");
    assert.equal(p.session(SID).activeSkill, "demo.l2");
    assert.match(ctx(r), /Vaardigheid: demo\.l2 /);
  } finally { p.cleanup(); }
});

test("a session skill from another family is replaced by the folder's skill", () => {
  const { p, prompt } = project(base({ activeSkill: "demo.l3.strings", folderSkill: "demo.l2", folderSkillAt: Date.now() + MIN }));
  try {
    prompt("en nu?");
    assert.equal(p.session(SID).activeSkill, "demo.l2");
  } finally { p.cleanup(); }
});

test("#id and the name of an exercise still switch to another family", () => {
  const { p, prompt } = project(base({ folderSkill: "demo.l2", folderSkillAt: Date.now() + MIN }), { "opdrachten/03-tekstverwerker/T.cs": "" });
  try {
    prompt("vraag over #demo.l3.strings");
    assert.equal(p.session(SID).activeSkill, "demo.l3.strings");
    prompt("ik ga verder met 03-tekstverwerker");
    assert.equal(p.session(SID).activeSkill, "demo.l3");
    // The switch sticks: the next prompt does not fall back to the old folder.
    prompt("en hoe nu verder?");
    assert.equal(p.session(SID).activeSkill, "demo.l3");
    assert.equal(p.session(SID).folderSkill, "demo.l3");
  } finally { p.cleanup(); }
});

test("without a folder, one loose keyword is a tie and does not switch either", () => {
  const { p, prompt } = project(base());
  try {
    prompt("waarom is die string leeg?");
    assert.equal(p.session(SID).activeSkill, "demo.l2");
  } finally { p.cleanup(); }
});

test("a code file changed more recently than the folder signal moves the folder", () => {
  // The learner opened another exercise and edited it, without running check.mjs there yet.
  const { p, prompt } = project(base({ folderSkill: "demo.l2", folderSkillAt: Date.now() - 5 * MIN }), { "opdrachten/03-x/X.cs": "class X {}" });
  try {
    prompt("hoe verder?");
    assert.equal(p.session(SID).folderSkill, "demo.l3");
    assert.equal(p.session(SID).activeSkill, "demo.l3");
  } finally { p.cleanup(); }
});

// ---------- 3.5 Active time ----------
const hintSession = (lastActiveAgo, activeMs, lastRungActive) => base({
  lastActiveAt: Date.now() - lastActiveAgo, activeMs, rung: 1, maxRung: 1,
  lastRungAt: Date.now() - lastActiveAgo - MIN, lastRungActive, taskStartedActive: 0,
});

test("a break of 60 minutes followed by 'hint' does not unlock the next rung", () => {
  const { p, prompt } = project(hintSession(60 * MIN, 3 * MIN, 2 * MIN));
  try {
    prompt("ik zit vast, hint?");
    assert.equal(p.session(SID).rung, 1);
    assert.ok(p.events().some((e) => e.type === "hint-hold"));
    assert.equal(p.session(SID).activeMs, 3 * MIN, "the break does not count as active time");
  } finally { p.cleanup(); }
});

test("12 minutes of active time since the last hint unlocks the next rung", () => {
  const { p, prompt } = project(hintSession(MIN, 13 * MIN, MIN));
  try {
    prompt("ik zit vast, hint?");
    assert.equal(p.session(SID).rung, 2);
    assert.ok(p.events().some((e) => e.type === "hint-unlock" && e.rung === 2));
  } finally { p.cleanup(); }
});

test("the session hour counts active time: 2 hours ago, but 10 minutes active, gives no message", () => {
  const { p, prompt, ctx } = project(base({ startedAt: Date.now() - 120 * MIN, activeMs: 9 * MIN }));
  try {
    assert.doesNotMatch(ctx(prompt("hoe werkt een lijst?")), /een uur/);
  } finally { p.cleanup(); }
  const q = project(base({ startedAt: Date.now() - 70 * MIN, activeMs: 61 * MIN }));
  try {
    assert.match(q.ctx(q.prompt("hoe werkt een lijst?")), /een uur/);
  } finally { q.p.cleanup(); }
});

test("a new session starts its clock at the learner's first prompt", () => {
  const p = makeProject({ skills: skills() });
  try {
    const before = Date.now();
    p.hook("prompt-gate.mjs", { session_id: "nieuw", prompt: "hallo", cwd: p.root });
    const st = p.session("nieuw");
    assert.ok(st.startedAt >= before);
    assert.equal(st.activeMs, 0);
  } finally { p.cleanup(); }
});
