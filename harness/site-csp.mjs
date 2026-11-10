#!/usr/bin/env node
// Adds a Content-Security-Policy meta tag to every HTML page of the built site that has none yet.
//   node harness/site-csp.mjs site
// - Inline scripts are allowed by their sha256 hash, per page: no 'unsafe-inline' and no 'unsafe-eval' for scripts.
// - External scripts are only allowed when they carry an integrity attribute (SRI); their origin is added.
// - Styles may be inline (MkDocs Material and mermaid set them); fonts only from Google Fonts.
// Pages with their own CSP (the dashboard) are left alone.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

export function cspFor(html) {
  const hashes = new Set();
  const origins = new Set();
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    const attrs = m[1];
    const src = (attrs.match(/\bsrc\s*=\s*["']?([^"'\s>]+)/i) ?? [])[1];
    if (src) {
      if (/^(https?:)?\/\//i.test(src)) {
        if (!/\bintegrity\s*=/.test(attrs)) throw new Error(`external script without SRI: ${src}`);
        origins.add(new URL(src, "https://example.invalid").origin);
      }
      continue;
    }
    if (/type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs)) continue; // data, not executed
    // The HTML parser turns CRLF and CR into LF before the browser hashes the script, so hash that text.
    const text = m[2].replace(/\r\n?/g, "\n");
    hashes.add(`'sha256-${crypto.createHash("sha256").update(text, "utf8").digest("base64")}'`);
  }
  return [
    "default-src 'self'",
    `script-src 'self' ${[...hashes, ...origins].join(" ")}`.trim(),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data:",
    "connect-src 'self'",
    "worker-src 'self' blob:",
    "base-uri 'self'",
    "form-action 'none'",
    "object-src 'none'",
  ].join("; ");
}

export function addCsp(html) {
  if (/http-equiv\s*=\s*["']?Content-Security-Policy/i.test(html)) return null;
  const meta = `<meta http-equiv="Content-Security-Policy" content="${cspFor(html)}">`;
  if (!/<head\b[^>]*>/i.test(html)) throw new Error("no <head>");
  return html.replace(/<head\b[^>]*>/i, (h) => `${h}${meta}`);
}

function main() {
  const dir = path.resolve(process.argv[2] ?? "site");
  let changed = 0, kept = 0;
  for (const f of fs.readdirSync(dir, { recursive: true }).map(String).filter((f) => /\.html?$/i.test(f))) {
    const p = path.join(dir, f);
    const html = fs.readFileSync(p, "utf8");
    let next;
    try { next = addCsp(html); } catch (e) { console.error(`${f}: ${e.message}`); process.exit(1); }
    if (next === null) { kept++; continue; }
    fs.writeFileSync(p, next);
    changed++;
  }
  console.log(`CSP toegevoegd aan ${changed} pagina's (${kept} hadden er al een).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
