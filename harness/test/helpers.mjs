// Test helpers: a temporary project with fake learning data, and hooks run as child processes.
// Nothing here touches real learning data: LEERHARNAS_ROOT and LEERHARNAS_DATA point to a temp folder.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const HARNESS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const HOOKS = path.join(HARNESS, "hooks");

// A small fake map: one skill per level, with exercise folders.
export function fakeSkills(overrides = {}) {
  return {
    settings: { defaultLevel: "L2", stuckTimerMinutes: 12, targetSuccess: 0.85, ...overrides },
    skills: [
      { id: "zone.voorbeelden", kind: "zone", title: "Voorbeelden", level: "L0", paths: ["voorbeelden/**"], priority: 20 },
      { id: "demo.l1", title: "Aanvullen", level: "L1", paths: ["opdrachten/01-*/**"] },
      { id: "demo.l2", title: "Begeleid", level: "L2", paths: ["opdrachten/02-*/**"] },
      { id: "demo.l2.micro", parent: "demo.l2", title: "Deelpatroon", level: "L2", keywords: ["deelpatroon"] },
      { id: "demo.l3", title: "Zelfstandig", level: "L3", paths: ["opdrachten/03-*/**"] },
      { id: "demo.l4", title: "Geautomatiseerd", level: "L4", paths: ["opdrachten/04-*/**"] },
    ],
  };
}

// Creates <tmp>/project with .learning/{skills.json, state/, diary/}. Returns paths and helpers.
export function makeProject({ skills = fakeSkills(), events = [], sessions = {}, files = {} } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-test-"));
  const learn = path.join(root, ".learning");
  const state = path.join(learn, "state");
  fs.mkdirSync(state, { recursive: true });
  fs.mkdirSync(path.join(learn, "diary"), { recursive: true });
  fs.writeFileSync(path.join(learn, "skills.json"), JSON.stringify(skills, null, 2));
  if (events.length) fs.writeFileSync(path.join(state, "events.jsonl"), events.map((e) => JSON.stringify(e)).join("\n") + "\n");
  for (const [sid, st] of Object.entries(sessions)) fs.writeFileSync(path.join(state, `session-${sid}.json`), JSON.stringify(st));
  for (const [rel, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
    fs.writeFileSync(path.join(root, rel), content);
  }
  const env = { ...process.env, LEERHARNAS_ROOT: root, LEERHARNAS_DATA: learn };
  return {
    root, learn, state, env,
    abs: (rel) => path.join(root, rel),
    events: () => readJsonl(path.join(state, "events.jsonl")),
    session: (sid) => JSON.parse(fs.readFileSync(path.join(state, `session-${sid}.json`), "utf8")),
    skills: () => JSON.parse(fs.readFileSync(path.join(learn, "skills.json"), "utf8")),
    // Run a hook script with a JSON object on stdin.
    hook(script, input, extraEnv = {}) {
      return run(path.join(HOOKS, script), [], { input: JSON.stringify(input), env: { ...env, ...extraEnv }, cwd: root });
    },
    // Run a CLI script (skill.mjs, check.mjs) with arguments.
    cli(script, args = [], extraEnv = {}) {
      return run(path.join(HOOKS, script), args, { env: { ...env, ...extraEnv }, cwd: root });
    },
    cleanup: () => fs.rmSync(root, { recursive: true, force: true }),
  };
}

export function run(file, args, { input = "", env = process.env, cwd } = {}) {
  const r = spawnSync(process.execPath, [file, ...args], { input, env, cwd, encoding: "utf8" });
  let json = null;
  try { json = r.stdout.trim() ? JSON.parse(r.stdout) : null; } catch { /* not JSON */ }
  return { code: r.status, stdout: r.stdout, stderr: r.stderr, json };
}

export function readJsonl(file) {
  try { return fs.readFileSync(file, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)); }
  catch { return []; }
}

// The decision of the PreToolUse guard: "deny" or "allow" (no output).
export const decision = (r) => r.json?.hookSpecificOutput?.permissionDecision ?? "allow";
