// Privacy filters, shared by the dashboard export (harness/export.mjs) and the AI-use log of graded
// work (graded.mjs, setup of 13 Nov, #50). No dependencies.
import os from "node:os";

// ---------- Filters ----------
const escapeRe = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Fixed filters, in this order. Each one counts its hits for the report.
export function fixedFilters({ userNames = [] } = {}) {
  const names = [...new Set(userNames.filter((n) => n && n.length >= 3))];
  return [
    { id: "html-comment", re: /<!--[\s\S]*?-->/g, to: "" },
    { id: "email", re: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, to: "[e-mail]" },
    { id: "transcript", re: /[^\s"'`()]*\.claude[\\/]+projects[\\/][^\s"'`()]*/gi, to: "[transcript]" },
    { id: "windows-path", re: /\b[A-Z]:[\\/][^\s"'`()<>|]*/gi, to: "[pad]" },
    { id: "unix-path", re: /(?<![\w.])\/(?:home|Users|mnt|[a-z])\/[^\s"'`()<>|]+/g, to: "[pad]" },
    { id: "uuid", re: /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, to: "[sessie]" },
    ...(names.length ? [{ id: "user-name", re: new RegExp(`\\b(${names.map(escapeRe).join("|")})\\b`, "gi"), to: "[gebruiker]" }] : []),
  ];
}

// .learning/private.json: { "terms": ["..."], "replace": { "term": "vervanging" } }
export function privateFilters(priv) {
  const out = [];
  const replace = priv?.replace && typeof priv.replace === "object" ? priv.replace : {};
  const terms = Array.isArray(priv?.terms) ? priv.terms : [];
  for (const [term, to] of [...Object.entries(replace), ...terms.map((t) => [t, "[privé]"])]) {
    if (typeof term !== "string" || !term.trim()) continue;
    out.push({ id: "private", term, re: new RegExp(`(?<![\\p{L}\\p{N}])${escapeRe(term.trim())}(?![\\p{L}\\p{N}])`, "giu"), to: String(to) });
  }
  // Longer terms first, so "Jan de Vries" wins over "Jan".
  return out.sort((a, b) => b.term.length - a.term.length);
}

export function makeScrubber(filters) {
  const report = new Map(); // id -> { n, fields: Set }
  const scrub = (text, field) => {
    if (text === null || text === undefined) return text;
    let s = String(text);
    for (const f of filters) {
      s = s.replace(f.re, () => {
        const key = f.id === "private" ? `private: ${f.term}` : f.id;
        const r = report.get(key) ?? { n: 0, fields: new Set() };
        r.n++; r.fields.add(field);
        report.set(key, r);
        return f.to;
      });
    }
    return s.replace(/[ \t]{2,}/g, " ").trim();
  };
  return { scrub, report };
}

// The filters of the AI-use log (#50): the home folder becomes ~ (also as /c/Users/... and with
// forward slashes), e-mail addresses and transcript paths go, and the terms of .learning/private.json.
// Other paths and the user name stay: the log is about the work in this repo, and the student is its author.
export function logFilters({ home = os.homedir(), priv = {} } = {}) {
  const h = String(home ?? "").replace(/[\\/]+$/, "");
  const forms = new Set();
  if (h.length >= 3) {
    const slash = h.replace(/\\/g, "/");
    forms.add(slash);
    forms.add(slash.replace(/\//g, "\\"));
    const m = slash.match(/^([a-zA-Z]):\/(.*)$/);
    if (m) forms.add(`/${m[1].toLowerCase()}/${m[2]}`);
  }
  const fixed = fixedFilters();
  const pick = (id) => fixed.filter((f) => f.id === id);
  // The home folder only as a whole path segment: a longer folder name that starts the same is not it.
  const homeRe = forms.size
    ? [{ id: "home", re: new RegExp(`(?:${[...forms].sort((a, b) => b.length - a.length).map(escapeRe).join("|")})(?![\\p{L}\\p{N}_.-])`, "giu"), to: "~" }]
    : [];
  return [...privateFilters(priv), ...pick("transcript"), ...homeRe, ...pick("email")];
}
