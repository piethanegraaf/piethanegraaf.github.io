// export.mjs: whitelist only, privacy filters, private.json, --dry-run.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { HARNESS, makeProject, fakeSkills, run } from "./helpers.mjs";
import { fixedFilters, privateFilters, makeScrubber, parseDiary } from "../export.mjs";

const EXPORT = path.join(HARNESS, "export.mjs");
const SID = "1b8a483e-bd12-4b28-b493-d351e79a6c31";

const scrubWith = (filters) => makeScrubber(filters).scrub;

test("fixed filters: e-mail, paths, session ids, transcripts, HTML comments, user name", () => {
  const scrub = scrubWith(fixedFilters({ userNames: ["jdoe"] }));
  assert.equal(scrub("mail me: jan.doe@example.com", "f"), "mail me: [e-mail]");
  assert.equal(scrub("zie C:\\Users\\jdoe\\Documents\\x.cs", "f"), "zie [pad]");
  assert.equal(scrub("zie C:/Users/jdoe/x.cs en /c/Users/jdoe/y.cs", "f"), "zie [pad] en [pad]");
  assert.equal(scrub("in /home/jdoe/project", "f"), "in [pad]");
  assert.equal(scrub(`sessie ${SID} klaar`, "f"), "sessie [sessie] klaar");
  // Built from pieces, so the security check does not see a real transcript path in this file.
  assert.equal(scrub("log in ~/.claude/" + "projects/abc/x.jsonl", "f"), "log in [transcript]");
  assert.equal(scrub("tekst <!-- sessie: x --> verder", "f"), "tekst verder");
  assert.equal(scrub("groeten van jdoe", "f"), "groeten van [gebruiker]");
});

test("fixed filters leave normal text alone", () => {
  const scrub = scrubWith(fixedFilters({ userNames: ["jdoe"] }));
  for (const s of ["trede 1/2 en/of 3", "L2 → L3: 4/5 gelukt", "voorbeelden/<vaardigheid>/", "Stap 1: lees de test", "list.Count() == 0"]) {
    assert.equal(scrub(s, "f"), s);
  }
});

test("private.json: terms and replacements, longest first, whole words only, case-insensitive", () => {
  const scrub = scrubWith(privateFilters({ terms: ["Jan", "Acme BV"], replace: { "Jan de Vries": "een medestudent" } }));
  assert.equal(scrub("Jan de Vries hielp, en jan ook", "f"), "een medestudent hielp, en [privé] ook");
  assert.equal(scrub("bij ACME bv gewerkt", "f"), "bij [privé] gewerkt");
  assert.equal(scrub("Janssen en januari blijven", "f"), "Janssen en januari blijven");
});

test("the scrubber reports what it filtered, per field", () => {
  const { scrub, report } = makeScrubber([...privateFilters({ terms: ["Geheim"] }), ...fixedFilters()]);
  scrub("Geheim: a@b.nl", "task.explanation");
  scrub("geheim", "diary.plan");
  assert.equal(report.get("private: Geheim").n, 2);
  assert.deepEqual([...report.get("private: Geheim").fields].sort(), ["diary.plan", "task.explanation"]);
  assert.equal(report.get("email").n, 1);
});

const DIARY = `# Dagboek 2026-11-10

## Sessie 1 · ±12:35–14:20 · demo.l2 (L2)
<!-- sessie: ${SID} -->

**Plan (student):** opdracht 02 afmaken · zelfvertrouwen vooraf: 3

**Feiten (gelogd):**
- Tooling: geheime werkgever-laptop van Acme BV

**Wat ging goed (zelfstandig):**
- de lus zelf gerepareerd

**Reflectie (eigen woorden):**
1. *Geleerd:* lussen, samen met Jan
2. *Verwarrend / anders:* niets
3. *Zelfvertrouwen nu:* 4 · *Volgende stap:* overerving

**Kalibratie:** vooraf 3 → lukte met trede ≤1 → onderschat

**Harnastijd (na de oefensessie):** ±14:20–15:10, product-owner-plan
`;

test("parseDiary: only the whitelisted labelled fields", () => {
  const [s] = parseDiary(DIARY, "2026-11-10");
  assert.equal(s.n, 1);
  assert.equal(s.time, "±12:35–14:20");
  assert.equal(s.plan, "opdracht 02 afmaken");
  assert.equal(s.confidenceBefore, "3");
  assert.equal(s.wentWell, "de lus zelf gerepareerd");
  assert.deepEqual(s.reflection, { learned: "lussen, samen met Jan", confusing: "niets", confidenceAfter: "4", nextStep: "overerving" });
  assert.equal(s.calibration, "vooraf 3 → lukte met trede ≤1 → onderschat");
  const all = JSON.stringify(s);
  for (const leak of ["Tooling", "werkgever", "Harnastijd", "product-owner", SID]) assert.ok(!all.includes(leak), leak);
});

test("parseDiary: the English diary format", () => {
  const [s] = parseDiary(`## Session 2 · 10:00–11:00 · demo.l3 (L3)
**Plan (learner):** finish 03 · confidence before: 2
**Reflection (own words):**
1. *Learned:* inheritance
2. *Confusing / different:* base()
3. *Confidence now:* 3 · *Next step:* interfaces
**Calibration:** before 2 → rung 0 → underestimated
`, "2026-11-11");
  assert.equal(s.plan, "finish 03");
  assert.equal(s.confidenceBefore, "2");
  assert.equal(s.reflection.nextStep, "interfaces");
  assert.match(s.calibration, /underestimated/);
});

function exportProject() {
  const skills = { ...fakeSkills(), learner: "Pietje Puk" };
  skills.skills[2].history = [{ at: "2026-11-07", from: "L3", to: "L2", note: "vast, zie C:\\Users\\pietje\\x.cs" }];
  const p = makeProject({
    skills,
    events: [
      { at: "2026-11-10T10:00:00.000Z", type: "hint-unlock", skill: "demo.l2", rung: 1, reason: "eerste hint", session: SID },
      { at: "2026-11-10T10:05:00.000Z", type: "deny", tool: "Write", file: "opdrachten/02-lijst/Lijst.cs", cmd: "dotnet test geheim-pad", session: SID },
      { at: "2026-11-10T10:10:00.000Z", type: "task", tid: "t1", skill: "demo.l2", success: true, maxRung: 1, source: "check", what: "TestEen", session: SID },
      { at: "2026-11-10T10:11:00.000Z", type: "test-green", skill: "demo.l2", tid: "t1", tests: ["Geheim.Namespace.TestEen"], dir: "opdrachten/02-lijst" },
      { at: "2026-11-10T10:12:00.000Z", type: "explain-rejected", tid: "t1", by: "hook", reasons: ["te kort"], session: SID },
      { at: "2026-11-10T10:15:00.000Z", type: "task-explained", tid: "t1", skill: "demo.l2", text: "Pietje dacht: het werkt omdat de lus bij nul begint; mail pietje@example.com", session: SID },
      { at: "2026-11-10T10:20:00.000Z", type: "task-correct", tid: "t1", skill: "demo.l2", from: 1, maxRung: 2, reason: "hulp van Jan" },
      { at: "2026-11-10T10:30:00.000Z", type: "regression", tests: ["Geheim.Namespace.TestEen"], dir: "opdrachten/02-lijst", session: SID },
      { at: "2026-11-10T10:31:00.000Z", type: "task", tid: "t2", skill: "demo.l2", success: true, maxRung: 0, source: "check", session: SID },
      { at: "2026-11-10T10:32:00.000Z", type: "task-void", tid: "t2", skill: "demo.l2", reason: "herstel" },
      { at: "2026-11-10T10:40:00.000Z", type: "override", skill: "demo.l2", minutes: 30, reason: "tooling" },
    ],
    files: { ".learning/diary/2026-11-10.md": DIARY, ".learning/private.json": JSON.stringify({ terms: ["Jan", "Acme BV"] }) },
  });
  return p;
}

test("export: whitelist, filters and task details", () => {
  const p = exportProject();
  try {
    const out = path.join(p.root, "progress.json");
    const r = run(EXPORT, [p.root, "--out", out]);
    assert.equal(r.code, 0, r.stderr);
    const json = JSON.parse(fs.readFileSync(out, "utf8"));
    const text = JSON.stringify(json);
    for (const leak of [SID, "\"session\":", "geheim-pad", "Geheim.Namespace", "opdrachten/02-lijst", "Pietje", "pietje", "example.com", "Jan", "C:\\\\Users", "Acme"]) {
      assert.ok(!text.includes(leak), `leak: ${leak}`);
    }
    const t1 = json.tasks.find((x) => x.id === "t1");
    assert.deepEqual([t1.maxRung, t1.explained, t1.rejections.length, t1.corrections.length], [2, true, 1, 1]);
    assert.match(t1.explanation, /^\[gebruiker\] dacht: het werkt omdat de lus bij nul begint; mail \[e-mail\]$/);
    assert.equal(t1.corrections[0].reason, "hulp van [privé]");
    assert.equal(json.tasks.find((x) => x.id === "t2").void, true);
    assert.deepEqual(json.regressions, [{ at: "2026-11-10T10:30:00.000Z", skill: "demo.l2", tests: 1, fixed: false }]);
    assert.deepEqual(json.activity, [{ date: "2026-11-10", sessions: 1, hints: 1, holds: 0, denials: 1, overridesUsed: 0 }]);
    assert.equal(json.skills.find((s) => s.id === "demo.l2").history[0].note, "vast, zie [pad]");
    assert.equal(json.diary.length, 1);
    assert.match(r.stdout, /private: Jan/);
  } finally { p.cleanup(); }
});

test("export --dry-run writes nothing and reports the filters", () => {
  const p = exportProject();
  try {
    const out = path.join(p.root, "progress.json");
    const r = run(EXPORT, [p.root, "--out", out, "--dry-run"]);
    assert.equal(r.code, 0, r.stderr);
    assert.ok(!fs.existsSync(out));
    assert.match(r.stdout, /Weggefilterd:/);
    assert.match(r.stdout, /email\s+1x/);
    assert.match(r.stdout, /niets geschreven/);
  } finally { p.cleanup(); }
});

test("export refuses a folder without data and an invalid private.json", () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-export-"));
  try {
    assert.match(run(EXPORT, [empty]).stderr, /geen \.learning\/skills\.json/);
  } finally { fs.rmSync(empty, { recursive: true, force: true }); }
  const p = makeProject({ files: { ".learning/private.json": "{ kapot" } });
  try {
    assert.match(run(EXPORT, [p.root, "--dry-run"]).stderr, /private\.json is geen geldige JSON/);
  } finally { p.cleanup(); }
});

// ---------- Setup review S1-S4 in the export ----------
test("export: skipped and replayed tasks, retags, placement, last seen, no review below L4", () => {
  const at = "2026-11-10T12:00:00.000Z";
  const s = fakeSkills();
  Object.assign(s.skills.find((x) => x.id === "demo.l3"), { nextReview: "2026-01-01" });
  Object.assign(s.skills.find((x) => x.id === "demo.l4"), { nextReview: "2026-11-20" });
  s.skills.push({ id: "demo.nieuw", title: "Nieuw", level: "L2", paths: ["opdrachten/05-*/**"] });
  const p = makeProject({ skills: s, events: [
    { at, type: "task", tid: "a", skill: "demo.l2", success: true, maxRung: 1, source: "check" },
    { at, type: "task-lapsed", tid: "a", skill: "demo.l2", reason: "other-exercise" },
    { at, type: "task", tid: "b", skill: "demo.l2", success: true, maxRung: 0, source: "check" },
    { at, type: "task-explained", tid: "b", skill: "demo.l2", text: "uitleg", source: "replay" },
    { at, type: "task-retag", tid: "b", from: "demo.l2", to: "demo.l2.micro", by: "demotie-analist" },
  ] });
  try {
    const out = path.join(p.root, "out.json");
    const r = run(EXPORT, [p.root, "--out", out]);
    assert.equal(r.code, 0, r.stderr);
    const j = JSON.parse(fs.readFileSync(out, "utf8"));
    const task = (id) => j.tasks.find((x) => x.id === id);
    assert.deepEqual([task("a").lapsed, task("a").lapseReason, task("a").explained], [true, "other-exercise", false]);
    assert.deepEqual([task("b").explainedBy, task("b").skill, task("b").retaggedFrom], ["replay", "demo.l2.micro", "demo.l2"]);
    const skill = (id) => j.skills.find((x) => x.id === id);
    assert.equal(skill("demo.l3").nextReview, null, "no review below L4");
    assert.equal(skill("demo.l4").nextReview, "2026-11-20");
    assert.equal(skill("demo.nieuw").placement, "pending");
    assert.equal(skill("demo.l2").placement, "done");
    assert.equal(skill("demo.l2").lastSeen, "2026-11-10");
  } finally { p.cleanup(); }
});

// ---------- The dashboard is bilingual; a cached older app.js must keep working ----------
test("export: generatedAt stays a date, exportedAt is the moment; both languages for map titles, signals and fixed notes", () => {
  const s = fakeSkills();
  s.skills.push({ id: "ood.interfaces", title: "Interfaces ontwerpen en implementeren", level: "L2", paths: ["opdrachten/06-*/**"],
    history: [{ at: "2026-11-01", to: "L2", note: "aangemaakt" }, { at: "2026-11-02", from: "L2", to: "L2", note: "eigen notitie" }] });
  const at = "2026-11-10T12:00:00.000Z";
  const events = [];
  for (const tid of ["a", "b", "c", "d", "e"]) {
    events.push({ at, type: "task", tid, skill: "ood.interfaces", success: true, maxRung: 0, source: "check" });
    events.push({ at, type: "task-explained", tid, skill: "ood.interfaces", text: "uitleg" });
  }
  const p = makeProject({ skills: s, events });
  try {
    const out = path.join(p.root, "out.json");
    assert.equal(run(EXPORT, [p.root, "--out", out]).code, 0);
    const j = JSON.parse(fs.readFileSync(out, "utf8"));
    assert.match(j.generatedAt, /^\d{4}-\d{2}-\d{2}$/, "a date: older dashboards compute days from it");
    assert.ok(!Number.isNaN(Date.parse(j.exportedAt)) && j.exportedAt.length > 10);
    const sk = j.skills.find((x) => x.id === "ood.interfaces");
    assert.deepEqual(sk.titles, { nl: "Interfaces ontwerpen en implementeren", en: "Designing and implementing interfaces" });
    assert.equal(j.skills.find((x) => x.id === "demo.l2").titles, null, "not in the map: only the record's title");
    assert.deepEqual(sk.history[0].notes, { nl: "aangemaakt", en: "created" });
    assert.equal(sk.history[1].notes, null, "the learner's own note is not translated");
    const sig = j.signals.find((x) => x.skill === "ood.interfaces");
    assert.match(sig.texts.nl, /5\/5 gelukt/);
    assert.match(sig.texts.en, /5\/5 solved/);
    assert.equal(sig.text, sig.texts.nl, "the old field stays, in the record's language");
  } finally { p.cleanup(); }
});
