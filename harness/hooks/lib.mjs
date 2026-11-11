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
// Levels that get spaced reviews: only L4 (setup review 2.5). An L4 skill that is due is not
// practised separately: the next time it comes by in real work, the learner does it without the AI.
export const REVIEWED = new Set(["L4"]);

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
  // A break longer than this does not count as active time (session hour, task minutes, stuck timer).
  idleMinutes: 20,
  // Automatic demotion on evidence (setup review 2.2). Off until the logging has been reliable for a few sessions.
  autoDemote: false,
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
// A loose match on the whole text; the guard itself uses buildRes() per command (see shell.mjs).
export function buildCmdRe(data) {
  return safeRe((list) => new RegExp([...list, "check\\.mjs"].map((s) => `(?:${s})`).join("|"), "i"), data, "buildCommands");
}

// The build patterns from settings, one RegExp each. The guard counts a command as a build only
// when a pattern matches at the START of the command (its program), not in its arguments.
export function buildRes(data) {
  return safeRe((list) => list.map((s) => new RegExp(s, "i")), data, "buildCommands");
}

export function toolingRe(data) {
  return safeRe((list) => new RegExp(`\\b(${list.join("|")})\\b`, "i"), data, "toolingTerms");
}

// Files of the harness itself. Only the learner changes them (by hand, with "!" or install.mjs),
// otherwise the AI could switch off its own guard. Only the real harness files of this project:
// .claude/leerharnas-backup/ or a "leerharnas" folder elsewhere are not (setup review 3.6).
export function isHarnessPath(r) {
  return r !== null && /^\.claude\/(hooks\/|skills\/(diary|mastery-check)\/|agents\/demotie-analist\.md$|settings(\.local)?\.json$|leerharnas[^/]*\.(md|json)$)/i.test(r);
}

// Reading the record also sets the language of all messages (settings.language).
export function loadSkills() {
  const data = JSON.parse(fs.readFileSync(SKILLS_FILE, "utf8"));
  setLanguage(settingsOf(data).language);
  return data;
}

export function saveSkills(data) {
  data.updated = today();
  // Reviews are only for L4: an older schedule on a lower level disappears (setup review S2).
  for (const s of data.skills ?? []) if (s.nextReview && !REVIEWED.has(s.level)) s.nextReview = null;
  fs.writeFileSync(SKILLS_FILE, JSON.stringify(data, null, 2) + "\n");
}

export function findSkill(data, id) {
  return data.skills.find((s) => s.id.toLowerCase() === String(id).toLowerCase());
}

// Microskills: entries with "parent". They have their own level, keywords and reviews,
// but no paths: the guard keeps using the parent's level for files.
export const isMicro = (s) => Boolean(s?.parent);
// The family of a skill: the id of the parent skill.
export const familyOf = (s) => (s ? (s.parent ?? s.id) : null);
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

export const isReviewDue = (s, day = today()) => Boolean(s && s.kind !== "zone" && REVIEWED.has(s.level) && s.nextReview && s.nextReview <= day);
export const dueReviews = (data, day = today()) => data.skills.filter((s) => isReviewDue(s, day));

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
// The level is the effective one (see effectiveLevel): a skill whose placement is still open
// counts as L2, an L4 skill whose review is due counts as L3.
export function levelForPath(data, p) {
  if (rel(p) === null) return { inProject: false, level: null, skill: null };
  const skill = skillForPath(data, p);
  return { inProject: true, level: skill ? effectiveLevel(data, skill) : settingsOf(data).defaultLevel, skill };
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

// ---- Since the last dashboard export ----
// export.mjs writes .learning/state/last-export.json each time it writes the dashboard data: the moment
// and three totals. The session start and /diary (`skill.mjs since-export`) compare them with now, so
// the learner sees when an update of the dashboard is worth it. Only totals: no texts, no paths.
// Without the file (no export yet, or no dashboard at all) nothing is said.
export const LAST_EXPORT_FILE = path.join(STATE_DIR, "last-export.json");
const EXPORT_KEYS = ["tasks", "diarySessions", "levelChanges"];

// Counted the same way as the dashboard: every task event, every "## " session in a diary file,
// and every entry in the level history (placements and automatic changes included).
export function exportTotals(data, events = readEvents()) {
  let diarySessions = 0;
  try {
    for (const f of fs.readdirSync(DIARY_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))) {
      diarySessions += (fs.readFileSync(path.join(DIARY_DIR, f), "utf8").match(/^## /gm) ?? []).length;
    }
  } catch { /* no diary yet */ }
  return {
    tasks: events.filter((e) => e.type === "task").length,
    diarySessions,
    levelChanges: (data?.skills ?? []).reduce((n, s) => n + (Array.isArray(s.history) ? s.history.length : 0), 0),
  };
}

export function writeLastExport(totals, exportedAt = new Date().toISOString()) {
  const mark = { exportedAt, ...Object.fromEntries(EXPORT_KEYS.map((k) => [k, totals[k]])) };
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(LAST_EXPORT_FILE, JSON.stringify(mark, null, 2) + "\n");
  return mark;
}

// null without a (valid) file; otherwise what is new since then, never below zero.
export function sinceExport(data, events = readEvents()) {
  let mark;
  try { mark = JSON.parse(fs.readFileSync(LAST_EXPORT_FILE, "utf8")); } catch { return null; }
  if (!mark || typeof mark !== "object" || !EXPORT_KEYS.every((k) => Number.isFinite(mark[k]))) return null;
  const now = exportTotals(data, events);
  return { exportedAt: mark.exportedAt ?? null, ...Object.fromEntries(EXPORT_KEYS.map((k) => [k, Math.max(0, now[k] - mark[k])])) };
}

export const hasNewSinceExport = (s) => Boolean(s && EXPORT_KEYS.some((k) => s[k] > 0));

// One line, in the learner's language: "Sinds de laatste export (11-11 13:50): 3 taken, ...".
export function sinceExportLine(s) {
  const d = new Date(s.exportedAt ?? NaN);
  const pad = (n) => String(n).padStart(2, "0");
  const at = Number.isNaN(d.getTime()) ? "?"
    : `${language() === "en" ? d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : `${d.getDate()}-${d.getMonth() + 1}`} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return t("ss.since", {
    at,
    tasks: s.tasks === 1 ? t("ss.since.task") : t("ss.since.tasks", { n: s.tasks }),
    diary: s.diarySessions === 1 ? t("ss.since.diarySession") : t("ss.since.diarySessions", { n: s.diarySessions }),
    levels: s.levelChanges === 1 ? t("ss.since.levelChange") : t("ss.since.levelChanges", { n: s.levelChanges }),
  });
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

// ---- Transcripts ----
// The text blocks of a transcript entry (tool calls and results left out).
export function entryText(e) {
  const c = e?.message?.content;
  if (typeof c === "string") return c;
  return Array.isArray(c) ? c.filter((p) => p.type === "text").map((p) => p.text).join("\n") : "";
}
const originOf = (e) => (typeof e?.origin === "string" ? e.origin : e?.origin?.kind ?? null);

// A transcript entry the learner typed: not a tool result, agent report, notification or reminder.
export function isLearnerEntry(e) {
  if (e?.type !== "user" || e.isMeta || e.promptSource === "system") return false;
  const c = e.message?.content;
  if (Array.isArray(c) && c.some((p) => p.type === "tool_result")) return false;
  return learnerText(entryText(e), originOf(e)).own !== null;
}

// The learner's own words in a transcript entry, or null.
export const learnerEntryText = (e) => (isLearnerEntry(e) ? learnerText(entryText(e), originOf(e)).own : null);

export function readTranscript(p) {
  try {
    return fs.readFileSync(p, "utf8").split("\n").filter(Boolean).map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch { return []; }
}

// ---- Per-session state (hint ladder, active time, end-of-session) ----
const sessionFile = (sid) => path.join(STATE_DIR, `session-${String(sid).replace(/[^\w-]/g, "_")}.json`);

// startedAt is set at the learner's first prompt (touch), not when a file happens to be created.
const newSession = () => ({
  startedAt: null, lastActiveAt: null, activeMs: 0, activeSkill: null, folderSkill: null, folderSkillAt: null,
  rung: 0, maxRung: 0, lastRungAt: null, lastRungActive: null, taskStartedAt: null, taskStartedActive: null,
  endRequested: false, nudged: false, lastTask: null, reviewHelp: [], explainWords: {},
});

export const sessionExists = (sid) => fs.existsSync(sessionFile(sid));

export function loadSession(sid) {
  try { return { ...newSession(), ...JSON.parse(fs.readFileSync(sessionFile(sid), "utf8")) }; }
  catch { return newSession(); }
}

export function saveSession(sid, st) {
  fs.mkdirSync(STATE_DIR, { recursive: true });
  fs.writeFileSync(sessionFile(sid), JSON.stringify(st, null, 2) + "\n");
}

// The learner is active now (a prompt, or a "!" run of check/skill). Active time only grows by
// breaks of at most settings.idleMinutes: a meal or a long break does not count (setup review 3.5).
// The session hour, the minutes per task and the stuck timer all use active time.
export function touch(st, now = Date.now(), data = null) {
  const idle = Math.max(1, Number(settingsOf(data).idleMinutes) || DEFAULT_SETTINGS.idleMinutes) * 60000;
  if (!st.startedAt) st.startedAt = now;
  if (typeof st.activeMs !== "number") st.activeMs = 0; // older session file: active time starts now
  else if (st.lastActiveAt && now >= st.lastActiveAt && now - st.lastActiveAt <= idle) st.activeMs += now - st.lastActiveAt;
  st.lastActiveAt = now;
  if (!st.taskStartedAt) st.taskStartedAt = now;
  if (typeof st.taskStartedActive !== "number") st.taskStartedActive = st.activeMs;
  return st;
}

// Active minutes since a mark (a value of st.activeMs taken earlier).
export const activeMinutesSince = (st, mark) => Math.max(0, Math.round(((st.activeMs ?? 0) - (mark ?? st.activeMs ?? 0)) / 60000));

// The ladder and the task clock start again.
function resetLadder(st, now) {
  Object.assign(st, {
    rung: 0, maxRung: 0, lastRungAt: null, lastRungActive: null, taskStartedAt: now, taskStartedActive: st.activeMs ?? 0,
    attempted: false, lastErrorSig: null,
  });
  return st;
}

// A task was just logged: the ladder and the task clock start again (lastTaskAt: a "solved" in the
// chat right after a logged task is not a second task).
export function startTask(st, now = Date.now()) {
  resetLadder(st, now);
  st.lastTaskAt = now;
  return st;
}

// ---- The start of a task, and help in a review (setup review of 11 Nov 2026, S3) ----
// The harness knows when a task ends (check.mjs, done, chat). A task BEGINS at a deterministic signal
// of new work. Help in an optional review after a task ([review-trede N #id]) does not raise
// st.maxRung: it is kept in st.reviewHelp and only counts for the next task when that task is about
// the same concept.

// After a logged task (check, done or chat): it is the last task, review help is used up, and the
// next task starts with a fresh ladder.
export function taskLogged(st, task, now = Date.now()) {
  st.lastTask = { tid: task.tid, skill: task.skill, dir: task.dir ?? null, at: now };
  st.reviewHelp = [];
  return startTask(st, now);
}

// The rung of a task that is being logged: all help since the last task (st.maxRung), and the help
// from the review of the previous task when it was about this task's family: the same id, the parent,
// or a microskill of that parent (15c-1). Returns { rung, reviewRung }.
export function taskRung(data, st, skillId) {
  const base = Number(st?.maxRung) || 0;
  const s = findSkill(data, skillId);
  const family = new Set(s ? familyIds(data, familyOf(s)) : [skillId]);
  const fromReview = (st?.reviewHelp ?? []).filter((r) => family.has(r.skill)).map((r) => Number(r.rung) || 0);
  const reviewRung = fromReview.length ? Math.max(...fromReview) : 0;
  return { rung: Math.max(base, reviewRung), reviewRung };
}

const sameFolder = (a, b) => a === b || a.startsWith(b + "/") || b.startsWith(a + "/");
const SKIP_DIR = /^(bin|obj|\.vs|\.idea|\.git|\.claude|\.learning|node_modules)$/i;

// Code files (settings.codeExtensions) changed after `since` (ms), without bin/obj. Relative paths.
export function changedCodeFiles(data, since, { under = "", limit = 50 } = {}) {
  const codeFile = codeExtRe(data);
  const out = [];
  let budget = 4000;
  const walk = (dir) => {
    let entries = [];
    try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (budget-- <= 0 || out.length >= limit) return;
      const f = (dir ? dir + "/" : "") + e.name;
      if (e.isDirectory()) { if (!SKIP_DIR.test(e.name)) walk(f); continue; }
      if (!codeFile.test(e.name)) continue;
      try { if (fs.statSync(path.join(ROOT, f)).mtimeMs > since) out.push(f); } catch { /* skip */ }
    }
  };
  walk(under);
  return out;
}

// The exercise folders of a skill: the folders in the project that match its paths.
export function exerciseDirs(skill) {
  const dirs = [];
  for (const pat of skill?.paths ?? []) {
    if (pat.startsWith("**")) continue;
    const literal = pat.split(/[*?]/)[0];
    const parent = literal.includes("/") ? literal.slice(0, literal.lastIndexOf("/")) : "";
    let entries = [];
    try { entries = fs.readdirSync(path.join(ROOT, parent), { withFileTypes: true }); } catch { continue; }
    const re = globToRegex(pat);
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const r = (parent ? parent + "/" : "") + e.name;
      if (re.test(r + "/x.cs")) dirs.push(r);
    }
  }
  return dirs;
}

// A deterministic signal that the learner started new work since the last logged task (15c-2), or
// null. Never a keyword: only another exercise folder with changed code (scanCode), check.mjs in
// another folder (dir), or the learner's own prompt with the FULL name of another exercise folder or
// a #id of another family (prompt). Without a last task there is nothing to compare with.
export function newWorkSignal(data, st, { dir = null, prompt = null, scanCode = false } = {}) {
  const last = st?.lastTask;
  if (!data || !last) return null;
  const lastFamily = familyOf(findSkill(data, last.skill)) ?? last.skill;
  const mappedFamily = (p) => { const s = skillForPath(data, p); return s && s.kind !== "zone" ? familyOf(s) : null; };
  // Another place than the last task: another folder when the task had one, else another family.
  const elsewhere = (folder) => (last.dir ? !sameFolder(folder, last.dir) : mappedFamily(path.join(ROOT, folder, "__probe__", "x.cs")) !== lastFamily);
  if (dir !== null && elsewhere(dir)) return "check-elsewhere";
  if (prompt) {
    const p = String(prompt).toLowerCase();
    for (const m of p.matchAll(/#([a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+)/g)) {
      const s = findSkill(data, m[1]);
      if (s && s.kind !== "zone" && familyOf(s) !== lastFamily) return "prompt-id";
    }
    for (const s of data.skills) {
      if (s.kind === "zone") continue;
      for (const d of exerciseDirs(s)) {
        const name = d.split("/").pop().toLowerCase();
        const re = new RegExp(`(^|[^a-z0-9-])${escapeRe(name)}($|[^a-z0-9-])`);
        if (re.test(p) && elsewhere(d)) return "prompt-exercise";
      }
    }
  }
  if (scanCode) {
    for (const f of changedCodeFiles(data, last.at)) {
      if (mappedFamily(path.join(ROOT, f)) === null) continue; // not an exercise folder (a zone, or unmapped)
      if (last.dir ? !sameFolder(f, last.dir) : mappedFamily(path.join(ROOT, f)) !== lastFamily) return "code-elsewhere";
    }
  }
  return null;
}

// New work begins (15c-3): the last task is closed for review help, and the ladder and the clock start
// again. Ordinary help given since the last task was for work that was not finished: it does not count
// for the new task, and is logged as help-dropped so it stays visible. Review help stays in
// st.reviewHelp: it still counts when the new task is about the same concept.
export function beginNewWork(st, reason, { session = null, now = Date.now() } = {}) {
  const dropped = Number(st.maxRung) || 0;
  if (dropped > 0) logEvent({ type: "help-dropped", skill: st.activeSkill ?? st.folderSkill ?? null, rung: dropped, after: st.lastTask?.tid ?? null, session });
  logEvent({ type: "task-start", reason, after: st.lastTask?.tid ?? null, session });
  st.lastTask = null;
  return resetLadder(st, now);
}

// ---- The learner's own words per open task (setup review of 11 Nov 2026, S1) ----
// prompt-gate keeps every own message since a task was logged; the explanation check judges them
// together, so an answer in three short messages counts as one. A message from before the task was
// logged never counts.
const norm = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
export function noteExplanationWords(st, text, openTids) {
  const out = {};
  const msg = String(text ?? "").slice(0, 2000);
  for (const tid of openTids) out[tid] = [...(st.explainWords?.[tid] ?? []), msg].slice(-8);
  st.explainWords = out;
  return st;
}
// The text to judge for one task: the kept messages plus the learner's current message (once).
export function explanationText(st, tid, current = "") {
  const list = [...(st?.explainWords?.[tid] ?? [])];
  if (norm(current) && !list.some((m) => norm(m) === norm(current))) list.push(String(current));
  return list.join("\n");
}

function sessionsOnDisk() {
  let files = [];
  try { files = fs.readdirSync(STATE_DIR).filter((f) => /^session-.*\.json$/.test(f)); } catch { return []; }
  return files.map((f) => {
    const sid = f.replace(/^session-|\.json$/g, "");
    try {
      const st = JSON.parse(fs.readFileSync(path.join(STATE_DIR, f), "utf8"));
      const seen = st.lastActiveAt ?? st.lastPromptAt ?? fs.statSync(path.join(STATE_DIR, f)).mtimeMs;
      return { sid, st, seen };
    } catch { return null; }
  }).filter(Boolean).sort((a, b) => b.seen - a.seen);
}

// The session a "!" command belongs to: "!" commands get no session id, and two sessions can be
// open in one project (setup review 3.6). Among the sessions where the learner was active in the
// last idleMinutes, prefer one that works on this family (activeSkill or folderSkill); otherwise
// the session where the learner was active most recently.
export function pickSession(family = null, data = null) {
  const all = sessionsOnDisk();
  if (!all.length) return null;
  const idle = Math.max(1, Number(settingsOf(data).idleMinutes) || DEFAULT_SETTINGS.idleMinutes) * 60000;
  const fam = family ? new Set(family) : null;
  const recent = all.filter((x) => Date.now() - x.seen <= idle);
  const match = fam ? recent.find((x) => fam.has(x.st.activeSkill) || fam.has(x.st.folderSkill)) : null;
  return (match ?? recent[0] ?? all[0]).sid;
}

// Kept for older callers: the session where the learner was active most recently.
export const latestSessionId = () => pickSession();

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
// A task is open for an explanation from the moment it is logged. It lapses (event "task-lapsed")
// at the end of the session or when the learner starts another exercise (setup review S1): a lapsed
// task does not count, is not "open" any more, and the dashboard shows it as skipped. `replay` may
// still explain it, with both keys. "task-retag" moves a task to a microskill (demotion analyst).
export function allTasks() {
  const tasks = [];
  const explained = new Map();
  const lapsed = new Map();
  for (const e of readEvents()) {
    if (e.type === "task") tasks.push({ ...e });
    else if (e.type === "task-void") {
      for (let i = tasks.length - 1; i >= 0; i--) {
        if (!tasks[i].void && (e.tid ? tasks[i].tid === e.tid : tasks[i].skill === e.skill)) { tasks[i].void = true; break; }
      }
    } else if (e.type === "task-explained") explained.set(e.tid, e);
    else if (e.type === "task-lapsed") lapsed.set(e.tid, e);
    else if (e.type === "task-retag") {
      const task = tasks.find((x) => x.tid === e.tid);
      if (task && e.to) { task.retaggedFrom = task.retaggedFrom ?? task.skill; task.skill = e.to; }
    } else if (e.type === "task-correct") {
      // Correction by the learner (skill.mjs correct): only ever more help than logged, never less.
      const task = tasks.find((x) => x.tid === e.tid);
      if (task && Number(e.maxRung) > (task.maxRung ?? 0)) {
        task.maxRung = Number(e.maxRung);
        if (task.maxRung >= 5) task.success = false;
        task.corrected = true;
      }
    }
  }
  return tasks.filter((t) => !t.void).map((t) => {
    const ex = t.tid ? explained.get(t.tid) : null;
    const isExplained = !t.tid || Boolean(ex);
    const lp = !isExplained ? lapsed.get(t.tid) : null;
    return { ...t, explained: isExplained, explainedBy: ex?.source ?? null, lapsed: Boolean(lp), lapseReason: lp?.reason ?? null };
  });
}

export const pendingTasks = () => allTasks().filter((t) => !t.explained && !t.lapsed);

// Let open tasks lapse. keep(task) says which ones stay open. Returns the lapsed tasks.
export function lapseTasks(reason, keep = () => false, session = null) {
  const out = [];
  for (const task of pendingTasks()) {
    if (keep(task)) continue;
    logEvent({ type: "task-lapsed", tid: task.tid, skill: task.skill, reason, session });
    out.push(task);
  }
  return out;
}

export function newTaskId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

// Log a task (pending until explained) and return it. `level` is the level of the skill at that
// moment (setup review §9.3): evidence for a promotion only counts on the level it was gathered at.
// `reviewRung`: the part of maxRung that came from the review of the previous task (S3), if any.
export function logTask({ skill, success = true, maxRung = 0, minutes = null, source, what, session, dir, level, reviewRung = 0 }) {
  const t = { type: "task", tid: newTaskId(), skill, success, maxRung, minutes, source, what, session, ...(dir ? { dir } : {}), ...(level ? { level } : {}),
    ...(reviewRung > 0 ? { reviewRung } : {}) };
  logEvent(t);
  return t;
}

// ---- Placement of a new skill (setup review S4) ----
// A skill below L4 without any history and without own tasks has an open placement: the learner
// tries first, with the L2 hint ladder, and the highest rung of the first task sets the level.
const PLACE = ["L3", "L2", "L2", "L1", "L1", "L0"]; // by highest rung 0..5
export function isPlacementPending(data, s, tasks = null) {
  if (!s || s.kind === "zone" || s.placement === "done" || s.level === "L4") return false;
  if (s.placement === "pending") return true;
  if ((s.history ?? []).length) return false;
  return !(tasks ?? allTasks()).some((x) => x.skill === s.id);
}

// The level that counts now: an open placement counts as L2, an L4 skill with a due review as L3.
export function effectiveLevel(data, s, tasks = null) {
  if (!s) return settingsOf(data).defaultLevel;
  if (isReviewDue(s)) return "L3";
  if (isPlacementPending(data, s, tasks)) return "L2";
  return s.level;
}

// Called right after a task is logged (check.mjs, done, chat): placement of a new skill, or the
// outcome of a due review. Returns { messages, pending } (pending: the demotion analyst is needed).
export function afterTask(data, skillId, task) {
  const s = findSkill(data, skillId);
  if (!s) return { messages: [], pending: null };
  const msgs = [];
  let pending = null;
  const rung = Math.min(5, Math.max(0, Number(task.maxRung) || 0));
  const earlier = allTasks().filter((x) => x.skill === s.id && x.tid !== task.tid);
  if (isPlacementPending(data, s, earlier)) {
    const from = s.level, to = task.success === false ? "L0" : PLACE[rung];
    s.level = to;
    s.placement = "done";
    scheduleOnLevel(data, s);
    s.history = [...(s.history ?? []), { at: today(), atIso: new Date().toISOString(), from, to, note: t("note.placement", { rung }), placement: true }];
    saveSkills(data);
    logEvent({ type: "placement", skill: s.id, rung, from, to, tid: task.tid });
    msgs.push(t("advice.placement", { id: s.id, rung, to, name: levelName(to) }));
  } else if (isReviewDue(s)) {
    // The review is the next task of this skill in real work: rung 0 pass, 1-2 shaky, else fail.
    const result = task.success === false || rung >= 3 ? "fail" : rung === 0 ? "pass" : "shaky";
    const advice = scheduleOnReview(data, s, result);
    s.lastReview = { at: today(), result, tid: task.tid };
    saveSkills(data);
    logEvent({ type: "review", skill: s.id, result, nextReview: s.nextReview, auto: true, tid: task.tid });
    msgs.push(t(`cli.review.${result}`, { id: s.id, date: s.nextReview }));
    if (advice && !settingsOf(data).autoDemote) msgs.push(advice);
    // Two failed reviews in a row: the rule of automatic demotion applies (S2 -> S3).
    if (result === "fail") {
      const r = autoDemote(data, s.id);
      if (r?.messages) msgs.push(...r.messages);
      if (r?.pending) pending = r.pending;
    }
  }
  return { messages: msgs, pending };
}

// ---- Automatic demotion (setup review S3, S3a) ----
// Only the tasks after the last level change of this skill count, so it goes down one step at a time.
const lastLevelChange = (s) => {
  const h = (s.history ?? []).filter((x) => x.to).map((x) => x.atIso ?? x.at).sort();
  return h.length ? h[h.length - 1] : null;
};

// The criterion: at least 3 explained tasks in the last 10 (own tasks, since the last level change),
// and under 70% solved (rung <= 2) or the last 2 not solved; or 2 reviews in a row failed.
export function demotionCriterion(data, s) {
  if (!s || s.kind === "zone" || s.level === "L0") return null;
  const since = lastLevelChange(s);
  const own = allTasks().filter((x) => x.skill === s.id && x.explained && (!since || String(x.at) > since));
  const last = own.slice(-10);
  const ok = (x) => x.success && (x.maxRung ?? 0) <= 2;
  const nOk = last.filter(ok).length;
  const lastTwoFailed = last.length >= 2 && last.slice(-2).every((x) => !ok(x));
  if (last.length >= 3 && (nOk / last.length < 0.7 || lastTwoFailed)) {
    const pct = Math.round((nOk / last.length) * 100);
    return { reason: t(lastTwoFailed ? "advice.auto.reasonLast2" : "advice.auto.reason", { ok: nOk, n: last.length, pct }), tids: last.map((x) => x.tid) };
  }
  if ((s.failStreak ?? 0) >= 2) return { reason: t("advice.auto.reasonReviews"), tids: [] };
  return null;
}

const lowerLevel = (l) => LEVELS[Math.max(0, LEVELS.indexOf(l) - 1)];

// Lowers one skill one step, logs it and returns the message for the learner.
export function demote(data, s, reason, by = "harnas") {
  const from = s.level, to = lowerLevel(from);
  if (to === from) return null;
  s.level = to;
  scheduleOnLevel(data, s);
  s.history = [...(s.history ?? []), { at: today(), atIso: new Date().toISOString(), from, to, note: t("note.auto", { reason }), auto: true, by }];
  saveSkills(data);
  logEvent({ type: "level", skill: s.id, from, to, auto: true, by, reason });
  const parent = s.parent ? findSkill(data, s.parent) : null;
  return t("advice.auto.demoted", {
    id: s.id, from, to, reason,
    parent: parent ? t("advice.auto.parentStays", { parent: parent.id, level: parent.level }) : "",
    cmd: `! node .claude/hooks/skill.mjs set ${s.id} ${from} "${t("note.revert")}"`,
  });
}

// Backstop: two different microskills of one parent demoted automatically within 14 days means the
// problem is broad, whatever the analyst decided each time: the parent goes down too (once).
export function backstop(data, parentId) {
  const parent = findSkill(data, parentId);
  if (!parent || parent.level === "L0") return null;
  const since = Date.now() - 14 * 86400000;
  // A microskill that went down, or that the analyst created below the parent, counts as demoted.
  const recent = readEvents().filter((e) => (e.type === "level" || e.type === "micro-add") && e.auto && Date.parse(e.at) >= since);
  const micros = new Set(recent.filter((e) => microsOf(data, parentId).some((m) => m.id === e.skill)).map((e) => e.skill));
  if (micros.size < 2 || recent.some((e) => e.type === "level" && e.skill === parentId)) return null;
  return demote(data, parent, t("advice.auto.reasonBackstop", { n: micros.size }), "achtervang");
}

// After an explained task (or a failed review): a microskill goes down right away; for a parent
// the demotion analyst decides first (returns { pending }). Nothing happens without autoDemote.
export function autoDemote(data, skillId) {
  if (!settingsOf(data).autoDemote) return null;
  const s = findSkill(data, skillId);
  const crit = demotionCriterion(data, s);
  if (!crit) return null;
  if (isMicro(s)) {
    const msgs = [demote(data, s, crit.reason)];
    const b = backstop(data, s.parent);
    if (b) msgs.push(b);
    return { messages: msgs.filter(Boolean) };
  }
  return { pending: { skill: s.id, tids: crit.tids, reason: crit.reason, at: Date.now() } };
}

const isSolved = (x) => x.success && (x.maxRung ?? 0) <= 2;

// The verdict of the demotion analyst (JSON from the marker [demotie {...}]), checked before
// anything changes (setup review S3a). Returns { ok, error } or { ok, messages }.
export function applyVerdict(data, pending, v) {
  const fail = (error) => ({ ok: false, error, messages: [] });
  if (!v || typeof v !== "object" || Array.isArray(v)) return fail("no JSON object");
  const parent = findSkill(data, pending?.skill);
  if (!parent || isMicro(parent)) return fail("unknown parent skill");
  if (v.ouder !== parent.id) return fail(`"ouder" must be ${parent.id}`);
  if (!["micro", "ouder"].includes(v.oordeel)) return fail(`"oordeel" must be micro or ouder`);
  const tasks = new Map(allTasks().map((x) => [x.tid, x]));
  const failed = new Set((pending.tids ?? []).filter((tid) => tasks.has(tid) && !isSolved(tasks.get(tid))));
  const listed = Array.isArray(v.taken) ? v.taken : [];
  for (const x of listed) if (!failed.has(x?.tid)) return fail(`task ${x?.tid} is not a failed task of ${parent.id}`);
  const fresh = Array.isArray(v.nieuweMicro) ? v.nieuweMicro : [];
  const family = new Set(familyIds(data, parent.id));
  const keywordsOf = (m) => (Array.isArray(m.trefwoorden) ? m.trefwoorden : []).filter((k) => typeof k === "string" && k.trim()).map((k) => k.trim().toLowerCase());
  for (const m of fresh) {
    if (typeof m?.id !== "string" || !m.id.startsWith(parent.id + ".") || !/^[a-z0-9.-]+$/.test(m.id)) return fail(`invalid id ${m?.id}`);
    if (findSkill(data, m.id)) return fail(`${m.id} already exists`);
    if (typeof m.titel !== "string" || !m.titel.trim() || m.titel.length > 80) return fail(`${m.id}: title missing`);
    if (keywordsOf(m).length < 1 || keywordsOf(m).length > 6) return fail(`${m.id}: 2-4 keywords`);
  }
  const freshIds = new Set(fresh.map((m) => m.id));
  for (const x of listed) if (x.micro != null && !family.has(x.micro) && !freshIds.has(x.micro)) return fail(`${x.micro} is not a microskill of ${parent.id}`);
  if (v.oordeel === "micro" && (v.doel === parent.id || (!family.has(v.doel) && !freshIds.has(v.doel)))) return fail(`"doel" must be a microskill of ${parent.id}`);
  if (v.oordeel === "ouder" && v.doel !== parent.id) return fail(`"doel" must be ${parent.id}`);

  // Valid: apply. A new microskill gets the level of the parent minus 1, never what the agent says.
  const below = lowerLevel(parent.level);
  for (const m of fresh) {
    const micro = { id: m.id, parent: parent.id, title: m.titel.trim(), level: below, keywords: keywordsOf(m), placement: "done",
      history: [{ at: today(), atIso: new Date().toISOString(), to: below, note: t("note.byAnalyst") }] };
    scheduleOnLevel(data, micro);
    data.skills.splice(data.skills.indexOf(parent) + 1 + microsOf(data, parent.id).length, 0, micro);
    logEvent({ type: "micro-add", skill: m.id, parent: parent.id, level: below, auto: true, by: "demotie-analist" });
  }
  if (fresh.length) saveSkills(data);
  for (const x of listed) {
    if (x.micro) logEvent({ type: "task-retag", tid: x.tid, from: tasks.get(x.tid).skill, to: x.micro, by: "demotie-analist", pattern: String(x.deelpatroon ?? "").slice(0, 200) });
  }
  logEvent({ type: "demotion-verdict", skill: parent.id, verdict: v.oordeel, target: v.doel, reason: String(v.reden ?? "").slice(0, 600), doubt: v.twijfel === true });
  const msgs = [];
  if (v.oordeel === "ouder") msgs.push(demote(data, parent, pending.reason, "demotie-analist"));
  else if (freshIds.has(v.doel)) {
    msgs.push(t("advice.auto.newMicro", { id: v.doel, level: below, reason: pending.reason, parent: parent.id, plevel: parent.level,
      cmd: `! node .claude/hooks/skill.mjs set ${v.doel} ${parent.level} "${t("note.revert")}"` }));
  } else msgs.push(demote(data, findSkill(data, v.doel), pending.reason, "demotie-analist"));
  if (v.oordeel === "micro") { const b = backstop(data, parent.id); if (b) msgs.push(b); }
  if (v.reden) msgs.push(t("advice.auto.analyst", { reason: String(v.reden).slice(0, 400) }));
  if (v.twijfel === true) msgs.push(t("advice.auto.doubt"));
  return { ok: true, messages: msgs.filter(Boolean) };
}

// Finds [demotie {...}] / [demotion {...}] in a text and parses the JSON (balanced braces).
export function findVerdict(text) {
  const m = /\[(?:demotie|demotion)\s+\{/i.exec(String(text ?? ""));
  if (!m) return null;
  const s = String(text), start = m.index + m[0].length - 1;
  let depth = 0, q = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === "\\") i++; else if (c === '"') q = false; continue; }
    if (c === '"') q = true;
    else if (c === "{") depth++;
    else if (c === "}" && --depth === 0) {
      try { return { json: JSON.parse(s.slice(start, i + 1)) }; } catch (e) { return { error: e.message }; }
    }
  }
  return { error: "unbalanced braces" };
}

// Success rate over the last n explained tasks. Success = solved with hint rung <= 2.
// A parent skill also counts the tasks of its microskills.
export function taskStats(skillId, n = 10, data = null) {
  const ids = new Set(data ? familyIds(data, skillId) : [skillId]);
  const fam = allTasks().filter((t) => ids.has(t.skill));
  const done = fam.filter((t) => t.explained);
  const last = done.slice(-n);
  const ok = last.filter((t) => t.success && (t.maxRung ?? 0) <= 2).length;
  return {
    n: last.length, ok, rate: last.length ? ok / last.length : null, tasks: last,
    pending: fam.filter((t) => !t.explained && !t.lapsed).length, lapsed: fam.filter((t) => t.lapsed).length,
  };
}

// Advisory check of the demotion criteria (only without autoDemote) and the promotion criteria.
// Returns { dir: "down" | "up" | "transfer", text, cmd, ... } or null. `assume` lists task ids that
// count as explained already: check.mjs shows what will be possible after the explanation (§9.2).
export function levelAdvice(data, s, { assume = [] } = {}) {
  const st = taskStats(s.id, 10, data);
  const recent = st.tasks;
  const lastTwo = recent.slice(-2);
  // With autoDemote the harness goes down by itself (S3): no advice to do it by hand.
  const auto = settingsOf(data).autoDemote === true;
  if (!auto && lastTwo.length === 2 && lastTwo.every((x) => !x.success)) {
    const lower = LEVELS[Math.max(0, LEVELS.indexOf(s.level) - 1)];
    return { dir: "down", text: t("advice.twoFailed", { id: s.id }), cmd: `set ${s.id} ${lower} "${t("note.twoFailed")}"` };
  }
  if (!auto && st.n >= 3 && st.rate < 0.7) {
    const lower = LEVELS[Math.max(0, LEVELS.indexOf(s.level) - 1)];
    return { dir: "down", text: t("advice.below70", { id: s.id, ok: st.ok, n: st.n }), cmd: `set ${s.id} ${lower} "${t("note.below70")}"` };
  }
  return promotionAdvice(data, s, { assume });
}

// ---- Promotion (setup review §9) ----
// The evidence for a promotion: the last 10 explained tasks of the family since the last level
// change of this skill, just like automatic demotion. The same tasks never carry two promotions (§9.3).
export function promotionWindow(data, s, assume = []) {
  const ids = new Set(familyIds(data, s.id));
  const since = lastLevelChange(s);
  const extra = new Set(assume);
  return allTasks().filter((x) => ids.has(x.skill) && (x.explained || extra.has(x.tid)) && !x.lapsed && (!since || String(x.at) > since)).slice(-10);
}

// A transfer task of this skill passed since its last level change (/mastery-check, §9.4).
export function transferPassed(s) {
  const since = lastLevelChange(s);
  return readEvents().some((e) => e.type === "transfer-passed" && e.skill === s.id && (!since || String(e.at) > since));
}

const nextLevel = (l) => LEVELS[Math.min(LEVELS.length - 1, LEVELS.indexOf(l) + 1)];
const solvedTask = (x) => x.success && (x.maxRung ?? 0) <= 2;

// The criterion for one step up from `from`, on the tasks of the window. { ok, text, note } or
// { ok: false, needsTransfer, text } when only the transfer task is missing (L3 -> L4).
function stepUp(data, s, from, tasks, transferOk) {
  const id = s.id;
  if (from === "L0") {
    // Explained and correctly predicted: Claude gives [uitleg-ok] only when the prediction was right too.
    const n = tasks.filter((x) => x.success).length;
    return n >= 2 ? { ok: true, text: t("advice.examples", { id, n }), note: t("note.examples", { n }) } : { ok: false };
  }
  if (from === "L1") {
    const gaps = tasks.filter((x) => x.success && (x.maxRung ?? 0) <= 1).length;
    return gaps >= 3 ? { ok: true, text: t("advice.gapsFilled", { id, n: gaps }), note: t("note.gapsFilled") } : { ok: false };
  }
  if (from === "L2") {
    // About 85% solved (rung <= 2) over at least 5 tasks, and mostly with hint 0-1: at least half (§9.5).
    const n = tasks.length, ok = tasks.filter(solvedTask).length;
    const low = tasks.filter((x) => x.success && (x.maxRung ?? 0) <= 1).length;
    const target = settingsOf(data).targetSuccess;
    return n >= 5 && ok / n >= target && low * 2 >= n
      ? { ok: true, text: t("advice.target", { id, ok, n, pct: Math.round(target * 100), low }), note: t("note.solved", { ok, n }) }
      : { ok: false };
  }
  if (from === "L3") {
    const solo = tasks.filter((x) => x.success && (x.maxRung ?? 0) === 0);
    const days = new Set(solo.map((x) => String(x.at).slice(0, 10))).size;
    if (solo.length < 3 || days < 2) return { ok: false };
    return transferOk
      ? { ok: true, text: t("advice.soloTransfer", { id, n: solo.length, days }), note: t("note.solo") }
      : { ok: false, needsTransfer: true, text: t("advice.solo", { id, n: solo.length, days }) };
  }
  return { ok: false };
}

// Promotion advice for one skill. From L2 up the evidence may carry a jump: the walk goes on as long
// as the next criterion also holds on the same tasks (§9.6). From L0 and L1 it is one step at a time:
// a worked example or a skeleton was help given up front, and that is not in the rung.
// Returns { dir: "up", from, to, jump, text, cmd, note, transferNext, tasks, lastTid },
// { dir: "transfer", text, show } when only the transfer task is missing, or null.
export function promotionAdvice(data, s, { assume = [] } = {}) {
  if (!s || s.kind === "zone" || s.level === "L4" || !LEVELS.includes(s.level) || isPlacementPending(data, s)) return null;
  const tasks = promotionWindow(data, s, assume);
  if (!tasks.length) return null;
  const transferOk = transferPassed(s);
  // A task of a microskill on L0/L1 also had help up front, even when the parent is higher.
  const helpUpFront = tasks.some((x) => x.level && LEVELS.indexOf(x.level) < 2);
  const canJump = LEVELS.indexOf(s.level) >= 2 && !helpUpFront;
  let lvl = s.level, to = null, missingTransfer = null;
  const texts = [], notes = [];
  while (lvl !== "L4") {
    const r = stepUp(data, s, lvl, tasks, transferOk);
    if (!r.ok) { if (r.needsTransfer) missingTransfer = r.text; break; }
    to = nextLevel(lvl); texts.push(r.text); notes.push(r.note);
    if (!canJump) break;
    lvl = to;
  }
  const lastTid = tasks[tasks.length - 1].tid;
  if (!to) return missingTransfer ? { dir: "transfer", id: s.id, text: missingTransfer, show: `/mastery-check ${s.id}`, lastTid } : null;
  return {
    dir: "up", id: s.id, from: s.level, to, jump: LEVELS.indexOf(to) - LEVELS.indexOf(s.level) > 1,
    text: texts.join("; "), note: notes.join("; "), cmd: `set ${s.id} ${to} "${notes.join("; ")}"`,
    transferNext: Boolean(missingTransfer), tasks, lastTid,
  };
}

// How a piece of advice is shown: a skill.mjs command, or the transfer task.
export const adviceCommand = (a) => (a.dir === "transfer" ? a.show : `! node .claude/hooks/skill.mjs ${a.cmd}`);

// The promotion events of one skill since its last level change.
function offerEvents(s) {
  const since = lastLevelChange(s);
  return readEvents().filter((e) => e.skill === s.id && ["promotion-offered", "promotion-declined"].includes(e.type) && (!since || String(e.at) > since));
}

// An open promotion proposal the learner can confirm with "ja, doorzetten" (§9.6), or null.
// `declined`: true when the learner said no to this evidence; the proposal only comes back (as a
// notice) after a new task that meets the criterion again. Confirming stays possible.
export function openOffer(data, s) {
  const a = promotionAdvice(data, s);
  if (a?.dir !== "up") return null;
  const ev = offerEvents(s);
  const decline = ev.filter((e) => e.type === "promotion-declined").pop();
  return { ...a, declined: Boolean(decline && decline.lastTid === a.lastTid) };
}

// Should the harness show this proposal (or the transfer hint) now? At most once per skill, level
// and target level; after a "nee" only again when there is new evidence.
export function offerIsNew(s, a) {
  const ev = offerEvents(s);
  const decline = ev.filter((e) => e.type === "promotion-declined").pop();
  if (decline && decline.lastTid === a.lastTid) return false;
  const shown = ev.filter((e) => e.type === "promotion-offered" && e.to === (a.to ?? "transfer")).pop();
  return !shown || Boolean(decline && decline.at > shown.at);
}

// The text of a proposal: what, the evidence, what changes, and how to answer.
export function offerText(a) {
  const tasks = a.tasks ?? [];
  const days = new Set(tasks.map((x) => String(x.at).slice(0, 10))).size;
  const dirs = [...new Set(tasks.map((x) => x.dir).filter(Boolean).map((d) => String(d).split("/").pop()))];
  const evidence = a.from === "L0"
    ? t("offer.evidenceL0", { n: tasks.filter((x) => x.success).length })
    : t("offer.evidence", {
      ok: tasks.filter(solvedTask).length, n: tasks.length, rungs: tasks.map((x) => x.maxRung ?? 0).join(", "), days,
      dirs: dirs.length ? t("offer.dirs", { list: dirs.join(", ") }) : "",
    });
  return t("offer.block", {
    id: a.id, from: a.from, to: a.to, jump: a.jump ? t("offer.jump") : "", evidence, change: t(`offer.change.${a.to}`),
    transfer: a.transferNext ? t("offer.transferNext", { id: a.id }) : "",
  });
}

// Promote a skill after the learner confirmed (prompt-gate, "ja, doorzetten"). The learner decides:
// this only runs on the learner's own prompt, never on Claude's text. Returns { ok, message }.
export function promote(data, s, a, via = "voorstel") {
  const open = pendingTasks().filter((x) => familyIds(data, s.id).includes(x.skill));
  if (open.length) return { ok: false, message: t("cli.set.pending", { n: open.length, id: s.id, tids: open.map((x) => x.tid).join(", ") }) };
  const from = s.level, to = a.to;
  s.level = to;
  scheduleOnLevel(data, s);
  s.history = [...(s.history ?? []), { at: today(), atIso: new Date().toISOString(), from, to, note: a.note, by: "learner", via }];
  if (s.placement === "pending") s.placement = "done";
  saveSkills(data);
  logEvent({ type: "level", skill: s.id, from, to, note: a.note, by: "learner", via });
  return { ok: true, message: t("offer.promoted", { id: s.id, from, to, name: levelName(to), review: s.nextReview ? t("cli.set.firstReview", { date: s.nextReview }) : "" }) };
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
