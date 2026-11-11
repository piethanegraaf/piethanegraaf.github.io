// security-check.mjs: the rules give the right outcome. Fake secrets are built from pieces at run time,
// so this file itself contains none.
import { test } from "node:test";
import assert from "node:assert/strict";
import { nameRules, contentRules, webRules, ciRules, requirementsRules, harnessRules, copyrightRules, commitEmailFindings } from "../security-check.mjs";

const levels = (findings) => findings.map((f) => `${f.level} ${f.rule}`);
const has = (findings, level, rule) => findings.some((f) => f.level === level && f.rule === rule);

test("file names: forbidden types and data are BLOKKEER, images are TWIJFEL, code is fine", () => {
  for (const f of ["docs/toetsopdracht.pdf", "notes/x.docx", "a.zip", "uml/klassen.drawio", ".learning/skills.json", "x/events.jsonl",
    "state/session-abc.json", "peerfeedback-x.md", ".env", "config/.env.local", "lesopdracht-week-1.md", "data.sqlite"]) {
    assert.ok(nameRules(f).some((x) => x.level === "BLOKKEER"), f);
  }
  assert.ok(has(nameRules("docs/img/screen.png"), "TWIJFEL", "file.image"));
  assert.ok(has(nameRules("tool.exe"), "BLOKKEER", "file.unknown"));
  // XML only as a sitemap, by name.
  for (const f of ["data/export.xml", "site-src/feed.xml", "sitemap.xml.bak", "site-src/notasitemap.xml"]) assert.ok(has(nameRules(f), "BLOKKEER", "file.unknown"), f);
  for (const f of ["harness/hooks/lib.mjs", "docs/nl/index.md", "mkdocs.yml", "requirements.txt", "LICENSE-docs", ".gitignore", "site-src/dashboard/app.js",
    "overrides/sitemap.xml", "site-src/sitemap-tools.xml", "CITATION.cff"]) {
    assert.deepEqual(nameRules(f), [], f);
  }
});

test("secrets are BLOKKEER", () => {
  const fake = {
    github: "gh" + "p_" + "a".repeat(36),
    pat: "github" + "_pat_" + "B".repeat(30),
    aws: "AK" + "IA" + "ABCDEFGHIJKLMNOP",
    anthropic: "sk-" + "ant-" + "x".repeat(30),
    key: "-----BEGIN " + "RSA PRIVATE KEY-----",
  };
  for (const [name, value] of Object.entries(fake)) {
    assert.ok(contentRules("x.md", `token = ${value}`).some((f) => f.level === "BLOKKEER" && f.rule.startsWith("secret.")), name);
  }
  assert.ok(has(contentRules("config.json", `"password": "${"geheim" + "123"}"`), "TWIJFEL", "secret.password"));
  assert.deepEqual(contentRules("x.md", "Een gewone zin over sk-learn en tokens."), []);
});

test("privacy: e-mails, paths, session ids and transcripts", () => {
  assert.ok(has(contentRules("x.md", "mail jan@bedrijf.nl"), "TWIJFEL", "privacy.email"));
  assert.deepEqual(contentRules("x.md", "mail test@example.com of 1+x@users.noreply.github.com"), []);
  assert.ok(has(contentRules("x.md", "C:\\Users\\iemand\\x"), "TWIJFEL", "privacy.path"));
  assert.ok(has(contentRules("x.md", "id 1b8a483e-bd12-4b28-b493-d351e79a6c31"), "TWIJFEL", "privacy.uuid"));
  assert.ok(has(contentRules("x.md", "zie ~/.claude/" + "projects/x/y.jsonl"), "BLOKKEER", "privacy.transcript"));
  assert.deepEqual(contentRules("x.md", "[pdf](https://www.example.org/_assets/1b8a483e-bd12-4b28-b493-d351e79a6c31/x.pdf) en https://hrw.example.org/nl/home/verslagen/"), [],
    "ids and paths inside web addresses are fine");
});

test("web: external scripts need SRI, the dashboard needs CSP and no HTML sinks", () => {
  const ext = `<script src="https://cdn.example.com/x.js"></script>`;
  assert.ok(has(webRules("site-src/cheatsheet/index.html", ext), "BLOKKEER", "web.external-script"));
  assert.ok(!has(webRules("site-src/cheatsheet/index.html", `<script src="https://cdn.example.com/x.js" integrity="sha384-abc"></script>`), "BLOKKEER", "web.external-script"));
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'self'">`;
  assert.ok(has(webRules("site-src/dashboard/index.html", "<html></html>"), "BLOKKEER", "web.csp"));
  assert.ok(!has(webRules("site-src/dashboard/index.html", `<html><head>${csp}</head></html>`), "BLOKKEER", "web.csp"));
  assert.ok(has(webRules("site-src/dashboard/app.js", "el.innerHTML = text;"), "BLOKKEER", "web.html-sink"));
  assert.ok(has(webRules("site-src/cheatsheet/app.js", "el.innerHTML = text;"), "TWIJFEL", "web.html-sink"));
  assert.ok(has(webRules("site-src/dashboard/app.js", "ev" + "al(code)"), "BLOKKEER", "web.eval"));
  assert.deepEqual(webRules("site-src/dashboard/app.js", "el.textContent = text; re.exec(s);"), []);
  assert.ok(has(webRules("site-src/dashboard/index.html", `${csp}<script>alert(1)</script>`), "BLOKKEER", "web.inline-script"));
  assert.deepEqual(levels(webRules("site-src/dashboard/index.html", `${csp}<link href="https://fonts.googleapis.com/css2?family=X" rel="stylesheet">`)), []);
  // A Search Console verification file needs no CSP, but only in its exact form.
  const gv = "google0123456789abcdef.html";
  assert.deepEqual(webRules(`site/${gv}`, `google-site-verification: ${gv}\n`, { built: true }), []);
  assert.ok(has(webRules(`site/${gv}`, `<script>x()</script>google-site-verification: ${gv}`, { built: true }), "BLOKKEER", "web.csp"));
});

test("CI: pinned actions, minimal permissions, no pull_request_target", () => {
  const good = `name: x\non: [push]\npermissions:\n  contents: read\njobs:\n  build:\n    steps:\n      - uses: actions/checkout@${"a".repeat(40)} # v7\n`;
  assert.deepEqual(ciRules("w.yml", good), []);
  assert.ok(has(ciRules("w.yml", good.replace(`@${"a".repeat(40)}`, "@v7")), "BLOKKEER", "ci.unpinned"));
  assert.ok(has(ciRules("w.yml", good.replace("permissions:\n  contents: read\n", "")), "BLOKKEER", "ci.permissions"));
  assert.ok(has(ciRules("w.yml", good.replace("on: [push]", "on: [pull_request_target]")), "BLOKKEER", "ci.pull-request-target"));
  assert.ok(has(ciRules("w.yml", good.replace("contents: read", "contents: write")), "BLOKKEER", "ci.write"));
  assert.ok(has(ciRules("w.yml", good + "      - run: echo ${{ github.event.pull_request.title }}\n"), "TWIJFEL", "ci.injection"));
  assert.deepEqual(requirementsRules("requirements.txt", "# x\nmkdocs==1.6.1\ncolorama==0.4.6 ; platform_system == 'Windows'\n"), []);
  assert.ok(has(requirementsRules("requirements.txt", "mkdocs>=1.6\n"), "BLOKKEER", "ci.unpinned-python"));
});

test("harness code: no network, eval or shell", () => {
  assert.ok(has(harnessRules("harness/hooks/x.mjs", `import https from "node:https";`), "BLOKKEER", "harness.network"));
  assert.ok(has(harnessRules("harness/hooks/x.mjs", "await fe" + "tch(url)"), "BLOKKEER", "harness.network"));
  assert.ok(has(harnessRules("harness/hooks/x.mjs", `import { ex` + `ecSync } from "node:child_process";`), "BLOKKEER", "harness.shell"));
  assert.ok(has(harnessRules("harness/hooks/x.mjs", "spawn(cmd, { she" + "ll: true })"), "BLOKKEER", "harness.shell"));
  assert.deepEqual(harnessRules("harness/hooks/x.mjs", `spawnSync("dotnet", ["test", dir]); const m = re.exec(s);`), []);
  assert.deepEqual(harnessRules("harness/test/x.test.mjs", "ev" + "al(x)"), [], "tests are not installed");
});

test("commit e-mails: noreply is fine, other addresses block; a github.com merge only with a decision", () => {
  const own = { sha: "a".repeat(40), author: "1+jdoe@users.noreply.github.com", committer: "1+jdoe@users.noreply.github.com", parents: 1 };
  assert.deepEqual(commitEmailFindings(own), []);
  const work = { ...own, author: "jdoe@bedrijf.example", committer: "jdoe@bedrijf.example" };
  assert.ok(has(commitEmailFindings(work), "BLOKKEER", "privacy.commit-email"));
  const merge = { sha: "b".repeat(40), author: "jdoe@mail.example", committer: "noreply@github.com", parents: 2 };
  assert.ok(has(commitEmailFindings(merge), "BLOKKEER", "privacy.commit-email"), "no decision: blocked");
  const decided = { githubMerges: { allow: true, reason: "besluit" } };
  assert.ok(has(commitEmailFindings(merge, decided), "OK", "privacy.commit-email"));
  assert.ok(has(commitEmailFindings({ ...merge, parents: 1 }, decided), "BLOKKEER", "privacy.commit-email"), "only real merges");
  assert.ok(has(commitEmailFindings({ ...merge, committer: "jdoe@mail.example" }, decided), "BLOKKEER", "privacy.commit-email"), "only merges by GitHub");
  assert.ok(has(commitEmailFindings(merge, { githubMerges: { allow: true } }), "BLOKKEER", "privacy.commit-email"), "a decision needs a reason");
});

test("copyright: long quotes in research notes are TWIJFEL", () => {
  const quote = "> " + Array.from({ length: 45 }, (_, i) => `woord${i}`).join(" ");
  assert.ok(has(copyrightRules("docs/nl/research_notes/artikel.md", quote), "TWIJFEL", "copyright.quote"));
  assert.deepEqual(copyrightRules("docs/nl/index.md", quote), []);
  assert.deepEqual(copyrightRules("docs/nl/research_notes/artikel.md", "> kort citaat"), []);
});
