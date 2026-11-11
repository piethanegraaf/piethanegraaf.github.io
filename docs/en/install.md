---
title: "Install the learning harness in Claude Code"
description: "Clone the repo and run the Node.js installer in your project folder: it adds the hooks, the skills and the C# OOP skill map. Updates keep your data."
jsonld: software
---
# Install

## What you need

- [Claude Code](https://docs.claude.com/en/docs/claude-code/overview).
- [Node.js](https://nodejs.org/) 18 or newer (22 or 24 recommended). The hooks are Node scripts without dependencies.
- For the test runner `check.mjs`: the [.NET SDK](https://dotnet.microsoft.com/) with your test project (NUnit, xUnit or MSTest).
- A copy of this repository: `git clone https://github.com/piethanegraaf/piethanegraaf.github.io.git`

## Install in your project folder

```bash
node harness/install.mjs ../my-practice-folder --lang en --course "OOD" --exam 2027-01-20
```

- Without `--yes` the script only shows what it would do. Run it again with `--yes`.
- `--lang nl|en` picks the language of the messages, the rules and the skills.
- `--map` is the skill map: `ood` (Object-Oriented Design in C#, the default) or `junior-dotnet` (an example map for a junior developer at work in C#/.NET). See [Your own course](configuration.md#your-own-course).
- `--course` and `--exam` are optional. You can set them later with `skill.mjs setting`.

What the installer creates:

| Path | What | Owned by |
|---|---|---|
| `.claude/hooks/` | the hooks, the CLI and the messages (`i18n/`) | harness |
| `.claude/skills/diary/SKILL.md` | the diary skill for the end of a session | harness |
| `.claude/skills/mastery-check/SKILL.md` | the transfer task for the step to L4 (`/mastery-check`) | harness |
| `.claude/leerharnas.md` | the rules for Claude, plus the map's notes | harness |
| `.claude/settings.json` | the four hooks, with `$CLAUDE_PROJECT_DIR` (no absolute paths) | merged with your settings |
| `.learning/skills.json`, `keywords.json` | your skill record and keywords, from the map | **you** (data) |
| `CLAUDE.md` | points to `.claude/leerharnas.md`; your own agreements go here | **you** |
| `.gitignore` | keeps `.learning/` and the backups out of git | extended |

When a file already exists and changes, the installer first makes a backup in `.claude/leerharnas-backup/<time>/`.

## Update

```bash
node harness/install.mjs ../my-practice-folder --update --yes
```

`--update` only replaces the harness files. Your data in `.learning/` and your own `CLAUDE.md` stay as they are. If you changed a hook yourself, the installer says so ("lokaal aangepast") and keeps your version in the backup folder.

An older install without a manifest (with absolute paths in `settings.json`) is recognised and converted too.

## In a team repository

At work you install the harness in a repository that your team shares. The harness is your own commitment device, so keep it out of the team's commits:

- **New files:** add them to `.git/info/exclude`, which only applies to your own copy:

    ```text
    .claude/hooks/
    .claude/skills/diary/
    .claude/skills/mastery-check/
    .claude/agents/demotie-analist.md
    .claude/leerharnas.md
    .claude/leerharnas.json
    .claude/leerharnas-backup/
    .learning/
    voorbeelden/
    ```

- **Files the team already has:** the installer extends `.gitignore`, adds a line to `CLAUDE.md` and merges the hooks into `.claude/settings.json`. Do not commit those changes without agreeing it with your team.
- **No company data online:** check the diff of the export before you publish a dashboard (see [Configuration and privacy](configuration.md#privacy)), and add your employer and colleagues to `.learning/private.json`.

An install that only writes to local files does not exist yet.

## Before you practise

Turn off AI help outside Claude Code. Otherwise your IDE completes the code you are supposed to write yourself, and the harness sees none of it.

- **Rider:** turn off *Full Line Code Completion* (Settings → Plugins), and *JetBrains AI Assistant* if you have it.
- **Visual Studio:** turn off *IntelliCode* (whole-line completions) and *GitHub Copilot*.
- **VS Code:** turn off *GitHub Copilot* and other inline-suggestion extensions for this folder.
- **Claude Code:** the installer turns prompt suggestions off (`promptSuggestionEnabled: false`), because a suggested prompt can give a hint away.

## After installing

1. Start Claude Code in your project folder. The session-start hook shows your skills.
2. Set your exam date: `! node .claude/hooks/skill.mjs setting examDate 2027-01-20`
3. Calibrate your levels with a short baseline test without AI, and set them yourself: `! node .claude/hooks/skill.mjs set ood.overerving L3 "baseline: solved myself"`

!!! tip "The `!` sign"
    With `!` before a command you run it yourself in Claude Code. That is the only way to change the record: the guard does not let Claude do it.

## Uninstall

Remove `.claude/hooks/`, `.claude/skills/diary/`, `.claude/skills/mastery-check/`, `.claude/leerharnas.md`, `.claude/leerharnas.json` and the four hooks from `.claude/settings.json`. Your data in `.learning/` stays yours.
