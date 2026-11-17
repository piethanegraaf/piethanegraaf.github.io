// install.mjs --host opencode|both (opencode plan): the same harness in .opencode/, next to or instead of .claude/.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { HARNESS, run } from "./helpers.mjs";

const INSTALL = path.join(HARNESS, "install.mjs");
// The installer checks which opencode is on the PATH (opencode 1.x does not start with the V2 config). The tests
// give it a PATH of their own: an empty folder, or one with a fake opencode that prints a version.
const withPath = (env, dir) => { for (const k of Object.keys(env)) if (k.toUpperCase() === "PATH") delete env[k]; env.PATH = dir; return env; };
const EMPTY_BIN = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-oc-nobin-"));
const cleanEnv = (bin = EMPTY_BIN) => { const e = { ...process.env }; delete e.LEERHARNAS_ROOT; delete e.LEERHARNAS_DATA; delete e.LEERHARNAS_HOST; return withPath(e, bin); };
const install = (target, ...args) => run(INSTALL, [target, ...args], { env: cleanEnv() });
// A folder with fake programs that print a version (POSIX shell scripts; Windows only starts .exe without a shell).
function fakeBin(versions) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-oc-bin-"));
  for (const [name, out] of Object.entries(versions)) {
    fs.writeFileSync(path.join(dir, name), `#!/bin/sh\necho "${out}"\n`);
    fs.chmodSync(path.join(dir, name), 0o755);
  }
  return dir;
}
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-oc-install-"));
const read = (dir, rel) => fs.readFileSync(path.join(dir, rel), "utf8");
const exists = (dir, rel) => fs.existsSync(path.join(dir, rel));
const jsonc = (text) => JSON.parse(text.replace(/^\s*\/\/.*$/gm, ""));

test("--host opencode installs the plugin, the gates, the core, the skills, the agent, the rules and the config", () => {
  const d = tmp();
  try {
    const r = install(d, "--host", "opencode", "--lang", "en", "--yes");
    assert.equal(r.code, 0, r.stderr);
    for (const f of [".opencode/plugins/leerharnas/index.js", ".opencode/plugins/leerharnas/messages.mjs", ".opencode/plugins/leerharnas/map.mjs",
      ".opencode/hooks/prompt-gate.mjs", ".opencode/hooks/skill.mjs", ".opencode/hooks/i18n/en.json", ".opencode/core/guard.mjs", ".opencode/core/host.mjs",
      ".opencode/skills/diary/SKILL.md", ".opencode/agents/demotie-analist.md", ".opencode/leerharnas.md", ".learning/skills.json", "AGENTS.md"]) assert.ok(exists(d, f), f);
    assert.ok(!exists(d, ".claude"), "nothing for Claude Code");
    assert.equal(JSON.parse(read(d, ".opencode/plugins/leerharnas/package.json")).type, "module");
    const cfg = jsonc(read(d, ".opencode/opencode.jsonc"));
    assert.deepEqual(cfg.instructions, [".opencode/leerharnas.md"]);
    assert.ok(cfg.permissions.some((p) => p.action === "execute" && p.effect === "deny"));
    const denied = cfg.policies.map((p) => p.resource);
    for (const x of ["edit:.learning/skills.json", "edit:.learning/state/*", "edit:.opencode/plugins/*", "edit:.opencode/tools/*", "edit:opencode.json*"]) assert.ok(denied.includes(x), x);
    assert.ok(!denied.some((x) => /diary/.test(x) && /learning/.test(x)), "the diary stays writable for /diary");
    const agent = read(d, ".opencode/agents/demotie-analist.md");
    assert.match(agent, /^---\nmode: subagent|mode: subagent/m);
    assert.match(agent, /action: edit\n {4}resource: "\*"\n {4}effect: deny/);
    assert.doesNotMatch(read(d, ".opencode/skills/diary/SKILL.md"), /\.claude\/hooks/);
    assert.match(read(d, ".opencode/leerharnas.md"), /\.opencode\/hooks\/skill\.mjs/);
    assert.match(read(d, "AGENTS.md"), /<!-- leerharnas:begin -->[\s\S]*\[harness\][\s\S]*<!-- leerharnas:end -->/);
    assert.equal(JSON.parse(read(d, ".opencode/leerharnas.json")).host, "opencode");
    assert.match(read(d, ".gitignore"), /\.opencode\/leerharnas-backup\//);
    // The installed CLI finds its project and speaks opencode.
    const list = run(path.join(d, ".opencode/hooks/skill.mjs"), ["list"], { env: cleanEnv(), cwd: d });
    assert.equal(list.code, 0, list.stderr);
    assert.match(r.stdout, /\.opencode\/hooks\/skill\.mjs/);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("an existing AGENTS.md keeps its text; --update replaces only the block of the harness", () => {
  const d = tmp();
  try {
    fs.writeFileSync(path.join(d, "AGENTS.md"), "# My rules\n\nUse tabs.\n");
    assert.equal(install(d, "--host", "opencode", "--yes").code, 0);
    const first = read(d, "AGENTS.md");
    assert.match(first, /^# My rules\n\nUse tabs\.\n\n<!-- leerharnas:begin -->/);
    fs.writeFileSync(path.join(d, "AGENTS.md"), first.replace("<!-- leerharnas:end -->", "edited inside\n<!-- leerharnas:end -->") + "\nMy own line after.\n");
    const r = install(d, "--host", "opencode", "--update", "--yes");
    assert.equal(r.code, 0, r.stderr);
    const after = read(d, "AGENTS.md");
    assert.ok(after.startsWith("# My rules\n\nUse tabs.\n"));
    assert.ok(after.includes("My own line after."));
    assert.ok(!after.includes("edited inside"));
    assert.equal(after.split("<!-- leerharnas:begin -->").length, 2, "one block");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("opencode next to Claude Code: one record, two manifests, both hosts' files", () => {
  const d = tmp();
  try {
    assert.equal(install(d, "--lang", "en", "--yes").code, 0);
    const skills = read(d, ".learning/skills.json");
    const r = install(d, "--host", "opencode", "--yes");
    assert.equal(r.code, 0, r.stderr);
    assert.equal(read(d, ".learning/skills.json"), skills, "the record is never replaced");
    assert.ok(exists(d, ".claude/hooks/guard.mjs") && exists(d, ".opencode/plugins/leerharnas/index.js"));
    assert.equal(JSON.parse(read(d, ".opencode/leerharnas.json")).language, "en", "language from the existing install");
    const cc = JSON.parse(read(d, ".claude/leerharnas.json")).files;
    assert.ok(Object.keys(cc).every((f) => f.startsWith(".claude/")));
    const both = install(d, "--host", "both", "--update", "--yes");
    assert.equal(both.code, 0, both.stderr);
    assert.match(both.stdout, /(unchanged|ongewijzigd)/);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

test("--host both installs both on one record; a bad host, graded work and --user-guard are refused", () => {
  const d = tmp();
  try {
    const r = install(d, "--host", "both", "--yes");
    assert.equal(r.code, 0, r.stderr);
    assert.ok(exists(d, ".claude/settings.json") && exists(d, "CLAUDE.md") && exists(d, "AGENTS.md") && exists(d, ".opencode/opencode.jsonc"));
    assert.notEqual(install(d, "--host", "cursor").code, 0);
    assert.notEqual(install(d, "--host", "opencode", "--user-guard").code, 0);
    const g = tmp();
    try {
      assert.equal(install(g, "--yes").code, 0);
      const data = JSON.parse(read(g, ".learning/skills.json"));
      data.settings.graded = { paths: [path.join(g, "eindopdracht")] };
      fs.writeFileSync(path.join(g, ".learning/skills.json"), JSON.stringify(data));
      const refused = install(g, "--host", "opencode", "--yes");
      assert.notEqual(refused.code, 0);
      assert.ok(!exists(g, ".opencode"), "nothing written");
    } finally { fs.rmSync(g, { recursive: true, force: true }); }
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});

const posix = { skip: process.platform === "win32" ? "fake programs need a POSIX shell" : false };

test("opencode 1.x on the PATH: the installer stops before it writes anything; --force goes on with a notice", posix, () => {
  const d = tmp();
  const bin = fakeBin({ opencode: "1.19.5" });
  try {
    const r = run(INSTALL, [d, "--host", "opencode", "--lang", "en", "--yes"], { env: cleanEnv(bin) });
    assert.equal(r.code, 1);
    assert.match(r.stderr, /opencode 1\.19\.5[\s\S]*V2 permissions are not supported by OpenCode V1[\s\S]*Nothing was changed/);
    assert.deepEqual(fs.readdirSync(d), []);
    const f = run(INSTALL, [d, "--host", "opencode", "--lang", "en", "--yes", "--force"], { env: cleanEnv(bin) });
    assert.equal(f.code, 0, f.stderr);
    assert.match(f.stdout, /--force: found opencode 1\.19\.5/);
    assert.ok(exists(d, ".opencode/opencode.jsonc"));
  } finally { fs.rmSync(d, { recursive: true, force: true }); fs.rmSync(bin, { recursive: true, force: true }); }
});

test("opencode2, a dev build or opencode 2 goes on; Claude Code alone never checks", posix, () => {
  for (const versions of [{ opencode: "1.19.5", opencode2: "2.0.0" }, { opencode: "0.0.0-dev-202611092046" }, { opencode: "2.1.0" }]) {
    const d = tmp();
    const bin = fakeBin(versions);
    try {
      const r = run(INSTALL, [d, "--host", "opencode", "--lang", "en", "--yes"], { env: cleanEnv(bin) });
      assert.equal(r.code, 0, `${JSON.stringify(versions)}: ${r.stderr}`);
      assert.doesNotMatch(r.stdout, /opencode was not found/);
    } finally { fs.rmSync(d, { recursive: true, force: true }); fs.rmSync(bin, { recursive: true, force: true }); }
  }
  const d = tmp();
  const bin = fakeBin({ opencode: "1.19.5" });
  try {
    assert.equal(run(INSTALL, [d, "--lang", "en", "--yes"], { env: cleanEnv(bin) }).code, 0, "Claude Code only");
  } finally { fs.rmSync(d, { recursive: true, force: true }); fs.rmSync(bin, { recursive: true, force: true }); }
});

test("no opencode found: the install goes on with a notice to check the version", () => {
  const d = tmp();
  try {
    const r = install(d, "--host", "opencode", "--lang", "en", "--yes");
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /opencode was not found[\s\S]*needs opencode 2/);
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});
