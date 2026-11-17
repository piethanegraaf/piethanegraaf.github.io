// The opencode adapter (opencode plan, testing strategy 3): the plugin driven through a fake ctx that implements the
// parts of opencode's plugin API it uses (session.hook, permission.hook, shell.hook, event.subscribe, session.context,
// session.get/update, instructions.entry, synthetic). The shapes follow opencode's source (dev branch, b75b158).
// The same decisions and .learning/ data as the Claude Code adapter are the goal, so several cases run both.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { makeProject, fakeSkills, decision, HARNESS } from "./helpers.mjs";

const skills = fakeSkills();
const p = makeProject({ skills, files: { "opdrachten/01-a/A.cs": "class A { // TODO(human)\n}\n", "opdrachten/02-b/B.cs": "class B {}\n" } });
process.env.LEERHARNAS_ROOT = p.root;
process.env.LEERHARNAS_DATA = p.learn;
const { createPlugin, modelNotice, loadModels } = await import("../hosts/opencode/plugin.mjs");
const { diffText, toOpencodeRule } = await import("../hosts/opencode/map.mjs");
const { toClaudeEntries, lastAssistantText } = await import("../hosts/opencode/messages.mjs");

// ---- A fake opencode ----
function fakeOpencode() {
  const hooks = { session: {}, permission: {}, shell: {} };
  const queue = [], waiters = [];
  const sessions = new Map(); // sid -> { parentID, permissions, messages }
  const log = { synthetic: [], entries: [], updates: [] };
  const session = (sid) => { if (!sessions.has(sid)) sessions.set(sid, { parentID: undefined, permissions: [], messages: [] }); return sessions.get(sid); };
  const ctx = {
    app: { version: "2.0.0-test" },
    location: { directory: p.root },
    options: {},
    event: {
      subscribe: ({ signal } = {}) => ({
        [Symbol.asyncIterator]() {
          return { next: () => (signal?.aborted ? Promise.resolve({ done: true }) : queue.length ? Promise.resolve({ value: queue.shift(), done: false })
            : new Promise((res) => waiters.push(res))), return: () => Promise.resolve({ done: true }) };
        },
      }),
    },
    session: {
      hook: async (name, fn) => { hooks.session[name] = fn; return { dispose: async () => {} }; },
      get: async ({ sessionID }) => ({ id: sessionID, parentID: session(sessionID).parentID, permissions: session(sessionID).permissions }),
      update: async ({ sessionID, permissions }) => { if (permissions) session(sessionID).permissions = permissions; log.updates.push({ sessionID, permissions }); },
      context: async ({ sessionID }) => session(sessionID).messages,
      synthetic: async (input) => { log.synthetic.push(input); return {}; },
      instructions: { entry: { put: async (e) => { log.entries.push(e); } } },
    },
    permission: { hook: async (name, fn) => { hooks.permission[name] = fn; return { dispose: async () => {} }; } },
    shell: { hook: async (name, fn) => { hooks.shell[name] = fn; return { dispose: async () => {} }; } },
  };
  const emit = (ev) => { const w = waiters.shift(); if (w) w({ value: ev, done: false }); else queue.push(ev); };
  return { ctx, hooks, emit, session, log };
}

const oc = fakeOpencode();
let cleanup;
const settle = (ms = 50) => new Promise((r) => setTimeout(r, ms));
async function created(sid, parentID) {
  if (parentID) oc.session(sid).parentID = parentID;
  oc.emit({ type: "session.created", data: { sessionID: sid, parentID } });
  for (let i = 0; i < 100 && !(parentID || oc.log.entries.some((e) => e.sessionID === sid)); i++) await settle(30);
  await settle(30);
}
const evaluate = async (ev) => { const e = { effect: "ask", resources: [], ...ev }; await oc.hooks.permission.evaluate(e); return e; };
const userMsg = (text, at = Date.now()) => ({ type: "user", id: "msg_u" + at, text, time: { created: at } });
const assistantMsg = (text, tools = [], at = Date.now()) => ({ type: "assistant", id: "msg_a" + at, agent: "build", time: { created: at },
  content: [{ type: "text", text }, ...tools] });

before(async () => { cleanup = await createPlugin().setup(oc.ctx); });
after(async () => { await cleanup?.(); p.cleanup(); });

test("opencode: the plugin registers every hook of the design", () => {
  for (const h of ["prompt", "context", "experimental.idle"]) assert.equal(typeof oc.hooks.session[h], "function", h);
  assert.equal(typeof oc.hooks.permission.evaluate, "function");
  assert.equal(typeof oc.hooks.shell["create.before"], "function");
});

test("opencode: a new session gets the start context, a notice with the version, and the final deny rules", async () => {
  await created("ses_root");
  const entry = oc.log.entries.find((e) => e.sessionID === "ses_root");
  assert.equal(entry?.key, "leerharnas-start");
  assert.ok(entry.value.length > 50);
  assert.ok(oc.log.synthetic.some((s) => s.sessionID === "ses_root" && s.resume === false && /2\.0\.0-test/.test(s.text)));
  const rules = oc.session("ses_root").permissions;
  assert.ok(rules.some((r) => r.action === "edit" && r.resource === "opdrachten/02-*/*.cs" && r.effect === "deny"), JSON.stringify(rules));
  assert.ok(!rules.some((r) => /01-|04-/.test(r.resource)), "no static rule for L1 or L4");
});

test("opencode: the prompt gate sets the status line, and the context hook adds it for the root only", async () => {
  await oc.hooks.session.prompt({ sessionID: "ses_root", messageID: "msg_1", prompt: { text: "Hoe begin ik aan opdrachten/02-b?" }, delivery: "steer" });
  const req = { sessionID: "ses_root", system: [], messages: [], tools: {} };
  await oc.hooks.session.context(req);
  assert.equal(req.system.length, 1);
  assert.match(req.system[0].text, /^\[(leerharnas|harness)\]/);
  await created("ses_child", "ses_root");
  const child = { sessionID: "ses_child", system: [], messages: [], tools: {} };
  await oc.hooks.session.context(child);
  assert.equal(child.system.length, 0, "the analyst gets nothing extra");
});

test("opencode: the guard denies edits at L2 and the record, allows L4 and the diary, and keeps TODO(human) at L1", async () => {
  const l2 = await evaluate({ sessionID: "ses_root", action: "edit", resources: ["opdrachten/02-b/B.cs"], metadata: { files: [{ file: "opdrachten/02-b/B.cs", patch: "@@\n-class B {}\n+class B { int x; }\n", status: "modified" }] } });
  assert.equal(l2.effect, "deny");
  assert.match(l2.message, /demo\.l2/);
  assert.equal((await evaluate({ sessionID: "ses_root", action: "edit", resources: ["opdrachten/04-c/C.cs"] })).effect, "ask");
  assert.equal((await evaluate({ sessionID: "ses_root", action: "edit", resources: [".learning/skills.json"] })).effect, "deny");
  assert.equal((await evaluate({ sessionID: "ses_root", action: "edit", resources: [".learning/diary/2026-11-16.md"] })).effect, "ask");
  const keep = { file: "opdrachten/01-a/A.cs", patch: "@@\n class A { // TODO(human)\n+  // TODO(human): the constructor\n }\n", status: "modified" };
  assert.equal((await evaluate({ sessionID: "ses_root", action: "edit", resources: [keep.file], metadata: { files: [keep] } })).effect, "ask");
  const fill = { file: "opdrachten/01-a/A.cs", patch: "@@\n-class A { // TODO(human)\n+class A { int Answer() => 42;\n", status: "modified" };
  assert.equal((await evaluate({ sessionID: "ses_root", action: "edit", resources: [fill.file], metadata: { files: [fill] } })).effect, "deny");
  assert.equal((await evaluate({ sessionID: "ses_root", action: "edit", resources: [fill.file] })).effect, "deny", "an edit without a diff at L1");
  assert.equal((await evaluate({ sessionID: "ses_root", action: "edit", resources: [".opencode/opencode.jsonc"] })).effect, "deny");
});

test("opencode: a shell command is judged as a whole, with the folder from the shell hook", async () => {
  await oc.hooks.shell["create.before"]({ command: "cd opdrachten/02-b && dotnet test", cwd: p.root, shell: "bash", timeout: 0, env: {} });
  const r = await evaluate({ sessionID: "ses_root", action: "shell", resources: ["cd opdrachten/02-b", "dotnet test"] });
  assert.equal(r.effect, "deny");
  assert.equal((await evaluate({ sessionID: "ses_root", action: "shell", resources: ["git status"] })).effect, "ask");
  assert.equal((await evaluate({ sessionID: "ses_root", action: "shell", resources: ["node .opencode/hooks/skill.mjs set demo.l2 L4"] })).effect, "deny");
});

test("opencode: Code Mode and MCP tools are denied, unless allowedMcp names the tool; reads pass", async () => {
  assert.equal((await evaluate({ sessionID: "ses_root", action: "execute", resources: ["*"] })).effect, "deny");
  assert.equal((await evaluate({ sessionID: "ses_root", action: "files_write_file", resources: ["*"] })).effect, "deny");
  assert.equal((await evaluate({ sessionID: "ses_root", action: "read", resources: ["opdrachten/02-b/B.cs"] })).effect, "ask");
  const data = p.skills(); data.settings.allowedMcp = ["files_write_file"]; fs.writeFileSync(path.join(p.learn, "skills.json"), JSON.stringify(data));
  assert.equal((await evaluate({ sessionID: "ses_root", action: "files_write_file", resources: ["*"] })).effect, "ask");
  delete data.settings.allowedMcp; fs.writeFileSync(path.join(p.learn, "skills.json"), JSON.stringify(data));
});

test("opencode: a subagent's edit is judged with its root session", async () => {
  const r = await evaluate({ sessionID: "ses_child", agent: "general", action: "edit", resources: ["opdrachten/02-b/B.cs"] });
  assert.equal(r.effect, "deny");
});

test("opencode: the idle hook processes markers, and keeps the session open for the diary", async () => {
  const now = Date.now();
  oc.session("ses_root").messages = [userMsg("Hoe begin ik aan opdrachten/02-b?", now - 2000), assistantMsg("[trede 1] Wat moet B bijhouden?", [], now - 1000)];
  await oc.hooks.session["experimental.idle"]({ sessionID: "ses_root", background: [] });
  assert.ok(p.session("ses_root").maxRung >= 1, JSON.stringify(p.session("ses_root")));
  // The learner stops without a diary entry: one synthetic continuation that resumes the session.
  await oc.hooks.session.prompt({ sessionID: "ses_root", messageID: "msg_2", prompt: { text: "klaar voor vandaag" }, delivery: "steer" });
  oc.session("ses_root").messages.push(userMsg("klaar voor vandaag", now), assistantMsg("Tot de volgende keer.", [], now + 10));
  const before = oc.log.synthetic.length;
  await oc.hooks.session["experimental.idle"]({ sessionID: "ses_root", background: [] });
  const added = oc.log.synthetic.slice(before).filter((s) => s.resume !== false);
  assert.equal(added.length, 1);
  assert.match(added[0].text, /dagboek|diary/i);
});

test("opencode: the idle hook waits while the session's own subagent runs", async () => {
  const before = oc.log.synthetic.length;
  await oc.hooks.session["experimental.idle"]({ sessionID: "ses_root", background: [{ kind: "subagent", sessionID: "ses_root", childSessionID: "ses_child", agent: "demotie-analist", description: "" }] });
  assert.equal(oc.log.synthetic.length, before);
});

test("opencode: an override via the learner's ! command lifts the session rule after the shell ends", async () => {
  const until = new Date(Date.now() + 30 * 60000).toISOString();
  fs.writeFileSync(path.join(p.state, "overrides.json"), JSON.stringify([{ skill: "demo.l2", until }]));
  oc.emit({ type: "session.shell.ended", data: { sessionID: "ses_root" } });
  for (let i = 0; i < 50 && oc.session("ses_root").permissions.some((r) => /02-/.test(r.resource)); i++) await settle(30);
  assert.ok(!oc.session("ses_root").permissions.some((r) => /02-/.test(r.resource)));
  fs.rmSync(path.join(p.state, "overrides.json"));
});

test("opencode: the same guard decisions as the Claude Code adapter", async () => {
  const cases = [
    ["opdrachten/02-b/B.cs", "class B { }"], ["opdrachten/03-c/C.cs", "x"], ["opdrachten/04-d/D.cs", "x"], [".learning/skills.json", "{}"], ["voorbeelden/V.cs", "x"],
  ];
  for (const [file, content] of cases) {
    const cc = decision(p.hook("guard.mjs", { session_id: "cc", tool_name: "Write", tool_input: { file_path: p.abs(file), content } }));
    const r = await evaluate({ sessionID: "ses_root", action: "edit", resources: [file], metadata: { files: [{ file, patch: `@@\n+${content}\n`, status: "added" }] } });
    assert.equal(r.effect === "deny" ? "deny" : "allow", cc, file);
  }
});

test("opencode: the model is named once per session, with a warning when it is untested or may train on the data", async () => {
  const models = { updated: "2026-11-16", supported: ["anthropic/tested"], dataUse: { "opencode/big-pickle": "may-train" } };
  assert.equal(modelNotice("anthropic/tested", models), "");
  assert.match(modelNotice("opencode/glm-5.3-flash-free", models), /glm-5\.3-flash-free/);
  assert.equal(modelNotice("opencode/big-pickle", models).split("\n").length, 2);
  assert.ok(Array.isArray(loadModels().supported), "models.json ships with the plugin");
  // The shipped list: the models that passed the compliance suite on 17 Nov.
  assert.equal(modelNotice("opencode/glm-5.3-flash-free"), "");
  assert.equal(modelNotice("opencode/big-pickle").split("\n").length, 1, "Big Pickle: tested, but it may train on the data");
  const before = oc.log.synthetic.length;
  // A model that is not on the shipped list (models.json), so the plugin warns about it.
  assert.ok(!loadModels().supported.includes("opencode/minimax-m3.1-flash-free"));
  const req = () => ({ sessionID: "ses_root", model: { providerID: "opencode", id: "minimax-m3.1-flash-free" }, system: [], messages: [], tools: {} });
  await oc.hooks.session.context(req());
  await oc.hooks.session.context(req());
  await settle();
  assert.equal(oc.log.synthetic.slice(before).filter((s) => /minimax-m3\.1/.test(s.text)).length, 1, "once, not per request");
});

test("opencode helpers: diff text, rule conversion, message mapping", () => {
  assert.deepEqual(diffText("--- a\n+++ b\n@@ -1 +1 @@\n-old\n+new\n same\n"), { before: "old", after: "new" });
  assert.deepEqual(toOpencodeRule({ action: "edit", pattern: "a/02-*/**/*.cs" }, p.root), { action: "edit", resource: "a/02-*/*.cs", effect: "deny" });
  assert.deepEqual(toOpencodeRule({ action: "edit", pattern: `${p.root.split(path.sep).join("/")}/graded/**` }, p.root), { action: "edit", resource: "graded/*", effect: "deny" });
  assert.equal(toOpencodeRule({ action: "edit", pattern: "src/**/x/**/*.cs" }, p.root), null);
  const msgs = [userMsg("vraag", 1), { type: "synthetic", text: "melding", time: { created: 2 } },
    assistantMsg("antwoord", [{ type: "tool", id: "t1", name: "subagent", state: { status: "completed", input: { agent: "demotie-analist" }, content: [{ type: "text", text: "rapport" }] }, time: {} }], 3)];
  const e = toClaudeEntries(msgs);
  assert.deepEqual(e.map((x) => x.type), ["user", "user", "assistant", "user"]);
  assert.equal(e[1].isMeta, true);
  assert.equal(e[2].message.content[1].name, "Task");
  assert.equal(e[2].message.content[1].input.subagent_type, "demotie-analist");
  assert.equal(e[3].message.content[0].type, "tool_result");
  assert.equal(lastAssistantText(msgs), "antwoord");
  assert.ok(fs.existsSync(path.join(HARNESS, "hosts", "opencode", "plugin.mjs")));
});
