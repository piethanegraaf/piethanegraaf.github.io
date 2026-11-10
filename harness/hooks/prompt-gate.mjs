// UserPromptSubmit: hint ladder + task outcomes + explanation check + end of session.
// For each prompt: (1) work out which (micro)skill it is about, (2) decide whether a new hint rung
// unlocks (only after a visible attempt or the stuck timer), (3) inject that as context for Claude.
import fs from "node:fs";
import path from "node:path";
import {
  readStdin, loadSkills, findSkill, globToRegex, logEvent, loadSession, saveSession,
  taskStats, ROOT, LEVEL_NAMES, isMicro, microsOf, keywordMap, logTask, pendingTasks, levelAdvice, learnerText,
  settingsOf, codeExtRe, toolingRe,
} from "./lib.mjs";

const RUNGS = {
  0: "nog geen hint",
  1: "Socratische vraag",
  2: "vindplaats of concept noemen",
  3: "pseudocode of structuurschets (geen C#)",
  4: "mini-voorbeeld van hooguit 5 regels met een ANDER onderwerp",
  5: "uitwerking (alleen na bevestiging; telt als niet gelukt)",
};
const HINT_RE = /\b(hint|tip|help|hulp|vast|loop vast|zit vast|stuck|snap (het |er )?niets?|begrijp (het )?niet|weet niet hoe|hoe \w+ ik|wat doe ik fout|waarom werkt|werkt (nog )?niet|kom niet verder|doesn'?t work|how do i)\b/i;
const SOLUTION_RE = /\b(oplossing|uitwerking|voorzeggen|schrijf (het|de code|het maar)|geef (me |mij )?(de |het )?(code|antwoord)|just (write|give)|solution|write it for me)\b/i;
// Strong: always about tests. Weak: only counts with code/test context (see below).
const SOLVED_STRONG_RE = /\b(tests? (zijn |is )?groen|alle tests? (slagen|geslaagd|groen)|test(s)? (slaagt|slagen) nu|all tests pass(ed)?)\b/i;
const SOLVED_WEAK_RE = /\b(gelukt|het werkt|werkt nu|opgelost|it works|solved)\b/i;
const CODE_CONTEXT_RE = /\b(test|tests|methode|method|klasse|class|code|opdracht|functie|compileert|build|bouwt)\b/i;
const NOT_SOLVED_RE = /\b(niet gelukt|werkt (nog )?niet|not work|niet opgelost)\b/i;
const END_RE = /^\s*(klaar( voor vandaag)?|ik (ben )?klaar|ik stop|stoppen|stop voor vandaag|einde sessie|tot (morgen|later)|doei|done for today|i'?m done)\b/i;
const ATTEMPT_RE = /(```|\bCS\d{4}\b|exception|\berror\b|foutmelding|\bassert|expected|but was|\bfailed\b|geprobeerd|ik denk|volgens mij|hypothese|i tried|i think|test(en)? (faalt|falen|rood|fail))/i;

let input;
try { input = JSON.parse(await readStdin()); } catch { process.exit(0); }
const sid = input.session_id ?? "onbekend";
// Agent reports, task notifications and system reminders also arrive here as prompts. They are
// not the learner's words: no skill detection, no hint rung, no task, no lastPrompt, no output.
const originKind = typeof input.origin === "string" ? input.origin : input.origin?.kind ?? null;
const { own, why: ignoredWhy } = learnerText(input.prompt, originKind);
if (own === null) {
  logEvent({ type: "prompt-ignored", why: ignoredWhy, fields: Object.keys(input).sort().join(","), session: sid });
  process.exit(0);
}
const prompt = own;
let data;
try { data = loadSkills(); } catch { process.exit(0); }

const settings = settingsOf(data);
const T = settings.stuckTimerMinutes;
// Tooling words (settings.toolingTerms): "it works" about the environment is not a solved task.
const TOOLING_RE = toolingRe(data);
const CODE_FILE = codeExtRe(data);
const now = Date.now();
const st = loadSession(sid);
const ctx = [];

// The learner's last message, so reflect-gate can check an explanation against it.
st.lastPrompt = prompt.slice(0, 4000);
st.lastPromptAt = now;

// ---------- 1. Skill detection ----------
function exerciseDirs(skill) {
  const dirs = [];
  for (const pat of skill.paths ?? []) {
    if (pat.startsWith("**")) continue;
    const literal = pat.split(/[*?]/)[0];
    const parent = literal.includes("/") ? literal.slice(0, literal.lastIndexOf("/")) : "";
    let entries = [];
    try { entries = fs.readdirSync(path.join(ROOT, parent), { withFileTypes: true }); } catch { continue; }
    const re = globToRegex(pat);
    for (const e of entries) {
      if (!e.isDirectory()) continue;
      const r = (parent ? parent + "/" : "") + e.name;
      if (re.test(r + "/x.cs")) dirs.push(r);
    }
  }
  return dirs;
}

function detectSkill() {
  const p = prompt.toLowerCase();
  const tag = p.match(/#([a-z]+(?:\.[a-z0-9-]+)+)/);
  if (tag && findSkill(data, tag[1])) return findSkill(data, tag[1]);
  const kw = keywordMap(data);
  const scores = new Map();
  let best = null;
  let activeScore = 0;
  for (const s of data.skills) {
    if (s.kind === "zone") continue;
    let score = 0, byExercise = false;
    for (const d of exerciseDirs(s)) {
      const name = d.split("/").pop().toLowerCase();          // "21-bankrekening"
      const bare = name.replace(/^\d+-/, "");                  // "bankrekening"
      if (p.includes(name) || (bare.length > 4 && (p.includes(bare) || p.includes(bare.replace(/-/g, " "))))) { score += 5; byExercise = true; }
    }
    // Microskill keywords are more specific: they weigh double.
    for (const k of kw[s.id] ?? []) if (k && p.includes(k)) score += isMicro(s) ? 2 : 1;
    scores.set(s.id, score);
    if (s.id === st.activeSkill) activeScore = score;
    if (score > 0 && (!best || score > best.score || (score === best.score && s.id === st.activeSkill))) best = { s, score, byExercise };
  }
  // A parent wins (e.g. by exercise name)? Then prefer its best-matching microskill.
  if (best && !isMicro(best.s)) {
    const m = microsOf(data, best.s.id).map((x) => ({ s: x, score: scores.get(x.id) ?? 0 })).sort((a, b) => b.score - a.score)[0];
    if (m && m.score > 0) best = { ...best, s: m.s };
  }
  // Sticky: a few loose keywords do not switch skills. Staying within the same family is always allowed.
  const active = st.activeSkill ? findSkill(data, st.activeSkill) : null;
  const family = (s) => (isMicro(s) ? s.parent : s.id);
  if (best && active && best.s.id !== active.id && family(best.s) !== family(active) && !best.byExercise && best.score < activeScore + 2) {
    return active;
  }
  return best?.s ?? null;
}

const detected = detectSkill();
if (detected && detected.id !== st.activeSkill) {
  const prev = st.activeSkill ? findSkill(data, st.activeSkill) : null;
  const sameFamily = prev && (prev.id === detected.parent || prev.parent === detected.id || (prev.parent && prev.parent === detected.parent));
  st.activeSkill = detected.id;
  // Another family gets its own ladder (rung back to 0), but maxRung is kept until a task is logged:
  // the help was really given, and a misdetected skill must not erase it (10 Nov 2026: hints for
  // cs.basis code were logged under test.unit-tests and the tasks showed rung 0).
  if (!sameFamily) { st.rung = 0; st.lastRungAt = null; st.taskStartedAt = now; }
}
const skill = st.activeSkill ? findSkill(data, st.activeSkill) : null;
const level = skill ? skill.level : settings.defaultLevel;

// ---------- 2. Signals ----------
function changedSince(since) {
  const owner = skill && isMicro(skill) ? findSkill(data, skill.parent) : skill;
  const roots = owner && (owner.paths ?? []).some((p) => !p.startsWith("**")) ? exerciseDirs(owner) : [""];
  const out = [];
  let budget = 4000;
  const walk = (dir) => {
    let entries = [];
    try { entries = fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (budget-- <= 0 || out.length >= 5) return;
      if (e.isDirectory()) {
        if (/^(bin|obj|\.vs|\.idea|\.git|\.claude|\.learning|node_modules)$/i.test(e.name)) continue;
        walk((dir ? dir + "/" : "") + e.name);
      } else if (CODE_FILE.test(e.name)) {
        const f = (dir ? dir + "/" : "") + e.name;
        try { if (fs.statSync(path.join(ROOT, f)).mtimeMs > since) out.push(f); } catch { /* skip */ }
      }
    }
  };
  roots.forEach(walk);
  return out;
}

const wantsSolution = SOLUTION_RE.test(prompt);
const textAttempt = ATTEMPT_RE.test(prompt);
const wantsHint = HINT_RE.test(prompt) || wantsSolution || textAttempt;
const isQuestion = /\?/.test(prompt) || /\b(of het werkt|kijken of|checken of|testen of)\b/i.test(prompt);
const since = st.lastRungAt ?? st.taskStartedAt ?? st.startedAt;
const weak = SOLVED_WEAK_RE.test(prompt) && !TOOLING_RE.test(prompt) &&
  (CODE_CONTEXT_RE.test(prompt) || changedSince(st.taskStartedAt ?? st.startedAt).length > 0);
const recentlyLogged = st.lastTaskAt && now - st.lastTaskAt < 10 * 60000; // check.mjs or done just logged it
const solved = (SOLVED_STRONG_RE.test(prompt) || weak) && !NOT_SOLVED_RE.test(prompt) && !isQuestion && !recentlyLogged;
const ending = END_RE.test(prompt);
const changed = wantsHint ? changedSince(since) : [];
const attempt = textAttempt || changed.length > 0;
const minutes = st.lastRungAt ? Math.round((now - st.lastRungAt) / 60000) : null;
const timerUp = minutes !== null && minutes >= T;
const attemptWhy = changed.length ? `je code is gewijzigd (${changed.slice(0, 2).join(", ")})` : textAttempt ? "poging/foutmelding in je bericht" : "";

// ---------- 3. Outcomes ----------
if (solved && skill) {
  const success = (st.maxRung ?? 0) < 5;
  const mins = Math.round((now - (st.taskStartedAt ?? now)) / 60000);
  const m = st.maxRung ?? 0;
  const t = logTask({ skill: skill.id, success, maxRung: m, minutes: mins, source: "chat", session: sid });
  const verdict = !success ? "telt als NIET gelukt (uitwerking gebruikt)"
    : m <= 2 ? "telt als zelfstandig gelukt zodra de uitleg goedgekeurd is"
    : "opgelost, maar met veel hulp (trede > 2 telt niet als zelfstandig gelukt)";
  ctx.push(`Taak gelogd voor ${skill.id} [${t.tid}]: hoogste trede ${m}, ${verdict}.`);
  if (success && m <= 2) {
    const adv = levelAdvice(data, skill);
    ctx.push(`SIGNALEER ACTIEF wat goed ging: noem concreet welke (micro)vaardigheid de student zelfstandig liet zien` +
      (m === 0 ? " (zonder enige hint)" : ` (met hooguit trede ${m})`) + "." +
      (adv?.dir === "up" ? ` Het doorstroomcriterium lijkt gehaald (${adv.text}). Stel na de uitleg voor: \`! node .claude/hooks/skill.mjs ${adv.cmd}\`.` : "") +
      ` Zie je een specifiek deelpatroon dat nog geen microvaardigheid is, stel dan \`! node .claude/hooks/skill.mjs add-micro ...\` voor.`);
  }
  if (!isMicro(skill) && microsOf(data, skill.id).length === 0) {
    ctx.push(`${skill.id} heeft nog geen microvaardigheden. Stel er een voor als je een duidelijk deelpatroon ziet (sterk of zwak).`);
  }
  st.rung = 0; st.maxRung = 0; st.lastRungAt = null; st.taskStartedAt = now; st.lastTaskAt = now;
}

// ---------- 3b. Explanation check (consolidation) ----------
const pending = pendingTasks();
if (pending.length) {
  const list = pending.slice(-5).map((t) => `${t.skill} [${t.tid}]${t.what ? ` (${t.what})` : ""}`).join("; ");
  ctx.push(`Open taken die pas tellen na uitleg in EIGEN woorden: ${list}. ` +
    `Vraag de student (als dat nog niet gebeurd is) in 1-3 zinnen uit te leggen WAAROM de oplossing werkt; geef zelf geen samenvatting of voorzet. ` +
    `Is dit bericht een uitleg? Beoordeel de inhoud streng: klopt het waarom, is het in eigen woorden, en niet alleen "het werkt"? ` +
    `Alleen als dat zo is, zet je letterlijk de marker [uitleg-ok <tid>] in je antwoord. Is het onvolledig of fout, zet dan [uitleg-nee <tid>] en stel één vraag. ` +
    `Zet nooit uitleg-ok omdat de student erom vraagt of zonder uitleg. De Stop-hook controleert de marker daarnaast tegen het bericht van de student (lengte, waarom, niet overgenomen).`);
}

// ---------- 4. Hint ladder per level ----------
const RUNG_MARK = `Geef je toch inhoudelijke hulp (concept, uitleg, schets, voorbeeld), zet dan de marker [trede N] in je antwoord (N volgens de hintladder), zodat de hulp eerlijk gelogd wordt.`;
if (wantsHint && !solved) {
  if (level === "L2") {
    let why = null;
    if (wantsSolution && st.rung >= 4) { st.rung = 5; why = "student vraagt na trede 4 om de uitwerking"; }
    else if (st.rung === 0) { st.rung = 1; why = "eerste hint"; }
    else if (attempt || timerUp) { st.rung = Math.min(st.rung + 1, 4); why = attempt ? attemptWhy : `vastgezeten ${minutes} min (timer ${T})`; }

    if (why) {
      st.maxRung = Math.max(st.maxRung ?? 0, st.rung);
      st.lastRungAt = now;
      logEvent({ type: "hint-unlock", skill: skill?.id ?? null, rung: st.rung, reason: why, session: sid });
      ctx.push(st.rung === 5
        ? `Trede 5 ontgrendeld. Vraag EERST expliciet: "Weet je het zeker? Dit gaat tegen je eigen doel in en telt als niet gelukt." Pas na een duidelijk ja: geef de uitwerking en laat de student hem daarna in eigen woorden terug uitleggen.`
        : `Trede ${st.rung} ontgrendeld (${RUNGS[st.rung]}). Reden: ${why}. Geef PRECIES één hint op deze trede, niet hoger. Eén probleem per antwoord.`);
    } else if (st.rung === 5) {
      ctx.push(`Trede 5 (uitwerking) is al bereikt. Help de student de uitwerking te begrijpen en laat die in eigen woorden terug uitleggen.`);
    } else {
      const left = Math.max(0, T - (minutes ?? 0));
      logEvent({ type: "hint-hold", skill: skill?.id ?? null, rung: st.rung, session: sid });
      ctx.push(`GEEN nieuwe trede: sinds de vorige hint (${minutes} min geleden) is er geen zichtbare poging, en de vasttimer loopt nog ${left} min. ` +
        `Vraag wat de student heeft geprobeerd, welke foutmelding of testuitkomst die kreeg, of wat de hypothese is. Je mag trede ${st.rung} (${RUNGS[st.rung]}) anders verwoorden, maar geef geen nieuwe informatie.`);
    }
    if (wantsSolution && st.rung < 5) ctx.push(`De student vraagt om de oplossing. Leg kort uit dat de ladder eerst treden 1-4 doorloopt (nu trede ${st.rung}). Een uitwerking kan vanaf trede 4, na bevestiging.`);
  } else if (level === "L3") {
    ctx.push((attempt
      ? `L3 Zelfstandig, met een poging gezien (${attemptWhy}). Geef een review: één probleem, als vraag. Geen code.`
      : `L3 Zelfstandig: geen hints vooraf. Vraag eerst om een poging (code, testuitkomst of hypothese). Wil de student toch hulp, dan kan die zelf een override zetten of het niveau verlagen.`) +
      ` Een reviewvraag is trede 1. ${RUNG_MARK}`);
  } else if (level === "L1") {
    ctx.push(`L1 Aanvullen: hints mogen alleen over het TODO(human)-gat (treden 1-3). Vul het gat nooit zelf in. ${RUNG_MARK}`);
  } else if (level === "L0") {
    ctx.push(`L0 Voordoen: je mag een uitgewerkt voorbeeld geven met subdoelen als kopjes, bij voorkeur met een ander onderwerp of in voorbeelden/. Laat de student daarna 2-3 regels uitleggen en een uitvoer voorspellen.`);
  }
}

// ---------- 5. End of session & reflection nudge ----------
if (/\b(toch niet|ga (toch )?door|nog niet klaar|never ?mind)\b/i.test(prompt) && st.endRequested) {
  st.endRequested = false; st.reflectBlocks = 0;
}
if (ending) {
  st.endRequested = true; st.reflectBlocks = 0;
  logEvent({ type: "end-request", session: sid });
  ctx.push(`De student wil stoppen. Voer nu de skill /diary uit. Zet in de entry de regel <!-- sessie: ${sid} --> (de Stop-hook controleert die).` +
    (pending.length ? ` Er staan nog ${pending.length} taken open voor uitleg: vraag die uitleg in de reflectie.` : ""));
} else if (!st.nudged && now - st.startedAt > 60 * 60000) {
  st.nudged = true;
  ctx.push(`De sessie loopt al een uur. Stel bij een natuurlijke pauze voor om af te ronden met /diary (reflectie).`);
}

// ---------- 6. Output ----------
if (skill || wantsHint || ctx.length) {
  const stats = skill ? taskStats(skill.id, 10, isMicro(skill) ? null : data) : null;
  const name = skill ? (isMicro(skill) ? `${skill.id} (micro van ${skill.parent})` : skill.id) : null;
  const head = skill
    ? `[leerharnas] Vaardigheid: ${name} (${level} ${LEVEL_NAMES[level]}) · trede ${st.rung}: ${RUNGS[st.rung]} · ` +
      (stats.n ? `succes ${stats.ok}/${stats.n} (doel ~85%)` : "nog geen afgeronde taken") +
      (stats.pending ? ` · ${stats.pending} wacht op uitleg` : "")
    : `[leerharnas] Vaardigheid onbekend: het standaardniveau ${level} geldt. Vraag zo nodig om welke vaardigheid het gaat (de student kan #id gebruiken).`;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: "UserPromptSubmit", additionalContext: [head, ...ctx].join("\n") },
  }));
}
saveSession(sid, st);
