# Security review of 13 November 2026

A security review of the whole repository (`main`, `6846e01`), done with Claude Code agents: one review per area (the hooks and the guard; the installer, user-level gate, export and security check; the website, dashboard and CI), then one false-positive check per finding. Tests and the deliberately vulnerable practice exercises (`harness/maps/security-dotnet/exercises/`) were out of scope.

**Threat model.** The hooks are a commitment device, not a sandbox (research §7): the learner can always switch them off. The threat here is Claude itself: its own tool calls should not be able to write the learner's protected code, change the record or the harness, or write into graded work. The learner is trusted. Every finding was reproduced against the real `guard.mjs` in a temporary project.

**Disclosure.** The details are published together with their fixes, in the same pull request.

## Findings, by severity

| # | Severity | Finding | Where | Status |
|---|---|---|---|---|
| V1 | High | A quoted or escaped subcommand of `skill.mjs` passes the guard: Claude can grant itself an override, raise a level, or switch off graded work | `harness/hooks/guard.mjs` (`RECORD_CMD`) | open |
| V2 | High | `${HOME}`, other variables, backslash escapes and brace expansion hide a graded path from the guard: Claude can write, commit and push in graded work, and forge the AI-use log | `harness/hooks/shell.mjs`, `guard.mjs` (`resolvePath`) | open |
| V3 | Medium | A whole protected folder as the target (`rm -rf .claude/hooks`, `mv .claude …`, `rm -rf .learning`), a bare file name after `cd`, or an escape passes the guard; without its hook scripts the guard fails open | `harness/hooks/lib.mjs` (`isHarnessPath`, `isRecordFile`), `guard.mjs` (`looksLikePath`) | open |
| V4 | Medium | A folder as the target of a write or delete (`rm -rf <exercise>`, `cp -r … <exercise>`, `tar -C`, `unzip -d`, `git checkout -- <folder>`) reaches protected L1–L3 code | `harness/hooks/guard.mjs` (write targets) | open |
| V5 | Medium | The user-level files the harness installs (`~/.claude/settings.json`, `~/.claude/leerharnas/`) are not protected: one write switches off the user-level gate for graded work | `harness/hooks/lib.mjs`, `guard.mjs`, `harness/user/graded-gate.mjs` | open |
| V6 | Low | The reason of an override for a `sensitive` (security) skill is published in the dashboard export | `harness/export.mjs` (overrides) | open |
| V7 | Low | Links and short names (`cmd /c mklink /J`, Windows 8.3 names such as `PIETHA~1.IO`) reach protected paths under another name | `harness/hooks/guard.mjs`, `lib.mjs` (`rel`, `absPath`) | open |
| V8 | Low | The user-name filter misses names that begin or end with a non-ASCII letter (Zoë, André) and over-matches inside words (Zoëtje) | `harness/hooks/privacy.mjs` | open |
| V9 | Low | The configuration page says test names never leave the project; the export does publish them (method names) for skills that are not sensitive | `docs/*/configuration.md` | open |

Below the bar, not counted as findings: the website, the dashboard and the GitHub workflows (no findings); Claude-chosen ids of microskills of a sensitive skill (a short slug by design); history notes that happen to match a template (no path in the harness leads there).

## Known limits that stay

- **A script that Claude writes elsewhere and runs** (`node C:/Temp/w.mjs`) is not visible to the guard. This was already documented (research §10.8.3) and stays a limit of a hook-based guard.
- **Inline code** (`node -e`, `python -c`) outside graded work is not inspected.
- The learner can always switch the hooks off; the harness works because the learner chose it.
