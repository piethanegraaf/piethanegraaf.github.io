#!/usr/bin/env node
// Export learning progress for the dashboard, with privacy filters. No network, no shell.
//
//   node harness/export.mjs <projectmap> [--out <bestand.json>] [--dry-run] [--allow-untranslated]
//   node harness/export.mjs --check <bestand.json>
//
// - Only a WHITELIST of fields is exported (see build() below). Raw events, session ids,
//   transcripts, file paths and test runs never leave the project.
// - Every free text (explanations, reflections, notes, reasons) passes the privacy filters:
//   e-mail addresses, absolute paths, the user name, session and transcript ids, HTML comments,
//   and the terms in <projectmap>/.learning/private.json (local, never committed).
// - The learner's name from skills.json ("learner") is always filtered too.
// - The dashboard is bilingual, the record is in one language. Every free text gets a translation
//   in the other language(s). The export never translates itself (no network): it lists what is
//   missing in translations.todo.json next to the output, Claude fills that in, and the next run
//   takes the translations over. Without all translations it writes no output (exit code 2),
//   unless --allow-untranslated. --check fails on an output with a missing translation (for CI).
// - --dry-run writes nothing and shows a report of what would be filtered.
// - Each time the output is written, <projectmap>/.learning/state/last-export.json gets the moment and
//   three totals (tasks, diary sessions, level changes). The session start and /diary use it to say
//   what is new since the export. Not with --dry-run, and not when the output is not written (exit code 2).
// - Check the diff of the output yourself before you commit or push it.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HARNESS = path.dirname(fileURLToPath(import.meta.url));
// The messages of the harness in both languages, to give its fixed notes in the language of the page.
export const LANGUAGES = ["nl", "en"];
const I18N = Object.fromEntries(LANGUAGES.map((l) => [l, JSON.parse(fs.readFileSync(path.join(HARNESS, "i18n", `${l}.json`), "utf8"))]));
const DEFAULT_OUT = path.join(HARNESS, "..", "site-src", "dashboard", "data", "progress.json");
export const TODO_NAME = "translations.todo.json";
export const SCHEMA = 1;

const fail = (msg) => { console.error(`Fout: ${msg}`); process.exit(1); };

// ---------- Privacy filters ----------
// They live in hooks/privacy.mjs, so the AI-use log of graded work uses the same ones (#50).
import { fixedFilters, privateFilters, makeScrubber } from "./hooks/privacy.mjs";
export { fixedFilters, privateFilters, makeScrubber };

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

// ---------- Translations: every free text in every language of the dashboard ----------
// A free text is stored once, in the language of the record. out.translations holds the other
// languages: { <language>: { <text>: <translation> } }. Texts that already have both languages
// (map titles, the fixed notes of the harness, signals) are not in it.
const DIARY_TEXTS = ["time", "skills", "plan", "confidenceBefore", "wentWell", "signals", "calibration"];
const hasWords = (s) => typeof s === "string" && /\p{L}{2,}/u.test(s);
export const targetsOf = (source) => LANGUAGES.filter((l) => l !== source);

// The texts of an export that need a translation: text -> the fields it is shown in.
export function translatableTexts(out) {
  const found = new Map();
  const add = (text, field) => {
    if (!hasWords(text)) return;
    if (!found.has(text)) found.set(text, new Set());
    found.get(text).add(field);
  };
  add(out.course, "course");
  for (const s of out.skills ?? []) {
    if (!s.titles) add(s.title, "skill.title");
    for (const h of s.history ?? []) if (!h.notes) add(h.note, "skill.history");
  }
  for (const x of out.tasks ?? []) {
    add(x.what, "task.what"); add(x.explanation, "task.explanation"); add(x.voidReason, "task.voidReason");
    for (const r of x.rejections ?? []) for (const reason of r.reasons ?? []) add(reason, "task.rejection");
    for (const c of x.corrections ?? []) add(c.reason, "task.correction");
  }
  for (const o of out.overrides ?? []) add(o.reason, "override.reason");
  for (const s of out.signals ?? []) if (!s.texts) add(s.text, "signal");
  for (const d of out.diary ?? []) {
    for (const k of DIARY_TEXTS) add(d[k], `diary.${k}`);
    for (const [k, v] of Object.entries(d.reflection ?? {})) add(v, `diary.reflection.${k}`);
  }
  return found;
}

// Earlier translations: those of the previous export (same source language) and those Claude wrote
// in the todo file. The todo file wins, so a translation can be corrected there too.
export function translationMemory(source, { previous = null, todo = null } = {}) {
  const memory = Object.fromEntries(targetsOf(source).map((l) => [l, new Map()]));
  const fromTodo = Object.fromEntries(targetsOf(source).map((l) => [l, new Set()]));
  const filled = (v) => typeof v === "string" && v.trim() !== "";
  if (previous?.language === source) {
    for (const [l, table] of Object.entries(previous.translations ?? {})) {
      if (!memory[l] || !table || typeof table !== "object") continue;
      for (const [text, v] of Object.entries(table)) if (filled(v)) memory[l].set(text, v);
    }
  }
  if (todo?.source === source) {
    for (const item of Array.isArray(todo.items) ? todo.items : []) {
      if (typeof item?.text !== "string") continue;
      for (const l of Object.keys(memory)) {
        if (filled(item[l])) { memory[l].set(item.text, item[l].trim()); fromTodo[l].add(item.text); }
      }
    }
  }
  return { memory, fromTodo };
}

// Sets out.translations for the texts of THIS export only: a text that is gone, or that a filter now
// changes, drops out together with its translation. Translations pass the privacy filters as well.
export function applyTranslations(out, { memory }, scrub = (s) => s) {
  const texts = translatableTexts(out);
  const translations = {};
  const missing = [];
  for (const [l, mem] of Object.entries(memory)) {
    translations[l] = {};
    for (const text of texts.keys()) {
      const v = mem.has(text) ? scrub(mem.get(text), `translation.${l}`) : "";
      if (v) translations[l][text] = v;
      else missing.push({ text, language: l, fields: [...texts.get(text)] });
    }
  }
  out.translations = translations;
  return { texts, missing };
}

// For CI: every text that needs a translation has one, in every other language.
export function missingTranslations(json) {
  const missing = [];
  for (const [text, fields] of translatableTexts(json)) {
    for (const l of targetsOf(json.language)) {
      const v = json.translations?.[l]?.[text];
      if (typeof v !== "string" || !v.trim()) missing.push({ text, language: l, fields: [...fields] });
    }
  }
  return missing;
}

// The work list for Claude: every text with a missing translation, plus the translations from the
// todo file that are not in an export yet (so nothing is lost when the export stops).
const TODO_ABOUT = (source) => [
  `Translations for the learning dashboard. Every "text" is in "${source}". Write its translation in each empty language field (${targetsOf(source).join(", ")}), then run the export again: it takes the translations over and removes this file.`,
  "Translate faithfully: the same meaning, tone and length. Do not correct, improve, summarize or add anything; informal and short stays informal and short. Translate what was meant: a typo does not need to be copied.",
  "Keep unchanged: code, identifiers and test names, skill ids (such as cs.basis), levels (L0-L4), compiler codes (such as CS0161), numbers, dates, times and placeholders in square brackets (such as [privé]).",
  "Use the words of the dashboard: trede = rung, vaardigheid = skill, microvaardigheid = microskill, uitleg = explanation, herhaling = review, doorstroom = promotion, terugval = relapse, opdracht = exercise, dagboek = diary, plaatsing = placement, zelfvertrouwen = confidence, kalibratie = calibration, (leer)harnas = (learning) harness, overgeslagen = skipped.",
  "\"fields\" says where a text is shown. Explanations (task.explanation) and reflections (diary.reflection.*) are the learner's own words: keep their voice. The dashboard marks every translation and shows the original next to it.",
];
export function todoContent(source, texts, { missing, memory, fromTodo }) {
  const missingFor = new Map();
  for (const m of missing) missingFor.set(m.text, (missingFor.get(m.text) ?? new Set()).add(m.language));
  const items = [];
  for (const [text, fields] of texts) {
    if (!missingFor.has(text) && !targetsOf(source).some((l) => fromTodo[l]?.has(text))) continue;
    const item = { text, fields: [...fields] };
    for (const l of targetsOf(source)) item[l] = memory[l]?.get(text) ?? "";
    items.push(item);
  }
  return { about: TODO_ABOUT(source), source, languages: targetsOf(source), items };
}

// ---------- Build the whitelisted export ----------
// previous: the earlier output (for its translations); todo: the todo file Claude filled in.
export async function build(project, { previous = null, todo = null } = {}) {
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
        // The part of the rung that came from the review of the previous task (setup review of 11 Nov, S3).
        reviewRung: Number(e.reviewRung) > 0 ? Number(e.reviewRung) : null,
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

  // Tasks of a sensitive skill (the security skills, research §2.13) keep their numbers, but not their
  // free texts: an explanation or a test name can say where an employer's code is vulnerable.
  for (const tk of tasks) {
    if (!lib.isSensitive(data, tk.skill) && !lib.isSensitive(data, tk.retaggedFrom)) continue;
    tk.what = null; tk.explanation = null; tk.voidReason = null; tk.withheld = true;
    for (const r of tk.rejections) r.reasons = [];
    for (const c of tk.corrections) c.reason = null;
  }

  // Regressions per skill (folder -> skill), without test names or paths.
  const regressions = events.filter((e) => e.type === "regression" || e.type === "regression-fixed").map((e) => {
    const s = e.dir ? lib.skillForPath(data, path.join(project, e.dir, "__probe__", "x.cs")) : null;
    return { at: e.at, skill: s && s.kind !== "zone" ? s.id : null, tests: (e.tests ?? []).length, fixed: e.type === "regression-fixed" };
  });

  // Activity per day: counts only.
  const activity = new Map();
  const act = (d) => { if (!activity.has(d)) activity.set(d, { date: d, sessions: new Set(), hints: 0, holds: 0, denials: 0, overridesUsed: 0, reviewHelp: 0, helpDropped: 0 }); return activity.get(d); };
  for (const e of events) {
    const d = day(e.at);
    if (!d) continue;
    if (e.session) act(d).sessions.add(e.session);
    if (e.type === "hint-unlock") act(d).hints++;
    else if (e.type === "hint-hold") act(d).holds++;
    else if (e.type === "deny") act(d).denials++;
    else if (e.type === "override-used") act(d).overridesUsed++;
    else if (e.type === "review-help") act(d).reviewHelp++;
    else if (e.type === "help-dropped") act(d).helpDropped++;
  }
  // Help in a review after a task, and help that did not count because new work began (S3): shown
  // apart from the tasks. Ids and numbers only.
  const reviewHelp = events.filter((e) => e.type === "review-help").map((e) => ({
    at: e.at, skill: knownSkill(e.skill), rung: Number(e.rung) || 0, reviewOf: typeof e.reviewOf === "string" && /^[a-z0-9]+$/.test(e.reviewOf) ? e.reviewOf : null,
  }));
  const helpDropped = events.filter((e) => e.type === "help-dropped").map((e) => ({ at: e.at, skill: knownSkill(e.skill), rung: Number(e.rung) || 0 }));
  // Help about a skill during a task of another family (setup review of 11 Nov, afternoon, #26), and the
  // proposals for a microskill with their outcome (#22). Ids, numbers and fixed values only. The id of a
  // proposed microskill comes from Claude: it goes through the filters, and only as a plain id below its parent.
  const tidOf = (v) => (typeof v === "string" && /^[a-z0-9]+$/.test(v) ? v : null);
  const conceptHelp = events.filter((e) => e.type === "concept-help").map((e) => ({
    at: e.at, skill: knownSkill(e.skill), rung: Number(e.rung) || 0, taskSkill: knownSkill(e.taskSkill), task: tidOf(e.taskTid),
  }));
  const microProposals = [];
  const openProposal = new Map();
  for (const e of events) {
    if (e.type === "micro-offered") {
      const parent = knownSkill(e.parent);
      const raw = typeof e.skill === "string" ? e.skill : "";
      const id = parent && /^[a-z0-9.-]+$/.test(raw) && raw.startsWith(parent + ".") ? scrub(raw, "micro.id") : null;
      const p = { at: e.at, parent, id: id && /^[a-z0-9.-]+$/.test(id) ? id : null, level: lib.LEVELS.includes(e.level) ? e.level : null,
        evidence: ["review", "concept", "task"].includes(e.evidence) ? e.evidence : null, rung: Number(e.rung) || 0, outcome: "noAnswer" };
      microProposals.push(p);
      openProposal.set(raw, p);
    } else if ((e.type === "micro-declined" || (e.type === "micro-add" && e.via === "voorstel")) && openProposal.has(e.skill)) {
      openProposal.get(e.skill).outcome = e.type === "micro-declined" ? "declined" : "added";
      openProposal.delete(e.skill);
    }
  }

  const overrides = events.filter((e) => e.type === "override").map((e) => ({
    at: e.at, skill: e.skill === "*" ? "*" : knownSkill(e.skill), minutes: Number(e.minutes ?? 0), reason: scrub(e.reason ?? null, "override.reason"),
  }));
  // The transfer task (/mastery-check): passed or not, per skill. The step L3 -> L4 needs a pass.
  const transfers = events.filter((e) => e.type === "transfer-passed" || e.type === "transfer-failed").map((e) => ({
    at: e.at, skill: knownSkill(e.skill), passed: e.type === "transfer-passed",
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
  // How a level change was decided (setup review of 12 Nov, #45): a fixed word, derived from by, via,
  // auto and placement, so no new free text goes online.
  const revertPrefixes = ["nl", "en"].map((l) => String(I18N[l]?.["note.revert"] ?? "").split(":")[0].trim().toLowerCase()).filter(Boolean);
  // A new microskill in an older record has no by/via: its micro-add event says who made it.
  const microAdd = new Map(events.filter((e) => e.type === "micro-add").map((e) => [e.skill, e]));
  const kindOf = (h, s) => {
    if (h.placement) return "placement";
    if (!h.from && !h.by && !h.auto && microAdd.has(s.id)) {
      const e = microAdd.get(s.id);
      if (e.auto) return e.by === "achtervang" ? "backstop" : "analyst";
      if (e.by === "learner" && e.via === "voorstel") return "proposal";
    }
    if (h.auto) return h.by === "demotie-analist" ? "analyst" : h.by === "achtervang" ? "backstop" : "auto";
    if (h.by === "learner" && h.via === "voorstel") return "proposal";
    if (revertPrefixes.some((p) => String(h.note ?? "").toLowerCase().startsWith(p))) return "revert";
    return "manual";
  };
  // When the skill entered the record: its skill-add event, otherwise the start of the log.
  const firstEvent = events.length ? events[0].at : null;
  const addedAt = new Map(events.filter((e) => e.type === "skill-add" || e.type === "micro-add").map((e) => [e.skill, e.at]));
  const skills = data.skills.map((s) => ({
    // A microskill of a sensitive skill gets its title from Claude, which can name a vulnerable spot: its id only.
    id: s.id, parent: s.parent ?? null, kind: s.kind ?? null, level: s.level, titles: titlesOf(s),
    title: s.parent && lib.isSensitive(data, s.id) ? s.id : scrub(s.title, "skill.title"),
    // Reviews are only for L4; an older schedule on a lower level is not shown.
    nextReview: lib.REVIEWED.has(s.level) ? s.nextReview ?? null : null, intervalIndex: s.intervalIndex ?? 0,
    lastReview: s.lastReview ? { at: s.lastReview.at, result: s.lastReview.result } : null,
    lastSeen: lastSeen.get(s.id) ?? null,
    placement: s.kind === "zone" ? null : lib.isPlacementPending(data, s) ? "pending" : "done",
    // The start of the phase history (#45): when the skill entered the record, and whether it started
    // with an open placement (then it is "start" on the dashboard, not a level, until the placement).
    start: { at: addedAt.get(s.id) ?? firstEvent, open: (s.history ?? []).some((h) => h.placement) || (s.kind !== "zone" && lib.isPlacementPending(data, s)) },
    // The window of the harness itself (lastLevelChange and the placement task, #36 a), so the
    // dashboard counts exactly the tasks the harness counts, also when changes without a difference
    // are left out of the history below.
    windowSince: s.kind === "zone" ? null : lib.lastLevelChange(s, events),
    placementTask: s.kind === "zone" ? null : tidOf(lib.placementTaskId(s, events)),
    // changedAt: the exact moment of the change (see lib.levelChangeAt). Changes without a difference
    // (L3 -> L3) are left out (#45); kind says how it was decided, task which task placed the skill.
    history: (s.history ?? []).filter((h) => !(h.from && h.to && h.from === h.to)).map((h) => ({
      // A free note of a sensitive skill stays home too; a fixed note of the harness (notes) is safe.
      at: h.at, changedAt: h.to ? lib.levelChangeAt(s, h, events) : null, from: h.from ?? null, to: h.to,
      note: lib.isSensitive(data, s.id) && !notesOf(h.note ?? null) ? null : scrub(h.note ?? null, "skill.history"),
      notes: notesOf(h.note ?? null), auto: h.auto === true, placement: h.placement === true, kind: kindOf(h, s),
      task: h.placement ? tidOf(h.tid ?? events.filter((e) => e.type === "placement" && e.skill === s.id && e.to === h.to).pop()?.tid) : null })),
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
    diary, reviewHelp, helpDropped, transfers, conceptHelp, microProposals,
  };
  const { memory, fromTodo } = translationMemory(settings.language, { previous, todo });
  const { texts, missing } = applyTranslations(out, { memory }, scrub);
  // The totals for last-export.json, counted by the harness itself, on the same events as this export.
  const totals = lib.exportTotals(data, events);
  return { out, report, filters, missing, totals, todo: todoContent(settings.language, texts, { missing, memory, fromTodo }) };
}

// ---------- CLI ----------
// --check <file>: exit code 1 when a translation is missing (the build of the site runs this).
function checkFile(file) {
  let json;
  try { json = JSON.parse(fs.readFileSync(file, "utf8")); } catch { fail(`${file} is niet te lezen als JSON`); }
  const missing = missingTranslations(json);
  const langs = targetsOf(json.language).join(", ");
  if (!missing.length) { console.log(`Vertalingen compleet (${langs}): ${file}`); return; }
  console.error(`Fout: ${missing.length} vertaling(en) ontbreken (${langs}) in ${file}:`);
  for (const m of missing.slice(0, 20)) console.error(`  [${m.language}] ${m.fields.join(", ")}: ${JSON.stringify(m.text.length > 80 ? `${m.text.slice(0, 77)}...` : m.text)}`);
  if (missing.length > 20) console.error(`  ... en nog ${missing.length - 20}`);
  console.error(`Draai de export opnieuw en laat Claude ${TODO_NAME} invullen (docs: Dashboard bijwerken).`);
  process.exit(1);
}

async function main() {
  const argv = process.argv.slice(2);
  let project = null, out = DEFAULT_OUT, dryRun = false, allowUntranslated = false, check = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") dryRun = true;
    else if (argv[i] === "--allow-untranslated") allowUntranslated = true;
    else if (argv[i] === "--check") check = path.resolve(argv[++i] ?? fail("--check heeft een bestand nodig"));
    else if (argv[i] === "--out") out = path.resolve(argv[++i] ?? fail("--out heeft een bestand nodig"));
    else if (argv[i].startsWith("-")) fail(`onbekende optie ${argv[i]}`);
    else project = path.resolve(argv[i]);
  }
  if (check) return checkFile(check);
  if (!project) { console.log("Gebruik: node harness/export.mjs <projectmap> [--out <bestand.json>] [--dry-run] [--allow-untranslated]\n       node harness/export.mjs --check <bestand.json>"); process.exit(1); }

  // The earlier translations: in the previous output, and in the todo file next to it.
  const todoFile = path.join(path.dirname(out), TODO_NAME);
  let previous = null, todo = null;
  try { previous = JSON.parse(fs.readFileSync(out, "utf8")); } catch { /* no earlier export */ }
  if (fs.existsSync(todoFile)) {
    try { todo = JSON.parse(fs.readFileSync(todoFile, "utf8")); } catch { fail(`${todoFile} is geen geldige JSON. Herstel het bestand; de vertalingen erin gaan anders verloren.`); }
  }
  let result;
  try { result = await build(project, { previous, todo }); } catch (e) { fail(e.message); }
  const { out: json, report, missing, totals, todo: work } = result;

  console.log(`Export van ${project}`);
  console.log(`  ${json.skills.length} vaardigheden · ${json.tasks.length} taken · ${json.reviews.length} herhalingen · ${json.diary.length} dagboeksessies`);
  console.log(report.size ? "\nWeggefilterd:" : "\nWeggefilterd: niets.");
  for (const [key, r] of [...report.entries()].sort()) console.log(`  ${key.padEnd(28)} ${String(r.n).padStart(4)}x  in ${[...r.fields].sort().join(", ")}`);
  if (!fs.existsSync(path.join(project, ".learning", "private.json"))) {
    console.log("\nLet op: er is geen .learning/private.json. Zet daar namen en termen in die niet online mogen (zie de docs).");
  }
  const langs = targetsOf(json.language).join(", ");
  console.log(missing.length ? `\nVertalingen (${langs}): ${new Set(missing.map((m) => m.text)).size} tekst(en) nog niet vertaald.` : `\nVertalingen (${langs}): compleet.`);
  if (dryRun) { console.log("\n--dry-run: er is niets geschreven."); return; }

  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (missing.length) {
    fs.writeFileSync(todoFile, JSON.stringify(work, null, 2) + "\n");
    console.log(`Geschreven: ${todoFile}\nVraag Claude de lege vertalingen in te vullen ("vul ${TODO_NAME} in") en draai de export daarna opnieuw.`);
    if (!allowUntranslated) {
      console.error(`\nNiet geschreven: ${out}, want er ontbreken vertalingen. Met --allow-untranslated exporteer je toch (de build van de site weigert het dan wel).`);
      process.exitCode = 2;
      return;
    }
  } else if (fs.existsSync(todoFile)) {
    fs.rmSync(todoFile);
    console.log(`Verwijderd: ${todoFile} (alle vertalingen zijn overgenomen).`);
  }
  fs.writeFileSync(out, JSON.stringify(json, null, 2) + "\n");
  console.log(`\nGeschreven: ${out}\nControleer de diff zelf, ook de vertalingen, voordat je commit of pusht.`);
  // The mark in the practice folder: from now on the session start counts from this export.
  try {
    const lib = await import("./hooks/lib.mjs");
    lib.writeLastExport(totals, json.exportedAt);
    console.log(`Bijgewerkt: ${lib.LAST_EXPORT_FILE} (${totals.tasks} taken, ${totals.diarySessions} dagboeksessies, ${totals.levelChanges} niveauwijzigingen). De melding "sinds de laatste export" telt vanaf nu.`);
  } catch (e) {
    console.error(`Let op: ${path.join(project, ".learning", "state", "last-export.json")} is niet geschreven (${e.message}). De export zelf is wel gelukt.`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
