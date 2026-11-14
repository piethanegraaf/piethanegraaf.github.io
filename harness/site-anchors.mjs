#!/usr/bin/env node
// Old anchors of the literature review, sent on to the page that has them now.
//   node harness/site-anchors.mjs site
// Until 14 November 2026 the literature review was one page (/research/). Now /research/ is an overview,
// and the sections live on pages under it (/research/literature/, /research/design/, ...). A link from
// elsewhere to /research/#22-friction-... would land on the overview without the section. For every
// language, this adds a small script to the overview: if the #anchor of the address is on one of the
// pages under it, the script sends the visitor there, with the anchor. The pages and their anchors are
// read from the built site, so the map is always current.
// Run it after site-redirects.mjs (an old /en/research/#... address arrives here with its anchor), and
// before site-csp.mjs, which allows the script by its hash.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SECTION = "research";
const MARK = "data-anchor-map";

// The ids in the article of a built page (not the ones of the theme around it).
export function articleIds(html) {
  const m = String(html).match(/<article class="[^"]*md-content__inner[^"]*">([\s\S]*?)<\/article>/);
  if (!m) return [];
  return [...m[1].matchAll(/\sid="([^"]+)"/g)].map((x) => x[1]).filter((id) => !/^(__|fnref|fn:)/.test(id));
}

// { page: [ids] } for the ids that are not on the overview itself. An id on more than one page is an error:
// the script could not know where to send it.
export function anchorMap(overviewIds, pages) {
  const own = new Set(overviewIds);
  const seen = new Map();
  const map = {};
  for (const [page, ids] of Object.entries(pages)) {
    if (!/^[a-z0-9-]+$/.test(page)) throw new Error(`unexpected page name: ${page}`);
    for (const id of ids) {
      if (own.has(id)) continue;
      if (!/^[A-Za-z0-9_-]+$/.test(id)) continue; // not an anchor anyone links to
      if (seen.has(id)) throw new Error(`#${id} is on ${seen.get(id)} and on ${page}`);
      seen.set(id, page);
      (map[page] ??= []).push(id);
    }
  }
  return map;
}

// The script: page names and ids are checked above, so JSON.stringify is safe inside <script>.
export function anchorScript(map) {
  return `<script ${MARK}>(function(){var m=${JSON.stringify(map)},h=location.hash.slice(1);if(!h)return;for(var p in m)if(m[p].indexOf(h)>=0){location.replace(p+"/"+location.hash);return}})()</script>`;
}

// The overview with the script at the end of its <head>, so it runs before the page is shown.
export function inject(html, script) {
  if (html.includes(MARK)) throw new Error("the overview already has an anchor map");
  if (!html.includes("</head>")) throw new Error("no </head> in the overview");
  return html.replace("</head>", `${script}\n</head>`);
}

// The overviews of the section in the built site: "research/index.html" (English, at the root) and
// "<lang>/research/index.html", not the /en/ redirect pages.
export function overviews(files) {
  return files
    .map((f) => String(f).replace(/\\/g, "/"))
    .filter((f) => new RegExp(`^(?:[a-z]{2}/)?${SECTION}/index\\.html$`).test(f) && !f.startsWith("en/"))
    .sort();
}

function main() {
  const dir = path.resolve(process.argv[2] ?? "site");
  const files = fs.readdirSync(dir, { recursive: true }).map(String);
  const found = overviews(files);
  if (!found.includes(`${SECTION}/index.html`)) {
    console.error(`no ${SECTION}/index.html in the site`);
    process.exit(1);
  }
  for (const rel of found) {
    const base = path.dirname(path.join(dir, rel));
    const pages = {};
    for (const e of fs.readdirSync(base, { withFileTypes: true })) {
      const f = path.join(base, e.name, "index.html");
      if (e.isDirectory() && fs.existsSync(f)) pages[e.name] = articleIds(fs.readFileSync(f, "utf8"));
    }
    const file = path.join(dir, rel);
    const html = fs.readFileSync(file, "utf8");
    const map = anchorMap(articleIds(html), pages);
    const n = Object.values(map).reduce((a, ids) => a + ids.length, 0);
    fs.writeFileSync(file, inject(html, anchorScript(map)));
    console.log(`${rel}: ${n} anchors on ${Object.keys(map).length} pages under it.`);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
