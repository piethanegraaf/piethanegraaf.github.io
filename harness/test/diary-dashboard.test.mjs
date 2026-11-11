// The second setup review of 11 November 2026 (decisions 20 and 21):
// S8 after /diary the harness asks "Update the dashboard now?" when something is new since the last
//    export, and also without a mark (nothing is known, so it asks). Nothing new: no question.
//    settings.dashboardRepo is the clone of the repo (`skill.mjs setting dashboardRepo`), or "off"
//    without a dashboard. The update-dashboard skill comes with the installed harness (one source:
//    harness/skills/), and the guard allows the export `node <repo>/harness/export.mjs <folder>` on purpose.
// S9 the diary skill warns, above the three reflection questions, that the answers go onto the public dashboard.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { HARNESS, makeProject, fakeSkills, decision, run } from "./helpers.mjs";

const REPO = path.resolve(HARNESS, "..");
const EXPORT = path.join(HARNESS, "export.mjs");
const INSTALL = path.join(HARNESS, "install.mjs");
const SID = "s-dash";
const ASK_NL = /^Dashboard nu bijwerken\? \(ja \/ later\)$/;
const ASK_EN = /^Update the dashboard now\? \(yes \/ later\)$/;
const i18n = (lang) => JSON.parse(fs.readFileSync(path.join(HARNESS, "i18n", `${lang}.json`), "utf8"));
const read = (...p) => fs.readFileSync(path.join(...p), "utf8");

const task = (tid) => ({ at: "2026-11-10T10:00:00.000Z", type: "task", tid, skill: "demo.l2", success: true, maxRung: 0, source: "check", session: SID });
// Now: 1 task, 1 diary session, 0 level changes (the fake skills have no history).
function project({ settings = {}, mark = null } = {}) {
  const files = { ".learning/diary/2026-11-10.md": "# Dagboek\n\n## Sessie 1 · 10:00–11:00 · demo.l2 (L2)\n" };
  if (mark) files[".learning/state/last-export.json"] = JSON.stringify(mark);
  return makeProject({ skills: fakeSkills(settings), events: [task("t1")], files });
}
const SAME = { exportedAt: "2026-11-10T12:00:00.000Z", tasks: 1, diarySessions: 1, levelChanges: 0 };
const lines = (r) => r.stdout.trim().split("\n").filter(Boolean);

// ---- S8: the question after the diary ----

test("S8: something new since the export -> the line, then the question", () => {
  const p = project({ mark: { ...SAME, diarySessions: 0 } });
  try {
    const r = p.cli("skill.mjs", ["since-export"]);
    assert.equal(r.code, 0, r.stderr);
    const out = lines(r);
    assert.equal(out.length, 2, r.stdout);
    assert.match(out[0], /^Sinds de laatste export \([^)]+\): 0 taken, 1 dagboeksessie, 0 niveauwijzigingen\./);
    assert.match(out[1], ASK_NL);
  } finally { p.cleanup(); }
});

test("S8: no mark -> no export known, then the question (also when the repo is known)", () => {
  const p = project();
  try {
    const out = lines(p.cli("skill.mjs", ["since-export"]));
    assert.equal(out.length, 2);
    assert.match(out[0], /^Nog geen dashboardexport bekend in deze map\. Geen dashboard\? Zet deze vraag uit met: ! node \.claude\/hooks\/skill\.mjs setting dashboardRepo off$/);
    assert.match(out[1], ASK_NL);
  } finally { p.cleanup(); }

  const q = project({ settings: { dashboardRepo: REPO } });
  try {
    const out = lines(q.cli("skill.mjs", ["since-export"]));
    assert.deepEqual(out.map((l) => ASK_NL.test(l)), [false, true]);
    assert.equal(out[0], "Nog geen dashboardexport bekend in deze map.", "a known repo: no hint to switch it off");
  } finally { q.cleanup(); }
});

test("S8: nothing new since the export -> the line, no question", () => {
  const p = project({ mark: SAME });
  try {
    const out = lines(p.cli("skill.mjs", ["since-export"]));
    assert.equal(out.length, 1);
    assert.match(out[0], /: 0 taken, 0 dagboeksessies, 0 niveauwijzigingen\./);
  } finally { p.cleanup(); }
});

test("S8: dashboardRepo off -> no line and no question, and nothing at the session start", () => {
  for (const mark of [null, { ...SAME, tasks: 0 }]) {
    const p = project({ settings: { dashboardRepo: "off" }, mark });
    try {
      const r = p.cli("skill.mjs", ["since-export"]);
      assert.equal(r.code, 0, r.stderr);
      assert.equal(r.stdout, "");
      assert.doesNotMatch(p.hook("session-start.mjs", { source: "startup", session_id: SID }).json.systemMessage, /export/i);
    } finally { p.cleanup(); }
  }
});

test("S8: the same in English", () => {
  const p = project({ settings: { language: "en" } });
  try {
    const out = lines(p.cli("skill.mjs", ["since-export"]));
    assert.match(out[0], /^No dashboard export known in this folder yet\. No dashboard\? Turn this question off with: /);
    assert.match(out[1], ASK_EN);
  } finally { p.cleanup(); }
  const q = project({ settings: { language: "en" }, mark: { ...SAME, tasks: 0 } });
  try {
    const out = lines(q.cli("skill.mjs", ["since-export"]));
    assert.match(out[0], /^Since the last export \([^)]+\): 1 task, 0 diary sessions, 0 level changes\. Update the dashboard with \/update-dashboard\.$/);
    assert.match(out[1], ASK_EN);
  } finally { q.cleanup(); }
});

// ---- S8: where the repo is ----

test("S8: setting dashboardRepo takes an absolute path to a clone with harness/export.mjs, or off", () => {
  const p = project();
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-norepo-"));
  try {
    const ok = p.cli("skill.mjs", ["setting", "dashboardRepo", REPO]);
    assert.equal(ok.code, 0, ok.stderr);
    assert.equal(p.skills().settings.dashboardRepo, REPO);
    assert.ok(p.events().some((e) => e.type === "setting" && e.key === "dashboardRepo" && e.value === REPO));

    const rel = p.cli("skill.mjs", ["setting", "dashboardRepo", "../repo"]);
    assert.equal(rel.code, 1);
    assert.match(rel.stderr, /absoluut pad/);
    const none = p.cli("skill.mjs", ["setting", "dashboardRepo", empty]);
    assert.equal(none.code, 1);
    assert.match(none.stderr, /Geen harness\/export\.mjs in /);
    assert.equal(p.cli("skill.mjs", ["setting", "dashboardRepo", "a\"b"]).code, 1);
    assert.equal(p.skills().settings.dashboardRepo, REPO, "a refused value changes nothing");

    assert.equal(p.cli("skill.mjs", ["setting", "dashboardRepo", "OFF"]).code, 0);
    assert.equal(p.skills().settings.dashboardRepo, "off");
  } finally { p.cleanup(); fs.rmSync(empty, { recursive: true, force: true }); }
});

test("S8: only the learner sets dashboardRepo, and the export never publishes it", () => {
  const p = project({ settings: { dashboardRepo: REPO } });
  try {
    const r = p.hook("guard.mjs", { tool_name: "Bash", tool_input: { command: `node .claude/hooks/skill.mjs setting dashboardRepo off` }, cwd: p.root });
    assert.equal(decision(r), "deny");
    const out = path.join(p.root, "out", "progress.json");
    const e = run(EXPORT, [p.root, "--out", out, "--allow-untranslated"]);
    assert.equal(e.code, 0, e.stderr);
    const text = read(out);
    assert.doesNotMatch(text, /dashboardRepo/);
    assert.ok(!text.includes(REPO), "no path of the repo");
  } finally { p.cleanup(); }
});

// ---- S8: the guard allows the export on purpose ----

test("S8 guard: the dashboard export from a practice session is allowed, as on 11 November", () => {
  const p = project();
  const wt = path.join(os.tmpdir(), "wt-dashboard");
  const bash = (command, cwd = p.root, tool = "Bash") => decision(p.hook("guard.mjs", { tool_name: tool, tool_input: { command }, cwd }));
  try {
    assert.equal(bash(`node "${path.join(wt, "harness", "export.mjs")}" "${p.root}" --dry-run`), "allow");
    assert.equal(bash(`cd "${wt}" && node harness/export.mjs "${p.root}"`), "allow");
    assert.equal(bash(`node ${path.join(wt, "harness", "export.mjs")} ${p.root}`, p.root, "PowerShell"), "allow");
    assert.equal(bash(`cd "${wt}" && node harness/export.mjs --check site-src/dashboard/data/progress.json`), "allow");
    // Never into the record: not with --out, not with a redirect.
    assert.equal(bash(`cd "${wt}" && node harness/export.mjs "${p.root}" --out "${p.abs(".learning/skills.json")}"`), "deny");
    assert.equal(bash(`cd "${wt}" && node harness/export.mjs "${p.root}" --out "${path.join(wt, "x.json")}"`), "allow");
    assert.equal(bash(`node "${path.join(wt, "harness", "export.mjs")}" "${p.root}" > .learning/skills.json`), "deny");
    assert.equal(bash(`node "${path.join(wt, "harness", "export.mjs")}" "${p.root}" && node .claude/hooks/skill.mjs set demo.l2 L4`), "deny");
  } finally { p.cleanup(); }
});

test("S8 guard: also when node is a build in this course; an export.mjs inside the project is learner code", () => {
  const p = project({ settings: { codeExtensions: ["js", "mjs"], buildCommands: ["\\bnode\\b"] } });
  const wt = path.join(os.tmpdir(), "wt-dashboard");
  const bash = (command) => decision(p.hook("guard.mjs", { tool_name: "Bash", tool_input: { command }, cwd: p.root }));
  try {
    assert.equal(bash("node opdrachten/02-lijst/app.js"), "deny", "node runs learner code here");
    assert.equal(bash(`node "${path.join(wt, "harness", "export.mjs")}" "${p.root}"`), "allow", "the export is named explicitly");
    assert.equal(bash("node opdrachten/02-lijst/harness/export.mjs"), "deny", "not outside the project: judged as code");
  } finally { p.cleanup(); }
});

test("S8 guard: the installed update-dashboard skill belongs to the harness", () => {
  const p = project();
  try {
    const r = p.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: p.abs(".claude/skills/update-dashboard/SKILL.md"), content: "x" }, cwd: p.root });
    assert.equal(decision(r), "deny");
  } finally { p.cleanup(); }
});

// ---- S8: one source for the skill ----

test("S8: install.mjs installs update-dashboard in the chosen language, from harness/skills/", () => {
  for (const lang of ["nl", "en"]) {
    const d = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-install-"));
    try {
      const env = { ...process.env };
      delete env.LEERHARNAS_ROOT; delete env.LEERHARNAS_DATA;
      const r = run(INSTALL, [d, "--lang", lang, "--yes"], { env });
      assert.equal(r.code, 0, r.stderr);
      assert.equal(read(d, ".claude/skills/update-dashboard/SKILL.md"), read(HARNESS, "skills", "update-dashboard", `SKILL.${lang}.md`));
      assert.ok(JSON.parse(read(d, ".claude/leerharnas.json")).files[".claude/skills/update-dashboard/SKILL.md"]);
    } finally { fs.rmSync(d, { recursive: true, force: true }); }
  }
});

test("S8: the repo's own skill points to harness/skills/ and has no steps of its own", () => {
  const stub = read(REPO, ".claude", "skills", "update-dashboard", "SKILL.md");
  assert.match(stub, /^---\r?\nname: update-dashboard\r?\n/);
  assert.match(stub, /harness\/skills\/update-dashboard\/SKILL\.en\.md/);
  assert.doesNotMatch(stub, /^## Steps/m);
  assert.doesNotMatch(stub, /export\.mjs/);
});

test("S8: the update-dashboard skill in nl and en: the same steps, the repo from dashboardRepo, no --out", () => {
  const steps = (s) => (s.match(/^\d+\. \*\*/gm) ?? []).length;
  const nl = read(HARNESS, "skills", "update-dashboard", "SKILL.nl.md");
  const en = read(HARNESS, "skills", "update-dashboard", "SKILL.en.md");
  assert.equal(steps(nl), 9);
  assert.equal(steps(en), 9);
  for (const s of [nl, en]) {
    assert.match(s, /^---\r?\nname: update-dashboard\r?\n/);
    assert.match(s, /settings\.dashboardRepo/);
    assert.match(s, /skill\.mjs setting dashboardRepo/);
    assert.match(s, /`--out`/);
    assert.match(s, /worktree/);
  }
  assert.match(nl, /Merge hem nooit\./);
  assert.match(en, /Never merge it\./);
});

test("S8: the diary skill asks the question of since-export and follows update-dashboard on yes", () => {
  for (const [lang, never] of [["nl", /Merge nooit zelf\./], ["en", /Never merge yourself\./]]) {
    const s = read(HARNESS, "skills", "diary", `SKILL.${lang}.md`);
    const step5 = s.slice(s.indexOf("5. **"));
    assert.ok(step5.includes(i18n(lang)["cli.since.ask"]), `${lang}: the same words as the CLI`);
    assert.match(step5, /AskUserQuestion/);
    assert.match(step5, /\.claude\/skills\/update-dashboard\/SKILL\.md/);
    assert.match(step5, never);
  }
});

// ---- S9: the warning above the reflection questions ----

test("S9: the diary skill warns above the three reflection questions, in nl and en", () => {
  const nl = read(HARNESS, "skills", "diary", "SKILL.nl.md");
  const en = read(HARNESS, "skills", "diary", "SKILL.en.md");
  assert.match(nl, /> Let op: je antwoorden komen letterlijk, met een vertaling, op het openbare dashboard\.\r?\n\s*>\r?\n\s*> 1\. Wat heb je geleerd\?/);
  assert.match(en, /> Note: your answers appear word for word, with a translation, on the public dashboard\.\r?\n\s*>\r?\n\s*> 1\. What did you learn\?/);
  // Not for a learner without a dashboard.
  for (const s of [nl, en]) assert.match(s.slice(s.indexOf("2. **"), s.indexOf("> 1.")), /`off`/);
});
