#!/usr/bin/env node
// Adds two kinds of structured data to the JSON-LD of the built pages:
//   node harness/site-jsonld.mjs site
// - FAQPage: a page with a FAQ section (the h2 "frequently-asked-questions" or "veelgestelde-vragen").
//   Each h3 in it is a question; the text up to the next h3 is its answer.
// - DefinedTermSet: a page whose WebPage has mainEntity "<url>#terms" (front matter `jsonld: terms`,
//   overrides/main.html). Each h2 is a term; the first paragraph under it is its definition.
// Only the page's own text goes in, as plain text. It reads nothing else and sends nothing anywhere.
// Run it after the MkDocs build; the CSP step skips JSON-LD, so the order with site-csp.mjs does not matter.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const FAQ_IDS = ["frequently-asked-questions", "veelgestelde-vragen"];

const ENTITIES = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", para: "¶",
  ndash: "–", mdash: "—", hellip: "…", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", rarr: "→",
};
const decode = (s) => s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
  if (e in ENTITIES) return ENTITIES[e];
  if (/^#x/i.test(e)) return String.fromCodePoint(parseInt(e.slice(2), 16));
  if (/^#\d/.test(e)) return String.fromCodePoint(Number(e.slice(1)));
  return m;
});
const BLOCK_TAG = /<\/?(p|li|ul|ol|div|br|h[1-6]|pre|table|thead|tbody|tr|td|th|blockquote|details|summary)\b[^>]*>/gi;

// Plain text of an HTML fragment, without the permalink (the pilcrow) of a heading.
export function textOf(fragment) {
  return decode(String(fragment)
    .replace(/<a class="headerlink"[^>]*>[\s\S]*?<\/a>/g, "")
    .replace(BLOCK_TAG, " ")
    .replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
}

// The article of a Material page (not the menus or the table of contents).
function articleOf(html) {
  const m = html.match(/<article\b[^>]*class="[^"]*md-content__inner[^"]*"[^>]*>([\s\S]*)<\/article>/);
  return m ? m[1] : "";
}

// [{question, answer}] from the FAQ section, or [] when there is none.
export function faqItems(html) {
  const article = articleOf(html);
  for (const id of FAQ_IDS) {
    const start = article.search(new RegExp(`<h2 id="${id}"[^>]*>`));
    if (start < 0) continue;
    let rest = article.slice(start).replace(/^<h2[\s\S]*?<\/h2>/, "");
    const end = rest.search(/<h2\b/);
    if (end >= 0) rest = rest.slice(0, end);
    const parts = rest.split(/(<h3 id="[^"]*"[^>]*>[\s\S]*?<\/h3>)/);
    const items = [];
    for (let i = 1; i < parts.length - 1; i += 2) {
      const question = textOf(parts[i]), answer = textOf(parts[i + 1]);
      if (question && answer) items.push({ question, answer });
    }
    return items;
  }
  return [];
}

// [{id, name, description}]: every h2 of the article with the first paragraph under it.
export function termItems(html) {
  const items = [];
  for (const m of articleOf(html).matchAll(/<h2 id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2\b|$)/g)) {
    const paragraph = m[3].match(/<p>([\s\S]*?)<\/p>/);
    const name = textOf(m[2]);
    if (paragraph && name) items.push({ id: m[1], name, description: textOf(paragraph[1]) });
  }
  return items;
}

// JSON for inside <script>: <, > and & escaped, as Jinja's tojson does.
const scriptJson = (data) => JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

// The page with FAQPage and DefinedTermSet added to its JSON-LD, or null when nothing changes.
export function enrich(html) {
  const re = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/;
  const m = html.match(re);
  if (!m) return null;
  const data = JSON.parse(m[2]);
  const graph = data["@graph"];
  const page = Array.isArray(graph) && graph.find((n) => n["@type"] === "WebPage" || n["@type"] === "ProfilePage");
  if (!page?.url) return null;
  const website = page.isPartOf;
  let changed = false;
  const faq = faqItems(html);
  if (faq.length) {
    graph.push({
      "@type": "FAQPage", "@id": `${page.url}#faq`, url: page.url, inLanguage: page.inLanguage, isPartOf: website,
      mainEntity: faq.map(({ question, answer }) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
    });
    changed = true;
  }
  const setId = `${page.url}#terms`;
  if (page.mainEntity?.["@id"] === setId) {
    graph.push({
      "@type": "DefinedTermSet", "@id": setId, name: page.name, inLanguage: page.inLanguage,
      hasDefinedTerm: termItems(html).map(({ id, name, description }) => ({
        "@type": "DefinedTerm", "@id": `${page.url}#${id}`, url: `${page.url}#${id}`, name, description, inDefinedTermSet: { "@id": setId },
      })),
    });
    changed = true;
  }
  return changed ? html.replace(re, (_, open, _old, close) => `${open}${scriptJson(data)}${close}`) : null;
}

function main() {
  const dir = path.resolve(process.argv[2] ?? "site");
  let faq = 0, terms = 0;
  for (const f of fs.readdirSync(dir, { recursive: true }).map(String).filter((f) => f.endsWith(".html"))) {
    const p = path.join(dir, f);
    const html = fs.readFileSync(p, "utf8");
    let next;
    try { next = enrich(html); } catch (e) { console.error(`${f}: ${e.message}`); process.exit(1); }
    if (next === null) continue;
    if (next.includes('"FAQPage"')) faq++;
    if (next.includes('"DefinedTermSet"')) terms++;
    fs.writeFileSync(p, next);
  }
  console.log(`JSON-LD: FAQPage on ${faq} pages, DefinedTermSet on ${terms}.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
