// SessionStart: put the skill record, open explanations, positive signals and the session ritual
// into Claude's context. Reviews are not mentioned here: an L4 review waits until the skill comes by
// in real work (setup review S2). Open tasks of earlier sessions lapse here (S1).
import fs from "node:fs";
import {
  readStdin, loadSkills, loadOverrides, today, taskStats, levelName, DIARY_DIR, lapseTasks, readEvents,
  isMicro, pendingTasks, recentWins, levelAdvice, settingsOf, isPlacementPending, effectiveLevel, t,
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
const advice = skills.map((s) => levelAdvice(data, s)).filter(Boolean);
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

const steps = [];
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
  "|---|---|---|---|---|",
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
  (pending.length ? t("ss.msg.pending", { n: pending.length }) : "") +
  (overrides.length ? t("ss.msg.overrides", { n: overrides.length }) : "");

process.stdout.write(JSON.stringify({
  systemMessage: msg,
  hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: ctx },
}));
