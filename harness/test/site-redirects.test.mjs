// site-redirects.mjs: the old /en/ addresses send visitors on to the English pages at the root.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { englishPages, redirectPage, SITE_URL } from "../site-redirects.mjs";
import { addCsp } from "../site-csp.mjs";
import { HARNESS } from "./helpers.mjs";

test("only the English pages get a redirect: not Dutch, assets, search, the dashboard or other files", () => {
  const files = [
    "index.html", "404.html", "install/index.html", "notes/eternal_junior/index.html", "cheatsheet/index.html",
    "nl/index.html", "nl/install/index.html", "assets/x/index.html", "search/index.html",
    "dashboard/index.html", "sitemap.xml", "googleabc.html", "en/index.html",
  ];
  assert.deepEqual(englishPages(files), ["", "cheatsheet/", "install/", "notes/eternal_junior/"]);
  assert.deepEqual(englishPages(["install\\index.html"]), ["install/"], "Windows separators");
});

test("a redirect page has a canonical link, keeps the anchor, works without JavaScript and passes the CSP", () => {
  const html = redirectPage("research/");
  assert.ok(html.includes(`<link rel="canonical" href="${SITE_URL}research/">`));
  assert.match(html, /<script>location\.replace\(.*\+ location\.hash\)<\/script>/);
  assert.ok(html.includes(`<noscript><meta http-equiv="refresh" content="0; url=/research/"></noscript>`));
  assert.ok(html.includes(`<a href="/research/">`));
  const withCsp = addCsp(html);
  assert.match(withCsp, /script-src 'self' 'sha256-[^']+'/, "the inline script is allowed by its hash");
  assert.equal(redirectPage("").includes(`url=/"`), true, "the home page goes to /");
  assert.throws(() => redirectPage(`x"><script>`), /unexpected page path/);
  assert.throws(() => redirectPage("../x/"), /unexpected page path/);
});

test("the script writes /en/<page>/index.html for every English page, and stops when one exists", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "site-redirects-"));
  for (const f of ["index.html", "install/index.html", "nl/index.html"]) {
    fs.mkdirSync(path.join(dir, path.dirname(f)), { recursive: true });
    fs.writeFileSync(path.join(dir, f), "<!doctype html><html><head></head></html>");
  }
  const run = () => spawnSync(process.execPath, [path.join(HARNESS, "site-redirects.mjs"), dir], { encoding: "utf8" });
  const first = run();
  assert.equal(first.status, 0, first.stderr);
  assert.ok(fs.existsSync(path.join(dir, "en/index.html")));
  assert.ok(fs.readFileSync(path.join(dir, "en/install/index.html"), "utf8").includes(`${SITE_URL}install/`));
  assert.ok(!fs.existsSync(path.join(dir, "en/nl")), "no redirect for Dutch pages");
  const second = run();
  assert.notEqual(second.status, 0, "a page that already uses an /en/ address stops the build");
  fs.rmSync(dir, { recursive: true, force: true });
});
