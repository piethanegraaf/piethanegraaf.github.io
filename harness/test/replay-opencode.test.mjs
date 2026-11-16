// skill.mjs replay --opencode (opencode plan, parity row 23): the same conversation as an opencode session export
// recovers the same explanations as the Claude Code transcript in replay.test.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject } from "./helpers.mjs";

const at = "2026-11-10T12:00:00.000Z";
const task = (tid) => ({ at, type: "task", tid, skill: "demo.l2", success: true, maxRung: 1, source: "check" });
const GOOD = "De test is groen omdat de methode nu de som van alle cijfers teruggeeft in plaats van alleen het eerste cijfer.";
let n = 0;
const user = (text) => ({ type: "user", id: `msg_${++n}`, text, time: { created: 1_700_000_000_000 + n } });
const assistant = (text) => ({ type: "assistant", id: `msg_${++n}`, agent: "build", time: { created: 1_700_000_000_000 + n }, content: [{ type: "text", text }] });
const synthetic = (text) => ({ type: "synthetic", id: `msg_${++n}`, text, time: { created: 1_700_000_000_000 + n } });

function project(shape) {
  const p = makeProject({ events: [task("t1"), task("t2"), task("t3"), { at, type: "task-explained", tid: "t3", skill: "demo.l2", text: "x" }] });
  const messages = [
    user("ik heb de test groen"), assistant("Leg eens uit waarom het werkt?"),
    user(GOOD), synthetic("[leerharnas] status"), assistant("Precies. [uitleg-ok t1]"),
    user("het werkt gewoon"), assistant("Oké. [uitleg-ok t2]"),
    assistant("[uitleg-ok t3]"),
  ];
  const file = path.join(p.root, "ses_1b8a483e.json");
  fs.writeFileSync(file, shape === "object" ? JSON.stringify({ info: { id: "ses_1b8a483e" }, messages }) : JSON.stringify(messages));
  return { p, file };
}

for (const shape of ["array", "object"]) {
  test(`replay --opencode (${shape}) logs only what passes both keys, like the Claude Code transcript`, () => {
    const { p, file } = project(shape);
    try {
      const r = p.cli("skill.mjs", ["replay", "--opencode", file]);
      assert.equal(r.code, 0, r.stderr);
      const rec = p.events().filter((e) => e.type === "task-explained" && e.source === "replay");
      assert.deepEqual(rec.map((e) => [e.tid, e.session]), [["t1", "ses_1b8a483e"]]);
    } finally { p.cleanup(); }
  });
}
