// Which tool runs the harness (opencode plan): Claude Code (.claude/) or opencode (.opencode/). The core is
// installed in <project>/<host dir>/core/, so the folder above it names the host. In the source repository
// (harness/core/) it is Claude Code. LEERHARNAS_HOST (claude-code | opencode) overrides it, for tests.
//
// The rules, messages and commands are written for Claude Code. hostText() turns them into the other host's
// words: script paths (.claude/hooks/ -> .opencode/hooks/), the rules file and the tool's name. It changes
// nothing for Claude Code.
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const installedIn = path.basename(path.dirname(HERE)).toLowerCase();
const fromEnv = String(process.env.LEERHARNAS_HOST ?? "").toLowerCase();

export const HOST = fromEnv === "opencode" || fromEnv === "claude-code" ? fromEnv : installedIn === ".opencode" ? "opencode" : "claude-code";
export const HOST_DIR = HOST === "opencode" ? ".opencode" : ".claude";
export const HOSTS = ["claude-code", "opencode"];
export const HOST_DIRS = [".claude", ".opencode"];

// [from, to] for opencode, applied in order (the longest first).
const OPENCODE_WORDS = [
  [/\.claude([\\/])hooks\1/g, ".opencode$1hooks$1"],
  [/\.claude([\\/])settings(\.local)?\.json/g, ".opencode$1opencode.jsonc"],
  [/\.claude([\\/])leerharnas\.md/g, ".opencode$1leerharnas.md"],
  [/\.claude([\\/])(skills|agents|core)\1/g, ".opencode$1$2$1"],
  [/\bCLAUDE\.md\b/g, "AGENTS.md"],
  [/\bClaude Code\b/g, "opencode"],
];

export function hostText(s, host = HOST) {
  if (host !== "opencode" || typeof s !== "string") return s;
  let out = s;
  for (const [re, to] of OPENCODE_WORDS) out = out.replace(re, to);
  return out;
}

// The learner's CLI as a command line for this host: `node .claude/hooks/skill.mjs` or `node .opencode/hooks/skill.mjs`.
export const cliPath = (script = "skill.mjs") => `${HOST_DIR}/hooks/${script}`;
