# Learning harness for Claude Code

*Nederlands: [README.nl.md](README.nl.md)*

A learning harness for [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) that makes sure you learn to program **yourself**, even with an AI looking over your shoulder. It knows how far along you are per skill and adjusts the AI's help to that: hints instead of solutions while you learn, short spaced reviews once you have mastered something.

**Site:** https://piethanegraaf.github.io/ · **Dashboard:** https://piethanegraaf.github.io/dashboard/ · **C# OOP cheat sheet:** https://piethanegraaf.github.io/cheatsheet/

## What it does

- **Levels per skill** (L0 demonstrate → L4 automated). At L1–L3 a hook blocks the AI from writing, building or testing your code.
- **A hint ladder**: a question, then where to look, then a sketch. The next rung only after a visible attempt.
- **Tasks count only after your own explanation**, checked by Claude and by a deterministic check.
- **Fibonacci reviews** from L3, planned before your exam date.
- **A diary** at the end of each session, with the reflection in your own words.
- **Dutch and English**: messages, rules and the diary skill.

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
| `harness/` | the installable harness: hooks, diary skill, messages (`i18n/`), skill maps, templates, `install.mjs`, `export.mjs`, `security-check.mjs`, tests |
| `docs/` | the documentation site (MkDocs Material, Dutch and English), including the research and the research notes |
| `site-src/` | static pages: the dashboard and the cheat sheet |
| `.github/workflows/` | tests, security check, build and deploy |

Run the tests with `cd harness && node --test "test/*.test.mjs"`.

## Security and privacy

The hooks run on your computer without network traffic, `eval` or a shell. Your learning data stays in `.learning/`. The export for the dashboard only takes a whitelist of fields and filters personal data. See [SECURITY.md](SECURITY.md).

## AI statement

The harness, the dashboard, the documentation and the research were made with help from Claude (Anthropic). The learning data and the reflections in the dashboard are the learner's own. See the [AI statement](https://piethanegraaf.github.io/en/ai-statement/).

## License

- **Code** (the harness in `harness/`, the dashboard code, the workflows and the build configuration): [AGPL-3.0-only](LICENSE). Do you want to use the code in a product or service without the AGPL obligations, such as sharing your source code? A **commercial licence** is available on request: hanegraafpiet@gmail.com.
- **Texts** (the docs and the research in `docs/`, the cheat sheet and the dashboard data): [CC BY-NC 4.0](LICENSE-docs).

Up to and including commit [`d8a4399`](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/d8a4399) (10 November 2026) the code was MIT-licensed. Anyone who has that version may keep using it under MIT. Every later version is AGPL-3.0-only.

Contributions: see [CONTRIBUTING.md](CONTRIBUTING.md). They fall under a contributor licence agreement (CLA), so that the code can keep both licences.
