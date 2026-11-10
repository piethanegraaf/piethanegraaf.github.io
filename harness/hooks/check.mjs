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
// Claude may not run this script for L1-L3 code (guard.mjs); it is your test run.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  ROOT, TESTS_FILE, STATE_DIR, loadSkills, skillForPath, rel, keywordMap, findSkill, isMicro, familyIds,
  latestSessionId, loadSession, saveSession, logTask, logEvent, levelAdvice, taskStats,
} from "./lib.mjs";

const dirArg = process.argv[2] ?? ".";
const dir = path.resolve(process.cwd(), dirArg);
if (!fs.existsSync(dir)) { console.error(`Map niet gevonden: ${dir}`); process.exit(1); }
const relDir = rel(dir) ?? dir;

// ---------- 0. The folder decides the session skill ----------
// "!" commands never reach prompt-gate, so without this the session could stay on a skill that was
// guessed from a keyword (e.g. "unit test" in a question about cs.basis code), with the wrong level.
// maxRung is kept: help already given for this task still counts.
{
  const data = loadSkills();
  const s = skillForPath(data, path.join(dir, "__probe__", "x.cs"));
  const sid0 = latestSessionId();
  const st0 = sid0 ? loadSession(sid0) : null;
  if (s && s.kind !== "zone" && st0) {
    const active = st0.activeSkill ? findSkill(data, st0.activeSkill) : null;
    if (!active || !familyIds(data, s.id).includes(active.id)) {
      st0.activeSkill = s.id;
      saveSession(sid0, st0);
    }
  }
}

// ---------- 1. Run the tests ----------
let resDir = process.env.LEERHARNAS_TRX_DIR; // testing only: parse existing trx files
let out = "";
if (!resDir) {
  resDir = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-trx-"));
  console.log(`dotnet test in ${relDir} ...`);
  const r = spawnSync("dotnet", ["test", dir, "--logger", "trx", "--results-directory", resDir], { encoding: "utf8", maxBuffer: 32 * 1024 * 1024 });
  if (r.error) { console.error(`Kon dotnet niet starten: ${r.error.message}`); process.exit(1); }
  out = (r.stdout ?? "") + (r.stderr ?? "");
}
const trxFiles = [];
const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.trx$/i.test(e.name)) trxFiles.push(p); } };
try { walk(resDir); } catch { /* none */ }

if (!trxFiles.length) {
  const errs = [...new Set(out.split(/\r?\n/).filter((l) => /\berror\b/i.test(l)).map((l) => l.trim().replace(/\s*\[[^\]]*\.csproj[^\]]*\]$/, "")))];
  console.log(`\n✗ Bouwen mislukt of geen tests gevonden: er zijn GEEN tests gedraaid.`);
  if (errs.length) { console.log("Fouten:"); errs.slice(0, 10).forEach((e) => console.log("  " + e)); }
  else console.log(out.split(/\r?\n/).slice(-15).join("\n"));
  console.log("\nTip: los eerst de compileerfout op; zolang het niet bouwt, draait geen enkele test.");
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
let store = {};
try { store = JSON.parse(fs.readFileSync(TESTS_FILE, "utf8")); } catch { /* first run */ }
const nowIso = new Date().toISOString();
const newlyGreen = [], restored = [], newlyRed = [], baseline = [];
for (const r of results) {
  const key = `${relDir}::${r.className}.${r.name}`;
  const prev = store[key];
  const passed = r.outcome === "Passed";
  if (!prev) baseline.push(r);
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
console.log(`\nResultaat ${relDir}: ${pass.length} groen · ${fail.length} rood${other ? ` · ${other} niet uitgevoerd` : ""} (totaal ${results.length})`);
for (const r of fail) {
  console.log(`  ✗ ${r.name}`);
  const lines = r.msg.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 6);
  for (const l of lines) console.log(`      ${l}`);
}
for (const r of pass) console.log(`  ✓ ${r.name}`);
const fullNames = (list) => list.map((r) => `${r.className}.${r.name}`);
if (newlyRed.length) {
  console.log(`\n⚠ Was groen, nu rood: ${newlyRed.map((r) => r.name).join(", ")}`);
  logEvent({ type: "regression", tests: fullNames(newlyRed), dir: relDir, session: latestSessionId() });
}
if (restored.length) {
  console.log(`\n↺ Weer groen: ${restored.map((r) => r.name).join(", ")}. Deze waren eerder al groen, dus dit is herstel na een terugval en telt niet als nieuwe taak.`);
  logEvent({ type: "regression-fixed", tests: fullNames(restored), dir: relDir, session: latestSessionId() });
}
if (baseline.length && baseline.length === results.length) console.log(`\n(Eerste meting voor deze map: dit is de basislijn, er wordt nog niets als taak gelogd.)`);

// ---------- 5. Log tasks for tests that turned green ----------
if (newlyGreen.length) {
  const data = loadSkills();
  const sid = latestSessionId();
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
    console.log(`\nNieuw groen: ${newlyGreen.map((r) => r.name).join(", ")}. Geen vaardigheid gevonden voor ${relDir}: tag je prompt met #id of meld af met \`skill.mjs done <id>\`.`);
    process.exit(0);
  }
  // A more specific microskill that is active in this session wins.
  const parentId = isMicro(skill) ? skill.parent : skill.id;
  const active = st?.activeSkill ? findSkill(data, st.activeSkill) : null;
  const sameFamily = active && familyIds(data, parentId).includes(active.id);
  if (sameFamily && isMicro(active)) skill = active;
  // All help given since the last logged task counts for this task, also when the session skill
  // belonged to another family. Erring towards "more help" keeps "independent" honest (R2).
  const maxRung = st?.maxRung ?? 0;
  const what = newlyGreen.map((r) => r.name).join(", ");
  const t = logTask({ skill: skill.id, success: maxRung < 5, maxRung, source: "check", what, session: sid });
  logEvent({ type: "test-green", skill: skill.id, tid: t.tid, tests: newlyGreen.map((r) => `${r.className}.${r.name}`), dir: relDir });
  if (st) { st.rung = 0; st.maxRung = 0; st.lastRungAt = null; st.taskStartedAt = Date.now(); st.lastTaskAt = Date.now(); saveSession(sid, st); }

  console.log(`\n★ Nieuw groen: ${what}`);
  console.log(`  Gelogd als taak voor ${skill.id} [${t.tid}], hoogste trede ${maxRung}` +
    (maxRung === 0 ? " — zelfstandig, zonder hints!" : maxRung <= 2 ? " — telt als zelfstandig gelukt." : " — met veel hulp, telt niet als zelfstandig."));
  console.log(`  Telt pas mee na je uitleg in eigen woorden: waarom werkt het nu? (Claude beoordeelt, de hook controleert.)`);
  const adv = levelAdvice(data, isMicro(skill) ? skill : skill);
  const stt = taskStats(skill.id, 10, isMicro(skill) ? null : data);
  if (adv?.dir === "up") console.log(`  Doorstroom-signaal na uitleg: ${adv.text}\n    ! node .claude/hooks/skill.mjs ${adv.cmd}`);
  else if (stt.n) console.log(`  Stand ${skill.id}: ${stt.ok}/${stt.n} gelukt.`);
}
