// SessionStart: put the skill record, due reviews, open explanations, positive signals
// and the session ritual into Claude's context.
import fs from "node:fs";
import {
  readStdin, loadSkills, loadOverrides, today, taskStats, LEVEL_NAMES, DIARY_DIR,
  isMicro, dueReviews, pendingTasks, recentWins, levelAdvice,
} from "./lib.mjs";

let input = {};
try { input = JSON.parse(await readStdin()); } catch { /* ignore */ }
const source = input.source ?? "startup";

let data;
try { data = loadSkills(); } catch (e) {
  process.stdout.write(JSON.stringify({
    systemMessage: "Leerharnas: .learning/skills.json is onleesbaar. Alle projectcode wordt als L2 behandeld tot dit hersteld is.",
    hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: "LEERHARNAS: skills.json kon niet gelezen worden (" + e.message + "). Behandel alle code als L2 en vraag de student het bestand te herstellen." },
  }));
  process.exit(0);
}

const t = today();
const skills = data.skills.filter((s) => s.kind !== "zone");
const due = dueReviews(data, t);
const overrides = loadOverrides();
const pending = pendingTasks();
const wins = recentWins(data);
const advice = skills.map((s) => levelAdvice(data, s)).filter(Boolean);
const exam = data.settings.examDate;
const daysToExam = exam ? Math.round((Date.parse(exam) - Date.parse(t)) / 86400000) : null;

let lastDiary = null;
try {
  lastDiary = fs.readdirSync(DIARY_DIR).filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)).sort().pop() ?? null;
} catch { /* no diary yet */ }

const rate = (s) => { const x = taskStats(s.id, 10, isMicro(s) ? null : data); return (x.n ? `${x.ok}/${x.n}` : "-") + (x.pending ? ` (+${x.pending} open)` : ""); };
const rows = data.skills.map((s) =>
  `| ${isMicro(s) ? "↳ " : ""}${s.id} | ${s.title} | ${s.level} ${LEVEL_NAMES[s.level]} | ${rate(s)} | ${isMicro(s) ? `(van ${s.parent}) ${(s.keywords ?? []).join(", ")}` : (s.paths ?? []).join(", ") || "-"} | ${s.nextReview ?? "-"} |`).join("\n");

const steps = [];
if (due.length) steps.push(`Meld de herhalingen van vandaag (${due.map((s) => s.id).join(", ")}) en bied aan er eerst één te doen: een korte ophaaloefening zonder hulp (~5 min), met een ander onderwerp dan eerder. Daarna geeft de student zelf \`review <id> pass|shaky|fail\` op.`);
if (pending.length) steps.push(`Er wachten ${pending.length} taken op uitleg in eigen woorden (${pending.map((x) => `${x.skill} [${x.tid}]`).join(", ")}). Vraag die uitleg; ze tellen pas daarna.`);
if (wins.length || advice.length) steps.push(`Signaleer kort wat goed gaat` + (wins.length ? ` (zelfstandig gelukt: ${wins.map((w) => `${w.id} ${w.n}x`).join(", ")})` : "") +
  (advice.length ? `, en noem de doorstroom-signalen met commando: ${advice.map((a) => `${a.text} → \`! node .claude/hooks/skill.mjs ${a.cmd}\``).join("; ")}` : "") + ".");
steps.push("Vraag: wat is je doel vandaag, welke vaardigheid hoort erbij, en hoe zeker ben je (1-5)?");

const ritual = source === "startup" || source === "clear"
  ? `Begin deze sessie zo (kort, in één bericht):\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}\nWacht op het antwoord voordat je inhoudelijk begint.`
  : "Sessie hervat of gecomprimeerd: vraag niet opnieuw naar het plan, maar houd je aan de niveaus hieronder.";

const ctx = `LEERHARNAS ACTIEF (zie CLAUDE.md voor de volledige regels). Vandaag: ${t}.` +
  (exam ? ` Toets/assessment: ${exam} (nog ${daysToExam} dagen).` : " Geen toetsdatum ingesteld (student: `! node .claude/hooks/skill.mjs setting examDate JJJJ-MM-DD`).") + `
Standaardniveau voor code die niet gekoppeld is: ${data.settings.defaultLevel}. Herhalingen: Fibonacci-intervallen (1, 2, 3, 5, 8, 13, 21 ... dagen) vanaf L3.

| id | vaardigheid | niveau | gelukt (≤ trede 2, laatste 10) | paden / trefwoorden | volgende herhaling |
|---|---|---|---|---|---|
${rows}

Actieve overrides: ${overrides.length ? overrides.map((o) => `${o.skill} tot ${o.until} (${o.reason})`).join("; ") : "geen"}.
Laatste dagboekbestand: ${lastDiary ?? "nog geen"}.

${ritual}

Sluit af met /diary als de student stopt of "klaar" zegt.`;

const msg = `Leerharnas: ${skills.length} vaardigheden` +
  (due.length ? ` · ${due.length} herhaling(en) vandaag: ${due.map((s) => s.id).join(", ")}` : " · geen herhalingen vandaag") +
  (pending.length ? ` · ${pending.length} uitleg open` : "") +
  (overrides.length ? ` · ${overrides.length} override actief` : "");

process.stdout.write(JSON.stringify({
  systemMessage: msg,
  hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: ctx },
}));
