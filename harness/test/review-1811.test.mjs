// Real session in opencode 2.3.0 with GLM-5.3-Flash Free on Windows (18 Nov 2026):
// - the model wrote "een vraag (trede 1)" in a sentence instead of [trede 1]; that hint was not logged;
// - messages to the learner said "Claude" next to another model;
// - the compliance suite needed --opencode on Windows, with a path of opencode 1;
// - the installer took a leading ~ literally (PowerShell passes it to node unchanged).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { makeProject } from "./helpers.mjs";
import { PROSE_RUNG_MARK, PROSE_RUNG_RECAP } from "../core/patterns.mjs";
import { hostText } from "../core/host.mjs";
import { windowsExe } from "../tools/compliance/compliance.mjs";

const HARNESS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SID = "s1811";
const at = "2026-11-18T05:00:00.000Z";

function project() {
  const p = makeProject({
    events: [{ at, type: "task", tid: "t1", skill: "demo.l2", success: true, maxRung: 0, source: "check" }],
    sessions: { [SID]: { activeSkill: "demo.l2", rung: 0, maxRung: 0, startedAt: Date.now() } },
  });
  const file = path.join(p.root, "transcript.jsonl");
  fs.writeFileSync(file, JSON.stringify({ type: "user", uuid: "u1", message: { role: "user", content: "3" } }) + "\n");
  const stop = (last) => p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: last });
  const marks = () => p.events().filter((e) => e.type === "rung-mark");
  return { p, stop, marks };
}

test("18 Nov: the prose pattern takes only the exact form in round brackets", () => {
  const found = (s) => [...s.matchAll(PROSE_RUNG_MARK)].map((m) => Number(m[1]));
  assert.deepEqual(found("Dan begin ik met mijn eerste hint, een vraag (trede 1):"), [1]);
  assert.deepEqual(found("A first question (rung 2)."), [2]);
  assert.deepEqual(found("Geef de trede aan jezelf: probeer het eerst."), []);
  assert.deepEqual(found("(trede 0) en (trede 6) en (hoogste trede 2)"), []);
  assert.ok(PROSE_RUNG_RECAP.test("Eerlijk gezegd gelukt met hulp tot "));
  assert.ok(!PROSE_RUNG_RECAP.test("Nieuwe taak, dus eerst jouw poging "));
});

test("18 Nov: a hint written as (trede 1) in the text is logged when there is no marker", () => {
  const { p, stop, marks } = project();
  try {
    const r = stop("Prima. Dan begin ik met mijn eerste hint, een vraag (trede 1): wat moet de methode teruggeven?");
    assert.equal(r.code, 0, r.stderr);
    assert.deepEqual(marks().map((e) => [e.rung, e.prose]), [[1, true]]);
  } finally { p.cleanup(); }
});

test("18 Nov: a marker wins over the text, also [trede 0]", () => {
  const { p, stop, marks } = project();
  try {
    stop("Een vraag (trede 1): wat geeft de methode terug? [trede 2]");
    assert.deepEqual(marks().map((e) => e.rung), [2]);
    assert.ok(!marks()[0].prose);
  } finally { p.cleanup(); }
  const b = project();
  try {
    b.stop("Je commando kwam als bericht aan (trede 1 is dit niet). [trede 0] Typ de ! zelf.");
    b.stop("Uitleg over het commando, geen hulp bij de taak (trede 2). [trede 0]");
    assert.equal(b.marks().length, 0);
  } finally { b.p.cleanup(); }
});

test("18 Nov: a recap of help that was already logged does not count again", () => {
  const { p, stop, marks } = project();
  try {
    stop("Sterk gedaan. Eerlijk gezegd gelukt met hulp tot (trede 2): het return-concept kwam van mij.");
    stop("Dat lukte met hulp (trede 2), en daar zat het leren.");
    assert.equal(marks().length, 0);
  } finally { p.cleanup(); }
});

test("18 Nov: on opencode the agent is called opencode, not Claude", () => {
  assert.equal(hostText("(Claude beoordeelt, de hook controleert.)", "opencode"), "(opencode beoordeelt, de hook controleert.)");
  assert.equal(hostText("[harness → Claude] First say what went well.", "opencode"), "[harness → opencode] First say what went well.");
  assert.equal(hostText("too much copied from Claude's text", "opencode"), "too much copied from opencode's text");
  assert.equal(hostText("Start Claude Code in ~/.claude/leerharnas/", "opencode"), "Start opencode in ~/.claude/leerharnas/");
  assert.equal(hostText("(Claude beoordeelt.)", "claude-code"), "(Claude beoordeelt.)");
});

test("18 Nov: the compliance suite finds opencode 2 in npm's global folder on Windows", () => {
  const appData = "C:\\Users\\x\\AppData\\Roaming";
  const v2 = path.win32.join(appData, "npm", "node_modules", "@opencode", "cli", "bin", "opencode.exe");
  const v1 = path.win32.join(appData, "npm", "node_modules", "opencode-ai", "bin", "opencode.exe");
  assert.equal(windowsExe({ platform: "win32", appData, exists: (p) => p === v2 || p === v1 }), v2);
  assert.equal(windowsExe({ platform: "win32", appData, exists: (p) => p === v1 }), v1);
  assert.equal(windowsExe({ platform: "win32", appData, exists: () => false }), null);
  assert.equal(windowsExe({ platform: "linux", appData, exists: () => true }), null);
});

test("18 Nov: the installer reads a leading ~ as the home folder", () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "lh-home-"));
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "lh-cwd-"));
  try {
    fs.mkdirSync(path.join(home, "oefen"));
    const r = spawnSync(process.execPath, [path.join(HARNESS, "install.mjs"), "~/oefen", "--lang", "nl"], {
      cwd, encoding: "utf8", env: { ...process.env, HOME: home, USERPROFILE: home },
    });
    const out = r.stdout + r.stderr;
    assert.ok(out.includes(path.join(home, "oefen")), out);
    assert.ok(!fs.existsSync(path.join(cwd, "~")), "no folder named ~ in the current folder");
  } finally { fs.rmSync(home, { recursive: true, force: true }); fs.rmSync(cwd, { recursive: true, force: true }); }
});
