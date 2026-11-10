#!/usr/bin/env node
// Leerharnas CLI. You run it yourself (in Claude Code with a leading "!"):
//   node .claude/hooks/skill.mjs list                      overzicht, incl. microvaardigheden
//   node .claude/hooks/skill.mjs status                    herhalingen, open uitleg, doorstroom-signalen
//   node .claude/hooks/skill.mjs set <id> <L0..L4> ["notitie"]
//   node .claude/hooks/skill.mjs review <id> pass|shaky|fail
//   node .claude/hooks/skill.mjs add-micro <parent> <id> <L0..L4> "titel" "trefwoord1, trefwoord2"
//   node .claude/hooks/skill.mjs done <id> "wat is gelukt"  (taak afmelden; telt pas na uitleg in eigen woorden)
//   node .claude/hooks/skill.mjs untask <id>               (schrap de laatst gelogde taak, bv. onterecht gelogd)
//   node .claude/hooks/skill.mjs correct <taak-id> trede <1-5> "reden"   (er was meer hulp dan gelogd; alleen omhoog)
//   node .claude/hooks/skill.mjs correct <taak-id> schrap "reden"        (één specifieke taak schrappen)
//   node .claude/hooks/skill.mjs override <id|*> <minuten> "<reden>"
//   node .claude/hooks/skill.mjs setting <sleutel> <waarde>  (examDate, stuckTimerMinutes, defaultLevel, course, language)
// The guard blocks Claude from running any command except list and status.
// There is deliberately NO command to mark a task as explained: that only happens via
// an explanation in your own words in the chat (checked by reflect-gate.mjs).
import {
  loadSkills, saveSkills, findSkill, addOverride, loadOverrides, logEvent, today, taskStats,
  LEVELS, LEVEL_NAMES, isMicro, microsOf, familyIds, scheduleOnLevel, scheduleOnReview, dueReviews,
  pendingTasks, allTasks, logTask, levelAdvice, recentWins, latestSessionId, loadSession, saveSession,
} from "./lib.mjs";

const [cmd, ...args] = process.argv.slice(2);
const data = loadSkills();

function need(id) {
  const s = findSkill(data, id);
  if (!s) { console.error(`Onbekende vaardigheid '${id}'. Kies uit: ${data.skills.map((x) => x.id).join(", ")}`); process.exit(1); }
  return s;
}

function row(s, indent = "") {
  const st = taskStats(s.id, 10, isMicro(s) ? null : data);
  const rate = st.n ? `${st.ok}/${st.n} gelukt` : "";
  const pend = st.pending ? ` (${st.pending} uitleg open)` : "";
  const due = s.nextReview && s.nextReview <= today() ? "  << HERHALING" : "";
  return `${s.level} ${LEVEL_NAMES[s.level].padEnd(15)} ${(indent + s.id).padEnd(34)} ${(rate + pend).padEnd(24)} ${s.title}` +
    `${s.nextReview ? `  (herhaling ${s.nextReview})` : ""}${due}`;
}

function status() {
  const due = dueReviews(data);
  const pend = pendingTasks();
  console.log(`Vandaag ${today()}${data.settings?.examDate ? ` · toets ${data.settings.examDate}` : " · geen toetsdatum (setting examDate)"}`);
  console.log(`\nHerhalingen vandaag: ${due.length ? due.map((s) => s.id).join(", ") : "geen"}`);
  console.log(`Taken die wachten op uitleg in eigen woorden: ${pend.length ? pend.map((t) => `${t.skill} [${t.tid}] ${t.what ?? ""}`.trim()).join("; ") : "geen"}`);
  const wins = recentWins(data);
  console.log(`Zelfstandig gelukt (trede 0, 7 dagen): ${wins.length ? wins.map((w) => `${w.id} ${w.n}x`).join(", ") : "-"}`);
  const adv = data.skills.filter((s) => s.kind !== "zone").map((s) => levelAdvice(data, s)).filter(Boolean);
  console.log(`Doorstroom-signalen: ${adv.length ? "" : "geen"}`);
  for (const a of adv) console.log(`  ${a.dir === "up" ? "↑" : "↓"} ${a.text}\n    ! node .claude/hooks/skill.mjs ${a.cmd}`);
}

switch (cmd) {
  case "list":
  case undefined: {
    for (const s of data.skills.filter((x) => !isMicro(x))) {
      console.log(row(s));
      for (const m of microsOf(data, s.id)) console.log(row(m, "  ↳ "));
    }
    const o = loadOverrides();
    if (o.length) console.log("\nActieve overrides:", o.map((x) => `${x.skill} tot ${x.until.slice(11, 16)} UTC — ${x.reason}`).join("; "));
    break;
  }
  case "status": status(); break;

  case "set": {
    const [id, lvlRaw, ...note] = args;
    const s = need(id);
    const lvl = String(lvlRaw ?? "").toUpperCase();
    if (!LEVELS.includes(lvl)) { console.error("Niveau moet L0, L1, L2, L3 of L4 zijn."); process.exit(1); }
    const from = s.level;
    // No promotion while tasks of this skill (or its microskills) still wait for an explanation.
    const ids = new Set(familyIds(data, s.id));
    const open = pendingTasks().filter((t) => ids.has(t.skill));
    if (LEVELS.indexOf(lvl) > LEVELS.indexOf(from) && open.length) {
      console.error(`Niet doorgezet: ${open.length} taak/taken van ${s.id} wachten nog op je uitleg in eigen woorden ` +
        `(${open.map((t) => t.tid).join(", ")}). Leg in de chat uit waarom je oplossing werkt; daarna kan het.`);
      process.exit(1);
    }
    s.level = lvl;
    scheduleOnLevel(data, s);
    s.history = [...(s.history ?? []), { at: today(), from, to: lvl, note: note.join(" ") || undefined }];
    saveSkills(data);
    logEvent({ type: "level", skill: s.id, from, to: lvl, note: note.join(" ") });
    console.log(`${s.id}: ${from} -> ${lvl} ${LEVEL_NAMES[lvl]}${s.nextReview ? `, eerste herhaling ${s.nextReview}` : ""}`);
    break;
  }
  case "review": {
    const [id, result] = args;
    const s = need(id);
    if (!["pass", "shaky", "fail"].includes(result)) { console.error("Uitkomst: pass | shaky | fail"); process.exit(1); }
    const advice = scheduleOnReview(data, s, result);
    s.lastReview = { at: today(), result };
    saveSkills(data);
    logEvent({ type: "review", skill: s.id, result, nextReview: s.nextReview });
    const word = { pass: "geslaagd, interval omhoog", shaky: "wankel, interval blijft gelijk", fail: "mislukt, interval 2 stappen terug" }[result];
    console.log(`${s.id}: ${word} -> volgende herhaling ${s.nextReview}`);
    if (advice) console.log(advice);
    break;
  }
  case "add-micro": {
    const [parentId, id, lvlRaw, title, kws] = args;
    const parent = need(parentId);
    if (isMicro(parent)) { console.error("Een microvaardigheid hangt onder een hoofdvaardigheid, niet onder een andere microvaardigheid."); process.exit(1); }
    if (!id || !/^[a-z0-9.-]+$/i.test(id)) { console.error("Geef een id, bv. cs.basis.void-chaining"); process.exit(1); }
    if (findSkill(data, id)) { console.error(`'${id}' bestaat al.`); process.exit(1); }
    const lvl = String(lvlRaw ?? "").toUpperCase();
    if (!LEVELS.includes(lvl)) { console.error("Niveau moet L0, L1, L2, L3 of L4 zijn."); process.exit(1); }
    if (!title) { console.error('Geef een titel: add-micro <parent> <id> <niveau> "titel" "trefwoorden"'); process.exit(1); }
    const m = { id, parent: parent.id, title, level: lvl, keywords: String(kws ?? "").split(",").map((k) => k.trim()).filter(Boolean), history: [{ at: today(), to: lvl, note: "aangemaakt" }] };
    scheduleOnLevel(data, m);
    const at = data.skills.indexOf(parent) + 1 + microsOf(data, parent.id).length;
    data.skills.splice(at, 0, m);
    saveSkills(data);
    logEvent({ type: "micro-add", skill: id, parent: parent.id, level: lvl });
    console.log(`Microvaardigheid ${id} (${lvl} ${LEVEL_NAMES[lvl]}) toegevoegd onder ${parent.id}. Trefwoorden: ${m.keywords.join(", ") || "-"}`);
    break;
  }
  case "done": {
    const [id, ...what] = args;
    const s = need(id);
    const sid = latestSessionId();
    const st = sid ? loadSession(sid) : null;
    // All help since the last logged task counts, whatever skill the session detected (see check.mjs).
    const maxRung = st?.maxRung ?? 0;
    const t = logTask({ skill: s.id, success: maxRung < 5, maxRung, source: "done", what: what.join(" ") || undefined, session: sid });
    if (st) { st.rung = 0; st.maxRung = 0; st.lastRungAt = null; st.taskStartedAt = Date.now(); st.lastTaskAt = Date.now(); saveSession(sid, st); }
    console.log(`Taak gelogd voor ${s.id} [${t.tid}], hoogste trede ${maxRung}. ` +
      `Hij telt pas mee als je in de chat in eigen woorden uitlegt waarom het werkt.`);
    break;
  }
  case "untask": {
    const [id] = args;
    const s = need(id);
    const open = pendingTasks().filter((t) => t.skill === s.id).pop();
    logEvent({ type: "task-void", skill: s.id, tid: open?.tid });
    const st = taskStats(s.id, 10, isMicro(s) ? null : data);
    console.log(`${s.id}: laatst gelogde taak geschrapt${open ? ` [${open.tid}]` : ""}. Nu ${st.ok}/${st.n} gelukt. (Wordt in het dagboek vermeld.)`);
    break;
  }
  case "correct": {
    // Set the log straight for ONE task. Rungs can only go up (more help than logged): lowering
    // them would make the evidence look better than it was. Logged, and shown in the diary.
    const [tid, what, ...rest] = args;
    const t = allTasks().find((x) => x.tid === tid);
    if (!t) { console.error(`Onbekende taak '${tid ?? ""}'. De taak-id's staan in de uitvoer van check.mjs en in het dagboek.`); process.exit(1); }
    if (what === "trede") {
      const n = Number(rest[0]);
      const reason = rest.slice(1).join(" ");
      if (!Number.isInteger(n) || n < 1 || n > 5) { console.error('Gebruik: correct <taak-id> trede <1-5> "reden"'); process.exit(1); }
      if (n <= (t.maxRung ?? 0)) { console.error(`Taak ${tid} staat al op trede ${t.maxRung ?? 0}. Corrigeren kan alleen omhoog: lager zetten zou het bewijs mooier maken dan het was.`); process.exit(1); }
      if (!reason) { console.error('Geef een reden: correct <taak-id> trede <1-5> "reden"'); process.exit(1); }
      logEvent({ type: "task-correct", tid, skill: t.skill, from: t.maxRung ?? 0, maxRung: n, reason });
      const st = taskStats(t.skill, 10, isMicro(need(t.skill)) ? null : data);
      console.log(`${t.skill} [${tid}]: trede ${t.maxRung ?? 0} -> ${n}${n >= 5 ? " (telt nu als niet gelukt)" : ""}. Nu ${st.ok}/${st.n} gelukt. (Wordt in het dagboek vermeld.)`);
    } else if (what === "schrap") {
      const reason = rest.join(" ");
      if (!reason) { console.error('Geef een reden: correct <taak-id> schrap "reden"'); process.exit(1); }
      logEvent({ type: "task-void", skill: t.skill, tid, reason });
      const st = taskStats(t.skill, 10, isMicro(need(t.skill)) ? null : data);
      console.log(`${t.skill} [${tid}] geschrapt. Nu ${st.ok}/${st.n} gelukt. (Wordt in het dagboek vermeld.)`);
    } else {
      console.error('Gebruik: correct <taak-id> trede <1-5> "reden"  of  correct <taak-id> schrap "reden"');
      process.exit(1);
    }
    break;
  }
  case "override": {
    const [id, minRaw, ...reason] = args;
    if (id !== "*") need(id);
    const minutes = Math.max(1, Math.min(240, Number(minRaw) || 30));
    if (!reason.length) { console.error('Geef een reden: override <id> <minuten> "<reden>"'); process.exit(1); }
    const o = addOverride(id, minutes, reason.join(" "));
    logEvent({ type: "override", skill: id, minutes, reason: o.reason });
    console.log(`Override voor ${id} actief tot ${new Date(o.until).toLocaleTimeString("nl-NL")}. Wordt in het dagboek vermeld.`);
    break;
  }
  case "setting": {
    const [key, ...rest] = args;
    const value = rest.join(" ");
    const allowed = {
      examDate: /^\d{4}-\d{2}-\d{2}$/, stuckTimerMinutes: /^\d+$/, defaultLevel: /^L[0-4]$/,
      course: /^[^\r\n<>]{1,80}$/, language: /^(nl|en)$/,
    };
    if (!allowed[key] || !allowed[key].test(value)) {
      console.error('setting examDate JJJJ-MM-DD | stuckTimerMinutes <getal> | defaultLevel L0..L4 | course "<vak>" | language nl|en'); process.exit(1);
    }
    data.settings = data.settings ?? {};
    data.settings[key] = key === "stuckTimerMinutes" ? Number(value) : value;
    saveSkills(data);
    logEvent({ type: "setting", key, value });
    console.log(`${key} = ${value}`);
    break;
  }
  default:
    console.error("Commando's: list | status | set | review | add-micro | done | untask | correct | override | setting  (zie de kop van skill.mjs)");
    process.exit(1);
}
