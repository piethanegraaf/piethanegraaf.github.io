---
title: "Reference: hooks, commands and files"
description: "The four Claude Code hooks of the learning harness, every skill.mjs command, the test runner, markers, events and files: what each one does and when."
---
# Reference: hooks and commands

## Hooks

| Event | Script | What it does |
|---|---|---|
| `SessionStart` | `session-start.mjs` | Puts the record, open explanations and promotion proposals in the context, and asks for your goal. You also see an open proposal yourself, in the message at the start. Open explanations of earlier sessions lapse here. It does not mention reviews. After a first export to the dashboard, its message also says what is new since then (see `since-export`), unless `dashboardRepo` is `off`. It offers a catch-up diary, once, for an earlier session with work that closed without a diary entry. In the graded project it lists the files changed since the previous session, with their skill (through `paths` or through the content). |
| `UserPromptSubmit` | `prompt-gate.mjs` | Recognises the skill, decides whether a new rung may unlock, logs solved tasks and asks for explanations. Sets the level when you confirm a proposal with "yes, promote", and adds a microskill when you confirm a proposal with "yes, add". During a transfer task no rung unlocks. Agent messages, notifications and system reminders do not count as your words. Logs your first message as the plan (`plan`) and a number after Claude's "(1–5)" as your confidence (`confidence`). A message that starts with `done: <part>` (or `af: <onderdeel>`) logs a task like `done`. It recognises a stop request at the start of a message ("done", "klaar") and, in a short message, at its end ("I want to stop", "laten we afronden"). |
| `PreToolUse` | `guard.mjs` | Blocks writing, building and testing code at L1–L3, and every change to the record, the state and the harness itself. It judges a shell command per simple command, by the program that runs. It always refuses `eval`, `iex` and `Invoke-Expression`. One program is allowed on purpose: the dashboard export `node <repo>/harness/export.mjs <practice folder>`, which in the practice folder only writes `last-export.json` (not with `--out` into the practice folder). In graded work it allows fixed tooling only (`dotnet new` with sln/console/classlib/nunit/xunit/gitignore, `dotnet sln add`, `dotnet add reference\|package`, `git init`, `git remote add`, `git branch -m`, `mkdir`, `scaffold.mjs arc42`) and logs it; git commands that only read (`status`, `log`, `remote -v`, `branch --show-current` …) are always allowed. |
| `Stop` | `reflect-gate.mjs` | Processes the markers in Claude's answer, checks your explanation, the transfer task and the verdict of the demotion analyst, and asks for the diary when you want to stop. When an explanation meets a promotion criterion, it shows you the proposal right away. It also shows a proposal for a microskill when Claude asks for one and this session has the evidence. After the diary, what is still open lapses. In graded work it writes the AI-use log, with a row per allowed tooling command, and puts your own words in the last column (`[log "…"]`). |
| `SessionEnd` | `session-end.mjs` | Notes when the session ended and whether there was work without a diary entry, for the catch-up diary at the next start. Asks and blocks nothing. |

## `skill.mjs` (you run it yourself, with `!`)

| Command | What |
|---|---|
| `list` / `status` | Overview; L4 reviews that are ready, open and skipped explanations, and signals. `status` also shows help about a skill during tasks of another skill (`concept-help`), for information only. Claude may run these two as well. |
| `since-export` | What is new since the last export to the dashboard, in one line: tasks, diary sessions and level changes. Without an export: that no export is known yet. Then, when something is new or nothing is known, the question "Update the dashboard now? (yes / later)" that `/diary` asks. Nothing when `dashboardRepo` is `off`. Only reads, so Claude may run it as well: `/diary` ends with it. See [Since the last export](progress-dashboard.md#since-the-last-export). |
| `set <id> <L0..L4> "note"` | Set a level. Raising it only works when no tasks wait for an explanation. A proposal of the harness is easier to confirm in the chat: type "yes, promote" (optionally with the id). |
| `review <id> pass\|shaky\|fail` | Record the outcome of a review yourself. Usually not needed: the next task of an L4 skill decides it. |
| `add <id> "title" ["keywords"]` | Add a new main skill, for example for a part of the exam that is not in the map. It starts with an open placement: your first task sets the level. Link folders with `paths`. Logged as the event `skill-add`. |
| `add-micro <parent> <id> <level> "title" "keywords"` | Add a microskill. With `autoDemote` the demotion analyst also creates one itself, at the parent's level minus 1. After real help in a session, the harness can also propose one; you add it with "yes, add" in the chat. |
| `done <id> "what"` | Log a task without a test (design, UML). Without a command: a message that starts with `done: <part>`. |
| `untask <id>` | Void the last logged task of a skill. |
| `correct <task-id> rung <1-5> "reason"` | More help than logged: only raises the rung. |
| `correct <task-id> void "reason"` | Void one task. |
| `override <id\|*> <minutes> "reason"` | Temporarily allow Claude to write code (at most 240 minutes, logged). |
| `setting <key> <value>` | `examDate`, `stuckTimerMinutes`, `idleMinutes`, `defaultLevel`, `course`, `language`, `autoDemote`, `securityAnalyzer`, `dashboardRepo` (the absolute path of your clone of the repo with the dashboard, or `off`), and `codeExtensions` and `codeFiles` as a comma-separated list. See [Configuration](configuration.md). |
| `setting graded add\|remove "<path>"` | Graded work: the paths (absolute, or relative to the project) where Claude writes nothing and the hint ladder goes up to rung 4. Also `setting graded maxRung 0..4`, `aiLevel 0\|1`, `logDir "<path>"` and `off`. See [Graded work](how-it-works.md#graded-work). Logged as the event `setting`. |
| `paths <id> add|remove "<glob>"` | Which exercise folders belong to a skill, for example `paths ood.associaties add "ood-opdrachten-01/09-*/**"`. The folder decides the skill of a task and the level the guard uses. Not for a microskill: it uses the level of its parent. If another skill has the same path, it warns you. Logged as the event `paths`. |
| `replay <transcript.jsonl> [--dry-run]` | Recovers explanations that were approved in the chat but not logged. It finds the markers `[explain-ok <tid>]` and checks your message with the same check as the Stop hook. Only what passes both keys counts, with source `replay`. |

The Dutch forms `correct <task-id> trede …` and `correct <task-id> schrap …` work too.

## `check.mjs` (test runner)

```text
! node .claude/hooks/check.mjs ood-opdrachten-01/05-de-auto
```

Runs `dotnet test` with a trx logger and shows a short summary. A test that goes from red to green becomes a task, with the rung of that moment. The first run per folder is a baseline. A repair after a regression does not count as a task.

- **Code written before the first run.** If the first run in a folder is all green, and code in that folder was changed in this session, that green counts as a task too (`test-green` with `firstRun: true`). Code from an earlier session stays a baseline. So run `check.mjs` first, before you write code.
- **Another folder starts a new task.** A run in another folder than the last task is a signal of new work: the ladder starts again (`task-start`), and help since the last task does not count for the new one (`help-dropped`).
- **A compile error is a starting point.** If the folder does not build (`error CSxxxx`), `check.mjs` remembers that. A test that is green at the first build that works then counts as new green. A tooling error (`NETSDK`, `MSB`) does not count.
- **The folder decides the skill.** After a run in a folder, a keyword in your prompt can only choose a microskill within that family. You switch to another family with `#id` or the name of the exercise.
- **`global.json`:** if it asks for an older SDK than the project targets, without `rollForward` to a newer major version, `check.mjs` warns you.
- **Security analyser.** With `securityAnalyzer`, `check.mjs` first rebuilds the folder (`dotnet build --no-incremental`) with the security rules of the .NET SDK (`AnalysisModeSecurity=All`, never as errors), and then runs the tests with the same properties. It shows each warning with its rule, file and line, and asks you to explain it. The rebuild is needed because the analyzers only report while the compiler actually runs.
- A folder relative to the project also works when your shell stands in another folder.

## Markers in Claude's answer

| Marker | Meaning |
|---|---|
| `[rung N]` / `[trede N]` | Substantive help was given at rung N. |
| `[rung N #id]` / `[trede N #id]` | The same, and the help was about the concept `id` from `skills.json`. The task keeps the rung. A concept of another family also gets a `concept-help` event; one of the same family, or an id that does not exist, makes it an ordinary `[rung N]`. |
| `[micro-proposal <id> "title" "keywords"]` / `[micro-voorstel …]` | Claude asks the harness to propose a microskill. The harness shows it only with a valid id below a main skill, 1–6 keywords, and evidence from this session: help at rung 2 or higher in a review or about another concept, or a task of that family at rung 2 or higher. Otherwise the Stop hook says why it refuses. |
| `[review-rung N #id]` / `[review-trede N #id]` | Help at rung N in a review after a task, about the concept `id` from `skills.json`. It does not raise the rung of the next task, unless that task is about the same concept (the same family). Without a valid id, without a logged task before it, or after a signal of new work, it counts as an ordinary `[rung N]`. |
| `[explain-ok <tid>]` / `[uitleg-ok <tid>]` | The explanation is right; the Stop hook still checks it. |
| `[explain-no <tid>]` / `[uitleg-nee <tid>]` | The explanation is incomplete; the task stays open. |
| `[demotie {...}]` / `[demotion {...}]` | Only a fallback: the Stop hook reads the analyst's verdict from the agent's own report, so Claude does not put the JSON in the chat. The marker is applied only when the agent really ran in that turn. |
| `[transfer-start <id>]` | Start of the transfer task (`/mastery-check`), only at L2 or L3. From then on every `[rung N]` counts against the transfer task. |
| `[transfer-ok <id>]` / `[transfer-no <id>]` (`[transfer-nee <id>]`) | The transfer task passed or not. `ok` only counts without help since the start, and when your last message passes the same check as an explanation. |
| `[check-question <id> right\|half\|open]` / `[controlevraag <id> goed\|half\|open]` | The outcome of a check question at the end of the session, about the skill `id`. Logged as `check-question`: evidence for a proposal for a microskill, never for a level. |
| `[log "<text>"]` / `[logboek "<text>"]` | Graded work: your own words for the last column of the AI-use log. The Stop hook writes them only when they are, word for word, part of your message, and only in the empty rows of this session (`[log <8 characters of a session id> "<text>"]` for a catch-up diary). |
| `<!-- session: <id> -->` / `<!-- sessie: <id> -->` | In the diary: the entry of this session. |

## Skills

| Skill | What |
|---|---|
| `/diary` | Closes the session: the facts from Claude, the reflection from you. |
| `/mastery-check <id>` | The transfer task for the step to L4: a new exercise in another domain, without help, followed by three why-questions. |
| `/update-dashboard` | Updates the dashboard, up to a pull request: in its own worktree of the repo, with the export, the translations and the security check. `/diary` asks for it; you can also start it yourself. Merging is up to you. See [Updating the dashboard](progress-dashboard.md). |

## Events

Everything the harness does is in `.learning/state/events.jsonl`. The events of the review of 10 November 2026:

| Event | Meaning |
|---|---|
| `task-lapsed` | The explanation did not come right away: the task lapses (`other-exercise` or `session-end`). Does not count; *skipped* on the dashboard. |
| `task-explained` with `source: replay` | An explanation recovered afterwards with `replay`. |
| `placement` | The level of a new skill, set at the approved explanation of its first task (`tid`). |
| `review` with `auto: true` | The outcome of an L4 review, from the next task. `review-due`: the review came by. |
| `level` with `auto: true` | Automatic demotion; `by` says by whom: `harnas`, `demotie-analist` or `achtervang` (backstop). |
| `demotion-pending`, `demotion-verdict`, `demotion-rejected` | The analyst is needed, its verdict, or a verdict the Stop hook refused. |
| `micro-add` with `auto: true`, `task-retag` | The analyst created a microskill and linked tasks to it. |
| `build-failed` | A compile error, remembered as the starting point of the folder. |

And of the addition of 11 November 2026 (promotion):

| Event | Meaning |
|---|---|
| `task` with `level` | The level of the skill when the task was logged. A task at L0 or L1 does not carry a jump. |
| `promotion-offered` | The harness showed a proposal to promote (`from`, `to`), or the hint that only the transfer task is missing (`to: transfer`). |
| `promotion-confirmed`, `promotion-refused` | You typed "yes, promote"; promoted, or refused because a task still waits for its explanation. |
| `level` with `by: learner`, `via: voorstel` | The level, set after your confirmation. |
| `promotion-declined` | You said "no" or "later" to a proposal. It comes back after a new task that meets the criterion. |
| `transfer-start`, `transfer-passed`, `transfer-failed`, `transfer-rejected` | The transfer task: started, passed, not passed (`why: help` or `claude`), or a marker the Stop hook refused. |

And of the setup review of 11 November 2026 (the start of a task, reviews and paths):

| Event | Meaning |
|---|---|
| `task-start` | New work began, with the reason: `code-elsewhere`, `check-elsewhere`, `prompt-exercise` or `prompt-id`. `after`: the task before it. |
| `help-dropped` | Ordinary help from before that start (`rung`). It does not count for the new task. |
| `review-help` | Help in a review after a task: `skill` is the concept, `reviewOf` the task of the review. |
| `task` with `reviewRung` | The task got its rung from the review of the previous task, about the same concept. |
| `rung-mark` with `review: true` | A review marker that counted as an ordinary rung. |
| `test-green` with `firstRun: true` | The first run in a folder was all green, with code written in this session. |
| `paths` | You linked an exercise folder to a skill, or removed it (`action`, `glob`). |

And of the setup review of 11 November 2026, afternoon (help per concept, microskill proposals):

| Event | Meaning |
|---|---|
| `concept-help` | Help about a concept of another family during a task (`skill`, `rung`, `taskSkill`). `taskTid` is the id the task gets when it is logged. Not a task of that concept. |
| `help-dropped` with `taskTid` | New work began after concept help: that task id is never logged. |
| `micro-offered` | The harness showed a proposal for a microskill (`skill`, `parent`, `level`, `evidence`: `review`, `concept` or `task`). |
| `micro-rejected` | A proposal the Stop hook refused (`why`). |
| `micro-declined` | You said "no" to the proposal. It does not come back in that session. |
| `micro-add` with `by: learner`, `via: voorstel` | The microskill, added after your "yes, add". |

And of the setup review of 12 November 2026 (positive feedback, demotions and the phase history):

| Event | Meaning |
|---|---|
| `task` with `familyRung` | The rung without help about a concept of another family, when that is lower than `maxRung`. Automatic demotion and the placement use it; the task keeps its `maxRung`. |
| `rung-mark` with `concept` | A rung about a concept of another family: it raised the task's rung, not its family rung. |
| `demotion-cancelled` | A pending demotion whose criterion no longer held on the evidence of now (`why: criterion`). Nothing went down. |
| `demotion-rejected` with `source: agent-report` | A verdict in the analyst's own report that the harness refused. The demotion stays pending. |
| `effort-intro` | The one-time message at the session start that effort is the goal, not failure. |

And of the setup of 13 November 2026 (graded work):

| Event | Meaning |
|---|---|
| `graded-session` | This session is about graded work, with `why`: `project`, `cwd`, `prompt` or `tool`. From then on every answer goes into the AI-use log. |
| `deny` with `graded: true` | The guard blocked a write, build or commit in graded work. |
| `hint-hold` with `graded: true` | No new rung: the ceiling of graded work, or AI level 0. |
| `graded-solution-refused` | The student asked for a worked solution in graded work; Claude was told to refuse. |
| `graded-over-max` | An answer had a rung above the ceiling. The log names it, and the student was told. |
| `graded-log-error` | The hook could not write the AI-use log (with the error). |
| `security-warnings` | `check.mjs` with `securityAnalyzer`: the number of warnings and the rules (such as `CA2100`), without file names. |

And of the review of 13 November 2026, night (the first sessions on the final assignment):

| Event | Meaning |
|---|---|
| `graded-tooling` | The guard allowed a fixed tooling command in graded work (`cmd`, with `~` for the home folder). It gets a row in the AI-use log. |
| `plan`, `confidence` | Your first message of the session (at most 300 characters), and the number 1–5 you gave after Claude's "(1–5)". Not exported to the dashboard. |
| `session-end` | The session closed, with `reason`, `diary` and `work`. |
| `catchup-offered` | The start offered a catch-up diary for the session `of`. |
| `task` with `source: af` | A task you logged with `done: <part>` or `af: <onderdeel>`. The dashboard shows it as `done`. |
| `af-refused` | `af:` in graded work without a changed file since the last task of that skill. |
| `check-question` | The outcome of a check question: `right`, `half` or `open`. |
| `log-filled`, `log-fill-refused` | Your own words went into the last column of the AI-use log (`rows`), or the text was not word for word yours. |

## Files

```text
.learning/
  skills.json        record and settings
  keywords.json      keywords per skill
  private.json       terms that must never appear in an export (create it yourself)
  diary/YYYY-MM-DD.md
  state/             events.jsonl, tests.json, session-*.json, overrides.json,
                     last-export.json (moment and totals of the last dashboard export)
```

In the repo of graded work (written by the hooks only):

```text
ai-verantwoording/   (ai-use/ in English)
  README.md          AI level, the ladder, APA reference, how the export is made (written once)
  logboek.md         one row per answer; you fill in the last column (log.md in English)
  sessies/<date>-<session>.md   your prompts and Claude's text, without tool output (sessions/ in English)
.claude/leerharnas.local.json   the record of another folder (install.mjs --learning-dir); not in git
```

With the user-level gate (`install.mjs <folder> --user-guard`):

```text
~/.claude/leerharnas/graded-gate.mjs   the gate, in every project
~/.claude/leerharnas/graded.json       the graded paths, the names to block, the messages
~/.claude/settings.json                two hooks added (UserPromptSubmit, PreToolUse); the rest stays
~/.claude/CLAUDE.md                    a block between <!-- leerharnas:graded:start/end -->
```

## Scripts in this repository

| Script | What |
|---|---|
| `harness/install.mjs` | Install and update. With `--user-guard` also the user-level gate for graded work. See [Install](install.md). |
| `harness/hooks/scaffold.mjs` | `arc42 <folder> --from <zip> [--lang nl\|en] [--with-help]`: the official arc42 template (release 2026.10.19, GitHub Markdown, one file per chapter), from a zip downloaded first (without `--from` it shows the link and the `curl` command), checked against a pinned sha256 and unpacked unchanged into a new or empty folder. It has no network code. Installed as `.claude/hooks/scaffold.mjs`; in graded work the guard allows only that copy. |
| `harness/user/graded-gate.mjs` | The user-level gate (#61), installed by `install.mjs --user-guard`. |
| `harness/export.mjs` | Export progress for the dashboard, with privacy filters. Also writes `.learning/state/last-export.json` in the practice folder. From a practice session the guard allows it on purpose. See [Configuration and privacy](configuration.md). |
| `harness/security-check.mjs` | The check before anything goes online. |
| `harness/demo.mjs` | Rebuild the dashboard's demo data. |
| `node --test "test/*.test.mjs"` (in `harness/`) | The tests. |
