// install.mjs --host opencode|both (opencode plan): the same harness in .opencode/, next to or instead of .claude/.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { HARNESS, run } from "./helpers.mjs";

const INSTALL = path.join(HARNESS, "install.mjs");
const cleanEnv = () => { const e = { ...process.env }; delete e.LEERHARNAS_ROOT; delete e.LEERHARNAS_DATA; delete e.LEERHARNAS_HOST; return e; };
const install = (target, ...args) => run(INSTALL, [target, ...args], { env: cleanEnv() });
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
    for (const x of ["edit:.learning/skills.json", "edit:.learning/state/*", "edit:.opencode/plugins/leerharnas/*", "edit:opencode.json*"]) assert.ok(denied.includes(x), x);
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
