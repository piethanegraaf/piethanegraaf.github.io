// Helper for next-step.test.mjs (not a test itself): exports a project with export.mjs, and puts the
// harness's promotion advice next to the dashboard's next step (site-src/dashboard/next-step.js) for
// every skill. Runs in its own process: lib.mjs reads its data folder once, at import.
//   node next-step-probe.mjs <project>
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const project = process.argv[2];
const { build } = await import("../export.mjs");
const { out } = await build(project);
const lib = await import("../hooks/lib.mjs");
const data = lib.loadSkills();

const box = {};
vm.runInNewContext(fs.readFileSync(path.join(HERE, "..", "..", "site-src", "dashboard", "next-step.js"), "utf8"), box);
const { nextStep } = box.NextStep;
const family = (s) => new Set(s.parent ? [s.id] : [s.id, ...out.skills.filter((m) => m.parent === s.id).map((m) => m.id)]);

const rows = out.skills.filter((s) => s.kind !== "zone").map((s) => {
  const advice = lib.promotionAdvice(data, lib.findSkill(data, s.id));
  const step = nextStep(s, { tasks: out.tasks.filter((x) => !x.void), transfers: out.transfers, family: family(s), target: out.settings.targetSuccess });
  return { id: s.id, level: s.level, harness: advice ? advice.dir : null, step };
});
process.stdout.write(JSON.stringify(rows));
