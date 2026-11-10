// Leerdashboard: a static view of data/progress.json (made by harness/export.mjs) or the demo data.
// Vanilla JS, no dependencies. All text from the data goes into the page with textContent, never innerHTML.
"use strict";
(() => {
  const UI = {
    nl: {
      skip: "Naar de inhoud", title: "Leerdashboard", brand: "Leerharnas", real: "Echte data", demo: "Demo", theme: "Thema wisselen",
      loading: "Laden…", loadError: "De data kon niet geladen worden ({file}). Open het dashboard via een webserver, bijvoorbeeld: python -m http.server",
      fallback: "Er is nog geen echte data (data/progress.json). Je ziet de demo met verzonnen data.",
      demoNote: "Demo: alle data is verzonnen. Zo ziet het dashboard eruit na een paar weken oefenen.",
      subtitle: "{course} · stand van {date}", subtitleNoCourse: "Stand van {date}",
      filter: "Vaardigheid", all: "Alle vaardigheden", asof: "Alle cijfers gelden op {date}, de dag van de export.",
      kSolo: "Zelfstandig gelukt", kSoloSub: "{ok} van {n} uitgelegde taken, trede ≤ 2", kPending: "Wacht op uitleg", kPendingSub: "taken tellen pas na uitleg in eigen woorden",
      kReviews: "Herhalingen", kReviewsSub: "{overdue} te laat · {due} vandaag", kExam: "Tot de toets", kExamSub: "{date}", kNoExam: "geen datum",
      days: "{n} dagen", day: "1 dag", none: "–",
      levels: "Niveaus", levelsHint: "Hoeveel vaardigheden (en microvaardigheden) op elk niveau staan.", skillsN: "{n} vaardigheden",
      showTable: "Tabel", showChart: "Grafiek", level: "Niveau", name: "Naam", count: "Aantal", skillsCol: "Vaardigheden",
      skills: "Per vaardigheid", skillsHint: "Gelukt = opgelost met hooguit trede 2, over de laatste 10 uitgelegde taken. Het streepje is het doel ({pct}%).",
      solved: "{ok}/{n} gelukt", noTasks: "nog geen uitgelegde taken", open: "{n} uitleg open", next: "herhaling {date}",
      overdue: "te laat", dueToday: "vandaag", upcoming: "gepland", noReview: "geen herhaling",
      more: "Details", less: "Sluiten", history: "Niveaugeschiedenis", tasks: "Taken", reviews: "Herhalingen", noHistory: "Nog geen niveauwijzigingen.",
      noTaskRows: "Nog geen taken.", noReviewRows: "Nog geen herhalingen.",
      date: "Datum", task: "Taak", rung: "Trede", source: "Bron", explanation: "Uitleg", rejections: "Afgewezen", corrections: "Correcties", result: "Uitkomst", nextReview: "Volgende",
      explained: "goedgekeurd", pendingExpl: "wacht op uitleg", voided: "geschrapt", from: "van", to: "naar", note: "Notitie",
      by: { claude: "door Claude", hook: "door de check" }, src: { check: "test (check.mjs)", done: "zelf afgemeld", chat: "chat" },
      res: { pass: "geslaagd", shaky: "wankel", fail: "mislukt" },
      tasksChart: "Taken per dag", tasksHint: "Elke taak met de hoogste trede aan hulp. Donkerder = zelfstandiger.",
      bSolo: "zelfstandig (trede 0)", bHint: "met een hint (trede 1–2)", bHelp: "veel hulp (trede 3–5)", bPending: "wacht op uitleg", total: "totaal",
      noTaskChart: "Nog geen taken in deze selectie.",
      attention: "Signalen", signalsUp: "Doorstroom-signaal", signalsDown: "Terugval-signaal", regression: "{n} test(s) van groen naar rood", regressionFixed: "{n} test(s) weer groen (herstel, geen nieuwe taak)",
      override: "Override van {min} min", noSignals: "Geen signalen in deze selectie.",
      calibration: "Kalibratie", calibrationHint: "Zelfvertrouwen vooraf en na de sessie (1–5), zoals de student het zelf noteerde.",
      before: "vooraf", after: "na de sessie", session: "Sessie", noCalibration: "Nog geen sessies met een cijfer voor het zelfvertrouwen.",
      diary: "Dagboek", diaryHint: "De feiten logt de harnas; de reflectie staat er in de eigen woorden van de student.",
      plan: "Plan", wentWell: "Ging goed", learned: "Geleerd", confusing: "Verwarrend", confidence: "Zelfvertrouwen", nextStep: "Volgende stap", calib: "Kalibratie",
      noDiary: "Nog geen dagboekentries.", activity: "Activiteit", sessions: "Sessies", hints: "Hints", holds: "Geen nieuwe trede", denials: "Guard-weigeringen", overridesUsed: "Overrides gebruikt",
      footAi: "AI-verklaring: de leerharnas, dit dashboard en de docs zijn gemaakt met hulp van Claude (Anthropic). De leerdata en de reflecties zijn van de student zelf.",
      footLicense: "Code: MIT · teksten en data: CC BY-NC 4.0", footSource: "Broncode en uitleg", focus: "Ga naar {id}",
    },
    en: {
      skip: "Skip to content", title: "Learning dashboard", brand: "Learning harness", real: "Real data", demo: "Demo", theme: "Toggle theme",
      loading: "Loading…", loadError: "The data could not be loaded ({file}). Open the dashboard through a web server, for example: python -m http.server",
      fallback: "There is no real data yet (data/progress.json). You see the demo with made-up data.",
      demoNote: "Demo: all data is made up. This is what the dashboard looks like after a few weeks of practice.",
      subtitle: "{course} · as of {date}", subtitleNoCourse: "As of {date}",
      filter: "Skill", all: "All skills", asof: "All figures are as of {date}, the day of the export.",
      kSolo: "Solved independently", kSoloSub: "{ok} of {n} explained tasks, rung ≤ 2", kPending: "Waiting for an explanation", kPendingSub: "tasks only count after an explanation in own words",
      kReviews: "Reviews", kReviewsSub: "{overdue} overdue · {due} today", kExam: "Until the exam", kExamSub: "{date}", kNoExam: "no date",
      days: "{n} days", day: "1 day", none: "–",
      levels: "Levels", levelsHint: "How many skills (and microskills) are at each level.", skillsN: "{n} skills",
      showTable: "Table", showChart: "Chart", level: "Level", name: "Name", count: "Count", skillsCol: "Skills",
      skills: "Per skill", skillsHint: "Solved = with at most rung 2, over the last 10 explained tasks. The tick is the target ({pct}%).",
      solved: "{ok}/{n} solved", noTasks: "no explained tasks yet", open: "{n} explanation(s) open", next: "review {date}",
      overdue: "overdue", dueToday: "today", upcoming: "planned", noReview: "no review",
      more: "Details", less: "Close", history: "Level history", tasks: "Tasks", reviews: "Reviews", noHistory: "No level changes yet.",
      noTaskRows: "No tasks yet.", noReviewRows: "No reviews yet.",
      date: "Date", task: "Task", rung: "Rung", source: "Source", explanation: "Explanation", rejections: "Rejected", corrections: "Corrections", result: "Outcome", nextReview: "Next",
      explained: "approved", pendingExpl: "waiting for an explanation", voided: "voided", from: "from", to: "to", note: "Note",
      by: { claude: "by Claude", hook: "by the check" }, src: { check: "test (check.mjs)", done: "logged by the learner", chat: "chat" },
      res: { pass: "passed", shaky: "shaky", fail: "failed" },
      tasksChart: "Tasks per day", tasksHint: "Every task with its highest rung of help. Darker = more independent.",
      bSolo: "independent (rung 0)", bHint: "with a hint (rung 1–2)", bHelp: "a lot of help (rung 3–5)", bPending: "waiting for an explanation", total: "total",
      noTaskChart: "No tasks in this selection yet.",
      attention: "Signals", signalsUp: "Promotion signal", signalsDown: "Relapse signal", regression: "{n} test(s) went from green to red", regressionFixed: "{n} test(s) green again (repair, not a new task)",
      override: "Override of {min} min", noSignals: "No signals in this selection.",
      calibration: "Calibration", calibrationHint: "Confidence before and after the session (1–5), as the learner wrote it down.",
      before: "before", after: "after the session", session: "Session", noCalibration: "No sessions with a number for confidence yet.",
      diary: "Diary", diaryHint: "The harness logs the facts; the reflection is in the learner's own words.",
      plan: "Plan", wentWell: "Went well", learned: "Learned", confusing: "Confusing", confidence: "Confidence", nextStep: "Next step", calib: "Calibration",
      noDiary: "No diary entries yet.", activity: "Activity", sessions: "Sessions", hints: "Hints", holds: "No new rung", denials: "Guard denials", overridesUsed: "Overrides used",
      footAi: "AI statement: the learning harness, this dashboard and the docs were made with help from Claude (Anthropic). The learning data and the reflections are the learner's own.",
      footLicense: "Code: MIT · texts and data: CC BY-NC 4.0", footSource: "Source code and documentation", focus: "Go to {id}",
    },
  };
  const LEVELS = ["L0", "L1", "L2", "L3", "L4"];
  const LEVEL_NAMES = {
    nl: { L0: "Voordoen", L1: "Aanvullen", L2: "Begeleid", L3: "Zelfstandig", L4: "Geautomatiseerd" },
    en: { L0: "Demonstrate", L1: "Complete", L2: "Guided", L3: "Independent", L4: "Automated" },
  };
  const BUCKETS = [["solo", "r-solo", "bSolo"], ["hint", "r-hint", "bHint"], ["help", "r-help", "bHelp"], ["pending", "pending", "bPending"]];

  const params = new URLSearchParams(location.search);
  let lang = ["nl", "en"].includes(params.get("lang")) ? params.get("lang") : (navigator.language || "nl").toLowerCase().startsWith("nl") ? "nl" : "en";
  let source = params.get("data") === "demo" ? "demo" : "progress";
  let filter = "all";
  let data = null;
  let fellBack = false;
  const tableOpen = new Set();
  const detailOpen = new Set();

  // ---------- DOM helpers (no innerHTML anywhere) ----------
  const $ = (id) => document.getElementById(id);
  function el(tag, props, ...kids) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props || {})) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = String(v);
      else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v === true ? "" : String(v));
    }
    for (const kid of kids.flat()) if (kid !== null && kid !== undefined && kid !== false) e.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    return e;
  }
  const NS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs, ...kids) {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v === null || v === undefined) continue;
      if (k === "text") e.textContent = String(v);
      else if (k.startsWith("on") && typeof v === "function") e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, String(v));
    }
    for (const kid of kids.flat()) if (kid) e.append(kid);
    return e;
  }
  const t = (key, vars) => {
    let s = key.split(".").reduce((o, k) => (o ? o[k] : undefined), UI[lang]) ?? key;
    for (const [k, v] of Object.entries(vars || {})) s = s.split(`{${k}}`).join(String(v));
    return s;
  };
  const levelName = (l) => LEVEL_NAMES[lang][l] ?? "";
  const fmtDate = (iso, opts = { day: "numeric", month: "short" }) => {
    if (!iso) return t("none");
    const d = new Date(String(iso).length <= 10 ? `${iso}T12:00:00` : iso);
    return Number.isNaN(d.getTime()) ? String(iso) : d.toLocaleDateString(lang === "nl" ? "nl-NL" : "en-GB", opts);
  };
  const fmtLong = (iso) => fmtDate(iso, { day: "numeric", month: "long", year: "numeric" });
  const pct = (x) => `${Math.round(x * 100)}%`;
  const dayDiff = (a, b) => Math.round((Date.parse(`${b}T12:00:00`) - Date.parse(`${a}T12:00:00`)) / 86400000);

  // ---------- Tooltip (hover and keyboard focus) ----------
  const tip = $("tooltip");
  function showTip(evt, title, rows) {
    tip.replaceChildren(el("div", { class: "tt-title", text: title }), ...rows.map(([cls, value, label]) =>
      el("div", { class: "tt-row" }, cls ? el("span", { class: `ln ${cls}` }) : null, el("strong", { text: value }), el("span", { text: label }))));
    tip.hidden = false;
    let x, y;
    if (evt && "clientX" in evt && evt.type.startsWith("pointer")) { x = evt.clientX; y = evt.clientY; }
    else { const r = evt.currentTarget.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top; }
    const w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = `${Math.max(8, Math.min(window.innerWidth - w - 8, x + 12))}px`;
    tip.style.top = `${Math.max(8, y - h - 12)}px`;
  }
  const hideTip = () => { tip.hidden = true; };
  function withTip(node, title, rows) {
    const show = (e) => showTip(e, title, rows);
    node.addEventListener("pointermove", show);
    node.addEventListener("pointerleave", hideTip);
    node.addEventListener("focus", show);
    node.addEventListener("blur", hideTip);
    return node;
  }

  // ---------- Data helpers ----------
  const asOf = () => data.generatedAt || new Date().toISOString().slice(0, 10);
  const skillById = () => new Map(data.skills.map((s) => [s.id, s]));
  const mains = () => data.skills.filter((s) => !s.parent && s.kind !== "zone");
  const microsOf = (id) => data.skills.filter((s) => s.parent === id);
  const family = (s) => (s.parent ? [s.id] : [s.id, ...microsOf(s.id).map((m) => m.id)]);
  const inScope = (skillId) => {
    if (filter === "all") return true;
    const s = skillById().get(skillId);
    return skillId === filter || (s && s.parent === filter);
  };
  const liveTasks = () => data.tasks.filter((x) => !x.void);
  function stats(s) {
    const ids = new Set(family(s));
    const fam = liveTasks().filter((x) => ids.has(x.skill));
    const done = fam.filter((x) => x.explained).slice(-10);
    const ok = done.filter((x) => x.success && x.maxRung <= 2).length;
    return { n: done.length, ok, pending: fam.filter((x) => !x.explained).length };
  }
  function reviewState(s) {
    if (!s.nextReview) return { cls: "none", key: "noReview" };
    const d = dayDiff(asOf(), s.nextReview);
    if (d < 0) return { cls: "critical", key: "overdue" };
    if (d === 0) return { cls: "warning", key: "dueToday" };
    return { cls: "good", key: "upcoming" };
  }
  const bucketOf = (x) => (!x.explained ? "pending" : x.maxRung === 0 ? "solo" : x.maxRung <= 2 ? "hint" : "help");
  const conf = (v) => { const m = String(v ?? "").match(/(?:^|\D)([1-5])(?:\s*\/\s*5)?(?!\d)/); return m ? Number(m[1]) : null; };

  // ---------- Building blocks ----------
  function card(title, hint, body, tableBuilder, id) {
    const head = el("div", { class: "card-head" }, el("h2", { text: title, id: id ? `${id}-h` : null }));
    const holder = el("div");
    if (tableBuilder) {
      const open = tableOpen.has(id);
      const btn = el("button", { type: "button", class: "toggle-table", "aria-pressed": open ? "true" : "false", text: open ? t("showChart") : t("showTable"),
        onclick: () => { if (tableOpen.has(id)) tableOpen.delete(id); else tableOpen.add(id); render(); } });
      head.append(btn);
      holder.append(open ? tableBuilder() : body);
    } else holder.append(body);
    return el("section", { class: "card", "aria-labelledby": id ? `${id}-h` : null }, head, hint ? el("p", { class: "hint", text: hint }) : null, holder);
  }
  function table(headers, rows, numCols = []) {
    const cell = (c, i) => {
      if (c instanceof Node) return el("td", {}, c);
      const cls = numCols.includes(i) ? "num" : String(c ?? "").length > 60 ? "text" : null;
      return el("td", { class: cls, text: c ?? t("none") });
    };
    const head = el("thead", {}, el("tr", {}, headers.map((h, i) => el("th", { class: numCols.includes(i) ? "num" : null, scope: "col", text: h }))));
    const body = el("tbody", {}, rows.map((r) => el("tr", {}, r.map(cell))));
    return el("div", { class: "table-wrap" }, el("table", {}, head, body));
  }
  const statusBadge = (cls, label) => el("span", { class: "status" }, el("span", { class: `dot ${cls}`, "aria-hidden": "true" }), label);

  // ---------- Sections ----------
  function kpis() {
    const tasks = liveTasks().filter((x) => inScope(x.skill));
    const done = tasks.filter((x) => x.explained);
    const ok = done.filter((x) => x.success && x.maxRung <= 2).length;
    const pend = tasks.filter((x) => !x.explained).length;
    const skills = data.skills.filter((s) => s.kind !== "zone" && inScope(s.id));
    const states = skills.map(reviewState);
    const overdue = states.filter((s) => s.key === "overdue").length;
    const due = states.filter((s) => s.key === "dueToday").length;
    const tile = (label, value, sub) => el("div", { class: "tile" }, el("div", { class: "label", text: label }), el("div", { class: "value", text: value }), sub ? el("div", { class: "sub" }, sub) : null);
    const examDays = data.examDate ? dayDiff(asOf(), data.examDate) : null;
    return el("section", { class: "kpis", "aria-label": t("title") },
      tile(t("kSolo"), done.length ? pct(ok / done.length) : t("none"), t("kSoloSub", { ok, n: done.length })),
      tile(t("kPending"), String(pend), t("kPendingSub")),
      tile(t("kReviews"), String(overdue + due), overdue ? statusBadge("critical", t("kReviewsSub", { overdue, due })) : t("kReviewsSub", { overdue, due })),
      tile(t("kExam"), examDays === null ? t("kNoExam") : examDays === 1 ? t("day") : t("days", { n: examDays }), data.examDate ? fmtLong(data.examDate) : null));
  }

  function levelsCard() {
    const skills = data.skills.filter((s) => s.kind !== "zone" && inScope(s.id));
    const counts = LEVELS.map((l) => ({ l, ids: skills.filter((s) => s.level === l).map((s) => s.id) }));
    const total = skills.length || 1;
    const bar = el("div", { class: "segbar", role: "img", "aria-label": counts.map((c) => `${c.l} ${levelName(c.l)}: ${c.ids.length}`).join(", ") });
    for (const c of counts) {
      if (!c.ids.length) continue;
      const block = el("div", { class: `block lv${LEVELS.indexOf(c.l)}`, tabindex: "0", "aria-label": `${c.l} ${levelName(c.l)}: ${c.ids.length}` });
      block.style.flexGrow = String(c.ids.length);
      block.style.flexBasis = "0";
      if (c.ids.length / total > 0.07) block.textContent = String(c.ids.length);
      withTip(block, `${c.l} ${levelName(c.l)}`, [[null, String(c.ids.length), `(${pct(c.ids.length / total)})`]]);
      bar.append(block);
    }
    const legend = el("ul", { class: "legend" }, counts.map((c) => el("li", {}, el("span", { class: `sw lv${LEVELS.indexOf(c.l)}`, "aria-hidden": "true" }), `${c.l} ${levelName(c.l)}`)));
    const body = el("div", {}, el("div", { class: "muted", text: t("skillsN", { n: skills.length }) }), bar, legend);
    return card(t("levels"), t("levelsHint"), body, () => table([t("level"), t("name"), t("count"), t("skillsCol")],
      counts.map((c) => [c.l, levelName(c.l), String(c.ids.length), c.ids.join(", ") || t("none")]), [2]), "levels");
  }

  function skillDetail(s) {
    const ids = new Set(family(s));
    const tasks = data.tasks.filter((x) => ids.has(x.skill));
    const reviews = data.reviews.filter((r) => r.skill === s.id);
    const hist = s.history ?? [];
    const rungLabel = (x) => String(x.maxRung) + (x.corrections.length ? " *" : "");
    const explainCell = (x) => {
      if (x.void) return el("span", { class: "muted", text: `${t("voided")}${x.voidReason ? `: ${x.voidReason}` : ""}` });
      if (!x.explained) return statusBadge("warning", t("pendingExpl"));
      return el("span", {}, statusBadge("good", t("explained")), x.explanation ? el("div", { text: `“${x.explanation}”` }) : null);
    };
    return el("div", { class: "detail" },
      el("div", {}, el("h3", { text: t("history") }), hist.length ? table([t("date"), t("from"), t("to"), t("note")],
        hist.map((h) => [fmtDate(h.at), h.from ?? t("none"), `${h.to} ${levelName(h.to)}`, h.note ?? ""])) : el("p", { class: "muted", text: t("noHistory") })),
      el("div", {}, el("h3", { text: t("tasks") }), tasks.length ? table([t("date"), t("task"), t("rung"), t("source"), t("explanation"), t("rejections"), t("corrections")],
        tasks.map((x) => [fmtDate(x.at), `${x.skill !== s.id ? `${x.skill}: ` : ""}${x.what ?? x.id}`, rungLabel(x), t(`src.${x.source}`) === `src.${x.source}` ? (x.source ?? t("none")) : t(`src.${x.source}`),
          explainCell(x), x.rejections.map((r) => `${t(`by.${r.by}`)}${r.reasons.length ? `: ${r.reasons.join("; ")}` : ""}`).join(" · ") || t("none"),
          x.corrections.map((c) => `${c.from} → ${c.to}${c.reason ? ` (${c.reason})` : ""}`).join(" · ") || t("none")]), [2]) : el("p", { class: "muted", text: t("noTaskRows") })),
      el("div", {}, el("h3", { text: t("reviews") }), reviews.length ? table([t("date"), t("result"), t("nextReview")],
        reviews.map((r) => [fmtDate(r.at), t(`res.${r.result}`), fmtDate(r.nextReview)])) : el("p", { class: "muted", text: t("noReviewRows") })));
  }

  function skillsCard() {
    const target = data.settings?.targetSuccess ?? 0.85;
    const list = el("ul", { class: "skills" });
    for (const main of mains().filter((s) => filter === "all" || s.id === filter)) {
      for (const s of [main, ...microsOf(main.id)]) {
        const st = stats(s);
        const rs = reviewState(s);
        const open = detailOpen.has(s.id);
        const meter = el("div", { class: "meter" });
        const track = el("div", { class: "track", role: "img", "aria-label": st.n ? t("solved", { ok: st.ok, n: st.n }) : t("noTasks") });
        if (st.n) { const fill = el("div", { class: "fill" }); fill.style.width = pct(st.ok / st.n); track.append(fill); }
        const tick = el("div", { class: "target", "aria-hidden": "true" }); tick.style.left = pct(target); track.append(tick);
        meter.append(track, el("div", { class: "num", text: st.n ? `${t("solved", { ok: st.ok, n: st.n })} (${pct(st.ok / st.n)})` : t("noTasks") }));
        const row = el("div", { class: "skill-row" },
          el("div", { class: "skill-name" }, el("div", { class: "title", text: s.title }), el("div", { class: "id", text: s.id })),
          el("span", { class: `chip lv${LEVELS.indexOf(s.level)}`, text: `${s.level} ${levelName(s.level)}` }),
          meter,
          el("div", { class: "skill-meta" }, st.pending ? statusBadge("warning", t("open", { n: st.pending })) : null,
            s.nextReview ? statusBadge(rs.cls, `${t(rs.key)} · ${t("next", { date: fmtDate(s.nextReview) })}`) : el("span", { class: "muted", text: t("noReview") })),
          el("button", { type: "button", class: "expand", "aria-expanded": open ? "true" : "false", "aria-controls": `d-${s.id}`, text: open ? t("less") : t("more"),
            onclick: () => { if (detailOpen.has(s.id)) detailOpen.delete(s.id); else detailOpen.add(s.id); render(); } }));
        list.append(el("li", { class: `skill${s.parent ? " micro" : ""}`, id: `s-${s.id}` }, row, open ? el("div", { id: `d-${s.id}` }, skillDetail(s)) : null));
      }
    }
    return card(t("skills"), t("skillsHint", { pct: Math.round(target * 100) }), list, null, "skills");
  }

  function tasksCard() {
    const tasks = liveTasks().filter((x) => inScope(x.skill));
    const days = [...new Set(tasks.map((x) => String(x.at).slice(0, 10)))].sort();
    const per = days.map((d) => {
      const c = { solo: 0, hint: 0, help: 0, pending: 0 };
      for (const x of tasks) if (String(x.at).slice(0, 10) === d) c[bucketOf(x)]++;
      return { d, c, total: c.solo + c.hint + c.help + c.pending };
    });
    const legend = el("ul", { class: "legend" }, BUCKETS.map(([, cls, key]) => el("li", {}, el("span", { class: `sw ${cls}`, "aria-hidden": "true" }), t(key))));
    let body;
    if (!per.length) body = el("p", { class: "muted", text: t("noTaskChart") });
    else {
      const max = Math.max(...per.map((p) => p.total));
      const step = max <= 5 ? 1 : max <= 10 ? 2 : Math.ceil(max / 5);
      const top = Math.ceil(max / step) * step;
      const W = Math.max(320, per.length * 44 + 40), H = 200, L = 28, B = 26, PT = 10;
      const ph = H - B - PT, slot = (W - L) / per.length, bw = Math.min(24, slot * 0.6);
      const y = (v) => PT + ph - (v / top) * ph;
      const chart = svg("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("tasksChart") });
      for (let v = 0; v <= top; v += step) {
        chart.append(svg("line", { class: v === 0 ? "baseline" : "gridline", x1: L, x2: W, y1: y(v), y2: y(v) }));
        chart.append(svg("text", { x: L - 6, y: y(v) + 4, "text-anchor": "end", text: v }));
      }
      per.forEach((p, i) => {
        const cx = L + slot * i + slot / 2;
        const g = svg("g", { class: "col" });
        let acc = 0;
        const parts = BUCKETS.filter(([k]) => p.c[k] > 0);
        parts.forEach(([k, cls], j) => {
          const y0 = y(acc), y1 = y(acc + p.c[k]);
          const isTop = j === parts.length - 1;
          const h = Math.max(1, y0 - y1 - (isTop ? 0 : 2));
          g.append(svg("path", { class: cls, d: barPath(cx - bw / 2, y0 - h, bw, h, isTop ? 4 : 0) }));
          acc += p.c[k];
        });
        if (per.length <= 16 || i % Math.ceil(per.length / 12) === 0) chart.append(svg("text", { x: cx, y: H - 8, "text-anchor": "middle", text: fmtDate(p.d) }));
        const hit = svg("rect", { class: "hit", x: cx - slot / 2, y: PT, width: slot, height: ph, tabindex: "0", "aria-label": `${fmtDate(p.d)}: ${p.total}` });
        withTip(hit, fmtLong(p.d), [...BUCKETS.map(([k, cls, key]) => [cls, String(p.c[k]), t(key)]), [null, String(p.total), t("total")]]);
        chart.append(g, hit);
      });
      body = el("div", {}, chart, legend);
    }
    return card(t("tasksChart"), t("tasksHint"), body, () => table([t("date"), ...BUCKETS.map(([, , key]) => t(key)), t("total")],
      per.map((p) => [fmtLong(p.d), ...BUCKETS.map(([k]) => String(p.c[k])), String(p.total)]), [1, 2, 3, 4, 5]), "tasks");
  }
  function barPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return r ? `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z` : `M${x},${y + h}V${y}H${x + w}V${y + h}Z`;
  }

  function signalsCard() {
    const items = [];
    for (const s of data.signals.filter((x) => inScope(x.skill))) {
      items.push({ at: data.generatedAt, icon: s.dir === "up" ? "↑" : "↓", cls: s.dir === "up" ? "good" : "serious", label: s.dir === "up" ? t("signalsUp") : t("signalsDown"), text: s.text });
    }
    for (const r of data.regressions.filter((x) => !x.skill || inScope(x.skill))) {
      items.push({ at: r.at, icon: r.fixed ? "↺" : "!", cls: r.fixed ? "good" : "critical", label: r.skill ?? "", text: r.fixed ? t("regressionFixed", { n: r.tests }) : t("regression", { n: r.tests }) });
    }
    for (const o of data.overrides.filter((x) => x.skill === "*" || inScope(x.skill))) {
      items.push({ at: o.at, icon: "⚑", cls: "warning", label: o.skill, text: `${t("override", { min: o.minutes })}${o.reason ? `: ${o.reason}` : ""}` });
    }
    items.sort((a, b) => String(b.at).localeCompare(String(a.at)));
    const list = items.length ? el("ul", { class: "signals" }, items.map((it) => el("li", {},
      el("span", { class: "icon", "aria-hidden": "true", text: it.icon }),
      el("span", {}, statusBadge(it.cls, `${fmtDate(it.at)} · ${it.label}`), " ", it.text)))) : el("p", { class: "muted", text: t("noSignals") });
    return card(t("attention"), null, list, null, "signals");
  }

  function calibrationCard() {
    const rows = data.diary.filter((d) => filter === "all" || String(d.skills ?? "").includes(filter));
    const points = rows.map((d) => ({ d, b: conf(d.confidenceBefore), a: conf(d.reflection?.confidenceAfter) })).filter((p) => p.b !== null || p.a !== null);
    let body;
    if (!points.length) body = el("p", { class: "muted", text: t("noCalibration") });
    else {
      const W = 520, rowH = 30, L = 150, R = 20, T = 24, H = T + points.length * rowH + 10;
      const x = (v) => L + ((v - 1) / 4) * (W - L - R);
      const chart = svg("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": t("calibration") });
      for (let v = 1; v <= 5; v++) {
        chart.append(svg("line", { class: "gridline", x1: x(v), x2: x(v), y1: T - 6, y2: H - 6 }));
        chart.append(svg("text", { x: x(v), y: T - 10, "text-anchor": "middle", text: v }));
      }
      points.forEach((p, i) => {
        const cy = T + i * rowH + rowH / 2;
        chart.append(svg("text", { x: L - 10, y: cy + 4, "text-anchor": "end", text: `${fmtDate(p.d.date)} · ${t("session")} ${p.d.n}` }));
        if (p.b !== null && p.a !== null) chart.append(svg("line", { class: "link", x1: x(p.b), x2: x(p.a), y1: cy, y2: cy }));
        if (p.b !== null) chart.append(svg("circle", { class: "before", cx: x(p.b), cy, r: 5 }));
        if (p.a !== null) chart.append(svg("circle", { class: "after", cx: x(p.a), cy, r: 5 }));
        const hit = svg("rect", { class: "hit", x: 0, y: cy - rowH / 2, width: W, height: rowH, tabindex: "0", "aria-label": `${fmtDate(p.d.date)}: ${p.b ?? "?"} → ${p.a ?? "?"}` });
        withTip(hit, `${fmtLong(p.d.date)} · ${t("session")} ${p.d.n}`, [[null, String(p.b ?? t("none")), t("before")], [null, String(p.a ?? t("none")), t("after")]]);
        chart.append(hit);
      });
      const legend = el("ul", { class: "legend" }, el("li", {}, el("span", { class: "sw lv0", "aria-hidden": "true" }), t("before")), el("li", {}, el("span", { class: "sw lv4", "aria-hidden": "true" }), t("after")));
      body = el("div", {}, chart, legend);
    }
    return card(t("calibration"), t("calibrationHint"), body, () => table([t("date"), t("session"), t("before"), t("after"), t("calib")],
      rows.map((d) => [fmtDate(d.date), String(d.n), d.confidenceBefore ?? t("none"), d.reflection?.confidenceAfter ?? t("none"), d.calibration ?? t("none")])), "calibration");
  }

  function diaryCard() {
    const rows = data.diary.filter((d) => filter === "all" || String(d.skills ?? "").includes(filter)).slice().reverse();
    const field = (label, value) => (value ? [el("dt", { text: label }), el("dd", { text: value })] : []);
    const list = rows.length ? el("ol", { class: "diary" }, rows.map((d) => el("li", { class: "entry" },
      el("div", { class: "when", text: [fmtLong(d.date), `${t("session")} ${d.n}`, d.time, d.skills].filter(Boolean).join(" · ") }),
      el("dl", {}, field(t("plan"), d.plan), field(t("wentWell"), d.wentWell), field(t("learned"), d.reflection?.learned), field(t("confusing"), d.reflection?.confusing),
        field(t("confidence"), [d.confidenceBefore, d.reflection?.confidenceAfter].every(Boolean) ? `${d.confidenceBefore} → ${d.reflection.confidenceAfter}` : d.reflection?.confidenceAfter),
        field(t("nextStep"), d.reflection?.nextStep), field(t("calib"), d.calibration))))) : el("p", { class: "muted", text: t("noDiary") });
    return card(t("diary"), t("diaryHint"), list, null, "diary");
  }

  function activityCard() {
    return card(t("activity"), null, table([t("date"), t("sessions"), t("hints"), t("holds"), t("denials"), t("overridesUsed")],
      data.activity.slice().reverse().map((a) => [fmtDate(a.date), String(a.sessions), String(a.hints), String(a.holds), String(a.denials), String(a.overridesUsed)]), [1, 2, 3, 4, 5]), null, "activity");
  }

  function filters() {
    const select = el("select", { id: "filter", onchange: (e) => { filter = e.target.value; render(); } },
      el("option", { value: "all", text: t("all") }), mains().map((s) => el("option", { value: s.id, text: `${s.id} · ${s.title}` })));
    select.value = filter;
    return el("div", { class: "filters" }, el("label", { for: "filter", text: t("filter") }), select, el("span", { class: "asof", text: t("asof", { date: fmtLong(asOf()) }) }));
  }

  // ---------- Page ----------
  function chrome() {
    document.documentElement.lang = lang;
    document.title = t("title");
    $("title").textContent = t("title");
    $("brand").textContent = t("brand");
    $("skip").textContent = t("skip");
    $("src-real").textContent = t("real");
    $("src-demo").textContent = t("demo");
    $("theme").setAttribute("aria-label", t("theme"));
    for (const b of document.querySelectorAll("[data-lang]")) b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    for (const b of document.querySelectorAll("[data-source]")) b.setAttribute("aria-pressed", String(b.dataset.source === (fellBack ? "demo" : source)));
    $("subtitle").textContent = data ? (data.course ? t("subtitle", { course: data.course, date: fmtLong(asOf()) }) : t("subtitleNoCourse", { date: fmtLong(asOf()) })) : "";
    $("footer").replaceChildren(el("div", { class: "foot-inner" }, el("p", { text: t("footAi") }), el("p", { text: t("footLicense") }),
      el("p", {}, el("a", { href: "../", text: t("footSource") }))));
  }

  function render() {
    chrome();
    const main = $("main");
    if (!data) return;
    const notes = [];
    if (fellBack) notes.push(el("p", { class: "notice", text: t("fallback") }));
    else if (source === "demo") notes.push(el("p", { class: "notice", text: t("demoNote") }));
    if (filter !== "all" && !mains().some((s) => s.id === filter)) filter = "all";
    main.replaceChildren(...notes, filters(), kpis(), levelsCard(), skillsCard(), el("div", { class: "two" }, tasksCard(), signalsCard()),
      el("div", { class: "two" }, calibrationCard(), activityCard()), diaryCard());
  }

  async function load() {
    $("status")?.replaceChildren(t("loading"));
    const demoFile = `data/demo.${lang}.json`;
    const file = source === "demo" ? demoFile : "data/progress.json";
    fellBack = false;
    try {
      let res = await fetch(file, { cache: "no-cache" });
      if (!res.ok && source !== "demo") { res = await fetch(demoFile, { cache: "no-cache" }); fellBack = res.ok; }
      if (!res.ok) throw new Error(String(res.status));
      const json = await res.json();
      if (json.schema !== 1) throw new Error("schema");
      for (const k of ["skills", "tasks", "reviews", "regressions", "overrides", "signals", "activity", "diary"]) json[k] = Array.isArray(json[k]) ? json[k] : [];
      for (const x of json.tasks) { x.rejections = x.rejections ?? []; x.corrections = x.corrections ?? []; }
      data = json;
      render();
    } catch {
      data = null;
      chrome();
      $("main").replaceChildren(el("p", { class: "notice", text: t("loadError", { file }) }));
    }
  }

  // ---------- Controls ----------
  for (const b of document.querySelectorAll("[data-lang]")) b.addEventListener("click", () => {
    if (lang === b.dataset.lang) return;
    lang = b.dataset.lang;
    const p = new URLSearchParams(location.search); p.set("lang", lang); history.replaceState(null, "", `?${p}`);
    if (source === "demo" || fellBack) load(); else render();
  });
  for (const b of document.querySelectorAll("[data-source]")) b.addEventListener("click", () => {
    source = b.dataset.source;
    const p = new URLSearchParams(location.search); if (source === "demo") p.set("data", "demo"); else p.delete("data"); history.replaceState(null, "", `?${p}`);
    load();
  });
  try { const saved = localStorage.getItem("leerharnas-theme"); if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved; } catch { /* no storage */ }
  $("theme").addEventListener("click", () => {
    const dark = document.documentElement.dataset.theme ? document.documentElement.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("leerharnas-theme", document.documentElement.dataset.theme); } catch { /* no storage */ }
  });
  window.addEventListener("scroll", hideTip, { passive: true });
  load();
})();
