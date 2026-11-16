// Core pieces for a second host (opencode plan): the static deny rules (Security model, layer 2), the shared
// message shape, and ToolRequested events turned into guard requests.
import { test, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject, fakeSkills } from "./helpers.mjs";

const skills = fakeSkills();
skills.skills.push({ id: "demo.mixed", title: "Gemengd", level: "L3", paths: ["opdrachten/05-*/**"], placement: "done" });
skills.skills.push({ id: "demo.zone", kind: "zone", title: "Zone", level: "L0", paths: ["opdrachten/05-*/voorbeeld/**"], priority: 30 });
const p = makeProject({ skills });
process.env.LEERHARNAS_ROOT = p.root;
process.env.LEERHARNAS_DATA = p.learn;
const { staticDenyRules } = await import("../core/rules.mjs");
const { turnOf, message, turnStartedAgent } = await import("../core/transcript.mjs");
const { toGuardRequests } = await import("../core/events.mjs");
const { fromClaudeCode } = await import("../hooks/cc-transcript.mjs");
const { guard } = await import("../core/guard.mjs");
after(() => p.cleanup());

const patterns = (r, skill) => r.rules.filter((x) => x.skill === skill).map((x) => x.pattern);

test("rules: L2 and L3 code paths get a static deny, L1, L4 and L0 do not", () => {
  const r = staticDenyRules(p.skills());
  assert.deepEqual(patterns(r, "demo.l2"), ["opdrachten/02-*/**/*.cs", "opdrachten/02-*/**/*.csproj", "opdrachten/02-*/**/*.sln", "opdrachten/02-*/**/*.slnx"]);
  assert.equal(patterns(r, "demo.l3").length, 4);
  for (const id of ["demo.l1", "demo.l4", "zone.voorbeelden"]) assert.deepEqual(patterns(r, id), [], id);
  assert.match(r.hash, /^[0-9a-f]{16}$/);
  assert.ok(r.validUntil > Date.now());
});

test("rules: a path that may overlap with a skill at another level is left to the hook", () => {
  assert.deepEqual(patterns(staticDenyRules(p.skills()), "demo.mixed"), []);
});

test("rules: an override removes the skill's rules and ends their validity", () => {
  const before = staticDenyRules(p.skills());
  const until = new Date(Date.now() + 30 * 60000).toISOString();
  fs.writeFileSync(path.join(p.state, "overrides.json"), JSON.stringify([{ skill: "demo.l2", until }]));
  const r = staticDenyRules(p.skills());
  assert.deepEqual(patterns(r, "demo.l2"), []);
  assert.notEqual(r.hash, before.hash);
  assert.equal(r.validUntil, Math.min(r.validUntil, Date.parse(until)));
  fs.writeFileSync(path.join(p.state, "overrides.json"), JSON.stringify([{ skill: "*", until }]));
  assert.deepEqual(staticDenyRules(p.skills()).rules, []);
  fs.rmSync(path.join(p.state, "overrides.json"));
});

test("rules: graded work gets a deny on its folders and the AI-use log", () => {
  const data = p.skills();
  data.settings.graded = { paths: [path.join(p.root, "eindopdracht")] };
  const r = staticDenyRules(data).rules.filter((x) => x.why === "graded").map((x) => x.pattern);
  assert.ok(r.some((x) => x.endsWith("/eindopdracht/**")));
  assert.ok(r.length >= 4, "the work and the log, each as folder and as tree");
});

test("transcript: the Claude Code mapping keeps one message per entry and finds the turn", () => {
  const entries = [
    { type: "user", message: { content: "Wat is encapsulatie?" } },
    { type: "assistant", message: { content: [{ type: "text", text: "Eerder antwoord" }] } },
    { type: "user", message: { content: "Leg het nog eens uit" } },
    { type: "assistant", message: { content: [{ type: "text", text: "[trede 1] Denk aan" }, { type: "tool_use", name: "Agent", input: { subagent_type: "demotie-analist" } }] } },
    { type: "user", message: { content: [{ type: "tool_result", content: "ok" }] } },
  ];
  const msgs = fromClaudeCode(entries);
  assert.equal(msgs.length, entries.length);
  assert.deepEqual(msgs.map((m) => m.role), ["learner", "assistant", "learner", "assistant", "tool"]);
  const turn = turnOf(msgs, "slot");
  assert.equal(turn.idx, 2);
  assert.equal(turn.answer, "[trede 1] Denk aan\nslot");
  assert.deepEqual(turn.earlier, ["Eerder antwoord"]);
  assert.ok(turnStartedAgent(msgs, turn.idx, "demotie-analist"));
  assert.equal(message("bogus").role, "other");
});

test("events: a ToolRequested event becomes guard requests with the same decisions", () => {
  const edit = toGuardRequests({ kind: "edit", sid: "s1", paths: [p.abs("opdrachten/02-x/A.cs")], diff: {} });
  assert.equal(guard(edit[0]).decision, "deny");
  const l1 = p.abs("opdrachten/01-x/A.cs");
  const skeleton = toGuardRequests({ kind: "edit", sid: "s1", paths: [l1], diff: { [l1]: { before: "", after: "// TODO(human)" } } });
  assert.equal(guard(skeleton[0]).decision, "allow");
  const sh = toGuardRequests({ kind: "shell", sid: "s1", commands: ["dotnet test"], cwd: p.abs("opdrachten/03-x") });
  assert.equal(guard(sh[0]).decision, "deny");
  assert.equal(guard(toGuardRequests({ kind: "read", sid: "s1" })[0]).decision, "allow");
});
