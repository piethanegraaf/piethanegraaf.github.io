#!/usr/bin/env node
// Security check before anything goes online. Runs locally (pre-push hook) and in CI.
// Every finding gets one of three outcomes: BLOKKEER (block), TWIJFEL (doubt: a person decides) or OK.
//
//   node harness/security-check.mjs                     working tree (tracked + new, not ignored)
//   node harness/security-check.mjs --range A..B        also every commit in A..B (contents, file names, e-mails)
//   node harness/security-check.mjs --pre-push          as a git pre-push hook (reads the refs from stdin)
//   node harness/security-check.mjs --site site         also the built site (external scripts, CSP)
//   node harness/security-check.mjs --install-hook      installs .git/hooks/pre-push (with a backup)
//
// Exit code 1 when there is any BLOKKEER or TWIJFEL. A TWIJFEL becomes OK only through an entry with a
// reason in .security-allowlist.json (a decision by a person, visible in the diff). BLOKKEER cannot be allowed.
// Private terms come from .learning/private.json in the repo (git-ignored) or from LEERHARNAS_PRIVATE=<file>.
// No network, no shell: git is called with an argument list.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const git = (args, opts = {}) => execFileSync("git", args, { cwd: ROOT, encoding: opts.buffer ? undefined : "utf8", maxBuffer: 256 * 1024 * 1024, stdio: ["pipe", "pipe", "pipe"], ...opts });
let ROOT = path.resolve(HERE, "..");
try { ROOT = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: HERE, encoding: "utf8" }).trim(); } catch { /* not a git checkout */ }

const B = "BLOKKEER", T = "TWIJFEL", OK = "OK";

// ---------- Configuration ----------
function readJson(p) { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; } }
const allow = readJson(path.join(ROOT, ".security-allowlist.json")) ?? { entries: [], commitEmails: [] };
const privFile = process.env.LEERHARNAS_PRIVATE ?? path.join(ROOT, ".learning", "private.json");
const priv = readJson(privFile) ?? {};
const privateTerms = [...(Array.isArray(priv.terms) ? priv.terms : []), ...Object.keys(priv.replace ?? {})].filter((x) => typeof x === "string" && x.trim().length >= 2);
let userEmail = "";
try { userEmail = git(["config", "user.email"]).trim(); } catch { /* none */ }
const userName = os.userInfo().username;
// In CI the logs are public: never print a found value there, and skip the checks on the
// local user name (on a runner that is an account such as "runner", not a person).
const CI_MODE = Boolean(process.env.CI) || process.argv.includes("--ci");
const shown = (value) => (CI_MODE ? "[verborgen in CI]" : value);

const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const ALLOWED_EMAIL = /@(example\.(com|org|net)|users\.noreply\.github\.com)$|^(noreply@anthropic\.com|noreply@github\.com)$/i;
const globRe = (g) => new RegExp("^" + g.split("**").map((p) => p.split("*").map(escapeRe).join("[^/]*")).join(".*") + "$");

// ---------- Rules on file names ----------
const ALLOWED_EXT = new Set(["md", "mjs", "js", "cjs", "json", "yml", "yaml", "html", "css", "txt", "svg"]);
const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp", "ico", "avif"]);
const ALLOWED_NAMES = /^(LICENSE(-docs)?|\.gitignore|\.gitkeep|\.gitattributes|CNAME|\.nojekyll)$/;

function nameRules(file) {
  const out = [];
  const base = path.posix.basename(file);
  const ext = base.includes(".") ? base.split(".").pop().toLowerCase() : "";
  const add = (level, rule, detail) => out.push({ level, rule, file, line: null, detail });
  if (/(^|\/)\.env(\..*)?$/i.test(file)) add(B, "file.env", ".env-bestand");
  if (/(^|\/)\.learning\//.test(file)) add(B, "file.learning", "ruwe leerdata (.learning/)");
  if (/(^|\/)(events\.jsonl|tests\.json|overrides\.json|private\.json)$|(^|\/)session-[^/]*\.json$/i.test(file)) add(B, "file.state", "state van de harnas");
  if (/peerfeedback/i.test(base)) add(B, "file.peer", "peerfeedback (bevat de naam van een medestudent)");
  if (/toets|beoordelingsformulier|minicasus|lesopdracht|diagnostische|exam-prep/i.test(base)) add(B, "file.course", "lijkt materiaal van een docent of toets");
  if (/\.(pdf|docx?|xlsx?|pptx?|zip|7z|rar|drawio|jsonl|trx|sqlite|db)$/i.test(base)) add(B, "file.type", `verboden bestandstype .${ext}`);
  else if (IMAGE_EXT.has(ext)) add(T, "file.image", "afbeelding: controleer op schermafdrukken met persoonlijke gegevens");
  else if (!ALLOWED_EXT.has(ext) && !ALLOWED_NAMES.test(base) && !/^requirements.*\.txt$/.test(base)) add(B, "file.unknown", `bestandstype niet op de allowlist (${ext || base})`);
  return out;
}

// ---------- Rules on contents ----------
const SECRETS = [
  ["secret.github", /\b(gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{22,})\b/],
  ["secret.aws", /\b(AKIA|ASIA)[0-9A-Z]{16}\b|aws_secret_access_key\s*[:=]\s*\S{20,}/i],
  ["secret.azure", /AccountKey=[A-Za-z0-9+/=]{40,}|DefaultEndpointsProtocol=https?;[^\s]*AccountKey/],
  ["secret.anthropic", /\bsk-ant-[A-Za-z0-9_-]{20,}/],
  ["secret.openai", /\bsk-(proj-)?[A-Za-z0-9_-]{32,}/],
  ["secret.slack", /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ["secret.private-key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];
const PASSWORD = /\b(password|passwd|wachtwoord|api[_-]?key|client[_-]?secret)\b["']?\s*[:=]\s*["']?[^\s"',;]{6,}/i;

function contentRules(file, text) {
  const out = [];
  const lines = text.split(/\r?\n/);
  // raw: the found value, only for matching the allowlist. It is never printed.
  const add = (level, rule, i, detail, raw) => out.push({ level, rule, file, line: i + 1, detail, raw });
  const isTest = /^harness\/test\//.test(file);
  const userPath = CI_MODE ? /(?!)/ : new RegExp(`([A-Z]:[\\\\/]+Users[\\\\/]+|/[a-z]/Users/|/home/|/Users/)${escapeRe(userName)}\\b`, "i");
  const anyUserPath = /([A-Z]:[\\/]+Users[\\/]+|\/[a-z]\/Users\/|\/home\/)[A-Za-z][\w.-]*/;
  const userWord = !CI_MODE && userName.length >= 4 ? new RegExp(`(?<![\\w.-])${escapeRe(userName)}(?![\\w-])`, "i") : null;
  const privRe = privateTerms.length ? new RegExp(`(?<![\\p{L}\\p{N}])(${privateTerms.map(escapeRe).join("|")})(?![\\p{L}\\p{N}])`, "iu") : null;
  lines.forEach((line, i) => {
    if (line.length > 20000) return; // minified vendor code: names and secrets are still checked below per chunk
    for (const [rule, re] of SECRETS) if (re.test(line)) add(B, rule, i, "lijkt een geheim (token of sleutel)");
    if (PASSWORD.test(line) && !isTest && file !== "harness/security-check.mjs") add(T, "secret.password", i, "lijkt een wachtwoord of sleutel in configuratie");
    for (const m of line.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)) {
      const e = m[0];
      if (userEmail && e.toLowerCase() === userEmail.toLowerCase()) add(B, "privacy.email", i, "jouw eigen e-mailadres");
      else if (!ALLOWED_EMAIL.test(e) && !/@[\w-]+\.(png|jpg|svg|webp|gif|mjs|js|json|css|md|html)$/i.test(e)) add(T, "privacy.email", i, `e-mailadres ${shown(e)}`, e);
    }
    // Web addresses are not file paths, and an id in a public URL is not a session id.
    const noUrl = line.replace(/\bhttps?:\/\/[^\s)>\]"'`]+/gi, " ");
    if (userPath.test(line)) add(B, "privacy.user-path", i, "pad met jouw gebruikersnaam");
    else if (anyUserPath.test(noUrl)) add(T, "privacy.path", i, `absoluut gebruikerspad (${shown(noUrl.match(anyUserPath)[0])})`);
    else if (userWord && userWord.test(line)) add(T, "privacy.user-name", i, `jouw gebruikersnaam '${userName}'`);
    if (/\.claude[\\/]+projects[\\/]/i.test(line)) add(B, "privacy.transcript", i, "pad naar een Claude-transcript");
    if (/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i.test(noUrl)) add(T, "privacy.uuid", i, "lijkt een sessie-id");
    if (privRe && privRe.test(line)) add(B, "privacy.private-term", i, `term uit private.json: '${shown(line.match(privRe)[1])}'`);
  });
  // Very long lines (minified code): only secrets and private terms, in chunks.
  lines.forEach((line, i) => {
    if (line.length <= 20000) return;
    for (let k = 0; k < line.length; k += 10000) {
      const chunk = line.slice(k, k + 10200);
      for (const [rule, re] of SECRETS) if (re.test(chunk)) add(B, rule, i, "lijkt een geheim (token of sleutel)");
      if (privRe && privRe.test(chunk)) add(B, "privacy.private-term", i, "term uit private.json");
    }
  });
  return out;
}

// Long literal quotes in research notes: copyright doubt.
function copyrightRules(file, text) {
  if (!/(^|\/)(research[_-]?notes|notes|onderzoek)\//i.test(file) || !/\.md$/i.test(file)) return [];
  const out = [];
  const lines = text.split(/\r?\n/);
  let start = -1, words = 0;
  const flush = (end) => { if (words > 40) out.push({ level: T, rule: "copyright.quote", file, line: start + 1, detail: `citaat van ${words} woorden (regel ${start + 1}-${end}): controleer het auteursrecht` }); start = -1; words = 0; };
  lines.forEach((l, i) => {
    if (/^\s*>/.test(l)) { if (start < 0) start = i; words += l.replace(/^\s*>/, "").split(/\s+/).filter(Boolean).length; }
    else flush(i);
    for (const m of l.matchAll(/["“]([^"”]{300,})["”]/g)) {
      const n = m[1].split(/\s+/).length;
      if (n > 50) out.push({ level: T, rule: "copyright.quote", file, line: i + 1, detail: `citaat tussen aanhalingstekens van ${n} woorden` });
    }
  });
  flush(lines.length);
  return out;
}

// ---------- Web safety (site-src and the built site) ----------
function webRules(file, text, { built = false } = {}) {
  const out = [];
  const add = (level, rule, line, detail) => out.push({ level, rule, file, line, detail });
  const lineOf = (idx) => text.slice(0, idx).split("\n").length;
  const isDashboard = /(^|\/)dashboard\//.test(file);
  const strict = isDashboard;
  if (/\.html?$/i.test(file)) {
    for (const m of text.matchAll(/<script\b([^>]*)>/gi)) {
      const attrs = m[1];
      const src = (attrs.match(/\bsrc\s*=\s*["']?([^"'\s>]+)/i) ?? [])[1];
      if (src && /^(https?:)?\/\//i.test(src) && !/\bintegrity\s*=/.test(attrs)) add(B, "web.external-script", lineOf(m.index), `extern script zonder SRI: ${src}`);
      if (!src && !/type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs) && !built) {
        add(strict ? B : T, "web.inline-script", lineOf(m.index), "inline script" + (strict ? " (CSP staat dat niet toe)" : ": controleer de inhoud"));
      }
    }
    for (const m of text.matchAll(/<(link|img|iframe|source|audio|video|object|embed)\b([^>]*)>/gi)) {
      const url = (m[2].match(/\b(href|src|data)\s*=\s*["']?((https?:)?\/\/[^"'\s>]+)/i) ?? [])[2];
      if (!url) continue;
      // A <link> is only loaded for these rel values (canonical, alternate etc. are just references).
      if (m[1].toLowerCase() === "link" && !/\brel\s*=\s*["']?[^"'>]*\b(stylesheet|preload|modulepreload|prefetch|preconnect|icon|manifest)\b/i.test(m[2])) continue;
      if (!/^(https?:)?\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)(\/|$)/i.test(url)) add(T, "web.external-resource", lineOf(m.index), `externe bron: ${url}`);
    }
    // Built pages must all have a CSP (site-csp.mjs adds it); sources only for the dashboard (the rest is TWIJFEL).
    const level = built || strict ? B : T;
    const csp = text.match(/<meta[^>]+http-equiv\s*=\s*["']?Content-Security-Policy["']?[^>]*content\s*=\s*(["'])(.*?)\1/i);
    if (!csp) add(level, "web.csp", 1, "geen Content-Security-Policy-meta-tag");
    else {
      if (!/default-src\s+'self'/.test(csp[2])) add(level, "web.csp", lineOf(csp.index), "CSP zonder default-src 'self'");
      const scriptSrc = (csp[2].match(/script-src([^;]*)/) ?? [])[1] ?? "";
      if (/'unsafe-(inline|eval)'/.test(scriptSrc)) add(level, "web.csp", lineOf(csp.index), "script-src met 'unsafe-inline' of 'unsafe-eval'");
    }
  }
  if (/\.(m?js|html?)$/i.test(file) && !built) {
    for (const m of text.matchAll(/\.(innerHTML|outerHTML)\s*[+]?=|\binsertAdjacentHTML\s*\(|\bdocument\.write(ln)?\s*\(/g)) {
      add(strict ? B : T, "web.html-sink", lineOf(m.index), `${m[0].trim()}: vrije tekst alleen via textContent`);
    }
    for (const m of text.matchAll(/(?<![\w.])eval\s*\(|\bnew\s+Function\s*\(|\bset(Timeout|Interval)\s*\(\s*["'`]/g)) add(B, "web.eval", lineOf(m.index), m[0].trim());
  }
  return out;
}

// ---------- CI / Actions ----------
function ciRules(file, text) {
  const out = [];
  const add = (level, rule, line, detail) => out.push({ level, rule, file, line, detail });
  const lines = text.split(/\r?\n/);
  if (!/^\s*permissions\s*:/m.test(lines.filter((l) => !/^\s/.test(l) || /^permissions/.test(l)).join("\n"))) add(B, "ci.permissions", 1, "geen permissions op het hoogste niveau");
  let inRun = -1, job = null;
  lines.forEach((l, i) => {
    const jm = l.match(/^ {2}([\w-]+):\s*$/);
    if (jm && lines.slice(0, i).some((x) => /^jobs:/.test(x))) job = jm[1];
    const uses = l.match(/^\s*-?\s*uses:\s*([^\s#]+)/);
    if (uses && !uses[1].startsWith("./") && !/@[0-9a-f]{40}$/.test(uses[1])) add(B, "ci.unpinned", i + 1, `action niet gepind op een commit-SHA: ${uses[1]}`);
    if (/\bpull_request_target\b/.test(l)) add(B, "ci.pull-request-target", i + 1, "pull_request_target");
    const perm = l.match(/^\s*([\w-]+)\s*:\s*write\b/);
    if (perm) {
      if (!["pages", "id-token"].includes(perm[1])) add(B, "ci.write", i + 1, `${perm[1]}: write`);
      else if (job !== "deploy") add(T, "ci.write", i + 1, `${perm[1]}: write buiten de deploy-job`);
    }
    if (/\$\{\{\s*secrets\.(?!GITHUB_TOKEN\b)/.test(l)) add(T, "ci.secret", i + 1, "gebruikt een secret");
    const indent = l.match(/^\s*/)[0].length;
    if (/^\s*(-\s*)?run:\s*/.test(l)) inRun = indent;
    else if (inRun >= 0 && l.trim() && indent <= inRun) inRun = -1;
    if ((inRun >= 0 || /^\s*(-\s*)?run:/.test(l)) && /\$\{\{\s*github\.(event|head_ref)/.test(l)) add(T, "ci.injection", i + 1, "github.event in een run-stap: geef het via env door");
  });
  return out;
}

function requirementsRules(file, text) {
  return text.split(/\r?\n/).map((l, i) => [l.trim(), i]).filter(([l]) => l && !l.startsWith("#"))
    .filter(([l]) => !/^[A-Za-z0-9._-]+(\[[\w,]+\])?==[\w.+!-]+(\s*;.*)?$/.test(l))
    .map(([l, i]) => ({ level: B, rule: "ci.unpinned-python", file, line: i + 1, detail: `niet gepind met ==: ${l}` }));
}

// ---------- The harness itself (runs code on the learner's computer) ----------
function harnessRules(file, text) {
  if (!/^harness\/.*\.m?js$/.test(file) || /^harness\/test\//.test(file) || file === "harness/security-check.mjs") return [];
  const out = [];
  const add = (level, rule, line, detail) => out.push({ level, rule, file, line, detail });
  text.split(/\r?\n/).forEach((l, i) => {
    if (/from\s+["']node:(http|https|http2|net|tls|dgram)["']|require\(\s*["'](node:)?(http|https|net|tls|dgram)["']\s*\)|(?<![\w.])fetch\s*\(|\bWebSocket\b|\bXMLHttpRequest\b/.test(l)) add(B, "harness.network", i + 1, "netwerkverkeer");
    if (/(?<![\w.])eval\s*\(|\bnew\s+Function\s*\(/.test(l)) add(B, "harness.eval", i + 1, "eval of new Function");
    if (/(?<![\w.])(exec|execSync)\s*\(|import\s*\{[^}]*\bexec(Sync)?\b[^}]*\}\s*from\s*["']node:child_process|\bshell\s*:\s*true/.test(l)) add(B, "harness.shell", i + 1, "shell-uitvoering (gebruik spawnSync/execFileSync met een argumentenlijst)");
  });
  return out;
}

// ---------- Sources: working tree, commit ranges, built site ----------
function scanText(file, text) {
  const out = [...contentRules(file, text), ...copyrightRules(file, text), ...harnessRules(file, text)];
  if (/^site-src\//.test(file) || /^(index\.html|docs\/.*\.html?)$/.test(file)) out.push(...webRules(file, text));
  if (/^\.github\/workflows\/.*\.ya?ml$/.test(file)) out.push(...ciRules(file, text));
  if (/^requirements.*\.txt$/.test(file)) out.push(...requirementsRules(file, text));
  return out;
}
const isBinary = (buf) => buf.subarray(0, 8000).includes(0);

function scanWorkingTree() {
  const files = git(["ls-files", "-co", "--exclude-standard", "-z"]).split("\0").filter(Boolean).filter((f) => fs.existsSync(path.join(ROOT, f)));
  const out = [];
  for (const f of files) {
    out.push(...nameRules(f));
    const buf = fs.readFileSync(path.join(ROOT, f));
    if (!isBinary(buf)) out.push(...scanText(f, buf.toString("utf8")));
  }
  if (!files.includes(".github/dependabot.yml")) out.push({ level: T, rule: "ci.dependabot", file: ".github/dependabot.yml", line: null, detail: "geen Dependabot-configuratie" });
  return { out, files: files.length };
}

// The e-mail addresses of one commit. A merge made on github.com (more than one parent, committed by
// GitHub itself with its own noreply address) carries the address of the GitHub account; that is only allowed by a
// reasoned decision in the allowlist (githubMerges). Its message and files are checked as usual.
export function commitEmailFindings({ sha, author, committer, parents }, allowlist = {}) {
  const file = `commit ${String(sha).slice(0, 7)}`;
  const allowed = new Set((allowlist.commitEmails ?? []).map((e) => String(e).toLowerCase()));
  const webMerge = /^noreply@github\.com$/i.test(committer) && parents > 1;
  const reason = allowlist.githubMerges?.allow === true && allowlist.githubMerges?.reason ? allowlist.githubMerges.reason : null;
  if (webMerge && reason) return [{ level: OK, rule: "privacy.commit-email", file, line: null, detail: `merge op github.com — toegestaan: ${reason}` }];
  const out = [];
  for (const e of new Set([author, committer])) {
    if (!allowed.has(String(e).toLowerCase()) && !/@users\.noreply\.github\.com$|^noreply@github\.com$/i.test(e)) {
      out.push({ level: B, rule: "privacy.commit-email", file, line: null, detail: `commit-e-mail ${shown(e)} wordt zichtbaar op GitHub (gebruik je noreply-adres)` });
    }
  }
  return out;
}

function scanRange(range) {
  const out = [];
  const commits = git(["rev-list", ...range.split(" ")]).split("\n").filter(Boolean);
  for (const c of commits) {
    const [ae, ce, parents = ""] = git(["show", "-s", "--format=%ae%x00%ce%x00%p", c]).trim().split("\0");
    out.push(...commitEmailFindings({ sha: c, author: ae, committer: ce, parents: parents.trim().split(/\s+/).filter(Boolean).length }, allow));
    const msg = git(["show", "-s", "--format=%B", c]);
    out.push(...contentRules(`commit ${c.slice(0, 7)} (bericht)`, msg).filter((f) => f.rule !== "privacy.uuid"));
    const changed = git(["diff-tree", "--root", "--no-commit-id", "-r", "-z", "--name-status", c]).split("\0").filter(Boolean);
    for (let k = 0; k < changed.length; k += 2) {
      const status = changed[k], file = changed[k + 1];
      if (status.startsWith("D")) continue;
      for (const f of nameRules(file)) out.push({ ...f, file: `${file} @${c.slice(0, 7)}` });
      const buf = git(["cat-file", "blob", `${c}:${file}`], { buffer: true });
      if (!isBinary(buf)) for (const f of contentRules(file, buf.toString("utf8"))) out.push({ ...f, file: `${file} @${c.slice(0, 7)}` });
    }
  }
  return { out, commits: commits.length };
}

function scanSite(dir) {
  const out = [];
  const abs = path.resolve(ROOT, dir);
  for (const f of fs.readdirSync(abs, { recursive: true }).map(String)) {
    const p = path.join(abs, f);
    if (!fs.statSync(p).isFile() || !/\.html?$/i.test(f)) continue;
    out.push(...webRules(`${dir}/${f.split(path.sep).join("/")}`, fs.readFileSync(p, "utf8"), { built: true }));
  }
  return out;
}

// ---------- Allowlist and report ----------
function applyAllowlist(findings) {
  return findings.map((f) => {
    if (f.level !== T) return f;
    const plain = f.file.replace(/ @[0-9a-f]{7}$/, "");
    const e = (allow.entries ?? []).find((x) => x.rule && x.reason && (x.rule === f.rule || globRe(x.rule).test(f.rule)) &&
      (!x.path || globRe(x.path).test(plain)) && (!x.match || String(f.raw ?? f.detail).includes(x.match) || String(f.detail).includes(x.match)));
    return e ? { ...f, level: OK, detail: `${f.detail} — toegestaan: ${e.reason}` } : f;
  });
}

function report(findings, { ci }) {
  const order = { [B]: 0, [T]: 1, [OK]: 2 };
  const sorted = [...findings].sort((a, b) => order[a.level] - order[b.level] || a.file.localeCompare(b.file) || (a.line ?? 0) - (b.line ?? 0));
  // Collapse repeats of the same rule in the same file.
  const groups = new Map();
  for (const f of sorted) {
    const key = `${f.level}|${f.rule}|${f.file}|${f.detail}`;
    const g = groups.get(key) ?? { ...f, lines: [] };
    if (f.line) g.lines.push(f.line);
    groups.set(key, g);
  }
  for (const g of groups.values()) {
    const where = g.file + (g.lines.length ? `:${g.lines.slice(0, 5).join(",")}${g.lines.length > 5 ? ` (+${g.lines.length - 5})` : ""}` : "");
    console.log(`${g.level.padEnd(8)} ${g.rule.padEnd(24)} ${where}  ${g.detail}`);
    if (ci && g.level !== OK) console.log(`::${g.level === B ? "error" : "warning"} file=${g.file.split(" ")[0]}${g.lines[0] ? `,line=${g.lines[0]}` : ""}::${g.level} ${g.rule}: ${g.detail}`);
  }
  const n = (lvl) => findings.filter((f) => f.level === lvl).length;
  return { blocked: n(B), doubts: n(T), ok: n(OK) };
}

function installHook() {
  const hooksDir = path.join(ROOT, ".git", "hooks");
  if (!fs.existsSync(hooksDir)) { console.error("Geen .git/hooks gevonden."); process.exit(1); }
  const hook = path.join(hooksDir, "pre-push");
  if (fs.existsSync(hook)) {
    const backup = `${hook}.backup-${new Date().toISOString().replace(/[:.]/g, "-")}`;
    fs.copyFileSync(hook, backup);
    console.log(`Bestaande pre-push-hook bewaard als ${path.relative(ROOT, backup)}`);
  }
  fs.writeFileSync(hook, "#!/bin/sh\n# Leerharnas security check (harness/security-check.mjs)\nexec node harness/security-check.mjs --pre-push\n", { mode: 0o755 });
  console.log("pre-push-hook geïnstalleerd: elke push draait eerst de security check.");
}

// ---------- Main ----------
async function main() {
  const argv = process.argv.slice(2);
  const opt = { ranges: [], site: null, ci: Boolean(process.env.CI), prePush: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--range") opt.ranges.push(argv[++i]);
    else if (argv[i] === "--site") opt.site = argv[++i];
    else if (argv[i] === "--ci") opt.ci = true;
    else if (argv[i] === "--pre-push") opt.prePush = true;
    else if (argv[i] === "--install-hook") { installHook(); return 0; }
    else { console.error(`Onbekende optie ${argv[i]}`); return 2; }
  }
  if (opt.prePush) {
    let input = "";
    for await (const c of process.stdin) input += c;
    for (const line of input.split("\n").filter(Boolean)) {
      const [, localSha, , remoteSha] = line.split(" ");
      if (/^0+$/.test(localSha)) continue; // deleting a branch
      opt.ranges.push(/^0+$/.test(remoteSha) ? `${localSha} --not --remotes` : `${remoteSha}..${localSha}`);
    }
  }

  console.log(`Security check in ${ROOT}`);
  console.log(`Privé-termen: ${privateTerms.length ? `${privateTerms.length} uit ${path.relative(ROOT, privFile) || privFile}` : "geen (zet ze in .learning/private.json of LEERHARNAS_PRIVATE)"}\n`);
  const tree = scanWorkingTree();
  let findings = tree.out;
  let commits = 0;
  for (const r of opt.ranges) { const s = scanRange(r); findings.push(...s.out); commits += s.commits; }
  if (opt.site) findings.push(...scanSite(opt.site));
  findings = applyAllowlist(findings);
  const { blocked, doubts, ok } = report(findings, opt);

  console.log(`\n${tree.files} bestanden${commits ? ` en ${commits} commits` : ""} gecontroleerd: ${blocked} BLOKKEER · ${doubts} TWIJFEL · ${ok} OK (toegestaan)`);
  if (!opt.ci) {
    console.log(`\nRepo-instellingen (zet je zelf aan op GitHub, Settings > Code security and analysis / Branches):
  - Secret scanning met push protection
  - Dependabot alerts
  - Private vulnerability reporting (meldadres voor SECURITY.md)
  - Branch protection op main (pull request en groene checks verplicht)`);
  }
  if (blocked || doubts) {
    console.log(`\n${blocked ? "Geblokkeerd. " : ""}${doubts ? "Bij TWIJFEL beslist een mens: los het op, of leg het besluit vast in .security-allowlist.json (met reden)." : ""}`);
    return 1;
  }
  console.log("\nGeen bezwaren gevonden.");
  return 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exit(await main());

export { nameRules, contentRules, webRules, ciRules, requirementsRules, harnessRules, copyrightRules };
