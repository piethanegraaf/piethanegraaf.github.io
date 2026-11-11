// The decisions of the setup review of 11 November 2026 (13-19):
// S1 the explanation is judged over all the learner's messages since the task was logged;
// S3 help in a review after a task ([review-trede N #id]) only counts for a next task about the same
//    concept, and a task begins at a deterministic signal of new work;
// S4 a first run that is all green counts when the code was written in this session;
// S5 `skill.mjs paths`, and folder 09 of the ood map is an association.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject, fakeSkills, decision, HARNESS } from "./helpers.mjs";
import { REVIEW_RUNG_MARK } from "../hooks/patterns.mjs";
import { globToRegex } from "../hooks/lib.mjs";

const SID = "s-11-11";
const MIN = 60000;
const user = (text, uuid) => ({ type: "user", uuid, message: { role: "user", content: text } });
const assistant = (text) => ({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text }] } });

function trx(dir, results) {
  fs.mkdirSync(dir, { recursive: true });
  const defs = Object.keys(results).map((n, i) =>
    `<UnitTest name="${n}" id="id${i}"><TestMethod codeBase="x.dll" className="Demo.Tests" name="${n}" /></UnitTest>`).join("");
  const res = Object.entries(results).map(([n, outcome], i) => `<UnitTestResult testId="id${i}" testName="${n}" outcome="${outcome}" />`).join("");
  fs.writeFileSync(path.join(dir, "run.trx"), `<?xml version="1.0"?><TestRun><TestDefinitions>${defs}</TestDefinitions><Results>${res}</Results></TestRun>`);
  return dir;
}

// A project with two exercise folders (02 for demo.l2, 03 for demo.l3) and a last task in 02.
function project({ session = {}, events = [], files = {}, transcript = [] } = {}) {
  const now = Date.now();
  const p = makeProject({
    events,
    files: { "opdrachten/02-lijst/Lijst.cs": "class Lijst {}", "opdrachten/03-boeken/Boek.cs": "class Boek {}", ...files },
    sessions: { [SID]: { startedAt: now - 30 * MIN, lastActiveAt: now - MIN, activeMs: 20 * MIN, activeSkill: "demo.l2", folderSkill: "demo.l2", rung: 0, maxRung: 0, ...session } },
  });
  // The folders' code is older than the last task: only a later change is new work.
  for (const f of ["opdrachten/02-lijst/Lijst.cs", "opdrachten/03-boeken/Boek.cs"]) fs.utimesSync(p.abs(f), new Date(now - 20 * MIN), new Date(now - 20 * MIN));
  const file = path.join(p.root, "transcript.jsonl");
  const writeTranscript = (entries) => fs.writeFileSync(file, entries.map((e) => JSON.stringify(e)).join("\n") + "\n");
  writeTranscript(transcript);
  return {
    p,
    prompt: (text) => p.hook("prompt-gate.mjs", { session_id: SID, prompt: text, cwd: p.root }),
    stop: (last, entries) => { if (entries) writeTranscript(entries); return p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: last }); },
    check: (dir, results, n) => p.cli("check.mjs", [dir], { LEERHARNAS_TRX_DIR: trx(p.abs(`trx-${n}`), results) }),
    of: (type) => p.events().filter((e) => e.type === type),
  };
}
const lastTask = (extra = {}) => ({ lastTask: { tid: "t1", skill: "demo.l2", dir: "opdrachten/02-lijst", at: Date.now() - 10 * MIN, ...extra } });
// A baseline for folder 02 in tests.json: the next green there is new green.
const red02 = (h) => h.check("opdrachten/02-lijst", { Een: "Failed" }, "red");

// ---------- S3: the review marker ----------
test("the review marker needs a concept id; without one it is still recognized", () => {
  const found = [..."[review-trede 2 #ood.encapsulatie] en [review-rung 4] en [trede 1]".matchAll(REVIEW_RUNG_MARK)].map((m) => [m[1], m[2] ?? null]);
  assert.deepEqual(found, [["2", "ood.encapsulatie"], ["4", null]]);
});

test("review help after a task does not raise the rung; a task in another family gets rung 0", () => {
  const h = project({ session: lastTask() });
  try {
    red02(h);
    h.stop("Kijk eens naar de lijst. [review-trede 2 #demo.l3]", [user("waarom mag dat niet?", "u1")]);
    assert.deepEqual(h.of("review-help").map((e) => [e.skill, e.rung, e.reviewOf]), [["demo.l3", 2, "t1"]]);
    assert.equal(h.of("rung-mark").length, 0);
    assert.equal(h.p.session(SID).maxRung, 0);
    h.check("opdrachten/02-lijst", { Een: "Passed" }, "green");
    const task = h.of("task").pop();
    assert.deepEqual([task.skill, task.maxRung, task.reviewRung], ["demo.l2", 0, undefined]);
    assert.deepEqual(h.p.session(SID).reviewHelp, [], "review help is used up by the next task");
  } finally { h.p.cleanup(); }
});

test("review help counts for the next task about the same concept (a microskill of its family)", () => {
  const h = project({ session: lastTask() });
  try {
    red02(h);
    h.stop("Het concept is ... [review-trede 3 #demo.l2.micro]", [user("snap ik niet", "u1")]);
    h.stop("Het concept is ... [review-trede 3 #demo.l2.micro]"); // the hook can run twice for one answer
    assert.equal(h.of("review-help").length, 1);
    h.check("opdrachten/02-lijst", { Een: "Passed" }, "green");
    const task = h.of("task").pop();
    assert.deepEqual([task.skill, task.maxRung, task.reviewRung], ["demo.l2", 3, 3]);
  } finally { h.p.cleanup(); }
});

test("a review marker without an id, with an unknown id, or without a last task is an ordinary rung", () => {
  for (const [marker, session] of [["[review-trede 2]", lastTask()], ["[review-trede 2 #bestaat.niet]", lastTask()], ["[review-trede 2 #demo.l2]", {}]]) {
    const h = project({ session });
    try {
      h.stop(`Hier is het concept. ${marker}`, [user("hoe zit dat?", "u1")]);
      assert.equal(h.of("review-help").length, 0, marker);
      assert.deepEqual(h.of("rung-mark").map((e) => [e.rung, e.review]), [[2, true]], marker);
      assert.equal(h.p.session(SID).maxRung, 2, marker);
    } finally { h.p.cleanup(); }
  }
});

// ---------- S3: the start of a task ----------
test("the full name of another exercise folder in a prompt starts a new task; a review marker after it is ordinary", () => {
  const h = project({ session: lastTask({}), events: [] });
  try {
    const r = h.prompt("ik ga verder met 03-boeken");
    assert.deepEqual(h.of("task-start").map((e) => [e.reason, e.after]), [["prompt-exercise", "t1"]]);
    assert.match(r.json?.hookSpecificOutput?.additionalContext ?? "", /Nieuw werk herkend/);
    assert.equal(h.p.session(SID).lastTask, null);
    h.stop("Een tip. [review-trede 2 #demo.l2]", [user("ik ga verder met 03-boeken", "u1")]);
    assert.equal(h.of("review-help").length, 0);
    assert.equal(h.p.session(SID).maxRung, 2);
  } finally { h.p.cleanup(); }
});

test("a keyword or a bare exercise name in a prompt is no signal of new work", () => {
  const h = project({ session: lastTask(), files: { ".learning/keywords.json": JSON.stringify({ "demo.l3": ["zelfstandig"] }) } });
  try {
    h.prompt("is dit zelfstandig genoeg, net als bij boeken?");
    assert.equal(h.of("task-start").length, 0);
    assert.equal(h.p.session(SID).lastTask?.tid, "t1");
  } finally { h.p.cleanup(); }
});

test("code changed in another exercise folder starts a new task, and earlier help is dropped (logged)", () => {
  const h = project({ session: { ...lastTask(), maxRung: 2, rung: 2 } });
  try {
    fs.writeFileSync(h.p.abs("opdrachten/03-boeken/Boek.cs"), "class Boek { }"); // changed now
    h.prompt("hoe begin ik hier?");
    assert.deepEqual(h.of("task-start").map((e) => e.reason), ["code-elsewhere"]);
    assert.deepEqual(h.of("help-dropped").map((e) => [e.skill, e.rung]), [["demo.l2", 2]]);
    assert.equal(h.p.session(SID).maxRung, 0);
  } finally { h.p.cleanup(); }
});

test("code changed in the folder of the last task is no signal", () => {
  const h = project({ session: lastTask() });
  try {
    fs.writeFileSync(h.p.abs("opdrachten/02-lijst/Lijst.cs"), "class Lijst { }");
    h.prompt("ik heb de lijst nu private gemaakt");
    assert.equal(h.of("task-start").length, 0);
  } finally { h.p.cleanup(); }
});

test("check.mjs in another folder starts a new task: help before it does not count for that task", () => {
  const h = project({ session: { ...lastTask(), maxRung: 3, rung: 3 } });
  try {
    h.check("opdrachten/03-boeken", { Een: "Failed" }, "a");
    assert.deepEqual(h.of("task-start").map((e) => e.reason), ["check-elsewhere"]);
    assert.deepEqual(h.of("help-dropped").map((e) => e.rung), [3]);
    h.check("opdrachten/03-boeken", { Een: "Passed" }, "b");
    assert.equal(h.of("task").pop().maxRung, 0);
  } finally { h.p.cleanup(); }
});

test("done keeps the help since the last task: it reports the finished work", () => {
  const h = project({ session: { ...lastTask(), maxRung: 3, rung: 3 } });
  try {
    const r = h.p.cli("skill.mjs", ["done", "demo.l3", "ontwerp"]);
    assert.equal(r.code, 0, r.stderr);
    assert.equal(h.of("help-dropped").length, 0);
    assert.equal(h.of("task").pop().maxRung, 3);
    assert.equal(h.p.session(SID).lastTask.skill, "demo.l3");
  } finally { h.p.cleanup(); }
});

// ---------- S1: the explanation over all messages since the task ----------
test("three short messages that together pass count as one explanation", () => {
  const h = project({ events: [{ at: new Date().toISOString(), type: "task", tid: "t1", skill: "demo.l2", success: true, maxRung: 0, source: "check" }] });
  try {
    const msgs = ["de lus liep een keer te ver door", "omdat ik kleiner of gelijk gebruikte", "nu stopt hij bij de lengte"];
    for (const m of msgs) h.prompt(m);
    h.stop("Precies. [uitleg-ok t1]", msgs.map((m, i) => user(m, `u${i}`)));
    const ex = h.of("task-explained");
    assert.equal(ex.length, 1, JSON.stringify(h.of("explain-rejected")));
    assert.match(ex[0].text, /liep een keer[\s\S]*kleiner of gelijk[\s\S]*bij de lengte/);
  } finally { h.p.cleanup(); }
});

test("copied text in the combined messages is rejected", () => {
  const claude = "de waarde wordt pas bij het aanroepen van de methode berekend uit de huidige lengte en breedte van het object";
  const parts = ["de waarde wordt pas bij het aanroepen van de methode berekend", "omdat het uit de huidige lengte en breedte van het object komt"];
  const h = project({
    events: [{ at: new Date(Date.now() - 2 * MIN).toISOString(), type: "task", tid: "t1", skill: "demo.l2", success: true, maxRung: 0, source: "check" }],
    session: { explainWords: { t1: [parts[0]] } },
  });
  try {
    h.stop("[uitleg-ok t1]", [assistant(claude), user(parts[0], "u1"), assistant("En waarom?"), user(parts[1], "u2")]);
    assert.equal(h.of("task-explained").length, 0);
    const rej = h.of("explain-rejected");
    assert.equal(rej.length, 1);
    assert.match(rej[0].reasons.join(" "), /overgenomen|copied/);
  } finally { h.p.cleanup(); }
});

test("a message from before the task was logged does not count", () => {
  const early = "de lus stopt nu op tijd omdat ik de voorwaarde heb aangepast naar kleiner dan de lengte van de lijst";
  const h = project();
  try {
    h.prompt(early); // no open task yet: not kept
    fs.appendFileSync(path.join(h.p.state, "events.jsonl"), JSON.stringify({ at: new Date().toISOString(), type: "task", tid: "t1", skill: "demo.l2", success: true, maxRung: 0, source: "check" }) + "\n");
    h.prompt("klopt");
    assert.deepEqual(h.p.session(SID).explainWords, { t1: ["klopt"] });
    h.stop("[uitleg-ok t1]", [user(early, "u0"), user("klopt", "u1")]);
    assert.equal(h.of("task-explained").length, 0);
    assert.equal(h.of("explain-rejected").length, 1);
  } finally { h.p.cleanup(); }
});

// ---------- S4: the first run is all green ----------
test("code changed in this session and green at the first run is a task", () => {
  const h = project({ session: { startedAt: Date.now() - 5 * MIN } });
  try {
    fs.writeFileSync(h.p.abs("opdrachten/03-boeken/Boek.cs"), "class Boek { public string Titel { get; } }");
    const r = h.check("opdrachten/03-boeken", { Een: "Passed", Twee: "Passed" }, "a");
    assert.match(r.stdout, /Eerste run in deze map/);
    const tasks = h.of("task");
    assert.deepEqual(tasks.map((x) => [x.skill, x.source, x.what]), [["demo.l3", "check", "Een, Twee"]]);
    assert.equal(h.of("test-green")[0].firstRun, true);
  } finally { h.p.cleanup(); }
});

test("code from an earlier session that is green at the first run stays a baseline", () => {
  const h = project({ session: { startedAt: Date.now() - 5 * MIN } }); // the code is 20 minutes old
  try {
    const r = h.check("opdrachten/03-boeken", { Een: "Passed" }, "a");
    assert.match(r.stdout, /basislijn/);
    assert.equal(h.of("task").length, 0);
  } finally { h.p.cleanup(); }
});

test("a first run that is not all green stays a baseline", () => {
  const h = project({ session: { startedAt: Date.now() - 5 * MIN } });
  try {
    fs.writeFileSync(h.p.abs("opdrachten/03-boeken/Boek.cs"), "class Boek { }");
    h.check("opdrachten/03-boeken", { Een: "Passed", Twee: "Failed" }, "a");
    assert.equal(h.of("task").length, 0);
  } finally { h.p.cleanup(); }
});

// ---------- S5: paths ----------
test("paths: add, remove, an unknown id, a duplicate glob, and a microskill", () => {
  const h = project();
  const paths = (...a) => h.p.cli("skill.mjs", ["paths", ...a]);
  const of = (id) => h.p.skills().skills.find((s) => s.id === id).paths;
  try {
    let r = paths("demo.l3", "add", "opdrachten/09-*/**");
    assert.equal(r.code, 0, r.stderr);
    assert.deepEqual(of("demo.l3"), ["opdrachten/03-*/**", "opdrachten/09-*/**"]);
    r = paths("demo.l3", "add", "opdrachten/09-*/**");
    assert.equal(r.code, 1);
    assert.match(r.stderr, /al/);
    r = paths("demo.l3", "remove", "opdrachten/09-*/**");
    assert.equal(r.code, 0, r.stderr);
    assert.deepEqual(of("demo.l3"), ["opdrachten/03-*/**"]);
    r = paths("demo.l3", "remove", "opdrachten/09-*/**");
    assert.equal(r.code, 1);
    assert.equal(paths("bestaat.niet", "add", "x/**").code, 1);
    assert.equal(paths("demo.l2.micro", "add", "x/**").code, 1);
    assert.equal(paths("demo.l3", "add", "../buiten/**").code, 1);
    assert.deepEqual(h.of("paths").map((e) => [e.skill, e.action, e.glob]), [["demo.l3", "add", "opdrachten/09-*/**"], ["demo.l3", "remove", "opdrachten/09-*/**"]]);
  } finally { h.p.cleanup(); }
});

test("paths warns when another skill has the same path", () => {
  const h = project();
  try {
    const r = h.p.cli("skill.mjs", ["paths", "demo.l3", "add", "opdrachten/02-*/**"]);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /demo\.l2 heeft hetzelfde pad/);
  } finally { h.p.cleanup(); }
});

test("the guard does not let Claude change paths", () => {
  const p = makeProject({ skills: fakeSkills() });
  try {
    const r = p.hook("guard.mjs", { tool_name: "Bash", tool_input: { command: "node .claude/hooks/skill.mjs paths demo.l2 add \"x/**\"" }, cwd: p.root });
    assert.equal(decision(r), "deny");
  } finally { p.cleanup(); }
});

test("folder 09 of the ood map is an association, not inheritance", () => {
  const map = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", "ood", "skills.json"), "utf8"));
  const owners = map.skills.filter((s) => (s.paths ?? []).some((g) => globToRegex(g).test("ood-opdrachten-01/09-studenten-docenten/Docent.cs"))).map((s) => s.id);
  assert.deepEqual(owners, ["ood.associaties"]);
});
