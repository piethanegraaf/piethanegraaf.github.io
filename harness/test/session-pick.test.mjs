// pickSession: a "!" command belongs to the session the learner works in, also when two sessions
// are open in one project (setup review 3.6: practising here, harness work in another session).
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeProject } from "./helpers.mjs";

const MIN = 60000;

test("done goes to the active session that works on this family, not to the most recently saved one", () => {
  const now = Date.now();
  const p = makeProject({ sessions: {
    oefen: { startedAt: now - 30 * MIN, lastActiveAt: now - 3 * MIN, activeMs: 20 * MIN, activeSkill: "demo.l2", maxRung: 2 },
    harnas: { startedAt: now - 10 * MIN, lastActiveAt: now - MIN, activeMs: 9 * MIN, activeSkill: null, maxRung: 0 },
  } });
  try {
    const r = p.cli("skill.mjs", ["done", "demo.l2", "lijst gefixt"]);
    assert.equal(r.code, 0, r.stderr);
    const task = p.events().find((e) => e.type === "task");
    assert.deepEqual([task.session, task.maxRung], ["oefen", 2]);
    assert.equal(p.session("oefen").folderSkill, "demo.l2");
  } finally { p.cleanup(); }
});

test("without a matching family, the session where the learner was active most recently", () => {
  const now = Date.now();
  const p = makeProject({ sessions: {
    a: { startedAt: now - 30 * MIN, lastActiveAt: now - 8 * MIN, activeSkill: "demo.l3" },
    b: { startedAt: now - 10 * MIN, lastActiveAt: now - 2 * MIN, activeSkill: "demo.l4" },
  } });
  try {
    p.cli("skill.mjs", ["done", "demo.l2", "x"]);
    assert.equal(p.events().find((e) => e.type === "task").session, "b");
  } finally { p.cleanup(); }
});
