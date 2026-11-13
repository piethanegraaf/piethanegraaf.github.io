// The AI-use log of graded work (setup of 13 Nov, #50). Only the hooks write it, never Claude (the guard
// blocks Claude in settings.graded.paths and in the log folder). OER art. 7.11 asks, at AI level 1: say how
// GenAI was used, add the prompts with a link to the session (or say the tool has none), cite it in APA,
// and check the output yourself. The folder (settings.graded.logDir, default <repo>/ai-verantwoording):
//
//   README.md                     the AI level, the APA reference, "Claude Code has no share link", how the export is made.
//                                 Written once; after that it is the student's (never replaced).
//   logboek.md (en: log.md)       one row per answer of Claude: when, session, skill, rung, kind of help, and an
//                                 empty last column the student fills in: what I did with it / how I checked it.
//   sessies/<date>-<sid8>.md      the prompts of the student and the text of Claude, without tool output, written
//   (en: sessions/)               again after every answer, so the last export is always the whole session.
//
// Every text passes the privacy filters of privacy.mjs (logFilters): the home folder becomes ~, e-mail and
// transcript paths go, and so do the terms of .learning/private.json. Hook and system messages are left out
// (learnerText), and so is the output of "!" commands.
import fs from "node:fs";
import path from "node:path";
import { LEARN, t, language, readTranscript, isLearnerEntry, learnerEntryText, entryText } from "./lib.mjs";
import { logFilters } from "./privacy.mjs";

const pad = (n) => String(n).padStart(2, "0");
const localDay = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const localTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const sid8 = (sid) => String(sid ?? "").replace(/[^\w-]/g, "").slice(0, 8) || "sessie";

// The scrubber of the log: the filters of privacy.mjs with the private terms of the record. Unlike the
// dashboard export it keeps spaces and line breaks: the indentation of an example must stay readable.
export function logScrubber({ home } = {}) {
  let priv = {};
  try { priv = JSON.parse(fs.readFileSync(path.join(LEARN, "private.json"), "utf8")); } catch { /* optional */ }
  const filters = logFilters({ ...(home ? { home } : {}), priv });
  return (text) => filters.reduce((s, f) => s.replace(f.re, f.to), String(text ?? ""));
}

// "claude-opus-5-5" -> "Claude Opus 5.5"; an unknown form stays as it is.
export function modelName(id) {
  const m = String(id ?? "").match(/^claude-([a-z]+)-(\d+)(?:-(\d{1,2}))?(?:-\d{8})?$/i);
  if (!m) return id ? String(id) : null;
  return `Claude ${m[1][0].toUpperCase()}${m[1].slice(1)} ${m[2]}${m[3] ? "." + m[3] : ""}`;
}

// The kind of help of an answer, by its highest rung (or a review).
export function helpKind(rung, review = false) {
  if (review) return t("graded.kind.review", { rung });
  return t(`graded.kind.${Math.max(0, Math.min(5, Number(rung) || 0))}`);
}

// What the student typed, without the output of "!" commands and local commands, and with the tags of
// slash commands made readable.
function promptText(s) {
  return String(s)
    .replace(/<(bash-stdout|bash-stderr|local-command-stdout|local-command-stderr|command-message)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ")
    .replace(/<bash-input\b[^>]*>([\s\S]*?)<\/bash-input\s*>/gi, "! $1")
    .replace(/<command-name\b[^>]*>([\s\S]*?)<\/command-name\s*>/gi, "$1")
    .replace(/<command-args\b[^>]*>([\s\S]*?)<\/command-args\s*>/gi, " $1")
    .replace(/[ \t]+\n/g, "\n").trim();
}

// The turns of a session: [{ who: "student"|"claude", at, text }], consecutive texts of Claude merged.
// lastMessage (the Stop input) is added when the transcript does not have it yet.
export function sessionTurns(entries, lastMessage = null) {
  const turns = [];
  let model = null;
  for (const e of entries) {
    if (e?.isSidechain) continue;
    if (e?.type === "user") {
      if (!isLearnerEntry(e)) continue;
      const text = promptText(learnerEntryText(e) ?? "");
      if (text) turns.push({ who: "student", at: e.timestamp ?? null, text });
    } else if (e?.type === "assistant") {
      model = e.message?.model && !/^<synthetic>$/.test(e.message.model) ? e.message.model : model;
      const text = entryText(e).trim();
      if (!text) continue;
      const last = turns[turns.length - 1];
      if (last?.who === "claude") last.text += "\n\n" + text;
      else turns.push({ who: "claude", at: e.timestamp ?? null, text });
    }
  }
  const lm = typeof lastMessage === "string" ? lastMessage.trim() : "";
  if (lm) {
    const last = turns[turns.length - 1];
    if (last?.who === "claude") { if (!last.text.includes(lm)) last.text += "\n\n" + lm; }
    else turns.push({ who: "claude", at: new Date().toISOString(), text: lm });
  }
  return { turns, model };
}

const names = () => (language() === "en" ? { log: "log.md", sessions: "sessions" } : { log: "logboek.md", sessions: "sessies" });

// The README, once (it becomes the student's after that). It waits until the model is known: the APA
// reference needs it, and right after the first answer the transcript often does not have it yet.
export function ensureReadme(G, { model = null, now = new Date() } = {}) {
  const file = path.join(G.logDir, "README.md");
  if (fs.existsSync(file) || !model) return false;
  fs.mkdirSync(G.logDir, { recursive: true });
  const n = names();
  const ladder = [1, 2, 3, 4].filter((r) => r <= G.maxRung).map((r) => `    - ${t("graded.readme.rung", { rung: r, name: t(`rung.${r}`) })}`).join("\n");
  fs.writeFileSync(file, t("graded.readme", {
    level: G.aiLevel,
    ladder: G.aiLevel === 0 ? t("graded.readme.noHelp") : ladder,
    max: G.maxRung,
    year: now.getFullYear(),
    model: modelName(model) ?? "Claude",
    log: n.log,
    sessions: n.sessions,
  }).trimEnd() + "\n");
  return true;
}

const cell = (s) => String(s ?? "-").replace(/\r?\n/g, " ").replace(/\|/g, "\\|").trim() || "-";

// One row per answer. A second Stop for the same prompt (the hook blocked, Claude went on) replaces the
// row it wrote, while that row is still the last line; otherwise the new row is added.
// st.gradedRow = { key, line } is kept in the session state.
// `tooling`: commands the guard allowed in graded work in this turn (review of 13 Nov, night, #55). Each gets a
// row of its own, before the row of the answer: "tooling (no AI content): <command>".
export function writeLogRow(G, st, { sid, key, at = new Date(), skill = null, rung = 0, review = false, sessionFile, tooling = [] }) {
  const n = names();
  const file = path.join(G.logDir, n.log);
  fs.mkdirSync(G.logDir, { recursive: true });
  let text = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : t("graded.logHead").trimEnd() + "\n";
  const sessionCell = `[${sid8(sid)}](${n.sessions}/${path.basename(sessionFile)})`;
  const stamp = `${localDay(at)} ${localTime(at)}`;
  const line = `| ${stamp} | ${sessionCell} | ${cell(skill)} | ${Number(rung) || 0} | ${cell(helpKind(rung, review))} |  |`;
  const toolRows = tooling.map((c) => `| ${stamp} | ${sessionCell} | - | 0 | ${cell(t("graded.kind.tooling", { cmd: `\`${String(c).replace(/`/g, "'")}\`` }))} |  |`);
  const lines = text.replace(/\s+$/, "").split(/\r?\n/);
  if (st.gradedRow?.key === key && lines[lines.length - 1] === st.gradedRow.line) lines.splice(lines.length - 1, 1, ...toolRows, line);
  else lines.push(...toolRows, line);
  text = lines.join("\n") + "\n";
  fs.writeFileSync(file, text);
  st.gradedRow = { key, line };
  return file;
}

// The export of the whole session so far, written again after every answer.
export function writeSessionExport(G, { sid, entries, lastMessage = null, startedAt = null, scrub }) {
  const { turns, model } = sessionTurns(entries, lastMessage);
  const first = turns.find((x) => x.at)?.at ?? startedAt ?? Date.now();
  const day = localDay(new Date(first));
  const n = names();
  const dir = path.join(G.logDir, n.sessions);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${day}-${sid8(sid)}.md`);
  const head = t("graded.session.head", { sid8: sid8(sid), sid: scrub(String(sid ?? "-")), day, model: model ?? "-", name: modelName(model) ?? "-" });
  const body = turns.map((x) => {
    const when = x.at ? localTime(new Date(x.at)) : "--:--";
    const who = t(x.who === "student" ? "graded.session.student" : "graded.session.claude");
    // Text of the student is quoted, so a heading in it cannot break the structure of the file.
    const text = scrub(x.text);
    const shownText = x.who === "student" ? text.split("\n").map((l) => (l ? `> ${l}` : ">")).join("\n") : text;
    return `## ${when} · ${who}\n\n${shownText}\n`;
  }).join("\n");
  fs.writeFileSync(file, head.trimEnd() + "\n\n" + body);
  return { file, model, turns: turns.length };
}

// Rows of this session whose last column is still empty (for the end of the session and /diary).
export function openRows(G, sid) {
  try {
    const text = fs.readFileSync(path.join(G.logDir, names().log), "utf8");
    return text.split(/\r?\n/).filter((l) => l.includes(`[${sid8(sid)}](`) && /\|\s*\|\s*$/.test(l)).length;
  } catch { return 0; }
}

// The learner's own words in the empty last column of the rows of a session (review of 13 Nov, night, #59).
// Only the Stop hook calls this, with text it checked is part of what the learner typed. Rows that already
// have text are left alone. Returns the number of rows filled.
export function fillLastColumn(G, sid, text) {
  const file = path.join(G.logDir, names().log);
  let src;
  try { src = fs.readFileSync(file, "utf8"); } catch { return 0; }
  const tag = `[${sid8(sid)}](`;
  let n = 0;
  const out = src.split(/(\r?\n)/).map((l) => {
    if (!l.includes(tag) || !/\|\s*\|\s*$/.test(l)) return l;
    n++;
    return l.replace(/\|\s*\|\s*$/, `| ${cell(text)} |`);
  }).join("");
  if (n) fs.writeFileSync(file, out);
  return n;
}

// Everything at once, for the Stop hook. Never throws: a failing log must not stop the session.
export function logAnswer(G, st, { sid, transcriptPath, entries = null, lastMessage, key, skill, rung, review }) {
  try {
    const scrub = logScrubber();
    const all = entries ?? readTranscript(transcriptPath);
    const exp = writeSessionExport(G, { sid, entries: all, lastMessage, startedAt: st.startedAt, scrub });
    ensureReadme(G, { model: exp.model });
    const tooling = (Array.isArray(st.gradedTooling) ? st.gradedTooling : []).map((c) => scrub(c));
    const log = writeLogRow(G, st, { sid, key, skill, rung, review, sessionFile: exp.file, tooling });
    st.gradedTooling = [];
    return { ok: true, log, session: exp.file };
  } catch (e) {
    return { ok: false, error: String(e?.message ?? e).slice(0, 200) };
  }
}
