// Since the last dashboard export: export.mjs writes .learning/state/last-export.json, and the session
// start and `skill.mjs since-export` say in one line what is new since then.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { HARNESS, makeProject, fakeSkills, run } from "./helpers.mjs";

const EXPORT = path.join(HARNESS, "export.mjs");
const SID = "s-since";

const task = (tid, at = "2026-11-10T10:00:00.000Z") => ({ at, type: "task", tid, skill: "demo.l2", success: true, maxRung: 0, source: "check", session: SID });
const diary = (n) => `# Dagboek\n\n${Array.from({ length: n }, (_, i) => `## Sessie ${i + 1} · 10:00–11:00 · demo.l2 (L2)\n\n**Plan (student):** x\n`).join("\n")}`;

// Two tasks, two diary sessions in one file and one in another, and three history entries over two skills.
function project({ language = "nl", mark = null } = {}) {
  const skills = fakeSkills({ language });
  skills.skills[2].history = [{ at: "2026-11-09", from: "L3", to: "L2", note: "x" }, { at: "2026-11-10", from: "L2", to: "L3", note: "y", placement: true }];
  skills.skills[4].history = [{ at: "2026-11-10", from: "L3", to: "L2", note: "z", auto: true }];
  const files = {
    ".learning/diary/2026-11-09.md": diary(2),
    ".learning/diary/2026-11-10.md": diary(1),
    ".learning/diary/notities.md": "## geen sessie\n",
  };
  if (mark) files[".learning/state/last-export.json"] = JSON.stringify(mark);
  return makeProject({ skills, events: [task("t1"), task("t2"), { at: "2026-11-10T10:05:00.000Z", type: "task-explained", tid: "t1" }], files });
}

const lastExport = (p) => path.join(p.state, "last-export.json");
const readMark = (p) => JSON.parse(fs.readFileSync(lastExport(p), "utf8"));

test("the totals: task events, diary sessions in dated files, all history entries", () => {
  const p = project();
  try {
    const r = run(EXPORT, [p.root, "--out", path.join(p.root, "out", "progress.json"), "--allow-untranslated"]);
    assert.equal(r.code, 0, r.stderr);
    const mark = readMark(p);
    assert.deepEqual({ tasks: mark.tasks, diarySessions: mark.diarySessions, levelChanges: mark.levelChanges }, { tasks: 2, diarySessions: 3, levelChanges: 3 });
    // The moment is the one of the export itself.
    const json = JSON.parse(fs.readFileSync(path.join(p.root, "out", "progress.json"), "utf8"));
    assert.equal(mark.exportedAt, json.exportedAt);
    assert.deepEqual(Object.keys(mark).sort(), ["diarySessions", "exportedAt", "levelChanges", "tasks"], "only the moment and the totals");
    assert.match(r.stdout, /last-export\.json/);
  } finally { p.cleanup(); }
});

test("no mark with --dry-run or when translations are missing (exit code 2)", () => {
  const p = project();
  try {
    const out = path.join(p.root, "out", "progress.json");
    assert.equal(run(EXPORT, [p.root, "--out", out, "--dry-run"]).code, 0);
    assert.ok(!fs.existsSync(lastExport(p)), "--dry-run writes no mark");
    const r = run(EXPORT, [p.root, "--out", out]);
    assert.equal(r.code, 2, r.stdout + r.stderr);
    assert.ok(!fs.existsSync(out));
    assert.ok(!fs.existsSync(lastExport(p)), "exit code 2 writes no mark");
  } finally { p.cleanup(); }
});

test("skill.mjs since-export: nothing without a mark, the differences with one, never below zero", () => {
  const none = project();
  try {
    const r = none.cli("skill.mjs", ["since-export"]);
    assert.equal(r.code, 0, r.stderr);
    assert.equal(r.stdout, "", "no export yet: no line");
  } finally { none.cleanup(); }

  // At the export: 1 task, 1 diary session, 1 level change. Now: 2, 3 and 3.
  const p = project({ mark: { exportedAt: "2026-11-10T09:00:00.000Z", tasks: 1, diarySessions: 1, levelChanges: 1 } });
  try {
    const r = p.cli("skill.mjs", ["since-export"]);
    assert.equal(r.code, 0, r.stderr);
    assert.equal(r.stdout.trim().split("\n").length, 1, "one line");
    assert.match(r.stdout, /^Sinds de laatste export \(\d{1,2}-11 \d\d:\d\d\): 1 taak, 2 dagboeksessies, 2 niveauwijzigingen\. Werk het dashboard bij met \/update-dashboard in de repo\.$/m);
  } finally { p.cleanup(); }

  // More in the mark than now (a cleared log, for example): zero, not negative. The line still comes.
  const q = project({ mark: { exportedAt: "2026-11-10T09:00:00.000Z", tasks: 9, diarySessions: 9, levelChanges: 9 } });
  try {
    assert.match(q.cli("skill.mjs", ["since-export"]).stdout, /: 0 taken, 0 dagboeksessies, 0 niveauwijzigingen\./);
  } finally { q.cleanup(); }

  // A broken mark counts as no mark.
  const b = project();
  try {
    fs.writeFileSync(lastExport(b), "{ kapot");
    assert.equal(b.cli("skill.mjs", ["since-export"]).stdout, "");
    fs.writeFileSync(lastExport(b), JSON.stringify({ exportedAt: "x", tasks: "2" }));
    assert.equal(b.cli("skill.mjs", ["since-export"]).stdout, "");
  } finally { b.cleanup(); }
});

test("skill.mjs since-export in English, with singular and plural", () => {
  const p = project({ language: "en", mark: { exportedAt: "2026-11-10T09:00:00.000Z", tasks: 0, diarySessions: 2, levelChanges: 2 } });
  try {
    assert.match(p.cli("skill.mjs", ["since-export"]).stdout,
      /^Since the last export \(\d{1,2} Nov \d\d:\d\d\): 2 tasks, 1 diary session, 1 level change\. Update the dashboard with \/update-dashboard in the repo\.$/m);
  } finally { p.cleanup(); }
});

test("session start: the line only after an export and only when something is new", () => {
  const msgOf = (p) => p.hook("session-start.mjs", { source: "startup", session_id: SID }).json.systemMessage;

  const none = project();
  try { assert.doesNotMatch(msgOf(none), /export/i, "no export yet: no line"); } finally { none.cleanup(); }

  const same = project({ mark: { exportedAt: "2026-11-10T09:00:00.000Z", tasks: 2, diarySessions: 3, levelChanges: 3 } });
  try { assert.doesNotMatch(msgOf(same), /export/i, "nothing new: no line"); } finally { same.cleanup(); }

  const news = project({ mark: { exportedAt: "2026-11-10T09:00:00.000Z", tasks: 2, diarySessions: 2, levelChanges: 3 } });
  try {
    const msg = msgOf(news);
    assert.match(msg, /^Leerharnas: \d+ vaardigheden/);
    assert.match(msg, /\nSinds de laatste export \([^)]+\): 0 taken, 1 dagboeksessie, 0 niveauwijzigingen\. Werk het dashboard bij/);
  } finally { news.cleanup(); }
});

test("a new task after the export shows up at the session start; a new export resets it", () => {
  const p = project();
  try {
    const out = path.join(p.root, "out", "progress.json");
    assert.equal(run(EXPORT, [p.root, "--out", out, "--allow-untranslated"]).code, 0);
    assert.match(p.cli("skill.mjs", ["since-export"]).stdout, /: 0 taken, 0 dagboeksessies, 0 niveauwijzigingen\./);
    fs.appendFileSync(path.join(p.state, "events.jsonl"), JSON.stringify(task("t3", new Date().toISOString())) + "\n");
    assert.match(p.hook("session-start.mjs", { source: "startup", session_id: SID }).json.systemMessage, /Sinds de laatste export \([^)]+\): 1 taak, 0 dagboeksessies/);
    assert.equal(run(EXPORT, [p.root, "--out", out, "--allow-untranslated"]).code, 0);
    assert.equal(readMark(p).tasks, 3);
    assert.doesNotMatch(p.hook("session-start.mjs", { source: "startup", session_id: SID }).json.systemMessage, /export/i);
  } finally { p.cleanup(); }
});

test("the guard lets Claude run since-export: it only reads", () => {
  const p = project();
  try {
    const decide = (command) => p.hook("guard.mjs", { tool_name: "Bash", tool_input: { command } }).json?.hookSpecificOutput?.permissionDecision ?? "allow";
    assert.equal(decide("node .claude/hooks/skill.mjs since-export"), "allow");
    assert.equal(decide("node .claude/hooks/skill.mjs set demo.l2 L3"), "deny", "a record command stays blocked");
  } finally { p.cleanup(); }
});
