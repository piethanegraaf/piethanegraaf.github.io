// site-csp.mjs: hashes of inline scripts, SRI for external scripts, pages with their own CSP stay as they are.
import { test } from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { cspFor, addCsp, ANALYTICS_ENDPOINT } from "../site-csp.mjs";

const sha = (s) => `'sha256-${crypto.createHash("sha256").update(s, "utf8").digest("base64")}'`;

test("inline scripts are allowed by hash; JSON data blocks are skipped", () => {
  const csp = cspFor(`<script>a()</script><script type="application/json">{"x":1}</script>`);
  assert.match(csp, /^default-src 'self'; script-src 'self' 'sha256-/);
  assert.ok(csp.includes(sha("a()")));
  assert.ok(!csp.includes(sha(`{"x":1}`)));
  assert.ok(!/unsafe-(inline|eval)'[^;]*;\s*style/.test(csp.split("style-src")[0]), "no unsafe for scripts");
});

test("connect-src allows only the site itself and the GoatCounter endpoint", () => {
  assert.equal(ANALYTICS_ENDPOINT, "https://piethanegraaf.goatcounter.com/count");
  const connect = cspFor("").split("; ").find((d) => d.startsWith("connect-src"));
  assert.equal(connect, `connect-src 'self' ${ANALYTICS_ENDPOINT}`);
  assert.match(cspFor(""), /img-src 'self' data:;/, "count.js needs no extra img-src");
});

test("CRLF is hashed as the browser sees it (LF)", () => {
  assert.ok(cspFor("<script>a();\r\nb();</script>").includes(sha("a();\nb();")));
});

test("external scripts need SRI, and their origin is added", () => {
  assert.throws(() => cspFor(`<script src="https://cdn.example.com/x.js"></script>`), /without SRI/);
  const csp = cspFor(`<script src="https://cdn.example.com/x.js" integrity="sha384-abc" crossorigin="anonymous"></script><script src="local.js"></script>`);
  assert.match(csp, /script-src 'self' https:\/\/cdn\.example\.com;/);
});

test("addCsp puts the meta tag first in <head>, and leaves pages with a CSP alone", () => {
  const out = addCsp(`<!doctype html><html><head><meta charset="utf-8"><script>x()</script></head></html>`);
  assert.match(out, /<head><meta http-equiv="Content-Security-Policy" content="default-src 'self'/);
  assert.equal(addCsp(`<head><meta http-equiv="Content-Security-Policy" content="default-src 'self'"></head>`), null);
});
