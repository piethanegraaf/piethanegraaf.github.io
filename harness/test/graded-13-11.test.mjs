// Graded work, setup of 13 November 2026 (OER art. 7.11, AI level 1):
// #49 the hint ladder up to rung 4 for every skill, never a worked solution, Claude writes nothing;
// #50 the AI-use log in the repo (one row per answer, the export of the session, the README);
// #53 one record for two folders (learningDir);
// #54 the guard also protects graded files outside the project.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { HARNESS, HOOKS, makeProject, fakeSkills, decision, run } from "./helpers.mjs";

const SID = "abcdef12-3456-7890-abcd-ef1234567890";
const slash = (p) => p.split(path.sep).join("/");
const tmp = (name) => fs.mkdtempSync(path.join(os.tmpdir(), `leerharnas-${name}-`));
const rm = (...dirs) => dirs.forEach((d) => fs.rmSync(d, { recursive: true, force: true }));
const ctxOf = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";

// A project (the practice folder) and a repo of the assignment outside it, marked as graded with an absolute path.
function setup({ graded = {}, sessions = {}, inProject = false, skills = null, files = { "opdrachten/04-auto/Auto.cs": "", "opdrachten/03-zelf/Zelf.cs": "" } } = {}) {
  const repo = tmp("repo");
  fs.mkdirSync(path.join(repo, "Domain"), { recursive: true });
  fs.writeFileSync(path.join(repo, "Domain", "Bank.cs"), "class Bank {}\n");
  const base = skills ?? fakeSkills();
  const p = makeProject({ skills: base, sessions, files });
  const target = inProject ? p.root : repo;
  const data = p.skills();
  data.settings.graded = { paths: [slash(target)], aiLevel: 1, maxRung: 4, ...graded };
  fs.writeFileSync(path.join(p.learn, "skills.json"), JSON.stringify(data, null, 2));
  return { p, repo, target, done: () => { p.cleanup(); rm(repo); } };
}
const write = (p, file, content = "x") => decision(p.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: file, content } }));
const bash = (p, command, cwd = p.root) => p.hook("guard.mjs", { tool_name: "Bash", tool_input: { command }, cwd });

// ---------- #54: the guard, also outside the project ----------

test("#54: without graded work the guard lets a write outside the project through (the gap)", () => {
  const { p, repo, done } = setup();
  try {
    const data = p.skills(); data.settings.graded = null;
    fs.writeFileSync(path.join(p.learn, "skills.json"), JSON.stringify(data));
    assert.equal(write(p, path.join(repo, "Domain", "Bank.cs")), "allow");
  } finally { done(); }
});

test("#54: a graded file outside the project is blocked, any file type, and no override helps", () => {
  const { p, repo, done } = setup();
  try {
    for (const f of ["Domain/Bank.cs", "Dockerfile", "README.md", ".github/workflows/ci.yml", "nieuw/Map.cs"]) {
      assert.equal(write(p, path.join(repo, f)), "deny", f);
    }
    p.cli("skill.mjs", ["override", "*", "30", "test"]);
    const r = p.hook("guard.mjs", { tool_name: "Edit", tool_input: { file_path: path.join(repo, "Domain", "Bank.cs"), old_string: "a", new_string: "b" } });
    assert.equal(decision(r), "deny");
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /OER art\. 7\.11/);
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /trede 4/);
    const ev = p.events().filter((e) => e.type === "deny" && e.graded);
    assert.ok(ev.length >= 1);
    assert.ok(ev.every((e) => !String(e.file ?? "").includes(os.homedir())), "no full home path in the event log");
  } finally { done(); }
});

test("#49: graded work inside the project: also an L4 skill and non-code files are blocked", () => {
  const { p, done } = setup({ inProject: true });
  try {
    assert.equal(write(p, p.abs("opdrachten/04-auto/Auto.cs")), "deny");
    assert.equal(write(p, p.abs("Dockerfile")), "deny");
    // The diary is the record, not the work: /diary still writes it.
    assert.equal(write(p, path.join(p.learn, "diary", "2026-11-13.md")), "allow");
    // The record itself stays the learner's, with its own message.
    const r = p.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: path.join(p.learn, "skills.json"), content: "{}" } });
    assert.match(r.json.hookSpecificOutput.permissionDecisionReason, /register/);
  } finally { done(); }
});

test("#54: shell writes in graded work are blocked, reading is not", () => {
  const { p, repo, done } = setup();
  try {
    const R = slash(repo);
    const denied = [
      `echo x > "${R}/Domain/Bank.cs"`,
      `cd "${R}" && touch Rekening.cs`,
      // mkdir moved to the allowed tooling on 13 Nov, night (#55); see test/review-1113.test.mjs.
      `cd "${R}/Domain" && mkdir Model && touch Model/A.cs`,
      `git -C "${R}" commit -m "x"`,
      `cd "${R}" && git add .`,
      `cd "${R}" && node -e "require('fs').writeFileSync('a.cs','x')"`,
      `cd "${R}" && dotnet test`,
      `dotnet build "${R}"`,
      `Set-Content -Path "${R}/Domain/Bank.cs" -Value x`,
      `cp /tmp/a.cs "${R}/Domain/"`,
    ];
    for (const c of denied) assert.equal(decision(bash(p, c)), "deny", c);
    const allowed = [`cat "${R}/Domain/Bank.cs"`, `git -C "${R}" status`, `cd "${R}" && git log --oneline -3`, `cd "${R}" && dotnet --info`, `ls "${R}"`];
    for (const c of allowed) assert.equal(decision(bash(p, c)), "allow", c);
    // A command run with the working folder inside the repo.
    assert.equal(decision(bash(p, "touch Klant.cs", path.join(repo, "Domain"))), "deny");
    assert.equal(decision(bash(p, "git diff", repo)), "allow");
  } finally { done(); }
});

test("#50: the log folder is blocked for Claude, also when it is outside the graded paths", () => {
  const logDir = tmp("log");
  const { p, done } = setup({ graded: { logDir: slash(logDir) } });
  try {
    assert.equal(write(p, path.join(logDir, "logboek.md")), "deny");
    assert.equal(decision(bash(p, `echo "| x |" >> "${slash(logDir)}/logboek.md"`)), "deny");
  } finally { done(); rm(logDir); }
});

test("#53: a record in another folder (learningDir) is protected like the own one", () => {
  const { p, done } = setup();
  const other = tmp("other");
  try {
    // The project uses the record of p (LEERHARNAS_DATA), but its root is another folder.
    const env = { LEERHARNAS_ROOT: other };
    const g = (input) => decision(run(path.join(HOOKS, "guard.mjs"), [], { input: JSON.stringify(input), env: { ...p.env, ...env }, cwd: other }));
    assert.equal(g({ tool_name: "Write", tool_input: { file_path: path.join(p.learn, "skills.json"), content: "{}" } }), "deny");
    assert.equal(g({ tool_name: "Write", tool_input: { file_path: path.join(p.learn, "state", "events.jsonl"), content: "" } }), "deny");
    assert.equal(g({ tool_name: "Bash", tool_input: { command: `echo x > "${slash(p.learn)}/skills.json"` }, cwd: other }), "deny");
    assert.equal(g({ tool_name: "Write", tool_input: { file_path: path.join(p.learn, "diary", "2026-11-13.md"), content: "" } }), "allow");
  } finally { done(); rm(other); }
});

test("#49: Claude cannot change the graded setting; the learner can, and it is logged", () => {
  const { p, repo, done } = setup();
  try {
    assert.equal(decision(bash(p, "node .claude/hooks/skill.mjs setting graded off")), "deny");
    let r = p.cli("skill.mjs", ["setting", "graded", "maxRung", "3"]);
    assert.equal(r.code, 0, r.stderr);
    assert.equal(p.skills().settings.graded.maxRung, 3);
    assert.match(r.stdout, /trede 3/);
    r = p.cli("skill.mjs", ["setting", "graded", "maxRung", "5"]);
    assert.notEqual(r.code, 0, "rung 5 is never a ceiling");
    r = p.cli("skill.mjs", ["setting", "graded", "add", slash(path.join(repo, "Extra"))]);
    assert.equal(p.skills().settings.graded.paths.length, 2);
    r = p.cli("skill.mjs", ["setting", "graded", "off"]);
    assert.equal(p.skills().settings.graded, null);
    assert.equal(write(p, path.join(repo, "Domain", "Bank.cs")), "allow");
    assert.ok(p.events().filter((e) => e.type === "setting" && e.key === "graded").length >= 3);
  } finally { done(); }
});

// ---------- #49: the hint ladder ----------

const prompt = (p, text, cwd) => p.hook("prompt-gate.mjs", { session_id: SID, prompt: text, ...(cwd ? { cwd } : {}) });

test("#49: in graded work an L3 and an L4 skill get the ladder of L2", () => {
  const { p, done } = setup({ inProject: true });
  try {
    const r = prompt(p, "Ik snap opdrachten/03-zelf niet, kun je een hint geven?");
    assert.match(ctxOf(r), /BEOORDEELD WERK/);
    assert.match(ctxOf(r), /Trede 1 ontgrendeld/);
    assert.equal(p.session(SID).graded, true);
    assert.equal(p.session(SID).rung, 1);
    assert.ok(p.events().some((e) => e.type === "graded-session" && e.why === "project"));
  } finally { done(); }
});

test("#49: no rung 5 in graded work; asking for the solution is refused with the OER", () => {
  const { p, done } = setup({ inProject: true, files: {}, sessions: { [SID]: { graded: true, rung: 4, maxRung: 4, activeSkill: "demo.l2", startedAt: Date.now(), lastRungAt: Date.now() } } });
  try {
    const r = prompt(p, "Geef me gewoon de oplossing, ik ben er klaar mee");
    assert.doesNotMatch(ctxOf(r), /Trede 5 ontgrendeld/);
    assert.match(ctxOf(r), /OER/);
    assert.equal(p.session(SID).rung, 4);
    assert.ok(p.events().some((e) => e.type === "graded-solution-refused"));
    const r2 = prompt(p, "Ik heb dit geprobeerd: de lus stopt niet. Nog een hint?");
    assert.match(ctxOf(r2), /het hoogste wat bij beoordeeld werk mag/);
    assert.equal(p.session(SID).rung, 4);
  } finally { done(); }
});

test("#49: a lower ceiling (maxRung 3) also holds for 'more explanation'", () => {
  const { p, done } = setup({ inProject: true, files: {}, graded: { maxRung: 3 }, sessions: { [SID]: { graded: true, rung: 2, maxRung: 2, activeSkill: "demo.l2", attempted: true, startedAt: Date.now(), lastRungAt: Date.now() } } });
  try {
    prompt(p, "Ik heb het geprobeerd maar het lukt niet, kun je het uitgebreider uitleggen? Een hint graag.");
    assert.ok(p.session(SID).rung <= 3);
    prompt(p, "Ik heb nog iets geprobeerd, de test blijft rood. Nog een hint?");
    assert.ok(p.session(SID).rung <= 3);
  } finally { done(); }
});

test("#49: AI level 0 gives no help at all", () => {
  const { p, done } = setup({ inProject: true, graded: { aiLevel: 0 } });
  try {
    const r = prompt(p, "Kun je een hint geven voor 02-lijst?");
    assert.match(ctxOf(r), /AI-niveau 0/);
    assert.equal(p.session(SID).rung, 0);
  } finally { done(); }
});

test("#49: a practice session becomes graded when the prompt names the folder of the assignment", () => {
  const { p, repo, done } = setup();
  try {
    const r1 = prompt(p, "Een hint voor 02-lijst graag?");
    assert.doesNotMatch(ctxOf(r1), /BEOORDEELD WERK/);
    const name = path.basename(repo);
    const r2 = prompt(p, `Nu iets over ${name}: hoe pak ik de klasse Bank aan?`);
    assert.match(ctxOf(r2), /BEOORDEELD WERK/);
    assert.ok(p.events().some((e) => e.type === "graded-session" && e.why === "prompt"));
  } finally { done(); }
});

test("#49: outside graded work the ladder is unchanged (rung 5 after confirmation)", () => {
  const { p, done } = setup({ files: {}, sessions: { [SID]: { rung: 4, maxRung: 4, activeSkill: "demo.l2", startedAt: Date.now(), lastRungAt: Date.now() } } });
  try {
    const r = prompt(p, "Geef me gewoon de oplossing");
    assert.match(ctxOf(r), /Trede 5 ontgrendeld/);
  } finally { done(); }
});

// ---------- #50: the AI-use log ----------

const user = (text, uuid, ts) => ({ type: "user", uuid, timestamp: ts, message: { role: "user", content: text } });
const assistant = (text, ts, model = "claude-opus-5-5") => ({ type: "assistant", timestamp: ts, message: { role: "assistant", model, content: [{ type: "text", text }] } });
const tool = (name, input, ts) => ({ type: "assistant", timestamp: ts, message: { role: "assistant", model: "claude-opus-5-5", content: [{ type: "tool_use", id: "t", name, input }] } });
const result = (text, ts) => ({ type: "user", timestamp: ts, message: { role: "user", content: [{ type: "tool_result", tool_use_id: "t", content: text }] } });

function logProject({ graded = true, transcript }) {
  const home = tmp("home");
  const s = setup({ inProject: true, sessions: { [SID]: { graded, rung: 0, maxRung: 0, activeSkill: "demo.l2", startedAt: Date.now() } } });
  const file = path.join(s.p.root, "transcript.jsonl");
  const put = (entries) => fs.writeFileSync(file, entries.map((e) => JSON.stringify(e)).join("\n") + "\n");
  put(transcript(home));
  const stop = (last, extra = {}) => s.p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, ...(last !== undefined ? { last_assistant_message: last } : {}), ...extra },
    { USERPROFILE: home, HOME: home });
  const logDir = path.join(s.target, "ai-verantwoording");
  return { ...s, home, stop, put, logDir, read: (rel) => fs.readFileSync(path.join(logDir, rel), "utf8"), done: () => { s.done(); rm(home); } };
}

test("#50: every answer gets a row, the session an export, and the folder a README", () => {
  const t0 = "2026-11-13T09:00:00.000Z", t1 = "2026-11-13T09:01:00.000Z";
  const lp = logProject({ transcript: (home) => [
    user(`Ik krijg een fout in ${home}${path.sep}source${path.sep}Bank.cs, mail me op jan@example.com <system-reminder>geheime hookinhoud</system-reminder>`, "u1", t0),
    tool("Read", { file_path: "Domain/Bank.cs" }, t1),
    result("class Bank { private int saldo; } // UITVOER VAN EEN TOOL", t1),
    assistant("Kijk naar dit voorbeeld over een thermostaat:\n```cs\n    if (t > max) t = max;\n```\n[trede 4]", t1),
  ] });
  try {
    const r = lp.stop();
    assert.equal(r.code, 0, r.stderr);
    const log = lp.read("logboek.md");
    assert.match(log, /\| Datum en tijd \| Sessie \| Vaardigheid \| Trede \| Soort hulp \| Wat ik ermee deed \/ hoe gecontroleerd \|/);
    const rows = log.split("\n").filter((l) => l.includes("[abcdef12]("));
    assert.equal(rows.length, 1);
    assert.match(rows[0], /\| demo\.l2 \| 4 \| codevoorbeeld \(trede 4\) \|  \|$/);
    const sessions = fs.readdirSync(path.join(lp.logDir, "sessies"));
    assert.equal(sessions.length, 1);
    assert.match(sessions[0], /^2026-11-1[23]-abcdef12\.md$/);
    const exp = lp.read(`sessies/${sessions[0]}`);
    assert.match(exp, /Claude Opus 5\.5/);
    assert.match(exp, /> Ik krijg een fout in ~[\\/]source[\\/]Bank\.cs/);
    assert.doesNotMatch(exp, new RegExp(lp.home.replace(/[\\]/g, "\\\\")));
    assert.match(exp, /\[e-mail\]/);
    assert.doesNotMatch(exp, /geheime hookinhoud/);
    assert.doesNotMatch(exp, /UITVOER VAN EEN TOOL/);
    assert.match(exp, /    if \(t > max\) t = max;/, "the indentation of an example stays");
    const readme = lp.read("README.md");
    assert.match(readme, /Anthropic\. \(\d{4}\)\. \*Claude\* \(Claude Opus 5\.5\) \[Groot taalmodel\]/);
    assert.match(readme, /geen deellink/);
    assert.match(readme, /trede 4: mini-voorbeeld/);
    assert.doesNotMatch(readme, /trede 5/);
  } finally { lp.done(); }
});

test("#50: a second Stop for the same prompt replaces its row; a new prompt adds one", () => {
  const t0 = "2026-11-13T09:00:00.000Z";
  const base = [user("Hoe begin ik aan de klasse Rekening?", "u1", t0)];
  const lp = logProject({ transcript: () => base });
  try {
    lp.stop("Wat denk je zelf dat de verantwoordelijkheid is? [trede 1]");
    lp.stop("Wat denk je zelf dat de verantwoordelijkheid is? [trede 1] En kijk naar het concept inkapseling. [trede 2]", { stop_hook_active: true });
    let rows = lp.read("logboek.md").split("\n").filter((l) => l.includes("[abcdef12]("));
    assert.equal(rows.length, 1);
    assert.match(rows[0], /\| 2 \| concept\/naslag \|/);
    lp.put([...base, assistant("[trede 2]", t0), user("Ik heb nu een eigen poging, klopt dit?", "u2", t0)]);
    lp.stop("Een vraag terug: wat gebeurt er bij een negatief bedrag? [trede 1]");
    rows = lp.read("logboek.md").split("\n").filter((l) => l.includes("[abcdef12]("));
    assert.equal(rows.length, 2);
    // The student's own text in the last column is kept when a new row is added.
    const text = lp.read("logboek.md").replace(/\|  \|\n/, "| Zelf nagelopen met de test. |\n");
    fs.writeFileSync(path.join(lp.logDir, "logboek.md"), text);
    lp.put([...base, user("Nog een vraag", "u3", t0)]);
    lp.stop("Wat zegt de foutmelding precies?");
    assert.match(lp.read("logboek.md"), /Zelf nagelopen met de test\./);
    assert.equal(lp.read("logboek.md").split("\n").filter((l) => l.includes("[abcdef12](")).length, 3);
  } finally { lp.done(); }
});

test("#50: the README waits for the model, is written once, and is then left alone", () => {
  const t0 = "2026-11-13T09:00:00.000Z";
  const base = [user("Een vraag", "u1", t0)];
  const lp = logProject({ transcript: () => base });
  try {
    // The transcript has no answer of Claude yet (not flushed): no model, so no README yet; the row is there.
    lp.stop("Wat heb je al geprobeerd?");
    assert.equal(fs.existsSync(path.join(lp.logDir, "README.md")), false);
    assert.match(lp.read("logboek.md"), /\[abcdef12\]\(/);
    lp.put([...base, assistant("Wat heb je al geprobeerd?", t0, "claude-sonnet-5-5"), user("Dit", "u2", t0)]);
    lp.stop("Nog een vraag terug.");
    assert.match(lp.read("README.md"), /\*Claude\* \(Claude Sonnet 5\.5\)/);
    assert.match(lp.read("README.md"), /\n    - trede 1: /, "the ladder is a nested list");
    fs.writeFileSync(path.join(lp.logDir, "README.md"), "Mijn eigen tekst\n");
    lp.stop("En nog een.");
    assert.equal(lp.read("README.md"), "Mijn eigen tekst\n");
  } finally { lp.done(); }
});

test("#50: a session that is not about graded work writes no log", () => {
  const lp = logProject({ graded: false, transcript: () => [user("Hint voor 02-lijst?", "u1", "2026-11-13T09:00:00.000Z")] });
  try {
    // The project itself is graded here, but only prompt-gate marks the session; this Stop sees no graded tool use.
    const data = lp.p.skills(); data.settings.graded.paths = [slash(path.join(lp.repo, "elders"))];
    fs.writeFileSync(path.join(lp.p.learn, "skills.json"), JSON.stringify(data));
    lp.stop("Wat zegt de test? [trede 1]");
    assert.equal(fs.existsSync(path.join(lp.repo, "elders", "ai-verantwoording")), false);
  } finally { lp.done(); }
});

test("#50: reading a graded file in a practice session makes the session graded and logs it", () => {
  const t0 = "2026-11-13T09:00:00.000Z";
  const s = setup({ sessions: { [SID]: { rung: 0, maxRung: 0, activeSkill: "demo.l2", startedAt: Date.now() } } });
  try {
    const file = path.join(s.p.root, "transcript.jsonl");
    fs.writeFileSync(file, [user("Kijk eens naar mijn Bank", "u1", t0), tool("Read", { file_path: path.join(s.repo, "Domain", "Bank.cs") }, t0)]
      .map((e) => JSON.stringify(e)).join("\n") + "\n");
    s.p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: "Wat moet Bank volgens jou bewaken? [trede 1]" });
    assert.equal(s.p.session(SID).graded, true);
    assert.ok(fs.existsSync(path.join(s.repo, "ai-verantwoording", "logboek.md")));
  } finally { s.done(); }
});

test("#50: a rung above the ceiling is logged honestly and the student is told", () => {
  const lp = logProject({ transcript: () => [user("Een vraag", "u1", "2026-11-13T09:00:00.000Z")] });
  try {
    const r = lp.stop("Hier is de uitwerking. [trede 5]");
    assert.match(r.json?.systemMessage ?? "", /hooguit trede 4/);
    assert.match(lp.read("logboek.md"), /\| 5 \| uitwerking \(trede 5, niet toegestaan\) \|/);
  } finally { lp.done(); }
});

// ---------- #53: one record for two folders ----------

test("#53: install --learning-dir: no own .learning, the local config is not in git, --update keeps it", () => {
  const practice = makeProject();
  const repo = tmp("repo-install");
  const clean = () => { const e = { ...process.env }; delete e.LEERHARNAS_ROOT; delete e.LEERHARNAS_DATA; return e; };
  const install = (...args) => run(path.join(HARNESS, "install.mjs"), [repo, ...args], { env: clean() });
  try {
    let r = install("--learning-dir", "relatief/pad", "--yes");
    assert.notEqual(r.code, 0);
    r = install("--learning-dir", practice.learn, "--yes");
    assert.equal(r.code, 0, r.stderr + r.stdout);
    assert.equal(fs.existsSync(path.join(repo, ".learning")), false);
    const local = JSON.parse(fs.readFileSync(path.join(repo, ".claude", "leerharnas.local.json"), "utf8"));
    assert.equal(path.resolve(local.learningDir), path.resolve(practice.learn));
    assert.match(fs.readFileSync(path.join(repo, ".gitignore"), "utf8"), /^\.claude\/leerharnas\.local\.json$/m);
    assert.doesNotMatch(fs.readFileSync(path.join(repo, ".claude", "leerharnas.json"), "utf8"), /learningDir/);
    // The installed hooks find the record of the practice folder on their own.
    const list = run(path.join(repo, ".claude", "hooks", "skill.mjs"), ["list"], { env: clean(), cwd: repo });
    assert.equal(list.code, 0, list.stderr);
    assert.match(list.stdout, /demo\.l2/);
    const ss = run(path.join(repo, ".claude", "hooks", "session-start.mjs"), [], { input: "{}", env: clean(), cwd: repo });
    assert.match(ss.json.hookSpecificOutput.additionalContext, /learningDir/);
    r = install("--update", "--yes");
    assert.equal(r.code, 0, r.stderr + r.stdout);
    assert.ok(fs.existsSync(path.join(repo, ".claude", "leerharnas.local.json")));
    assert.equal(fs.existsSync(path.join(repo, ".learning")), false);
    // The guard of the repo protects the record in the practice folder.
    const g = run(path.join(repo, ".claude", "hooks", "guard.mjs"), [], { input: JSON.stringify({ tool_name: "Write", tool_input: { file_path: path.join(practice.learn, "skills.json"), content: "{}" } }), env: clean(), cwd: repo });
    assert.equal(decision(g), "deny");
  } finally { practice.cleanup(); rm(repo); }
});

// ---------- lib: the setting, checked ----------

test("gradedOf: the ceiling is at most 4, AI level 0 means no help, relative paths are relative to the project", async () => {
  const p = makeProject();
  try {
    const src = `
      import { gradedOf, isGradedPath, isGradedDir, mentionsGraded, ROOT } from ${JSON.stringify("file:///" + slash(path.join(HOOKS, "lib.mjs")))};
      const g = (graded) => gradedOf({ settings: { graded }, skills: [] });
      const out = {
        off: g(null), empty: g({ paths: [] }),
        cap: g({ paths: ["/x/repo"], maxRung: 7 }).maxRung, def: g({ paths: ["/x/repo"] }).maxRung, three: g({ paths: ["/x/repo"], maxRung: 3 }).maxRung,
        zero: g({ paths: ["/x/repo"], aiLevel: 0, maxRung: 4 }).maxRung,
        rel: isGradedPath({ settings: { graded: { paths: ["werk/**"] } }, skills: [] }, "werk/a/B.cs"),
        relOut: isGradedPath({ settings: { graded: { paths: ["werk/**"] } }, skills: [] }, "ander/B.cs"),
        dir: isGradedDir({ settings: { graded: { paths: ["werk/**"] } }, skills: [] }, "werk"),
        similar: isGradedPath({ settings: { graded: { paths: [ROOT + "/repo"] } }, skills: [] }, ROOT + "/repo2/A.cs"),
        mention: mentionsGraded(g({ paths: [ROOT + "/eindopdracht"] }), "kijk naar eindopdracht", { names: true }),
        noMention: mentionsGraded(g({ paths: [ROOT + "/eindopdracht"] }), "kijk naar eindopdrachten", { names: true }),
      };
      console.log(JSON.stringify(out));`;
    const f = path.join(p.root, "probe.mjs");
    fs.writeFileSync(f, src);
    const r = run(f, [], { env: p.env, cwd: p.root });
    assert.equal(r.code, 0, r.stderr);
    const o = JSON.parse(r.stdout);
    assert.deepEqual(o, { off: null, empty: null, cap: 4, def: 4, three: 3, zero: 0, rel: true, relOut: false, dir: true, similar: false, mention: true, noMention: false });
  } finally { p.cleanup(); }
});

test("logFilters: the home folder becomes ~ in every spelling, a longer name that starts the same does not", async () => {
  const { logFilters } = await import("../hooks/privacy.mjs");
  const home = path.join(os.tmpdir(), "jdoe");
  const scrub = (s) => logFilters({ home, priv: { terms: ["Geheim"] } }).reduce((x, f) => x.replace(f.re, f.to), s);
  assert.equal(scrub(`${home}${path.sep}src${path.sep}A.cs`), `~${path.sep}src${path.sep}A.cs`);
  assert.equal(scrub(`${slash(home)}/src`), "~/src");
  assert.equal(scrub(`${home}x${path.sep}A.cs`), `${home}x${path.sep}A.cs`);
  assert.equal(scrub("mail a.b@c.nl over Geheim"), "mail [e-mail] over [privé]");
});
