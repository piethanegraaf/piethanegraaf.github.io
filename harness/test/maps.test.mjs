// The skill maps in harness/maps/: valid data in both languages, and patterns that do what they say.
// A map's settings replace the defaults, so a broken pattern there makes the guard fail open.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { HARNESS } from "./helpers.mjs";
import { buildRes, codeExtRe, toolingRe, globToRegex } from "../hooks/lib.mjs";

const MAPS = path.join(HARNESS, "maps");
const LEVELS = ["L0", "L1", "L2", "L3", "L4"];
const mapIds = fs.readdirSync(MAPS).filter((d) => fs.existsSync(path.join(MAPS, d, "skills.json")));
const load = (id, file) => JSON.parse(fs.readFileSync(path.join(MAPS, id, file), "utf8"));

// Every string in a JSON value, with where it sits.
function* strings(v, at = "") {
  if (typeof v === "string") yield [at, v];
  else if (Array.isArray(v)) for (const [i, x] of v.entries()) yield* strings(x, `${at}[${i}]`);
  else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) yield* strings(x, at ? `${at}.${k}` : k);
}

// A path is covered by a skill when one of its globs matches (as skillForPath does, without the project root).
const covers = (skill, p) => (skill.paths ?? []).some((g) => globToRegex(g).test(p));

test("there is at least the ood map and the junior-dotnet map", () => {
  assert.ok(mapIds.includes("ood"));
  assert.ok(mapIds.includes("junior-dotnet"));
  for (const id of mapIds) assert.match(id, /^[a-z0-9-]+$/, "install.mjs only accepts these map ids");
});

for (const id of mapIds) {
  test(`map ${id}: no control characters (a JSON "\\b" is a backspace, not a word boundary)`, () => {
    for (const file of ["skills.json", "keywords.json"]) {
      for (const [at, s] of strings(load(id, file))) {
        assert.ok(!/[\u0000-\u001f]/.test(s), `${file} ${at}: ${JSON.stringify(s)}`);
      }
    }
  });

  test(`map ${id}: both languages, unique ids, valid levels and paths`, () => {
    const map = load(id, "skills.json");
    assert.equal(typeof map._info?.nl, "string");
    assert.equal(typeof map._info?.en, "string");
    const ids = map.skills.map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length, "duplicate skill id");
    for (const s of map.skills) {
      assert.match(s.id, /^[a-z0-9-]+\.[a-z0-9.-]+$/, s.id);
      assert.ok(s.title?.nl && s.title?.en, `${s.id}: title in nl and en`);
      assert.ok(LEVELS.includes(s.level), `${s.id}: level ${s.level}`);
      assert.ok(Array.isArray(s.paths) && s.paths.every((p) => typeof p === "string"), `${s.id}: paths`);
      assert.ok(s.kind === undefined || s.kind === "zone", `${s.id}: kind`);
      assert.ok(!s.history && !s.evidence && !s.parent, `${s.id}: a map has no progress`);
    }
    if (map.settings?.defaultLevel !== undefined) assert.ok(LEVELS.includes(map.settings.defaultLevel));
    for (const lang of ["nl", "en"]) {
      assert.ok(fs.readFileSync(path.join(MAPS, id, `notes.${lang}.md`), "utf8").trim().length > 0, `notes.${lang}.md`);
    }
  });

  test(`map ${id}: keywords only for skills of the map`, () => {
    const ids = new Set(load(id, "skills.json").skills.map((s) => s.id));
    for (const [key, words] of Object.entries(load(id, "keywords.json"))) {
      if (key.startsWith("_")) continue;
      assert.ok(ids.has(key), `keywords.json: unknown skill ${key}`);
      assert.ok(Array.isArray(words) && words.every((w) => typeof w === "string" && w.length), `keywords.json: ${key}`);
    }
  });

  test(`map ${id}: the patterns in its settings compile and catch the builds of its stack`, () => {
    const map = load(id, "skills.json");
    for (const key of ["buildCommands", "toolingTerms"]) {
      for (const p of map.settings?.[key] ?? []) assert.doesNotThrow(() => new RegExp(p, "i"), `${key}: ${p}`);
    }
    const exts = map.settings?.codeExtensions ?? ["cs"];
    if (exts.includes("cs")) {
      // As the guard checks it: the pattern must match at the start of the command.
      const isBuild = (line) => buildRes(map).some((re) => re.exec(line)?.index === 0);
      for (const cmd of ["dotnet test", "dotnet build", "dotnet.exe run", "msbuild App.sln"]) assert.ok(isBuild(cmd), cmd);
      for (const cmd of ["dotnet --info", "grep dotnet build.log"]) assert.ok(!isBuild(cmd), cmd);
      assert.ok(codeExtRe(map).test("src/Shop/Order.cs"));
    }
    assert.ok(toolingRe(map).test("my .net 8 sdk"));
  });
}

test("map junior-dotnet: unmapped code is L4, and the paths cover the usual .NET folders", () => {
  const map = load("junior-dotnet", "skills.json");
  assert.equal(map.settings.defaultLevel, "L4");
  const skill = (sid) => map.skills.find((s) => s.id === sid);
  assert.ok(covers(skill("test.unit"), "src/Shop.Tests/OrderTests.cs"));
  assert.ok(covers(skill("test.unit"), "tests/Api/OrderServiceTest.cs"));
  assert.ok(covers(skill("web.api"), "src/Api/Controllers/OrdersController.cs"));
  assert.ok(covers(skill("data.ef-core"), "src/Infrastructure/AppDbContext.cs"));
  assert.ok(covers(skill("zone.voorbeelden"), "voorbeelden/cs.async/Demo.cs"));
  assert.ok(!map.skills.some((s) => covers(s, "src/Domain/Order.cs")), "domain code is unmapped, so L4");
});
