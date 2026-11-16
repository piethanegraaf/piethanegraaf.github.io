// The learning harness as an opencode server plugin (opencode plan, "Design of the opencode plugin").
// Installed as .opencode/plugins/leerharnas/index.mjs; the core is in .opencode/core/ and the gates and the CLI in
// .opencode/hooks/, in the same layout as .claude/ for Claude Code.
//
// The adapter decides nothing. It translates:
//   session.created        -> session-start gate: context as instruction entry "leerharnas-start", notices
//   prompt hook            -> prompt-gate: the status line for the next model requests, notices
//   context hook           -> the status line in the system part of every agent-loop request (root sessions only)
//   permission evaluate    -> core guard(): deny with the reason; a crash denies edit, shell and MCP (fail closed)
//   shell create.before    -> remembers the full command and its cwd for the shell evaluation that follows
//   experimental.idle      -> reflect-gate: markers, explanation check, AI-use log; "block" becomes one synthetic
//                             continuation (the gate itself allows at most 2 per stop request)
//   execution interrupted/failed -> reflect-gate without a continuation, so no marker is lost
//   session.deleted        -> session-end gate
//   layer 2 (Security model): final deny rules from core/rules.mjs, written with session.update, refreshed on start,
//   before every prompt when the record changed, after the learner's ! commands and when the record changes on disk.
//
// The gates run as the same Node scripts as on Claude Code, with a transcript in their format (messages.mjs). So both
// hosts judge with the same code and write the same .learning/. Built against opencode's plugin API on the dev branch
// (commit b75b158, 15 Nov 2026); no released opencode had this API yet when it was written.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { guard } from "../../core/guard.mjs";
import { staticDenyRules } from "../../core/rules.mjs";
import { loadSkills, settingsOf, ROOT, LEARN, STATE_DIR, t, logEvent } from "../../core/lib.mjs";
import { toClaudeEntries, lastAssistantText, toJsonl } from "./messages.mjs";
import { toRequests, shellLog, toOpencodeRule } from "./map.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Installed: .opencode/plugins/leerharnas/ -> .opencode/hooks/. In the source repository: harness/hosts/opencode/ -> harness/hooks/.
const HOOKS = path.resolve(HERE, "..", "..", "hooks");
export const TESTED = "opencode dev b75b158 (plugin API V2)";
const GATE_TIMEOUT = 30_000;
const MAX_CONTINUATIONS = 3;

const safeSid = (sid) => String(sid).replace(/[^\w-]/g, "_");
const transcriptDir = () => path.join(os.tmpdir(), "leerharnas-opencode");
const transcriptFile = (sid) => path.join(transcriptDir(), `${safeSid(sid)}.jsonl`);

// Runs a gate script with a JSON object on stdin, as Claude Code does. Resolves to its JSON output (or null).
export function runGate(script, input, { node = "node", hooksDir = HOOKS, env = {} } = {}) {
  return new Promise((resolve) => {
    let out = "", done = false;
    const finish = (v) => { if (!done) { done = true; resolve(v); } };
    let child;
    try {
      child = spawn(node, [path.join(hooksDir, script)], { cwd: ROOT, env: { ...process.env, LEERHARNAS_HOST: "opencode", ...env }, windowsHide: true });
    } catch (e) { finish({ error: String(e?.message ?? e) }); return; }
    const timer = setTimeout(() => { try { child.kill(); } catch { /* gone */ } finish({ error: "timeout" }); }, GATE_TIMEOUT);
    child.stdout.on("data", (d) => { out += d; });
    child.on("error", (e) => { clearTimeout(timer); finish({ error: String(e?.message ?? e) }); });
    child.on("close", () => {
      clearTimeout(timer);
      try { finish(out.trim() ? JSON.parse(out) : {}); } catch { finish({ error: "bad output" }); }
    });
    child.stdin.end(JSON.stringify(input));
  });
}

export function createPlugin({ node = "node", hooksDir = HOOKS } = {}) {
  return {
    id: "leerharnas",
    async setup(ctx) {
      const sessions = new Map(); // sid -> { root, rootSid, started, status, continued, continuations, rulesHash, rulesUntil, written }
      const shells = shellLog();
      const gate = (script, input) => runGate(script, input, { node, hooksDir });
      const warn = (msg, extra = {}) => { try { logEvent({ type: "opencode-warning", msg: String(msg).slice(0, 200), ...extra }); } catch { /* no record */ } };

      const stateOf = (sid) => {
        if (!sessions.has(sid)) sessions.set(sid, { root: null, rootSid: sid, started: false, status: "", continued: false, continuations: 0, rulesHash: null, rulesUntil: 0, written: [] });
        return sessions.get(sid);
      };
      // The root session of a child (a subagent): its level, graded paths and task hold there too.
      async function rootOf(sid) {
        const st = stateOf(sid);
        if (st.root !== null) return st.rootSid;
        let cur = sid;
        for (let i = 0; i < 8; i++) {
          let info = null;
          try { info = await ctx.session.get({ sessionID: cur }); } catch { break; }
          if (!info?.parentID) break;
          cur = info.parentID;
        }
        st.root = cur === sid;
        st.rootSid = cur;
        return cur;
      }

      async function notice(sid, text) {
        if (!text) return;
        try { await ctx.session.synthetic({ sessionID: sid, text, description: "leerharnas", resume: false, metadata: { source: "leerharnas" } }); }
        catch (e) { warn("notice failed", { error: String(e?.message ?? e) }); }
      }

      async function writeTranscript(sid) {
        let messages = [];
        try { messages = await ctx.session.context({ sessionID: sid }); } catch (e) { warn("context failed", { error: String(e?.message ?? e) }); }
        fs.mkdirSync(transcriptDir(), { recursive: true });
        fs.writeFileSync(transcriptFile(sid), toJsonl(toClaudeEntries(messages)));
        return { file: transcriptFile(sid), messages };
      }

      // Layer 2: the final deny rules for this session, rewritten only when they changed or ran out.
      async function refreshRules(sid, force = false) {
        const st = stateOf(sid);
        let data;
        try { data = loadSkills(); } catch { return; }
        const r = staticDenyRules(data);
        if (!force && r.hash === st.rulesHash && Date.now() < st.rulesUntil) return;
        const ours = r.rules.map((x) => toOpencodeRule(x, ROOT)).filter(Boolean);
        let existing = [];
        try { existing = (await ctx.session.get({ sessionID: sid }))?.permissions ?? []; } catch { existing = []; }
        const same = (a, b) => a.action === b.action && a.resource === b.resource && a.effect === b.effect;
        const keep = existing.filter((e) => !st.written.some((w) => same(w, e)));
        try {
          await ctx.session.update({ sessionID: sid, permissions: [...keep, ...ours] });
          st.written = ours;
          st.rulesHash = r.hash;
          st.rulesUntil = r.validUntil;
        } catch (e) { warn("session rules failed", { error: String(e?.message ?? e) }); }
      }
      const refreshAll = () => { for (const [sid, st] of sessions) if (st.root) void refreshRules(sid); };

      async function start(sid) {
        const st = stateOf(sid);
        if (st.started) return;
        st.started = true;
        const out = await gate("session-start.mjs", { session_id: sid, source: "startup", cwd: ROOT });
        const context = out?.hookSpecificOutput?.additionalContext;
        if (context) {
          try { await ctx.session.instructions.entry.put({ sessionID: sid, key: "leerharnas-start", value: context }); }
          catch (e) { warn("instructions failed", { error: String(e?.message ?? e) }); }
        }
        const version = ctx.app?.version ? String(ctx.app.version) : "?";
        const tested = t("oc.version", { version, tested: TESTED });
        await notice(sid, [out?.systemMessage, tested].filter(Boolean).join("\n\n"));
        await refreshRules(sid, true);
      }

      // ---- Events: start, end, the learner's own ! commands ----
      const controller = new AbortController();
      void (async () => {
        try {
          for await (const ev of ctx.event.subscribe({ types: ["session.created", "session.deleted", "session.shell.ended",
            "session.execution.interrupted", "session.execution.failed"], signal: controller.signal })) {
            const d = ev?.data ?? {};
            const sid = d.sessionID;
            if (!sid) continue;
            try {
              if (ev.type === "session.created") {
                const st = stateOf(sid);
                if (d.parentID) { st.root = false; st.rootSid = await rootOf(d.parentID); continue; }
                st.root = true; st.rootSid = sid;
                await start(sid);
              } else if (ev.type === "session.deleted") {
                if (stateOf(sid).root !== false) await gate("session-end.mjs", { session_id: sid, reason: "deleted" });
                sessions.delete(sid);
              } else if (ev.type === "session.shell.ended") {
                const root = await rootOf(sid);
                await refreshRules(root);
              } else if (await rootOf(sid) === sid) {
                // Interrupted or failed: the idle hook does not run, but the markers in the answer still count.
                const { file, messages } = await writeTranscript(sid);
                await gate("reflect-gate.mjs", { session_id: sid, transcript_path: file, last_assistant_message: lastAssistantText(messages), stop_hook_active: true, cwd: ROOT });
              }
            } catch (e) { warn(`event ${ev.type} failed`, { error: String(e?.message ?? e) }); }
          }
        } catch (e) { if (!controller.signal.aborted) warn("event stream ended", { error: String(e?.message ?? e) }); }
      })();

      // The record changed on disk (skill.mjs in a terminal outside opencode): rewrite the session rules.
      const watchers = [];
      let debounce = null;
      const soon = () => { clearTimeout(debounce); debounce = setTimeout(refreshAll, 300); };
      try { watchers.push(fs.watch(STATE_DIR, soon)); } catch { /* no state yet: the prompt hook still refreshes */ }
      try { watchers.push(fs.watch(LEARN, (_, f) => { if (String(f ?? "").toLowerCase() === "skills.json") soon(); })); } catch { /* no record yet */ }

      // ---- Prompt: the prompt gate ----
      await ctx.session.hook("prompt", async (event) => {
        const sid = event.sessionID;
        if (await rootOf(sid) !== sid) return;
        const st = stateOf(sid);
        st.continued = false;
        st.continuations = 0;
        await start(sid);
        await refreshRules(sid);
        const { file } = await writeTranscript(sid);
        const out = await gate("prompt-gate.mjs", { session_id: sid, prompt: String(event.prompt?.text ?? ""), transcript_path: file, cwd: ROOT, origin: { kind: "human" } });
        if (out?.error) {
          st.status = t("oc.gateFailed", { error: out.error });
          return;
        }
        st.status = out?.hookSpecificOutput?.additionalContext ?? "";
        if (out?.systemMessage) await notice(sid, out.systemMessage);
      });

      // ---- Every agent-loop request: the status line (root sessions only; the analyst gets nothing extra) ----
      await ctx.session.hook("context", (event) => {
        const st = sessions.get(event.sessionID);
        if (!st?.root || !st.status) return;
        event.system.push({ type: "text", text: st.status });
      });

      // ---- Shell: remember the full command and its folder for the evaluation that follows ----
      await ctx.shell.hook("create.before", (event) => { shells.add(event); });

      // ---- Permissions: the guard ----
      await ctx.permission.hook("evaluate", async (event) => {
        if (event.effect === "deny") return;
        try {
          const rootSid = await rootOf(event.sessionID);
          let allowedMcp = [];
          try { allowedMcp = settingsOf(loadSkills()).allowedMcp ?? []; } catch { allowedMcp = []; }
          const shell = event.action === "shell" ? shells.match(event.resources) : null;
          const { requests, deny } = toRequests(event, { root: ROOT, rootSid, shell, allowedMcp });
          if (deny) {
            event.effect = "deny";
            event.message = t(deny === "codemode" ? "oc.deny.codemode" : "oc.deny.mcp", { action: event.action });
            logEvent({ type: "deny", tool: `opencode:${event.action}`, reason: event.message, session: rootSid });
            return;
          }
          for (const req of requests) {
            const r = guard(req);
            if (r.decision === "deny") { event.effect = "deny"; event.message = r.reason; return; }
          }
        } catch (e) {
          // Fail closed for what can change code; reads stay allowed, as on Claude Code.
          if (["edit", "shell", "execute"].includes(event.action) || !["read", "glob", "grep", "skill", "question", "webfetch", "websearch", "external_directory", "subagent"].includes(event.action)) {
            event.effect = "deny";
            event.message = t("guard.crash", { error: String(e?.message ?? e).slice(0, 200) });
          }
        }
      });

      // ---- The end of a turn: the reflect gate ----
      await ctx.session.hook("experimental.idle", async (event) => {
        const sid = event.sessionID;
        if (await rootOf(sid) !== sid) return;
        // Wait for the session's own subagent (the analyst): its result wakes the session and this hook runs again.
        if ((event.background ?? []).some((w) => w.kind === "subagent" && w.sessionID === sid)) return;
        const st = stateOf(sid);
        const { file, messages } = await writeTranscript(sid);
        const out = await gate("reflect-gate.mjs", { session_id: sid, transcript_path: file, last_assistant_message: lastAssistantText(messages),
          stop_hook_active: st.continued, cwd: ROOT });
        if (out?.systemMessage) await notice(sid, out.systemMessage);
        if (out?.decision === "block" && out.reason && st.continuations < MAX_CONTINUATIONS) {
          st.continued = true;
          st.continuations += 1;
          await ctx.session.synthetic({ sessionID: sid, text: out.reason, description: "leerharnas", metadata: { source: "leerharnas" } });
        } else {
          st.continued = false;
        }
      });

      return () => {
        controller.abort();
        for (const w of watchers) { try { w.close(); } catch { /* closed */ } }
        clearTimeout(debounce);
      };
    },
  };
}

export default createPlugin();
