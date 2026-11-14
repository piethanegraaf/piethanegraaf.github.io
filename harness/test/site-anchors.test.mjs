// site-anchors.mjs: old anchors of the literature review, sent on to the page under /research/ that has them.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { anchorMap, anchorScript, articleIds, inject, overviews } from "../site-anchors.mjs";

const page = (body) => `<html><head><title>t</title></head><body><nav id="__drawer"><a id="nav-1">x</a></nav>
<article class="md-content__inner md-typeset">${body}</article><footer id="footer"></footer></body></html>`;

test("articleIds: the ids of the article only, not of the theme or the footnotes", () => {
  const html = page(`<h1 id="title">T</h1><a id="1-executive-summary"></a><h2 id="summary">S</h2><sup id="fnref:1"></sup><li id="fn:1"></li><div id="__mermaid_0"></div>`);
  assert.deepEqual(articleIds(html), ["title", "1-executive-summary", "summary"]);
  assert.deepEqual(articleIds("<html></html>"), []);
});

test("anchorMap: ids of the pages under the overview, without the overview's own", () => {
  const map = anchorMap(["title", "key-findings"], { literature: ["literature-review", "22-friction", "key-findings"], design: ["211-synthesis"] });
  assert.deepEqual(map, { literature: ["literature-review", "22-friction"], design: ["211-synthesis"] });
  assert.throws(() => anchorMap([], { a: ["x"], b: ["x"] }), /#x is on a and on b/);
  assert.throws(() => anchorMap([], { "../evil": ["x"] }), /unexpected page name/);
  assert.deepEqual(anchorMap([], { a: ["ok", "with space", "</script>"] }), { a: ["ok"] });
});

const run = (script, hash) => {
  const calls = [];
  const code = script.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
  vm.runInNewContext(code, { location: { hash, replace: (u) => calls.push(u) } });
  return calls;
};

test("the script sends a known anchor to its page, and leaves the rest alone", () => {
  const script = anchorScript({ literature: ["22-friction"], design: ["211-synthesis"] });
  assert.deepEqual(run(script, "#211-synthesis"), ["design/#211-synthesis"]);
  assert.deepEqual(run(script, "#22-friction"), ["literature/#22-friction"]);
  assert.deepEqual(run(script, "#key-findings"), [], "an anchor of the overview itself");
  assert.deepEqual(run(script, ""), []);
  assert.deepEqual(run(script, "#22"), [], "only whole ids");
});

test("inject puts the script at the end of the head, once", () => {
  const html = inject(page("<h1 id=t>T</h1>"), anchorScript({ a: ["x"] }));
  assert.ok(/<script data-anchor-map>[\s\S]*<\/script>\n<\/head>/.test(html));
  assert.throws(() => inject(html, anchorScript({ a: ["x"] })), /already has an anchor map/);
  assert.throws(() => inject("<html><body></body></html>", "<script></script>"), /no <\/head>/);
});

test("overviews: one per language, not the /en/ redirect page", () => {
  assert.deepEqual(overviews(["research/index.html", "nl/research/index.html", "en/research/index.html", "research/literature/index.html", "index.html"].map((f) => f.replace(/\//g, path.sep))), ["nl/research/index.html", "research/index.html"]);
});

test("the command adds the map to each overview of a built site", async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "anchors-"));
  const write = (rel, html) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), html);
  };
  write("research/index.html", page(`<h1 id="t">T</h1>`));
  write("research/literature/index.html", page(`<h1 id="lit">L</h1><h2 id="22-friction">F</h2>`));
  write("nl/research/index.html", page(`<h1 id="t">T</h1>`));
  write("nl/research/literature/index.html", page(`<h2 id="22-frictie">F</h2>`));
  write("en/research/index.html", "<html><head></head><body>moved</body></html>");
  const { execFileSync } = await import("node:child_process");
  const script = fileURLToPath(new URL("../site-anchors.mjs", import.meta.url));
  execFileSync(process.execPath, [script, dir]);
  assert.match(fs.readFileSync(path.join(dir, "research/index.html"), "utf8"), /"literature":\["lit","22-friction"\]/);
  assert.match(fs.readFileSync(path.join(dir, "nl/research/index.html"), "utf8"), /"literature":\["22-frictie"\]/);
  assert.doesNotMatch(fs.readFileSync(path.join(dir, "en/research/index.html"), "utf8"), /anchor-map/);
  fs.rmSync(dir, { recursive: true, force: true });
});
