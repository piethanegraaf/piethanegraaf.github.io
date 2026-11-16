// Setup review of 16 November 2026, after the session on the Device scaffolding of the final assignment.
// #68 an unlocked rung that Claude did not give ([trede N] lower, also [trede 0]) is taken back;
// #69 several check questions about the same skill in one answer are all logged;
// #70 the confidence is read with loose words ("i am convidence level 4");
// #71 a program that only reads may name a hook script (grep on .claude/hooks/*.mjs), unless code runs in the line.
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { makeProject, decision } from "./helpers.mjs";
import { confidenceOf } from "../hooks/patterns.mjs";

const SID = "16111611-aaaa-bbbb-cccc-ddddeeeeffff";
const NO_TRANSCRIPT = (p) => path.join(p.root, "geen.jsonl");
const prompt = (p, text) => p.hook("prompt-gate.mjs", { session_id: SID, prompt: text });
const answer = (p, text) => p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: NO_TRANSCRIPT(p), last_assistant_message: text });

// ---------- #68 an unlock is the most Claude may give, not proof that it was given ----------

test("#68: an unlocked rung with [trede 0] in the answer is taken back", () => {
  const p = makeProject();
  try {
    prompt(p, "#demo.l2 ik zit vast, hint?");
    assert.equal(p.session(SID).rung, 1);
    assert.equal(p.session(SID).maxRung, 1, "prompt-gate still counts the unlock first");
    answer(p, "Eerst iets anders: wil je het inhaaldagboek doen?\n\n[trede 0]");
    const st = p.session(SID);
    assert.equal(st.rung, 0);
    assert.equal(st.maxRung, 0);
    assert.equal(st.unlocked, undefined);
    const ev = p.events().find((e) => e.type === "hint-unused");
    assert.deepEqual([ev.rung, ev.given], [1, 0]);
  } finally { p.cleanup(); }
});

test("#68: a lower [trede N] sets the task's rung to what was given; the next unlock starts from there", () => {
  const p = makeProject();
  try {
    prompt(p, "#demo.l2 ik zit vast, hint?");
    answer(p, "Een vraag: wat verwacht je dat er gebeurt?\n\n[trede 1]");
    assert.equal(p.session(SID).maxRung, 1);
    prompt(p, "#demo.l2 ik denk dat ik klaar ben");
    assert.equal(p.session(SID).rung, 2, "'ik denk' is an attempt: rung 2 unlocks");
    answer(p, "Vergelijk je diagram met de code: wat mist er?\n\n[trede 1]");
    const st = p.session(SID);
    assert.deepEqual([st.rung, st.maxRung], [1, 1]);
  } finally { p.cleanup(); }
});

test("#68: without a mark, or with the unlocked rung itself, the unlock stays given (L2 as before)", () => {
  const p = makeProject();
  try {
    prompt(p, "#demo.l2 ik zit vast, hint?");
    answer(p, "Wat zegt de foutmelding precies?");
    assert.equal(p.session(SID).maxRung, 1);
    assert.equal(p.events().some((e) => e.type === "hint-unused"), false);
    prompt(p, "#demo.l2 ik heb geprobeerd de property te hernoemen, werkt niet");
    answer(p, "Kijk in de docs bij properties.\n\n[trede 2]");
    assert.equal(p.session(SID).maxRung, 2);
  } finally { p.cleanup(); }
});

test("#68: an unlock of an earlier prompt is not judged against a later answer", () => {
  const p = makeProject();
  try {
    prompt(p, "#demo.l2 ik zit vast, hint?");
    prompt(p, "#demo.l2 ok, ik ga verder");
    answer(p, "Prima.\n\n[trede 0]");
    assert.equal(p.session(SID).maxRung, 1, "the first unlock had no answer of its own; it stays");
  } finally { p.cleanup(); }
});

// ---------- #69 check questions ----------

test("#69: three check questions about the same skill are three results, also when the Stop hook runs again", () => {
  const p = makeProject();
  try {
    prompt(p, "a it could create an instance b same for each child c only for child classes");
    const text = "A half\n[controlevraag demo.l3 half]\nB goed\n[controlevraag demo.l3 goed]\nC goed\n[controlevraag demo.l3 goed]";
    answer(p, text);
    answer(p, text);
    const results = p.events().filter((e) => e.type === "check-question").map((e) => e.result);
    assert.deepEqual(results, ["half", "right", "right"]);
  } finally { p.cleanup(); }
});

// ---------- #70 confidence ----------

test("#70: the confidence is read with a typo or 'level', a bare exercise number still is not", () => {
  assert.equal(confidenceOf("my goal is to implement the scafholding for the device and child classes, i am convidence level 4"), 4);
  assert.equal(confidenceOf("confidence 3"), 3);
  assert.equal(confidenceOf("ik ben vrij zeker, een 4"), 4);
  assert.equal(confidenceOf("niveau 2"), 2);
  assert.equal(confidenceOf("opdracht 3"), null);
  assert.equal(confidenceOf("zelfvertrouwen 2"), 2);
});

test("#70: the start logs that confidence after Claude asked (1–5)", () => {
  const p = makeProject();
  try {
    prompt(p, "I want to start with the Device class");
    answer(p, "How confident are you (1–5) that you can build it without help?");
    prompt(p, "my goal is the scafholding, i am convidence level 4");
    assert.deepEqual(p.events().filter((e) => e.type === "confidence").map((e) => e.value), [4]);
  } finally { p.cleanup(); }
});

// ---------- #71 reading a hook script ----------

test("#71: grep, cat or Select-String on a hook script is reading, not running it", () => {
  const p = makeProject();
  const bash = (command, tool = "Bash") => decision(p.hook("guard.mjs", { tool_name: tool, tool_input: { command }, cwd: p.root }));
  try {
    assert.equal(bash("grep -c export .claude/hooks/patterns.mjs"), "allow");
    assert.equal(bash("cd .claude/hooks; ls; grep -n -i confidence *.mjs lib/*.mjs 2>/dev/null | head -20"), "allow");
    assert.equal(bash("Select-String -Path .claude/hooks/guard.mjs -Pattern HOOK", "PowerShell"), "allow");
  } finally { p.cleanup(); }
});

test("#71: running a hook script stays refused, also through a reader in the same line", () => {
  const p = makeProject();
  const bash = (command) => decision(p.hook("guard.mjs", { tool_name: "Bash", tool_input: { command }, cwd: p.root }));
  try {
    assert.equal(bash("node .claude/hooks/prompt-gate.mjs"), "deny");
    assert.equal(bash("cat .claude/hooks/reflect-gate.mjs | node --input-type=module"), "deny");
    assert.equal(bash("grep -l x .claude/hooks/lib.mjs | xargs node"), "deny");
    assert.equal(bash("sed -n 1,5p .claude/hooks/lib.mjs"), "deny", "sed can run commands; not a reader");
    assert.equal(bash("cat x > .claude/hooks/lib.mjs"), "deny", "a write is still a write");
    assert.equal(bash("node .claude/hooks/skill.mjs status"), "allow");
  } finally { p.cleanup(); }
});
