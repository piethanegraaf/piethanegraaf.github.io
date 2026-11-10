// In CI the logs are public: the security check must never print a found value there.
import { test } from "node:test";
import assert from "node:assert/strict";
import os from "node:os";

process.env.CI = "true"; // before the import: the module decides CI mode when it loads
const { contentRules } = await import("../security-check.mjs");

test("CI: a found e-mail address or path is reported, but not printed", () => {
  const mail = contentRules("x.md", "mail jan@bedrijf.nl");
  assert.equal(mail[0].rule, "privacy.email");
  assert.ok(!mail[0].detail.includes("jan@bedrijf.nl"), "the printed detail hides the address");
  const p = contentRules("x.md", "zie C:\\Users\\iemand\\x");
  assert.equal(p[0].rule, "privacy.path");
  assert.ok(!p[0].detail.includes("iemand"), "the printed detail hides the path");
});

test("CI: the account name of the runner is not treated as a person", () => {
  const name = os.userInfo().username;
  assert.deepEqual(contentRules("x.md", `de test ${name} draait`).filter((f) => f.rule === "privacy.user-name"), []);
});
