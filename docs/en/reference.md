# Reference: hooks and commands

## Hooks

| Event | Script | What it does |
|---|---|---|
| `SessionStart` | `session-start.mjs` | Puts the record, open explanations and promotion signals in the context, and asks for your goal. Open explanations of earlier sessions lapse here. It does not mention reviews. |
| `UserPromptSubmit` | `prompt-gate.mjs` | Recognises the skill, decides whether a new rung may unlock, logs solved tasks and asks for explanations. Agent messages, notifications and system reminders do not count as your words. |
| `PreToolUse` | `guard.mjs` | Blocks writing, building and testing code at L1–L3, and every change to the record, the state and the harness itself. It judges a shell command per simple command, by the program that runs. It always refuses `eval`, `iex` and `Invoke-Expression`. |
| `Stop` | `reflect-gate.mjs` | Processes the markers in Claude's answer, checks your explanation and the verdict of the demotion analyst, and asks for the diary when you want to stop. After the diary, what is still open lapses. |

## `skill.mjs` (you run it yourself, with `!`)

| Command | What |
|---|---|
| `list` / `status` | Overview; L4 reviews that are ready, open and skipped explanations, and signals. Claude may run these two as well. |
| `set <id> <L0..L4> "note"` | Set a level. Raising it only works when no tasks wait for an explanation. |
| `review <id> pass\|shaky\|fail` | Record the outcome of a review yourself. Usually not needed: the next task of an L4 skill decides it. |
| `add-micro <parent> <id> <level> "title" "keywords"` | Add a microskill. With `autoDemote` the demotion analyst also creates one itself, at the parent's level minus 1. |
| `done <id> "what"` | Log a task without a test (design, UML). |
| `untask <id>` | Void the last logged task of a skill. |
| `correct <task-id> rung <1-5> "reason"` | More help than logged: only raises the rung. |
| `correct <task-id> void "reason"` | Void one task. |
| `override <id\|*> <minutes> "reason"` | Temporarily allow Claude to write code (at most 240 minutes, logged). |
| `setting <key> <value>` | `examDate`, `stuckTimerMinutes`, `idleMinutes`, `defaultLevel`, `course`, `language`. |
| `replay <transcript.jsonl> [--dry-run]` | Recovers explanations that were approved in the chat but not logged. It finds the markers `[explain-ok <tid>]` and checks your message with the same check as the Stop hook. Only what passes both keys counts, with source `replay`. |

The Dutch forms `correct <task-id> trede …` and `correct <task-id> schrap …` work too.

## `check.mjs` (test runner)

```text
! node .claude/hooks/check.mjs ood-opdrachten-01/05-de-auto
```

Runs `dotnet test` with a trx logger and shows a short summary. A test that goes from red to green becomes a task, with the rung of that moment. The first run per folder is a baseline. A repair after a regression does not count as a task.

- **A compile error is a starting point.** If the folder does not build (`error CSxxxx`), `check.mjs` remembers that. A test that is green at the first build that works then counts as new green. A tooling error (`NETSDK`, `MSB`) does not count.
- **The folder decides the skill.** After a run in a folder, a keyword in your prompt can only choose a microskill within that family. You switch to another family with `#id` or the name of the exercise.
- **`global.json`:** if it asks for an older SDK than the project targets, without `rollForward` to a newer major version, `check.mjs` warns you.
- A folder relative to the project also works when your shell stands in another folder.

## Markers in Claude's answer

| Marker | Meaning |
|---|---|
| `[rung N]` / `[trede N]` | Substantive help was given at rung N. |
| `[explain-ok <tid>]` / `[uitleg-ok <tid>]` | The explanation is right; the Stop hook still checks it. |
| `[explain-no <tid>]` / `[uitleg-nee <tid>]` | The explanation is incomplete; the task stays open. |
| `[demotie {...}]` / `[demotion {...}]` | The verdict of the demotion analyst (JSON). The Stop hook only applies it when the agent really ran in that turn. |
| `<!-- session: <id> -->` / `<!-- sessie: <id> -->` | In the diary: the entry of this session. |

## Events

Everything the harness does is in `.learning/state/events.jsonl`. The events of the review of 10 November 2026:

| Event | Meaning |
|---|---|
| `task-lapsed` | The explanation did not come right away: the task lapses (`other-exercise` or `session-end`). Does not count; *skipped* on the dashboard. |
| `task-explained` with `source: replay` | An explanation recovered afterwards with `replay`. |
| `placement` | The level of a new skill, set after its first task. |
| `review` with `auto: true` | The outcome of an L4 review, from the next task. `review-due`: the review came by. |
| `level` with `auto: true` | Automatic demotion; `by` says by whom: `harnas`, `demotie-analist` or `achtervang` (backstop). |
| `demotion-pending`, `demotion-verdict`, `demotion-rejected` | The analyst is needed, its verdict, or a verdict the Stop hook refused. |
| `micro-add` with `auto: true`, `task-retag` | The analyst created a microskill and linked tasks to it. |
| `build-failed` | A compile error, remembered as the starting point of the folder. |

## Files

```text
.learning/
  skills.json        record and settings
  keywords.json      keywords per skill
  private.json       terms that must never appear in an export (create it yourself)
  diary/YYYY-MM-DD.md
  state/             events.jsonl, tests.json, session-*.json, overrides.json
```

## Scripts in this repository

| Script | What |
|---|---|
| `harness/install.mjs` | Install and update. See [Install](install.md). |
| `harness/export.mjs` | Export progress for the dashboard, with privacy filters. See [Configuration and privacy](configuration.md). |
| `harness/security-check.mjs` | The check before anything goes online. |
| `harness/demo.mjs` | Rebuild the dashboard's demo data. |
| `node --test "test/*.test.mjs"` (in `harness/`) | The tests. |
