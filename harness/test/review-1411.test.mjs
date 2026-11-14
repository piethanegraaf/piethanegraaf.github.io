// Setup review of 14 November 2026, after the first session on the class diagram of the final assignment.
// #63 solved (rung 0-2) and independent (rung 0) apart, on every level, and both numbers shown;
// #64 the AI-use log is committed by a fixed script (commit-log.mjs), only that folder;
// #65 a session that only updated the dashboard needs no (catch-up) diary;
// #66 with a catch-up diary on offer, the confidence question waits for the answer to it;
// #67 a keyword inside a longer keyword of another skill does not count ("class diagram" is not "class ").
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { HARNESS, makeProject, fakeSkills, decision } from "./helpers.mjs";
import { isSolved, isIndependent, verdictKey, keywordHits } from "../hooks/lib.mjs";
import { commitLog } from "../hooks/commit-log.mjs";

const SID = "14111411-aaaa-bbbb-cccc-ddddeeeeffff";
const slash = (p) => p.split(path.sep).join("/");
const tmp = (name) => fs.mkdtempSync(path.join(os.tmpdir(), `leerharnas-${name}-`));
const rm = (...dirs) => dirs.forEach((d) => fs.rmSync(d, { recursive: true, force: true }));
const ctxOf = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";
// Run a few lines of ES module code against lib.mjs in the temp project (lib reads its env at import).
function probe(p, body) {
  const lib = JSON.stringify(slash(path.join(HARNESS, "hooks", "lib.mjs")).replace(/^([A-Za-z]):/, "file:///$1:"));
  const code = `const L = await import(${lib}); const out = await (async () => { ${body} })(); console.log(JSON.stringify(out));`;
  const r = spawnSync(process.execPath, ["--input-type=module", "-e", code], { env: p.env, cwd: p.root, encoding: "utf8" });
  assert.equal(r.status, 0, r.stderr);
  return JSON.parse(r.stdout.trim().split("\n").pop());
}
const task = (tid, skill, level, maxRung, extra = {}) => ({ type: "task", tid, skill, level, success: maxRung < 5, maxRung, source: "af", at: `2026-11-1${tid.length}T10:00:00.000Z`, ...extra });
const explained = (tid, skill) => ({ type: "task-explained", tid, skill });

// ---------- #63 solved and independent apart ----------

test("#63: solved is rung 0-2 on every level, independent is rung 0 only", () => {
  for (const level of ["L1", "L2", "L3", "L4"]) {
    assert.equal(isSolved({ success: true, maxRung: 1, level }), true, `${level}: a Socratic question still solves it`);
    assert.equal(isIndependent({ success: true, maxRung: 1, level }), false, `${level}: but not independently`);
    assert.equal(isIndependent({ success: true, maxRung: 0, level }), true, level);
  }
  assert.equal(isSolved({ success: true, maxRung: 3, level: "L2" }), false);
  assert.equal(isIndependent({ success: false, maxRung: 0 }), false);
});

test("#63: the verdict never calls help independent", () => {
  assert.equal(verdictKey({ success: true, maxRung: 0 }), "pg.verdict.solo");
  assert.equal(verdictKey({ success: true, maxRung: 1 }), "pg.verdict.ok");
  assert.equal(verdictKey({ success: true, maxRung: 3 }), "pg.verdict.help");
  assert.equal(verdictKey({ success: false, maxRung: 5 }), "pg.verdict.fail");
  for (const lang of ["nl", "en"]) {
    const i18n = JSON.parse(fs.readFileSync(path.join(HARNESS, "i18n", `${lang}.json`), "utf8"));
    // "rung > 2 does not count as independent" suggested that rung 1-2 does (14 Nov).
    assert.doesNotMatch(i18n["pg.verdict.help"], /> 2/, lang);
    for (const k of ["pg.head.stats", "ss.rate", "cli.row.rate"]) assert.match(i18n[k], /\{solo\}/, `${lang} ${k}`);
  }
});

test("#63: the stats count solved and, apart, independent; a task with a hint on L3 is solved, not independent", () => {
  const p = makeProject({ events: [
    task("a1", "demo.l3", "L3", 0), explained("a1", "demo.l3"),
    task("a22", "demo.l3", "L3", 0), explained("a22", "demo.l3"),
    task("a333", "demo.l3", "L3", 1), explained("a333", "demo.l3"),
  ] });
  try {
    const r = probe(p, `const d = L.loadSkills(); const s = L.taskStats("demo.l3", 10, d); return { ok: s.ok, solo: s.solo, n: s.n, adv: L.levelAdvice(d, L.findSkill(d, "demo.l3"))?.dir ?? null };`);
    assert.deepEqual({ ok: r.ok, solo: r.solo, n: r.n }, { ok: 3, solo: 2, n: 3 });
    assert.notEqual(r.adv, "down", "help on L3 is no reason to go down");
    const s = p.cli("skill.mjs", ["status"]);
    assert.equal(s.code, 0, s.stderr);
  } finally { p.cleanup(); }
});

test("#63: the prompt gate shows solved and independent next to the level", () => {
  const p = makeProject({ events: [
    task("a1", "demo.l3", "L3", 0), explained("a1", "demo.l3"),
    task("a22", "demo.l3", "L3", 1), explained("a22", "demo.l3"),
  ] });
  try {
    const r = p.hook("prompt-gate.mjs", { session_id: SID, prompt: "ik werk aan #demo.l3" });
    assert.match(ctxOf(r), /gelukt 2\/2, waarvan zelfstandig 1/);
  } finally { p.cleanup(); }
});

test("#63: the diary template no longer calls rung 0-2 independent", () => {
  for (const lang of ["nl", "en"]) {
    const src = fs.readFileSync(path.join(HARNESS, "skills", "diary", `SKILL.${lang}.md`), "utf8");
    assert.doesNotMatch(src, /\((zelfstandig|independently)\):\*\*/, lang);
    assert.match(src, lang === "nl" ? /alleen bij trede 0/ : /only at rung 0/, lang);
  }
});

// ---------- #67 keywords inside a longer keyword ----------

test("#67: 'class diagrammen' is the class diagram, not the 'class ' of classes; 'klassendiagram' is not 'klasse'", () => {
  const kw = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", "ood", "keywords.json"), "utf8"));
  const best = (s) => [...keywordHits(s, kw)].filter(([id]) => !id.startsWith("_")).sort((a, b) => b[1] - a[1])[0]?.[0];
  assert.equal(best("vandaag wil ik de class diagrammen verder gaan uitwerken"), "uml.klassendiagram");
  assert.equal(best("het klassendiagram is af"), "uml.klassendiagram");
  assert.equal(best("een klasse met een property"), "ood.klassen-properties");
  // A keyword that also occurs on its own still counts.
  const hits = keywordHits("de class diagram en een class met een veld", kw);
  assert.equal(hits.get("ood.klassen-properties"), 2);
});

// ---------- #65 a session that only updated the dashboard ----------

test("#65: a session that only ran the dashboard export gets no catch-up; a session with work still does", () => {
  const old = Date.now() - 3 * 3600000;
  const OTHER = "22222222-aaaa-bbbb-cccc-ddddeeeeffff";
  const p = makeProject({
    sessions: { [SID]: { activeMs: 13 * 60000, endedAt: old }, [OTHER]: { activeMs: 13 * 60000, endedAt: old } },
    events: [
      { type: "graded-session", why: "project", session: SID }, { type: "dashboard-export", session: SID },
      { type: "graded-session", why: "project", session: OTHER },
    ],
  });
  try {
    const r = probe(p, `const d = L.loadSkills(); return { a: L.sessionWork(${JSON.stringify(SID)}).has, b: L.sessionWork(${JSON.stringify(OTHER)}).has, c: L.catchUpSessions(d, "now", { limit: 5 }).map((x) => x.sid) };`);
    assert.equal(r.a, false);
    assert.equal(r.b, true);
    assert.deepEqual(r.c, [OTHER]);
  } finally { p.cleanup(); }
});

test("#65: the guard logs the dashboard export (not a dry run) for the session", () => {
  const p = makeProject();
  const repo = tmp("dash");
  try {
    fs.mkdirSync(path.join(repo, "harness"), { recursive: true });
    fs.writeFileSync(path.join(repo, "harness", "export.mjs"), "");
    const run = (c) => p.hook("guard.mjs", { session_id: SID, tool_name: "Bash", tool_input: { command: c }, cwd: p.root });
    assert.equal(decision(run(`node "${slash(repo)}/harness/export.mjs" "${slash(p.root)}" --dry-run`)), "allow");
    assert.equal(p.events().filter((e) => e.type === "dashboard-export").length, 0);
    assert.equal(decision(run(`node "${slash(repo)}/harness/export.mjs" "${slash(p.root)}"`)), "allow");
    assert.deepEqual(p.events().filter((e) => e.type === "dashboard-export").map((e) => e.session), [SID]);
  } finally { p.cleanup(); rm(repo); }
});

// ---------- #66 confidence after the catch-up ----------

test("#66: with a catch-up on offer the session start asks for the goal and confidence only after it", () => {
  const old = Date.now() - 3 * 3600000;
  const OTHER = "33333333-aaaa-bbbb-cccc-ddddeeeeffff";
  const p = makeProject({ sessions: { [OTHER]: { activeMs: 30 * 60000, endedAt: old } }, events: [{ type: "hint-unlock", rung: 1, session: OTHER }] });
  try {
    const r = p.hook("session-start.mjs", { session_id: SID, source: "startup" });
    const ctx = ctxOf(r) || r.stdout;
    assert.match(ctx, /inhaaldagboek/);
    assert.match(ctx, /pas in een VOLGEND bericht/);
  } finally { p.cleanup(); }
});

// ---------- #64 commit-log.mjs ----------

function gitRepo() {
  const remote = tmp("remote"), repo = tmp("work");
  const g = (cwd, ...a) => { const r = spawnSync("git", a, { cwd, encoding: "utf8" }); assert.equal(r.status, 0, r.stderr); return r.stdout.trim(); };
  g(remote, "init", "-q", "--bare");
  g(repo, "init", "-q");
  g(repo, "config", "user.email", "test@example.com"); g(repo, "config", "user.name", "Test");
  g(repo, "config", "commit.gpgsign", "false");
  fs.writeFileSync(path.join(repo, "Program.cs"), "// work\n");
  g(repo, "add", "."); g(repo, "commit", "-q", "-m", "start");
  g(repo, "remote", "add", "origin", remote);
  g(repo, "push", "-q", "-u", "origin", "HEAD");
  fs.mkdirSync(path.join(repo, "ai-verantwoording"));
  return { repo, remote, g, logDir: slash(path.join(repo, "ai-verantwoording")), done: () => rm(repo, remote) };
}

test("#64: commit-log commits only the log folder, with a fixed message, and pushes when that is the only new commit", () => {
  const R = gitRepo();
  try {
    fs.writeFileSync(path.join(R.repo, "ai-verantwoording", "logboek.md"), "| rij |\n");
    fs.writeFileSync(path.join(R.repo, "Program.cs"), "// work, changed by the student\n");
    const r = commitLog({ logDir: R.logDir }, { push: true });
    assert.equal(r.code, 0, r.messages.join("\n"));
    assert.equal(R.g(R.repo, "show", "--name-only", "--format=", "HEAD"), "ai-verantwoording/logboek.md");
    assert.match(R.g(R.repo, "log", "-1", "--format=%s%n%b"), /AI-verantwoording bijgewerkt[\s\S]*commit-log\.mjs/);
    assert.match(R.g(R.repo, "status", "--porcelain"), /Program\.cs/, "the student's change stays uncommitted");
    assert.equal(R.g(R.repo, "rev-list", "@{u}..HEAD"), "", "pushed");
    // Nothing new: nothing to do.
    assert.equal(commitLog({ logDir: R.logDir }).code, 0);
  } finally { R.done(); }
});

test("#64: commit-log refuses when the student staged something, and does not push the student's own commits", () => {
  const R = gitRepo();
  try {
    fs.writeFileSync(path.join(R.repo, "Program.cs"), "// staged work\n");
    R.g(R.repo, "add", "Program.cs");
    fs.writeFileSync(path.join(R.repo, "ai-verantwoording", "logboek.md"), "| rij |\n");
    let r = commitLog({ logDir: R.logDir }, { push: true });
    assert.equal(r.code, 1);
    assert.equal(R.g(R.repo, "rev-list", "--count", "HEAD"), "1", "no commit");
    R.g(R.repo, "commit", "-q", "-m", "eigen werk");
    r = commitLog({ logDir: R.logDir }, { push: true });
    assert.equal(r.code, 0, r.messages.join("\n"));
    assert.equal(R.g(R.repo, "rev-list", "--count", "@{u}..HEAD"), "2", "not pushed: the student's commit is theirs to push");
    assert.match(r.messages.join("\n"), /1 eigen commit/);
  } finally { R.done(); }
});

test("#64: the guard allows only this copy of commit-log.mjs in graded work, logs it as tooling, and still blocks git commit", () => {
  const repo = tmp("graded");
  const p = makeProject({ files: { ".claude/hooks/commit-log.mjs": "" } });
  try {
    const data = p.skills();
    data.settings.graded = { paths: [slash(p.root)], aiLevel: 1 };
    fs.writeFileSync(path.join(p.learn, "skills.json"), JSON.stringify(data));
    const run = (c) => p.hook("guard.mjs", { session_id: SID, tool_name: "Bash", tool_input: { command: c }, cwd: p.root });
    assert.equal(decision(run("node .claude/hooks/commit-log.mjs --push")), "allow");
    assert.deepEqual(p.events().filter((e) => e.type === "graded-tooling").map((e) => e.cmd), ["node .claude/hooks/commit-log.mjs --push"]);
    fs.mkdirSync(path.join(repo, "x"), { recursive: true });
    fs.writeFileSync(path.join(repo, "commit-log.mjs"), "");
    run(`node "${slash(repo)}/commit-log.mjs"`);
    assert.equal(p.events().filter((e) => e.type === "graded-tooling").length, 1, "another script with that name is no tooling");
    assert.equal(decision(run("git add ai-verantwoording && git commit -m x")), "deny");
  } finally { p.cleanup(); rm(repo); }
});
