// SessionStart: put the skill record, due reviews, open explanations, positive signals
// and the session ritual into Claude's context.
import fs from "node:fs";
import {
  readStdin, loadSkills, loadOverrides, today, taskStats, levelName, DIARY_DIR,
  isMicro, dueReviews, pendingTasks, recentWins, levelAdvice, settingsOf, t,
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
const due = dueReviews(data, day);
const overrides = loadOverrides();
const pending = pendingTasks();
const wins = recentWins(data);
const advice = skills.map((s) => levelAdvice(data, s)).filter(Boolean);
const settings = settingsOf(data);
const exam = settings.examDate;
const daysToExam = exam ? Math.round((Date.parse(exam) - Date.parse(day)) / 86400000) : null;

let lastDiary = null;
try {
  lastDiary = fs.readdirSync(DIARY_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort().pop() ?? null;
} catch { /* no diary yet */ }

const rate = (s) => { const x = taskStats(s.id, 10, isMicro(s) ? null : data); return (x.n ? `${x.ok}/${x.n}` : "-") + (x.pending ? ` (+${x.pending} open)` : ""); };
const rows = data.skills.map((s) =>
  `| ${isMicro(s) ? "↳ " : ""}${s.id} | ${s.title} | ${s.level} ${levelName(s.level)} | ${rate(s)} | ${isMicro(s) ? `${t("ss.microOf", { parent: s.parent })} ${(s.keywords ?? []).join(", ")}` : (s.paths ?? []).join(", ") || "-"} | ${s.nextReview ?? "-"} |`).join("\n");

const steps = [];
if (due.length) steps.push(t("ss.step.reviews", { ids: due.map((s) => s.id).join(", ") }));
if (pending.length) steps.push(t("ss.step.pending", { n: pending.length, list: pending.map((x) => `${x.skill} [${x.tid}]`).join(", ") }));
if (wins.length || advice.length) {
  steps.push(t("ss.step.signal", {
    wins: wins.length ? t("ss.step.signal.wins", { list: wins.map((w) => `${w.id} ${w.n}x`).join(", ") }) : "",
    advice: advice.length ? t("ss.step.signal.advice", { list: advice.map((a) => `${a.text} → \`! node .claude/hooks/skill.mjs ${a.cmd}\``).join("; ") }) : "",
  }));
}
steps.push(t("ss.step.goal"));

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
  "|---|---|---|---|---|---|",
  rows,
  "",
  t("ss.overrides", { list: overrides.length ? overrides.map((o) => t("ss.override", { skill: o.skill, until: o.until, reason: o.reason })).join("; ") : t("ss.none") }),
  t("ss.lastDiary", { file: lastDiary ?? t("ss.noneYet") }),
  "",
  ritual,
  "",
  t("ss.closeWithDiary"),
].join("\n");

const msg = t("ss.msg", { n: skills.length }) +
  (due.length ? t("ss.msg.reviews", { n: due.length, ids: due.map((s) => s.id).join(", ") }) : t("ss.msg.noReviews")) +
  (pending.length ? t("ss.msg.pending", { n: pending.length }) : "") +
  (overrides.length ? t("ss.msg.overrides", { n: overrides.length }) : "");

process.stdout.write(JSON.stringify({
  systemMessage: msg,
  hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: ctx },
}));
