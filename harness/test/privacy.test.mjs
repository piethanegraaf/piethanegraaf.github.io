// The template itself contains no personal data: no e-mail addresses, user folders, session ids,
// learner names or learning progress. (The full check before publishing is security-check.mjs.)
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { HARNESS } from "./helpers.mjs";

// The tests themselves contain fake personal-looking data on purpose (example.com, jdoe, a fake UUID).
const files = fs.readdirSync(HARNESS, { recursive: true })
  .map((f) => String(f))
  .filter((f) => !f.split(/[\\/]/).includes("test") && !f.split(/[\\/]/).includes("node_modules"))
  .map((f) => path.join(HARNESS, f))
  .filter((f) => fs.statSync(f).isFile() && /\.(mjs|js|json|md)$/i.test(f));

const PATTERNS = [
  ["e-mailadres", /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i],
  ["Windows-gebruikersmap", /[A-Z]:[\\/]+Users[\\/]+[^\\/\s"'`*.]+/i],
  ["Git Bash-gebruikersmap", /\/[a-z]\/Users\/[^/\s"'`*.]+/i],
  ["Unix-gebruikersmap", /\/(home|Users)\/[a-z][\w.-]+\//],
  ["sessie-UUID", /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i],
];

test("no personal data patterns in harness files", () => {
  const hits = [];
  for (const f of files) {
    const text = fs.readFileSync(f, "utf8");
    for (const [what, re] of PATTERNS) {
      const m = text.match(re);
      if (m) hits.push(`${path.relative(HARNESS, f)}: ${what} (${m[0]})`);
    }
  }
  assert.deepEqual(hits, []);
});

test("maps contain no learner, progress or evidence", () => {
  for (const dir of fs.readdirSync(path.join(HARNESS, "maps"))) {
    const map = JSON.parse(fs.readFileSync(path.join(HARNESS, "maps", dir, "skills.json"), "utf8"));
    assert.equal(map.learner, undefined, `${dir}: learner`);
    for (const s of map.skills) {
      for (const k of ["history", "evidence", "nextReview", "intervalIndex", "failStreak", "lastReview"]) {
        assert.equal(s[k], undefined, `${dir}/${s.id}: ${k}`);
      }
    }
  }
});
