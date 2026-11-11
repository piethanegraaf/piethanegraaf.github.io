#!/usr/bin/env node
// Export learning progress for the dashboard, with privacy filters. No network, no shell.
//
//   node harness/export.mjs <projectmap> [--out <bestand.json>] [--dry-run]
//
// - Only a WHITELIST of fields is exported (see build() below). Raw events, session ids,
//   transcripts, file paths and test runs never leave the project.
// - Every free text (explanations, reflections, notes, reasons) passes the privacy filters:
//   e-mail addresses, absolute paths, the user name, session and transcript ids, HTML comments,
//   and the terms in <projectmap>/.learning/private.json (local, never committed).
// - The learner's name from skills.json ("learner") is always filtered too.
// - --dry-run writes nothing and shows a report of what would be filtered.
// - Check the diff of the output yourself before you commit or push it.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HARNESS = path.dirname(fileURLToPath(import.meta.url));
// The messages of the harness in both languages, to give its fixed notes in the language of the page.
const I18N = Object.fromEntries(["nl", "en"].map((l) => [l, JSON.parse(fs.readFileSync(path.join(HARNESS, "i18n", `${l}.json`), "utf8"))]));
const DEFAULT_OUT = path.join(HARNESS, "..", "site-src", "dashboard", "data", "progress.json");
export const SCHEMA = 1;

const fail = (msg) => { console.error(`Fout: ${msg}`); process.exit(1); };

// ---------- Privacy filters ----------
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Fixed filters, in this order. Each one counts its hits for the report.
export function fixedFilters({ userNames = [] } = {}) {
  const names = [...new Set(userNames.filter((n) => n && n.length >= 3))];
  return [
    { id: "html-comment", re: /<!--[\s\S]*?-->/g, to: "" },
    { id: "email", re: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, to: "[e-mail]" },
    { id: "transcript", re: /[^\s"'`()]*\.claude[\\/]+projects[\\/][^\s"'`()]*/gi, to: "[transcript]" },
    { id: "windows-path", re: /\b[A-Z]:[\\/][^\s"'`()<>|]*/gi, to: "[pad]" },
    { id: "unix-path", re: /(?<![\w.])\/(?:home|Users|mnt|[a-z])\/[^\s"'`()<>|]+/g, to: "[pad]" },
    { id: "uuid", re: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, to: "[sessie]" },
    ...(names.length ? [{ id: "user-name", re: new RegExp(`\\b(${names.map(escapeRe).join("|")})\\b`, "gi"), to: "[gebruiker]" }] : []),
  ];
}

// .learning/private.json: { "terms": ["..."], "replace": { "term": "vervanging" } }
export function privateFilters(priv) {
  const out = [];
  const replace = priv?.replace && typeof priv.replace === "object" ? priv.replace : {};
  const terms = Array.isArray(priv?.terms) ? priv.terms : [];
  for (const [term, to] of [...Object.entries(replace), ...terms.map((t) => [t, "[privé]"])]) {
    if (typeof term !== "string" || !term.trim()) continue;
    out.push({ id: "private", term, re: new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(term.trim())}(?![\\p{L}\\p{N}])`, "giu"), to: String(to) });
  }
  // Longer terms first, so "Jan de Vries" wins over "Jan".
  return out.sort((a, b) => b.term.length - a.term.length);
}

export function makeScrubber(filters) {
  const report = new Map(); // id -> { n, fields: Set }
  const scrub = (text, field) => {
    if (text === null || text === undefined) return text;
    let s = String(text);
    for (const f of filters) {
      s = s.replace(f.re, () => {
        const key = f.id === "private" ? `private: ${f.term}` : f.id;
        const r = report.get(key) ?? { n: 0, fields: new Set() };
        r.n++; r.fields.add(field);
        report.set(key, r);
        return f.to;
      });
    }
    return s.replace(/[ \t]{2,}/g, " ").trim();
  };
  return { scrub, report };
}

// ---------- Diary: only whitelisted, labelled fields ----------
const LABELS = {
  plan: /^\*\*(Plan \((student|learner)\)):\*\*\s*(.*)$/i,
  wentWell: /^\*\*(Wat ging goed|What went well)[^*]*:\*\*\s*(.*)$/i,
  signals: /^\*\*(Doorstroom-signalen|Promotion signals):\*\*\s*(.*)$/i,
  reflection: /^\*\*(Reflectie|Reflection)[^*]*:\*\*\s*(.*)$/i,
  calibration: /^\*\*(Kalibratie|Calibration):\*\*\s*(.*)$/i,
};
const REFLECT = [
  ["learned", /^1\.\s*\*(Geleerd|Learned):\*\s*(.*)$/i],
  ["confusing", /^2\.\s*\*(Verwarrend[^*]*|Confusing[^*]*):\*\s*(.*)$/i],
  ["confidence", /^3\.\s*\*(Zelfvertrouwen nu|Confidence now):\*\s*(.*)$/i],
];

export function parseDiary(text, date) {
  const sessions = [];
  for (const part of String(text).split(/^## /m).slice(1)) {
    const lines = part.split(/\r?\n/);
    const head = lines[0].split("·").map((x) => x.trim());
    const session = { date, n: Number((head[0].match(/(\d+)/) ?? [])[1]) || sessions.length + 1, time: head[1] ?? null, skills: head.slice(2).join(" · ") || null };
    let field = null;
    for (const raw of lines.slice(1)) {
      const line = raw.trim();
      if (/^\*\*[^*]+:\*\*/.test(line)) {
        field = null;
        for (const [key, re] of Object.entries(LABELS)) {
          const m = line.match(re);
          if (m) { field = key; session[key] = (m[m.length - 1] ?? "").trim(); break; }
        }
        continue;
      }
      if (!field || !line) continue;
      if (field === "reflection") {
        for (const [key, re] of REFLECT) {
          const m = line.match(re);
          if (m) session[`reflection.${key}`] = m[2].trim();
        }
      } else if (/^[-*]\s+/.test(line)) {
        session[field] = [session[field], line.replace(/^[-*]\s+/, "")].filter(Boolean).join(" · ");
      }
    }
    const conf = (session["reflection.confidence"] ?? "").split("·");
    const nextStep = conf.slice(1).join("·").replace(/^\s*\*(Volgende stap|Next step):\*\s*/i, "").trim();
    const before = (session.plan ?? "").match(/(zelfvertrouwen vooraf|confidence before):\s*([^·]*)/i);
    sessions.push({
      date: session.date, n: session.n, time: session.time, skills: session.skills,
      plan: (session.plan ?? "").replace(/·?\s*(zelfvertrouwen vooraf|confidence before):.*$/i, "").trim() || null,
      confidenceBefore: before ? before[2].trim() : null,
      wentWell: session.wentWell ?? null,
      signals: session.signals ?? null,
      reflection: {
        learned: session["reflection.learned"] ?? null,
        confusing: session["reflection.confusing"] ?? null,
        confidenceAfter: conf[0]?.trim() || null,
        nextStep: nextStep || null,
      },
      calibration: session.calibration ?? null,
    });
  }
  return sessions;
}

// ---------- Build the whitelisted export ----------
export async function build(project) {
  const learn = path.join(project, ".learning");
  if (!fs.existsSync(path.join(learn, "skills.json"))) throw new Error(`geen .learning/skills.json in ${project}`);
  // Reuse the harness's own logic (stats, promotion signals) on this project's data.
  process.env.LEERHARNAS_ROOT = project;
  process.env.LEERHARNAS_DATA = learn;
  const lib = await import("./hooks/lib.mjs");
  const data = lib.loadSkills();
  const settings = lib.settingsOf(data);

  let priv = {};
  const privFile = path.join(learn, "private.json");
  if (fs.existsSync(privFile)) {
    try { priv = JSON.parse(fs.readFileSync(privFile, "utf8")); } catch { throw new Error(".learning/private.json is geen geldige JSON"); }
  }
  const userNames = [os.userInfo().username, path.basename(os.homedir()), ...(typeof data.learner === "string" ? data.learner.split(/\s+/) : [])];
  const filters = [...privateFilters(priv), ...fixedFilters({ userNames })];
  const { scrub, report } = makeScrubber(filters);

  const events = lib.readEvents();
  const skillIds = new Set(data.skills.map((s) => s.id));
  const knownSkill = (id) => (skillIds.has(id) ? id : null);
  const day = (iso) => String(iso ?? "").slice(0, 10) || null;

  // Tasks, with explanation, rejections and corrections.
  const tasks = [];
  const byTid = new Map();
  for (const e of events) {
    if (e.type === "task") {
      const tk = {
        id: e.tid ?? `legacy-${tasks.length + 1}`, at: e.at, skill: knownSkill(e.skill), source: ["check", "done", "chat"].includes(e.source) ? e.source : null,
        success: Boolean(e.success), maxRung: Number(e.maxRung ?? 0), minutes: Number.isFinite(e.minutes) ? e.minutes : null,
        what: scrub(e.what ?? null, "task.what"), explained: !e.tid, explanation: null, explainedAt: null, explainedBy: null,
        lapsed: false, lapseReason: null, retaggedFrom: null,
        rejections: [], corrections: [], void: false, voidReason: null,
      };
      tasks.push(tk);
      if (e.tid) byTid.set(e.tid, tk);
    } else if (e.type === "task-void") {
      const tk = e.tid ? byTid.get(e.tid) : [...tasks].reverse().find((x) => !x.void && x.skill === e.skill);
      if (tk) { tk.void = true; tk.voidReason = scrub(e.reason ?? null, "task.voidReason"); }
    } else if (e.type === "task-explained") {
      const tk = byTid.get(e.tid);
      if (tk) {
        tk.explained = true; tk.explanation = scrub(e.text ?? null, "task.explanation"); tk.explainedAt = e.at;
        tk.explainedBy = e.source === "replay" ? "replay" : null; tk.lapsed = false; tk.lapseReason = null;
      }
    } else if (e.type === "task-lapsed") {
      // Skipped: the explanation did not come right away (setup review S1).
      const tk = byTid.get(e.tid);
      if (tk && !tk.explained) { tk.lapsed = true; tk.lapseReason = ["other-exercise", "session-end"].includes(e.reason) ? e.reason : null; }
    } else if (e.type === "task-retag") {
      // The demotion analyst linked the task to a microskill (S3a).
      const tk = byTid.get(e.tid);
      if (tk && knownSkill(e.to)) { tk.retaggedFrom = tk.retaggedFrom ?? tk.skill; tk.skill = e.to; }
    } else if (e.type === "explain-rejected") {
      const tk = byTid.get(e.tid);
      if (tk) tk.rejections.push({ at: e.at, by: e.by === "hook" ? "hook" : "claude", reasons: (e.reasons ?? []).map((r) => scrub(r, "task.rejection")) });
    } else if (e.type === "task-correct") {
      const tk = byTid.get(e.tid);
      if (tk && Number(e.maxRung) > tk.maxRung) {
        tk.corrections.push({ at: e.at, from: tk.maxRung, to: Number(e.maxRung), reason: scrub(e.reason ?? null, "task.correction") });
        tk.maxRung = Number(e.maxRung);
        if (tk.maxRung >= 5) tk.success = false;
      }
    }
  }

  // Regressions per skill (folder -> skill), without test names or paths.
  const regressions = events.filter((e) => e.type === "regression" || e.type === "regression-fixed").map((e) => {
    const s = e.dir ? lib.skillForPath(data, path.join(project, e.dir, "__probe__", "x.cs")) : null;
    return { at: e.at, skill: s && s.kind !== "zone" ? s.id : null, tests: (e.tests ?? []).length, fixed: e.type === "regression-fixed" };
  });

  // Activity per day: counts only.
  const activity = new Map();
  const act = (d) => { if (!activity.has(d)) activity.set(d, { date: d, sessions: new Set(), hints: 0, holds: 0, denials: 0, overridesUsed: 0 }); return activity.get(d); };
  for (const e of events) {
    const d = day(e.at);
    if (!d) continue;
    if (e.session) act(d).sessions.add(e.session);
    if (e.type === "hint-unlock") act(d).hints++;
    else if (e.type === "hint-hold") act(d).holds++;
    else if (e.type === "deny") act(d).denials++;
    else if (e.type === "override-used") act(d).overridesUsed++;
  }

  const overrides = events.filter((e) => e.type === "override").map((e) => ({
    at: e.at, skill: e.skill === "*" ? "*" : knownSkill(e.skill), minutes: Number(e.minutes ?? 0), reason: scrub(e.reason ?? null, "override.reason"),
  }));
  const reviews = events.filter((e) => e.type === "review").map((e) => ({
    at: e.at, skill: knownSkill(e.skill), result: ["pass", "shaky", "fail"].includes(e.result) ? e.result : null, nextReview: e.nextReview ?? null,
    auto: e.auto === true,
  }));

  // "Last seen": the last task of the skill, neutral instead of "overdue" (setup review S2).
  const lastSeen = new Map();
  for (const tk of tasks) if (tk.skill && !tk.void) lastSeen.set(tk.skill, day(tk.at));
  // Both languages where they exist (the dashboard is bilingual, the record is in one language):
  // the title from the map when the learner did not rename the skill, and the fixed notes of the
  // harness itself. The learner's own texts stay as they are.
  const mapTitles = new Map();
  let manifest = null;
  try { manifest = JSON.parse(fs.readFileSync(path.join(project, ".claude", "leerharnas.json"), "utf8")); } catch { /* older install */ }
  try {
    // Titles are matched by id, so the default map is safe for a project without a manifest.
    const mapId = /^[a-z0-9-]+$/.test(manifest?.map ?? "") ? manifest.map : "ood";
    for (const m of JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", mapId, "skills.json"), "utf8")).skills ?? []) {
      if (m.title && typeof m.title === "object") mapTitles.set(m.id, m.title);
    }
  } catch { /* no manifest or map: titles stay as they are */ }
  // In the language of the record: the learner's own title. In the other language: the title from the map.
  const titlesOf = (s) => {
    const mt = mapTitles.get(s.id);
    if (!mt?.nl || !mt?.en) return null;
    const out = { nl: scrub(mt.nl, "skill.title"), en: scrub(mt.en, "skill.title") };
    out[settings.language] = scrub(s.title, "skill.title");
    return out;
  };
  const notesOf = (note) => {
    if (!note) return null;
    const out = {};
    for (const [key, tpl] of Object.entries(I18N[settings.language] ?? {})) {
      if (!key.startsWith("note.")) continue;
      const names = [...tpl.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      const re = new RegExp("^" + tpl.split(/\{\w+\}/).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("(.+?)") + "$");
      const m = note.match(re);
      if (!m) continue;
      for (const l of ["nl", "en"]) out[l] = names.reduce((txt, n, i) => txt.split(`{${n}}`).join(m[i + 1]), I18N[l][key]);
      return { nl: scrub(out.nl, "skill.history"), en: scrub(out.en, "skill.history") };
    }
    return null;
  };
  const skills = data.skills.map((s) => ({
    id: s.id, parent: s.parent ?? null, kind: s.kind ?? null, title: scrub(s.title, "skill.title"), titles: titlesOf(s), level: s.level,
    // Reviews are only for L4; an older schedule on a lower level is not shown.
    nextReview: lib.REVIEWED.has(s.level) ? s.nextReview ?? null : null, intervalIndex: s.intervalIndex ?? 0,
    lastReview: s.lastReview ? { at: s.lastReview.at, result: s.lastReview.result } : null,
    lastSeen: lastSeen.get(s.id) ?? null,
    placement: s.kind === "zone" ? null : lib.isPlacementPending(data, s) ? "pending" : "done",
    history: (s.history ?? []).map((h) => ({ at: h.at, from: h.from ?? null, to: h.to, note: scrub(h.note ?? null, "skill.history"),
      notes: notesOf(h.note ?? null), auto: h.auto === true, placement: h.placement === true })),
  }));

  // The signals in both languages (texts), next to the text in the language of the record.
  const signals = data.skills.filter((s) => s.kind !== "zone").map((s) => {
    const a = lib.levelAdvice(data, s);
    if (!a) return null;
    const texts = {};
    for (const l of ["nl", "en"]) { lib.setLanguage(l); texts[l] = scrub(lib.levelAdvice(data, s)?.text ?? a.text, "signal"); }
    lib.setLanguage(settings.language);
    return { skill: s.id, dir: a.dir, text: scrub(a.text, "signal"), texts };
  }).filter(Boolean);

  const diary = [];
  const diaryDir = path.join(learn, "diary");
  for (const f of (fs.existsSync(diaryDir) ? fs.readdirSync(diaryDir) : []).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort()) {
    for (const s of parseDiary(fs.readFileSync(path.join(diaryDir, f), "utf8"), f.slice(0, 10))) {
      const sc = (v, k) => scrub(v, `diary.${k}`) || null;
      diary.push({
        date: s.date, n: s.n, time: sc(s.time, "time"), skills: sc(s.skills, "skills"), plan: sc(s.plan, "plan"),
        confidenceBefore: sc(s.confidenceBefore, "confidence"), wentWell: sc(s.wentWell, "wentWell"), signals: sc(s.signals, "signals"),
        reflection: Object.fromEntries(Object.entries(s.reflection).map(([k, v]) => [k, sc(v, `reflection.${k}`)])),
        calibration: sc(s.calibration, "calibration"),
      });
    }
  }

  const out = {
    schema: SCHEMA,
    // Only ever ADD fields: browsers may run a cached, older app.js on new data (GitHub Pages caches
    // it for 10 minutes, the data is fetched fresh). generatedAt stays a date (local), exportedAt is
    // the exact moment, so two exports on one day differ and the dashboard can show the time.
    generatedAt: new Date().toLocaleDateString("sv-SE"),
    exportedAt: new Date().toISOString(),
    course: scrub(settings.course || null, "settings.course"),
    language: settings.language,
    examDate: settings.examDate ?? null,
    settings: { defaultLevel: settings.defaultLevel, targetSuccess: settings.targetSuccess, stuckTimerMinutes: settings.stuckTimerMinutes },
    skills, tasks, reviews, regressions, overrides, signals,
    activity: [...activity.values()].sort((a, b) => a.date.localeCompare(b.date)).map((a) => ({ ...a, sessions: a.sessions.size })),
    diary,
  };
  return { out, report, filters };
}

// ---------- CLI ----------
async function main() {
  const argv = process.argv.slice(2);
  let project = null, out = DEFAULT_OUT, dryRun = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") dryRun = true;
    else if (argv[i] === "--out") out = path.resolve(argv[++i] ?? fail("--out heeft een bestand nodig"));
    else if (argv[i].startsWith("-")) fail(`onbekende optie ${argv[i]}`);
    else project = path.resolve(argv[i]);
  }
  if (!project) { console.log("Gebruik: node harness/export.mjs <projectmap> [--out <bestand.json>] [--dry-run]"); process.exit(1); }
  let result;
  try { result = await build(project); } catch (e) { fail(e.message); }
  const { out: json, report } = result;

  console.log(`Export van ${project}`);
  console.log(`  ${json.skills.length} vaardigheden · ${json.tasks.length} taken · ${json.reviews.length} herhalingen · ${json.diary.length} dagboeksessies`);
  console.log(report.size ? "\nWeggefilterd:" : "\nWeggefilterd: niets.");
  for (const [key, r] of [...report.entries()].sort()) console.log(`  ${key.padEnd(28)} ${String(r.n).padStart(4)}x  in ${[...r.fields].sort().join(", ")}`);
  if (!fs.existsSync(path.join(project, ".learning", "private.json"))) {
    console.log("\nLet op: er is geen .learning/private.json. Zet daar namen en termen in die niet online mogen (zie de docs).");
  }
  if (dryRun) { console.log("\n--dry-run: er is niets geschreven."); return; }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(json, null, 2) + "\n");
  console.log(`\nGeschreven: ${out}\nControleer de diff zelf voordat je commit of pusht.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
