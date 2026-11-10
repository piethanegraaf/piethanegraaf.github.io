// reflect-gate.mjs (Stop hook): markers in the last answer, also when the transcript is not
// complete yet (setup review 3.1), and the explanation checked against the learner's own message.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject } from "./helpers.mjs";

const SID = "stop-sessie";
const at = "2026-11-10T12:00:00.000Z";
const EXPLANATION = "De lus stopt nu op tijd omdat ik de voorwaarde heb aangepast naar kleiner dan de lengte van de lijst.";

const user = (text, uuid = "u1") => ({ type: "user", uuid, message: { role: "user", content: text } });
const assistant = (text) => ({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text }] } });
const toolUse = () => ({ type: "assistant", message: { role: "assistant", content: [{ type: "tool_use", id: "x", name: "Read", input: {} }] } });

function project({ session = { activeSkill: "demo.l2", rung: 0, maxRung: 0, startedAt: Date.now() }, transcript = [] } = {}) {
  const p = makeProject({
    events: [{ at, type: "task", tid: "t1", skill: "demo.l2", success: true, maxRung: 1, source: "check" }],
    sessions: session ? { [SID]: session } : {},
  });
  const file = path.join(p.root, "transcript.jsonl");
  fs.writeFileSync(file, transcript.map((e) => JSON.stringify(e)).join("\n") + "\n");
  const stop = (last) => p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, ...(last !== undefined ? { last_assistant_message: last } : {}) });
  return { p, stop };
}
const explained = (p) => p.events().filter((e) => e.type === "task-explained");

test("a marker that is only in last_assistant_message counts (the transcript was not flushed yet)", () => {
  const { p, stop } = project({ transcript: [user(EXPLANATION)] });
  try {
    const r = stop("Klopt, dat is precies het waarom. [uitleg-ok t1] [trede 2]");
    assert.equal(r.code, 0, r.stderr);
    assert.equal(explained(p).length, 1);
    assert.equal(explained(p)[0].tid, "t1");
    assert.equal(p.events().filter((e) => e.type === "rung-mark").length, 1);
  } finally { p.cleanup(); }
});

test("a marker in a text block before a tool call counts, also when the last message has none", () => {
  const { p, stop } = project({ transcript: [user(EXPLANATION), assistant("Helder uitgelegd. [uitleg-ok t1]"), toolUse()] });
  try {
    stop("Ik heb het bestand bekeken.");
    assert.equal(explained(p).length, 1);
  } finally { p.cleanup(); }
});

test("the same marker in the transcript and in last_assistant_message gives one event", () => {
  const { p, stop } = project({ transcript: [user(EXPLANATION), assistant("Goed. [uitleg-ok t1] [trede 2]")] });
  try {
    stop("Goed. [uitleg-ok t1] [trede 2]");
    stop("Goed. [uitleg-ok t1] [trede 2]"); // the hook can run twice for one answer
    assert.equal(explained(p).length, 1);
    assert.equal(p.events().filter((e) => e.type === "rung-mark").length, 1);
  } finally { p.cleanup(); }
});

test("the explanation is checked against the learner's message in the transcript, not an older prompt", () => {
  // st.lastPrompt is an old, short prompt ("!" commands skip prompt-gate, setup review 3.6).
  const { p, stop } = project({
    session: { activeSkill: "demo.l2", rung: 0, maxRung: 0, startedAt: Date.now(), lastPrompt: "ok", lastPromptAt: 1 },
    transcript: [user("ok", "u0"), assistant("Leg eens uit?"), user(EXPLANATION, "u2")],
  });
  try {
    stop("[uitleg-ok t1]");
    assert.equal(explained(p).length, 1);
    assert.match(explained(p)[0].text, /omdat ik de voorwaarde/);
  } finally { p.cleanup(); }
});

test("a session without a learner prompt gets no session file", () => {
  const { p, stop } = project({ session: null, transcript: [assistant("Hallo. [trede 1]")] });
  try {
    const r = stop("Hallo. [trede 1]");
    assert.equal(r.code, 0);
    assert.equal(fs.existsSync(path.join(p.state, `session-${SID}.json`)), false);
    assert.equal(p.events().filter((e) => e.type === "rung-mark").length, 0);
  } finally { p.cleanup(); }
});

test("a rung belongs to the folder's family, not to a skill guessed from a keyword", () => {
  const { p, stop } = project({ session: { activeSkill: "demo.l3", folderSkill: "demo.l2", rung: 0, maxRung: 0, startedAt: Date.now() }, transcript: [user("hoe nu?")] });
  try {
    stop("Kijk eens naar de voorwaarde. [trede 1]");
    assert.equal(p.events().find((e) => e.type === "rung-mark").skill, "demo.l2");
  } finally { p.cleanup(); }
});
