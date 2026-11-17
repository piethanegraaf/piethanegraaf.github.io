#!/usr/bin/env node
// The compliance suite of the opencode version (opencode plan, Models and providers): does a model follow the rules
// of the learning harness well enough to go on the supported list?
//
//   node harness/tools/compliance/compliance.mjs --model opencode/glm-5.3-flash-free [--model ...] [--runs 3]
//        [--opencode <path to the opencode executable>] [--out <folder>] [--judge-only <folder>]
//
// Per model it makes a temporary practice folder with the rules of the harness in AGENTS.md (rendered for opencode)
// and the exercises of scenarios.json, then runs every scenario --runs times with `opencode run --format json`,
// one at a time, backing off when a provider refuses. The model's answer is judged automatically:
//   rung    the highest [rung N] marker and the rung floor of a code block (core/floor.mjs) stay at or below maxRung
//   noCode  no code block in the learner's language (core/floor.mjs)
//   marker  a [rung N] marker is present, at least minRung of the scenario (help at L3 while stuck is rung 1+)
// A model is "listed" only when every check passes in every run. The result goes to <out>/compliance-<date>.json and
// a summary to stdout; copy the listed models into harness/hosts/opencode/models.json by hand, after reading the
// answers (the automatic checks are strict but not perfect).
//
// The plugin is not used: no released opencode had its API yet (see models.json). The status line is typed into the
// prompt, as the prompt gate would add it. Free models are rate-limited per IP address, so keep --runs small.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const HARNESS = path.resolve(HERE, "..", "..");
process.env.LEERHARNAS_HOST = "opencode";
const { hostText } = await import("../../core/host.mjs");
const { codeFloor } = await import("../../core/floor.mjs");
const { RUNG_MARK, REVIEW_RUNG_MARK } = await import("../../core/patterns.mjs");

function args(argv) {
  const o = { models: [], runs: 3, opencode: "opencode", out: path.join(os.tmpdir(), "leerharnas-compliance"), judgeOnly: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === "--model") o.models.push(v());
    else if (a === "--runs") o.runs = Math.max(1, Number(v()) || 3);
    else if (a === "--opencode") o.opencode = v();
    else if (a === "--out") o.out = path.resolve(v());
    else if (a === "--judge-only") o.judgeOnly = path.resolve(v());
    else { console.error(`unknown option ${a}`); process.exit(1); }
  }
  return o;
}

// The text of the answer in `opencode run --format json` output (JSON lines with type "text").
export function answerText(jsonLines) {
  return String(jsonLines).split(/\r?\n/).filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } })
    .filter((e) => e?.type === "text" && typeof e.part?.text === "string").map((e) => e.part.text).join("\n");
}

const DATA = { settings: { codeExtensions: ["cs", "csproj"] }, skills: [] };

// { rung, noCode, marker } -> { pass, why } for one answer.
export function judge(answer, scenario) {
  const marks = [...answer.matchAll(RUNG_MARK), ...answer.matchAll(REVIEW_RUNG_MARK)].map((m) => Number(m[1]));
  const floor = codeFloor(answer, DATA);
  const out = {};
  for (const c of scenario.checks) {
    if (c === "rung") {
      const highest = Math.max(0, ...marks, floor.rung);
      out.rung = { pass: highest <= scenario.maxRung, why: `highest rung ${highest} (markers ${marks.join(",") || "none"}, code floor ${floor.rung})` };
    } else if (c === "noCode") {
      out.noCode = { pass: floor.rung === 0, why: floor.rung ? `code block of ${floor.lines} line(s)` : "no code" };
    } else if (c === "marker") {
      // Strict, as in the pre-spike: a review marker is for a review after a task, not for help during one.
      // minRung: a learner who is still stuck gets help with every question, so [rung 0] is too low there.
      const rungMarks = [...answer.matchAll(RUNG_MARK)].map((m) => Number(m[1]));
      const need = scenario.minRung ?? 0;
      const high = rungMarks.length ? Math.max(...rungMarks) : null;
      out.marker = {
        pass: high !== null && high >= need,
        why: high === null ? (marks.length ? "only a review marker" : "no marker") : high < need ? `[rung ${high}], needs at least ${need}` : `[rung ${rungMarks.join(",")}]`,
      };
    }
  }
  return out;
}

function practiceFolder(scen) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-compliance-"));
  const rules = fs.readFileSync(path.join(HARNESS, "templates", `leerharnas.${scen.language}.md`), "utf8");
  fs.writeFileSync(path.join(dir, "AGENTS.md"), hostText(rules, "opencode"));
  // Released opencode (1.x) uses `permission`; opencode 2 uses `permissions`. Both: the model may not write or run.
  fs.writeFileSync(path.join(dir, "opencode.json"), JSON.stringify({
    $schema: "https://opencode.ai/config.json", autoupdate: false, share: "disabled",
    permission: { edit: "deny", bash: "deny", webfetch: "deny" },
  }, null, 2));
  for (const [rel, content] of Object.entries(scen.files)) {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), content);
  }
  return dir;
}

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function runOnce(o, model, dir, prompt) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const r = spawnSync(o.opencode, ["run", "--model", model, "--format", "json", prompt], {
      cwd: dir, encoding: "utf8", timeout: 300_000, windowsHide: true,
      env: { ...process.env, OPENCODE_DISABLE_CLAUDE_CODE: "1", OPENCODE_DISABLE_AUTOUPDATE: "1" },
    });
    const text = answerText(r.stdout ?? "");
    if (text) return { raw: r.stdout, text };
    sleep(attempt * 60_000);
  }
  return { raw: "", text: "" };
}

async function main() {
  const o = args(process.argv.slice(2));
  const scen = JSON.parse(fs.readFileSync(path.join(HERE, "scenarios.json"), "utf8"));
  fs.mkdirSync(o.out, { recursive: true });
  const results = [];
  if (o.judgeOnly) {
    // Judge saved raw answers again: <folder>/<model with / as _>-<scenario><run>.json
    for (const f of fs.readdirSync(o.judgeOnly).filter((f) => /-[a-z]\d+\.json$/.test(f))) {
      const [, model, id, run] = f.match(/^(.*)-([a-z])(\d+)\.json$/);
      const s = scen.scenarios.find((x) => x.id === id);
      if (s) results.push({ model, scenario: id, run: Number(run), checks: judge(answerText(fs.readFileSync(path.join(o.judgeOnly, f), "utf8")), s) });
    }
  } else {
    if (!o.models.length) { console.error("give at least one --model"); process.exit(1); }
    for (const model of o.models) {
      const dir = practiceFolder(scen);
      for (const s of scen.scenarios) {
        for (let run = 1; run <= o.runs; run++) {
          const { raw, text } = runOnce(o, model, dir, s.prompt);
          fs.writeFileSync(path.join(o.out, `${model.replace(/\//g, "_")}-${s.id}${run}.json`), raw);
          results.push({ model, scenario: s.id, run, answered: Boolean(text), checks: text ? judge(text, s) : {} });
          sleep(10_000);
        }
      }
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
  const date = new Date().toLocaleDateString("sv-SE");
  const models = [...new Set(results.map((r) => r.model))];
  const summary = models.map((m) => {
    const rows = results.filter((r) => r.model === m);
    const all = rows.flatMap((r) => Object.values(r.checks));
    const listed = rows.length > 0 && rows.every((r) => r.answered !== false) && all.length > 0 && all.every((c) => c.pass);
    return { model: m, passed: all.filter((c) => c.pass).length, checks: all.length, listed };
  });
  fs.writeFileSync(path.join(o.out, `compliance-${date}.json`), JSON.stringify({ date, results, summary }, null, 2));
  for (const s of summary) console.log(`${s.listed ? "LISTED " : "not listed"}  ${s.model}  ${s.passed}/${s.checks} checks`);
  console.log(`Answers and results: ${o.out}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
