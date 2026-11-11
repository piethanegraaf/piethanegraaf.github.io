// Leerdashboard: a static view of data/progress.json (made by harness/export.mjs) or the demo data.
// Vanilla JS, no dependencies. All text from the data goes into the page with textContent, never innerHTML.
"use strict";
(() => {
  const UI = {
    nl: {
      skip: "Naar de inhoud", title: "Leerdashboard", brand: "Leerharnas", real: "Echte data", demo: "Demo", theme: "Thema wisselen",
      loading: "Laden…", loadError: "De data kon niet geladen worden ({file}). Open het dashboard via een webserver, bijvoorbeeld: python -m http.server",
      fallback: "Er is nog geen echte data (data/progress.json). Je ziet de demo met verzonnen data.",
      ownLanguage: "De eigen teksten van de student (uitleg, dagboek en eigen notities en microvaardigheden) staan in de taal waarin ze geschreven zijn: {language}.", langNames: { nl: "Nederlands", en: "Engels" },
      translated: "De eigen teksten van de student (uitleg, dagboek, reflecties, eigen notities en microvaardigheden) zijn door Claude vertaald uit het {language}.",
      originalShown: "Je ziet de eigen teksten van de student in het origineel: {language}.",
      showOriginal: "Toon origineel", showTranslation: "Toon vertaling",
      demoNote: "Demo: alle data is verzonnen. Zo ziet het dashboard eruit na een paar weken oefenen.",
      subtitle: "{course} · stand van {date}", subtitleNoCourse: "Stand van {date}", atTime: "{date}, {time}",
      filter: "Vaardigheid", all: "Alle vaardigheden", asof: "Alle cijfers gelden op het moment van de export: {date}.",
      kSolo: "Zelfstandig gelukt", kSoloSub: "{ok} van {n} uitgelegde taken, trede ≤ 2", kPending: "Wacht op uitleg", kPendingSub: "{skipped} overgeslagen · uitleg hoort direct na het groen worden",
      kReviews: "Herhalingen (L4)", kReviewsSub: "klaar; je doet ze zelf als ze in je werk langskomen", kExam: "Tot de toets", kExamSub: "{date}", kNoExam: "geen datum",
      days: "{n} dagen", day: "1 dag", none: "–",
      levels: "Niveaus", levelsHint: "Hoeveel vaardigheden (en microvaardigheden) op elk niveau staan. Bij een open plaatsing probeer je eerst zelf, met de hintladder van L2; de eerste taak bepaalt het niveau. Wijs een niveau in de legenda aan voor uitleg.", skillsN: "{n} vaardigheden",
      levelMore: "Waarom, en het bewijs: zie 'Wat betekenen de niveaus?' hieronder.",
      placementGroup: "Start · plaatsing open", openChip: "Plaatsing open · L2-ladder",
      // What each level means, why, the evidence (strength as in the literature review, §2.11) and the step to the next level.
      levelInfo: {
        L0: { what: "Claude doet het voor met een uitgewerkt voorbeeld in stappen; jij legt het uit en voorspelt de uitvoer.",
          why: "een beginner die alles zelf moet zoeken, houdt geen denkruimte over om te leren.",
          src: [["Sweller & Cooper 1985; Renkl & Atkinson 2003", "strong"]], next: "Naar L1: twee voorbeelden goed uitgelegd en voorspeld." },
        L1: { what: "Claude schrijft het skelet, jij de kern: je vult de TODO-gaten en test zelf.",
          why: "hulp die je stap voor stap afbouwt, werkt beter dan in één keer van voorbeeld naar opgave.",
          src: [["Renkl & Atkinson 2003; Ericson e.a. 2017", "strong"]], next: "Naar L2: drie gaten gevuld, tests groen, hooguit één hint per gat." },
        L2: { what: "Jij schrijft alles; Claude geeft alleen hints, van een vraag tot een klein voorbeeld.",
          why: "zo weinig hulp als nodig, en pas meer als je vastzit. Het denkwerk blijft bij jou.",
          src: [["Wood & Wood 1999; Aleven e.a. 2003", "moderate"]], next: "Naar L3: ±85% gelukt over minstens 5 taken, de helft met hint 0–1." },
        L3: { what: "Jij maakt het alleen; Claude reviewt pas na je poging.",
          why: "hulp die een beginner helpt, remt wie het al kan (het expertise-omkeereffect).",
          src: [["Kalyuga e.a. 2003", "strong"]], next: "Naar L4: drie keer zelfstandig op twee dagen, plus een transfertaak met uitleg." },
        L4: { what: "Claude schrijft de code, jij controleert. Komt een herhaling langs, dan doe je het één keer zelf.",
          why: "wat vastzit, vraagt geen aandacht meer, maar zonder oefening verleer je het.",
          src: [["Fitts & Posner 1967; Bainbridge 1983", "moderate"], ["herhalen met tussenpozen: Cepeda e.a. 2008", "strong"]], next: "Terug naar L3: twee herhalingen op rij mislukt." },
        open: { what: "Nieuwe vaardigheid: je probeert het eerst zelf, met de hintladder van L2.",
          why: "eerst proberen, dan hulp. Zo krijg je niet meer hulp dan je nodig hebt.",
          src: [["Sinha & Kapur 2021; Kalyuga e.a. 2003", "moderate"]], next: "Je eerste taak bepaalt het niveau: trede 5 → L0, 3–4 → L1, 1–2 → L2, 0 → L3." },
      },
      why: "Waarom", evidence: "Bewijs", strength: { strong: "sterk", moderate: "matig" },
      levelsInfo: "Wat betekenen de niveaus?",
      levelsInfoIntro: "De niveaus volgen cognitive apprenticeship (Collins, Brown & Newman 1989): eerst voordoen, dan hulp die stap voor stap afneemt, tot je het zelf kunt. Bovenaan staat automatiseren, pas als een vaardigheid vastzit (Fitts & Posner 1967).",
      // The route from the start to L4: one step per column, then how you go up and down.
      route: "Zo kom je van L0 naar L4", perLevel: "Per niveau", start: "Start", startName: "plaatsing open",
      upkeep: "Onderhoud: een herhaling als de vaardigheid in je werk langskomt.",
      up: "Omhoog", upText: "de harnas stelt het voor, direct na de uitleg die het criterium haalt, en jij zegt \"ja, doorzetten\". Het bewijs zijn je laatste 10 uitgelegde taken sinds de vorige wijziging. Vanaf L2 kan een sprong, bijvoorbeeld L2 → L4 met de transfertaak.",
      down: "Omlaag", downText: "valt het bewijs tegen (minder dan 70% gelukt over minstens 3 taken, de laatste 2 mislukt, of 2 herhalingen op rij mislukt), dan ga je één niveau terug. Automatisch als autoDemote aan staat, anders als advies.",
      levelsInfoMore: "De sterkte van het bewijs komt uit het literatuuronderzoek. Meer:",
      howLink: "Hoe het werkt", howHref: "../how-it-works/#niveaus-per-vaardigheid",
      researchLink: "de autonomieladder (§5.2)", researchHref: "../research/#52-de-autonomieladder-per-vaardigheid",
      principlesLink: "ontwerpprincipes (§2.11)", principlesHref: "../research/#211-synthese-ontwerpprincipes",
      showTable: "Tabel", showChart: "Grafiek", level: "Niveau", name: "Naam", count: "Aantal", skillsCol: "Vaardigheden",
      skills: "Per vaardigheid", skillsHint: "Per vaardigheid zie je wat je nog nodig hebt voor het volgende niveau. Dat telt alleen de taken sinds je laatste niveauwijziging, net als de harnas. 'Laatste 10' is hoe het de laatste tijd ging; gelukt = opgelost met hooguit trede 2.",
      nsTo: "Naar {to}", nsSince: "telt sinds {date}", nsPlacement: "Plaatsing", nsPlacementText: "je eerste taak bepaalt het niveau", nsMaintain: "Onderhoud", nsNoReview: "geen herhaling gepland",
      nsL0: "{have} van 2 voorbeelden uitgelegd en voorspeld", nsL1: "{have} van 3 gaten gevuld, met hooguit 1 hint", nsL3: "{have} van 3 keer zelfstandig (trede 0)",
      nsRate: "{ok}/{n} gelukt ({pct}) · doel {target}", nsNoTasks: "nog geen uitgelegde taken", nsEnough: "minstens 5 taken ({n}/5)", nsRateCheck: "{target} gelukt",
      nsHalf: "de helft met hint 0–1 ({low}/{n})", nsDays: "op 2 dagen ({days}/2)", nsTransfer: "transfertaak", nsMet: "Gehaald: de harnas stelt doorzetten voor",
      nsMore1: "Nog 1 taak goed, met hooguit 1 hint", nsMore: "Nog {k} taken goed, met hooguit 1 hint",
      nsMoreEx1: "Nog 1 voorbeeld uitleggen en voorspellen", nsMoreEx: "Nog {k} voorbeelden uitleggen en voorspellen",
      nsMoreGap1: "Nog 1 gat vullen, met hooguit 1 hint", nsMoreGap: "Nog {k} gaten vullen, met hooguit 1 hint",
      nsMoreSolo1: "Nog 1 keer zelfstandig", nsMoreSolo: "Nog {k} keer zelfstandig", nsOtherDay: ", op een andere dag", nsDoTransfer: "Doe de transfertaak: /mastery-check {id}",
      nsCountLabel: "{have} van {need}", nsDone: "gehaald", nsNotYet: "nog niet", last10: "laatste 10: {ok}/{n} gelukt",
      solved: "{ok}/{n} gelukt", noTasks: "nog geen uitgelegde taken", open: "{n} uitleg open", next: "herhaling {date}",
      reviewReady: "herhaling klaar", lastSeen: "laatst gezien {date}", notSeen: "nog niet gezien", placementOpen: "plaatsing open", skippedN: "{n} overgeslagen",
      more: "Details", less: "Sluiten", history: "Niveaugeschiedenis", tasks: "Taken", reviews: "Herhalingen", noHistory: "Nog geen niveauwijzigingen.",
      noTaskRows: "Nog geen taken.", noReviewRows: "Nog geen herhalingen.",
      date: "Datum", task: "Taak", rung: "Trede", source: "Bron", explanation: "Uitleg", rejections: "Afgewezen", corrections: "Correcties", result: "Uitkomst", nextReview: "Volgende",
      explained: "goedgekeurd", pendingExpl: "wacht op uitleg", voided: "geschrapt", skipped: "overgeslagen", replayed: "goedgekeurd (hersteld met replay)",
      lapse: { "other-exercise": "andere opdracht begonnen", "session-end": "sessie beëindigd" }, auto: "automatisch", placementNote: "plaatsing", from: "van", to: "naar", note: "Notitie",
      by: { claude: "door Claude", hook: "door de check" }, src: { check: "test (check.mjs)", done: "zelf afgemeld", chat: "chat" },
      res: { pass: "geslaagd", shaky: "wankel", fail: "mislukt" },
      tasksChart: "Taken per dag", tasksHint: "Elke taak met de hoogste trede aan hulp. Donkerder = zelfstandiger.",
      bSolo: "zelfstandig (trede 0)", bHint: "met een hint (trede 1–2)", bHelp: "veel hulp (trede 3–5)", bPending: "wacht op uitleg", bSkipped: "overgeslagen (uitleg niet direct)", total: "totaal",
      noTaskChart: "Nog geen taken in deze selectie.",
      attention: "Signalen", signalsUp: "Doorstroom-signaal", signalsDown: "Terugval-signaal", regression: "{n} test(s) van groen naar rood", regressionFixed: "{n} test(s) weer groen (herstel, geen nieuwe taak)",
      override: "Override van {min} min", noSignals: "Geen signalen in deze selectie.",
      calibration: "Kalibratie", calibrationHint: "Zelfvertrouwen vooraf en na de sessie (1–5), zoals de student het zelf noteerde.",
      before: "vooraf", after: "na de sessie", session: "Sessie", noCalibration: "Nog geen sessies met een cijfer voor het zelfvertrouwen.",
      diary: "Dagboek", diaryHint: "De feiten logt de harnas; de reflectie staat er in de eigen woorden van de student.",
      plan: "Plan", wentWell: "Ging goed", learned: "Geleerd", confusing: "Verwarrend", confidence: "Zelfvertrouwen", nextStep: "Volgende stap", calib: "Kalibratie",
      noDiary: "Nog geen dagboekentries.", activity: "Activiteit", sessions: "Sessies", hints: "Hints", holds: "Geen nieuwe trede", denials: "Guard-weigeringen", overridesUsed: "Overrides gebruikt",
      reviewHelp: "Review-hulp", helpDropped: "Hulp vervallen", viaReview: "via review", reviewOf: "na taak {id}", concept: "Concept", noReviewHelp: "Geen review-hulp.",
      reviewHelpHint: "Hulp in een review na een taak telt alleen mee voor de volgende taak over hetzelfde concept.",
      footAi: "De leerharnas, dit dashboard en de docs zijn gemaakt met hulp van Claude (Anthropic). De leerdata en de reflecties zijn van de student zelf; de vertalingen ervan zijn van Claude.", footAiLink: "AI-verklaring", footAiHref: "../ai-statement/",
      footCode: "Code", footOr: "of een", footCommercial: "commerciële licentie", footTexts: "teksten en data",
      footSource: "Broncode op GitHub", footDocs: "Uitleg bij het dashboard", footDocsHref: "../progress-dashboard/", focus: "Ga naar {id}", tableRegion: "Tabel, scrollbaar",
    },
    en: {
      skip: "Skip to content", title: "Learning dashboard", brand: "Learning harness", real: "Real data", demo: "Demo", theme: "Toggle theme",
      loading: "Loading…", loadError: "The data could not be loaded ({file}). Open the dashboard through a web server, for example: python -m http.server",
      fallback: "There is no real data yet (data/progress.json). You see the demo with made-up data.",
      ownLanguage: "The learner's own texts (explanations, the diary, own notes and microskills) are shown in the language they were written in: {language}.", langNames: { nl: "Dutch", en: "English" },
      translated: "The learner's own texts (explanations, the diary, reflections, own notes and microskills) were translated from {language} by Claude.",
      originalShown: "You see the learner's own texts in the original: {language}.",
      showOriginal: "Show original", showTranslation: "Show translation",
      demoNote: "Demo: all data is made up. This is what the dashboard looks like after a few weeks of practice.",
      subtitle: "{course} · as of {date}", subtitleNoCourse: "As of {date}", atTime: "{date}, {time}",
      filter: "Skill", all: "All skills", asof: "All figures are as of the moment of the export: {date}.",
      kSolo: "Solved independently", kSoloSub: "{ok} of {n} explained tasks, rung ≤ 2", kPending: "Waiting for an explanation", kPendingSub: "{skipped} skipped · the explanation belongs right after the green",
      kReviews: "Reviews (L4)", kReviewsSub: "ready; you do them yourself when they come by in your work", kExam: "Until the exam", kExamSub: "{date}", kNoExam: "no date",
      days: "{n} days", day: "1 day", none: "–",
      levels: "Levels", levelsHint: "How many skills (and microskills) are at each level. With an open placement you try first, with the L2 hint ladder; the first task sets the level. Point at a level in the legend for an explanation.", skillsN: "{n} skills",
      levelMore: "Why, and the evidence: see 'What do the levels mean?' below.",
      placementGroup: "Start · placement open", openChip: "Placement open · L2 ladder",
      levelInfo: {
        L0: { what: "Claude demonstrates with a worked example in steps; you explain it and predict the output.",
          why: "a novice who has to search for everything has no room left to learn.",
          src: [["Sweller & Cooper 1985; Renkl & Atkinson 2003", "strong"]], next: "To L1: two examples explained and predicted correctly." },
        L1: { what: "Claude writes the skeleton, you write the core: you fill in the TODO gaps and test it yourself.",
          why: "help that fades step by step works better than jumping from example to problem at once.",
          src: [["Renkl & Atkinson 2003; Ericson et al. 2017", "strong"]], next: "To L2: three gaps filled, tests green, at most one hint per gap." },
        L2: { what: "You write everything; Claude only gives hints, from a question up to a small example.",
          why: "as little help as needed, and more only when you are stuck. The thinking stays with you.",
          src: [["Wood & Wood 1999; Aleven et al. 2003", "moderate"]], next: "To L3: about 85% solved over at least 5 tasks, half of them with hint 0–1." },
        L3: { what: "You do it alone; Claude reviews only after your attempt.",
          why: "help that supports a novice holds back someone who can already do it (the expertise-reversal effect).",
          src: [["Kalyuga et al. 2003", "strong"]], next: "To L4: solved independently three times on two days, plus a transfer task with an explanation." },
        L4: { what: "Claude writes the code, you check it. When a review comes by, you do it yourself once.",
          why: "what you have mastered needs no attention any more, but without practice you lose it.",
          src: [["Fitts & Posner 1967; Bainbridge 1983", "moderate"], ["spaced reviews: Cepeda et al. 2008", "strong"]], next: "Back to L3: two reviews in a row failed." },
        open: { what: "New skill: you try it yourself first, with the L2 hint ladder.",
          why: "attempt first, then help, so you get no more help than you need.",
          src: [["Sinha & Kapur 2021; Kalyuga et al. 2003", "moderate"]], next: "Your first task sets the level: rung 5 → L0, 3–4 → L1, 1–2 → L2, 0 → L3." },
      },
      why: "Why", evidence: "Evidence", strength: { strong: "strong", moderate: "moderate" },
      levelsInfo: "What do the levels mean?",
      levelsInfoIntro: "The levels follow cognitive apprenticeship (Collins, Brown & Newman 1989): first demonstrate, then help that fades step by step, until you can do it yourself. Automation sits at the top, only once a skill is mastered (Fitts & Posner 1967).",
      route: "How you get from L0 to L4", perLevel: "Per level", start: "Start", startName: "placement open",
      upkeep: "Upkeep: a review when the skill comes by in your work.",
      up: "Up", upText: "the harness proposes it right after the explanation that meets the criterion, and you say \"yes, promote\". The evidence is your last 10 explained tasks since the previous change. From L2 a jump is possible, for example L2 → L4 with the transfer task.",
      down: "Down", downText: "if the evidence falls short (under 70% solved over at least 3 tasks, the last 2 failed, or 2 reviews in a row failed), you go back one level. Automatically when autoDemote is on, otherwise as advice.",
      levelsInfoMore: "The strength of the evidence comes from the literature review. More:",
      howLink: "How it works", howHref: "../en/how-it-works/#levels-per-skill",
      researchLink: "the Autonomy Ladder (§5.2)", researchHref: "../en/research/#52-the-autonomy-ladder-per-skill",
      principlesLink: "design principles (§2.11)", principlesHref: "../en/research/#211-synthesis-design-principles",
      showTable: "Table", showChart: "Chart", level: "Level", name: "Name", count: "Count", skillsCol: "Skills",
      skills: "Per skill", skillsHint: "Per skill you see what you still need for the next level. That only counts the tasks since your last level change, just like the harness. 'Last 10' is how it went lately; solved = with at most rung 2.",
      nsTo: "To {to}", nsSince: "counts since {date}", nsPlacement: "Placement", nsPlacementText: "your first task sets the level", nsMaintain: "Maintenance", nsNoReview: "no review planned",
      nsL0: "{have} of 2 examples explained and predicted", nsL1: "{have} of 3 gaps filled, with at most 1 hint", nsL3: "{have} of 3 times independent (rung 0)",
      nsRate: "{ok}/{n} solved ({pct}) · target {target}", nsNoTasks: "no explained tasks yet", nsEnough: "at least 5 tasks ({n}/5)", nsRateCheck: "{target} solved",
      nsHalf: "half with hint 0–1 ({low}/{n})", nsDays: "on 2 days ({days}/2)", nsTransfer: "transfer task", nsMet: "Reached: the harness proposes to promote",
      nsMore1: "1 more task solved, with at most 1 hint", nsMore: "{k} more tasks solved, with at most 1 hint",
      nsMoreEx1: "1 more example to explain and predict", nsMoreEx: "{k} more examples to explain and predict",
      nsMoreGap1: "1 more gap to fill, with at most 1 hint", nsMoreGap: "{k} more gaps to fill, with at most 1 hint",
      nsMoreSolo1: "1 more time independent", nsMoreSolo: "{k} more times independent", nsOtherDay: ", on another day", nsDoTransfer: "Do the transfer task: /mastery-check {id}",
      nsCountLabel: "{have} of {need}", nsDone: "reached", nsNotYet: "not yet", last10: "last 10: {ok}/{n} solved",
      solved: "{ok}/{n} solved", noTasks: "no explained tasks yet", open: "{n} explanation(s) open", next: "review {date}",
      reviewReady: "review ready", lastSeen: "last seen {date}", notSeen: "not seen yet", placementOpen: "placement open", skippedN: "{n} skipped",
      more: "Details", less: "Close", history: "Level history", tasks: "Tasks", reviews: "Reviews", noHistory: "No level changes yet.",
      noTaskRows: "No tasks yet.", noReviewRows: "No reviews yet.",
      date: "Date", task: "Task", rung: "Rung", source: "Source", explanation: "Explanation", rejections: "Rejected", corrections: "Corrections", result: "Outcome", nextReview: "Next",
      explained: "approved", pendingExpl: "waiting for an explanation", voided: "voided", skipped: "skipped", replayed: "approved (recovered with replay)",
      lapse: { "other-exercise": "started another exercise", "session-end": "session ended" }, auto: "automatic", placementNote: "placement", from: "from", to: "to", note: "Note",
      by: { claude: "by Claude", hook: "by the check" }, src: { check: "test (check.mjs)", done: "logged by the learner", chat: "chat" },
      res: { pass: "passed", shaky: "shaky", fail: "failed" },
      tasksChart: "Tasks per day", tasksHint: "Every task with its highest rung of help. Darker = more independent.",
      bSolo: "independent (rung 0)", bHint: "with a hint (rung 1–2)", bHelp: "a lot of help (rung 3–5)", bPending: "waiting for an explanation", bSkipped: "skipped (no explanation right away)", total: "total",
      noTaskChart: "No tasks in this selection yet.",
      attention: "Signals", signalsUp: "Promotion signal", signalsDown: "Relapse signal", regression: "{n} test(s) went from green to red", regressionFixed: "{n} test(s) green again (repair, not a new task)",
      override: "Override of {min} min", noSignals: "No signals in this selection.",
      calibration: "Calibration", calibrationHint: "Confidence before and after the session (1–5), as the learner wrote it down.",
      before: "before", after: "after the session", session: "Session", noCalibration: "No sessions with a number for confidence yet.",
      diary: "Diary", diaryHint: "The harness logs the facts; the reflection is in the learner's own words.",
      plan: "Plan", wentWell: "Went well", learned: "Learned", confusing: "Confusing", confidence: "Confidence", nextStep: "Next step", calib: "Calibration",
      noDiary: "No diary entries yet.", activity: "Activity", sessions: "Sessions", hints: "Hints", holds: "No new rung", denials: "Guard denials", overridesUsed: "Overrides used",
      reviewHelp: "Review help", helpDropped: "Help dropped", viaReview: "via review", reviewOf: "after task {id}", concept: "Concept", noReviewHelp: "No review help.",
      reviewHelpHint: "Help in a review after a task only counts for the next task about the same concept.",
      footAi: "The learning harness, this dashboard and the docs were made with help from Claude (Anthropic). The learning data and the reflections are the learner's own; their translations are by Claude.", footAiLink: "AI statement", footAiHref: "../en/ai-statement/",
      footCode: "Code", footOr: "or a", footCommercial: "commercial licence", footTexts: "texts and data",
      footSource: "Source code on GitHub", footDocs: "About the dashboard", footDocsHref: "../en/progress-dashboard/", focus: "Go to {id}", tableRegion: "Table, scrollable",
    },
  };
  const LEVELS = ["L0", "L1", "L2", "L3", "L4"];
  const LEVEL_NAMES = {
    nl: { L0: "Voordoen", L1: "Aanvullen", L2: "Begeleid", L3: "Zelfstandig", L4: "Geautomatiseerd" },
    en: { L0: "Demonstrate", L1: "Complete", L2: "Guided", L3: "Independent", L4: "Automated" },
  };
  const BUCKETS = [["solo", "r-solo", "bSolo"], ["hint", "r-hint", "bHint"], ["help", "r-help", "bHelp"], ["pending", "pending", "bPending"], ["skipped", "skipped", "bSkipped"]];

  const params = new URLSearchParams(location.search);
  let lang = ["nl", "en"].includes(params.get("lang")) ? params.get("lang") : (navigator.language || "nl").toLowerCase().startsWith("nl") ? "nl" : "en";
  let source = params.get("data") === "demo" ? "demo" : "progress";
  let filter = "all";
  let showOriginal = false; // the switch at the top: the learner's own texts untranslated
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
    for (const kid of kids.flat(Infinity)) if (kid !== null && kid !== undefined && kid !== false) e.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
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
    // rows: [class, value, label] for a figure, or { text, class } for a line of text; or one plain
    // text (the original of a translation).
    const row = (r) => (Array.isArray(r)
      ? el("div", { class: "tt-row" }, r[0] ? el("span", { class: `ln ${r[0]}` }) : null, el("strong", { text: r[1] }), el("span", { text: r[2] }))
      : el("div", { class: `tt-text${r.class ? ` ${r.class}` : ""}`, lang: r.lang, text: r.text }));
    tip.replaceChildren(el("div", { class: "tt-title", text: title }), ...(typeof rows === "string" ? [row({ text: rows, lang: data?.language })] : rows.map(row)));
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
  // The day of the export in local time (an older export has only a date), and the time if known.
  const localDay = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  // The moment of the export: exportedAt, or a generatedAt with a time (one export of 11 November 2026).
  // generatedAt itself is a date, so an older cached app.js keeps working on newer data.
  const exportMoment = () => {
    const v = data.exportedAt ?? (String(data.generatedAt ?? "").length > 10 ? data.generatedAt : null);
    const d = v ? new Date(v) : null;
    return d && !Number.isNaN(d.getTime()) ? d : null;
  };
  const asOf = () => {
    const d = exportMoment();
    if (d) return localDay(d);
    return data.generatedAt ? String(data.generatedAt).slice(0, 10) : localDay(new Date());
  };
  const asOfLabel = () => {
    const d = exportMoment();
    if (!d) return fmtLong(asOf());
    return t("atTime", { date: fmtLong(asOf()), time: d.toLocaleTimeString(lang === "nl" ? "nl-NL" : "en-GB", { hour: "2-digit", minute: "2-digit" }) });
  };
  const skillById = () => new Map(data.skills.map((s) => [s.id, s]));
  // Texts in the language of the page where the export has both (titles from the map, fixed notes, signals).
  // The learner's own texts are in the language of the record; the export adds Claude's translations
  // (data.translations[lang][text]). One switch at the top shows all originals instead, so a single text
  // needs no marker of its own. tx() gives a text for the page: the translation, or the original with its
  // lang attribute, with `code` in backticks as <code>. txs() gives a plain string (option labels).
  // An older export without translations shows the original.
  const langName = (l) => t("langNames")?.[l] ?? l;
  const hasTranslations = () => !!data?.language && data.language !== lang && Object.keys(data.translations?.[lang] ?? {}).length > 0;
  const trOf = (text) => {
    if (showOriginal || typeof text !== "string" || !data?.language || lang === data.language) return null;
    const tr = data.translations?.[lang]?.[text];
    return typeof tr === "string" && tr && tr !== text ? tr : null;
  };
  const txs = (text) => trOf(text) ?? text;
  const rich = (s) => String(s).split(/`([^`\n]+)`/).map((part, i) => (i % 2 ? el("code", { text: part }) : part)).filter((p) => p !== "");
  const tx = (text) => {
    if (text === null || text === undefined) return null;
    const tr = trOf(text);
    const shown = String(tr ?? text);
    const original = !tr && !!data?.language && data.language !== lang;
    if (!original && !shown.includes("`")) return shown;
    return el("span", { lang: original ? data.language : null }, rich(shown));
  };
  const joinNodes = (parts, sep) => parts.flatMap((p, i) => (i ? [sep, p] : [p]));
  // What a level means ("open" = placement open). The tooltip (legend and level bar) stays short: what the
  // level is and the step to the next one. Why and the evidence are in the card "What do the levels mean?".
  const levelInfo = (l) => UI[lang].levelInfo[l] ?? null;
  const evidenceText = ([sources, strength]) => `${t("evidence")}: ${sources} · ${t(`strength.${strength}`)}`;
  const levelRows = (l) => {
    const i = levelInfo(l);
    return i ? [{ text: i.what }, { text: i.next, class: "tt-next" }, { text: t("levelMore"), class: "tt-src" }] : [];
  };
  const levelTitle = (l) => (l === "open" ? t("placementGroup") : `${l} ${levelName(l)}`);
  const withLevelTip = (node, l, figures = []) => {
    node.classList.add("explained");
    return withTip(node, levelTitle(l), [...figures, ...levelRows(l)]);
  };
  const titleOf = (s) => s.titles?.[lang] ?? txs(s.title);
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
    return { n: done.length, ok, pending: fam.filter((x) => !x.explained && !x.lapsed).length, skipped: fam.filter((x) => x.lapsed).length };
  }
  // Reviews only at L4 and never "overdue": a ready review waits until the skill comes by (setup review S2).
  const reviewReady = (s) => s.level === "L4" && s.nextReview && dayDiff(asOf(), s.nextReview) <= 0;
  const bucketOf = (x) => (x.lapsed ? "skipped" : !x.explained ? "pending" : x.maxRung === 0 ? "solo" : x.maxRung <= 2 ? "hint" : "help");
  const conf = (v) => { const m = String(v ?? "").match(/(?:^|\D)([1-5])(?:\s*\/\s*5)?(?!\d)/); return m ? Number(m[1]) : null; };

  // ---------- Building blocks ----------
  // footer: shown under the chart and under the table view alike.
  function card(title, hint, body, tableBuilder, id, footer = null) {
    const head = el("div", { class: "card-head" }, el("h2", { text: title, id: id ? `${id}-h` : null }));
    const holder = el("div");
    if (tableBuilder) {
      const open = tableOpen.has(id);
      const btn = el("button", { type: "button", class: "toggle-table", "aria-pressed": open ? "true" : "false", text: open ? t("showChart") : t("showTable"),
        onclick: () => { if (tableOpen.has(id)) tableOpen.delete(id); else tableOpen.add(id); render(); } });
      head.append(btn);
      holder.append(open ? tableBuilder() : body);
    } else holder.append(body);
    return el("section", { class: "card", "aria-labelledby": id ? `${id}-h` : null }, head, hint ? el("p", { class: "hint", text: hint }) : null, holder, footer);
  }
  function table(headers, rows, numCols = []) {
    const cell = (c, i) => {
      if (c instanceof Node) return el("td", { class: c.textContent.length > 60 ? "text" : null }, c);
      const cls = numCols.includes(i) ? "num" : String(c ?? "").length > 60 ? "text" : null;
      return el("td", { class: cls, text: c ?? t("none") });
    };
    const head = el("thead", {}, el("tr", {}, headers.map((h, i) => el("th", { class: numCols.includes(i) ? "num" : null, scope: "col", text: h }))));
    const body = el("tbody", {}, rows.map((r) => el("tr", {}, r.map(cell))));
    return el("div", { class: "table-wrap", tabindex: "0", role: "region", "aria-label": t("tableRegion") }, el("table", {}, head, body));
  }
  const statusBadge = (cls, label) => el("span", { class: "status" }, el("span", { class: `dot ${cls}`, "aria-hidden": "true" }), label);

  // ---------- Sections ----------
  function kpis() {
    const tasks = liveTasks().filter((x) => inScope(x.skill));
    const done = tasks.filter((x) => x.explained);
    const ok = done.filter((x) => x.success && x.maxRung <= 2).length;
    const pend = tasks.filter((x) => !x.explained && !x.lapsed).length;
    const skipped = tasks.filter((x) => x.lapsed).length;
    const skills = data.skills.filter((s) => s.kind !== "zone" && inScope(s.id));
    const ready = skills.filter(reviewReady).length;
    const tile = (label, value, sub) => el("div", { class: "tile" }, el("div", { class: "label", text: label }), el("div", { class: "value", text: value }), sub ? el("div", { class: "sub" }, sub) : null);
    const examDays = data.examDate ? dayDiff(asOf(), data.examDate) : null;
    return el("section", { class: "kpis", "aria-label": t("title") },
      tile(t("kSolo"), done.length ? pct(ok / done.length) : t("none"), t("kSoloSub", { ok, n: done.length })),
      tile(t("kPending"), String(pend), t("kPendingSub", { skipped })),
      tile(t("kReviews"), String(ready), t("kReviewsSub")),
      tile(t("kExam"), examDays === null ? t("kNoExam") : examDays === 1 ? t("day") : t("days", { n: examDays }), data.examDate ? fmtLong(data.examDate) : null));
  }

  function levelsCard() {
    const skills = data.skills.filter((s) => s.kind !== "zone" && inScope(s.id));
    const isOpen = (s) => s.placement === "pending";
    // The placement comes first: every new skill starts there, before any level (it is not below L0:
    // the first task can place a skill straight on L3).
    const counts = [
      { l: "open", cls: "open", label: t("placementGroup"), ids: skills.filter(isOpen).map((s) => s.id) },
      ...LEVELS.map((l) => ({ l, cls: `lv${LEVELS.indexOf(l)}`, label: `${l} ${levelName(l)}`, ids: skills.filter((s) => !isOpen(s) && s.level === l).map((s) => s.id) })),
    ];
    const total = skills.length || 1;
    const bar = el("div", { class: "segbar", role: "group", "aria-label": counts.map((c) => `${c.label}: ${c.ids.length}`).join(", ") });
    for (const c of counts) {
      if (!c.ids.length) continue;
      const block = el("div", { class: `block ${c.cls}`, tabindex: "0", role: "img", "aria-label": `${c.label}: ${c.ids.length}` });
      block.style.flexGrow = String(c.ids.length);
      block.style.flexBasis = "0";
      if (c.ids.length / total > 0.07) block.textContent = String(c.ids.length);
      withLevelTip(block, c.l, [[null, String(c.ids.length), `(${pct(c.ids.length / total)})`]]);
      bar.append(block);
    }
    const legend = el("ul", { class: "legend" }, counts.filter((c) => c.l !== "open" || c.ids.length).map((c) =>
      withLevelTip(el("li", { tabindex: "0", class: c.l === "open" ? "start" : null }, el("span", { class: `sw ${c.cls}`, "aria-hidden": "true" }), c.label), c.l)));
    const body = el("div", {}, el("div", { class: "muted", text: t("skillsN", { n: skills.length }) }), bar, legend);
    return card(t("levels"), t("levelsHint"), body, () => table([t("level"), t("name"), t("count"), t("skillsCol")],
      counts.map((c) => [c.l === "open" ? "–" : c.l, c.l === "open" ? c.label : levelName(c.l), String(c.ids.length), c.ids.join(", ") || t("none")]), [2]), "levels", levelsInfo());
  }

  // "What do the levels mean?": the route from the start to L4, then every level with its meaning, the
  // reason, the evidence and the next step. A <details>, so it is out of the way; its open state survives a re-render.
  let levelsInfoOpen = false;
  function levelsInfo() {
    const steps = ["open", ...LEVELS];
    const chipOf = (l, text) => el("span", { class: `chip ${l === "open" ? "open" : `lv${LEVELS.indexOf(l)}`}`, text });
    // The route: one step per column (one per row on a narrow screen), each with how you get to the next one.
    const routeStep = (l, i) => el("li", {},
      el("div", { class: "head" }, chipOf(l, l === "open" ? t("start") : l), i < steps.length - 1 ? el("span", { class: "line", "aria-hidden": "true" }) : null),
      el("strong", { text: l === "open" ? t("startName") : levelName(l) }),
      el("p", { class: "crit", text: l === "L4" ? t("upkeep") : levelInfo(l).next }));
    const item = (l) => {
      const i = levelInfo(l);
      return el("li", {},
        el("div", { class: "li-head" }, chipOf(l, l === "open" ? t("placementGroup") : `${l} ${levelName(l)}`)),
        el("p", { text: i.what }),
        el("p", {}, el("span", { class: "label", text: `${t("why")}: ` }), i.why),
        i.src.map((s) => el("p", { class: "src", text: evidenceText(s) })),
        el("p", { class: "next", text: i.next }));
    };
    const link = (href, text) => el("a", { href, text });
    return el("details", { class: "level-info", open: levelsInfoOpen, ontoggle: (e) => { levelsInfoOpen = e.currentTarget.open; } },
      el("summary", { text: t("levelsInfo") }),
      el("p", { class: "intro", text: t("levelsInfoIntro") }),
      el("h3", { text: t("route") }),
      el("ol", { class: "route" }, steps.map(routeStep)),
      el("p", { class: "updown" }, el("strong", { text: `${t("up")}: ` }), t("upText")),
      el("p", { class: "updown" }, el("strong", { text: `${t("down")}: ` }), t("downText")),
      el("h3", { text: t("perLevel") }),
      el("ol", { class: "levels-list" }, steps.map(item)),
      el("p", { class: "more" }, `${t("levelsInfoMore")} `, link(t("howHref"), t("howLink")), " · ", link(t("researchHref"), t("researchLink")), " · ", link(t("principlesHref"), t("principlesLink"))));
  }

  function skillDetail(s) {
    const ids = new Set(family(s));
    const tasks = data.tasks.filter((x) => ids.has(x.skill));
    const reviews = data.reviews.filter((r) => r.skill === s.id);
    const hist = s.history ?? [];
    const rungLabel = (x) => String(x.maxRung) + (x.reviewRung ? ` (${t("viaReview")})` : "") + (x.corrections.length ? " *" : "");
    const review = (data.reviewHelp ?? []).filter((r) => ids.has(r.skill));
    const explainCell = (x) => {
      if (x.void) return el("span", { class: "muted" }, t("voided"), x.voidReason ? [": ", tx(x.voidReason)] : null);
      if (x.lapsed) return el("span", { class: "muted", text: `${t("skipped")}${x.lapseReason && t("lapse")?.[x.lapseReason] ? `: ${t("lapse")[x.lapseReason]}` : ""}` });
      if (!x.explained) return statusBadge("warning", t("pendingExpl"));
      return el("span", {}, statusBadge("good", t(x.explainedBy === "replay" ? "replayed" : "explained")), x.explanation ? el("div", {}, "“", tx(x.explanation), "”") : null);
    };
    return el("div", { class: "detail" },
      el("div", {}, el("h3", { text: t("history") }), hist.length ? table([t("date"), t("from"), t("to"), t("note")],
        hist.map((h) => [fmtDate(h.at), h.from ?? t("none"), `${h.to} ${levelName(h.to)}`,
          el("span", {}, h.auto ? `[${t("auto")}] ` : h.placement ? `[${t("placementNote")}] ` : null, h.notes?.[lang] ?? tx(h.note))])) : el("p", { class: "muted", text: t("noHistory") })),
      el("div", {}, el("h3", { text: t("tasks") }), tasks.length ? table([t("date"), t("task"), t("rung"), t("source"), t("explanation"), t("rejections"), t("corrections")],
        tasks.map((x) => [fmtDate(x.at), el("span", {}, x.skill !== s.id ? `${x.skill}: ` : null, x.what ? tx(x.what) : x.id), rungLabel(x), t(`src.${x.source}`) === `src.${x.source}` ? (x.source ?? t("none")) : t(`src.${x.source}`),
          explainCell(x),
          x.rejections.length ? el("span", {}, joinNodes(x.rejections.map((r) => el("span", {}, t(`by.${r.by}`), r.reasons.length ? [": ", joinNodes(r.reasons.map(tx), "; ")] : null)), " · ")) : t("none"),
          x.corrections.length ? el("span", {}, joinNodes(x.corrections.map((c) => el("span", {}, `${c.from} → ${c.to}`, c.reason ? [" (", tx(c.reason), ")"] : null)), " · ")) : t("none")]), [2]) : el("p", { class: "muted", text: t("noTaskRows") })),
      el("div", {}, el("h3", { text: t("reviews") }), reviews.length ? table([t("date"), t("result"), t("nextReview")],
        reviews.map((r) => [fmtDate(r.at), t(`res.${r.result}`), fmtDate(r.nextReview)])) : el("p", { class: "muted", text: t("noReviewRows") })),
      review.length ? el("div", {}, el("h3", { text: t("reviewHelp") }), el("p", { class: "muted", text: t("reviewHelpHint") }), table([t("date"), t("concept"), t("rung"), t("task")],
        review.map((r) => [fmtDate(r.at), r.skill, String(r.rung), r.reviewOf ? t("reviewOf", { id: r.reviewOf }) : t("none")]), [2])) : null);
  }

  // What a skill still needs for the next level, in the shape of that level's criterion (next-step.js,
  // the same rules and tasks as the harness): a bar with the target only at L2, pips for a count
  // (L0, L1, L3), and for L4 the maintenance. Counts the tasks since the last level change.
  function nextCell(s) {
    const st = window.NextStep ? window.NextStep.nextStep(s, { tasks: liveTasks(), transfers: data.transfers ?? [], family: new Set(family(s)),
      target: data.settings?.targetSuccess ?? 0.85 }) : null;
    const box = el("div", { class: "next" });
    if (!st) return box;
    if (st.kind === "placement") {
      box.append(el("div", { class: "next-head", text: t("nsPlacement") }), el("div", { class: "num", text: t("nsPlacementText") }));
      return box;
    }
    if (st.kind === "maintain") {
      box.append(el("div", { class: "next-head", text: t("nsMaintain") }),
        el("div", { class: "num", text: reviewReady(s) ? t("reviewReady") : s.nextReview ? t("next", { date: fmtDate(s.nextReview) }) : t("nsNoReview") }));
      return box;
    }
    box.append(el("div", { class: "next-head" }, t("nsTo", { to: st.to }), st.since ? el("span", { class: "muted", text: ` · ${t("nsSince", { date: fmtDate(st.since) })}` }) : null));
    const check = (ok, text) => el("li", { class: ok ? "ok" : "todo" }, el("span", { class: "mark", "aria-hidden": "true", text: ok ? "✓" : "○" }),
      el("span", { class: "sr", text: `${t(ok ? "nsDone" : "nsNotYet")}: ` }), text);
    const checks = [];
    if (st.kind === "rate") {
      const tgt = pct(st.target);
      const track = el("div", { class: "track", role: "img", "aria-label": st.n ? t("nsRate", { ok: st.ok, n: st.n, pct: pct(st.ok / st.n), target: tgt }) : t("nsNoTasks") });
      if (st.n) { const fill = el("div", { class: "fill" }); fill.style.width = pct(st.ok / st.n); track.append(fill); }
      const tick = el("div", { class: "target", "aria-hidden": "true" }); tick.style.left = tgt; track.append(tick);
      box.append(track, el("div", { class: "num", text: st.n ? t("nsRate", { ok: st.ok, n: st.n, pct: pct(st.ok / st.n), target: tgt }) : t("nsNoTasks") }));
      if (st.n) checks.push(check(st.enough, t("nsEnough", { n: Math.min(st.n, 5) })), check(st.rate, t("nsRateCheck", { target: tgt })), check(st.half, t("nsHalf", { low: st.low, n: st.n })));
    } else {
      const label = s.level === "L0" ? "nsL0" : s.level === "L1" ? "nsL1" : "nsL3";
      box.append(el("div", { class: "pips", role: "img", "aria-label": t(label, { have: st.have }) },
        ...Array.from({ length: st.need }, (_, i) => el("span", { class: i < st.have ? "pip on" : "pip" }))),
        el("div", { class: "num", text: t(label, { have: st.have }) }));
      if (s.level === "L3") checks.push(check(st.days >= 2, t("nsDays", { days: Math.min(st.days, 2) })), check(st.transfer, t("nsTransfer")));
    }
    if (checks.length) box.append(el("ul", { class: "checks" }, checks));
    // One line: what it takes from here.
    let todo;
    if (st.met) todo = t("nsMet");
    else if (st.kind === "rate") todo = st.more === 1 ? t("nsMore1") : t("nsMore", { k: st.more });
    else if (s.level === "L0") todo = st.need - st.have === 1 ? t("nsMoreEx1") : t("nsMoreEx", { k: st.need - st.have });
    else if (s.level === "L1") todo = st.need - st.have === 1 ? t("nsMoreGap1") : t("nsMoreGap", { k: st.need - st.have });
    else if (st.solo < 3) todo = (st.need - st.have === 1 ? t("nsMoreSolo1") : t("nsMoreSolo", { k: st.need - st.have })) + (st.days < 2 && st.solo >= 1 ? t("nsOtherDay") : "");
    else if (st.days < 2) todo = t("nsMoreSolo1") + t("nsOtherDay");
    else todo = t("nsDoTransfer", { id: s.id });
    box.append(el("div", { class: st.met ? "next-todo met" : "next-todo", text: todo }));
    return box;
  }

  function skillsCard() {
    const list = el("ul", { class: "skills" });
    for (const main of mains().filter((s) => filter === "all" || s.id === filter)) {
      for (const s of [main, ...microsOf(main.id)]) {
        const st = stats(s);
        const open = detailOpen.has(s.id);
        const row = el("div", { class: "skill-row" },
          el("div", { class: "skill-name" }, el("div", { class: "title" }, s.titles?.[lang] ?? tx(s.title)), el("div", { class: "id", text: s.id })),
          // No tooltip here: the same five explanations 23 times over were noise and a Tab stop each. The legend explains.
          s.placement === "pending" ? el("span", { class: "chip open", text: t("openChip") }) : el("span", { class: `chip lv${LEVELS.indexOf(s.level)}`, text: `${s.level} ${levelName(s.level)}` }),
          nextCell(s),
          el("div", { class: "skill-meta" }, st.pending ? statusBadge("warning", t("open", { n: st.pending })) : null,
            el("span", { class: "muted", text: st.n ? `${t("last10", { ok: st.ok, n: st.n })} (${pct(st.ok / st.n)})` : t("noTasks") }),
            st.skipped ? el("span", { class: "muted", text: t("skippedN", { n: st.skipped }) }) : null,
            el("span", { class: "muted", text: s.lastSeen ? t("lastSeen", { date: fmtDate(s.lastSeen) }) : t("notSeen") })),
          el("button", { type: "button", class: "expand", "aria-expanded": open ? "true" : "false", "aria-controls": `d-${s.id}`, text: open ? t("less") : t("more"),
            onclick: () => { if (detailOpen.has(s.id)) detailOpen.delete(s.id); else detailOpen.add(s.id); render(); } }));
        list.append(el("li", { class: `skill${s.parent ? " micro" : ""}`, id: `s-${s.id}` }, row, open ? el("div", { id: `d-${s.id}` }, skillDetail(s)) : null));
      }
    }
    return card(t("skills"), t("skillsHint"), list, null, "skills");
  }

  function tasksCard() {
    const tasks = liveTasks().filter((x) => inScope(x.skill));
    const days = [...new Set(tasks.map((x) => String(x.at).slice(0, 10)))].sort();
    const per = days.map((d) => {
      const c = { solo: 0, hint: 0, help: 0, pending: 0, skipped: 0 };
      for (const x of tasks) if (String(x.at).slice(0, 10) === d) c[bucketOf(x)]++;
      return { d, c, total: c.solo + c.hint + c.help + c.pending + c.skipped };
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
      const chart = svg("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, role: "group", "aria-label": t("tasksChart") });
      chart.append(svg("defs", {}, svg("pattern", { id: "hatch-skipped", width: 5, height: 5, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" },
        svg("rect", { class: "hatch-bg", width: 5, height: 5 }), svg("line", { class: "hatch-line", x1: 0, y1: 0, x2: 0, y2: 5 }))));
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
        const hit = svg("rect", { class: "hit", x: cx - slot / 2, y: PT, width: slot, height: ph, tabindex: "0", role: "img", "aria-label": `${fmtDate(p.d)}: ${p.total}` });
        withTip(hit, fmtLong(p.d), [...BUCKETS.map(([k, cls, key]) => [cls, String(p.c[k]), t(key)]), [null, String(p.total), t("total")]]);
        chart.append(g, hit);
      });
      body = el("div", {}, chart, legend);
    }
    return card(t("tasksChart"), t("tasksHint"), body, () => table([t("date"), ...BUCKETS.map(([, , key]) => t(key)), t("total")],
      per.map((p) => [fmtLong(p.d), ...BUCKETS.map(([k]) => String(p.c[k])), String(p.total)]), [1, 2, 3, 4, 5, 6]), "tasks");
  }
  function barPath(x, y, w, h, r) {
    r = Math.min(r, w / 2, h);
    return r ? `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z` : `M${x},${y + h}V${y}H${x + w}V${y + h}Z`;
  }

  function signalsCard() {
    const items = [];
    for (const s of data.signals.filter((x) => inScope(x.skill))) {
      items.push({ at: data.generatedAt, icon: s.dir === "up" ? "↑" : "↓", cls: s.dir === "up" ? "good" : "serious", label: s.dir === "up" ? t("signalsUp") : t("signalsDown"), text: s.texts?.[lang] ?? tx(s.text) });
    }
    for (const r of data.regressions.filter((x) => !x.skill || inScope(x.skill))) {
      items.push({ at: r.at, icon: r.fixed ? "↺" : "!", cls: r.fixed ? "good" : "critical", label: r.skill ?? "", text: r.fixed ? t("regressionFixed", { n: r.tests }) : t("regression", { n: r.tests }) });
    }
    for (const o of data.overrides.filter((x) => x.skill === "*" || inScope(x.skill))) {
      items.push({ at: o.at, icon: "⚑", cls: "warning", label: o.skill, text: el("span", {}, t("override", { min: o.minutes }), o.reason ? [": ", tx(o.reason)] : null) });
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
      const chart = svg("svg", { class: "chart", viewBox: `0 0 ${W} ${H}`, role: "group", "aria-label": t("calibration") });
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
        const hit = svg("rect", { class: "hit", x: 0, y: cy - rowH / 2, width: W, height: rowH, tabindex: "0", role: "img", "aria-label": `${fmtDate(p.d.date)}: ${p.b ?? "?"} → ${p.a ?? "?"}` });
        withTip(hit, `${fmtLong(p.d.date)} · ${t("session")} ${p.d.n}`, [[null, String(p.b ?? t("none")), t("before")], [null, String(p.a ?? t("none")), t("after")]]);
        chart.append(hit);
      });
      const legend = el("ul", { class: "legend" }, el("li", {}, el("span", { class: "sw lv0", "aria-hidden": "true" }), t("before")), el("li", {}, el("span", { class: "sw lv4", "aria-hidden": "true" }), t("after")));
      body = el("div", {}, chart, legend);
    }
    return card(t("calibration"), t("calibrationHint"), body, () => table([t("date"), t("session"), t("before"), t("after"), t("calib")],
      rows.map((d) => [fmtDate(d.date), String(d.n), tx(d.confidenceBefore) ?? t("none"), tx(d.reflection?.confidenceAfter) ?? t("none"), tx(d.calibration) ?? t("none")])), "calibration");
  }

  function diaryCard() {
    const rows = data.diary.filter((d) => filter === "all" || String(d.skills ?? "").includes(filter)).slice().reverse();
    const field = (label, value) => (value ? [el("dt", { text: label }), el("dd", {}, value)] : []);
    const list = rows.length ? el("ol", { class: "diary" }, rows.map((d) => el("li", { class: "entry" },
      el("div", { class: "when" }, joinNodes([fmtLong(d.date), `${t("session")} ${d.n}`, tx(d.time), tx(d.skills)].filter(Boolean), " · ")),
      el("dl", {}, field(t("plan"), tx(d.plan)), field(t("wentWell"), tx(d.wentWell)), field(t("learned"), tx(d.reflection?.learned)), field(t("confusing"), tx(d.reflection?.confusing)),
        field(t("confidence"), [d.confidenceBefore, d.reflection?.confidenceAfter].every(Boolean) ? el("span", {}, tx(d.confidenceBefore), " → ", tx(d.reflection.confidenceAfter)) : tx(d.reflection?.confidenceAfter)),
        field(t("nextStep"), tx(d.reflection?.nextStep)), field(t("calib"), tx(d.calibration)))))) : el("p", { class: "muted", text: t("noDiary") });
    return card(t("diary"), t("diaryHint"), list, null, "diary");
  }

  function activityCard() {
    return card(t("activity"), null, table([t("date"), t("sessions"), t("hints"), t("holds"), t("denials"), t("overridesUsed"), t("reviewHelp"), t("helpDropped")],
      data.activity.slice().reverse().map((a) => [fmtDate(a.date), String(a.sessions), String(a.hints), String(a.holds), String(a.denials), String(a.overridesUsed),
        String(a.reviewHelp ?? 0), String(a.helpDropped ?? 0)]), [1, 2, 3, 4, 5, 6, 7]), null, "activity");
  }

  function filters() {
    const select = el("select", { id: "filter", onchange: (e) => { filter = e.target.value; render(); } },
      el("option", { value: "all", text: t("all") }), mains().map((s) => el("option", { value: s.id, text: `${s.id} · ${titleOf(s)}` })));
    select.value = filter;
    return el("div", { class: "filters" }, el("label", { for: "filter", text: t("filter") }), select, el("span", { class: "asof", text: t("asof", { date: asOfLabel() }) }));
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
    $("subtitle").textContent = data ? (data.course ? t("subtitle", { course: txs(data.course), date: asOfLabel() }) : t("subtitleNoCourse", { date: asOfLabel() })) : "";
    // The licence of the setup: AGPL-3.0 or a commercial licence for the code, CC BY-NC 4.0 for texts and data.
    const link = (href, text) => el("a", { href, text });
    $("footer").replaceChildren(el("div", { class: "foot-inner" },
      el("p", {}, t("footAi") + " ", link(t("footAiHref"), t("footAiLink"))),
      el("p", {}, `${t("footCode")}: `, link("https://github.com/piethanegraaf/piethanegraaf.github.io/blob/main/LICENSE", "AGPL-3.0"), ` ${t("footOr")} `,
        link("https://github.com/piethanegraaf/piethanegraaf.github.io#license", t("footCommercial")), ` · ${t("footTexts")}: `, link("https://github.com/piethanegraaf/piethanegraaf.github.io/blob/main/LICENSE-docs", "CC BY-NC 4.0")),
      el("p", {}, link("https://github.com/piethanegraaf/piethanegraaf.github.io", t("footSource")), " · ", link(t("footDocsHref"), t("footDocs")))));
  }

  function render() {
    chrome();
    const main = $("content");
    if (!data) return;
    const notes = [];
    if (fellBack) notes.push(el("p", { class: "notice", text: t("fallback") }));
    if (!fellBack && source !== "demo" && data.language && data.language !== lang) {
      // An export with translations (export.mjs adds them) says so, with one switch to the originals;
      // an older one is in one language.
      if (hasTranslations()) {
        notes.push(el("div", { class: "notice with-action" },
          el("span", { text: t(showOriginal ? "originalShown" : "translated", { language: langName(data.language) }) }),
          el("button", { type: "button", class: "toggle-table", id: "orig-toggle", text: t(showOriginal ? "showTranslation" : "showOriginal"),
            onclick: () => { showOriginal = !showOriginal; render(); $("orig-toggle")?.focus(); } })));
      } else notes.push(el("p", { class: "notice", text: t("ownLanguage", { language: langName(data.language) }) }));
    }
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
      for (const k of ["skills", "tasks", "reviews", "regressions", "overrides", "signals", "activity", "diary", "reviewHelp", "helpDropped", "transfers"]) json[k] = Array.isArray(json[k]) ? json[k] : [];
      for (const x of json.tasks) { x.rejections = x.rejections ?? []; x.corrections = x.corrections ?? []; }
      data = json;
      render();
    } catch {
      data = null;
      chrome();
      $("content").replaceChildren(el("p", { class: "notice", text: t("loadError", { file }) }));
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
  // Esc closes a tooltip (WCAG 1.4.13: content on hover or focus can be dismissed).
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !tip.hidden) hideTip(); });
  load();
})();
