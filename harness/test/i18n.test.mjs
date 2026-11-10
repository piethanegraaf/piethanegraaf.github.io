// i18n: both languages have the same keys and placeholders, every key in the code exists,
// and the hooks speak the language of settings.language.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { HARNESS, makeProject, fakeSkills, decision } from "./helpers.mjs";

const load = (l) => JSON.parse(fs.readFileSync(path.join(HARNESS, "i18n", `${l}.json`), "utf8"));
const nl = load("nl");
const en = load("en");
const placeholders = (s) => [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

test("nl and en have exactly the same keys", () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(nl).sort());
});

test("each key has the same placeholders in both languages", () => {
  const diff = Object.keys(nl).filter((k) => placeholders(nl[k]).join() !== placeholders(en[k]).join());
  assert.deepEqual(diff, []);
});

test("every key used in the hooks exists", () => {
  const PREFIX = "(?:advice|check|cli|explain|guard|level|note|pg|review|rg|rung|ss)";
  const used = new Set();
  for (const f of fs.readdirSync(path.join(HARNESS, "hooks")).filter((f) => f.endsWith(".mjs"))) {
    const src = fs.readFileSync(path.join(HARNESS, "hooks", f), "utf8");
    for (const m of src.matchAll(new RegExp(`["'](${PREFIX}\\.[A-Za-z0-9.]+)["']`, "g"))) used.add(m[1]);
  }
  // Keys built at run time.
  for (const l of ["L0", "L1", "L2", "L3", "L4"]) used.add(`level.${l}`);
  for (const n of [0, 1, 2, 3, 4, 5]) used.add(`rung.${n}`);
  for (const l of ["L1", "L2", "L3"]) used.add(`guard.advice.${l}`);
  for (const r of ["pass", "shaky", "fail"]) used.add(`cli.review.${r}`);
  const missing = [...used].filter((k) => !(k in nl));
  assert.deepEqual(missing, []);
  assert.ok(used.size > 150, `only ${used.size} keys found: is the scan still working?`);
});

test("the English texts use the English markers", () => {
  assert.match(en["pg.pending"], /\[explain-ok <tid>\]/);
  assert.match(en["pg.rungMark"], /\[rung N\]/);
  assert.match(en["pg.end"], /<!-- session: \{sid\} -->/);
  assert.match(nl["pg.pending"], /\[uitleg-ok <tid>\]/);
});

// ---------- The hooks in English ----------
const enProject = (extra = {}) => makeProject({ skills: fakeSkills({ language: "en" }), files: { "opdrachten/02-lijst/Lijst.cs": "" }, ...extra });

test("en: the guard explains a denial in English", () => {
  const p = enProject();
  try {
    const r = p.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: p.abs("opdrachten/02-lijst/Lijst.cs"), content: "" } });
    assert.equal(decision(r), "deny");
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /^Learning harness: writing code in opdrachten\/02-lijst\/Lijst\.cs blocked\. .* is at L2 Guided/);
  } finally { p.cleanup(); }
});

test("en: the prompt gate answers in English, and still recognises Dutch", () => {
  const p = enProject();
  try {
    let r = p.hook("prompt-gate.mjs", { session_id: "s1", prompt: "I'm stuck on 02-lijst, how do I start?" });
    let ctx = r.json.hookSpecificOutput.additionalContext;
    assert.match(ctx, /^\[harness\] Skill: demo\.l2 \(L2 Guided\) · rung 1: Socratic question/);
    assert.match(ctx, /Rung 1 unlocked \(Socratic question\)\. Reason: first hint\./);
    r = p.hook("prompt-gate.mjs", { session_id: "s1", prompt: "alle tests zijn groen" });
    ctx = r.json.hookSpecificOutput.additionalContext;
    assert.match(ctx, /Task logged for demo\.l2 \[[a-z0-9]+\]: highest rung 1/);
    assert.match(ctx, /\[explain-ok <tid>\]/);
  } finally { p.cleanup(); }
});

test("nl: the prompt gate answers in Dutch, and recognises English", () => {
  const p = makeProject({ files: { "opdrachten/02-lijst/Lijst.cs": "" } });
  try {
    const r = p.hook("prompt-gate.mjs", { session_id: "s1", prompt: "I'm stuck on 02-lijst, how do I start?" });
    const ctx = r.json.hookSpecificOutput.additionalContext;
    assert.match(ctx, /^\[leerharnas\] Vaardigheid: demo\.l2 \(L2 Begeleid\) · trede 1: Socratische vraag/);
    assert.match(ctx, /Trede 1 ontgrendeld/);
  } finally { p.cleanup(); }
});

test("en: ending a session asks for the diary with the English marker", () => {
  const p = enProject();
  try {
    const r = p.hook("prompt-gate.mjs", { session_id: "s9", prompt: "I'm done for today" });
    assert.match(r.json.hookSpecificOutput.additionalContext, /Run the \/diary skill now\. Put the line <!-- session: s9 -->/);
    assert.equal(p.session("s9").endRequested, true);
  } finally { p.cleanup(); }
});

test("session start in English", () => {
  const p = enProject();
  try {
    const r = p.hook("session-start.mjs", { source: "startup" });
    assert.match(r.json.systemMessage, /^Learning harness: 5 skills · no reviews today/);
    assert.match(r.json.hookSpecificOutput.additionalContext, /LEARNING HARNESS ACTIVE/);
    assert.match(r.json.hookSpecificOutput.additionalContext, /\| demo\.l2 \| Begeleid \| L2 Guided \|/);
  } finally { p.cleanup(); }
});

// ---------- The Stop hook: markers in both languages ----------
const GOOD_EN = "It failed because the loop started at one instead of zero, so the first number was skipped every time.";

function stopProject(language, answer, explanation = GOOD_EN) {
  const p = makeProject({
    skills: fakeSkills({ language }),
    events: [{ at: "2026-11-10T12:00:00.000Z", type: "task", tid: "t1", skill: "demo.l2", success: true, maxRung: 0, source: "check" }],
    sessions: { s1: { startedAt: Date.now(), rung: 0, maxRung: 0, lastPrompt: explanation, lastPromptAt: 1 } },
  });
  const transcript = p.abs("transcript.jsonl");
  fs.writeFileSync(transcript, [
    { type: "user", message: { content: explanation } },
    { type: "assistant", message: { content: [{ type: "text", text: answer }] } },
  ].map((e) => JSON.stringify(e)).join("\n"));
  return { p, run: () => p.hook("reflect-gate.mjs", { session_id: "s1", transcript_path: transcript }) };
}

test("Stop hook: [explain-ok] and [rung N] are accepted next to the Dutch markers", () => {
  const { p, run } = stopProject("en", "Well explained. [explain-ok t1] I gave a hint before [rung 2].");
  try {
    run();
    assert.ok(p.events().some((e) => e.type === "task-explained" && e.tid === "t1"));
    assert.ok(p.events().some((e) => e.type === "rung-mark" && e.rung === 2));
  } finally { p.cleanup(); }
});

test("Stop hook: [uitleg-ok] still works with an English setting", () => {
  const { p, run } = stopProject("en", "Goed uitgelegd. [uitleg-ok t1]");
  try {
    run();
    assert.ok(p.events().some((e) => e.type === "task-explained" && e.tid === "t1"));
  } finally { p.cleanup(); }
});

test("Stop hook: a weak explanation is blocked with English reasons", () => {
  const { p, run } = stopProject("en", "[explain-ok t1]", "it works now");
  try {
    const r = run();
    assert.equal(r.json.decision, "block");
    assert.match(r.json.reason, /^Learning harness: you wrote \[explain-ok t1\].*too short.*no why/);
    assert.ok(!p.events().some((e) => e.type === "task-explained"));
  } finally { p.cleanup(); }
});

test("Stop hook: [explain-no] keeps the task open", () => {
  const { p, run } = stopProject("en", "Not yet. [explain-no t1] Why did it skip the first number?");
  try {
    run();
    assert.ok(p.events().some((e) => e.type === "explain-rejected" && e.by === "claude"));
    assert.ok(!p.events().some((e) => e.type === "task-explained"));
  } finally { p.cleanup(); }
});

test("Stop hook: the diary marker <!-- session: id --> counts", () => {
  const p = makeProject({ skills: fakeSkills({ language: "en" }), sessions: { s1: { startedAt: Date.now(), endRequested: true } } });
  try {
    let r = p.hook("reflect-gate.mjs", { session_id: "s1", transcript_path: "" });
    assert.equal(r.json.decision, "block");
    assert.match(r.json.reason, /no diary entry/);
    fs.writeFileSync(path.join(p.learn, "diary", "2026-11-10.md"), "## Session 1\n<!-- session: s1 -->\n");
    r = p.hook("reflect-gate.mjs", { session_id: "s1", transcript_path: "" });
    assert.equal(r.json, null);
  } finally { p.cleanup(); }
});

// ---------- The CLI in English ----------
test("en: skill.mjs correct accepts rung/void, and speaks English", () => {
  const p = makeProject({
    skills: fakeSkills({ language: "en" }),
    events: [{ at: "2026-11-10T12:00:00.000Z", type: "task", tid: "t1", skill: "demo.l2", success: true, maxRung: 0, source: "check" },
      { at: "2026-11-10T12:00:00.000Z", type: "task", tid: "t2", skill: "demo.l2", success: true, maxRung: 0, source: "check" }],
  });
  try {
    let r = p.cli("skill.mjs", ["correct", "t1", "rung", "3", "help was not logged"]);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /rung 0 -> 3/);
    r = p.cli("skill.mjs", ["correct", "t1", "rung", "1", "x"]);
    assert.match(r.stderr, /Corrections only go up/);
    r = p.cli("skill.mjs", ["correct", "t2", "void", "repair, not a task"]);
    assert.match(r.stdout, /voided/);
    assert.match(p.cli("skill.mjs", ["list"]).stdout, /L2 Guided/);
  } finally { p.cleanup(); }
});
