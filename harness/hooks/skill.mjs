#!/usr/bin/env node
// Leerharnas CLI. You run it yourself (in Claude Code with a leading "!"):
//   node .claude/hooks/skill.mjs list                      overview, including microskills
//   node .claude/hooks/skill.mjs status                    reviews, open explanations, promotion signals
//   node .claude/hooks/skill.mjs set <id> <L0..L4> ["note"]
//   node .claude/hooks/skill.mjs review <id> pass|shaky|fail
//   node .claude/hooks/skill.mjs add-micro <parent> <id> <L0..L4> "title" "keyword1, keyword2"
//   node .claude/hooks/skill.mjs done <id> "what worked"   (log a task; counts only after an explanation in your own words)
//   node .claude/hooks/skill.mjs untask <id>               (void the last logged task, e.g. logged by mistake)
//   node .claude/hooks/skill.mjs correct <task-id> trede|rung <1-5> "reason"   (more help than logged; only upwards)
//   node .claude/hooks/skill.mjs correct <task-id> schrap|void "reason"        (void one specific task)
//   node .claude/hooks/skill.mjs override <id|*> <minutes> "<reason>"
//   node .claude/hooks/skill.mjs setting <key> <value>     (examDate, stuckTimerMinutes, defaultLevel, course, language)
// The guard blocks Claude from running any command except list and status.
// There is deliberately NO command to mark a task as explained: that only happens via
// an explanation in your own words in the chat (checked by reflect-gate.mjs).
import {
  loadSkills, saveSkills, findSkill, addOverride, loadOverrides, logEvent, today, taskStats,
  LEVELS, levelName, isMicro, microsOf, familyIds, scheduleOnLevel, scheduleOnReview, dueReviews,
  pendingTasks, allTasks, logTask, levelAdvice, recentWins, latestSessionId, loadSession, saveSession, t, language,
} from "./lib.mjs";

const [cmd, ...args] = process.argv.slice(2);
const data = loadSkills();
const exit = (key, vars) => { console.error(t(key, vars)); process.exit(1); };

function need(id) {
  const s = findSkill(data, id);
  if (!s) exit("cli.unknownSkill", { id, list: data.skills.map((x) => x.id).join(", ") });
  return s;
}

function row(s, indent = "") {
  const st = taskStats(s.id, 10, isMicro(s) ? null : data);
  const rate = st.n ? t("cli.row.rate", { ok: st.ok, n: st.n }) : "";
  const pend = st.pending ? t("cli.row.pending", { n: st.pending }) : "";
  const due = s.nextReview && s.nextReview <= today() ? t("cli.row.due") : "";
  return `${s.level} ${levelName(s.level).padEnd(15)} ${(indent + s.id).padEnd(34)} ${(rate + pend).padEnd(24)} ${s.title}` +
    `${s.nextReview ? t("cli.row.next", { date: s.nextReview }) : ""}${due}`;
}

function status() {
  const due = dueReviews(data);
  const pend = pendingTasks();
  console.log(t("cli.status.today", { day: today() }) +
    (data.settings?.examDate ? t("cli.status.exam", { exam: data.settings.examDate }) : t("cli.status.noExam")));
  console.log("\n" + t("cli.status.reviews", { list: due.length ? due.map((s) => s.id).join(", ") : t("cli.none") }));
  console.log(t("cli.status.pending", { list: pend.length ? pend.map((x) => `${x.skill} [${x.tid}] ${x.what ?? ""}`.trim()).join("; ") : t("cli.none") }));
  const wins = recentWins(data);
  console.log(t("cli.status.wins", { list: wins.length ? wins.map((w) => `${w.id} ${w.n}x`).join(", ") : "-" }));
  const adv = data.skills.filter((s) => s.kind !== "zone").map((s) => levelAdvice(data, s)).filter(Boolean);
  console.log(t("cli.status.signals", { list: adv.length ? "" : t("cli.none") }));
  for (const a of adv) console.log(`  ${a.dir === "up" ? "↑" : "↓"} ${a.text}\n    ! node .claude/hooks/skill.mjs ${a.cmd}`);
}

const parseLevel = (raw) => {
  const lvl = String(raw ?? "").toUpperCase();
  if (!LEVELS.includes(lvl)) exit("cli.badLevel");
  return lvl;
};
const stats = (id) => taskStats(id, 10, isMicro(need(id)) ? null : data);

switch (cmd) {
  case "list":
  case undefined: {
    for (const s of data.skills.filter((x) => !isMicro(x))) {
      console.log(row(s));
      for (const m of microsOf(data, s.id)) console.log(row(m, "  ↳ "));
    }
    const o = loadOverrides();
    if (o.length) console.log("\n" + t("cli.list.overrides", { list: o.map((x) => t("cli.list.override", { skill: x.skill, until: x.until.slice(11, 16), reason: x.reason })).join("; ") }));
    break;
  }
  case "status": status(); break;

  case "set": {
    const [id, lvlRaw, ...note] = args;
    const s = need(id);
    const lvl = parseLevel(lvlRaw);
    const from = s.level;
    // No promotion while tasks of this skill (or its microskills) still wait for an explanation.
    const ids = new Set(familyIds(data, s.id));
    const open = pendingTasks().filter((x) => ids.has(x.skill));
    if (LEVELS.indexOf(lvl) > LEVELS.indexOf(from) && open.length) {
      exit("cli.set.pending", { n: open.length, id: s.id, tids: open.map((x) => x.tid).join(", ") });
    }
    s.level = lvl;
    scheduleOnLevel(data, s);
    s.history = [...(s.history ?? []), { at: today(), from, to: lvl, note: note.join(" ") || undefined }];
    saveSkills(data);
    logEvent({ type: "level", skill: s.id, from, to: lvl, note: note.join(" ") });
    console.log(t("cli.set.done", { id: s.id, from, to: lvl, name: levelName(lvl) }) + (s.nextReview ? t("cli.set.firstReview", { date: s.nextReview }) : ""));
    break;
  }
  case "review": {
    const [id, result] = args;
    const s = need(id);
    if (!["pass", "shaky", "fail"].includes(result)) exit("cli.review.bad");
    const advice = scheduleOnReview(data, s, result);
    s.lastReview = { at: today(), result };
    saveSkills(data);
    logEvent({ type: "review", skill: s.id, result, nextReview: s.nextReview });
    console.log(t(`cli.review.${result}`, { id: s.id, date: s.nextReview }));
    if (advice) console.log(advice);
    break;
  }
  case "add-micro": {
    const [parentId, id, lvlRaw, title, kws] = args;
    const parent = need(parentId);
    if (isMicro(parent)) exit("cli.micro.nested");
    if (!id || !/^[a-z0-9.-]+$/i.test(id)) exit("cli.micro.badId");
    if (findSkill(data, id)) exit("cli.micro.exists", { id });
    const lvl = parseLevel(lvlRaw);
    if (!title) exit("cli.micro.noTitle");
    const m = { id, parent: parent.id, title, level: lvl, keywords: String(kws ?? "").split(",").map((k) => k.trim()).filter(Boolean), history: [{ at: today(), to: lvl, note: t("note.created") }] };
    scheduleOnLevel(data, m);
    const at = data.skills.indexOf(parent) + 1 + microsOf(data, parent.id).length;
    data.skills.splice(at, 0, m);
    saveSkills(data);
    logEvent({ type: "micro-add", skill: id, parent: parent.id, level: lvl });
    console.log(t("cli.micro.done", { id, level: lvl, name: levelName(lvl), parent: parent.id, keywords: m.keywords.join(", ") || "-" }));
    break;
  }
  case "done": {
    const [id, ...what] = args;
    const s = need(id);
    const sid = latestSessionId();
    const st = sid ? loadSession(sid) : null;
    // All help since the last logged task counts, whatever skill the session detected (see check.mjs).
    const maxRung = st?.maxRung ?? 0;
    const task = logTask({ skill: s.id, success: maxRung < 5, maxRung, source: "done", what: what.join(" ") || undefined, session: sid });
    if (st) { st.rung = 0; st.maxRung = 0; st.lastRungAt = null; st.taskStartedAt = Date.now(); st.lastTaskAt = Date.now(); saveSession(sid, st); }
    console.log(t("cli.done", { id: s.id, tid: task.tid, rung: maxRung }));
    break;
  }
  case "untask": {
    const [id] = args;
    const s = need(id);
    const open = pendingTasks().filter((x) => x.skill === s.id).pop();
    logEvent({ type: "task-void", skill: s.id, tid: open?.tid });
    const st = stats(s.id);
    console.log(t("cli.untask", { id: s.id, tid: open ? ` [${open.tid}]` : "", ok: st.ok, n: st.n }));
    break;
  }
  case "correct": {
    // Set the log straight for ONE task. Rungs can only go up (more help than logged): lowering
    // them would make the evidence look better than it was. Logged, and shown in the diary.
    const [tid, what, ...rest] = args;
    const task = allTasks().find((x) => x.tid === tid);
    if (!task) exit("cli.correct.unknown", { tid: tid ?? "" });
    if (what === "trede" || what === "rung") {
      const n = Number(rest[0]);
      const reason = rest.slice(1).join(" ");
      if (!Number.isInteger(n) || n < 1 || n > 5) exit("cli.correct.usageRung");
      if (n <= (task.maxRung ?? 0)) exit("cli.correct.onlyUp", { tid, rung: task.maxRung ?? 0 });
      if (!reason) exit("cli.correct.usageRung");
      logEvent({ type: "task-correct", tid, skill: task.skill, from: task.maxRung ?? 0, maxRung: n, reason });
      const st = stats(task.skill);
      console.log(t("cli.correct.rung", { id: task.skill, tid, from: task.maxRung ?? 0, to: n, failed: n >= 5 ? t("cli.correct.nowFailed") : "", ok: st.ok, n: st.n }));
    } else if (what === "schrap" || what === "void") {
      const reason = rest.join(" ");
      if (!reason) exit("cli.correct.usageVoid");
      logEvent({ type: "task-void", skill: task.skill, tid, reason });
      const st = stats(task.skill);
      console.log(t("cli.correct.void", { id: task.skill, tid, ok: st.ok, n: st.n }));
    } else {
      exit("cli.correct.usage");
    }
    break;
  }
  case "override": {
    const [id, minRaw, ...reason] = args;
    if (id !== "*") need(id);
    const minutes = Math.max(1, Math.min(240, Number(minRaw) || 30));
    if (!reason.length) exit("cli.override.noReason");
    const o = addOverride(id, minutes, reason.join(" "));
    logEvent({ type: "override", skill: id, minutes, reason: o.reason });
    console.log(t("cli.override.done", { id, until: new Date(o.until).toLocaleTimeString(language() === "en" ? "en-GB" : "nl-NL") }));
    break;
  }
  case "setting": {
    const [key, ...rest] = args;
    const value = rest.join(" ");
    const allowed = {
      examDate: /^\d{4}-\d{2}-\d{2}$/, stuckTimerMinutes: /^\d+$/, defaultLevel: /^L[0-4]$/,
      course: /^[^\r\n<>]{1,80}$/, language: /^(nl|en)$/,
    };
    if (!allowed[key] || !allowed[key].test(value)) exit("cli.setting.usage");
    data.settings = data.settings ?? {};
    data.settings[key] = key === "stuckTimerMinutes" ? Number(value) : value;
    saveSkills(data);
    logEvent({ type: "setting", key, value });
    console.log(`${key} = ${value}`);
    break;
  }
  default:
    exit("cli.usage");
}
