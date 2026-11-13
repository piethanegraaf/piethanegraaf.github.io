// Review of 13 November 2026, night: the first sessions on the final assignment.
// #55 deterministic tooling in graded work (and scaffold.mjs for the arc42 template);
// #56 plan and confidence events, SessionEnd, a catch-up diary;
// #57 a task per part ("af: <what>"), work between sessions, linking by content;
// #58 more stop phrases, everything in one message, check questions;
// #59 the learner's own words in the last column of the AI-use log;
// #60 git commands that only read;
// #61 the user-level gate: graded work is closed from other folders.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import { HARNESS, makeProject, fakeSkills, decision, run } from "./helpers.mjs";
import { isEnd, confidenceOf, DONE_PREFIX } from "../hooks/patterns.mjs";
import { readZip, extractTo, scaffoldArc42, ARC42_DIGESTS, arc42Asset } from "../hooks/scaffold.mjs";

const SID = "abcdef12-3456-7890-abcd-ef1234567890";
const slash = (p) => p.split(path.sep).join("/");
const tmp = (name) => fs.mkdtempSync(path.join(os.tmpdir(), `leerharnas-${name}-`));
const rm = (...dirs) => dirs.forEach((d) => fs.rmSync(d, { recursive: true, force: true }));
const ctxOf = (r) => r.json?.hookSpecificOutput?.additionalContext ?? "";
const user = (text, uuid, ts) => ({ type: "user", uuid, timestamp: ts, message: { role: "user", content: text } });

function withUml(data) {
  data.skills.push({ id: "uml.klassendiagram", title: "Klassendiagram", level: "L2", paths: [], placement: "done" });
  return data;
}
// A project and a repo of the assignment; with inProject the project itself is the graded work.
function setup({ inProject = false, sessions = {}, files = {}, skills = null } = {}) {
  const repo = tmp("repo");
  fs.mkdirSync(path.join(repo, "Domain"), { recursive: true });
  const p = makeProject({ skills: skills ?? withUml(fakeSkills()), sessions, files });
  const target = inProject ? p.root : repo;
  const data = p.skills();
  data.settings.graded = { paths: [slash(target)], aiLevel: 1, maxRung: 4 };
  fs.writeFileSync(path.join(p.learn, "skills.json"), JSON.stringify(data, null, 2));
  return { p, repo, target, done: () => { p.cleanup(); rm(repo); } };
}
const bash = (p, command, cwd = p.root, sid = SID) => p.hook("guard.mjs", { session_id: sid, tool_name: "Bash", tool_input: { command }, cwd });

// ---------- #60 git commands that only read ----------

test("#60: git commands that only read are allowed in graded work; the same commands that write are not", () => {
  const { p, repo, done } = setup();
  try {
    const R = slash(repo);
    for (const c of ["git remote -v", "git remote", "git remote get-url origin", "git branch", "git branch -a", "git branch --show-current",
      "git branch --list 'feat*'", "git config --get user.name", "git config --list", "git stash list", "git tag", "git tag -l"]) {
      assert.equal(decision(bash(p, `git -C "${R}" ${c.replace(/^git /, "")}`)), "allow", c);
    }
    for (const c of ["git branch nieuw", "git config user.name X", "git stash", "git tag v1", "git remote remove origin", "git push", "git commit -m x"]) {
      assert.equal(decision(bash(p, `cd "${R}" && ${c}`)), "deny", c);
    }
  } finally { done(); }
});

// ---------- #55 deterministic tooling ----------

test("#55: fixed tooling is allowed in graded work and logged; content, commits and other generators stay blocked", () => {
  const { p, repo, done } = setup();
  try {
    const R = slash(repo);
    const allowed = [
      `cd "${R}" && dotnet new sln -n Webshop`,
      `cd "${R}" && dotnet new console -o Webshop.App`,
      `cd "${R}" && dotnet new nunit -o Webshop.Tests`,
      `cd "${R}" && dotnet new gitignore`,
      `cd "${R}" && dotnet sln add Webshop.App/Webshop.App.csproj`,
      `cd "${R}" && dotnet add Webshop.Tests reference Webshop.App`,
      `cd "${R}" && dotnet add Webshop.App package Serilog`,
      `git -C "${R}" init`,
      `cd "${R}" && git remote add origin https://example.com/x.git`,
      `cd "${R}" && git branch -m main`,
      `mkdir "${R}/Docs"`,
    ];
    for (const c of allowed) assert.equal(decision(bash(p, c)), "allow", c);
    const denied = [
      `cd "${R}" && dotnet new console --force`,
      `cd "${R}" && dotnet new webapi -o Api`,
      `cd "${R}" && dotnet build`,
      `cd "${R}" && git add . && git commit -m x`,
      `cd "${R}" && git push -u origin main`,
      `cd "${R}" && dotnet new gitignore > notes.txt`,
      `cd "${R}" && mkdir Model && echo x > Model/A.cs`,
    ];
    for (const c of denied) assert.equal(decision(bash(p, c)), "deny", c);
    assert.equal(decision(p.hook("guard.mjs", { session_id: SID, tool_name: "Write", tool_input: { file_path: `${R}/Docs/a.md`, content: "x" } })), "deny");
    const ev = p.events().filter((e) => e.type === "graded-tooling");
    assert.equal(ev.length, allowed.length);
    assert.ok(ev.every((e) => e.session === SID));
    assert.equal(p.session(SID).gradedTooling.length, allowed.length);
  } finally { done(); }
});

test("#55: outside graded work dotnet new is still judged as a build (L2 exercise)", () => {
  const { p, done } = setup({ files: { "opdrachten/02-lijst/Lijst.cs": "" } });
  try {
    assert.equal(decision(bash(p, "cd opdrachten/02-lijst && dotnet new console")), "deny");
  } finally { done(); }
});

test("#55: the Stop hook writes a 'tooling (no AI content)' row per allowed command, before the row of the answer", () => {
  const { p, target, done } = setup({ inProject: true, sessions: { [SID]: { graded: true, rung: 0, maxRung: 0, startedAt: Date.now() } } });
  try {
    assert.equal(decision(bash(p, "mkdir Docs", p.root)), "allow");
    assert.equal(decision(bash(p, "git init", p.root)), "allow");
    const file = path.join(p.root, "transcript.jsonl");
    fs.writeFileSync(file, JSON.stringify(user("Maak de map Docs en een git-repo", "u1", "2026-11-13T21:00:00.000Z")) + "\n");
    const r = p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: "Gedaan: de map en de repo." });
    assert.equal(r.code, 0, r.stderr);
    const rows = fs.readFileSync(path.join(target, "ai-verantwoording", "logboek.md"), "utf8").split("\n").filter((l) => l.includes("[abcdef12]("));
    assert.equal(rows.length, 3);
    assert.match(rows[0], /tooling \(geen AI-inhoud\): `mkdir Docs`/);
    assert.match(rows[1], /tooling \(geen AI-inhoud\): `git init`/);
    assert.match(rows[2], /gesprek \(geen hint\)/);
    assert.deepEqual(p.session(SID).gradedTooling, []);
  } finally { done(); }
});

// ---------- #55 scaffold.mjs ----------

// A small zip (store and deflate), enough for readZip. The CRC is not checked by readZip.
function makeZip(entries) {
  const locals = [], centrals = [];
  let offset = 0;
  for (const e of entries) {
    const name = Buffer.from(e.name);
    const data = Buffer.from(e.data ?? "");
    const comp = e.deflate ? zlib.deflateRawSync(data) : data;
    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0); lh.writeUInt16LE(20, 4); lh.writeUInt16LE(e.deflate ? 8 : 0, 8);
    lh.writeUInt32LE(comp.length, 18); lh.writeUInt32LE(data.length, 22); lh.writeUInt16LE(name.length, 26);
    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0); ch.writeUInt16LE(20, 4); ch.writeUInt16LE(20, 6); ch.writeUInt16LE(e.deflate ? 8 : 0, 10);
    ch.writeUInt32LE(comp.length, 20); ch.writeUInt32LE(data.length, 24); ch.writeUInt16LE(name.length, 28); ch.writeUInt32LE(offset, 42);
    locals.push(lh, name, comp);
    centrals.push(ch, name);
    offset += 30 + name.length + comp.length;
  }
  const cd = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(entries.length, 8); end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, cd, end]);
}

test("#55: scaffold.mjs unpacks the template unchanged, only with the pinned sha256, and never over existing work", () => {
  const dir = tmp("scaffold");
  try {
    const zip = makeZip([{ name: "01_introductie.md", data: "# 1. Introductie\n", deflate: true }, { name: "images/" }, { name: "images/logo.png", data: "PNG" }]);
    const from = path.join(dir, "arc42.zip");
    fs.writeFileSync(from, zip);
    const digests = { [arc42Asset("nl", false)]: crypto.createHash("sha256").update(zip).digest("hex") };
    const r = scaffoldArc42({ dir: path.join(dir, "arc42"), lang: "nl", digests, from });
    assert.equal(r.files, 2);
    assert.equal(fs.readFileSync(path.join(dir, "arc42", "01_introductie.md"), "utf8"), "# 1. Introductie\n");
    assert.match(r.url, /^https:\/\/github\.com\/arc42\/arc42-template\/releases\/download\/2026\.10\.19\/arc42-template-NL-plain-gitHubMarkdownMP\.zip$/);
    assert.throws(() => scaffoldArc42({ dir: path.join(dir, "arc42"), lang: "nl", digests, from }), (e) => e.code === "NOT_EMPTY");
    // The pinned digests: a zip that is not the official one is refused, whoever made it.
    assert.throws(() => scaffoldArc42({ dir: path.join(dir, "ander"), lang: "nl", from }), (e) => e.code === "DIGEST");
    assert.equal(fs.existsSync(path.join(dir, "ander")), false, "nothing is made when the file is not the official one");
    assert.throws(() => scaffoldArc42({ dir: path.join(dir, "x"), lang: "nl", digests, from: path.join(dir, "bestaat-niet.zip") }), (e) => e.code === "NO_ZIP");
    assert.throws(() => extractTo(readZip(makeZip([{ name: "../buiten.md", data: "x" }])), path.join(dir, "slip")), /unsafe name/);
    for (const v of Object.values(ARC42_DIGESTS)) assert.match(v, /^[0-9a-f]{64}$/);
    assert.equal(Object.keys(ARC42_DIGESTS).length, 4);
  } finally { rm(dir); }
});

test("#55: scaffold.mjs has no network code; without --from it shows the official link and writes nothing", () => {
  const src = fs.readFileSync(path.join(HARNESS, "hooks", "scaffold.mjs"), "utf8");
  assert.doesNotMatch(src, /(?<![\w.])fetch\s*\(|node:(http|https|net|tls)/, "the harness never goes on the network (SECURITY.md)");
  const p = makeProject();
  try {
    let r = p.cli("scaffold.mjs", []);
    assert.equal(r.code, 1);
    assert.match(r.stdout, /scaffold\.mjs arc42 <map> --from <zip>/);
    r = p.cli("scaffold.mjs", ["arc42", "Docs/arc42"]);
    assert.equal(r.code, 1);
    assert.match(r.stdout, /curl -L -o "[^"]*arc42-template-NL-plain-gitHubMarkdownMP\.zip" https:\/\/github\.com\/arc42\//);
    assert.equal(fs.existsSync(p.abs("Docs")), false);
  } finally { p.cleanup(); }
});

test("#55: a download into graded work is a write; into a temporary folder it is not", () => {
  const { p, repo, done } = setup();
  try {
    const R = slash(repo), T = slash(os.tmpdir());
    assert.equal(decision(bash(p, `curl -L -o "${R}/Docs/a.zip" https://example.com/a.zip`)), "deny");
    assert.equal(decision(bash(p, "curl -sSLO https://example.com/a.zip", repo)), "deny");
    assert.equal(decision(bash(p, `wget -P "${R}" https://example.com/a.zip`)), "deny");
    assert.equal(decision(bash(p, `curl -L -o "${T}/arc42.zip" https://example.com/a.zip`)), "allow");
  } finally { done(); }
});

// ---------- #58 stop phrases, everything in one message ----------

test("#58: other ways to say stop are recognised; a stop word inside a question is not", () => {
  for (const s of ["ik wil stoppen", "ik wil afsluiten", "Ik wil stoppen voor vandaag.", "laten we afronden", "ok ik ga stoppen", "laten we de sessie afsluiten",
    "I want to finish this session", "I want to stop", "let's wrap up", "klaar", "stoppen"]) assert.equal(isEnd(s), true, s);
  for (const s of ["hoe laat ik de loop stoppen", "ik wil stoppen met de lus als x > 5", "ik wil dat de timer stopt",
    "we gaan afronden met een test van de klasse en dan kijken hoe dat gaat met de rest", "how do I stop the thread?"]) assert.equal(isEnd(s), false, s);
});

test("#58: 'ik wil stoppen' asks for the diary with everything in one message", () => {
  const p = makeProject();
  try {
    const r = p.hook("prompt-gate.mjs", { session_id: SID, prompt: "ik wil stoppen" });
    assert.match(ctxOf(r), /alles in ÉÉN bericht[\s\S]*controlevragen[\s\S]*<!-- sessie: abcdef12/);
    assert.equal(p.session(SID).endRequested, true);
  } finally { p.cleanup(); }
});

test("#58b: a check question marker becomes an event; an unknown skill is ignored", () => {
  const p = makeProject({ sessions: { [SID]: { startedAt: Date.now(), lastPrompt: "antwoorden" } } });
  try {
    const r = p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: path.join(p.root, "geen.jsonl"),
      last_assistant_message: "Vraag 1 klopt. [controlevraag demo.l2 goed] Vraag 2 nog open. [check-question demo.l3 open] [controlevraag niet.bestaand half]" });
    assert.equal(r.code, 0, r.stderr);
    const ev = p.events().filter((e) => e.type === "check-question");
    assert.deepEqual(ev.map((e) => [e.skill, e.result]), [["demo.l2", "right"], ["demo.l3", "open"]]);
  } finally { p.cleanup(); }
});

// ---------- #56 plan, confidence, the end of a session, a catch-up diary ----------

test("#56: the first message is logged as the plan, once; a number after Claude's (1–5) as the confidence", () => {
  const p = makeProject();
  try {
    p.hook("prompt-gate.mjs", { session_id: SID, prompt: "Ik wil vandaag het klassendiagram afmaken" });
    p.hook("prompt-gate.mjs", { session_id: SID, prompt: "En daarna de tests" });
    const plans = p.events().filter((e) => e.type === "plan");
    assert.equal(plans.length, 1);
    assert.equal(plans[0].text, "Ik wil vandaag het klassendiagram afmaken");
    p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: path.join(p.root, "geen.jsonl"), last_assistant_message: "Hoe zeker ben je dat je het zonder hulp afkrijgt (1–5)?" });
    assert.equal(p.session(SID).awaitConfidence, true);
    p.hook("prompt-gate.mjs", { session_id: SID, prompt: "4/5" });
    const c = p.events().filter((e) => e.type === "confidence");
    assert.deepEqual(c.map((e) => e.value), [4]);
    assert.equal(p.session(SID).awaitConfidence, false);
    // Only right after the question.
    p.hook("prompt-gate.mjs", { session_id: SID, prompt: "3" });
    assert.equal(p.events().filter((e) => e.type === "confidence").length, 1);
    assert.equal(confidenceOf("opdracht 3"), null);
    assert.equal(confidenceOf("zelfvertrouwen 2"), 2);
  } finally { p.cleanup(); }
});

test("#56: SessionEnd notes the end; the next start offers a catch-up diary once, with that session's marker", () => {
  const OLD = "11111111-2222-3333-4444-555555555555";
  const p = makeProject({ sessions: { [OLD]: { startedAt: Date.now() - 3 * 3600000, lastActiveAt: Date.now() - 2 * 3600000, activeMs: 25 * 60000 } } });
  try {
    const end = p.hook("session-end.mjs", { session_id: OLD, reason: "prompt_input_exit" });
    assert.equal(end.code, 0, end.stderr);
    const ev = p.events().find((e) => e.type === "session-end");
    assert.deepEqual([ev.diary, ev.work, ev.reason], [false, true, "prompt_input_exit"]);
    const r = p.hook("session-start.mjs", { source: "startup", session_id: "nieuw-1" });
    assert.match(ctxOf(r), /sessie 11111111 van \d{4}-\d{2}-\d{2} \(25 actieve minuten\) sloot zonder dagboek[\s\S]*<!-- sessie: 11111111-2222-3333-4444-555555555555 -->/);
    assert.match(r.json.systemMessage, /Sessie 11111111 .* sloot zonder dagboek/);
    const again = p.hook("session-start.mjs", { source: "startup", session_id: "nieuw-2" });
    assert.doesNotMatch(ctxOf(again), /sloot zonder dagboek/, "offered once");
  } finally { p.cleanup(); }
});

test("#56: no catch-up for a session with a diary entry, without work, or still active in another window", () => {
  const A = "aaaaaaaa-0000-0000-0000-000000000001", B = "bbbbbbbb-0000-0000-0000-000000000002", C = "cccccccc-0000-0000-0000-000000000003";
  const p = makeProject({ sessions: {
    [A]: { lastActiveAt: Date.now() - 3600000, activeMs: 30 * 60000 },
    [B]: { lastActiveAt: Date.now() - 3600000, activeMs: 3 * 60000 },
    [C]: { lastActiveAt: Date.now() - 2 * 60000, activeMs: 30 * 60000 },
  } });
  try {
    fs.writeFileSync(path.join(p.learn, "diary", "2026-11-13.md"), `## Sessie 1\n<!-- sessie: ${A} -->\n`);
    const r = p.hook("session-start.mjs", { source: "startup", session_id: "nieuw" });
    assert.doesNotMatch(ctxOf(r), /sloot zonder dagboek/);
  } finally { p.cleanup(); }
});

// ---------- #57 a task per part ----------

test("#57: 'af: <what>' logs a task for the active skill, like done, and asks for the explanation", () => {
  const p = makeProject({ sessions: { [SID]: { activeSkill: "demo.l2", startedAt: Date.now(), rung: 0, maxRung: 0 } } });
  try {
    const r = p.hook("prompt-gate.mjs", { session_id: SID, prompt: "af: de methode Toevoegen" });
    const task = p.events().find((e) => e.type === "task");
    assert.equal(task.source, "af");
    assert.equal(task.skill, "demo.l2");
    assert.equal(task.what, "de methode Toevoegen");
    assert.match(ctxOf(r), /afgemeld door de student: "de methode Toevoegen"[\s\S]*vraag dan meteen de uitleg/);
    assert.equal(DONE_PREFIX.test("waarom staat er af: in de code?"), false);
  } finally { p.cleanup(); }
});

test("#57: in graded work 'af:' needs a changed file there; a Mermaid class diagram links the part to uml.klassendiagram", () => {
  const { p, target, done } = setup({ inProject: true, sessions: { [SID]: { startedAt: Date.now(), graded: true } } });
  try {
    // A task of this family logged just now: nothing changed since.
    fs.appendFileSync(path.join(p.state, "events.jsonl"), JSON.stringify({ at: new Date(Date.now() + 1000).toISOString(), type: "task", tid: "t0", skill: "uml.klassendiagram", success: true, maxRung: 0, source: "af", explained: true }) + "\n");
    let r = p.hook("prompt-gate.mjs", { session_id: SID, prompt: "af: Product-klasse #uml.klassendiagram" });
    assert.match(ctxOf(r), /niets gewijzigd/);
    assert.ok(p.events().some((e) => e.type === "af-refused"));
    // A new class diagram in the repo, without a skill in the session: the content decides.
    const S2 = "ffffffff-3456-7890-abcd-ef1234567890";
    fs.writeFileSync(path.join(p.state, `session-${S2}.json`), JSON.stringify({ startedAt: Date.now(), graded: true }));
    fs.mkdirSync(path.join(target, "Arc42"), { recursive: true });
    const later = new Date(Date.now() + 5000);
    fs.writeFileSync(path.join(target, "Arc42", "05_building_block_view.md"), "# 5\n\n```mermaid\nclassDiagram\n  Product <|-- Boek\n```\n");
    fs.utimesSync(path.join(target, "Arc42", "05_building_block_view.md"), later, later);
    r = p.hook("prompt-gate.mjs", { session_id: S2, prompt: "af: overerving naar de producttypes" });
    const task = p.events().filter((e) => e.type === "task").pop();
    assert.deepEqual([task.skill, task.source, task.what], ["uml.klassendiagram", "af", "overerving naar de producttypes"]);
  } finally { done(); }
});

test("#57: the start lists work in the graded folder since the previous session, with the skill by paths or content", () => {
  const OLD = "11111111-2222-3333-4444-555555555555";
  const { p, target, done } = setup({ inProject: true, sessions: { [OLD]: { lastActiveAt: Date.now() - 3600000, activeMs: 2 * 60000 } } });
  try {
    fs.mkdirSync(path.join(target, "Webshop", "Arc42"), { recursive: true });
    fs.writeFileSync(path.join(target, "Webshop", "Arc42", "Building_Block_View.md"), "```mermaid\nclassDiagram\n  class Product\n```\n");
    fs.writeFileSync(path.join(target, "Webshop", "Notities.txt"), "x");
    const r = p.hook("session-start.mjs", { source: "startup", session_id: "nieuw" });
    const ctx = ctxOf(r);
    assert.match(ctx, /Gewijzigd in de opdracht sinds de vorige sessie/);
    assert.match(ctx, /- Webshop\/Arc42\/Building_Block_View\.md → uml\.klassendiagram \(via de inhoud\)/);
    assert.match(ctx, /- Webshop\/Notities\.txt → geen koppeling/);
    assert.match(ctx, /af: <onderdeel>[\s\S]*skill\.mjs paths <id> add/);
    assert.doesNotMatch(ctx, /^- (\.learning|ai-verantwoording|\.claude)/m, "the record, the log and the harness are not work");
  } finally { done(); }
});

// ---------- #59 the learner's own words in the log ----------

test("#59: [logboek \"…\"] fills the empty last column of this session, only with the learner's literal words", () => {
  const { p, target, done } = setup({ inProject: true, sessions: { [SID]: { graded: true, rung: 0, maxRung: 0, startedAt: Date.now() } } });
  try {
    const file = path.join(p.root, "transcript.jsonl");
    const answer = "1. Mermaid. 2. De tag. 3. 4. 4. Ik heb de uitleg nagelezen en het diagram zelf gecontroleerd in de preview.";
    fs.writeFileSync(file, JSON.stringify(user("Waar komt het klassendiagram?", "u1", "2026-11-13T21:00:00.000Z")) + "\n");
    p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: "In hoofdstuk 5. [trede 2]" });
    fs.appendFileSync(file, JSON.stringify(user(answer, "u2", "2026-11-13T21:05:00.000Z")) + "\n");
    let r = p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: "Dank je. [logboek \"Ik heb de uitleg nagelezen en het diagram zelf gecontroleerd\"]" });
    assert.equal(r.code, 0, r.stderr);
    const log = () => fs.readFileSync(path.join(target, "ai-verantwoording", "logboek.md"), "utf8").split("\n").filter((l) => l.includes("[abcdef12]("));
    assert.equal(log().length, 2);
    for (const row of log()) assert.match(row, /\| Ik heb de uitleg nagelezen en het diagram zelf gecontroleerd \|$/);
    assert.ok(p.events().some((e) => e.type === "log-filled" && e.rows === 2));
    // Words the learner did not type: refused, nothing written.
    fs.appendFileSync(file, JSON.stringify(user("nog iets", "u3", "2026-11-13T21:06:00.000Z")) + "\n");
    r = p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: "[logboek \"Ik heb alles grondig getest met unit tests\"]" });
    assert.equal(r.json?.decision, "block");
    assert.match(r.json.reason, /niet letterlijk/);
    assert.ok(!fs.readFileSync(path.join(target, "ai-verantwoording", "logboek.md"), "utf8").includes("grondig getest"));
  } finally { done(); }
});

// ---------- #61 the user-level gate ----------

const GATE = path.join(HARNESS, "user", "graded-gate.mjs");
function gateHome(paths, names = ["Webshop"]) {
  const home = tmp("home");
  fs.mkdirSync(path.join(home, ".claude", "leerharnas"), { recursive: true });
  fs.writeFileSync(path.join(home, ".claude", "leerharnas", "graded.json"), JSON.stringify({ paths, names, messages: { prompt: "PROMPT-DICHT", tool: "TOOL-DICHT" } }));
  return home;
}
const gate = (home, input) => run(GATE, [], { input: JSON.stringify(input), env: { ...process.env, HOME: home, USERPROFILE: home } });

test("#61: from another folder a prompt about the graded work is blocked, other prompts are not", () => {
  const repo = tmp("eindopdracht"), other = tmp("site");
  const home = gateHome([slash(repo)]);
  try {
    const name = path.basename(repo);
    const prompt = (text) => gate(home, { hook_event_name: "UserPromptSubmit", cwd: other, prompt: text });
    assert.equal(prompt(`kijk in ${slash(repo)}/Webshop/Arc42`).json?.decision, "block");
    assert.equal(prompt(`hoe gaat het met ${name}?`).json?.reason, "PROMPT-DICHT");
    assert.equal(prompt("waar staat de Webshop solution?").json?.decision, "block");
    assert.equal(prompt("how does adding mermaid class diagrams work?").json, null);
    assert.equal(prompt("webshops zijn leuk").json, null, "a longer word is not the name");
    // Inside the graded project itself the project's own harness decides.
    assert.equal(gate(home, { hook_event_name: "UserPromptSubmit", cwd: repo, prompt: "Webshop" }).json, null);
  } finally { rm(repo, other, home); }
});

test("#61: from another folder every tool on the graded work is denied, also reading; the setup stays open", () => {
  const repo = tmp("eindopdracht"), other = tmp("site");
  const home = gateHome([slash(repo)]);
  try {
    const R = slash(repo);
    const tool = (tool_name, tool_input) => decision(gate(home, { hook_event_name: "PreToolUse", cwd: other, tool_name, tool_input }));
    assert.equal(tool("Read", { file_path: `${R}/ai-verantwoording/logboek.md` }), "deny");
    assert.equal(tool("Read", { file_path: `${R}/Webshop/Program.cs` }), "deny");
    assert.equal(tool("Glob", { pattern: `${R}/**/*.md` }), "deny");
    assert.equal(tool("Grep", { pattern: "class", path: R }), "deny");
    assert.equal(tool("Bash", { command: `cat "${R}/Webshop/Program.cs"` }), "deny");
    assert.equal(tool("Bash", { command: `git -C "${R}" log --oneline` }), "deny");
    assert.equal(tool("Write", { file_path: `${R}/x.md`, content: "x" }), "deny");
    // The setup itself.
    assert.equal(tool("Read", { file_path: `${R}/.claude/settings.json` }), "allow");
    assert.equal(tool("Edit", { file_path: `${R}/CLAUDE.md`, old_string: "a", new_string: "b" }), "allow");
    assert.equal(tool("Bash", { command: `node harness/install.mjs "${R}" --update --yes` }), "allow");
    assert.equal(tool("Bash", { command: `node harness/install.mjs "${R}" --update --yes && cat "${R}/Webshop/Program.cs"` }), "deny");
    // Other work is not touched.
    assert.equal(tool("Read", { file_path: path.join(other, "README.md") }), "allow");
    assert.equal(tool("Bash", { command: "git status" }), "allow");
    // Without a config the gate does nothing.
    const empty = tmp("leeg");
    try { assert.equal(decision(gate(empty, { hook_event_name: "PreToolUse", cwd: other, tool_name: "Read", tool_input: { file_path: `${R}/a.cs` } })), "allow"); }
    finally { rm(empty); }
  } finally { rm(repo, other, home); }
});

test("#61: install.mjs --user-guard shows a plan, merges ~/.claude and can remove it again", () => {
  const { p, repo, done } = setup();
  const home = tmp("home");
  try {
    fs.mkdirSync(path.join(repo, "Webshop"), { recursive: true });
    fs.writeFileSync(path.join(repo, "Webshop", "Webshop.sln"), "");
    fs.mkdirSync(path.join(home, ".claude"), { recursive: true });
    fs.writeFileSync(path.join(home, ".claude", "settings.json"), JSON.stringify({ cleanupPeriodDays: 365, hooks: { Stop: [{ hooks: [{ type: "command", command: "node eigen.mjs" }] }] } }));
    fs.writeFileSync(path.join(home, ".claude", "CLAUDE.md"), "# Mijn regels\n");
    const env = { ...process.env, HOME: home, USERPROFILE: home };
    const inst = (...args) => run(path.join(HARNESS, "install.mjs"), [p.root, "--user-guard", ...args], { env });
    let r = inst("--dry-run");
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /Webshop/);
    assert.equal(fs.existsSync(path.join(home, ".claude", "leerharnas", "graded.json")), false, "a dry run writes nothing");
    r = inst("--yes");
    assert.equal(r.code, 0, r.stderr);
    const cfg = JSON.parse(fs.readFileSync(path.join(home, ".claude", "leerharnas", "graded.json"), "utf8"));
    assert.deepEqual(cfg.paths, [slash(repo)]);
    assert.deepEqual(cfg.names, ["Webshop"]);
    const s = JSON.parse(fs.readFileSync(path.join(home, ".claude", "settings.json"), "utf8"));
    assert.equal(s.cleanupPeriodDays, 365, "your own settings stay");
    assert.equal(s.hooks.Stop[0].hooks[0].command, "node eigen.mjs");
    assert.match(s.hooks.UserPromptSubmit[0].hooks[0].command, /leerharnas\/graded-gate\.mjs"$/);
    assert.match(s.hooks.PreToolUse[0].matcher, /Read/);
    assert.match(fs.readFileSync(path.join(home, ".claude", "CLAUDE.md"), "utf8"), /^# Mijn regels\n\n<!-- leerharnas:graded:start -->[\s\S]*<!-- leerharnas:graded:end -->\n$/);
    assert.ok(fs.existsSync(path.join(home, ".claude", "leerharnas", "graded-gate.mjs")));
    r = inst("--yes");
    assert.match(r.stdout, /bijgewerkt|up to date/i);
    r = inst("--remove", "--yes");
    assert.equal(r.code, 0, r.stderr);
    const after = JSON.parse(fs.readFileSync(path.join(home, ".claude", "settings.json"), "utf8"));
    assert.deepEqual(Object.keys(after.hooks), ["Stop"]);
    assert.equal(fs.readFileSync(path.join(home, ".claude", "CLAUDE.md"), "utf8"), "# Mijn regels\n");
    assert.equal(fs.existsSync(path.join(home, ".claude", "leerharnas", "graded-gate.mjs")), false);
  } finally { done(); rm(home); }
});

test("#61: --user-guard without graded work in the record stops with a message", () => {
  const p = makeProject();
  const home = tmp("home");
  try {
    const r = run(path.join(HARNESS, "install.mjs"), [p.root, "--user-guard", "--yes"], { env: { ...process.env, HOME: home, USERPROFILE: home } });
    assert.equal(r.code, 1);
    assert.match(r.stderr, /geen beoordeeld werk/);
  } finally { p.cleanup(); rm(home); }
});
