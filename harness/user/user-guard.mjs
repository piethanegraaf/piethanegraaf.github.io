// Install, update or remove the user-level gate for graded work (review of 13 Nov, night, #61).
//
//   node harness/install.mjs <folder> --user-guard [--dry-run] [--yes]
//   node harness/install.mjs <folder> --user-guard --remove [--dry-run] [--yes]
//
// <folder> is a folder where the harness is installed; its record (also through learningDir) holds
// settings.graded.paths. Outside the target folder this is the only part of the installer that writes, and it
// only writes in ~/.claude/: the gate (leerharnas/graded-gate.mjs), its config (leerharnas/graded.json), two
// hooks in settings.json (merged, nothing else changes) and a marked block in CLAUDE.md. It shows the plan
// first and asks; every file that changes is copied to ~/.claude/leerharnas/backup/<time>/ first.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const GATE_MATCHER = "Read|Write|Edit|MultiEdit|NotebookEdit|NotebookRead|Glob|Grep|LS|Bash|PowerShell";
const GATE_CMD = /leerharnas[\\/]+graded-gate\.mjs/i;
export const BLOCK_START = "<!-- leerharnas:graded:start -->";
export const BLOCK_END = "<!-- leerharnas:graded:end -->";
// Folder names that say nothing about one assignment (a prompt naming them must not be blocked).
const GENERIC = new Set(["src", "source", "tests", "test", "docs", "domain", "application", "infrastructure", "presentation", "client",
  "server", "shared", "common", "core", "build", "scripts", "assets", "config", "models", "services"]);

const readText = (p) => { try { return fs.readFileSync(p, "utf8"); } catch { return null; } };
const slash = (p) => p.split(path.sep).join("/");

// The graded paths of the record of `folder` (absolute, with forward slashes), or [].
export function gradedPathsOf(folder) {
  let learn = path.join(folder, ".learning");
  try {
    const local = JSON.parse(readText(path.join(folder, ".claude", "leerharnas.local.json")) ?? "null");
    if (typeof local?.learningDir === "string") learn = path.resolve(local.learningDir.replace(/^\/([a-zA-Z])\//, "$1:/"));
  } catch { /* no local config */ }
  let data = null;
  try { data = JSON.parse(readText(path.join(learn, "skills.json")) ?? "null"); } catch { return { paths: [], lang: "nl" }; }
  const g = data?.settings?.graded;
  const raw = Array.isArray(g?.paths) ? g.paths.filter((x) => typeof x === "string" && x.trim()) : [];
  // A glob counts by its folder part; a relative path is relative to the folder.
  const folderPart = (p) => {
    const parts = p.replace(/\\/g, "/").split("/");
    const i = parts.findIndex((x) => /[*?[]/.test(x));
    return (i === -1 ? parts : parts.slice(0, i)).join("/");
  };
  const paths = raw.map(folderPart).filter(Boolean).map((p) => slash(path.resolve(folder, p.replace(/^\/([a-zA-Z])\//, "$1:/"))));
  return { paths: [...new Set(paths)], lang: data?.settings?.language === "en" ? "en" : "nl" };
}

// Extra names to block in prompts: subfolders with a solution or project file ("Webshop"), when specific.
export function namesOf(paths) {
  const out = new Set();
  for (const p of paths) {
    let entries = [];
    try { entries = fs.readdirSync(p, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (!e.isDirectory() || e.name.startsWith(".") || GENERIC.has(e.name.toLowerCase()) || e.name.length < 5) continue;
      let inner = [];
      try { inner = fs.readdirSync(path.join(p, e.name)); } catch { continue; }
      if (inner.some((f) => /\.(sln|slnx|csproj)$/i.test(f))) out.add(e.name);
    }
  }
  return [...out].sort();
}

function mergeSettings(text, home, remove) {
  let cfg = {};
  if (text !== null) {
    cfg = JSON.parse(text);
    if (!cfg || typeof cfg !== "object" || Array.isArray(cfg)) throw new Error("settings.json is not an object");
  }
  const hooks = {};
  for (const [ev, groups] of Object.entries(cfg.hooks ?? {})) {
    const kept = (Array.isArray(groups) ? groups : [])
      .map((g) => ({ ...g, hooks: (g.hooks ?? []).filter((h) => !GATE_CMD.test(String(h?.command ?? ""))) }))
      .filter((g) => g.hooks.length);
    if (kept.length) hooks[ev] = kept;
  }
  if (!remove) {
    const command = `node "${slash(path.join(home, ".claude", "leerharnas", "graded-gate.mjs"))}"`;
    hooks.UserPromptSubmit = [...(hooks.UserPromptSubmit ?? []), { hooks: [{ type: "command", command }] }];
    hooks.PreToolUse = [...(hooks.PreToolUse ?? []), { matcher: GATE_MATCHER, hooks: [{ type: "command", command }] }];
  }
  const next = { ...cfg };
  if (Object.keys(hooks).length) next.hooks = hooks; else delete next.hooks;
  return JSON.stringify(next, null, 2) + "\n";
}

function withBlock(text, block) {
  const cur = text ?? "";
  const re = new RegExp(`\\n*${BLOCK_START}[\\s\\S]*?${BLOCK_END}\\n?`);
  const without = cur.replace(re, "\n").replace(/\n{3,}$/, "\n\n");
  if (block === null) return without.trim() ? without.replace(/\s*$/, "\n") : "";
  return (without.trim() ? without.replace(/\s*$/, "\n\n") : "") + `${BLOCK_START}\n${block.trim()}\n${BLOCK_END}\n`;
}

// The plan: [{ file, action: new|replace|merge|delete|same, content }]. `t` translates messages.
export function planUserGuard({ home = os.homedir(), folder, remove = false, t }) {
  const dir = path.join(home, ".claude", "leerharnas");
  const files = {
    gate: path.join(dir, "graded-gate.mjs"),
    config: path.join(dir, "graded.json"),
    settings: path.join(home, ".claude", "settings.json"),
    claude: path.join(home, ".claude", "CLAUDE.md"),
  };
  const plan = [];
  const put = (file, next) => {
    const cur = readText(file);
    if (next === null) { if (cur !== null) plan.push({ file, action: "delete" }); return; }
    plan.push({ file, action: cur === null ? "new" : cur === next ? "same" : "replace", content: next });
  };
  let info = { paths: [], names: [], lang: "nl" };
  if (!remove) {
    const g = gradedPathsOf(folder);
    if (!g.paths.length) return { error: "install.userGuard.noGraded", plan: [], info };
    info = { paths: g.paths, names: namesOf(g.paths), lang: g.lang };
    put(files.gate, fs.readFileSync(path.join(HERE, "graded-gate.mjs"), "utf8"));
    put(files.config, JSON.stringify({
      paths: info.paths, names: info.names,
      messages: { prompt: t("install.userGuard.msgPrompt", { dir: info.paths.join(", ") }), tool: t("install.userGuard.msgTool", { dir: info.paths.join(", ") }) },
    }, null, 2) + "\n");
  } else {
    put(files.gate, null);
    put(files.config, null);
  }
  const settingsText = readText(files.settings);
  const nextSettings = mergeSettings(settingsText, home, remove);
  plan.push({ file: files.settings, action: settingsText === null ? "new" : settingsText === nextSettings ? "same" : "merge", content: nextSettings });
  const claudeText = readText(files.claude);
  const nextClaude = withBlock(claudeText, remove ? null : t("install.userGuard.claudeBlock", { dir: info.paths.join(", "), names: info.names.join(", ") || "-" }));
  if (claudeText === null && remove) { /* nothing to remove */ }
  else plan.push({ file: files.claude, action: claudeText === null ? "new" : claudeText === nextClaude ? "same" : "merge", content: nextClaude });
  return { plan, info, dir };
}

export function applyUserGuard({ plan, dir }) {
  const stamp = new Date().toISOString().replace(/[:]/g, "-").replace(/\..*$/, "");
  const backup = path.join(dir, "backup", stamp);
  let backups = 0;
  for (const p of plan) {
    if (p.action === "same" || p.action === "new") continue;
    if (fs.existsSync(p.file)) {
      fs.mkdirSync(backup, { recursive: true });
      fs.copyFileSync(p.file, path.join(backup, path.basename(p.file)));
      backups++;
    }
  }
  for (const p of plan) {
    if (p.action === "same") continue;
    if (p.action === "delete") { fs.rmSync(p.file, { force: true }); continue; }
    fs.mkdirSync(path.dirname(p.file), { recursive: true });
    fs.writeFileSync(p.file, p.content);
  }
  return { backups, backup };
}
