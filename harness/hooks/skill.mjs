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
//   node .claude/hooks/skill.mjs setting <key> <value>     (examDate, stuckTimerMinutes, idleMinutes, defaultLevel, course, language)
//   node .claude/hooks/skill.mjs paths <id> add|remove "<glob>"   (which exercise folders belong to a skill)
//   node .claude/hooks/skill.mjs replay <transcript.jsonl> [--dry-run]   (recover explanations a hook missed)
//   node .claude/hooks/skill.mjs since-export              what is new since the last dashboard export (one line)
// The guard blocks Claude from running any command except list, status and since-export (they only read).
// There is deliberately NO command to mark a task as explained: that only happens via
// an explanation in your own words in the chat (checked by reflect-gate.mjs). `replay` does not
// change that: it runs the same two keys again on a saved transcript.
import fs from "node:fs";
import path from "node:path";
import {
  loadSkills, saveSkills, findSkill, addOverride, loadOverrides, logEvent, today, taskStats,
  LEVELS, levelName, isMicro, microsOf, familyIds, familyOf, scheduleOnLevel, scheduleOnReview, dueReviews,
  pendingTasks, allTasks, logTask, levelAdvice, recentWins, pickSession, loadSession, saveSession, touch, taskRung, taskLogged,
  lapseTasks, afterTask, isReviewDue, isPlacementPending, effectiveLevel, adviceCommand, openOffer,
  activeMinutesSince, readTranscript, isLearnerEntry, learnerEntryText, entryText, checkExplanation, t, language,
  sinceExport, sinceExportLine,
} from "./lib.mjs";
import { EXPLAIN_MARK } from "./patterns.mjs";

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
  // Neutral: a due review is not "late", it waits until the skill comes by in real work (S2).
  const due = isReviewDue(s) ? t("cli.row.due") : "";
  const place = isPlacementPending(data, s) ? t("cli.row.placement") : "";
  return `${s.level} ${levelName(s.level).padEnd(15)} ${(indent + s.id).padEnd(34)} ${(rate + pend).padEnd(24)} ${s.title}` +
    `${place}${due}`;
}

function status() {
  const due = dueReviews(data);
  const pend = pendingTasks();
  console.log(t("cli.status.today", { day: today() }) +
    (data.settings?.examDate ? t("cli.status.exam", { exam: data.settings.examDate }) : t("cli.status.noExam")));
  console.log("\n" + t("cli.status.reviews", { list: due.length ? due.map((s) => s.id).join(", ") : t("cli.none") }));
  const lapsed = allTasks().filter((x) => x.lapsed).slice(-5);
  if (lapsed.length) console.log(t("cli.status.lapsed", { list: lapsed.map((x) => `${x.skill} [${x.tid}]`).join(", ") }));
  console.log(t("cli.status.pending", { list: pend.length ? pend.map((x) => `${x.skill} [${x.tid}] ${x.what ?? ""}`.trim()).join("; ") : t("cli.none") }));
  const wins = recentWins(data);
  console.log(t("cli.status.wins", { list: wins.length ? wins.map((w) => `${w.id} ${w.n}x`).join(", ") : "-" }));
  const adv = data.skills.filter((s) => s.kind !== "zone").map((s) => levelAdvice(data, s)).filter(Boolean);
  console.log(t("cli.status.signals", { list: adv.length ? "" : t("cli.none") }));
  for (const a of adv) {
    if (a.dir === "up") {
      // A proposal: confirm in the chat ("ja, doorzetten <id>") or with set (setup review §9.6).
      const declined = openOffer(data, findSkill(data, a.id))?.declined ? t("cli.status.declined") : "";
      console.log(`  ↑ ${a.text} (${a.from} → ${a.to})${declined}\n    ${t("cli.status.confirm", { id: a.id })} · ${adviceCommand(a)}`);
    } else console.log(`  ${a.dir === "down" ? "↓" : "→"} ${a.text}\n    ${adviceCommand(a)}`);
  }
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
  // Read-only: the line after a first dashboard export, also when nothing is new; nothing without one.
  case "since-export": {
    const s = sinceExport(data);
    if (s) console.log(sinceExportLine(s));
    break;
  }

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
    s.history = [...(s.history ?? []), { at: today(), atIso: new Date().toISOString(), from, to: lvl, note: note.join(" ") || undefined }];
    if (s.placement === "pending") s.placement = "done";
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
    const m = { id, parent: parent.id, title, level: lvl, keywords: String(kws ?? "").split(",").map((k) => k.trim()).filter(Boolean), history: [{ at: today(), atIso: new Date().toISOString(), to: lvl, note: t("note.created") }] };
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
    const sid = pickSession(familyIds(data, familyOf(s)), data);
    const st = sid ? touch(loadSession(sid), Date.now(), data) : null;
    // All help since the last logged task counts, whatever skill the session detected (see check.mjs),
    // plus help in the review of the previous task when it was about this concept (setup review of
    // 11 Nov, S3). `done` reports finished work, so the help since the last task is not dropped here:
    // work without code (design, UML) gives no other signal, and dropping it would hide real help (R2).
    const { rung: maxRung, reviewRung } = st ? taskRung(data, st, s.id) : { rung: 0, reviewRung: 0 };
    const minutes = st ? activeMinutesSince(st, st.taskStartedActive) : null;
    // A task of another family: the learner started another exercise, so open tasks lapse (S1).
    const lapsed = lapseTasks("other-exercise", (x) => familyOf(findSkill(data, x.skill)) === familyOf(s), sid);
    const task = logTask({ skill: s.id, success: maxRung < 5, maxRung, minutes, source: "done", what: what.join(" ") || undefined, session: sid, level: effectiveLevel(data, s),
      reviewRung: reviewRung > (st?.maxRung ?? 0) ? reviewRung : 0 });
    const after = afterTask(data, s.id, task);
    if (st) {
      // The family of this task is what the learner works on now (setup review 3.3).
      st.folderSkill = familyOf(s); st.folderSkillAt = Date.now();
      if (after.pending) st.demotionPending = after.pending;
      taskLogged(st, task);
      saveSession(sid, st);
    }
    console.log(t("cli.done", { id: s.id, tid: task.tid, rung: maxRung }));
    if (lapsed.length) console.log(t("cli.lapsed", { list: lapsed.map((x) => `${x.skill} [${x.tid}]`).join(", ") }));
    for (const m of after.messages) console.log(m);
    break;
  }
  case "replay": {
    // Recover explanations that were approved in the chat but never logged (setup review §5): read a
    // saved transcript, find Claude's [uitleg-ok <tid>] markers and check the learner's message they
    // answer with the same checkExplanation(). Only what passes both keys is logged, with source "replay".
    const [file, ...flags] = args;
    if (!file) exit("cli.replay.usage");
    const dry = flags.includes("--dry-run");
    if (!fs.existsSync(path.resolve(file))) exit("cli.replay.noFile", { file });
    const entries = readTranscript(path.resolve(file));
    const session = path.basename(file).replace(/\.jsonl$/i, "");
    // Open and lapsed tasks: a lapsed task whose marker a bug lost was not really skipped (S1).
    const open = new Map(allTasks().filter((x) => !x.explained).map((x) => [x.tid, x]));
    const results = new Map(); // tid -> { ok, reasons, text }
    let lastLearner = -1;
    entries.forEach((e, i) => {
      if (isLearnerEntry(e)) { lastLearner = i; return; }
      if (e.type !== "assistant" || lastLearner < 0) return;
      for (const m of entryText(e).matchAll(EXPLAIN_MARK)) {
        const tid = m[2];
        if (m[1].toLowerCase() !== "ok" || results.get(tid)?.ok) continue;
        const text = learnerEntryText(entries[lastLearner]) ?? "";
        const earlier = entries.slice(0, lastLearner).filter((x) => x.type === "assistant").map(entryText);
        results.set(tid, { ...checkExplanation(text, earlier), text });
      }
    });
    if (!results.size) { console.log(t("cli.replay.none", { file })); break; }
    let logged = 0;
    for (const [tid, r] of results) {
      const task = open.get(tid);
      if (!task) { console.log("  " + t("cli.replay.notOpen", { tid })); continue; }
      if (!r.ok) { console.log("  " + t("cli.replay.failed", { tid, id: task.skill, reasons: r.reasons.join("; ") })); continue; }
      if (!dry) logEvent({ type: "task-explained", tid, skill: task.skill, text: r.text.slice(0, 600), session, source: "replay" });
      logged++;
      console.log("  " + t(dry ? "cli.replay.wouldLog" : "cli.replay.logged", { tid, id: task.skill }));
    }
    console.log(t(dry ? "cli.replay.dryRun" : "cli.replay.done", { n: logged }));
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
  case "paths": {
    // Which exercise folders belong to a skill (setup review of 11 Nov, S5). The folder decides the
    // skill of a task and the level the guard uses, so a wrong mapping is fixed here, by the learner.
    const [id, action, glob] = args;
    if (!id || !["add", "remove"].includes(action) || !glob) exit("cli.paths.usage");
    const s = need(id);
    if (isMicro(s)) exit("cli.paths.micro", { id: s.id, parent: s.parent });
    const g = String(glob).trim().replace(/\\/g, "/");
    if (!g || g.startsWith("/") || /^[a-z]:/i.test(g) || g.split("/").includes("..") || /[\r\n"<>|]/.test(g)) exit("cli.paths.bad", { glob });
    const list = s.paths ?? [];
    if (action === "add") {
      if (list.includes(g)) exit("cli.paths.exists", { id: s.id, glob: g });
      s.paths = [...list, g];
    } else {
      if (!list.includes(g)) exit("cli.paths.missing", { id: s.id, glob: g, list: list.join(", ") || "-" });
      s.paths = list.filter((x) => x !== g);
    }
    saveSkills(data);
    logEvent({ type: "paths", skill: s.id, action, glob: g });
    console.log(t(action === "add" ? "cli.paths.added" : "cli.paths.removed", { id: s.id, glob: g, list: s.paths.join(", ") || "-" }));
    const others = action === "add" ? data.skills.filter((x) => x !== s && (x.paths ?? []).includes(g)).map((x) => x.id) : [];
    if (others.length) console.log(t("cli.paths.also", { list: others.join(", "), glob: g }));
    break;
  }
  case "setting": {
    const [key, ...rest] = args;
    const value = rest.join(" ");
    const allowed = {
      examDate: /^\d{4}-\d{2}-\d{2}$/, stuckTimerMinutes: /^\d+$/, idleMinutes: /^[1-9]\d*$/, defaultLevel: /^L[0-4]$/,
      course: /^[^\r\n<>]{1,80}$/, language: /^(nl|en)$/, autoDemote: /^(true|false)$/,
    };
    if (!allowed[key] || !allowed[key].test(value)) exit("cli.setting.usage");
    data.settings = data.settings ?? {};
    data.settings[key] = ["stuckTimerMinutes", "idleMinutes"].includes(key) ? Number(value) : key === "autoDemote" ? value === "true" : value;
    saveSkills(data);
    logEvent({ type: "setting", key, value });
    console.log(`${key} = ${value}`);
    break;
  }
  default:
    exit("cli.usage");
}
