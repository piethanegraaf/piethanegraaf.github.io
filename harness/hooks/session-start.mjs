// SessionStart: put the skill record, open explanations, positive signals and the session ritual
// into Claude's context. Reviews are not mentioned here: an L4 review waits until the skill comes by
// in real work (setup review S2). Open tasks of earlier sessions lapse here (S1).
import fs from "node:fs";
import {
  readStdin, loadSkills, loadOverrides, today, taskStats, levelName, DIARY_DIR, lapseTasks, readEvents,
  isMicro, pendingTasks, recentWins, levelAdvice, settingsOf, isPlacementPending, effectiveLevel, adviceCommand, openOffer, t,
  dashboardAfterDiary, hasNewSinceExport, sinceExportLine, recentUps, progressAll, progressLine, needsNextExercise, logEvent,
} from "./lib.mjs";

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

const steps = [];
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

const ctx = [
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
  [upsLine, progressText, effortLine].filter(Boolean).map((l) => "\n" + l).join("") +
  // Only after a first export, only when something is new since then, and never with dashboardRepo off.
  (hasNewSinceExport(since) ? "\n" + sinceExportLine(since) : "");

process.stdout.write(JSON.stringify({
  systemMessage: msg,
  hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: ctx },
}));
