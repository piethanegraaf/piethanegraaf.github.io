#!/usr/bin/env node
// Makes Markdown lists render in MkDocs (Python-Markdown), without changing any words:
//  - nested lists indented with 2 spaces get 4 (Python-Markdown needs 4 per level);
//  - a list that directly follows a paragraph line gets a blank line before it.
// Fenced code blocks are left alone; inside an admonition (!!! …) the 4-space box indent is kept.
//   node harness/tools/fix-md-lists.mjs <file.md> [...]
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ITEM = /^( *)([-*+]|\d+[.)]) +\S/;

export function fixLists(text) {
  const lines = text.split("\n");
  const out = [];
  let fence = false, box = false, inList = false, unit = 2;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) { fence = !fence; out.push(line); inList = false; continue; }
    if (fence) { out.push(line); continue; }
    if (/^!!! /.test(line)) { box = true; inList = false; out.push(line); continue; }
    if (box && line.trim() !== "" && !/^ {4}/.test(line)) box = false;
    const base = box ? 4 : 0;
    const body = line.slice(base);
    const indent = body.match(/^ */)[0].length;
    const item = ITEM.test(body);
    if (line.trim() === "") { out.push(line); continue; }
    if (item && indent > 0 && inList) {
      // A nested item right after a paragraph line (not an item) would be glued to that paragraph.
      const prev = out.length ? out[out.length - 1] : "";
      const prevBody = prev.slice(base);
      if (prev.trim() !== "" && !ITEM.test(prevBody) && !/^\s*\|/.test(prevBody)) out.push(box ? "    " : "");
    }
    if (item) {
      if (indent === 0) {
        const prev = out.length ? out[out.length - 1] : "";
        const prevBody = prev.slice(base);
        // A top-level item right after a paragraph line (also an indented continuation paragraph of the
        // previous item) would be glued to that paragraph: give it a blank line.
        if (prev.trim() !== "" && !ITEM.test(prevBody) && !/^\s*\|/.test(prevBody) && !/^#/.test(prevBody)) out.push(box ? "    " : "");
        // The indent unit of the whole list block (it may contain blank lines): 4 when every indented
        // line already uses multiples of 4 (nothing to change), 2 when some line uses 2, 6, 10 … spaces.
        if (!inList) {
          const indents = [];
          for (let k = i + 1; k < lines.length; k++) {
            if (/^\s*```/.test(lines[k])) break;
            const b = lines[k].slice(base);
            if (lines[k].trim() === "") continue;
            const n = b.match(/^ */)[0].length;
            if (n === 0 && !ITEM.test(b)) break;
            if (n > 0) indents.push(n);
          }
          unit = indents.length && indents.every((n) => n % 4 === 0) ? 4 : 2;
        }
        inList = true;
        out.push(line);
        continue;
      }
      if (inList) { out.push(" ".repeat(base) + " ".repeat((indent / unit) * 4) + body.trimStart()); continue; }
    }
    if (inList && indent > 0 && indent % unit === 0) { out.push(" ".repeat(base) + " ".repeat((indent / unit) * 4) + body.trimStart()); continue; }
    if (indent === 0) inList = false;
    out.push(line);
  }
  return out.join("\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const f of process.argv.slice(2)) {
    const before = fs.readFileSync(f, "utf8").replace(/\r\n/g, "\n");
    const after = fixLists(before);
    const words = (s) => s.split(/\s+/).filter(Boolean).join(" ");
    if (words(before) !== words(after)) { console.error(`${f}: the words changed, nothing written`); process.exit(1); }
    fs.writeFileSync(f, after);
    console.log(`${f}: ${before === after ? "unchanged" : "lists fixed"}`);
  }
}
