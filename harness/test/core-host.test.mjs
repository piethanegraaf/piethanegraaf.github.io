// The host of the harness (opencode plan): messages in the host's words, and both hosts' files protected.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";

import { hostText } from "../core/host.mjs";
import { isHarnessPath } from "../core/lib.mjs";

test("host: hostText changes nothing for Claude Code and renames paths for opencode", () => {
  const s = "Run `! node .claude/hooks/skill.mjs status`, see CLAUDE.md and .claude/settings.json in Claude Code.";
  assert.equal(hostText(s, "claude-code"), s);
  assert.equal(hostText(s, "opencode"), "Run `! node .opencode/hooks/skill.mjs status`, see AGENTS.md and .opencode/opencode.jsonc in opencode.");
  assert.equal(hostText(".claude\\hooks\\check.mjs", "opencode"), ".opencode\\hooks\\check.mjs");
});

test("host: the harness files of both hosts are protected, whichever host runs", () => {
  for (const r of [".claude/hooks/guard.mjs", ".claude/core/lib.mjs", ".opencode/hooks/skill.mjs", ".opencode/core/guard.mjs",
    ".opencode/plugins/leerharnas/index.mjs", ".opencode/skills/diary/SKILL.md", ".opencode/agents/demotie-analist.md",
    ".opencode/opencode.jsonc", "opencode.json", "opencode.jsonc", ".opencode/leerharnas.md"]) assert.ok(isHarnessPath(r), r);
  for (const r of [".opencode/plugins/other/index.mjs", ".opencode/skills/mine/SKILL.md", "src/opencode.json.cs"]) assert.equal(isHarnessPath(r), false, r);
});

test("host: LEERHARNAS_HOST=opencode puts the CLI path of opencode in the messages", () => {
  const code = `import { t } from ${JSON.stringify(new URL("../core/i18n.mjs", import.meta.url).href)}; process.stdout.write(t("guard.recordFile"));`;
  const say = (host) => spawnSync(process.execPath, ["--input-type=module", "-e", code], { env: { ...process.env, LEERHARNAS_HOST: host }, encoding: "utf8" }).stdout;
  assert.match(say("claude-code"), /\.claude\/hooks\/skill\.mjs/);
  assert.match(say("opencode"), /\.opencode\/hooks\/skill\.mjs/);
  assert.doesNotMatch(say("opencode"), /\.claude\//);
});
