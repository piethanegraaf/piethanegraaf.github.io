// Setup review of 17 November 2026, after the sessions on the cost functions of the final assignment (16 Nov evening, 17 Nov).
// #72 "af:" guesses the skill (the words after "af:", then the newest changed file) and the learner always confirms it;
// #73 the confidence asked in /diary is the confidence AFTER the session, not the one of the start;
// #74 the Stop hook waits while the diary questions are open;
// #75 a catch-up offer only counts as made in a session where the learner wrote something;
// #76 the start tells the learner to give a reason with "because";
// #77 the harness shows the catch-up offer itself and reads the answer;
// #79 the Stop hook warns when the learner answered the check questions and Claude's feedback has no marks;
// #80 a hint of rung 2+ without an id that is about a microskill gets a warning; the end prompt lists the slips;
// #81 the words: finished (rung 0-5), succeeded (rung 0-2), independent (rung 0).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { makeProject, fakeSkills } from "./helpers.mjs";
import { catchUpAnswer } from "../hooks/patterns.mjs";

const SID = "17111711-aaaa-bbbb-cccc-ddddeeeeffff";
const NO_TRANSCRIPT = (p) => path.join(p.root, "geen.jsonl");
const ctxOf = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";
const prompt = (p, text, sid = SID) => p.hook("prompt-gate.mjs", { session_id: sid, prompt: text });
const answer = (p, text, sid = SID) => p.hook("reflect-gate.mjs", { session_id: sid, transcript_path: NO_TRANSCRIPT(p), last_assistant_message: text });
const slash = (x) => x.split(path.sep).join("/");

// The graded project itself, with uml.klassendiagram (a Mermaid classDiagram links a file to it by content).
function gradedProject(sessions = {}) {
  const data = fakeSkills();
  data.skills.push({ id: "uml.klassendiagram", title: "Klassendiagram", level: "L2", paths: [], placement: "done" });
  const p = makeProject({ skills: data, sessions });
  const s = p.skills();
  s.settings.graded = { paths: [slash(p.root)], aiLevel: 1, maxRung: 4 };
  fs.writeFileSync(path.join(p.learn, "skills.json"), JSON.stringify(s, null, 2));
  return p;
}
const touchAt = (file, ms) => { const d = new Date(ms); fs.utimesSync(file, d, d); };

// ---------- #72 af: guesses, the learner confirms ----------

test("#72: af: without a known skill takes the newest changed file; a C# file without a skill is no reason to take an older diagram", () => {
  const p = gradedProject({ [SID]: { startedAt: Date.now(), graded: true } });
  try {
    fs.mkdirSync(p.abs("Makerlab/Arc42"), { recursive: true });
    fs.writeFileSync(p.abs("Makerlab/Arc42/Building_Block_View.md"), "```mermaid\nclassDiagram\n  Device <|-- LaserCutter\n```\n");
    fs.writeFileSync(p.abs("Makerlab/Program.cs"), "class LaserCutter {}\n");
    touchAt(p.abs("Makerlab/Arc42/Building_Block_View.md"), Date.now() + 1000);
    touchAt(p.abs("Makerlab/Program.cs"), Date.now() + 5000);
    const r = prompt(p, "af: lasersnijder kostenfunctie");
    assert.match(ctxOf(r), /weet niet bij welke vaardigheid/);
    assert.equal(p.events().some((e) => e.type === "task" || e.type === "af-asked"), false, "no guess, nothing logged (17 Nov: it became uml.klassendiagram)");
  } finally { p.cleanup(); }
});

test("#72: the words after af: decide the guess; the learner confirms with yes, and the task is logged then", () => {
  const p = makeProject({ sessions: { [SID]: { activeSkill: "demo.l3", startedAt: Date.now() } } });
  try {
    const r = prompt(p, "af: het deelpatroon in de lijst");
    assert.match(r.json.systemMessage, /"het deelpatroon in de lijst" loggen als taak van demo\.l2\.micro/);
    assert.match(ctxOf(r), /Er is nog niets gelogd/);
    assert.equal(p.events().some((e) => e.type === "task"), false);
    prompt(p, "ja");
    const task = p.events().find((e) => e.type === "task");
    assert.deepEqual([task.skill, task.source, task.what], ["demo.l2.micro", "af", "het deelpatroon in de lijst"]);
  } finally { p.cleanup(); }
});

test("#72: another skill with #id in the answer; 'no' or something else logs nothing; #id in the af: message logs right away", () => {
  const p = makeProject({ sessions: { [SID]: { activeSkill: "demo.l2", startedAt: Date.now() } } });
  try {
    prompt(p, "af: de methode Toevoegen");
    prompt(p, "nee, #demo.l3");
    assert.equal(p.events().filter((e) => e.type === "task").pop().skill, "demo.l3");
    prompt(p, "af: de klasse Auto");
    const r = prompt(p, "nee");
    assert.match(ctxOf(r), /bevestigde de vaardigheid voor "de klasse Auto" niet/);
    assert.equal(p.events().filter((e) => e.type === "task").length, 1);
    prompt(p, "af: de property Kleur #demo.l1");
    const last = p.events().filter((e) => e.type === "task").pop();
    assert.deepEqual([last.skill, last.what], ["demo.l1", "de property Kleur"]);
  } finally { p.cleanup(); }
});

// ---------- #73 confidence after ----------

test("#73: the (1–5) of /diary is logged as confidence-after, the one of the start stays the confidence before", () => {
  const p = makeProject();
  try {
    prompt(p, "ik wil de kostenfunctie maken");
    answer(p, "Hoe zeker ben je dat je het zonder hulp af krijgt (1-5)? Antwoord met alleen een getal.");
    prompt(p, "4");
    prompt(p, "ik wil stoppen");
    answer(p, "Controlevragen … 3. Hoe zeker ben je nu (1–5), en wat is je volgende stap?");
    prompt(p, "1 int gedeeld door int 2 waarom 1/10 0 was 3 level 2");
    assert.deepEqual(p.events().filter((e) => e.type === "confidence").map((e) => e.value), [4]);
    assert.deepEqual(p.events().filter((e) => e.type === "confidence-after").map((e) => e.value), [2]);
  } finally { p.cleanup(); }
});

test("#73: the start asks for one number on its own line", () => {
  const p = makeProject();
  try {
    const r = p.hook("session-start.mjs", { source: "startup", session_id: SID });
    assert.match(ctxOf(r), /Antwoord met alleen een getal/);
  } finally { p.cleanup(); }
});

// ---------- #74 the Stop hook waits for the diary answers ----------

test("#74: the answer with the diary questions is not blocked; the next answer without an entry is", () => {
  const p = makeProject();
  try {
    prompt(p, "ik wil stoppen");
    let r = answer(p, "Controlevragen: A … B … Reflectie: 3. Hoe zeker ben je nu (1–5)?");
    assert.notEqual(r.json?.decision, "block", "the questions wait for the learner");
    assert.ok(p.events().some((e) => e.type === "diary-asked"));
    prompt(p, "A omdat het int is B ... 3 vier");
    r = answer(p, "Dank je, dat klopt. [controlevraag demo.l2 goed]");
    assert.equal(r.json?.decision, "block");
    assert.match(r.json.reason, /dagboekentry/);
  } finally { p.cleanup(); }
});

// ---------- #75 / #77 catch-up offer ----------

test("#75: a session without a prompt does not use up the catch-up offer", () => {
  const OLD = "11111111-2222-3333-4444-555555555555";
  const p = makeProject({ sessions: { [OLD]: { startedAt: Date.now() - 3 * 3600000, lastActiveAt: Date.now() - 2 * 3600000, activeMs: 25 * 60000, endedAt: Date.now() - 2 * 3600000 } } });
  try {
    const a = p.hook("session-start.mjs", { source: "startup", session_id: "leeg-1" });
    assert.match(a.json.systemMessage, /Sessie 11111111 .* sloot zonder dagboek/);
    const b = p.hook("session-start.mjs", { source: "startup", session_id: "nieuw-2" });
    assert.match(b.json.systemMessage, /Sessie 11111111/, "leeg-1 had no prompt: the offer comes again");
    prompt(p, "ik wil verder", "nieuw-2");
    const c = p.hook("session-start.mjs", { source: "startup", session_id: "nieuw-3" });
    assert.doesNotMatch(c.json.systemMessage, /Sessie 11111111/, "answered in nieuw-2: it does not come back");
  } finally { p.cleanup(); }
});

test("#77: the harness shows the offer, shows it again with the first answer, and reads yes or no", () => {
  const OLD = "11111111-2222-3333-4444-555555555555";
  const old = { startedAt: Date.now() - 3 * 3600000, lastActiveAt: Date.now() - 2 * 3600000, activeMs: 25 * 60000, endedAt: Date.now() - 2 * 3600000 };
  const p = makeProject({ sessions: { [OLD]: old } });
  try {
    const s = p.hook("session-start.mjs", { source: "startup", session_id: SID });
    assert.match(s.json.systemMessage, /typ "ja, inhalen"/);
    let r = prompt(p, "ik wil verder met de opdracht, geef geen hints");
    assert.match(r.json.systemMessage, /Sessie 11111111 .* inhaaldagboek/, "not answered: shown once more");
    r = prompt(p, "ja, inhalen");
    assert.match(ctxOf(r), /wil het inhaaldagboek van sessie 11111111/);
    assert.ok(p.events().some((e) => e.type === "catchup-accepted" && e.of === OLD));

    const S2 = "22222222-aaaa-bbbb-cccc-ddddeeeeffff", OLD2 = "33333333-2222-3333-4444-555555555555";
    fs.writeFileSync(path.join(p.state, `session-${OLD2}.json`), JSON.stringify(old));
    p.hook("session-start.mjs", { source: "startup", session_id: S2 });
    r = prompt(p, "nee", S2);
    assert.match(ctxOf(r), /geen inhaaldagboek voor sessie 33333333/);
    assert.ok(p.events().some((e) => e.type === "catchup-declined" && e.of === OLD2));
  } finally { p.cleanup(); }
});

test("#77: a bare yes only counts as the very first message", () => {
  assert.deepEqual(catchUpAnswer("ja", { first: true }), { answer: "yes" });
  assert.equal(catchUpAnswer("ja", { first: false }), null);
  assert.deepEqual(catchUpAnswer("yes, catch up"), { answer: "yes" });
  assert.deepEqual(catchUpAnswer("no"), { answer: "no" });
});

// ---------- #76 because ----------

test("#76: the start tells the learner to give a reason with because", () => {
  const p = makeProject();
  try {
    const r = p.hook("session-start.mjs", { source: "startup", session_id: SID });
    assert.match(r.json.systemMessage, /"omdat"/);
  } finally { p.cleanup(); }
});

// ---------- #79 check marks ----------

test("#79: answered check questions without marks: one block; with marks no block", () => {
  const p = makeProject();
  try {
    prompt(p, "ik wil stoppen");
    answer(p, "A waarom private? B … 3. Hoe zeker ben je nu (1–5)?");
    prompt(p, "A omdat het een lokale variabele is B weet ik niet 3 drie");
    let r = answer(p, "A klopt. B: het principe is …");
    assert.equal(r.json?.decision, "block");
    assert.match(r.json.reason, /\[controlevraag <id> goed\|half\|open\]/);
    r = answer(p, "A klopt. [controlevraag demo.l2 goed] B open. [controlevraag demo.l2 open]");
    assert.doesNotMatch(r.json?.reason ?? "", /controlevraag <id>/);
    assert.equal(p.events().filter((e) => e.type === "check-question").length, 2);
  } finally { p.cleanup(); }
});

// ---------- #80 the id of a concept ----------

test("#80: a hint of rung 2 about a microskill of another family without an id: a warning; with the id: concept-help", () => {
  const data = fakeSkills();
  data.skills.push({ id: "demo.l3.veld", parent: "demo.l3", title: "Veld of lokale variabele", level: "L2", keywords: ["lokale variabele", "access modifier", "veld"], placement: "done" });
  const p = makeProject({ skills: data, sessions: { [SID]: { activeSkill: "demo.l2", folderSkill: "demo.l2", startedAt: Date.now() } } });
  try {
    prompt(p, "het compileert niet, hint?");
    let r = answer(p, "Een access modifier zoals private hoort bij een veld, niet bij een lokale variabele. [trede 2]");
    assert.equal(r.json?.decision, "block");
    assert.match(r.json.reason, /\[trede 2 #demo\.l3\.veld\]/);
    r = answer(p, "Klopt, het ging over dat concept. [trede 2 #demo.l3.veld]");
    assert.notEqual(r.json?.decision, "block", "once per microskill");
    assert.ok(p.events().some((e) => e.type === "concept-help" && e.skill === "demo.l3.veld"));
    r = prompt(p, "ik wil stoppen");
    assert.match(ctxOf(r), /uitgleed \(concept-help\): demo\.l3\.veld/);
  } finally { p.cleanup(); }
});

// ---------- #81 words ----------

test("#81: rung 3 is finished, not succeeded; rung 1 succeeded; rung 0 independent", () => {
  const p = makeProject({ sessions: { [SID]: { activeSkill: "demo.l2", startedAt: Date.now(), maxRung: 3, rung: 3 } } });
  try {
    const r = prompt(p, "af: de kostenfunctie #demo.l2");
    assert.match(ctxOf(r), /afgerond, maar met veel hulp: telt als niet gelukt/);
    const en = JSON.parse(fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..", "i18n", "en.json"), "utf8"));
    for (const [k, v] of Object.entries(en)) assert.doesNotMatch(v, /\bsolved\b/i, `${k} still says solved`);
    assert.match(en["check.praise.finished"], /^Finished with help up to rung \{rung\}/);
  } finally { p.cleanup(); }
});
