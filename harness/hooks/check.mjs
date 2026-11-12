#!/usr/bin/env node
// Leerharnas testrunner: objective evidence instead of keywords. You run it yourself:
//   ! node .claude/hooks/check.mjs [map]          (map met een .sln/.slnx/.csproj; standaard de huidige map)
// Works for every .NET test project (snek exercises, your own project work):
//  - runs `dotnet test` with a trx logger and prints a short, readable summary;
//  - remembers per test method whether it was green (state/tests.json);
//  - a test that goes from red to green is logged as a task for the matching skill, with the
//    hint rung of the current session. It only counts after your explanation in your own words.
//  - a test that was green before, went red and is green again is a repaired regression, not a
//    new task: it is logged as "regression-fixed" and does not count towards promotion.
//  - the folder tells the session which skill is practised ("!" commands bypass prompt-gate),
//    so the next prompt gets the right level and hint ladder.
//  - a compile error is remembered as the starting point of that folder: a test that is green at the
//    first build that works counts as new green, also when it never ran before (setup review 3.2).
// Claude may not run this script for L1-L3 code (guard.mjs); it is your test run.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  ROOT, TESTS_FILE, STATE_DIR, loadSkills, skillForPath, rel, keywordMap, findSkill, isMicro, familyIds, familyOf,
  pickSession, loadSession, saveSession, touch, activeMinutesSince, logTask, logEvent, levelAdvice, taskStats,
  lapseTasks, afterTask, effectiveLevel, newWorkSignal, beginNewWork, taskRung, taskLogged, changedCodeFiles, progressOf, progressLine, t,
} from "./lib.mjs";

let data0 = null;
try { data0 = loadSkills(); } catch { /* messages stay in the default language */ }
const dirArg = process.argv[2] ?? ".";
// Relative to where you are; if that folder does not exist, relative to the project (the shell may
// have been left in an exercise folder, setup review §4).
let dir = path.resolve(process.cwd(), dirArg);
if (!fs.existsSync(dir) && !path.isAbsolute(dirArg) && fs.existsSync(path.resolve(ROOT, dirArg))) dir = path.resolve(ROOT, dirArg);
if (!fs.existsSync(dir)) { console.error(t("check.noDir", { dir })); process.exit(1); }
const relDir = rel(dir) ?? dir;
const BUILD_KEY = `${relDir}::#build`;

// ---------- 0. The folder decides the session skill ----------
// "!" commands never reach prompt-gate, so without this the session could stay on a skill that was
// guessed from a keyword (e.g. "unit test" in a question about cs.basis code), with the wrong level.
// maxRung is kept: help already given for this task still counts. st.folderSkill also locks the
// skill detection of prompt-gate to this family (setup review 3.3).
const folderSkill = data0 ? skillForPath(data0, path.join(dir, "__probe__", "x.cs")) : null;
const mapped = folderSkill && folderSkill.kind !== "zone" ? folderSkill : null;
const sid = pickSession(mapped ? familyIds(data0, mapped.id) : null, data0);
let sessionStart = null;
{
  const st0 = sid ? loadSession(sid) : null;
  if (st0) {
    touch(st0, Date.now(), data0);
    sessionStart = st0.startedAt ?? null;
    // check.mjs in another folder than the last task: new work begins (setup review of 11 Nov, S3).
    // Before the folder changes the session skill, so dropped help is logged under the old skill.
    const why = newWorkSignal(data0, st0, { dir: relDir });
    if (why) beginNewWork(st0, why, { session: sid });
    if (mapped) {
      st0.folderSkill = familyOf(mapped);
      st0.folderSkillAt = Date.now();
      const active = st0.activeSkill ? findSkill(data0, st0.activeSkill) : null;
      if (!active || !familyIds(data0, mapped.id).includes(active.id)) st0.activeSkill = mapped.id;
    }
    saveSession(sid, st0);
  }
}

// ---------- 0b. Another exercise: open explanations lapse (setup review S1) ----------
// The explanation belongs right after the green, before the next exercise. A task of this folder
// stays open (one explanation may cover two tasks); so does a task without a folder of the same family.
{
  const sameExercise = (x) => (x.dir ? x.dir === relDir : Boolean(mapped) && familyOf(findSkill(data0, x.skill)) === familyOf(mapped));
  const lapsed = data0 ? lapseTasks("other-exercise", sameExercise, sid) : [];
  if (lapsed.length) console.log(t("cli.lapsed", { list: lapsed.map((x) => `${x.skill} [${x.tid}]`).join(", ") }) + "\n");
}

// global.json asks for an older SDK than the project targets, without rolling forward to a newer
// major version (setup review §4: the IDE then installs that SDK and shows no errors).
function sdkWarning() {
  let gj = null;
  for (let d = dir; ; d = path.dirname(d)) {
    if (fs.existsSync(path.join(d, "global.json"))) { gj = path.join(d, "global.json"); break; }
    const r = path.relative(ROOT, d);
    if (!r || r.startsWith("..") || path.isAbsolute(r) || path.dirname(d) === d) break;
  }
  if (!gj) return null;
  let sdk = null;
  try { sdk = JSON.parse(fs.readFileSync(gj, "utf8")).sdk ?? null; } catch { return null; }
  const sdkMajor = Number(String(sdk?.version ?? "").split(".")[0]);
  if (!sdkMajor || ["major", "latestmajor"].includes(String(sdk?.rollForward ?? "").toLowerCase())) return null;
  let tf = 0, budget = 500;
  const scan = (d, depth) => {
    let entries = [];
    try { entries = fs.readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (budget-- <= 0) return;
      if (e.isDirectory()) { if (depth < 3 && !/^(bin|obj|\.vs|\.idea|\.git)$/i.test(e.name)) scan(path.join(d, e.name), depth + 1); continue; }
      if (!/\.csproj$/i.test(e.name)) continue;
      const xml = fs.readFileSync(path.join(d, e.name), "utf8");
      for (const m of xml.matchAll(/<TargetFrameworks?>([^<]+)<\/TargetFrameworks?>/gi)) {
        for (const f of m[1].split(";")) { const v = Number((f.trim().match(/^net(\d+)\./i) ?? [])[1]); if (v > tf) tf = v; }
      }
    }
  };
  scan(dir, 0);
  return tf > sdkMajor ? t("check.sdkMismatch", { file: rel(gj) ?? gj, sdk: sdk.version, tf: `net${tf}.0`, rollForward: sdk.rollForward ?? "-" }) : null;
}

// ---------- 1. Run the tests ----------
let resDir = process.env.LEERHARNAS_TRX_DIR; // testing only: parse existing trx files
let out = process.env.LEERHARNAS_DOTNET_OUT ?? ""; // testing only: the output of dotnet
const warn = sdkWarning();
if (warn) console.log(warn + "\n");
if (!resDir) {
  resDir = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-trx-"));
  console.log(t("check.running", { dir: relDir }));
  const r = spawnSync("dotnet", ["test", dir, "--logger", "trx", "--results-directory", resDir], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (r.error) { console.error(t("check.noDotnet", { error: r.error.message })); process.exit(1); }
  out = (r.stdout ?? "") + (r.stderr ?? "");
}
const trxFiles = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.trx$/i.test(e.name)) trxFiles.push(p); } };
try { walk(resDir); } catch { /* none */ }

let store = {};
try { store = JSON.parse(fs.readFileSync(TESTS_FILE, "utf8")); } catch { /* first run */ }

if (!trxFiles.length) {
  const errs = [...new Set(out.split(/\r?\n/).filter((l) => /\berror\b/i.test(l)).map((l) => l.trim().replace(/\s*\[[^\]]*\.csproj[^\]]*\]$/, "")))];
  console.log("\n" + t("check.noTests"));
  if (errs.length) { console.log(t("check.errors")); errs.slice(0, 10).forEach((e) => console.log("  " + e)); }
  else console.log(out.split(/\r?\n/).slice(-15).join("\n"));
  // Only a compile error of your code (CSxxxx) is a starting point; a tooling error (NETSDK, MSB) is not.
  if (/\berror CS\d{4}\b/.test(out) && !store[BUILD_KEY]) {
    store[BUILD_KEY] = { outcome: "BuildFailed", at: new Date().toISOString() };
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(TESTS_FILE, JSON.stringify(store, null, 2) + "\n");
    logEvent({ type: "build-failed", dir: relDir, session: sid });
    console.log("\n" + t("check.buildNoted"));
  }
  console.log("\n" + t("check.tipBuild"));
  process.exit(1);
}

// ---------- 2. Parse the trx files ----------
const decode = (s) => String(s ?? "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#xD;|&#13;/g, "").replace(/&#xA;|&#10;/g, "\n").replace(/&amp;/g, "&");
const attr = (tag, name) => decode((tag.match(new RegExp(`\\b${name}="([^"]*)"`)) ?? [])[1]);
const results = [];
for (const f of trxFiles) {
  const xml = fs.readFileSync(f, "utf8");
  const cls = new Map();
  for (const m of xml.matchAll(/<UnitTest\b[^>]*\bid="([^"]+)"[\s\S]*?<TestMethod\b([^>]*)>/g)) cls.set(m[1], attr(m[2], "className"));
  for (const m of xml.matchAll(/<UnitTestResult\b([^>]*?)(\/>|>([\s\S]*?)<\/UnitTestResult>)/g)) {
    const a = m[1];
    const body = m[3] ?? "";
    const msg = decode((body.match(/<Message>([\s\S]*?)<\/Message>/) ?? [])[1]).trim();
    const className = cls.get(attr(a, "testId")) ?? "";
    results.push({ name: attr(a, "testName"), className, outcome: attr(a, "outcome"), msg });
  }
}

// ---------- 3. Compare with the previous run ----------
const nowIso = new Date().toISOString();
const newlyGreen = [], restored = [], newlyRed = [], baseline = [];
// After a compile error, a test without an earlier outcome counts as red: green now is new green.
const afterBuildError = Boolean(store[BUILD_KEY]);
delete store[BUILD_KEY];
// The first run in this folder is all green, and code in this folder was changed in this session:
// the learner wrote the code before the first run. That green is new work, not a baseline
// (setup review of 11 Nov, S4). Code from an earlier session stays a baseline.
const firstRun = results.length > 0 && !afterBuildError && results.every((r) => !store[`${relDir}::${r.className}.${r.name}`]);
const allGreen = results.length > 0 && results.every((r) => r.outcome === "Passed");
const writtenFirst = firstRun && allGreen && sessionStart !== null && relDir !== dir &&
  changedCodeFiles(data0, sessionStart, { under: relDir, limit: 1 }).length > 0;
for (const r of results) {
  const key = `${relDir}::${r.className}.${r.name}`;
  const prev = store[key];
  const passed = r.outcome === "Passed";
  if (!prev && (afterBuildError || writtenFirst)) { if (passed) newlyGreen.push(r); }
  else if (!prev) baseline.push(r);
  // Green before (firstPassAt), then red, now green again: a repaired regression, not a new task.
  else if (passed && prev.outcome !== "Passed") (prev.firstPassAt ? restored : newlyGreen).push(r);
  else if (!passed && prev.outcome === "Passed") newlyRed.push(r);
  store[key] = { outcome: r.outcome, lastAt: nowIso, firstPassAt: prev?.firstPassAt ?? (passed ? nowIso : undefined) };
}
fs.mkdirSync(STATE_DIR, { recursive: true });
fs.writeFileSync(TESTS_FILE, JSON.stringify(store, null, 2) + "\n");

// ---------- 4. Summary ----------
const pass = results.filter((r) => r.outcome === "Passed");
const fail = results.filter((r) => r.outcome === "Failed");
const other = results.length - pass.length - fail.length;
console.log("\n" + t("check.result", { dir: relDir, pass: pass.length, fail: fail.length, other: other ? t("check.result.other", { n: other }) : "", total: results.length }));
for (const r of fail) {
  console.log(`  ✗ ${r.name}`);
  const lines = r.msg.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 6);
  for (const l of lines) console.log(`      ${l}`);
}
for (const r of pass) console.log(`  ✓ ${r.name}`);
const fullNames = (list) => list.map((r) => `${r.className}.${r.name}`);
if (newlyRed.length) {
  console.log("\n" + t("check.regression", { tests: newlyRed.map((r) => r.name).join(", ") }));
  logEvent({ type: "regression", tests: fullNames(newlyRed), dir: relDir, session: sid });
}
if (restored.length) {
  console.log("\n" + t("check.restored", { tests: restored.map((r) => r.name).join(", ") }));
  logEvent({ type: "regression-fixed", tests: fullNames(restored), dir: relDir, session: sid });
}
if (baseline.length && baseline.length === results.length) console.log("\n" + t("check.baseline"));
if (writtenFirst) console.log("\n" + t("check.writtenFirst"));

// ---------- 5. Log tasks for tests that turned green ----------
if (newlyGreen.length) {
  const data = loadSkills();
  const st = sid ? loadSession(sid) : null;
  // Skill: (1) path of the solution/project folder, (2) keywords in test/class names, (3) active session skill.
  let skill = skillForPath(data, path.join(dir, "__probe__", "x.cs"));
  if (skill && skill.kind === "zone") skill = null;
  if (!skill) {
    const kw = keywordMap(data);
    const hay = newlyGreen.map((r) => `${r.className} ${r.name}`).join(" ").toLowerCase();
    let best = null;
    for (const s of data.skills) {
      if (s.kind === "zone") continue;
      const sc = (kw[s.id] ?? []).filter((k) => k && hay.includes(k)).length;
      if (sc && (!best || sc > best.sc)) best = { s, sc };
    }
    skill = best?.s ?? (st?.activeSkill ? findSkill(data, st.activeSkill) : null);
  }
  if (!skill) {
    console.log("\n" + t("check.noSkill", { tests: newlyGreen.map((r) => r.name).join(", "), dir: relDir }));
    process.exit(0);
  }
  // A more specific microskill that is active in this session wins.
  const parentId = isMicro(skill) ? skill.parent : skill.id;
  const active = st?.activeSkill ? findSkill(data, st.activeSkill) : null;
  const sameFamily = active && familyIds(data, parentId).includes(active.id);
  if (sameFamily && isMicro(active)) skill = active;
  // All help given since the last logged task counts for this task, also when the session skill
  // belonged to another family. Erring towards "more help" keeps "independent" honest (R2). Help in
  // the review of the previous task counts too when it was about this task's concept (S3).
  const { rung: maxRung, reviewRung, familyRung } = st ? taskRung(data, st, skill.id) : { rung: 0, reviewRung: 0, familyRung: 0 };
  // Where the learning was (#37, #39): the concept of the highest hint. Help about a concept of another
  // family ([trede N #id]) names that concept; otherwise it is this skill.
  const helpConcept = (st?.conceptHelp ?? []).filter((c) => Number(c.rung) >= maxRung).map((c) => c.skill).pop() ?? null;
  const what = newlyGreen.map((r) => r.name).join(", ");
  const minutes = st ? activeMinutesSince(st, st.taskStartedActive) : null;
  const task = logTask({ skill: skill.id, success: maxRung < 5, maxRung, minutes, source: "check", what, session: sid, dir: relDir, level: effectiveLevel(data, skill),
    reviewRung: reviewRung > (st?.maxRung ?? 0) ? reviewRung : 0, tid: st?.openTid, familyRung });
  logEvent({ type: "test-green", skill: skill.id, tid: task.tid, tests: newlyGreen.map((r) => `${r.className}.${r.name}`), dir: relDir, ...(writtenFirst ? { firstRun: true } : {}) });
  const after = afterTask(data, skill.id, task);
  if (st) { if (after.pending) st.demotionPending = after.pending; taskLogged(st, task); saveSession(sid, st); }

  console.log("\n" + t("check.newGreen", { tests: what }));
  // Praise first, with the (micro)skill (setup review of 12 Nov, #37); honest words (#27): independent
  // only at rung 0; with help "this is where the learning was" (#39); a worked example is not solved.
  const named = `${skill.title} (${skill.id})`;
  console.log("  " + (maxRung === 0 ? t("check.praise.solo", { skill: named })
    : maxRung >= 5 ? t("check.praise.fail")
      : t("check.praise.help", { rung: maxRung, skill: named, concept: helpConcept ?? skill.id })));
  console.log("  " + t("check.logged", { id: skill.id, tid: task.tid, rung: maxRung }));
  for (const m of after.messages) console.log("  " + m);
  // The explanation as an invitation, not as a condition (#37). With help, it is about the point where
  // the help was needed (#28).
  console.log("  " + t(maxRung > 0 ? "check.explainHelp" : "check.explain"));
  // What becomes possible once this task is explained (setup review §9.2): the harness then makes
  // the proposal itself, right after the explanation, and the learner confirms with "ja, doorzetten".
  // Otherwise how far the next level is, in steps (#35).
  const adv = levelAdvice(data, skill, { assume: [task.tid] });
  const parent = isMicro(skill) ? findSkill(data, skill.parent) : null;
  if (adv?.dir === "up") console.log("  " + t("check.signal", { text: adv.text, id: adv.id, from: adv.from, to: adv.to }));
  else if (adv?.dir === "transfer") console.log("  " + t("check.transfer", { text: adv.text, show: adv.show }));
  else {
    const lines = [skill, parent].map((s) => progressLine(progressOf(data, s, { assume: [task.tid] }))).filter(Boolean);
    const stt = taskStats(skill.id, 10, isMicro(skill) ? null : data);
    if (lines.length) lines.forEach((l) => console.log("  " + l));
    else if (stt.n) console.log("  " + t("check.stand", { id: skill.id, ok: stt.ok, n: stt.n }));
  }
  // Claude sees this output too: the instruction to signal what went well (#37).
  if (maxRung < 5) console.log("  " + t("check.claude", { how: maxRung === 0 ? t("check.claude.solo") : t("check.claude.help", { rung: maxRung }) }));
}
