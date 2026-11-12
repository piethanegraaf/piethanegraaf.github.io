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

test("a skill added with add gets its level from its first task (placement), once that task is explained", () => {
  const SID = "s-add";
  const p = makeProject({ files: { "opdrachten/30-poly/Dier.cs": "class Dier {}" },
    sessions: { [SID]: { startedAt: Date.now() - 600000, lastActiveAt: Date.now() - 60000, activeMs: 540000, rung: 0, maxRung: 0 } } });
  try {
    cli(p, "add", "ood.polymorfie", "Polymorfie");
    cli(p, "paths", "ood.polymorfie", "add", "opdrachten/30-*/**");
    const r = cli(p, "done", "ood.polymorfie", "eerste taak");
    assert.equal(r.code, 0, r.stderr);
    assert.match(r.stdout, /na je goedgekeurde uitleg bepaalt deze taak je startniveau \(L3\)/);
    assert.equal(skill(p, "ood.polymorfie").level, "L2", "not placed yet: the explanation comes first (#44)");
    const tid = p.events().find((e) => e.type === "task").tid;
    const file = path.join(p.root, "t.jsonl");
    fs.writeFileSync(file, JSON.stringify({ type: "user", uuid: "u1", message: { role: "user", content:
      "Het dier roept de methode van de subklasse aan omdat de methode virtual is en de subklasse hem overschrijft met override." } }) + "\n");
    const s = p.hook("reflect-gate.mjs", { session_id: SID, transcript_path: file, last_assistant_message: `Klopt. [uitleg-ok ${tid}]` });
    assert.equal(skill(p, "ood.polymorfie").level, "L3", "rung 0 on the first task places it at L3");
    assert.match(s.json?.systemMessage ?? "", /↑ ood\.polymorfie staat nu op L3 Zelfstandig: taak \[[a-z0-9]+\] lukte zonder hint/);
    assert.deepEqual(p.events().filter((e) => e.type === "placement").map((e) => [e.tid, e.to]), [[tid, "L3"]]);
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

// 11 November 2026 (night): logging and integration tests from the grading form (indicators 3.1.1 and 3.1.4),
// and the topics of the learner's cheat sheet that no skill had yet.
test("the ood map covers the grading form and the cheat sheet; its titles fit `add` and its keywords do not hide in others", () => {
  const map = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", "ood", "skills.json"), "utf8"));
  const keywords = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", "ood", "keywords.json"), "utf8"));
  const added = ["ood.logging", "test.integratie", "ood.casting", "cs.static", "cs.records-structs", "ood.object-methodes",
    "cs.extra", "pattern.creational", "pattern.structural", "pattern.behavioral"];
  for (const id of added) {
    const s = map.skills.find((x) => x.id === id);
    assert.ok(s?.title?.nl && s?.title?.en, `${id} with a title in both languages`);
    // The learner adds these to an existing register with `skill.mjs add`, which takes at most 80 characters.
    assert.ok(s.title.nl.length <= 80 && !/[<>]/.test(s.title.nl), `${id}: the Dutch title fits skill.mjs add`);
    assert.ok(!map.skills.some((x) => x !== s && x.kind !== "zone" && id.startsWith(x.id + ".")), `${id} is no microskill id`);
    assert.ok(keywords[id]?.length, `${id} has keywords`);
    // A keyword inside another skill's keyword ("struct" in "constructor") would pull that skill's prompts here.
    for (const k of keywords[id]) {
      // `add` trims and splits on commas, so a keyword must survive that unchanged.
      assert.ok(k === k.trim() && k === k.toLowerCase() && !k.includes(","), `${id}: "${k}" survives skill.mjs add`);
      for (const [other, list] of Object.entries(keywords)) {
        if (other !== id && !other.startsWith("_")) assert.ok(!list.some((o) => o.includes(k)), `${id}: "${k}" hides in ${other}`);
      }
    }
  }
  assert.equal(map.skills.filter((s) => s.kind !== "zone").length, 29);
});
