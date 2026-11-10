// tools/fix-md-lists.mjs: lists render in Python-Markdown, and no word changes.
import { test } from "node:test";
import assert from "node:assert/strict";
import { fixLists } from "../tools/fix-md-lists.mjs";

const words = (s) => s.split(/\s+/).filter(Boolean).join(" ");

test("2-space nesting becomes 4 spaces, and a list after a paragraph gets a blank line", () => {
  const src = "**Title:**\n- a\n  - b\n    - c\n- d";
  const out = fixLists(src);
  assert.equal(out, "**Title:**\n\n- a\n    - b\n        - c\n- d");
  assert.equal(words(out), words(src));
});

test("an item after a continuation paragraph gets a blank line", () => {
  assert.equal(fixLists("- a\n\n    more about a\n- b"), "- a\n\n    more about a\n\n- b");
});

test("4-space lists, code blocks and admonitions stay as they are", () => {
  const cards = "- **Install**\n\n    Put it in your folder.\n\n    [Go](install.md)\n";
  assert.equal(fixLists(cards), cards);
  const code = "```\n- not a list\n  - really\n```";
  assert.equal(fixLists(code), code);
  const box = '!!! example "Example"\n    Text in the box.\n    - one\n      - two';
  assert.equal(fixLists(box), '!!! example "Example"\n    Text in the box.\n    \n    - one\n        - two');
});
