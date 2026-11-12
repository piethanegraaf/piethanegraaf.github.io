// The decisions of the setup review of 12 November 2026 (#31-#46): up loud and down quiet (#31), a
// demotion judged on the evidence of now (#32), at least 4 tasks (#33), the rung within the family (#34),
// progress in the chat (#35), a reachable L4 (#36), honest praise first (#37), "als … dan" counts as a why
// (#38), effort is the goal (#39), placement at the explanation (#44) and how a change was decided (#45).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject, fakeSkills, HARNESS, run } from "./helpers.mjs";
import { CAUSAL } from "../hooks/patterns.mjs";

const SID = "s-12-11";
const MIN = 60000;
const ago = (min) => new Date(Date.now() - min * MIN).toISOString();
const task = (tid, skill, maxRung, extra = {}) => ({ at: ago(30), type: "task", tid, skill, success: maxRung < 5, maxRung, source: "check", session: SID, ...extra });
const explained = (tid, skill) => ({ at: ago(29), type: "task-explained", tid, skill, text: "x", session: SID });
const GOOD = "De test is groen omdat de methode nu de som van alle cijfers teruggeeft in plaats van alleen het eerste cijfer.";
const user = (text, uuid = "u1") => ({ type: "user", uuid, message: { role: "user", content: text } });
const assistant = (content) => ({ type: "assistant", message: { role: "assistant", content: typeof content === "string" ? [{ type: "text", text: content }] : content } });
const session = (extra = {}) => ({ startedAt: Date.now() - 20 * MIN, lastActiveAt: Date.now() - MIN, activeMs: 19 * MIN, activeSkill: "demo.l2", folderSkill: "demo.l2",
  folderSkillAt: Date.now() + MIN, rung: 0, maxRung: 0, ...extra });
const autoSkills = () => fakeSkills({ autoDemote: true });
const skillOf = (p, id) => p.skills().skills.find((s) => s.id === id);
const ctxOf = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";

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
const prompt = (p, text) => p.hook("prompt-gate.mjs", { session_id: SID, prompt: text });
const setSession = (p, patch) => fs.writeFileSync(path.join(p.state, `session-${SID}.json`), JSON.stringify({ ...p.session(SID), ...patch }));

// ---------- #33: at least 4 explained tasks ----------
test("#33 one hard task in the first three is no reason to go down; two in four are", () => {
  const three = makeProject({ skills: autoSkills(), events: [task("a", "demo.l2.micro", 4), explained("a", "demo.l2.micro"), task("b", "demo.l2.micro", 0),
    explained("b", "demo.l2.micro"), task("c", "demo.l2.micro", 0)], sessions: { [SID]: session() } });
  try {
    stop(three, [user(GOOD)], "[uitleg-ok c]");
    assert.equal(skillOf(three, "demo.l2.micro").level, "L2", "1 of 3 failed (67%) no longer counts");
  } finally { three.cleanup(); }
  const four = makeProject({ skills: autoSkills(), events: [task("a", "demo.l2.micro", 4), explained("a", "demo.l2.micro"), task("b", "demo.l2.micro", 0),
    explained("b", "demo.l2.micro"), task("e", "demo.l2.micro", 4), explained("e", "demo.l2.micro"), task("c", "demo.l2.micro", 0)], sessions: { [SID]: session() } });
  try {
    stop(four, [user(GOOD)], "[uitleg-ok c]");
    assert.equal(skillOf(four, "demo.l2.micro").level, "L1", "2 of 4 (50%)");
  } finally { four.cleanup(); }
});

// ---------- #34: the rung within the family ----------
test("#34 [trede N #id] about another family raises the task's rung, not its family rung", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/Lijst.cs": "" }, sessions: { [SID]: session() } });
  try {
    stop(p, [user("waarom blijft het null?")], "Een lokale variabele verdwijnt na de constructor. [trede 4 #demo.l3]");
    check(p, "opdrachten/02-lijst", { Een: "Failed" }, 1);
    check(p, "opdrachten/02-lijst", { Een: "Passed" }, 2);
    const t1 = p.events().filter((e) => e.type === "task").pop();
    assert.deepEqual([t1.maxRung, t1.familyRung], [4, 0], "honest rung 4; for its own family no help");
    stop(p, [user("en nu?", "u2")], "Kijk naar de lus. [trede 2]");
    check(p, "opdrachten/02-lijst", { Een: "Passed", Twee: "Failed" }, 3);
    check(p, "opdrachten/02-lijst", { Een: "Passed", Twee: "Passed" }, 4);
    const t2 = p.events().filter((e) => e.type === "task").pop();
    assert.deepEqual([t2.maxRung, t2.familyRung], [2, undefined], "help within the family: the same rung, not stored twice");
  } finally { p.cleanup(); }
});

test("#34 a task that only needed help about another family does not count as failed for demotion", () => {
  const events = [task("a", "demo.l2", 4, { familyRung: 0 }), explained("a", "demo.l2"), task("b", "demo.l2", 4, { familyRung: 1 }), explained("b", "demo.l2"),
    task("g", "demo.l2", 0), explained("g", "demo.l2"), task("c", "demo.l2", 0)];
  const p = makeProject({ skills: autoSkills(), events, sessions: { [SID]: session() } });
  try {
    stop(p, [user(GOOD)], "[uitleg-ok c]");
    assert.equal(p.session(SID).demotionPending ?? null, null, "4 of 4 solved within the family");
  } finally { p.cleanup(); }
});

test("#34 the analyst may choose an existing microskill of another family", () => {
  const s = autoSkills();
  s.skills.push({ id: "demo.l3.veld", parent: "demo.l3", title: "Veld of lokaal", level: "L2", keywords: ["veld"], placement: "done" });
  const p = makeProject({ skills: s, events: [task("a", "demo.l2", 4), explained("a", "demo.l2"), task("b", "demo.l2", 4), explained("b", "demo.l2"),
    task("g", "demo.l2", 1), explained("g", "demo.l2"), task("c", "demo.l2", 1), explained("c", "demo.l2")],
  sessions: { [SID]: session({ demotionPending: { skill: "demo.l2", tids: ["a", "b", "g", "c"], reason: "x", at: Date.now() - MIN } }) } });
  try {
    const ctx = ctxOf(prompt(p, "oké"));
    assert.match(ctx, /"andereMicrovaardigheden":\[\{"id":"demo\.l3\.veld"/);
    const verdict = { ouder: "demo.l2", taken: [{ tid: "a", deelpatroon: "veld", micro: "demo.l3.veld", uitgesloten: null }, { tid: "b", deelpatroon: "veld", micro: "demo.l3.veld", uitgesloten: null }],
      nieuweMicro: [], oordeel: "micro", doel: "demo.l3.veld", reden: "a en b: veld tegenover lokaal.", twijfel: false };
    const agent = assistant([{ type: "tool_use", id: "x1", name: "Agent", input: { subagent_type: "demotie-analist", prompt: "..." } }]);
    stop(p, [user("oké"), agent], `[demotie ${JSON.stringify(verdict)}]`);
    assert.equal(skillOf(p, "demo.l3.veld").level, "L1");
    assert.equal(skillOf(p, "demo.l2").level, "L2", "the parent of the tasks stays");
    assert.deepEqual(p.events().filter((e) => e.type === "task-retag").map((e) => e.to), ["demo.l3.veld", "demo.l3.veld"]);
  } finally { p.cleanup(); }
});

// ---------- #32: the evidence of now ----------
test("#32 a pending demotion whose criterion no longer holds is cancelled, with a kind word", () => {
  const events = [task("a", "demo.l2", 4), explained("a", "demo.l2"), task("b", "demo.l2", 0), explained("b", "demo.l2"),
    task("g", "demo.l2", 0), explained("g", "demo.l2"), task("c", "demo.l2", 0), explained("c", "demo.l2")];
  const p = makeProject({ skills: autoSkills(), events, sessions: { [SID]: session({ demotionPending: { skill: "demo.l2", tids: ["a"], reason: "0 van 1", at: Date.now() - MIN } }) } });
  try {
    const ctx = ctxOf(prompt(p, "oké"));
    assert.match(ctx, /demo\.l2 blijft L2: met je laatste taken haal je de grens weer/);
    assert.doesNotMatch(ctx, /demotie-analist aan/);
    assert.equal(p.session(SID).demotionPending, null);
    assert.ok(p.events().some((e) => e.type === "demotion-cancelled" && e.skill === "demo.l2"));
  } finally { p.cleanup(); }
});

test("#32 the verdict itself is checked against the evidence of now too", () => {
  const events = [task("a", "demo.l2", 4), explained("a", "demo.l2"), task("b", "demo.l2", 0), explained("b", "demo.l2"),
    task("g", "demo.l2", 0), explained("g", "demo.l2"), task("c", "demo.l2", 0), explained("c", "demo.l2")];
  const p = makeProject({ skills: autoSkills(), events, sessions: { [SID]: session({ demotionPending: { skill: "demo.l2", tids: ["a"], reason: "x", at: Date.now() - MIN } }) } });
  try {
    const agent = assistant([{ type: "tool_use", id: "x1", name: "Agent", input: { subagent_type: "demotie-analist", prompt: "..." } }]);
    const r = stop(p, [user("oké"), agent], `[demotie ${JSON.stringify({ ouder: "demo.l2", taken: [], nieuweMicro: [], oordeel: "ouder", doel: "demo.l2", reden: "x" })}]`);
    assert.equal(skillOf(p, "demo.l2").level, "L2");
    assert.match(r.json?.systemMessage ?? "", /blijft L2/);
  } finally { p.cleanup(); }
});

test("#32 while an explanation of the family is open, the analyst waits", () => {
  const p = makeProject({ skills: autoSkills(), events: [task("a", "demo.l2", 4), explained("a", "demo.l2"), task("b", "demo.l2", 4), explained("b", "demo.l2"),
    task("g", "demo.l2", 1), explained("g", "demo.l2"), task("c", "demo.l2", 1), explained("c", "demo.l2"), task("open", "demo.l2.micro", 0, { at: ago(5) })],
  sessions: { [SID]: session({ demotionPending: { skill: "demo.l2", tids: ["a", "b", "g", "c"], reason: "x", at: Date.now() - MIN } }) } });
  try {
    assert.doesNotMatch(ctxOf(prompt(p, "oké")), /demotie-analist aan/);
    assert.ok(p.session(SID).demotionPending, "still pending, not cancelled");
  } finally { p.cleanup(); }
});

// ---------- #31: down is quiet, no JSON in the chat ----------
test("#31 the harness reads the verdict from the report of a background analyst; the chat needs no JSON", () => {
  const events = [task("a", "demo.l2", 4), explained("a", "demo.l2"), task("b", "demo.l2", 4), explained("b", "demo.l2"),
    task("g", "demo.l2", 1), explained("g", "demo.l2"), task("c", "demo.l2", 1), explained("c", "demo.l2")];
  const p = makeProject({ skills: autoSkills(), events, sessions: { [SID]: session({ demotionPending: { skill: "demo.l2", tids: ["a", "b", "g", "c"], reason: "x", at: Date.now() - MIN } }) } });
  try {
    assert.match(ctxOf(prompt(p, "oké")), /Zet zijn JSON NIET in je antwoord/);
    const verdict = { ouder: "demo.l2", taken: [{ tid: "a", deelpatroon: "lus", micro: "demo.l2.lus", uitgesloten: null }],
      nieuweMicro: [{ id: "demo.l2.lus", titel: "Lusgrenzen", trefwoorden: ["lus"], niveau: "L1" }], oordeel: "micro", doel: "demo.l2.lus", reden: "a: de lus.", twijfel: true };
    const launch = assistant([{ type: "tool_use", id: "x1", name: "Agent", input: { subagent_type: "demotie-analist", prompt: "..." } }]);
    const launched = { type: "user", toolUseResult: { isAsync: true, agentId: "ag1" }, message: { role: "user", content: [{ type: "tool_result", tool_use_id: "x1", content: "Async agent launched successfully.\nagentId: ag1" }] } };
    // Before the report: nothing happens yet.
    stop(p, [user("oké"), launch, launched], "Ik laat de harnas even kijken.");
    assert.equal(skillOf(p, "demo.l2.lus"), undefined);
    const report = { type: "user", isMeta: true, origin: { kind: "peer", from: "ag1", name: "demotie-analist", handback: true, handbackReportText: JSON.stringify(verdict) },
      message: { role: "user", content: "Another Claude session sent a message: ..." } };
    const r = stop(p, [user("oké"), launch, launched, report], "Klaar, we gaan verder.");
    assert.equal(skillOf(p, "demo.l2.lus").level, "L1");
    assert.deepEqual(skillOf(p, "demo.l2.lus").history[0].by, "demotie-analist", "auto and by in the record (#45)");
    const msg = r.json?.systemMessage ?? "";
    assert.equal(msg.split("\n").length, 1, "one quiet line");
    assert.match(msg, /^\[leerharnas\] Extra steun voor een deelpatroon: demo\.l2\.lus op L1 .*\(De analist twijfelde; dat komt in het dagboek\.\)$/);
    assert.equal(p.session(SID).demotionPending, null);
  } finally { p.cleanup(); }
});

// ---------- #44: placement at the explanation ----------
test("#44 a first task whose explanation lapses places nothing; the placement stays open", () => {
  const s = fakeSkills();
  s.skills.push({ id: "demo.nieuw", title: "Nieuw", level: "L2", paths: ["opdrachten/05-*/**"] });
  const p = makeProject({ skills: s, files: { "opdrachten/05-x/X.cs": "", "opdrachten/02-lijst/L.cs": "" }, sessions: { [SID]: session({ activeSkill: "demo.nieuw", folderSkill: "demo.nieuw" }) } });
  try {
    check(p, "opdrachten/05-x", { Een: "Failed" }, 1);
    check(p, "opdrachten/05-x", { Een: "Passed" }, 2);
    check(p, "opdrachten/02-lijst", { Een: "Failed" }, 3); // another exercise: the explanation lapses
    assert.ok(p.events().some((e) => e.type === "task-lapsed"));
    assert.equal(skillOf(p, "demo.nieuw").placement, undefined);
    assert.match(p.cli("skill.mjs", ["list"]).stdout, /demo\.nieuw.*plaatsing open/);
  } finally { p.cleanup(); }
});

// ---------- #36: L4 within reach ----------
const tomorrow = () => { const d = new Date(Date.now() + 24 * 60 * MIN); return d.toISOString(); };

test("#36 design goal: a learner who masters it and practises daily reaches L4 in about 3 sessions on 2 days", () => {
  const s = fakeSkills();
  s.skills.push({ id: "demo.nieuw", title: "Nieuw", level: "L2", paths: ["opdrachten/05-*/**"] });
  const p = makeProject({ skills: s, files: { "opdrachten/05-a/A.cs": "", "opdrachten/05-b/B.cs": "" }, sessions: { [SID]: session({ activeSkill: "demo.nieuw", folderSkill: "demo.nieuw" }) } });
  const explain = (uuid) => {
    const tid = p.events().filter((e) => e.type === "task").pop().tid;
    return stop(p, [user(GOOD, uuid)], `Klopt. [uitleg-ok ${tid}]`);
  };
  try {
    // Session 1 (day 1): the first exercise, without a hint. The placement puts it at L3, and that task counts (a).
    check(p, "opdrachten/05-a", { Een: "Failed" }, 1);
    check(p, "opdrachten/05-a", { Een: "Passed" }, 2);
    explain("u1");
    assert.equal(skillOf(p, "demo.nieuw").level, "L3");
    // Session 2: the next exercise, without a hint. Then only the transfer task is missing (b).
    check(p, "opdrachten/05-b", { Een: "Failed" }, 3);
    const out = check(p, "opdrachten/05-b", { Een: "Passed" }, 4).stdout;
    assert.match(out, /Na je uitleg ontbreekt alleen nog de transfertaak \(demo\.nieuw: 2x zelfstandig op 1 dag\(en\); nog de transfertaak, die telt als één van de drie keer, op een andere dag\)/);
    explain("u2");
    assert.match(p.cli("skill.mjs", ["status"]).stdout, /→ demo\.nieuw: 2x zelfstandig/);
    // Session 3 (day 2): the transfer task passed. Now the proposal L3 -> L4.
    fs.appendFileSync(path.join(p.state, "events.jsonl"), JSON.stringify({ at: tomorrow(), type: "transfer-passed", skill: "demo.nieuw", session: "s3" }) + "\n");
    const st = p.cli("skill.mjs", ["status"]).stdout;
    assert.match(st, /↑ demo\.nieuw: 2x zelfstandig plus de transfertaak, op 2 dagen \(L3 → L4\)/);
  } finally { p.cleanup(); }
});

test("#36 the transfer task on the same day as the other tasks: not yet L4, and the progress line says why", () => {
  const s = fakeSkills();
  s.skills.find((x) => x.id === "demo.l3").history = [{ at: "2026-11-01", atIso: "2026-11-01T08:00:00.000Z", from: "L2", to: "L3", note: "x" }];
  const now = new Date().toISOString();
  const p = makeProject({ skills: s, events: [task("a", "demo.l3", 0, { at: now }), explained("a", "demo.l3"), task("b", "demo.l3", 0, { at: now }), explained("b", "demo.l3"),
    { at: now, type: "transfer-passed", skill: "demo.l3" }] });
  try {
    const st = p.cli("skill.mjs", ["status"]).stdout;
    assert.doesNotMatch(st, /↑ demo\.l3/);
    assert.match(st, /↗ demo\.l3 L3 → L4: zonder hint 3\/3 ✓ · dagen 1\/2 · transfertaak ✓/);
  } finally { p.cleanup(); }
});

test("#36 with the exercise folders used up at L3, Claude points to an existing next exercise (once)", () => {
  const p = makeProject({ files: { "opdrachten/03-a/A.cs": "" }, events: [task("a", "demo.l3", 0, { dir: "opdrachten/03-a" }), explained("a", "demo.l3")],
    sessions: { [SID]: session({ activeSkill: "demo.l3", folderSkill: "demo.l3" }) } });
  try {
    const ctx = ctxOf(prompt(p, "wat nu?"));
    assert.match(ctx, /demo\.l3 staat op L3 en de opdrachtmappen ervan zijn op \(↗ demo\.l3 L3 → L4: zonder hint 1\/3/);
    assert.match(ctx, /oefentoets/);
    assert.match(ctx, /Maak zelf geen nieuwe opdracht/);
    assert.doesNotMatch(ctxOf(prompt(p, "en nu?")), /opdrachtmappen ervan zijn op/);
    assert.match(p.cli("skill.mjs", ["status"]).stdout, /mappen op: vraag Claude om een volgende oefening/);
  } finally { p.cleanup(); }
});

// ---------- #35: progress in steps ----------
test("#35 check.mjs shows how far the next level is, in steps, never as a percentage", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/L.cs": "" }, events: [task("a", "demo.l2", 0), explained("a", "demo.l2")], sessions: { [SID]: session() } });
  try {
    check(p, "opdrachten/02-lijst", { Een: "Failed" }, 1);
    const out = check(p, "opdrachten/02-lijst", { Een: "Passed" }, 2).stdout;
    assert.match(out, /↗ demo\.l2 L2 → L3: taken 2\/5 · gelukt 2\/5 · met hint 0–1 2\/3/);
    assert.doesNotMatch(out, /↗[^\n]*%/);
  } finally { p.cleanup(); }
});

test("#35 #31 the session start shows the way up and what went up, and once that effort is the goal (#39)", () => {
  const s = fakeSkills();
  s.skills.find((x) => x.id === "demo.l3").history = [{ at: new Date().toLocaleDateString("sv-SE"), atIso: ago(60), from: "L2", to: "L3", note: "x", by: "learner", via: "voorstel" }];
  const p = makeProject({ skills: s, events: [task("a", "demo.l3", 0, { at: ago(10) }), explained("a", "demo.l3")] });
  try {
    const first = p.hook("session-start.mjs", { source: "startup", session_id: "n1" }).json.systemMessage;
    assert.match(first, /Omhoog \(7 dagen\): ↑ demo\.l3 → L3/);
    assert.match(first, /↗ demo\.l3 L3 → L4: zonder hint 1\/3/);
    assert.match(first, /moeite is hier het doel, geen falen/);
    const second = p.hook("session-start.mjs", { source: "startup", session_id: "n2" }).json.systemMessage;
    assert.doesNotMatch(second, /moeite is hier het doel/, "only once");
  } finally { p.cleanup(); }
});

// ---------- #37: honest words at rung 5 ----------
test("#37 a worked example (rung 5) is not 'solved with help': it says so, and asks to explain it back", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/L.cs": "" }, sessions: { [SID]: session({ maxRung: 5, rung: 5 }) } });
  try {
    check(p, "opdrachten/02-lijst", { Een: "Failed" }, 1);
    const out = check(p, "opdrachten/02-lijst", { Een: "Passed" }, 2).stdout;
    assert.match(out, /Uitgewerkt voorbeeld gebruikt: telt als niet gelukt\. Leg de uitwerking terug uit/);
    assert.doesNotMatch(out, /★ (Gelukt|Zelfstandig)/);
  } finally { p.cleanup(); }
});

test("#37 check.mjs also tells Claude to signal what went well", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/L.cs": "" }, sessions: { [SID]: session() } });
  try {
    check(p, "opdrachten/02-lijst", { Een: "Failed" }, 1);
    assert.match(check(p, "opdrachten/02-lijst", { Een: "Passed" }, 2).stdout, /\[leerharnas → Claude\] Signaleer eerst wat goed ging: .*, zonder hint\./);
  } finally { p.cleanup(); }
});

// ---------- #38: a conditional with its consequence is a why ----------
test("#38 'als …, dan/zou …' counts as a why; a bare statement still does not", () => {
  assert.ok(CAUSAL.test("als het veld public zou staan dan zou iedereen het saldo kunnen overschrijven"));
  assert.ok(CAUSAL.test("if the field were public, other code would overwrite the balance"));
  assert.ok(!CAUSAL.test("methodes binnen de klasse mogen bij een private veld"));
  assert.ok(!CAUSAL.test("als ik klaar ben. Dan ga ik verder"), "not across sentences");
});

// ---------- #45: how a change was decided, in the export ----------
test("#45 the export says how each level change was decided, where a skill starts and which task placed it", async () => {
  const s = fakeSkills();
  const l3 = s.skills.find((x) => x.id === "demo.l3");
  l3.history = [{ at: "2026-11-02", atIso: "2026-11-02T10:05:00.000Z", from: "L2", to: "L3", note: "plaatsing: hoogste trede 0 bij de eerste taak", placement: true, tid: "tp" },
    { at: "2026-11-03", atIso: "2026-11-03T10:00:00.000Z", from: "L3", to: "L3", note: "herhalingen starten" }];
  s.skills.find((x) => x.id === "demo.l2").history = [{ at: "2026-11-02", atIso: "2026-11-02T09:00:00.000Z", from: "L1", to: "L2", note: "ok", by: "learner", via: "voorstel" },
    { at: "2026-11-03", atIso: "2026-11-03T09:00:00.000Z", from: "L2", to: "L1", note: "automatisch: x", auto: true, by: "demotie-analist" },
    { at: "2026-11-04", atIso: "2026-11-04T09:00:00.000Z", from: "L1", to: "L2", note: "automatische verlaging teruggedraaid: klopte niet" }];
  s.skills.find((x) => x.id === "demo.l2.micro").history = [{ at: "2026-11-03", atIso: "2026-11-03T09:00:00.000Z", to: "L1", note: "aangemaakt door de demotie-analist", auto: true, by: "demotie-analist" }];
  const p = makeProject({ skills: s, events: [{ at: "2026-11-01T08:00:00.000Z", type: "setting", key: "x", value: "y" },
    { at: "2026-11-02T10:00:00.000Z", type: "task", tid: "tp", skill: "demo.l3", success: true, maxRung: 0, source: "check" },
    { at: "2026-11-02T10:05:00.000Z", type: "task-explained", tid: "tp", skill: "demo.l3", text: "uitleg" }] });
  try {
    const r = run(path.join(HARNESS, "export.mjs"), [p.root, "--out", path.join(p.root, "out.json"), "--allow-untranslated"]);
    assert.equal(r.code, 0, r.stderr);
    const j = JSON.parse(fs.readFileSync(path.join(p.root, "out.json"), "utf8"));
    const of = (id) => j.skills.find((x) => x.id === id);
    assert.deepEqual(of("demo.l3").history.map((h) => [h.kind, h.task]), [["placement", "tp"]], "L3 -> L3 is left out");
    assert.equal(of("demo.l3").windowSince, "2026-11-03T10:00:00.000Z", "the harness's own window still starts at that change");
    assert.equal(of("demo.l3").placementTask, null, "the placement is not the last change any more");
    assert.deepEqual(of("demo.l3").start, { at: "2026-11-01T08:00:00.000Z", open: true });
    assert.deepEqual(of("demo.l2").history.map((h) => h.kind), ["proposal", "analyst", "revert"]);
    assert.deepEqual(of("demo.l2").start.open, false);
    assert.deepEqual(of("demo.l2.micro").history.map((h) => [h.kind, h.auto]), [["analyst", true]]);
  } finally { p.cleanup(); }
});
