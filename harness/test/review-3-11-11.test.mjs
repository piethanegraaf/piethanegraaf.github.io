// The decisions of the third setup review of 11 November 2026 (afternoon, 22-30):
// #23 the status line shows the help given (also at L3), and at L2 also the unlocked rung;
// #27 honest words: "independent" only at rung 0, "solved with help up to rung N" at rung 1-2;
// #26 [trede N #id]: the task keeps its rung, and help about a concept of another family is logged as concept-help;
// #22 the harness shows a proposal for a microskill, and only the learner's "ja, toevoegen" adds it;
// #28 with help, the explanation is about the point where the help was needed;
// #30 install.mjs --update stops while a practice session runs, unless --force.
// #24 was not chosen and is not built.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { makeProject, HARNESS, run } from "./helpers.mjs";
import { RUNG_MARK, MICRO_MARK, parseMicroMark, microAnswer } from "../hooks/patterns.mjs";

const SID = "s-review-3";
const MIN = 60000;
const user = (text, uuid) => ({ type: "user", uuid, message: { role: "user", content: text } });

function trx(dir, results) {
  fs.mkdirSync(dir, { recursive: true });
  const defs = Object.keys(results).map((n, i) =>
    `<UnitTest name="${n}" id="id${i}"><TestMethod codeBase="x.dll" className="Demo.Tests" name="${n}" /></UnitTest>`).join("");
  const res = Object.entries(results).map(([n, outcome], i) => `<UnitTestResult testId="id${i}" testName="${n}" outcome="${outcome}" />`).join("");
  fs.writeFileSync(path.join(dir, "run.trx"), `<?xml version="1.0"?><TestRun><TestDefinitions>${defs}</TestDefinitions><Results>${res}</Results></TestRun>`);
  return dir;
}

// Two exercise folders (02 for demo.l2, 03 for demo.l3); the session works in 02 unless said otherwise.
function project({ session = {}, events = [] } = {}) {
  const now = Date.now();
  const p = makeProject({
    events,
    files: { "opdrachten/02-lijst/Lijst.cs": "class Lijst {}", "opdrachten/03-boeken/Boek.cs": "class Boek {}" },
    sessions: { [SID]: { startedAt: now - 30 * MIN, lastActiveAt: now - MIN, activeMs: 20 * MIN, activeSkill: "demo.l2", folderSkill: "demo.l2",
      folderSkillAt: now - 5 * MIN, rung: 0, maxRung: 0, ...session } },
  });
  for (const f of ["opdrachten/02-lijst/Lijst.cs", "opdrachten/03-boeken/Boek.cs"]) fs.utimesSync(p.abs(f), new Date(now - 20 * MIN), new Date(now - 20 * MIN));
  const file = path.join(p.root, "transcript.jsonl");
  const writeTranscript = (entries) => fs.writeFileSync(file, entries.map((e) => JSON.stringify(e)).join("\n") + "\n");
  writeTranscript([]);
  let n = 0;
  return {
    p,
    prompt: (text) => p.hook("prompt-gate.mjs", { session_id: SID, prompt: text, cwd: p.root }),
    ctx: (r) => r.json?.hookSpecificOutput?.additionalContext ?? "",
    // One Stop for one answer to a new learner message (a new uuid each time, unless given).
    stop: (last, learnerText = "hoe zit dat?", uuid = `u${++n}`) => {
      writeTranscript([user(learnerText, uuid)]);
      return p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: last });
    },
    check: (dir, results, tag) => p.cli("check.mjs", [dir], { LEERHARNAS_TRX_DIR: trx(p.abs(`trx-${tag}`), results) }),
    of: (type) => p.events().filter((e) => e.type === type),
  };
}

// ---------- #23: the status line ----------
test("#23 at L3 the status line shows the help given, not 'no hint yet'", () => {
  const h = project({ session: { activeSkill: "demo.l3", folderSkill: "demo.l3" } });
  try {
    h.stop("Een klasse is de blauwdruk, een object ... [trede 2]");
    assert.deepEqual(h.of("rung-mark").map((e) => [e.skill, e.rung]), [["demo.l3", 2]]);
    const head = h.ctx(h.prompt("ok, en nu dit stuk")).split("\n")[0];
    assert.match(head, /^\[leerharnas\] Vaardigheid: demo\.l3 \(L3 Zelfstandig\) · gegeven hulp: trede 2 · /);
    assert.doesNotMatch(head, /ontgrendeld|nog geen hint/);
  } finally { h.p.cleanup(); }
});

test("#23 at L2 the status line shows the unlocked rung and the help given; none yet before any help", () => {
  const h = project({ session: { rung: 1, maxRung: 1 } });
  try {
    const head = h.ctx(h.prompt("ok, en nu dit stuk")).split("\n")[0];
    assert.match(head, /· ontgrendeld: trede 1 \(Socratische vraag\) · gegeven hulp: trede 1 · /);
  } finally { h.p.cleanup(); }
  const h2 = project({ session: { activeSkill: "demo.l3", folderSkill: "demo.l3" } });
  try {
    assert.match(h2.ctx(h2.prompt("ok, en nu dit stuk")), /· gegeven hulp: nog geen · /);
  } finally { h2.p.cleanup(); }
});

// ---------- #27: honest words ----------
test("#27 check.mjs calls rung 2 'solved with help up to rung 2' and only rung 0 independent", () => {
  const h = project({ session: { maxRung: 2, rung: 2 } });
  try {
    h.check("opdrachten/02-lijst", { Een: "Failed" }, "red");
    const out = h.check("opdrachten/02-lijst", { Een: "Passed" }, "green").stdout;
    // Praise first, with the skill and where the learning was (12 Nov, #37, #39).
    assert.match(out, /★ Gelukt met hulp tot trede 2: Begeleid \(demo\.l2\)\. Hier zat het leren: demo\.l2\./);
    assert.doesNotMatch(out, /[Zz]elfstandig/);
    // #28: with help, the explanation is about the point where the help was needed.
    assert.match(out, /op het punt van de hulp zo moest, dan telt hij mee/);
  } finally { h.p.cleanup(); }
  const h0 = project();
  try {
    h0.check("opdrachten/02-lijst", { Een: "Failed" }, "red");
    const out = h0.check("opdrachten/02-lijst", { Een: "Passed" }, "green").stdout;
    assert.match(out, /★ Zelfstandig gelukt, zonder hint: Begeleid \(demo\.l2\)\./);
    assert.match(out, /uit waarom het werkt, dan telt hij mee/);
  } finally { h0.p.cleanup(); }
});

test("#27 a task solved in the chat at rung 1 is 'solved with help', and the signal to Claude says so", () => {
  const h = project({ session: { maxRung: 1, rung: 1 } });
  try {
    const ctx = h.ctx(h.prompt("alle tests slagen nu"));
    assert.match(ctx, /telt als gelukt, met hulp tot trede 1, zodra de uitleg goedgekeurd is/);
    assert.match(ctx, /met hulp tot trede 1: noem die hulp eerlijk, en noem het geen zelfstandig succes/);
    assert.doesNotMatch(ctx, /telt als zelfstandig gelukt/);
  } finally { h.p.cleanup(); }
});

// ---------- #26: help per concept ----------
test("#26 the rung marker takes an optional concept id", () => {
  const found = [..."[trede 2 #ood.klassen-properties] [rung 3] [review-trede 2 #x.y] [trede 6]".matchAll(RUNG_MARK)].map((m) => [m[1], m[2] ?? null]);
  assert.deepEqual(found, [["2", "ood.klassen-properties"], ["3", null]]);
});

test("#26 help about a concept of another family: the task keeps the rung, the concept gets concept-help", () => {
  const h = project();
  try {
    h.stop("Patient is de klasse, patient het object. [trede 2 #demo.l3]", "waarom CS0120?");
    assert.deepEqual(h.of("rung-mark").map((e) => [e.skill, e.rung]), [["demo.l2", 2]], "the task keeps the rung");
    const [e] = h.of("concept-help");
    assert.deepEqual([e.skill, e.rung, e.taskSkill], ["demo.l3", 2, "demo.l2"]);
    assert.ok(e.taskTid);
    h.check("opdrachten/02-lijst", { Een: "Failed" }, "red");
    h.check("opdrachten/02-lijst", { Een: "Passed" }, "green");
    const task = h.of("task").pop();
    assert.deepEqual([task.skill, task.maxRung, task.tid], ["demo.l2", 2, e.taskTid], "the concept help points to this task");
    const st = h.p.session(SID);
    assert.deepEqual([st.conceptHelp, st.openTid], [[], null], "the next task starts without it");
    assert.equal(h.of("task").filter((x) => x.skill === "demo.l3").length, 0, "no task for the concept");
  } finally { h.p.cleanup(); }
});

test("#26 the same family or an unknown id is an ordinary rung; a repeat is logged once, a higher rung again", () => {
  const h = project();
  try {
    h.stop("Kijk naar het deelpatroon. [trede 1 #demo.l2.micro]");
    h.stop("Een tip. [trede 1 #bestaat.niet]");
    assert.equal(h.of("concept-help").length, 0);
    assert.deepEqual(h.of("rung-mark").map((e) => e.rung), [1]);
    h.stop("Concept. [trede 2 #demo.l3]", "snap het niet", "u-a");
    h.stop("Concept. [trede 2 #demo.l3]", "snap het niet", "u-a"); // the hook can run twice for one answer
    h.stop("Voorbeeld. [trede 4 #demo.l3]");
    const ch = h.of("concept-help");
    assert.deepEqual(ch.map((e) => e.rung), [2, 4]);
    assert.equal(ch[0].taskTid, ch[1].taskTid, "one task, one reserved id");
  } finally { h.p.cleanup(); }
});

test("#26 when new work begins, the dropped help names the reserved task id", () => {
  const h = project({ session: { lastTask: { tid: "t1", skill: "demo.l2", dir: "opdrachten/02-lijst", at: Date.now() - 10 * MIN } } });
  try {
    h.stop("Concept. [trede 2 #demo.l3]");
    const tid = h.of("concept-help")[0].taskTid;
    h.check("opdrachten/03-boeken", { Een: "Failed" }, "a");
    assert.deepEqual(h.of("help-dropped").map((e) => [e.rung, e.taskTid]), [[2, tid]]);
  } finally { h.p.cleanup(); }
});

test("#26 status shows concept help per skill, without counting it as a task", () => {
  const at = new Date().toISOString();
  const h = project({ events: [
    { type: "concept-help", skill: "demo.l3", rung: 1, taskSkill: "demo.l2", taskTid: "x1", session: SID, at },
    { type: "concept-help", skill: "demo.l3", rung: 2, taskSkill: "demo.l2", taskTid: "x1", session: SID, at },
  ] });
  try {
    const out = h.p.cli("skill.mjs", ["status"]).stdout;
    assert.match(out, /Hulp over een vaardigheid tijdens een taak van een andere \(telt niet als taak, alleen ter info\): demo\.l3 1x \(hoogste trede 2\)/);
  } finally { h.p.cleanup(); }
});

// ---------- #22: the proposal for a microskill ----------
test("#22 the marker and the answer are parsed in both languages", () => {
  const [m] = [...'[micro-voorstel demo.l3.lussen "Lussen" "lus, For"]'.matchAll(MICRO_MARK)];
  assert.deepEqual(parseMicroMark(m[1]), { id: "demo.l3.lussen", title: "Lussen", keywords: ["lus", "for"] });
  assert.equal(parseMicroMark(" demo.l3.lussen"), null);
  assert.equal([...'[micro-proposal demo.l3.x "Loops" "loop"]'.matchAll(MICRO_MARK)].length, 1);
  assert.deepEqual(microAnswer("ja, toevoegen demo.l3.lussen"), { answer: "yes", id: "demo.l3.lussen" });
  assert.deepEqual(microAnswer("Yes, add"), { answer: "yes", id: null });
  assert.deepEqual(microAnswer("nee"), { answer: "no", id: null });
  assert.equal(microAnswer("ja, doorzetten"), null);
});

test("#22 without evidence in this session the harness refuses the proposal and says why", () => {
  const h = project({ events: [{ type: "task", tid: "t0", skill: "demo.l3", success: true, maxRung: 3, session: "andere-sessie", at: new Date().toISOString() }] });
  try {
    const r = h.stop('Dit deel is lastig. [micro-voorstel demo.l3.lussen "Lussen" "lus, for"]');
    assert.equal(r.json?.decision, "block");
    assert.match(r.json.reason, /geen bewijs voor demo\.l3/);
    assert.equal(h.of("micro-offered").length, 0);
    assert.equal(h.of("micro-rejected").length, 1);
    assert.deepEqual(h.p.session(SID).microOffers, []);
  } finally { h.p.cleanup(); }
});

test("#22 after concept help at rung 2 the harness shows the proposal, and 'ja, toevoegen' adds it", () => {
  const h = project();
  try {
    const r = h.stop('Een lus herhaalt ... [trede 2 #demo.l3] [micro-voorstel demo.l3.lussen "Lussen" "lus, for"]');
    assert.notEqual(r.json?.decision, "block", r.json?.reason);
    const msg = r.json?.systemMessage ?? "";
    assert.match(msg, /Microvaardigheid toevoegen\? demo\.l3\.lussen \(Lussen\) onder demo\.l3, op L2 Begeleid/);
    assert.match(msg, /waarom: hulp op trede 2 over demo\.l3 tijdens een taak van demo\.l2/);
    assert.match(msg, /ja: typ "ja, toevoegen" · nee: typ "nee"/);
    assert.equal(h.p.skills().skills.some((s) => s.id === "demo.l3.lussen"), false, "nothing changes before the learner's yes");
    // Claude sees the proposal with the next prompt, and so does the learner's answer.
    const ctx = h.ctx(h.prompt("ja, toevoegen"));
    assert.match(ctx, /Microvaardigheid demo\.l3\.lussen toegevoegd onder demo\.l3, op L2/);
    const micro = h.p.skills().skills.find((s) => s.id === "demo.l3.lussen");
    assert.deepEqual([micro.parent, micro.level, micro.title, micro.keywords], ["demo.l3", "L2", "Lussen", ["lus", "for"]]);
    assert.ok(micro.history[0].atIso);
    assert.deepEqual(h.of("micro-add").map((e) => [e.skill, e.by, e.via]), [["demo.l3.lussen", "learner", "voorstel"]]);
    assert.deepEqual(h.p.session(SID).microOffers, []);
  } finally { h.p.cleanup(); }
});

test("#22 'nee' right after the proposal declines it, and it is not shown again in this session", () => {
  const h = project();
  try {
    h.stop('Concept. [trede 2 #demo.l3] [micro-voorstel demo.l3.lussen "Lussen" "lus"]');
    const ctx = h.ctx(h.prompt("nee"));
    assert.match(ctx, /voegt demo\.l3\.lussen nu niet toe/);
    assert.deepEqual(h.of("micro-declined").map((e) => e.skill), ["demo.l3.lussen"]);
    h.stop('Toch nog eens. [micro-voorstel demo.l3.lussen "Lussen" "lus"]');
    assert.equal(h.of("micro-offered").length, 1);
    assert.equal(h.p.skills().skills.some((s) => s.id === "demo.l3.lussen"), false);
  } finally { h.p.cleanup(); }
});

test("#22 a task of this session that took rung 2 or higher is evidence too (the learner's choice)", () => {
  const h = project({ events: [{ type: "task", tid: "t9", skill: "demo.l2", success: true, maxRung: 2, session: SID, at: new Date().toISOString() }] });
  try {
    const r = h.stop('De grens ging mis. [micro-voorstel demo.l2.grenzen "Grenzen van een lijst" "grens, index"]');
    assert.match(r.json?.systemMessage ?? "", /waarom: taak t9 van demo\.l2 kostte trede 2/);
    assert.match(r.json?.systemMessage ?? "", /op L1 Aanvullen/, "the parent's level minus 1");
  } finally { h.p.cleanup(); }
});

test("#22 the marker is checked: format, existing id, nested id, no main skill, keywords", () => {
  const h = project({ events: [{ type: "review-help", skill: "demo.l2", rung: 2, reviewOf: "t1", session: SID, at: new Date().toISOString() }] });
  try {
    const reason = (marker) => h.stop(`Voorstel. ${marker}`).json?.reason ?? "";
    assert.match(reason("[micro-voorstel demo.l2.x]"), /het formaat is/);
    assert.match(reason('[micro-voorstel demo.l2.micro "Bestaat" "x"]'), /demo\.l2\.micro bestaat al/);
    assert.match(reason('[micro-voorstel demo.l2.micro.diep "Diep" "x"]'), /hangt onder de microvaardigheid demo\.l2\.micro/);
    assert.match(reason('[micro-voorstel zzz.iets "Iets" "x"]'), /begint niet met het id van een hoofdvaardigheid/);
    assert.match(reason('[micro-voorstel demo.l2.veel "Veel" "a, b, c, d, e, f, g"]'), /1 tot 6 trefwoorden/);
    const ok = h.stop('[micro-voorstel demo.l2.review "Uit de review" "review"]');
    assert.match(ok.json?.systemMessage ?? "", /waarom: hulp op trede 2 over demo\.l2 in de review na taak t1/);
  } finally { h.p.cleanup(); }
});

test("#22 'ja, toevoegen' without an open proposal adds nothing", () => {
  const h = project();
  try {
    assert.match(h.ctx(h.prompt("ja, toevoegen")), /geen voorstel voor een microvaardigheid open/);
    assert.equal(h.of("micro-add").length, 0);
  } finally { h.p.cleanup(); }
});

// ---------- #30: --update while a practice session runs ----------
const INSTALL = path.join(HARNESS, "install.mjs");
const cleanEnv = () => { const e = { ...process.env }; delete e.LEERHARNAS_ROOT; delete e.LEERHARNAS_DATA; return e; };
const install = (target, ...args) => run(INSTALL, [target, ...args], { env: cleanEnv() });

function installed({ lastActiveAgoMin, idleMinutes = null }) {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-review3-"));
  install(d, "--yes");
  // A local change, so an update has something to do.
  fs.appendFileSync(path.join(d, ".claude/hooks/guard.mjs"), "\n// eigen aanpassing\n");
  if (idleMinutes) {
    const f = path.join(d, ".learning/skills.json");
    const data = JSON.parse(fs.readFileSync(f, "utf8"));
    data.settings = { ...data.settings, idleMinutes };
    fs.writeFileSync(f, JSON.stringify(data, null, 2));
  }
  const state = path.join(d, ".learning/state");
  fs.mkdirSync(state, { recursive: true });
  const at = Date.now() - lastActiveAgoMin * MIN;
  const file = path.join(state, "session-abc.json");
  fs.writeFileSync(file, JSON.stringify({ startedAt: at - 30 * MIN, lastActiveAt: at, lastPromptAt: at }));
  fs.utimesSync(file, new Date(at), new Date(at));
  return { d, changed: () => fs.readFileSync(path.join(d, ".claude/hooks/guard.mjs"), "utf8").includes("eigen aanpassing") };
}

test("#30 --update stops while a practice session runs: with --yes, and without a terminal", () => {
  const { d, changed } = installed({ lastActiveAgoMin: 3 });
  try {
    for (const args of [["--update", "--yes"], ["--update"]]) {
      const r = install(d, ...args);
      assert.equal(r.code, 1, args.join(" "));
      assert.match(r.stdout, /er loopt een oefensessie in deze map \(laatst actief 3 min geleden/);
      assert.match(r.stdout, /--force/);
      assert.ok(changed(), "nothing was replaced");
    }
    const dry = install(d, "--update", "--dry-run");
    assert.equal(dry.code, 0);
    assert.match(dry.stdout, /er loopt een oefensessie/);
    assert.ok(changed());
    const forced = install(d, "--update", "--yes", "--force");
    assert.equal(forced.code, 0, forced.stderr);
    assert.match(forced.stdout, /--force: de update gaat toch door/);
    assert.ok(!changed(), "replaced with --force");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("#30 a session that has been quiet for longer than idleMinutes does not stop the update", () => {
  const quiet = installed({ lastActiveAgoMin: 30 });
  try {
    const r = install(quiet.d, "--update", "--yes");
    assert.equal(r.code, 0, r.stderr);
    assert.doesNotMatch(r.stdout, /oefensessie/);
    assert.ok(!quiet.changed());
  } finally { fs.rmSync(quiet.d, { recursive: true, force: true }); }
  // With idleMinutes 45 in the learner's settings, 30 minutes ago still counts as running.
  const longer = installed({ lastActiveAgoMin: 30, idleMinutes: 45 });
  try {
    const r = install(longer.d, "--update", "--yes");
    assert.equal(r.code, 1);
    assert.match(r.stdout, /tot 45 min stilte/);
  } finally { fs.rmSync(longer.d, { recursive: true, force: true }); }
});
