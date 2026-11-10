// Shared helpers for the learning harness (leerharnas).
// Data lives in <project>/.learning/. No dependencies, Node >= 18.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { t, setLanguage, language } from "./i18n.mjs";
import { CAUSAL, sessionMarker } from "./patterns.mjs";

export { t, setLanguage, language };

// The hooks live in <project>/.claude/hooks/, so the project is two levels up.
// LEERHARNAS_ROOT and LEERHARNAS_DATA only exist for testing (a temporary project and data).
export const ROOT = process.env.LEERHARNAS_ROOT
  ? path.resolve(process.env.LEERHARNAS_ROOT)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const LEARN = process.env.LEERHARNAS_DATA ?? path.join(ROOT, ".learning");
export const SKILLS_FILE = path.join(LEARN, "skills.json");
export const STATE_DIR = path.join(LEARN, "state");
export const DIARY_DIR = path.join(LEARN, "diary");
const OVERRIDES_FILE = path.join(STATE_DIR, "overrides.json");
const EVENTS_FILE = path.join(STATE_DIR, "events.jsonl");
export const TESTS_FILE = path.join(STATE_DIR, "tests.json");

export const LEVELS = ["L0", "L1", "L2", "L3", "L4"];
// Level names in the learner's language (i18n: level.L0 ... level.L4).
export const levelName = (l) => (LEVELS.includes(l) ? t(`level.${l}`) : "");
// Levels at which the AI must not write or run the learner's code.
export const PROTECTED = new Set(["L1", "L2", "L3"]);
// Levels that get spaced reviews (mastered or nearly mastered).
export const REVIEWED = new Set(["L3", "L4"]);

export async function readStdin() {
  let s = "";
  for await (const chunk of process.stdin) s += chunk;
  return s;
}

export function today(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString("sv-SE"); // YYYY-MM-DD in local time
}

const dayDiff = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

// ---- Settings (in skills.json, changed by the learner with `skill.mjs setting`) ----
// The defaults fit a C#/.NET course. Another language sets codeExtensions and buildCommands.
export const DEFAULT_SETTINGS = {
  course: "",
  language: "nl",
  examDate: null,
  defaultLevel: "L2",
  stuckTimerMinutes: 12,
  targetSuccess: 0.85,
  // Files whose content belongs to the learner (the guard protects them at L1-L3).
  codeExtensions: ["cs", "csproj", "sln", "slnx"],
  // Commands that build, run or test code (regular expressions, case-insensitive).
  buildCommands: [
    "\\bdotnet(\\.exe)?\\s+(build|test|run|watch|publish|pack|new|add|remove|restore|msbuild|vstest|format|exec|sln)\\b",
    "\\b(msbuild|csc|devenv|vstest(\\.console)?)\\b",
  ],
  // Words that point to tooling (environment, IDE): "it works" about these is not a solved task.
  toolingTerms: ["visual studio", "vs", "vs ?code", "rider", "sdk", "\\.net \\d", "dotnet --", "install", "ide",
    "extensie", "extension", "nuget", "git", "onedrive", "inlog", "login"],
};

export function settingsOf(data) {
  return { ...DEFAULT_SETTINGS, ...(data?.settings ?? {}) };
}

const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A list setting; a wrong type falls back to the default (a hook that crashes lets everything through).
const listSetting = (data, key) => {
  const v = settingsOf(data)[key];
  return Array.isArray(v) ? v.map(String) : DEFAULT_SETTINGS[key];
};
// A regex from settings; an invalid pattern falls back to the default, so the guard never fails open.
const safeRe = (make, data, key) => {
  try { return make(listSetting(data, key)); } catch { return make(DEFAULT_SETTINGS[key]); }
};

// File extension pattern for learner code, e.g. /\.(cs|csproj)$/i (end) or /\.(cs|csproj)\b/i (in a command).
export function codeExtRe(data, inCommand = false) {
  const ext = listSetting(data, "codeExtensions").map((e) => escapeRe(e.replace(/^\./, ""))).filter(Boolean);
  return new RegExp(`\\.(${ext.join("|") || "(?!)"})${inCommand ? "\\b" : "$"}`, "i");
}

// Commands that build, run or test code. check.mjs (the harness test runner) always counts.
export function buildCmdRe(data) {
  return safeRe((list) => new RegExp([...list, "check\\.mjs"].map((s) => `(?:${s})`).join("|"), "i"), data, "buildCommands");
}

export function toolingRe(data) {
  return safeRe((list) => new RegExp(`\\b(${list.join("|")})\\b`, "i"), data, "toolingTerms");
}

// Files of the harness itself. Only the learner changes them (by hand, with "!" or install.mjs),
// otherwise the AI could switch off its own guard.
export function isHarnessPath(r) {
  return r !== null && /^\.claude\/(hooks\/|skills\/diary\/|settings(\.local)?\.json$|leerharnas)/i.test(r);
}

// Reading the record also sets the language of all messages (settings.language).
export function loadSkills() {
  const data = JSON.parse(fs.readFileSync(SKILLS_FILE, "utf8"));
  setLanguage(settingsOf(data).language);
  return data;
}

export function saveSkills(data) {
  data.updated = today();
  fs.writeFileSync(SKILLS_FILE, JSON.stringify(data, null, 2) + "\n");
}

export function findSkill(data, id) {
  return data.skills.find((s) => s.id.toLowerCase() === String(id).toLowerCase());
}

// Microskills: entries with "parent". They have their own level, keywords and reviews,
// but no paths: the guard keeps using the parent's level for files.
export const isMicro = (s) => Boolean(s?.parent);
export const microsOf = (data, parentId) => data.skills.filter((s) => s.parent === parentId);
export const familyIds = (data, id) => [id, ...microsOf(data, id).map((m) => m.id)];

// ---- Spaced reviews: Fibonacci intervals (1, 2, 3, 5, 8, 13, 21, 34, ...) ----
export function fib(i) {
  let a = 1, b = 2;
  for (let k = 0; k < i; k++) [a, b] = [b, a + b];
  return a;
}

// Next review date for interval index i, pulled forward so that a review before the exam remains.
export function reviewDate(data, i) {
  let days = fib(Math.max(0, i));
  const exam = data.settings?.examDate;
  if (exam) {
    const left = dayDiff(today(), exam);
    if (left > 1) days = Math.min(days, Math.max(1, left - 3));
  }
  return today(days);
}

// Called after `set`: L3/L4 get a review schedule, lower levels none.
export function scheduleOnLevel(data, s) {
  if (REVIEWED.has(s.level)) {
    s.intervalIndex = 0;
    s.failStreak = 0;
    s.nextReview = reviewDate(data, 0);
  } else {
    s.nextReview = null;
    s.intervalIndex = 0;
    s.failStreak = 0;
  }
}

// pass: one step up · shaky: same interval · fail: two steps back. Returns advice text or null.
export function scheduleOnReview(data, s, result) {
  let i = s.intervalIndex ?? 0;
  if (result === "pass") { i += 1; s.failStreak = 0; }
  else if (result === "shaky") { s.failStreak = 0; }
  else { i = Math.max(0, i - 2); s.failStreak = (s.failStreak ?? 0) + 1; }
  s.intervalIndex = i;
  s.nextReview = reviewDate(data, i);
  if (result === "fail" && s.failStreak >= 2) {
    const lower = LEVELS[Math.max(0, LEVELS.indexOf(s.level) - 1)];
    return t("review.twoFails", { cmd: `node .claude/hooks/skill.mjs set ${s.id} ${lower} "${t("note.twoReviewFails")}"` });
  }
  return null;
}

export const dueReviews = (data, t = today()) =>
  data.skills.filter((s) => s.kind !== "zone" && REVIEWED.has(s.level) && s.nextReview && s.nextReview <= t);

// Glob -> RegExp. Supports **, *, ?. Case-insensitive (Windows).
export function globToRegex(glob) {
  let re = "";
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === "*" && glob[i + 1] === "*") {
      i++;
      if (glob[i + 1] === "/") { i++; re += "(?:.*/)?"; } else re += ".*";
    } else if (c === "*") re += "[^/]*";
    else if (c === "?") re += "[^/]";
    else re += c.replace(/[.+^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp("^" + re + "$", "i");
}

// Project-relative path with forward slashes, or null if outside the project.
export function rel(p) {
  if (!p) return null;
  let s = String(p);
  const m = s.match(/^\/([a-zA-Z])\/(.*)$/); // Git Bash style /c/path/to/...
  if (m) s = `${m[1]}:/${m[2]}`;
  const r = path.relative(ROOT, path.resolve(ROOT, s));
  if (r.startsWith("..") || path.isAbsolute(r)) return null;
  return r.split(path.sep).join("/");
}

// Most specific skill for a project path: highest priority, then longest pattern.
export function skillForPath(data, p) {
  const r = rel(p);
  if (r === null) return null;
  let best = null;
  for (const s of data.skills) {
    for (const pat of s.paths ?? []) {
      if (!globToRegex(pat).test(r)) continue;
      const score = [s.priority ?? 0, pat.length];
      if (!best || score[0] > best.score[0] || (score[0] === best.score[0] && score[1] > best.score[1])) {
        best = { skill: s, score };
      }
    }
  }
  return best ? best.skill : null;
}

// { inProject, level, skill } for a path. Unmapped project files get settings.defaultLevel.
export function levelForPath(data, p) {
  if (rel(p) === null) return { inProject: false, level: null, skill: null };
  const skill = skillForPath(data, p);
  return { inProject: true, level: skill ? skill.level : settingsOf(data).defaultLevel, skill };
}

// Keywords per skill: .learning/keywords.json plus the "keywords" field of the skill itself (microskills).
export function keywordMap(data) {
  let kw = {};
  try { kw = JSON.parse(fs.readFileSync(path.join(LEARN, "keywords.json"), "utf8")); } catch { /* optional */ }
  const out = {};
  for (const s of data.skills) out[s.id] = [...(kw[s.id] ?? []), ...(s.keywords ?? [])].map((k) => String(k).toLowerCase());
  return out;
}

export function loadOverrides() {
  try {
    const all = JSON.parse(fs.readFileSync(OVERRIDES_FILE, "utf8"));
    const now = Date.now();
    return all.filter((o) => Date.parse(o.until) > now);
  } catch {
    return [];
  }
}

export function addOverride(skillId, minutes, reason) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  const list = loadOverrides();
  const o = { skill: skillId, reason, from: new Date().toISOString(), until: new Date(Date.now() + minutes * 60000).toISOString() };
  list.push(o);
  fs.writeFileSync(OVERRIDES_FILE, JSON.stringify(list, null, 2) + "\n");
  return o;
}

export function isOverrideActive(skillId) {
  return loadOverrides().some((o) => o.skill === skillId || o.skill === "*");
}

// ---- Whose words are these? ----
// Reports from subagents, task notifications and system reminders reach the UserPromptSubmit
// hook as if they were prompts, and sit in the transcript as user entries. They are not the
// learner's words, so they must not unlock hint rungs, log tasks or count as an explanation.
const HARNESS_START = [
  ["agent-message", /^\s*(Another Claude session sent a message|<agent-message\b|\[Subagent hand-back\])/i],
  ["task-notification", /^\s*(<task-notification\b|\[SYSTEM NOTIFICATION\b)/i],
];
const HARNESS_BLOCKS = [
  /<system-reminder\b[^>]*>[\s\S]*?<\/system-reminder\b[^>]*>/gi,
  /\[SYSTEM NOTIFICATION - NOT USER INPUT\][\s\S]*?<\/task-notification\s*>/gi,
  /<task-notification\b[^>]*>[\s\S]*?<\/task-notification\s*>/gi,
  /<agent-message\b[^>]*>[\s\S]*?<\/agent-message\s*>/gi,
];

// The learner's own text in a prompt: { own, why }. own === null means the learner wrote none of it;
// why then says what it was. A prompt that starts like an agent report or notification is ignored
// as a whole; reminder blocks inside a real message are stripped and the rest is kept.
export function learnerText(text, originKind = null) {
  if (originKind && originKind !== "human") return { own: null, why: `origin:${originKind}` };
  const raw = String(text ?? "");
  for (const [why, re] of HARNESS_START) if (re.test(raw)) return { own: null, why };
  let s = raw;
  for (const re of HARNESS_BLOCKS) s = s.replace(re, " ");
  s = s.trim();
  return s ? { own: s, why: null } : { own: null, why: raw.trim() ? "harness-only" : "empty" };
}

// A transcript entry the learner typed: not a tool result, agent report, notification or reminder.
export function isLearnerEntry(e) {
  if (e?.type !== "user" || e.isMeta || e.promptSource === "system") return false;
  const c = e.message?.content;
  if (Array.isArray(c) && c.some((p) => p.type === "tool_result")) return false;
  const text = typeof c === "string" ? c
    : Array.isArray(c) ? c.filter((p) => p.type === "text").map((p) => p.text).join("\n") : "";
  const origin = typeof e.origin === "string" ? e.origin : e.origin?.kind ?? null;
  return learnerText(text, origin).own !== null;
}

// ---- Per-session state (hint ladder, end-of-session) ----
const sessionFile = (sid) => path.join(STATE_DIR, `session-${String(sid).replace(/[^\w-]/g, "_")}.json`);

export function loadSession(sid) {
  try { return JSON.parse(fs.readFileSync(sessionFile(sid), "utf8")); }
  catch { return { startedAt: Date.now(), activeSkill: null, rung: 0, maxRung: 0, lastRungAt: null, taskStartedAt: Date.now(), endRequested: false, nudged: false }; }
}

export function saveSession(sid, st) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(sessionFile(sid), JSON.stringify(st, null, 2) + "\n");
}

// The most recently touched session (for CLI commands run with "!", which get no session id).
export function latestSessionId() {
  try {
    const files = fs.readdirSync(STATE_DIR).filter((f) => /^session-.*\.json$/.test(f))
      .map((f) => ({ f, t: fs.statSync(path.join(STATE_DIR, f)).mtimeMs })).sort((a, b) => b.t - a.t);
    return files.length ? files[0].f.replace(/^session-|\.json$/g, "") : null;
  } catch { return null; }
}

export function readEvents() {
  try {
    return fs.readFileSync(EVENTS_FILE, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  } catch { return []; }
}

export function logEvent(event) {
  try {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.appendFileSync(EVENTS_FILE, JSON.stringify({ at: new Date().toISOString(), ...event }) + "\n");
  } catch { /* logging must never break a hook */ }
}

// ---- Tasks ----
// A task event: { type:"task", tid, skill, success, maxRung, minutes, source, what }.
// It only counts once it is explained in the learner's own words (event "task-explained" with that tid).
// Older tasks without tid count as explained.
export function allTasks() {
  const tasks = [];
  const explained = new Map();
  for (const e of readEvents()) {
    if (e.type === "task") tasks.push({ ...e });
    else if (e.type === "task-void") {
      for (let i = tasks.length - 1; i >= 0; i--) {
        if (!tasks[i].void && (e.tid ? tasks[i].tid === e.tid : tasks[i].skill === e.skill)) { tasks[i].void = true; break; }
      }
    } else if (e.type === "task-explained") explained.set(e.tid, e.text ?? "");
    else if (e.type === "task-correct") {
      // Correction by the learner (skill.mjs correct): only ever more help than logged, never less.
      const t = tasks.find((x) => x.tid === e.tid);
      if (t && Number(e.maxRung) > (t.maxRung ?? 0)) {
        t.maxRung = Number(e.maxRung);
        if (t.maxRung >= 5) t.success = false;
        t.corrected = true;
      }
    }
  }
  return tasks.filter((t) => !t.void).map((t) => ({ ...t, explained: !t.tid || explained.has(t.tid) }));
}

export const pendingTasks = () => allTasks().filter((t) => !t.explained);

export function newTaskId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Log a task (pending until explained) and return it.
export function logTask({ skill, success = true, maxRung = 0, minutes = null, source, what, session }) {
  const t = { type: "task", tid: newTaskId(), skill, success, maxRung, minutes, source, what, session };
  logEvent(t);
  return t;
}

// Success rate over the last n explained tasks. Success = solved with hint rung <= 2.
// A parent skill also counts the tasks of its microskills.
export function taskStats(skillId, n = 10, data = null) {
  const ids = new Set(data ? familyIds(data, skillId) : [skillId]);
  const fam = allTasks().filter((t) => ids.has(t.skill));
  const done = fam.filter((t) => t.explained);
  const last = done.slice(-n);
  const ok = last.filter((t) => t.success && (t.maxRung ?? 0) <= 2).length;
  return { n: last.length, ok, rate: last.length ? ok / last.length : null, pending: fam.length - done.length, tasks: last };
}

// Advisory check of the promotion/demotion criteria from CLAUDE.md. Returns { dir, text, cmd } or null.
export function levelAdvice(data, s) {
  const st = taskStats(s.id, 10, data);
  const t = st.tasks;
  const lastTwo = t.slice(-2);
  if (lastTwo.length === 2 && lastTwo.every((x) => !x.success)) {
    const lower = LEVELS[Math.max(0, LEVELS.indexOf(s.level) - 1)];
    return { dir: "down", text: t("advice.twoFailed", { id: s.id }), cmd: `set ${s.id} ${lower} "${t("note.twoFailed")}"` };
  }
  if (st.n >= 3 && st.rate < 0.7) {
    const lower = LEVELS[Math.max(0, LEVELS.indexOf(s.level) - 1)];
    return { dir: "down", text: t("advice.below70", { id: s.id, ok: st.ok, n: st.n }), cmd: `set ${s.id} ${lower} "${t("note.below70")}"` };
  }
  const clean = t.filter((x) => x.success && (x.maxRung ?? 0) <= 2);
  if (s.level === "L1") {
    const gaps = t.filter((x) => x.success && (x.maxRung ?? 0) <= 1).length;
    if (gaps >= 3) return { dir: "up", text: t("advice.gapsFilled", { id: s.id, n: gaps }), cmd: `set ${s.id} L2 "${t("note.gapsFilled")}"` };
  }
  const target = settingsOf(data).targetSuccess;
  if (s.level === "L2" && st.n >= 5 && st.rate >= target) {
    return { dir: "up", text: t("advice.target", { id: s.id, ok: st.ok, n: st.n, pct: Math.round(target * 100) }), cmd: `set ${s.id} L3 "${t("note.solved", { ok: st.ok, n: st.n })}"` };
  }
  if (s.level === "L3") {
    const solo = clean.filter((x) => (x.maxRung ?? 0) === 0);
    const days = new Set(solo.map((x) => x.at.slice(0, 10)));
    if (solo.length >= 3 && days.size >= 2) {
      return { dir: "up", text: t("advice.solo", { id: s.id, n: solo.length, days: days.size }), cmd: `set ${s.id} L4 "${t("note.solo")}"` };
    }
  }
  return null;
}

// Skills with recent independent successes (rung 0, explained), for positive signals.
export function recentWins(data, days = 7) {
  const since = Date.now() - days * 86400000;
  const wins = new Map();
  for (const t of allTasks()) {
    if (!t.explained || !t.success || (t.maxRung ?? 0) > 0 || Date.parse(t.at) < since) continue;
    wins.set(t.skill, (wins.get(t.skill) ?? 0) + 1);
  }
  return [...wins.entries()].map(([id, n]) => ({ id, n }));
}

// ---- Explanation check (hard part of consolidation) ----
// A task only counts after an explanation in the learner's OWN words. Two keys are needed:
// (1) Claude judges the content and writes the marker [uitleg-ok <tid>], and
// (2) this deterministic check on the learner's own message passes.
const words = (s) => String(s).toLowerCase().replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " x ")
  .split(/[^\p{L}\p{N}_]+/u).filter(Boolean);

export function checkExplanation(text, assistantTexts = []) {
  const reasons = [];
  const raw = String(text ?? "");
  const w = words(raw);
  if (/<bash-(input|stdout)>|<pasted_content/i.test(raw)) reasons.push(t("explain.pasted"));
  if (w.length < 12) reasons.push(t("explain.tooShort", { n: w.length }));
  if (!CAUSAL.test(raw)) reasons.push(t("explain.noWhy"));
  // Copied from Claude? Share of 5-word sequences that also occur in Claude's messages.
  const hay = " " + assistantTexts.map((t) => words(t).join(" ")).join(" | ") + " ";
  const sh = [];
  for (let i = 0; i + 5 <= w.length; i++) sh.push(w.slice(i, i + 5).join(" "));
  if (sh.length) {
    const copied = sh.filter((x) => hay.includes(" " + x + " ")).length / sh.length;
    if (copied > 0.4) reasons.push(t("explain.copied", { pct: Math.round(copied * 100) }));
  }
  return { ok: reasons.length === 0, reasons };
}

export function diaryHasSession(sid) {
  try {
    return fs.readdirSync(DIARY_DIR).filter((f) => f.endsWith(".md")).sort().slice(-3)
      .some((f) => fs.readFileSync(path.join(DIARY_DIR, f), "utf8").match(sessionMarker(sid)) !== null);
  } catch { return false; }
}
