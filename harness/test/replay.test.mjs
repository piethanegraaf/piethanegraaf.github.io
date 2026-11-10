// skill.mjs replay: recover explanations that were approved in the chat but missed by the Stop hook
// (setup review §5). The same two keys: Claude's marker AND checkExplanation() on the learner's message.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject } from "./helpers.mjs";

const at = "2026-11-10T12:00:00.000Z";
const task = (tid) => ({ at, type: "task", tid, skill: "demo.l2", success: true, maxRung: 1, source: "check" });
const user = (text) => ({ type: "user", message: { role: "user", content: text } });
const assistant = (text) => ({ type: "assistant", message: { role: "assistant", content: [{ type: "text", text }] } });
const GOOD = "De test is groen omdat de methode nu de som van alle cijfers teruggeeft in plaats van alleen het eerste cijfer.";

function project() {
  const p = makeProject({ events: [task("t1"), task("t2"), task("t3"), { at, type: "task-explained", tid: "t3", skill: "demo.l2", text: "x" }] });
  const file = path.join(p.root, "1b8a483e-sessie.jsonl");
  fs.writeFileSync(file, [
    user("ik heb de test groen"), assistant("Leg eens uit waarom het werkt?"),
    user(GOOD), assistant("Precies. [uitleg-ok t1]"),
    user("het werkt gewoon"), assistant("Oké. [uitleg-ok t2]"),
    assistant("[uitleg-ok t3]"),
  ].map((e) => JSON.stringify(e)).join("\n") + "\n");
  return { p, file };
}

test("replay --dry-run shows what would be recovered and writes nothing", () => {
  const { p, file } = project();
  try {
    const r = p.cli("skill.mjs", ["replay", file, "--dry-run"]);
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /\[t1\].*zou gelogd worden/);
    assert.match(r.stdout, /\[t2\].*harde check niet/);
    assert.match(r.stdout, /\[t3\] overgeslagen/);
    assert.equal(p.events().filter((e) => e.type === "task-explained").length, 1, "only the existing one");
  } finally { p.cleanup(); }
});

test("replay logs only what passes both keys, with source replay and the session of the transcript", () => {
  const { p, file } = project();
  try {
    const r = p.cli("skill.mjs", ["replay", file]);
    assert.equal(r.code, 0, r.stderr);
    const rec = p.events().filter((e) => e.type === "task-explained" && e.source === "replay");
    assert.deepEqual(rec.map((e) => [e.tid, e.session]), [["t1", "1b8a483e-sessie"]]);
    assert.match(rec[0].text, /in plaats van alleen het eerste cijfer/);
    // Running it again recovers nothing new.
    p.cli("skill.mjs", ["replay", file]);
    assert.equal(p.events().filter((e) => e.type === "task-explained" && e.source === "replay").length, 1);
  } finally { p.cleanup(); }
});

test("replay without a file explains how to use it", () => {
  const { p } = project();
  try {
    const r = p.cli("skill.mjs", ["replay"]);
    assert.equal(r.code, 1);
    assert.match(r.stderr, /replay <transcript\.jsonl>/);
  } finally { p.cleanup(); }
});
