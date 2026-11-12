// The decisions of the setup review of 10 November 2026 (S1-S4): explanations only right away
// (lapse), reviews only at L4 through real work, automatic demotion with the demotion analyst, and
// placement of a new skill by its first task.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject, fakeSkills, decision } from "./helpers.mjs";

const SID = "s-sessie";
const MIN = 60000;
const ago = (min) => new Date(Date.now() - min * MIN).toISOString();
const task = (tid, skill, maxRung, extra = {}) => ({ at: ago(30), type: "task", tid, skill, success: maxRung < 5, maxRung, source: "check", session: SID, ...extra });
const explained = (tid, skill) => ({ at: ago(29), type: "task-explained", tid, skill, text: "x", session: SID });
const GOOD = "De test is groen omdat de methode nu de som van alle cijfers teruggeeft in plaats van alleen het eerste cijfer.";
const user = (text, uuid = "u1") => ({ type: "user", uuid, message: { role: "user", content: text } });
const assistant = (content) => ({ type: "assistant", message: { role: "assistant", content: typeof content === "string" ? [{ type: "text", text: content }] : content } });
const session = (extra = {}) => ({ startedAt: Date.now() - 20 * MIN, lastActiveAt: Date.now() - MIN, activeMs: 19 * MIN, activeSkill: "demo.l2", rung: 0, maxRung: 0, ...extra });

function trx(dir, results) {
  fs.mkdirSync(dir, { recursive: true });
  const defs = Object.keys(results).map((n, i) => `<UnitTest name="${n}" id="id${i}"><TestMethod className="Demo.Tests" name="${n}" /></UnitTest>`).join("");
  const res = Object.entries(results).map(([n, o], i) => `<UnitTestResult testId="id${i}" testName="${n}" outcome="${o}" />`).join("");
  fs.writeFileSync(path.join(dir, "run.trx"), `<?xml version="1.0"?><TestRun><TestDefinitions>${defs}</TestDefinitions><Results>${res}</Results></TestRun>`);
  return dir;
}
const check = (p, folder, results, n) => p.cli("check.mjs", [folder], { LEERHARNAS_TRX_DIR: trx(p.abs(`trx-${n}`), results) });
function stop(p, transcript, last) {
  const file = path.join(p.root, `t-${Math.random().toString(36).slice(2)}.jsonl`);
  fs.writeFileSync(file, transcript.map((e) => JSON.stringify(e)).join("\n") + "\n");
  return p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: last });
}
const skillOf = (p, id) => p.skills().skills.find((s) => s.id === id);

// ---------- S1: explanation only right away, otherwise the task lapses ----------
test("S1: check.mjs in another folder lets an open task lapse; the same folder keeps it", () => {
  const p = makeProject({
    files: { "opdrachten/02-a/A.cs": "", "opdrachten/02-b/B.cs": "" },
    events: [task("ta", "demo.l2", 1, { dir: "opdrachten/02-a" })],
    sessions: { [SID]: session() },
  });
  try {
    check(p, "opdrachten/02-a", { Een: "Failed" }, 1);
    assert.equal(p.events().filter((e) => e.type === "task-lapsed").length, 0, "same folder: stays open");
    const r = check(p, "opdrachten/02-b", { Een: "Failed" }, 2);
    assert.match(r.stdout, /vervalt/);
    const lapsed = p.events().filter((e) => e.type === "task-lapsed");
    assert.deepEqual(lapsed.map((e) => [e.tid, e.reason]), [["ta", "other-exercise"]]);
    // A lapsed task is not open any more and does not count.
    const st = p.cli("skill.mjs", ["status"]);
    assert.match(st.stdout, /Overgeslagen.*\[ta\]/);
    assert.match(st.stdout, /wachten op uitleg in eigen woorden: geen/);
  } finally { p.cleanup(); }
});

test("S1: done for a skill of another family lets open tasks lapse", () => {
  const p = makeProject({ events: [task("ta", "demo.l2", 1)], sessions: { [SID]: session() } });
  try {
    p.cli("skill.mjs", ["done", "demo.l2.micro", "zelfde familie"]);
    assert.equal(p.events().filter((e) => e.type === "task-lapsed").length, 0);
    p.cli("skill.mjs", ["done", "demo.l3", "andere opdracht"]);
    assert.ok(p.events().some((e) => e.type === "task-lapsed" && e.tid === "ta"));
  } finally { p.cleanup(); }
});

test("S1: after the diary at the end of the session, open tasks of that session lapse", () => {
  const p = makeProject({ events: [task("ta", "demo.l2", 1)], sessions: { [SID]: session({ endRequested: true }) } });
  try {
    fs.writeFileSync(path.join(p.learn, "diary", "2026-11-10.md"), `# Dagboek\n<!-- sessie: ${SID} -->\n`);
    stop(p, [user("klaar")], "Je dagboek staat erin.");
    assert.ok(p.events().some((e) => e.type === "task-lapsed" && e.tid === "ta" && e.reason === "session-end"));
  } finally { p.cleanup(); }
});

test("S1: a new session lets tasks of an inactive session lapse, but not those of a session still in use", () => {
  const p = makeProject({ events: [
    task("oud", "demo.l2", 1, { session: "gisteren", at: ago(24 * 60) }),
    task("bezig", "demo.l2", 1, { session: "parallel", at: ago(2) }),
  ] });
  try {
    p.hook("session-start.mjs", { source: "startup", session_id: "nieuw" });
    const lapsed = p.events().filter((e) => e.type === "task-lapsed").map((e) => e.tid);
    assert.deepEqual(lapsed, ["oud"]);
  } finally { p.cleanup(); }
});

test("S1: replay may still explain a lapsed task, with both keys", () => {
  const p = makeProject({ events: [task("ta", "demo.l2", 1), { at: ago(20), type: "task-lapsed", tid: "ta", skill: "demo.l2", reason: "session-end" }] });
  try {
    const file = path.join(p.root, "oud.jsonl");
    fs.writeFileSync(file, [user(GOOD), assistant("Klopt. [uitleg-ok ta]")].map((e) => JSON.stringify(e)).join("\n") + "\n");
    p.cli("skill.mjs", ["replay", file]);
    assert.ok(p.events().some((e) => e.type === "task-explained" && e.tid === "ta" && e.source === "replay"));
  } finally { p.cleanup(); }
});

// ---------- S2: reviews only at L4, when the skill comes by ----------
function reviewSkills() {
  const s = fakeSkills();
  const l4 = s.skills.find((x) => x.id === "demo.l4");
  Object.assign(l4, { nextReview: "2026-01-01", intervalIndex: 2 });
  Object.assign(s.skills.find((x) => x.id === "demo.l3"), { nextReview: "2026-01-01", intervalIndex: 1 });
  return s;
}

test("S2: an L3 schedule no longer counts and disappears when the record is saved", () => {
  const p = makeProject({ skills: reviewSkills() });
  try {
    assert.doesNotMatch(p.cli("skill.mjs", ["list"]).stdout, /demo\.l3 .*herhaling klaar/);
    p.cli("skill.mjs", ["set", "demo.l1", "L2", "x"]);
    assert.equal(skillOf(p, "demo.l3").nextReview, null);
    assert.equal(skillOf(p, "demo.l4").nextReview, "2026-01-01");
  } finally { p.cleanup(); }
});

test("S2: a due L4 skill that comes by is announced once and counts as L3 for the guard", () => {
  const p = makeProject({ skills: reviewSkills(), sessions: { [SID]: session({ activeSkill: "demo.l4", folderSkill: "demo.l4", folderSkillAt: Date.now() + MIN }) } });
  try {
    const ctx = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";
    assert.match(ctx(p.hook("prompt-gate.mjs", { session_id: SID, prompt: "hoe pak ik dit aan?" })), /Herhaling: demo\.l4/);
    assert.doesNotMatch(ctx(p.hook("prompt-gate.mjs", { session_id: SID, prompt: "en nu?" })), /Herhaling: demo\.l4/);
    const w = p.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: p.abs("opdrachten/04-x/X.cs"), content: "" } });
    assert.equal(decision(w), "deny");
  } finally { p.cleanup(); }
});

test("S2: the next task decides the review: rung 0 pass (one step on), rung 3 fail (two back)", () => {
  const p = makeProject({ skills: reviewSkills(), files: { "opdrachten/04-x/X.cs": "" }, sessions: { [SID]: session({ activeSkill: "demo.l4" }) } });
  try {
    check(p, "opdrachten/04-x", { Een: "Failed", Twee: "Failed" }, 1);
    let r = check(p, "opdrachten/04-x", { Een: "Passed", Twee: "Failed" }, 2);
    assert.match(r.stdout, /geslaagd, interval omhoog/);
    assert.equal(skillOf(p, "demo.l4").intervalIndex, 3);
    assert.ok(p.events().some((e) => e.type === "review" && e.auto && e.result === "pass"));
    // Due again, now with much help.
    const s = p.skills(); Object.assign(s.skills.find((x) => x.id === "demo.l4"), { nextReview: "2026-01-01" });
    fs.writeFileSync(path.join(p.learn, "skills.json"), JSON.stringify(s));
    const st = p.session(SID); st.maxRung = 3; fs.writeFileSync(path.join(p.state, `session-${SID}.json`), JSON.stringify(st));
    r = check(p, "opdrachten/04-x", { Een: "Passed", Twee: "Passed" }, 3);
    assert.match(r.stdout, /mislukt, interval 2 stappen terug/);
    assert.equal(skillOf(p, "demo.l4").intervalIndex, 1);
  } finally { p.cleanup(); }
});

// ---------- S3: automatic demotion ----------
const autoSkills = () => fakeSkills({ autoDemote: true });

test("S3: without settings.autoDemote nothing changes automatically", () => {
  const p = makeProject({ events: [task("a", "demo.l2.micro", 4), explained("a", "demo.l2.micro"), task("b", "demo.l2.micro", 4), explained("b", "demo.l2.micro"), task("c", "demo.l2.micro", 4)], sessions: { [SID]: session() } });
  try {
    stop(p, [user(GOOD)], "Goed. [uitleg-ok c]");
    assert.equal(skillOf(p, "demo.l2.micro").level, "L2");
  } finally { p.cleanup(); }
});

test("S3: a microskill goes down one step right away, with one quiet line; not again for the same tasks", () => {
  const p = makeProject({ skills: autoSkills(), events: [
    task("a", "demo.l2.micro", 4), explained("a", "demo.l2.micro"), task("b", "demo.l2.micro", 0), explained("b", "demo.l2.micro"),
    task("e", "demo.l2.micro", 4), explained("e", "demo.l2.micro"),
    task("c", "demo.l2.micro", 4), task("d", "demo.l2.micro", 4, { at: ago(10) }),
  ], sessions: { [SID]: session() } });
  try {
    // d is still open: down waits for it (12 Nov, #32).
    let r = stop(p, [user(GOOD)], "Goed. [uitleg-ok c]");
    assert.equal(skillOf(p, "demo.l2.micro").level, "L2", "an open explanation of the family: no demotion yet");
    r = stop(p, [user(GOOD, "u8")], "Goed. [uitleg-ok d]");
    // One quiet line (12 Nov, #31): extra support, the parent stays, the way back.
    assert.match(r.json?.systemMessage ?? "", /^\[leerharnas\] Extra steun voor demo\.l2\.micro: nu L1 Aanvullen, was L2 \(1 van 5 gelukt \(20%\), laatste 2 niet\)\. De hoofdvaardigheid demo\.l2 blijft L2\. Terugdraaien: ! node/);
    assert.equal(skillOf(p, "demo.l2.micro").level, "L1");
    assert.ok(p.events().some((e) => e.type === "level" && e.auto && e.skill === "demo.l2.micro"));
    // A next explained task alone is no new evidence: the window starts after the change.
    const more = p.events().length;
    fs.appendFileSync(path.join(p.state, "events.jsonl"), JSON.stringify(task("f", "demo.l2.micro", 4, { at: new Date().toISOString() })) + "\n");
    stop(p, [user(GOOD, "u9")], "Goed. [uitleg-ok f]");
    assert.ok(p.events().length > more);
    assert.equal(skillOf(p, "demo.l2.micro").level, "L1");
    // The next prompt tells Claude to report it.
    const ctx = p.hook("prompt-gate.mjs", { session_id: SID, prompt: "oké" }).json?.hookSpecificOutput?.additionalContext ?? "";
    assert.match(ctx, /Meld dit kort aan de student/);
  } finally { p.cleanup(); }
});

// Four tasks (12 Nov, #33: at least 4): two failed, two solved = 50%. With open = true the last one still waits.
const parentTasks = (open = false) => [task("a", "demo.l2", 4), explained("a", "demo.l2"), task("b", "demo.l2", 4), explained("b", "demo.l2"),
  task("g", "demo.l2", 1), explained("g", "demo.l2"), task("c", "demo.l2", 1), ...(open ? [] : [explained("c", "demo.l2")])];
const verdict = (extra = {}) => ({
  ouder: "demo.l2", taken: [{ tid: "a", deelpatroon: "lusgrenzen", micro: "demo.l2.lussen", uitgesloten: null }, { tid: "b", deelpatroon: "lusgrenzen", micro: "demo.l2.lussen", uitgesloten: null }],
  nieuweMicro: [{ id: "demo.l2.lussen", titel: "Lusgrenzen", trefwoorden: ["lus", "for"], niveau: "L0" }],
  oordeel: "micro", doel: "demo.l2.lussen", reden: "a en b liepen vast op de grens van de lus.", twijfel: false, ...extra,
});
const agentCall = assistant([{ type: "tool_use", id: "x1", name: "Agent", input: { subagent_type: "demotie-analist", prompt: "..." } }]);

test("S3a: for a parent skill the analyst is asked first; nothing goes down yet", () => {
  const p = makeProject({ skills: autoSkills(), events: parentTasks(true), sessions: { [SID]: session() } });
  try {
    stop(p, [user(GOOD)], "Goed. [uitleg-ok c]");
    assert.equal(skillOf(p, "demo.l2").level, "L2");
    assert.equal(p.session(SID).demotionPending.skill, "demo.l2");
    const ctx = p.hook("prompt-gate.mjs", { session_id: SID, prompt: "oké", transcript_path: path.join(p.root, "x", `${SID}.jsonl`) }).json.hookSpecificOutput.additionalContext;
    assert.match(ctx, /demotie-analist/);
    assert.match(ctx, /"tid":"a"/);
  } finally { p.cleanup(); }
});

test("S3a: a valid verdict with a real agent call creates the microskill at parent minus 1 and retags the tasks", () => {
  const p = makeProject({ skills: autoSkills(), events: parentTasks(), sessions: { [SID]: session({ demotionPending: { skill: "demo.l2", tids: ["a", "b", "c"], reason: "0 van 3 gelukt (0%)" } }) } });
  try {
    const r = stop(p, [user("oké"), agentCall], `Klaar. [demotie ${JSON.stringify(verdict())}]`);
    const micro = skillOf(p, "demo.l2.lussen");
    assert.equal(micro.level, "L1", "parent L2 minus 1, not what the agent said");
    assert.equal(micro.parent, "demo.l2");
    assert.deepEqual(p.events().filter((e) => e.type === "task-retag").map((e) => [e.tid, e.to]), [["a", "demo.l2.lussen"], ["b", "demo.l2.lussen"]]);
    assert.equal(skillOf(p, "demo.l2").level, "L2", "the parent stays");
    assert.equal(p.session(SID).demotionPending, null);
    assert.match(r.json.systemMessage, /^\[leerharnas\] Extra steun voor een deelpatroon: demo\.l2\.lussen op L1 Aanvullen \(2 van 4 gelukt \(50%\)\)\. De hoofdvaardigheid demo\.l2 blijft L2\. Terugdraaien: /);
    assert.doesNotMatch(r.json.systemMessage, /analist|lusgrenzen/, "the analyst's reason stays in the log, not in the chat (#31)");
  } finally { p.cleanup(); }
});

test("S3a: no agent call, or a verdict about a solved task, changes nothing", () => {
  const p = makeProject({ skills: autoSkills(), events: parentTasks(), sessions: { [SID]: session({ demotionPending: { skill: "demo.l2", tids: ["a", "b", "c"], reason: "x" } }) } });
  try {
    let r = stop(p, [user("oké")], `[demotie ${JSON.stringify(verdict())}]`);
    assert.equal(r.json.decision, "block");
    assert.match(r.json.reason, /niet aangeroepen/);
    const bad = verdict({ taken: [{ tid: "c", deelpatroon: "x", micro: null, uitgesloten: null }] });
    r = stop(p, [user("oké", "u2"), agentCall], `[demotie ${JSON.stringify(bad)}]`);
    assert.equal(r.json.decision, "block");
    assert.match(r.json.reason, /task c is not a failed task/);
    assert.equal(skillOf(p, "demo.l2.lussen"), undefined);
    assert.ok(p.session(SID).demotionPending, "still pending");
  } finally { p.cleanup(); }
});

test("S3a: verdict 'ouder' lowers the parent one step", () => {
  const p = makeProject({ skills: autoSkills(), events: parentTasks(), sessions: { [SID]: session({ demotionPending: { skill: "demo.l2", tids: ["a", "b"], reason: "x" } }) } });
  try {
    stop(p, [user("oké"), agentCall], `[demotie ${JSON.stringify(verdict({ taken: [], nieuweMicro: [], oordeel: "ouder", doel: "demo.l2" }))}]`);
    assert.equal(skillOf(p, "demo.l2").level, "L1");
  } finally { p.cleanup(); }
});

test("S3a backstop: two microskills of one parent down within 14 days takes the parent down too", () => {
  const s = autoSkills();
  s.skills.splice(4, 0, { id: "demo.l2.tweede", parent: "demo.l2", title: "Tweede", level: "L2", keywords: [], placement: "done" });
  const p = makeProject({ skills: s, events: [
    { at: ago(3 * 24 * 60), type: "level", skill: "demo.l2.tweede", from: "L2", to: "L1", auto: true },
    task("a", "demo.l2.micro", 4), explained("a", "demo.l2.micro"), task("b", "demo.l2.micro", 4), explained("b", "demo.l2.micro"),
    task("h", "demo.l2.micro", 4), explained("h", "demo.l2.micro"), task("c", "demo.l2.micro", 4),
  ], sessions: { [SID]: session() } });
  try {
    const r = stop(p, [user(GOOD)], "[uitleg-ok c]");
    assert.equal(skillOf(p, "demo.l2.micro").level, "L1");
    assert.equal(skillOf(p, "demo.l2").level, "L1");
    assert.match(r.json.systemMessage, /achtervang/);
  } finally { p.cleanup(); }
});

// ---------- S4: placement of a new skill ----------
function newSkill(level = "L0") {
  const s = fakeSkills();
  s.skills.push({ id: "demo.nieuw", title: "Nieuw", level, paths: ["opdrachten/05-*/**"] });
  return s;
}

test("S4: a new skill counts as L2 until its first task (the learner tries first)", () => {
  const p = makeProject({ skills: newSkill("L0") });
  try {
    const w = p.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: p.abs("opdrachten/05-x/X.cs"), content: "" } });
    assert.equal(decision(w), "deny");
    assert.match(p.cli("skill.mjs", ["list"]).stdout, /demo\.nieuw.*plaatsing open/);
  } finally { p.cleanup(); }
});

test("S4: the highest rung of the first task sets the level: 0 -> L3, 3 -> L1, at the approved explanation (12 Nov, #44)", () => {
  for (const [rung, level, text] of [[0, "L3", /↑ demo\.nieuw staat nu op L3 Zelfstandig: taak \[\w+\] lukte zonder hint/], [3, "L1", /demo\.nieuw begint op L1 Aanvullen: taak \[\w+\] kostte trede 3/]]) {
    const p = makeProject({ skills: newSkill("L0"), files: { "opdrachten/05-x/X.cs": "" }, sessions: { [SID]: session({ activeSkill: "demo.nieuw", maxRung: rung }) } });
    try {
      check(p, "opdrachten/05-x", { Een: "Failed" }, 1);
      const st = p.session(SID); st.maxRung = rung; fs.writeFileSync(path.join(p.state, `session-${SID}.json`), JSON.stringify(st));
      const r = check(p, "opdrachten/05-x", { Een: "Passed" }, 2);
      assert.match(r.stdout, new RegExp(`na je goedgekeurde uitleg bepaalt deze taak je startniveau \\(${level}\\)`));
      assert.equal(skillOf(p, "demo.nieuw").placement, undefined, "not placed at the green");
      const tid = p.events().find((e) => e.type === "task").tid;
      const s = stop(p, [user(GOOD)], `Klopt. [uitleg-ok ${tid}]`);
      assert.match(s.json?.systemMessage ?? "", text);
      assert.equal(skillOf(p, "demo.nieuw").level, level);
      assert.equal(skillOf(p, "demo.nieuw").placement, "done");
      assert.ok(p.events().some((e) => e.type === "placement" && e.rung === rung && e.to === level && e.tid === tid));
    } finally { p.cleanup(); }
  }
});

test("S4: with an open placement no rung unlocks on time; being stuck or the same error twice does", () => {
  const base = { activeSkill: "demo.nieuw", folderSkill: "demo.nieuw", folderSkillAt: Date.now() + MIN, rung: 1, maxRung: 1, lastRungAt: Date.now() - 40 * MIN, lastRungActive: 0, activeMs: 39 * MIN };
  const p = makeProject({ skills: newSkill("L2"), sessions: { [SID]: session(base) } });
  const prompt = (text) => p.hook("prompt-gate.mjs", { session_id: SID, prompt: text });
  try {
    prompt("hint?");
    assert.equal(p.session(SID).rung, 1, "39 active minutes, but time does not count for a new skill");
    prompt("ik zit vast, hint?");
    assert.equal(p.session(SID).rung, 2);
    prompt("ik krijg error CS0246 bij Student, hint?");
    assert.equal(p.session(SID).rung, 2, "a first error is an attempt, not yet a reason");
    prompt("nog steeds error CS0246, hint?");
    assert.equal(p.session(SID).rung, 3, "the same error twice");
  } finally { p.cleanup(); }
});

test("S4: an explicit request for more explanation after an attempt may go up to rung 4, logged by Claude's marker", () => {
  const p = makeProject({ skills: newSkill("L2"), sessions: { [SID]: session({ activeSkill: "demo.nieuw", folderSkill: "demo.nieuw", folderSkillAt: Date.now() + MIN, rung: 1, maxRung: 1, attempted: true }) } });
  try {
    const r = p.hook("prompt-gate.mjs", { session_id: SID, prompt: "kun je het uitleggen?" });
    assert.match(r.json.hookSpecificOutput.additionalContext, /hooguit 4/);
    assert.equal(p.session(SID).rung, 4);
    assert.equal(p.session(SID).maxRung, 1, "the ceiling is not the help that was given");
  } finally { p.cleanup(); }
});
