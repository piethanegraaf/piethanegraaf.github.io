// The dashboard's "next level" (site-src/dashboard/next-step.js) agrees with the harness: it shows a
// level as reached exactly when the harness proposes it, on the same tasks (since the last level change).
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { makeProject } from "./helpers.mjs";

const PROBE = path.join(path.dirname(fileURLToPath(import.meta.url)), "next-step-probe.mjs");
const sk = (id, level, extra = {}) => ({ id, title: id, level, placement: "done", paths: [`opdrachten/${id}/**`], ...extra });

// Tasks (explained unless said otherwise) at a given moment, with a rung.
let n = 0;
function tasks(skill, list) {
  const ev = [];
  for (const [at, maxRung, opts = {}] of list) {
    const tid = `t${++n}`;
    ev.push({ at, type: "task", tid, skill, success: maxRung < 5, maxRung, source: "check" });
    if (opts.explained !== false) ev.push({ at, type: "task-explained", tid, skill, text: "uitleg" });
  }
  return ev;
}

function probe(skills, events) {
  const p = makeProject({ skills: { settings: { targetSuccess: 0.85, language: "nl" }, skills }, events });
  try {
    const r = spawnSync(process.execPath, [PROBE, p.root], { encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr);
    return Object.fromEntries(JSON.parse(r.stdout).map((x) => [x.id, x]));
  } finally { p.cleanup(); }
}

// The dashboard says "reached" exactly when the harness proposes the step up; for L3 the harness
// says "transfer" when only the transfer task is missing.
function agree(row) {
  if (row.step.kind === "placement" || row.step.kind === "maintain") return assert.equal(row.harness, null, row.id);
  assert.equal(row.step.met, row.harness === "up", `${row.id}: dashboard ${row.step.met}, harness ${row.harness}`);
  if (row.level === "L3") {
    assert.equal(row.step.transferNext, row.harness === "transfer", `${row.id}: transfer`);
  }
}

const day = (d, h = 10) => `2026-11-0${d}T${String(h).padStart(2, "0")}:00:00.000Z`;

test("L2: the 85% only counts with at least 5 tasks and half of them with hint 0-1", () => {
  const rows = probe(
    [sk("a.vier", "L2"), sk("a.zes", "L2"), sk("a.zeven", "L2"), sk("a.trede2", "L2")],
    [
      ...tasks("a.vier", [[day(1), 0], [day(1, 11), 1], [day(2), 0], [day(2, 11), 0]]),                       // 4/4: too few
      ...tasks("a.zes", [[day(1), 0], [day(1, 11), 3], [day(2), 0], [day(2, 11), 1], [day(3), 0], [day(3, 11), 0]]), // 5/6 = 83%
      ...tasks("a.zeven", [[day(1), 0], [day(1, 11), 3], [day(2), 0], [day(2, 11), 1], [day(3), 0], [day(3, 11), 0], [day(4), 1]]), // 6/7
      ...tasks("a.trede2", [[day(1), 2], [day(1, 11), 2], [day(2), 2], [day(2, 11), 2], [day(3), 2]]),         // 5/5, none with hint 0-1
    ],
  );
  for (const r of Object.values(rows)) agree(r);
  assert.deepEqual([rows["a.vier"].step.met, rows["a.zes"].step.met, rows["a.zeven"].step.met, rows["a.trede2"].step.met], [false, false, true, false]);
  assert.equal(rows["a.vier"].step.more, 1, "one more good task makes 5/5");
  assert.equal(rows["a.zes"].step.more, 1, "one more good task makes 6/7 = 86%");
  assert.equal(rows["a.trede2"].step.rate, true);
  assert.equal(rows["a.trede2"].step.half, false);
});

test("only the tasks since the last level change count, also for an old history entry with only a day", () => {
  const change = "2026-11-05T12:00:00.000Z";
  const localDay = new Date(change).toLocaleDateString("sv-SE");
  const rows = probe(
    [sk("b.oud", "L2", { history: [{ at: localDay, from: "L1", to: "L2", note: "x" }] })],
    [
      ...tasks("b.oud", [["2026-11-05T08:00:00.000Z", 0], ["2026-11-05T09:00:00.000Z", 0], ["2026-11-05T10:00:00.000Z", 0]]), // same day, before
      { at: change, type: "level", skill: "b.oud", from: "L1", to: "L2" },
      ...tasks("b.oud", [["2026-11-05T14:00:00.000Z", 0], ["2026-11-06T10:00:00.000Z", 0]]),
    ],
  );
  agree(rows["b.oud"]);
  assert.equal(rows["b.oud"].step.n, 2, "the three tasks before the change on that day do not count");
  assert.equal(rows["b.oud"].step.since, change);
});

test("L3: the transfer task is one of the three times without a hint, and its day a day (#36 b)", () => {
  const rows = probe(
    [sk("c.zonder", "L3"), sk("c.met", "L3"), sk("c.eendag", "L3"), sk("c.eendagmet", "L3"), sk("c.een", "L3")],
    [
      ...tasks("c.zonder", [[day(1), 0], [day(2), 0], [day(2, 11), 0]]),
      ...tasks("c.met", [[day(1), 0], [day(2), 0]]), { at: day(3), type: "transfer-passed", skill: "c.met" },
      ...tasks("c.eendag", [[day(1), 0], [day(1, 11), 0]]),
      ...tasks("c.eendagmet", [[day(1), 0], [day(1, 11), 0]]), { at: day(1, 12), type: "transfer-passed", skill: "c.eendagmet" },
      ...tasks("c.een", [[day(1), 0]]),
    ],
  );
  for (const r of Object.values(rows)) agree(r);
  assert.deepEqual(["c.zonder", "c.met", "c.eendag", "c.eendagmet", "c.een"].map((id) => rows[id].harness), ["transfer", "up", "transfer", null, null]);
  assert.deepEqual([rows["c.met"].step.have, rows["c.met"].step.days], [3, 3]);
  assert.equal(rows["c.eendagmet"].step.days, 1, "the transfer on the same day: still one day");
});

test("the task that placed a skill counts after the placement (#36 a)", () => {
  const placedAt = "2026-11-01T10:05:00.000Z";
  const rows = probe(
    [sk("p.geplaatst", "L3", { history: [{ at: "2026-11-01", atIso: placedAt, from: "L2", to: "L3", note: "plaatsing", placement: true, tid: "tp" }] })],
    [
      { at: day(1), type: "task", tid: "tp", skill: "p.geplaatst", success: true, maxRung: 0, source: "check" },
      { at: placedAt, type: "task-explained", tid: "tp", skill: "p.geplaatst", text: "uitleg" },
      { at: placedAt, type: "placement", skill: "p.geplaatst", rung: 0, from: "L2", to: "L3", tid: "tp" },
      ...tasks("p.geplaatst", [[day(2), 0]]),
    ],
  );
  agree(rows["p.geplaatst"]);
  assert.equal(rows["p.geplaatst"].step.solo, 2, "the placement task and one more");
  assert.equal(rows["p.geplaatst"].harness, "transfer");
});

test("L0, L1, a microskill, an open placement and L4", () => {
  const rows = probe(
    [sk("d.nul", "L0"), sk("d.een", "L1"), sk("d.twee", "L2"), { id: "d.twee.micro", parent: "d.twee", title: "m", level: "L1", placement: "done" },
      { id: "d.nieuw", title: "n", level: "L2", paths: ["opdrachten/nieuw/**"] }, sk("d.vier", "L4")],
    [
      ...tasks("d.nul", [[day(1), 2], [day(2), 4]]),
      ...tasks("d.een", [[day(1), 1], [day(2), 0], [day(3), 2]]),
      ...tasks("d.twee.micro", [[day(1), 0], [day(2), 1], [day(3), 0]]),
      ...tasks("d.vier", [[day(1), 0]]),
    ],
  );
  for (const r of Object.values(rows)) agree(r);
  assert.equal(rows["d.nul"].step.met, true);
  assert.deepEqual([rows["d.een"].step.have, rows["d.een"].step.met], [2, false]);
  assert.equal(rows["d.twee.micro"].step.met, true);
  assert.equal(rows["d.nieuw"].step.kind, "placement");
  assert.equal(rows["d.vier"].step.kind, "maintain");
});
