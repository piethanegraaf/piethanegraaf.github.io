// The skills of the final assessment (11 November 2026): `skill.mjs add` for a new main skill, the
// code settings codeExtensions and codeFiles, and the guard on files of a web, database or cloud project.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject, fakeSkills, decision, HARNESS } from "./helpers.mjs";

const cli = (p, ...args) => p.cli("skill.mjs", args);
const skill = (p, id) => p.skills().skills.find((s) => s.id === id);

test("add: a new main skill with an open placement; bad ids, doubles and microskills are refused", () => {
  const p = makeProject();
  try {
    let r = cli(p, "add", "ood.polymorfie", "Polymorfie", "polymorf, late binding");
    assert.equal(r.code, 0, r.stderr);
    const s = skill(p, "ood.polymorfie");
    assert.deepEqual([s.level, s.keywords, s.paths, s.history, s.placement], ["L2", ["polymorf", "late binding"], [], undefined, undefined]);
    assert.match(r.stdout, /Plaatsing open/);
    r = cli(p, "status");
    assert.equal(r.code, 0, r.stderr);
    assert.equal(cli(p, "add", "ood.polymorfie", "Nog eens").code, 1, "an existing id");
    assert.equal(cli(p, "add", "polymorfie", "Zonder punt").code, 1, "an id without a dot");
    assert.equal(cli(p, "add", "demo.l2.nieuw", "Onder demo.l2").code, 1, "an id under an existing skill is a microskill");
    assert.equal(cli(p, "add", "ood.leeg").code, 1, "no title");
    assert.deepEqual(p.events().filter((e) => e.type === "skill-add").map((e) => e.skill), ["ood.polymorfie"]);
  } finally { p.cleanup(); }
});

test("a skill added with add gets its level from its first task (placement)", () => {
  const p = makeProject({ files: { "opdrachten/30-poly/Dier.cs": "class Dier {}" } });
  try {
    cli(p, "add", "ood.polymorfie", "Polymorfie");
    cli(p, "paths", "ood.polymorfie", "add", "opdrachten/30-*/**");
    const r = cli(p, "done", "ood.polymorfie", "eerste taak");
    assert.equal(r.code, 0, r.stderr);
    assert.equal(skill(p, "ood.polymorfie").level, "L3", "rung 0 on the first task places it at L3");
    assert.equal(p.events().filter((e) => e.type === "placement").length, 1);
  } finally { p.cleanup(); }
});

test("setting codeExtensions and codeFiles: comma lists, logged", () => {
  const p = makeProject();
  try {
    assert.equal(cli(p, "setting", "codeExtensions", "cs, .csproj, sql").code, 0);
    assert.equal(cli(p, "setting", "codeFiles", "Dockerfile, appsettings*.json").code, 0);
    const st = p.skills().settings;
    assert.deepEqual(st.codeExtensions, ["cs", "csproj", "sql"]);
    assert.deepEqual(st.codeFiles, ["Dockerfile", "appsettings*.json"]);
    assert.equal(cli(p, "setting", "codeFiles", "../geheim").code, 1, "no paths");
  } finally { p.cleanup(); }
});

test("the guard protects files by name (codeFiles) and blocks add for Claude", () => {
  const p = makeProject({ skills: fakeSkills({ codeExtensions: ["cs", "sql"], codeFiles: ["Dockerfile", "appsettings*.json"] }) });
  const write = (file) => decision(p.hook("guard.mjs", { tool_name: "Write", tool_input: { file_path: p.abs(file), content: "x" }, cwd: p.root }));
  try {
    assert.equal(write("opdrachten/02-lijst/Dockerfile"), "deny");
    assert.equal(write("opdrachten/02-lijst/appsettings.Development.json"), "deny");
    assert.equal(write("opdrachten/02-lijst/db/schema.sql"), "deny");
    assert.equal(write("opdrachten/02-lijst/README.md"), "allow");
    assert.equal(write("opdrachten/02-lijst/package.json"), "allow");
    const r = p.hook("guard.mjs", { tool_name: "Bash", tool_input: { command: "node .claude/hooks/skill.mjs add ood.x \"X\"" }, cwd: p.root });
    assert.equal(decision(r), "deny");
  } finally { p.cleanup(); }
});

test("the ood map has the skills of the final assessment, and guards their files", () => {
  const map = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", "ood", "skills.json"), "utf8"));
  const keywords = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", "ood", "keywords.json"), "utf8"));
  for (const id of ["ood.polymorfie", "ood.solid", "arch.lagen", "uml.sequentiediagram"]) {
    const s = map.skills.find((x) => x.id === id);
    assert.ok(s?.title?.nl && s?.title?.en, `${id} with a title in both languages`);
    assert.ok(keywords[id]?.length, `${id} has keywords`);
  }
  for (const e of ["razor", "cshtml", "sql", "yml", "yaml"]) assert.ok(map.settings.codeExtensions.includes(e), e);
  assert.deepEqual(map.settings.codeFiles, ["Dockerfile", "appsettings*.json"]);
});
