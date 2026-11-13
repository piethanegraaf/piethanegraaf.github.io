#!/usr/bin/env node
// Redirects for the old English URLs.
//   node harness/site-redirects.mjs site
// Until 13 November 2026 English lived under /en/ and Dutch at the root. Now English is the default
// language at the root, and Dutch lives under /nl/. GitHub Pages cannot send a server redirect, so for
// every English page of the built site this writes a small page at /en/<same path> that sends the
// visitor on to the new address, with the #anchor:
// - a canonical link to the new address, for search engines;
// - a script that keeps the #anchor (site-csp.mjs allows it by its hash);
// - a meta refresh for browsers and crawlers without JavaScript (it drops the anchor);
// - a plain link in the body.
// Run it after the static pages are copied in, and before site-csp.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SITE_URL = "https://piethanegraaf.github.io/";
export const OLD_PREFIX = "en/";

// Paths that are not an English page, or that never had an /en/ address.
const SKIP = [/^nl\//, /^en\//, /^assets\//, /^search\//, /^dashboard\//];

// The site-relative paths ("", "install/", "notes/eternal_junior/") of the English pages,
// from the relative file names of the built site.
export function englishPages(files) {
  const pages = [];
  for (const raw of files) {
    const f = String(raw).replace(/\\/g, "/");
    if (f !== "index.html" && !f.endsWith("/index.html")) continue;
    if (SKIP.some((re) => re.test(f))) continue;
    pages.push(f.slice(0, -"index.html".length));
  }
  return pages.sort();
}

const escapeAttr = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// The redirect page for the English page at site-relative path `page` ("" is the home page).
export function redirectPage(page) {
  if (/[^a-z0-9/_.-]/i.test(page) || page.includes("..")) throw new Error(`unexpected page path: ${page}`);
  const target = `/${page}`;
  const absolute = `${SITE_URL}${page}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>This page has moved</title>
<link rel="canonical" href="${escapeAttr(absolute)}">
<script>location.replace(document.querySelector('link[rel="canonical"]').getAttribute("href") + location.hash)</script>
<noscript><meta http-equiv="refresh" content="0; url=${escapeAttr(target)}"></noscript>
</head>
<body>
<p>This page has moved to <a href="${escapeAttr(target)}">${escapeAttr(absolute)}</a>.</p>
</body>
</html>
`;
}

function main() {
  const dir = path.resolve(process.argv[2] ?? "site");
  const files = fs.readdirSync(dir, { recursive: true }).map(String);
  const pages = englishPages(files);
  if (!pages.includes("")) {
    console.error("no English home page (index.html) in the site: is English still the default language?");
    process.exit(1);
  }
  for (const page of pages) {
    const out = path.join(dir, OLD_PREFIX, page, "index.html");
    if (fs.existsSync(out)) {
      console.error(`${path.relative(dir, out)} already exists: a page still uses an /en/ address`);
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, redirectPage(page));
  }
  console.log(`${pages.length} redirects from /${OLD_PREFIX} to the English pages at the root.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
