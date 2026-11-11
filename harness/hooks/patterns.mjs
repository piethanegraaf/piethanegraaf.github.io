// Recognition patterns for prompts and explanations. Dutch and English are ALWAYS both active,
// whatever settings.language says: learners mix languages, and a setting must never hide a signal.
// To support another language, add its alternatives here (and a test in test/patterns.test.mjs).
const any = (...alternatives) => new RegExp(alternatives.map((a) => `(?:${a})`).join("|"), "i");

// Asking for help.
export const HINT = any(
  String.raw`\b(hint|tip|help|hulp|vast|loop vast|zit vast|snap (het |er )?niets?|begrijp (het )?niet|weet niet hoe|hoe \w+ ik|wat doe ik fout|waarom werkt|werkt (nog )?niet|kom niet verder)\b`,
  String.raw`\b(stuck|i'?m stuck|doesn'?t work|how do i|i don'?t (get|understand)|no idea how|what am i doing wrong|why (does|doesn'?t|isn'?t) (it|this|my)|not working|can'?t figure( it)? out|confused)\b`,
);

// Asking for the solution itself.
export const SOLUTION = any(
  String.raw`\b(oplossing|uitwerking|voorzeggen|schrijf (het|de code|het maar)|geef (me |mij )?(de |het )?(code|antwoord))\b`,
  String.raw`\b(just (write|give)|solution|write it for me|give me the (code|answer)|show me the (code|answer|solution)|write the code|do it for me)\b`,
);

// Solved, strong: always about tests.
export const SOLVED_STRONG = any(
  String.raw`\b(tests? (zijn |is )?groen|alle tests? (slagen|geslaagd|groen)|test(s)? (slaagt|slagen) nu)\b`,
  String.raw`\b(all (the )?tests (pass|passed|are green|are passing)|tests? (are |is )?(green|passing)( now)?|the tests? pass(es)? now)\b`,
);

// Solved, weak: only counts with code or test context.
export const SOLVED_WEAK = any(
  String.raw`\b(gelukt|het werkt|werkt nu|opgelost)\b`,
  String.raw`\b(it works|solved|works now|it'?s working|got it working|fixed it)\b`,
);

export const CODE_CONTEXT = any(
  String.raw`\b(test|tests|methode|klasse|code|opdracht|functie|compileert|build|bouwt)\b`,
  String.raw`\b(method|class|function|exercise|assignment|compiles)\b`,
);

export const NOT_SOLVED = any(
  String.raw`\b(niet gelukt|werkt (nog )?niet|niet opgelost)\b`,
  String.raw`\b(not work|doesn'?t work|still (fails|failing|broken)|not (solved|fixed|working))\b`,
);

// The learner wants to stop (at the start of the message).
export const END = any(
  String.raw`^\s*(klaar( voor vandaag)?|ik (ben )?klaar|ik stop|stoppen|stop voor vandaag|einde sessie|tot (morgen|later)|doei)\b`,
  String.raw`^\s*(done for today|i'?m done|that'?s (it|all) for today|i'?m (finished|stopping)|stop for today|end (of )?(the )?session|see you( tomorrow| later)?|bye)\b`,
);

// The learner takes the stop request back.
export const RESUME = any(
  String.raw`\b(toch niet|ga (toch )?door|nog niet klaar)\b`,
  String.raw`\b(never ?mind|not done yet|keep going|let'?s continue|actually,? no)\b`,
);

// A visible attempt in the message: code, an error, a test outcome or a hypothesis.
export const ATTEMPT = any(
  String.raw`\x60\x60\x60|\bCS\d{4}\b|exception|\berror\b|\bassert|expected|but was|\bfailed\b`,
  String.raw`foutmelding|geprobeerd|ik denk|volgens mij|hypothese|test(en)? (faalt|falen|rood)`,
  String.raw`\bi tried\b|\bi think\b|my guess|maybe it'?s|hypothesis|\bi changed\b|stack ?trace|tests? (fail|fails|failing|is red|are red)`,
);

// New skill, placement open (setup review S4): only these signals raise a rung, never the clock.
// The learner says they are stuck.
export const STUCK = any(
  String.raw`\b(zit vast|loop vast|ik weet niet hoe|weet niet hoe ik|kom niet verder|snap (het |er )?niets?|ik snap het niet)\b`,
  String.raw`\b(i'?m stuck|i am stuck|no idea how|can'?t figure( it)? out|i don'?t know how|i'?m lost)\b`,
);
// The learner admits not knowing the concept (e.g. "weet ik niet" to a Socratic question).
export const DONT_KNOW = any(
  String.raw`\b(weet ik niet|geen idee|ken ik niet|nooit van gehoord|wat (is|betekent) (een |dat |dit )?\w+\s*\?)`,
  String.raw`\b(i don'?t know|no idea|never heard of|what (is|does) (a |an |that |this )?\w+( mean)?\s*\?)`,
);
// The learner asks for more explanation (allowed straight to a higher rung, after an own attempt).
export const MORE_EXPLANATION = any(
  String.raw`\b(meer uitleg|leg (het |dit |dat )?(eens |maar )?uit|uitleg (graag|aub|alsjeblieft)|kun je (het |dit )?uitleggen)\b`,
  String.raw`\b(explain (it|this|that)( to me)?|more explanation|can you explain|explain more|more detail)\b`,
);
// A comparable signature of an error or test outcome: compiler codes, exception types, Expected/But was.
export function errorSignature(text) {
  const s = String(text ?? "");
  const parts = new Set([...s.matchAll(/\bCS\d{4}\b/g)].map((m) => m[0]));
  for (const m of s.matchAll(/\b(\w+Exception)\b/g)) parts.add(m[1]);
  const eb = s.match(/Expected:?\s*([^\s,;]+)[\s\S]{0,80}?But was:?\s*([^\s,;]+)/i);
  if (eb) parts.add(`${eb[1]}≠${eb[2]}`);
  return parts.size ? [...parts].sort().join("|") : null;
}

// A question about whether something works ("is it solved?" is not "it is solved").
export const CHECKING = any(
  String.raw`\b(of het werkt|kijken of|checken of|testen of)\b`,
  String.raw`\b(whether it works|check (if|whether)|see if|test (if|whether))\b`,
);

// A "why" in an explanation.
export const CAUSAL = any(
  String.raw`\b(omdat|want|doordat|zodat|daardoor|waardoor|daarom|dus|anders|in plaats van)\b`,
  String.raw`\b(because|since|so that|otherwise|instead of|therefore|which means|that'?s why|due to|as a result|hence)\b`,
);

// The learner's answer to a promotion proposal (setup review §9.6). Only the learner's own prompt
// counts, and only at its start: "ja, doorzetten" (optionally with the skill id) confirms. A bare
// "nee" or "later" declines, but prompt-gate only listens for that right after a proposal.
const PROMOTE_YES = any(
  String.raw`^\s*ja,?\s+(doorzetten|zet\s+(het\s+|maar\s+)?door)\b`,
  String.raw`^\s*yes,?\s+(promote|go up)\b`,
);
const PROMOTE_NO = any(
  String.raw`^\s*(nee|later|nee,?\s+later|nee,?\s+niet\s+doorzetten|niet\s+doorzetten|nog\s+niet)[\s.!]*$`,
  String.raw`^\s*(no|not now|no,?\s+later|not yet|don'?t promote)[\s.!]*$`,
);
const SKILL_ID = /#?\b([a-z][a-z0-9-]*(?:\.[a-z0-9-]+)+)\b/i;
export function promotionAnswer(text) {
  const s = String(text ?? "");
  if (PROMOTE_YES.test(s)) return { answer: "yes", id: s.match(SKILL_ID)?.[1]?.toLowerCase() ?? null };
  if (PROMOTE_NO.test(s)) return { answer: "no", id: null };
  return null;
}

// Markers Claude puts in an answer. Both languages are accepted.
export const RUNG_MARK = /\[(?:trede|rung) ([1-5])\]/gi;
export const EXPLAIN_MARK = /\[(?:uitleg|explain)-(ok|nee|no) ([a-z0-9]+)\]/gi;
// The transfer task of /mastery-check (§9.4): start, passed or not passed, with the skill id.
export const TRANSFER_MARK = /\[transfer-(start|ok|nee|no) ([a-z][a-z0-9-]*(?:\.[a-z0-9-]+)*)\]/gi;
// The diary marker <!-- sessie: <id> --> (or <!-- session: <id> -->).
export const sessionMarker = (sid) => new RegExp(`(?:sessie|session):\\s*${String(sid).replace(/[^\w-]/g, "")}(?![\\w-])`, "i");
