// SessionStart: put the skill record, open explanations, positive signals and the session ritual
// into Claude's context. Reviews are not mentioned here: an L4 review waits until the skill comes by
// in real work (setup review S2). Open tasks of earlier sessions lapse here (S1).
import fs from "node:fs";
import {
  readStdin, loadSkills, loadOverrides, today, taskStats, levelName, DIARY_DIR, lapseTasks, readEvents,
  isMicro, pendingTasks, recentWins, levelAdvice, settingsOf, isPlacementPending, effectiveLevel, adviceCommand, openOffer, t,
  dashboardAfterDiary, hasNewSinceExport, sinceExportLine, recentUps, progressAll, progressLine, needsNextExercise, logEvent,
  gradedOf, LEARN, LEARN_ELSEWHERE, catchUpSessions, gradedChangedFiles, skillForFile, isGradedDir, ROOT, STATE_DIR,
} from "./lib.mjs";
import path from "node:path";

let input = {};
try { input = JSON.parse(await readStdin()); } catch { /* ignore */ }
const source = input.source ?? "startup";

let data;
try { data = loadSkills(); } catch (e) {
  process.stdout.write(JSON.stringify({
    systemMessage: t("ss.unreadable.user"),
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: t("ss.unreadable.claude", { error: e.message }) },
  }));
  process.exit(0);
}

const day = today();
const skills = data.skills.filter((s) => s.kind !== "zone");
const overrides = loadOverrides();
// A new session (not a resume): open tasks of sessions where the learner is not active any more
// lapse. A session that is still active in parallel (within idleMinutes) keeps its tasks.
if (source === "startup" || source === "clear") {
  const idle = Math.max(1, Number(settingsOf(data).idleMinutes) || 20) * 60000;
  const active = new Set();
  for (const e of readEvents()) if (e.session && Date.now() - Date.parse(e.at) <= idle) active.add(e.session);
  lapseTasks("session-end", (x) => x.session === input.session_id || active.has(x.session), input.session_id ?? null);
}
const pending = pendingTasks();
const wins = recentWins(data);
// Promotion proposals the learner did not decline (setup review §9.6): the learner confirms with
// "ja, doorzetten <id>"; a declined one only comes back after new evidence.
const offers = skills.map((s) => openOffer(data, s)).filter((a) => a && !a.declined);
const advice = skills.map((s) => levelAdvice(data, s)).filter((a) => a && (a.dir !== "up" || offers.some((o) => o.id === a.id)));
const adviceLine = (a) => (a.dir === "up" ? t("ss.offer", { text: a.text, id: a.id, from: a.from, to: a.to }) : `${a.text} → \`${adviceCommand(a)}\``);
const settings = settingsOf(data);
const exam = settings.examDate;
const daysToExam = exam ? Math.round((Date.parse(exam) - Date.parse(day)) / 86400000) : null;

let lastDiary = null;
try {
  lastDiary = fs.readdirSync(DIARY_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort().pop() ?? null;
} catch { /* no diary yet */ }

const rate = (s) => { const x = taskStats(s.id, 10, isMicro(s) ? null : data); return (x.n ? `${x.ok}/${x.n}` : "-") + (x.pending ? ` (+${x.pending} open)` : ""); };
const lvl = (s) => {
  const eff = effectiveLevel(data, s);
  return `${s.level} ${levelName(s.level)}${isPlacementPending(data, s) ? t("ss.placementOpen") : eff !== s.level ? ` (→ ${eff})` : ""}`;
};
const rows = data.skills.map((s) =>
  `| ${isMicro(s) ? "↳ " : ""}${s.id} | ${s.title} | ${lvl(s)} | ${rate(s)} | ${isMicro(s) ? `${t("ss.microOf", { parent: s.parent })} ${(s.keywords ?? []).join(", ")}` : (s.paths ?? []).join(", ") || "-"} |`).join("\n");

// Up is loud (setup review of 12 Nov, #31), and how far the next level is, in steps (#35). The learner
// sees these lines; Claude gets them too.
const ups = recentUps(data);
const upsLine = ups.length ? t("ss.ups", { list: ups.map((u) => `↑ ${u.id} → ${u.to} (${u.at})`).join(", ") }) : "";
const progress = progressAll(data);
const progressText = progress.length ? t("ss.progress", { list: progress.map((p) => "  " + progressLine(p)).join("\n") }) : "";
const noFolders = skills.filter((s) => !isMicro(s) && needsNextExercise(data, s)).map((s) => s.id);

const fresh = source === "startup" || source === "clear";
const G = gradedOf(data);
const sid8 = (s) => String(s).slice(0, 8);
const dayOf = (ms) => new Date(ms).toLocaleDateString("sv-SE");

// A session with work that closed without a diary entry (review of 13 Nov, night, #56): a short catch-up
// diary first, once. The entry gets the marker of THAT session.
const catchUp = fresh ? catchUpSessions(data, input.session_id ?? null) : [];
for (const c of catchUp) logEvent({ type: "catchup-offered", of: c.sid, session: input.session_id ?? null });

// Work in the graded folder since the previous session (#57): files that changed while no session ran, for
// example a class diagram made in the IDE. Claude proposes a task per finished part ("af: <what>"), and the
// `paths` command for a folder that belongs to no skill. Only in the graded project itself.
let changedLines = [];
if (fresh && G && isGradedDir(data, ROOT, ROOT, G)) {
  let since = 0;
  try {
    for (const f of fs.readdirSync(STATE_DIR).filter((x) => /^session-.+\.json$/.test(x) && x !== `session-${input.session_id}.json`)) {
      const st = JSON.parse(fs.readFileSync(path.join(STATE_DIR, f), "utf8"));
      since = Math.max(since, Number(st.endedAt) || 0, Number(st.lastActiveAt) || 0);
    }
  } catch { /* no earlier session */ }
  if (since) {
    changedLines = gradedChangedFiles(G, since, { limit: 12 }).map((f) => {
      const base = G.bases.find((b) => f.file.toLowerCase().startsWith(b.toLowerCase() + "/")) ?? null;
      const shown = base ? f.file.slice(base.length + 1) : f.file;
      const s = skillForFile(data, f.file);
      return `- ${shown} → ${s ? `${s.skill.id} (${t(s.by === "paths" ? "ss.changed.byPaths" : "ss.changed.byContent")})` : t("ss.changed.none")}`;
    });
  }
}

const steps = [];
if (catchUp.length) steps.push(t("ss.step.catchUp", { sid: catchUp[0].sid, sid8: sid8(catchUp[0].sid), day: dayOf(catchUp[0].last), min: catchUp[0].minutes }));
if (changedLines.length) steps.push(t("ss.step.changed", { n: changedLines.length }));
if (pending.length) steps.push(t("ss.step.pending", { n: pending.length, list: pending.map((x) => `${x.skill} [${x.tid}]`).join(", ") }));
if (wins.length || advice.length) {
  steps.push(t("ss.step.signal", {
    wins: wins.length ? t("ss.step.signal.wins", { list: wins.map((w) => `${w.id} ${w.n}x`).join(", ") }) : "",
    advice: advice.length ? t("ss.step.signal.advice", { list: advice.map(adviceLine).join("; ") }) : "",
  }));
}
if (noFolders.length) steps.push(t("ss.step.nextExercise", { list: noFolders.join(", ") }));
steps.push(t("ss.step.goal"));

// Once: effort is the goal here, not failure (#39). The harness says it itself, at the first start.
const effortShown = readEvents().some((e) => e.type === "effort-intro");
const effortLine = !effortShown && (source === "startup" || source === "clear") ? t("ss.effort") : "";
if (effortLine) logEvent({ type: "effort-intro", session: input.session_id ?? null });

const ritual = source === "startup" || source === "clear"
  ? t("ss.ritual.start", { steps: steps.map((s, i) => `${i + 1}. ${s}`).join("\n") })
  : t("ss.ritual.resume");

// Graded work (setup of 13 Nov, #49): the rules and where the AI-use log goes. Also when this session
// itself is not about it yet: a session in the practice folder must not write there either (#54).
const gradedLine = G ? t(G.aiLevel === 0 ? "ss.graded.level0" : "ss.graded", { dir: G.bases.join(", "), max: G.maxRung, log: G.logDir, level: G.aiLevel }) : "";

// One record for two folders (#53): the record, the state and the diary are in another folder.
const elsewhereLine = LEARN_ELSEWHERE ? t("ss.learnElsewhere", { dir: LEARN.split("\\").join("/") }) : "";

const ctx = [
  ...(gradedLine ? [gradedLine, ""] : []),
  ...(elsewhereLine ? [elsewhereLine, ""] : []),
  t("ss.active", { day }) +
    (settings.course ? " " + t("ss.course", { course: settings.course }) : "") +
    " " + (exam ? t("ss.exam", { exam, days: daysToExam }) : t("ss.noExam")),
  t("ss.levels", { level: settings.defaultLevel }),
  "",
  t("ss.table.head"),
  "|---|---|---|---|---|",
  rows,
  "",
  t("ss.overrides", { list: overrides.length ? overrides.map((o) => t("ss.override", { skill: o.skill, until: o.until, reason: o.reason })).join("; ") : t("ss.none") }),
  t("ss.lastDiary", { file: lastDiary ?? t("ss.noneYet") }),
  ...[upsLine, progressText].filter(Boolean),
  ...(changedLines.length ? ["", t("ss.changed"), ...changedLines] : []),
  "",
  ritual,
  "",
  t("ss.closeWithDiary"),
].join("\n");

const { since } = dashboardAfterDiary(data);
const msg = t("ss.msg", { n: skills.length }) +
  (pending.length ? t("ss.msg.pending", { n: pending.length }) : "") +
  (offers.length ? t("ss.msg.offers", { list: offers.map((o) => `${o.id} ${o.from} → ${o.to}`).join(", ") }) : "") +
  (overrides.length ? t("ss.msg.overrides", { n: overrides.length }) : "") +
  (G ? "\n" + t("ss.msg.graded", { max: G.maxRung, level: G.aiLevel }) : "") +
  (catchUp.length ? "\n" + t("ss.msg.catchUp", { sid8: sid8(catchUp[0].sid), day: dayOf(catchUp[0].last) }) : "") +
  (changedLines.length ? "\n" + t("ss.msg.changed", { n: changedLines.length }) : "") +
  [upsLine, progressText, effortLine].filter(Boolean).map((l) => "\n" + l).join("") +
  // Only after a first export, only when something is new since then, and never with dashboardRepo off.
  (hasNewSinceExport(since) ? "\n" + sinceExportLine(since) : "");

process.stdout.write(JSON.stringify({
  systemMessage: msg,
  hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: ctx },
}));
