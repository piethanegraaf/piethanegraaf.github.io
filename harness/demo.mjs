#!/usr/bin/env node
// Demo data for the dashboard: a made-up learner on the OOD map, exported with export.mjs.
//   node harness/demo.mjs            writes site-src/dashboard/data/demo.nl.json and demo.en.json
// Deterministic (seeded), so the files only change when this script changes. Everything is made up.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HARNESS = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(HARNESS, "..", "site-src", "dashboard", "data");
const ANCHOR = "2026-11-10";

const TEXT = {
  nl: {
    course: "Object-Oriented Design (C#)",
    notes: { down: "vast op void-methoden", up: "5/6 gelukt", micro: "aangemaakt", review: "herhalingen starten", placement: "plaatsing: hoogste trede 2 bij de eerste taak", auto: "automatisch: 0 van 3 gelukt (0%), laatste 2 niet" },
    micro: { "cs.basis.lussen": "lusgrenzen", "ood.klassen.veld-vs-lokaal": "veld vs lokale variabele", "ood.overerving.base-ctor": "constructor van de basisklasse" },
    explanations: [
      "De test faalde omdat mijn lus bij 1 begon, daardoor sloeg ik het eerste element over. Nu begint hij bij 0.",
      "Het werkt nu omdat de property een private set heeft, zodat alleen de klasse zelf de waarde kan veranderen.",
      "Ik moest base(naam) aanroepen, anders kreeg de basisklasse geen naam mee en bleef die leeg in de test.",
      "De lijst stond eerst als lokale variabele in de methode, daardoor was hij na elke aanroep weer leeg.",
      "Ik gooi nu een ArgumentException als de prijs negatief is, zodat een ongeldig object niet kan bestaan.",
      "Ik gebruik een Dictionary omdat ik op code wil zoeken in plaats van door de hele lijst te lopen.",
    ],
    rejections: ["te kort (7 woorden, minimaal 12 buiten code)", "geen waarom (gebruik bv. 'omdat', 'doordat', 'zodat', 'anders')"],
    corrections: ["er was meer hulp in de chat dan gelogd", "hint van een medestudent gekregen"],
    voidReason: "herstel van een eigen regressie, geen nieuwe taak",
    override: "tooling: de SDK opnieuw installeren",
    sessions: [
      ["opdracht 01 en 02 afmaken", "2", "lussen werken nu, ook met een while", "het verschil tussen return en Console.WriteLine", "3", "strings oefenen", "vooraf 2 → lukte met trede ≤1 → onderschat"],
      ["klassen met properties (05, 06)", "3", "private set gebruiken voor velden die niet van buiten mogen veranderen", "waarom mijn veld steeds leeg was", "3", "constructors", "vooraf 3 → twee keer trede 2 → klopt"],
      ["overerving (09)", "4", "base() aanroepen in de constructor", "abstract tegenover virtual", "3", "nog een overervingsopdracht", "vooraf 4 → trede 3 nodig → overschat"],
      ["associaties (10, 11)", "3", "een lijst van objecten in een klasse bijhouden", "wie de lijst moet aanmaken", "4", "aggregatie", "vooraf 3 → zelfstandig gelukt → onderschat"],
      ["herhaling C#-basis en encapsulatie", "3", "validatie in de setter met een exception", "welke exception je kiest", "4", "unit tests schrijven", "vooraf 3 → herhaling geslaagd → klopt"],
      ["unit tests met grenswaarden", "2", "grenswaarden testen: net onder, op en net boven de grens", "TestCase met meerdere waarden", "3", "testplan maken", "vooraf 2 → trede 1 → onderschat"],
    ],
    wentWell: "de foutmelding zelf gelezen en opgelost",
  },
  en: {
    course: "Object-Oriented Design (C#)",
    notes: { down: "stuck on void methods", up: "5/6 solved", micro: "created", review: "reviews start", placement: "placement: highest rung 2 at the first task", auto: "automatic: 0 of 3 solved (0%), last 2 not" },
    micro: { "cs.basis.lussen": "loop bounds", "ood.klassen.veld-vs-lokaal": "field vs local variable", "ood.overerving.base-ctor": "base class constructor" },
    explanations: [
      "The test failed because my loop started at 1, so I skipped the first element. Now it starts at 0.",
      "It works now because the property has a private set, so only the class itself can change the value.",
      "I had to call base(name), otherwise the base class got no name and it stayed empty in the test.",
      "The list was a local variable in the method first, so it was empty again after every call.",
      "I now throw an ArgumentException when the price is negative, so an invalid object cannot exist.",
      "I use a Dictionary because I want to look things up by code instead of walking the whole list.",
    ],
    rejections: ["too short (7 words, at least 12 outside code)", "no why (use e.g. 'because', 'so that', 'otherwise', 'instead of')"],
    corrections: ["there was more help in the chat than logged", "got a hint from a classmate"],
    voidReason: "repair of my own regression, not a new task",
    override: "tooling: reinstalling the SDK",
    sessions: [
      ["finish exercises 01 and 02", "2", "loops work now, also with a while", "the difference between return and Console.WriteLine", "3", "practise strings", "before 2 → solved with rung ≤1 → underestimated"],
      ["classes with properties (05, 06)", "3", "using a private set for fields that must not change from outside", "why my field was always empty", "3", "constructors", "before 3 → rung 2 twice → right"],
      ["inheritance (09)", "4", "calling base() in the constructor", "abstract versus virtual", "3", "another inheritance exercise", "before 4 → needed rung 3 → overestimated"],
      ["associations (10, 11)", "3", "keeping a list of objects in a class", "who should create the list", "4", "aggregation", "before 3 → solved independently → underestimated"],
      ["review C# basics and encapsulation", "3", "validation in the setter with an exception", "which exception to choose", "4", "writing unit tests", "before 3 → review passed → right"],
      ["unit tests with boundary values", "2", "testing boundaries: just below, on and just above", "TestCase with several values", "3", "make a test plan", "before 2 → rung 1 → underestimated"],
    ],
    wentWell: "read the error message and fixed it myself",
  },
};

function rng(seed) { // mulberry32
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let x = Math.imul(seed ^ (seed >>> 15), 1 | seed); x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x; return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
}
const day = (offset) => { const d = new Date(`${ANCHOR}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0, 10); };
const at = (offset, hh, mm = 0) => `${day(offset)}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00.000Z`;

function makeProject(lang) {
  const X = TEXT[lang];
  const random = rng(lang === "nl" ? 42 : 42);
  const map = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", "ood", "skills.json"), "utf8"));
  const pick = (v) => (v && typeof v === "object" ? v[lang] ?? v.nl : v);
  const level = {
    "cs.basis": "L3", "ood.klassen-properties": "L3", "ood.overerving": "L2", "ood.associaties": "L2", "ood.aggregatie-compositie": "L1",
    "ood.encapsulatie": "L2", "test.unit-tests": "L2", "ood.interfaces": "L1", "ood.exceptions": "L2", "ood.generics-dictionary": "L0",
    "pattern.strategy": "L0", "pattern.factory": "L0", "pattern.observer": "L0", "debug.zonder-foutmelding": "L1", "uml.klassendiagram": "L2",
  };
  const skills = map.skills.map((s) => ({ ...s, title: pick(s.title), level: s.kind === "zone" ? s.level : level[s.id] ?? "L2" }));
  const find = (id) => skills.find((s) => s.id === id);
  find("cs.basis").history = [{ at: day(-12), from: "L2", to: "L3", note: X.notes.up }];
  find("ood.klassen-properties").history = [{ at: day(-6), from: "L2", to: "L3", note: X.notes.up }];
  find("test.unit-tests").history = [{ at: day(-2), from: "L1", to: "L2", note: X.notes.up }];
  // A new skill placed by its first task (S4); uml.klassendiagram has no tasks yet: placement open.
  find("ood.exceptions").history = [{ at: day(-3), from: "L0", to: "L2", note: X.notes.placement, placement: true }];
  const micros = [
    // Reviews only at L4, through real work (S2).
    { id: "cs.basis.lussen", parent: "cs.basis", level: "L4", nextReview: day(2), intervalIndex: 3 },
    { id: "ood.klassen.veld-vs-lokaal", parent: "ood.klassen-properties", level: "L2" },
    { id: "ood.overerving.base-ctor", parent: "ood.overerving", level: "L0" },
  ];
  for (const m of micros) {
    const i = skills.findIndex((s) => s.id === m.parent);
    const history = m.id === "ood.overerving.base-ctor"
      ? [{ at: day(-10), to: "L1", note: X.notes.micro }, { at: day(-7), from: "L1", to: "L0", note: X.notes.auto, auto: true }]
      : m.id === "cs.basis.lussen" ? [{ at: day(-10), to: "L3", note: X.notes.micro }, { at: day(-8), from: "L3", to: "L4", note: X.notes.up }]
        : [{ at: day(-10), to: m.level, note: X.notes.micro }];
    skills.splice(i + 1, 0, { ...m, title: X.micro[m.id], keywords: [], placement: "done", history });
  }

  // Tasks over two weeks, mostly explained, with some rejections, corrections and one voided task.
  const plan = [
    [-13, "cs.basis", [0, 1, 1]], [-12, "cs.basis.lussen", [0, 0]], [-10, "ood.klassen-properties", [2, 1, 0]],
    [-9, "ood.klassen.veld-vs-lokaal", [2, 3]], [-8, "ood.overerving", [3, 2]], [-7, "ood.overerving.base-ctor", [3, 5]],
    [-6, "ood.klassen-properties", [0, 1]], [-5, "ood.associaties", [1, 2, 0]], [-4, "ood.encapsulatie", [1, 0]],
    [-3, "ood.exceptions", [2, 1]], [-2, "test.unit-tests", [1, 0, 1]], [-1, "ood.associaties", [0, 1]], [0, "test.unit-tests", [1, 0]],
  ];
  const events = [];
  const sid = (offset) => `demo-sessie-${100 + offset}`;
  let n = 0;
  for (const [offset, skill, rungs] of plan) {
    for (const [k, rung] of rungs.entries()) {
      n++;
      const tid = `demo${String(n).padStart(3, "0")}`;
      const base = 13 + k;
      for (let r = 1; r <= Math.min(rung, 4); r++) events.push({ at: at(offset, base - 1, r * 5), type: "hint-unlock", skill, rung: r, reason: "demo", session: sid(offset) });
      if (random() < 0.3) events.push({ at: at(offset, base - 1, 40), type: "hint-hold", skill, rung: Math.max(1, rung), session: sid(offset) });
      events.push({ at: at(offset, base), type: "task", tid, skill, success: rung < 5, maxRung: rung, minutes: 10 + Math.round(random() * 30), source: random() < 0.75 ? "check" : "done", what: `Test${String.fromCharCode(64 + ((n % 26) || 26))}`, session: sid(offset) });
      if (offset === 0 && k === 1) continue; // still waiting for an explanation
      if (offset === -1 && k === 1) { // not explained right away: lapsed when the next exercise started (S1)
        events.push({ at: at(offset, base + 2), type: "task-lapsed", tid, skill, reason: "other-exercise", session: sid(offset) });
        continue;
      }
      if (random() < 0.3) events.push({ at: at(offset, base, 5), type: "explain-rejected", tid, by: random() < 0.5 ? "hook" : "claude", reasons: [X.rejections[n % 2]], session: sid(offset) });
      events.push({ at: at(offset, base, 10), type: "task-explained", tid, skill, text: X.explanations[n % X.explanations.length], session: sid(offset) });
      if (n === 5 || n === 17) events.push({ at: at(offset, base, 30), type: "task-correct", tid, skill, from: rung, maxRung: Math.min(5, rung + 1), reason: X.corrections[n % 2] });
    }
  }
  events.push({ at: at(-9, 16), type: "deny", tool: "Write", session: sid(-9) }, { at: at(-8, 16), type: "deny", tool: "Bash", session: sid(-8) });
  events.push({ at: at(-8, 15), type: "regression", tests: ["A", "B"], dir: "ood-opdrachten-01/09-studenten-docenten", session: sid(-8) });
  events.push({ at: at(-8, 15, 30), type: "regression-fixed", tests: ["A", "B"], dir: "ood-opdrachten-01/09-studenten-docenten", session: sid(-8) });
  events.push({ at: at(-5, 15, 50), type: "task", tid: "demo900", skill: "ood.associaties", success: true, maxRung: 0, source: "check", what: "TestHerstel", session: sid(-5) });
  events.push({ at: at(-5, 15, 55), type: "task-void", tid: "demo900", skill: "ood.associaties", reason: X.voidReason });
  events.push({ at: at(-3, 12), type: "override", skill: "test.unit-tests", minutes: 20, reason: X.override });
  events.push({ at: at(-3, 12, 5), type: "override-used", skill: "test.unit-tests", session: sid(-3) });
  // L4 reviews as the outcome of the next task in real work (S2), and one automatic demotion (S3).
  events.push({ at: at(-6, 10), type: "review", skill: "cs.basis.lussen", result: "pass", nextReview: day(-1), auto: true });
  events.push({ at: at(-1, 10), type: "review", skill: "cs.basis.lussen", result: "shaky", nextReview: day(2), auto: true });
  events.push({ at: at(-7, 16), type: "level", skill: "ood.overerving.base-ctor", from: "L1", to: "L0", auto: true, by: "harnas", reason: X.notes.auto });
  events.push({ at: at(-3, 13), type: "placement", skill: "ood.exceptions", rung: 2, from: "L0", to: "L2" });
  events.sort((a, b) => a.at.localeCompare(b.at));

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "leerharnas-demo-"));
  const learn = path.join(root, ".learning");
  fs.mkdirSync(path.join(learn, "state"), { recursive: true });
  fs.mkdirSync(path.join(learn, "diary"), { recursive: true });
  fs.writeFileSync(path.join(learn, "skills.json"), JSON.stringify({ settings: { ...map.settings, course: X.course, language: lang, examDate: "2027-01-20" }, skills }, null, 2));
  fs.writeFileSync(path.join(learn, "state", "events.jsonl"), events.map((e) => JSON.stringify(e)).join("\n") + "\n");
  const sessionDays = [-13, -10, -8, -5, -4, -2];
  X.sessions.forEach(([planText, before, learned, confusing, after, next, calib], i) => {
    const d = sessionDays[i];
    const heading = lang === "nl"
      ? `## Sessie 1 · 13:00–14:30 · ${plan.find((p) => p[0] === d)?.[1] ?? "cs.basis"}\n<!-- sessie: ${sid(d)} -->\n\n**Plan (student):** ${planText} · zelfvertrouwen vooraf: ${before}\n\n**Wat ging goed (zelfstandig):**\n- ${X.wentWell}\n\n**Reflectie (eigen woorden):**\n1. *Geleerd:* ${learned}\n2. *Verwarrend / anders:* ${confusing}\n3. *Zelfvertrouwen nu:* ${after} · *Volgende stap:* ${next}\n\n**Kalibratie:** ${calib}\n`
      : `## Session 1 · 13:00–14:30 · ${plan.find((p) => p[0] === d)?.[1] ?? "cs.basis"}\n<!-- session: ${sid(d)} -->\n\n**Plan (learner):** ${planText} · confidence before: ${before}\n\n**What went well (independently):**\n- ${X.wentWell}\n\n**Reflection (own words):**\n1. *Learned:* ${learned}\n2. *Confusing / different:* ${confusing}\n3. *Confidence now:* ${after} · *Next step:* ${next}\n\n**Calibration:** ${calib}\n`;
    fs.writeFileSync(path.join(learn, "diary", `${day(d)}.md`), `# ${day(d)}\n\n${heading}`);
  });
  return root;
}

const target = process.argv.includes("--lang") ? [process.argv[process.argv.indexOf("--lang") + 1]] : null;
if (target) {
  // Child process: one language per process, because export.mjs loads lib.mjs for one data folder.
  const lang = target[0];
  const root = makeProject(lang);
  try {
    const { build } = await import("./export.mjs");
    const { out } = await build(root);
    out.generatedAt = ANCHOR;
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(path.join(OUT_DIR, `demo.${lang}.json`), JSON.stringify(out, null, 2) + "\n");
    console.log(`demo.${lang}.json: ${out.skills.length} vaardigheden, ${out.tasks.length} taken, ${out.diary.length} dagboeksessies`);
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
} else {
  for (const lang of ["nl", "en"]) {
    const r = spawnSync(process.execPath, [fileURLToPath(import.meta.url), "--lang", lang], { stdio: "inherit" });
    if (r.status !== 0) process.exit(r.status ?? 1);
  }
}
