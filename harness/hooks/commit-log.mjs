// Commit (and push) the AI-use log of graded work, and nothing else (setup review of 14 Nov, #64).
//
//   node .claude/hooks/commit-log.mjs [--push] [--dry-run]
//
// In graded work Claude makes no commit: version control is graded (OER art. 7.11, AI level 1). The AI-use log
// (settings.graded.logDir, default <repo>/ai-verantwoording) is not the student's work, though: the hooks write
// it, and the student writes the last column. Committing it by hand after every session is a chore, so after
// /diary the harness asks "AI-verantwoording nu committen?" and, on a yes, Claude runs this script. The guard
// allows this copy only (in .claude/hooks/, protected like every hook) and logs it as tooling in the AI-use log.
//
// What it does, with fixed text only:
// - refuses when anything is staged already (the student's own work never goes into this commit);
// - stages only the log folder, checks that nothing else is staged, and commits with a fixed message;
// - with --push: pushes only when this commit is the only one not on the upstream yet, never with force.
//   Unpushed commits of the student are the student's to push.
import path from "node:path";
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { t, loadSkills, gradedOf } from "./lib.mjs";

const git = (repo, args) => {
  const r = spawnSync("git", ["-C", repo, ...args], { encoding: "utf8", windowsHide: true });
  return { ok: r.status === 0, out: (r.stdout ?? "").trim(), err: (r.stderr ?? "").trim() };
};
const lines = (s) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

// Returns { code, messages }. `now` for the date in the title.
export function commitLog(G, { push = false, dryRun = false, now = new Date() } = {}) {
  const say = [];
  const out = (code) => ({ code, messages: say });
  if (!G) { say.push(t("cl.noGraded")); return out(1); }
  const logDir = G.logDir;
  if (!fs.existsSync(logDir)) { say.push(t("cl.noLog", { dir: logDir })); return out(1); }
  const top = git(logDir, ["rev-parse", "--show-toplevel"]);
  // The folder relative to the repo, as git sees it: a short 8.3 name (RUNNER~1) or a link in the setting
  // would make path.relative() leave the repo, while git resolves both.
  const prefix = git(logDir, ["rev-parse", "--show-prefix"]);
  if (!top.ok || !prefix.ok) { say.push(t("cl.noRepo", { dir: logDir })); return out(1); }
  const repo = top.out;
  const rel = prefix.out.replace(/\/+$/, "");
  if (!rel) { say.push(t("cl.noRepo", { dir: logDir })); return out(1); }
  const staged = git(repo, ["diff", "--cached", "--name-only"]);
  if (!staged.ok) { say.push(staged.err); return out(1); }
  if (lines(staged.out).length) { say.push(t("cl.staged", { list: lines(staged.out).slice(0, 5).join(", ") })); return out(1); }
  const changed = lines(git(repo, ["status", "--porcelain", "--", rel]).out);
  if (!changed.length) { say.push(t("cl.nothing", { dir: rel })); return out(0); }
  if (dryRun) { say.push(t("cl.dryRun", { n: changed.length, dir: rel })); return out(0); }
  const add = git(repo, ["add", "-A", "--", rel]);
  if (!add.ok) { say.push(add.err); return out(1); }
  const names = lines(git(repo, ["diff", "--cached", "--name-only"]).out);
  if (!names.length || names.some((n) => !n.startsWith(rel + "/"))) {
    git(repo, ["reset", "-q", "--", rel]);
    say.push(t("cl.outside", { list: names.filter((n) => !n.startsWith(rel + "/")).join(", ") }));
    return out(1);
  }
  const day = now.toLocaleDateString("sv-SE");
  const commit = git(repo, ["commit", "-q", "-m", t("cl.title", { day }), "-m", t("cl.body", { dir: rel })]);
  if (!commit.ok) { git(repo, ["reset", "-q", "--", rel]); say.push(commit.err || commit.out); return out(1); }
  say.push(t("cl.committed", { n: names.length, dir: rel }));
  if (!push) return out(0);
  const up = git(repo, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"]);
  if (!up.ok) { say.push(t("cl.noUpstream")); return out(0); }
  const ahead = lines(git(repo, ["rev-list", "@{u}..HEAD"]).out);
  if (ahead.length !== 1) { say.push(t("cl.ownCommits", { n: ahead.length - 1 })); return out(0); }
  const p = git(repo, ["push"]);
  if (!p.ok) { say.push(t("cl.pushFailed", { err: p.err.split(/\r?\n/).slice(-2).join(" ") })); return out(1); }
  say.push(t("cl.pushed", { upstream: up.out }));
  return out(0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let G = null;
  try { G = gradedOf(loadSkills()); } catch { /* no record: G stays null */ }
  const r = commitLog(G, { push: args.includes("--push"), dryRun: args.includes("--dry-run") });
  for (const m of r.messages) console.log(m);
  process.exit(r.code);
}
