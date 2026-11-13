# Learning harness for Claude Code

*Nederlands: [README.nl.md](README.nl.md)*

**Learning harness for Claude Code: hooks stop the AI from writing your practice code, with skill levels, a progress dashboard and a literature review.** Documentation: https://piethanegraaf.github.io/en/

A learning harness for [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) that makes sure you learn to program **yourself**, even with an AI looking over your shoulder. It is for students, and for junior developers at work who do not want to stay junior because the AI does all the work.

**The idea:** build a skill yourself first (L0–L3, hints instead of solutions), then delegate it to the AI (L4), and maintain it with short spaced reviews in your own work. Each part follows a principle with empirical support; whether the combination works has not been tested yet. Researchers are invited to test it in a randomized trial: see [For researchers](https://piethanegraaf.github.io/en/researchers/).

**Site:** https://piethanegraaf.github.io/en/ · **Dashboard:** https://piethanegraaf.github.io/dashboard/?lang=en · **C# OOP cheat sheet:** https://piethanegraaf.github.io/en/cheatsheet/

## What it does

- **Levels per skill** (L0 demonstrate → L4 automated). At L1–L3 a hook blocks the AI from writing, building or testing your code.
- **A hint ladder**: a question, then where to look, then a sketch. The next rung only after a visible attempt.
- **Tasks count only after your own explanation**, checked by Claude and by a deterministic check.
- **Explanations right away**: a task you do not explain before the next exercise lapses (skipped).
- **Reviews only at L4**, at Fibonacci intervals: the next time such a skill comes by in your work, you do it yourself.
- **Two skill maps**: Object-Oriented Design in C# for students (`--map ood`), and an example map for a junior developer at work in C#/.NET (`--map junior-dotnet`), where code outside the skills you are learning is L4.
- **Up is your choice, down follows the evidence** (optional): a read-only agent decides whether one sub-pattern or the whole skill goes down.
- **Graded work** (optional), such as a final assignment under exam rules that allow AI as an aid: in its paths Claude writes nothing at any level, hints stop at rung 4, and every answer goes into an AI-use log in the repo (`ai-verantwoording/`). With `--learning-dir` that repo uses the record of your practice folder.
- **A diary** at the end of each session, with the reflection in your own words.
- **Dutch and English**: messages, rules and the skills (diary, mastery-check).

## Quick start

```bash
git clone https://github.com/piethanegraaf/piethanegraaf.github.io.git
cd piethanegraaf.github.io
node harness/install.mjs ../my-practice-folder --lang en          # shows the plan
node harness/install.mjs ../my-practice-folder --lang en --yes    # installs
```

Requirements: Claude Code, Node.js 18+ (22 or 24 recommended), and the .NET SDK for the test runner. See the [installation guide](https://piethanegraaf.github.io/en/install/).

## Repository

| Folder | What |
|---|---|
| `harness/` | the installable harness: hooks, skills (diary, mastery-check), messages (`i18n/`), skill maps, templates, `install.mjs`, `export.mjs`, `security-check.mjs`, tests |
| `docs/` | the documentation site (MkDocs Material, Dutch and English), including the research and the research notes |
| `site-src/` | static pages: the dashboard and the cheat sheet |
| `.github/workflows/` | tests, security check, build and deploy |

Run the tests with `cd harness && node --test "test/*.test.mjs"`.

## Security and privacy

The hooks run on your computer without network traffic, `eval` or a shell. Your learning data stays in `.learning/`, or in the record of your practice folder with `--learning-dir`. Only the AI-use log of graded work is meant for git, after the same filters. The export for the dashboard only takes a whitelist of fields and filters personal data. See [SECURITY.md](SECURITY.md).

## AI statement

The harness, the dashboard, the documentation and the research were made with help from Claude (Anthropic). The learning data and the reflections in the dashboard are the learner's own. See the [AI statement](https://piethanegraaf.github.io/en/ai-statement/).

## License

- **Code** (the harness in `harness/`, the dashboard code, the workflows and the build configuration): [AGPL-3.0-only](LICENSE). Do you want to use the code in a product or service without the AGPL obligations, such as sharing your source code? A **commercial licence** is available on request: hanegraafpiet@gmail.com.
- **Texts** (the docs and the research in `docs/`, the cheat sheet and the dashboard data): [CC BY-NC 4.0](LICENSE-docs).

Up to and including commit [`d8a4399`](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/d8a4399) (10 November 2026) the code was MIT-licensed. Anyone who has that version may keep using it under MIT. Every later version is AGPL-3.0-only.

Contributions: see [CONTRIBUTING.md](CONTRIBUTING.md). They fall under a contributor licence agreement (CLA), so that the code can keep both licences.
