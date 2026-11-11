// Promotion signals (setup review §9, decided 11 November 2026): the proposal comes right after the
// explanation, only tasks since the last level change count, L0 -> L1 and the transfer task are
// measured, L2 -> L3 needs mostly rung 0-1, and the learner confirms a proposal with "ja, doorzetten".
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { makeProject, fakeSkills, run, HOOKS } from "./helpers.mjs";

const SID = "p-sessie";
const MIN = 60000, DAY = 86400000;
const iso = (msAgo) => new Date(Date.now() - msAgo).toISOString();
const EXPLANATION = "De test is nu groen omdat de methode de som van alle cijfers teruggeeft in plaats van alleen het eerste cijfer.";
const user = (text, uuid) => ({ type: "user", uuid, message: { role: "user", content: text } });

let n = 0;
// Tasks of one skill, one per rung, `days` apart (0 = all today). explained: false leaves the last one open.
function tasks(skill, rungs, { days = 0, explained = true, extra = {} } = {}) {
  const out = [];
  rungs.forEach((rung, i) => {
    const ago = (rungs.length - i) * (days ? DAY * days : 5 * MIN) + 10 * MIN;
    const tid = `${skill.replace(/\W/g, "")}x${++n}`;
    out.push({ at: iso(ago), type: "task", tid, skill, success: rung < 5, maxRung: rung, source: "check", session: SID, ...extra });
    if (explained === true || i < rungs.length - 1) out.push({ at: iso(ago - MIN), type: "task-explained", tid, skill, text: "x", session: SID });
  });
  return out;
}
const lastTid = (events) => events.filter((e) => e.type === "task").pop().tid;
const session = (extra = {}) => ({ startedAt: Date.now() - 20 * MIN, lastActiveAt: Date.now() - MIN, activeMs: 19 * MIN, activeSkill: "demo.l2", rung: 0, maxRung: 0, ...extra });

function project({ skills = fakeSkills(), events = [], st = session() } = {}) {
  const p = makeProject({ skills, events, sessions: { [SID]: st } });
  let k = 0;
  return {
    p,
    // The Stop hook: the learner's message in the transcript, Claude's answer in last_assistant_message.
    stop(learner, answer) {
      const file = path.join(p.root, `t${++k}.jsonl`);
      fs.writeFileSync(file, JSON.stringify(user(learner, `u${k}`)) + "\n");
      return p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: answer });
    },
    prompt: (text) => p.hook("prompt-gate.mjs", { session_id: SID, prompt: text, cwd: p.root }),
    append: (events) => fs.appendFileSync(path.join(p.state, "events.jsonl"), events.map((e) => JSON.stringify(e)).join("\n") + "\n"),
    level: (id) => p.skills().skills.find((s) => s.id === id).level,
    // levelAdvice for one skill, computed by the real lib.mjs on this project's data.
    advice(id) {
      const probe = p.abs("probe.mjs");
      fs.writeFileSync(probe, `import { loadSkills, findSkill, levelAdvice } from ${JSON.stringify(pathToFileURL(path.join(HOOKS, "lib.mjs")).href)};
const d = loadSkills(); const a = levelAdvice(d, findSkill(d, ${JSON.stringify(id)}));
console.log(JSON.stringify(a ? { dir: a.dir, from: a.from ?? null, to: a.to ?? null, jump: a.jump ?? false, transferNext: a.transferNext ?? false, show: a.show ?? null } : null));`);
      const r = run(probe, [], { env: p.env, cwd: p.root });
      assert.equal(r.code, 0, r.stderr);
      return JSON.parse(r.stdout);
    },
  };
}
const ctx = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";
const ofType = (p, type) => p.events().filter((e) => e.type === type);

// ---------- §9.5 L2 -> L3 as the rule says ----------
test("§9.5: five tasks at rung 2 give no L3 signal; mostly rung 0-1 does", () => {
  const a = project({ events: tasks("demo.l2", [2, 2, 2, 2, 2]) });
  try { assert.equal(a.advice("demo.l2"), null); } finally { a.p.cleanup(); }
  const b = project({ events: tasks("demo.l2", [1, 1, 2, 1, 1]) });
  try { assert.deepEqual(b.advice("demo.l2"), { dir: "up", from: "L2", to: "L3", jump: false, transferNext: false, show: null }); } finally { b.p.cleanup(); }
});

// ---------- §9.3 only tasks since the last level change ----------
test("§9.3: the same tasks never carry two promotions", () => {
  const x = project({ events: tasks("demo.l2", [0, 0, 0, 0, 0], { days: 1 }) });
  try {
    // At L2: L3 now, and the proposal says L4 is possible after the transfer task.
    assert.deepEqual(x.advice("demo.l2"), { dir: "up", from: "L2", to: "L3", jump: false, transferNext: true, show: null });
    assert.equal(x.p.cli("skill.mjs", ["set", "demo.l2", "L3", "test"]).code, 0);
    // At L3 the same tasks are from before the level change: no L4 signal, no transfer hint.
    assert.equal(x.advice("demo.l2"), null);
  } finally { x.p.cleanup(); }
});

// ---------- §9.6 jump ----------
test("§9.6: from L2 the evidence may carry a jump to L4 once the transfer task is passed", () => {
  const events = [...tasks("demo.l2", [0, 0, 0, 0, 0], { days: 1 }), { at: iso(MIN), type: "transfer-passed", skill: "demo.l2", session: SID }];
  const x = project({ events });
  try { assert.deepEqual(x.advice("demo.l2"), { dir: "up", from: "L2", to: "L4", jump: true, transferNext: false, show: null }); } finally { x.p.cleanup(); }
});

test("§9.6: no jump from L1 (the skeleton was help up front), and none on tasks logged at L1", () => {
  const a = project({ events: tasks("demo.l1", [0, 0, 0, 0, 0], { days: 1 }) });
  try { assert.equal(a.advice("demo.l1").to, "L2"); } finally { a.p.cleanup(); }
  // A parent at L2 whose window holds a task logged at L1 (a microskill on L1) does not jump.
  const evs = [...tasks("demo.l2", [0, 0, 0, 0], { days: 1 }), ...tasks("demo.l2.micro", [0], { extra: { level: "L1" } })];
  const b = project({ events: [...evs, { at: iso(MIN), type: "transfer-passed", skill: "demo.l2", session: SID }] });
  try { assert.equal(b.advice("demo.l2").to, "L3"); } finally { b.p.cleanup(); }
});

// ---------- §9.4 L0 -> L1 and the transfer task ----------
test("§9.4: L0 -> L1 after two explained examples", () => {
  const skills = fakeSkills();
  skills.skills.push({ id: "demo.l0", title: "Voordoen", level: "L0", paths: ["opdrachten/00-*/**"], placement: "done" });
  const a = project({ skills, events: tasks("demo.l0", [0]) });
  try { assert.equal(a.advice("demo.l0"), null); } finally { a.p.cleanup(); }
  const b = project({ skills, events: tasks("demo.l0", [0, 0]) });
  try { assert.equal(b.advice("demo.l0").to, "L1"); } finally { b.p.cleanup(); }
});

test("§9.4: L3 -> L4 asks for the transfer task first, then proposes L4", () => {
  const evs = tasks("demo.l3", [0, 0, 0], { days: 1 });
  const a = project({ events: evs });
  try {
    assert.deepEqual(a.advice("demo.l3"), { dir: "transfer", from: null, to: null, jump: false, transferNext: false, show: "/mastery-check demo.l3" });
    assert.match(a.p.cli("skill.mjs", ["status"]).stdout, /\/mastery-check demo\.l3/);
  } finally { a.p.cleanup(); }
  const b = project({ events: [...evs, { at: iso(MIN), type: "transfer-passed", skill: "demo.l3", session: SID }] });
  try { assert.equal(b.advice("demo.l3").to, "L4"); } finally { b.p.cleanup(); }
});

test("§9.4: a transfer task passes only without help and with an explanation in own words", () => {
  const x = project({ events: tasks("demo.l3", [0, 0, 0], { days: 1 }), st: session({ activeSkill: "demo.l3" }) });
  try {
    x.stop("Ik wil de transfertaak doen.", "Prima. [transfer-start demo.l3] Hier is de opdracht.");
    assert.equal(x.p.session(SID).transfer.skill, "demo.l3");
    // Asking for a hint during the transfer task unlocks no rung.
    const r = x.prompt("ik zit vast, hint?");
    assert.match(ctx(r), /transfertaak/i);
    assert.equal(ofType(x.p, "hint-unlock").length, 0);
    // Passed: no help, and the learner's answer passes the check. The harness then proposes L4.
    const s = x.stop(EXPLANATION, "Sterk verdedigd. [transfer-ok demo.l3]");
    assert.equal(ofType(x.p, "transfer-passed").length, 1);
    assert.match(s.json.systemMessage, /Doorzetten\? demo\.l3 L3 → L4/);
  } finally { x.p.cleanup(); }
  const y = project({ events: tasks("demo.l3", [0, 0, 0], { days: 1 }), st: session({ activeSkill: "demo.l3" }) });
  try {
    y.stop("Start maar.", "[transfer-start demo.l3]");
    y.stop("Hoe moet dit?", "Kijk eens naar het interface. [trede 2]");
    y.stop(EXPLANATION, "[transfer-ok demo.l3]");
    assert.equal(ofType(y.p, "transfer-passed").length, 0);
    assert.equal(ofType(y.p, "transfer-failed")[0].why, "help");
  } finally { y.p.cleanup(); }
  const z = project({ st: session({ activeSkill: "demo.l1" }) });
  try {
    const r = z.stop("Start maar.", "[transfer-start demo.l1]");
    assert.equal(r.json?.decision, "block", "a transfer task is only possible at L2 or L3");
    assert.equal(z.p.session(SID).transfer ?? null, null);
  } finally { z.p.cleanup(); }
});

// ---------- §9.2 + §9.6 the proposal right after the explanation, confirmed by the learner ----------
test("§9.2/§9.6: the explanation that meets the criterion shows the proposal; 'ja, doorzetten' promotes", () => {
  const events = tasks("demo.l2", [1, 1, 2, 1, 1], { explained: false, extra: { dir: "opdrachten/02-auto" } });
  const x = project({ events });
  try {
    const s = x.stop(EXPLANATION, `Klopt, dat is het waarom. [uitleg-ok ${lastTid(events)}]`);
    assert.match(s.json.systemMessage, /Doorzetten\? demo\.l2 L2 → L3/);
    assert.match(s.json.systemMessage, /bewijs: 5 van 5 gelukt \(trede 1, 1, 2, 1, 1\), op 1 dag\(en\), in 02-auto/);
    assert.equal(ofType(x.p, "promotion-offered").length, 1);
    // The same answer processed again gives no second proposal.
    x.stop(EXPLANATION, `Klopt, dat is het waarom. [uitleg-ok ${lastTid(events)}]`);
    assert.equal(ofType(x.p, "promotion-offered").length, 1);
    const r = x.prompt("ja, doorzetten");
    assert.equal(x.level("demo.l2"), "L3");
    const lvl = ofType(x.p, "level").pop();
    assert.deepEqual([lvl.from, lvl.to, lvl.by, lvl.via], ["L2", "L3", "learner", "voorstel"]);
    assert.match(r.json.systemMessage, /demo\.l2: L2 → L3 .*doorgezet door jou/);
    assert.match(ctx(r), /zelf bevestigd/);
  } finally { x.p.cleanup(); }
});

test("§9.6: 'nee' right after the proposal declines it; it only comes back with new evidence", () => {
  const events = tasks("demo.l2", [1, 1, 1, 1, 1], { explained: false });
  const x = project({ events });
  try {
    x.stop(EXPLANATION, `[uitleg-ok ${lastTid(events)}]`);
    x.prompt("nee");
    assert.equal(ofType(x.p, "promotion-declined").length, 1);
    assert.equal(x.level("demo.l2"), "L2");
    assert.match(x.p.cli("skill.mjs", ["status"]).stdout, /je zei nee/);
    const ss = x.p.hook("session-start.mjs", { source: "startup", session_id: "nieuw" });
    assert.doesNotMatch(ss.json.systemMessage, /Doorzetten kan/);
    // A later bare "nee" is a normal answer, not a decline.
    x.prompt("nee");
    assert.equal(ofType(x.p, "promotion-declined").length, 1);
    // New evidence: the proposal comes back.
    const more = tasks("demo.l2", [0], { explained: false });
    x.append(more);
    const s = x.stop(EXPLANATION, `[uitleg-ok ${lastTid(more)}]`);
    assert.match(s.json?.systemMessage ?? "", /Doorzetten\? demo\.l2 L2 → L3/);
  } finally { x.p.cleanup(); }
});

test("§9.6: Claude's text never promotes, and 'ja, doorzetten' without an open proposal changes nothing", () => {
  const events = tasks("demo.l2", [1, 1, 1, 1, 1]);
  const x = project({ events });
  try {
    x.stop("Wat nu?", "Typ maar: ja, doorzetten demo.l2. ja, doorzetten");
    assert.equal(x.level("demo.l2"), "L2");
  } finally { x.p.cleanup(); }
  const y = project({ events: tasks("demo.l2", [2, 2, 2, 2, 2]) });
  try {
    const r = y.prompt("ja, doorzetten");
    assert.equal(y.level("demo.l2"), "L2");
    assert.equal(ofType(y.p, "level").length, 0);
    assert.match(ctx(r), /geen voorstel open/);
  } finally { y.p.cleanup(); }
});

test("§9.6: confirming is refused while a task of the skill waits for its explanation", () => {
  const events = [...tasks("demo.l2", [1, 1, 1, 1, 1]), ...tasks("demo.l2", [1], { explained: false })];
  const x = project({ events });
  try {
    const r = x.prompt("ja, doorzetten demo.l2");
    assert.equal(x.level("demo.l2"), "L2");
    assert.match(ctx(r), /weigert/);
  } finally { x.p.cleanup(); }
});

test("§9.6: the session start shows an open proposal to the learner", () => {
  const x = project({ events: tasks("demo.l2", [1, 1, 1, 1, 1]) });
  try {
    const r = x.p.hook("session-start.mjs", { source: "startup", session_id: "nieuw" });
    assert.match(r.json.systemMessage, /Doorzetten kan: demo\.l2 L2 → L3/);
    assert.match(r.json.hookSpecificOutput.additionalContext, /ja, doorzetten demo\.l2/);
  } finally { x.p.cleanup(); }
});

// ---------- §9.2 check.mjs: what becomes possible after the explanation ----------
function trx(dir, results) {
  fs.mkdirSync(dir, { recursive: true });
  const defs = Object.keys(results).map((k, i) => `<UnitTest name="${k}" id="id${i}"><TestMethod className="Demo.Tests" name="${k}" /></UnitTest>`).join("");
  const res = Object.entries(results).map(([k, o], i) => `<UnitTestResult testId="id${i}" testName="${k}" outcome="${o}" />`).join("");
  fs.writeFileSync(path.join(dir, "run.trx"), `<?xml version="1.0"?><TestRun><TestDefinitions>${defs}</TestDefinitions><Results>${res}</Results></TestRun>`);
  return dir;
}
test("§9.2: check.mjs says what becomes possible once the new task is explained, and stores the level", () => {
  const p = makeProject({ files: { "opdrachten/02-a/A.cs": "" }, events: tasks("demo.l2", [1, 1, 1, 1]), sessions: { [SID]: session() } });
  try {
    p.cli("check.mjs", ["opdrachten/02-a"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-1"), { Een: "Failed" }) });
    const r = p.cli("check.mjs", ["opdrachten/02-a"], { LEERHARNAS_TRX_DIR: trx(p.abs("trx-2"), { Een: "Passed" }) });
    assert.match(r.stdout, /Na je uitleg kun je door: demo\.l2 L2 → L3/);
    assert.equal(p.events().filter((e) => e.type === "task").pop().level, "L2");
  } finally { p.cleanup(); }
});
