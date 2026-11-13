---
title: "Configuration and privacy: settings, skill maps, data"
description: "Change the harness settings, make a skill map for your own course, and see which learning data stays local and what the filtered export may publish."
---
# Configuration and privacy

## Settings

The settings live in `.learning/skills.json`, under `settings`. Change them with `! node .claude/hooks/skill.mjs setting <key> <value>`, or by hand.

| Key | Default | Meaning |
|---|---|---|
| `course` | `""` | The name of the course, for the session start and the dashboard. |
| `language` | `nl` | `nl` or `en`: the language of the messages. Recognition always works in both languages. |
| `examDate` | none | The exam date. Reviews (L4) fall at least 3 days before it. |
| `defaultLevel` | `L2` | The level of code that belongs to no skill. |
| `stuckTimerMinutes` | `12` | After this many minutes of **active time** being stuck, a new rung may unlock without an attempt. |
| `idleMinutes` | `20` | A longer break does not count as active time: not for the stuck timer, not for the minutes per task and not for the message after an hour. |
| `targetSuccess` | `0.85` | The target for moving from L2 to L3. |
| `autoDemote` | `false` | Automatic demotion on evidence, with the demotion analyst for a main skill. Only turn it on once the logging has been reliable for a few sessions: `setting autoDemote true`. |
| `dashboardRepo` | none | The absolute path of your clone of the repo with the dashboard, so that `/diary` can update the dashboard from your practice folder. `off` when you do not use the dashboard: then `/diary` does not ask about it. See [After the diary](progress-dashboard.md#after-the-diary). |
| `graded` | none | Graded work: `{ paths, aiLevel, maxRung, logDir }`. Set it with `setting graded add "<path>"`; see [Graded work](how-it-works.md#graded-work). `aiLevel` 1 (default) gives the hint ladder up to `maxRung` (default and at most 4); `aiLevel` 0 gives no help. `logDir` defaults to `ai-verantwoording/` in the first path. |
| `codeExtensions` | `cs, csproj, sln, slnx` | Which files are the learner's code. The OOD map adds `razor, cshtml, sql, yml, yaml`, for a project with a UI, a database and a pipeline. |
| `codeFiles` | (empty) | Files without a telling extension that are also the learner's work, by name. `*` stands for anything but `/`. The OOD map sets `Dockerfile, appsettings*.json`. |
| `buildCommands` | `dotnet build/test/run …`, `msbuild` | Regular expressions for commands that build or test. `check.mjs` always counts. |
| `toolingTerms` | `rider, sdk, nuget …` | Tooling words: "it works" about these is not a solved task. |

An invalid value falls back to the default, so the guard never lets everything through.

## Claude Code settings

The installer also sets `"promptSuggestionEnabled": false` in `.claude/settings.json`. Otherwise Claude Code suggests your next prompt itself, and such a suggestion can give a hint away. If you set the value to `true` yourself, the installer keeps your choice.

## Your own course

A map lives in `harness/maps/<id>/`:

- `skills.json`: the skills with their paths (globs), and the default settings. Titles may be bilingual: `{"nl": "…", "en": "…"}`.
- `keywords.json`: keywords that link a prompt to a skill.
- `notes.nl.md` and `notes.en.md`: course-specific agreements for Claude.

For a language other than C#, set `codeExtensions` and `buildCommands`. For now `check.mjs` only works with `dotnet test`.

There are two maps:

- **`ood`:** Object-Oriented Design in C#, with numbered exercise folders. Code that belongs to no skill is L2.
- **`junior-dotnet`:** an example map for a junior developer at work, in C#/.NET. Ten skills: debugging, reading unfamiliar code, unit tests, safe refactoring, ASP.NET Core APIs, EF Core, async/await, security basics, reviewing code written by AI, and specifying a task for an agent. Code that belongs to no skill is **L4**: the AI may write it. Only what you are learning is protected. Change the paths to the folders of your own codebase (see also [In a team repository](install.md#in-a-team-repository)).

The guard only protects files that fall under the paths of a skill. A skill without paths, such as debugging, gets the hint ladder, but the guard blocks nothing.

## Privacy

Your learning data stays local in `.learning/`. The installer adds that folder to `.gitignore`.

To show your progress, as in the [dashboard](progress-dashboard.md), use the export:

```bash
node harness/export.mjs ../my-practice-folder --dry-run   # report, writes nothing
node harness/export.mjs ../my-practice-folder             # writes site-src/dashboard/data/progress.json
```

Does a free text have no translation into the other language yet? Then the export first asks for the translations (see [Translations](progress-dashboard.md#translations)).

When the export writes the data, it also writes `.learning/state/last-export.json` in your practice folder: only the moment and three totals, no texts and no paths. The harness uses it to say what is new since then (see [Since the last export](progress-dashboard.md#since-the-last-export)). The file stays local.

- **A whitelist only.** Levels, tasks (rung, source, explanation, rejections, corrections, skipped), reviews, signals, and from the diary only the plan, what went well, the reflection and the calibration. Never raw events, session ids, test names or paths.
- **Fixed filters** on all free text: e-mail addresses, absolute paths, your user name, session and transcript ids, and HTML comments. The name in `skills.json` (`learner`) is filtered too.
- **Your own filter** in `.learning/private.json`:

```json
{
  "terms": ["First name", "Last name", "Name of your employer"],
  "replace": { "Name of a classmate": "a classmate" }
}
```

Always check the diff of `progress.json` yourself before you commit or push.

## The security check

`harness/security-check.mjs` runs in CI on every push and pull request, and locally as a pre-push hook (`--install-hook`). Every finding is **BLOKKEER** (block), **TWIJFEL** (doubt) or **OK**:

- secrets (tokens, keys), privacy (e-mail, paths, session ids, your private terms, the e-mail address of commits), forbidden files (pdf, docx, zip, drawio, raw learning data, exam material);
- long quotes in the research notes (copyright);
- the web pages: external scripts only with SRI, a CSP, no `innerHTML` with free text, no `eval`;
- the CI: actions pinned to a commit SHA, minimal permissions, no `pull_request_target`;
- the harness itself: no network, no `eval`, no shell.

A TWIJFEL only becomes OK through an entry with a reason in `.security-allowlist.json`. A BLOKKEER can never be allowed.
