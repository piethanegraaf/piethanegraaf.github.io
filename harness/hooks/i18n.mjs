// Messages in the learner's language (settings.language): i18n/<lang>.json, with Dutch as fallback.
// t("key", { name: value }) fills {name} placeholders. A missing key shows the key itself, never a crash.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
// Installed: .claude/hooks/i18n/. In the source repository: harness/i18n/.
const DIRS = [path.join(HERE, "i18n"), path.join(HERE, "..", "i18n")];
export const LANGUAGES = ["nl", "en"];
const cache = new Map();
let current = "nl";

export function loadStrings(lang) {
  if (cache.has(lang)) return cache.get(lang);
  let strings = {};
  for (const dir of DIRS) {
    try { strings = JSON.parse(fs.readFileSync(path.join(dir, `${lang}.json`), "utf8")); break; } catch { /* try the next folder */ }
  }
  cache.set(lang, strings);
  return strings;
}

export function setLanguage(lang) {
  current = LANGUAGES.includes(lang) ? lang : "nl";
  return current;
}

export const language = () => current;

// null shows as "-"; a variable that was not passed at all stays visible as {name}, so tests catch it.
export function t(key, vars = {}) {
  const s = loadStrings(current)[key] ?? loadStrings("nl")[key] ?? key;
  return String(s).replace(/\{(\w+)\}/g, (m, k) => (vars[k] === undefined ? m : vars[k] === null ? "-" : String(vars[k])));
}
