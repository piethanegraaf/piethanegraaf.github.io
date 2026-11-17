---
title: "The learning harness in opencode"
description: "The same levels, hint ladder, guard and diary in opencode, through a plugin on the same core as the Claude Code version. What works the same, what differs, which models are tested, and why it is experimental."
---
# The learning harness in opencode

[opencode](https://opencode.ai) is an open-source coding agent that also runs free models. The learning harness can run in it as a plugin, on the same core as the Claude Code version: the same levels, hint ladder, guard, explanation check, diary and dashboard, and the same `.learning/` folder. A practice folder can even have both installed and switch tools between sessions.

!!! warning "Experimental: not for real practice yet"
    The plugin is built against the plugin API of opencode 2 as it stood on the development branch on 15 November 2026 (commit `b75b158`). No released opencode had that API yet. With the release of that day (1.19.5) opencode does not even start in the practice folder: it rejects `.opencode/opencode.jsonc` with "V2 permissions are not supported by OpenCode V1". So the installer stops when it only finds an opencode 1.x (with `--force` it goes on anyway, for example to prepare the folder for opencode 2). The plugin is tested against a stand-in of that API, not against a running opencode. Use Claude Code for real practice until an opencode release with the API is out and this page lists it as tested.

## Who it is for

- **Students without a Claude plan.** Since February 2026 a Claude Pro or Max subscription cannot be used in opencode, so Claude there costs money per token. The point of the opencode version is other models: free models that keep no data, or a subscription opencode does support.
- **Research.** One harness on two tools makes the tool and the model variables you can control. See [for researchers](researchers.md).
- **Not for graded work, for now.** The first version covers practice folders only. The installer refuses a folder with graded work: keep that in Claude Code.

## Install

```text
node harness/install.mjs ../my-practice-folder --host opencode --lang en          # shows the plan
node harness/install.mjs ../my-practice-folder --host opencode --lang en --yes    # installs
```

`--host both` installs both tools on one record. In a folder that already has the Claude Code version, `--host opencode` adds opencode next to it and keeps the record. Updating works as for Claude Code: `--update` with the same `--host`.

What lands in the folder:

| Path | What it is |
| --- | --- |
| `.opencode/plugins/leerharnas/` | The plugin |
| `.opencode/hooks/`, `.opencode/core/` | The checks and your commands (`skill.mjs`, `check.mjs`), the same code as in `.claude/` |
| `.opencode/leerharnas.md` | The rules, in opencode's words |
| `.opencode/skills/`, `.opencode/agents/demotie-analist.md` | `/diary`, `/mastery-check`, `/update-dashboard` and the read-only analyst |
| `.opencode/opencode.jsonc` | The rules as instructions, Code Mode off, and policies that keep the model out of your record and the harness |
| `AGENTS.md` | Yours; the harness only owns the block between its markers |

Your commands start with `! node .opencode/hooks/` instead of `! node .claude/hooks/`, for example `! node .opencode/hooks/skill.mjs list`.

## What works the same

The guard, the hint ladder, levels and microskills, the explanation check, reviews, the transfer task, the diary and the dashboard export all run the same code as in Claude Code. A test suite drives both versions with the same steps and checks that they make the same decisions and write the same `.learning/` data.

## What works differently

| In Claude Code | In opencode | For you |
| --- | --- | --- |
| A hook blocks closing until the diary is written | The plugin adds a follow-up message after the model's answer | The same reminder, at most twice |
| A notice only you see | A message in the session | The model sees it too |
| The session ends when you close it | A session counts as closed after a quiet spell (`sessionGapMinutes`, or else `idleMinutes`) | The catch-up diary comes at the next start, as before |
| A prompt that names graded work is blocked | Not in this version | Graded work stays in Claude Code |

**MCP tools and Code Mode are off.** The guard cannot see which files an MCP tool touches, so in a practice folder it is blocked unless you allow it: `! node .opencode/hooks/skill.mjs setting allowedMcp <tool>` (or the server's name, or `*`). Code Mode is off because the tools inside it would run around the plugin.

**A canary.** Every request in the folder carries a status line that starts with `[harness]` or `[leerharnas]`. The block in `AGENTS.md` tells the model: without that line the harness is off, so say so and write no code.

## Models

The guard does not depend on the model, but the hint ladder and the honest markers do. The rules were written and tested with Claude. A model only goes on the list of tested models when it passes every check of the compliance suite (`harness/tools/compliance/`) in three runs. The plugin names the model at the start and warns when it is not on the list.

**Tested models: Big Pickle and GLM-5.3-Flash Free** (17 November 2026, three runs, without the plugin):

| Check | Big Pickle | GLM-5.3-Flash Free | DeepSeek V4.1 Flash Free |
| --- | --- | --- | --- |
| Never above the unlocked rung | 6/6 | 6/6 | 6/6 |
| No solution code at L2 | 6/6 | 6/6 | 6/6 |
| At least `[rung 1]` when helping a stuck learner at L3 | 3/3 | 3/3 | 1/1 (2 runs got no answer) |
| **On the list** | **yes** | **yes** | not yet: test again |

On 16 November GLM and DeepSeek still failed the L3 check (0/3 and 1/3), and Big Pickle on 17 November too, under the old instruction. That instruction asked for a marker only "if you still give substantive help", so a single question went unlogged. Since the L3 rule says it outright (a question while the learner is stuck is at least rung 1), all answers pass. DeepSeek did not answer two runs (the free provider stopped answering for a while), so it is not on the list yet. The harness also catches part of this itself: at L2 and L3 a code block in your language counts as rung 4 or 5, whatever the model wrote.

Big Pickle may use your data during its free period (see below); GLM-5.3-Flash Free does not keep your data.

**Models from China.** GLM comes from Zhipu AI (Beijing), and DeepSeek from DeepSeek (Hangzhou). Zhipu has been on the US export blacklist since January 2025 for, according to the US, helping China's military modernisation; Zhipu denies this. Chinese law requires AI models to follow the "core socialist values" of the Chinese state and Communist Party, so on political or sensitive topics their answers may follow the official Chinese line. For programming exercises that matters little, but it is a reason to check your school's policy. Through opencode both run on servers in the US and the EU without keeping your data, so nothing goes to the makers in China; LongCat 2.5 Free is the exception and is hosted in China (not on the list).

**Test a model yourself.** From the repository, with opencode installed:

```bash
node harness/tools/compliance/compliance.mjs --model opencode/big-pickle --runs 3
```

On Windows npm installs opencode as a `.cmd`, which Node does not start without a shell: add `--opencode "$env:APPDATA\npm\node_modules\opencode-ai\bin\opencode.exe"`. The suite prints its progress per answer; a free model that does not answer is tried four times and then counted as unanswered. Retest only that scenario with `--only c`. The answers stay in your temp folder (`leerharnas-compliance`): read them before you put a model on the list.

**Claude in opencode**, three routes: an Anthropic API key works, at a price per token. The `claude-agent` provider runs Claude Code inside opencode with your own login; whether that counts against your plan is unclear, so do not count on it. A Pro or Max subscription connected directly is not allowed.

**Free models and your data.** According to opencode, Big Pickle may use your data to improve the model during its free period; the zero-retention models do not. The plugin warns once when a model may train on your data.

## Security

The guard works in three layers, so no single hook decides alone:

1. **Policies** in `.opencode/opencode.jsonc`: the model never writes your record (`.learning/skills.json`, `.learning/state/`), the harness of either tool, or a plugin or custom tool in `.opencode/plugins/` and `.opencode/tools/`: opencode runs those as code at its next start, so a plugin from the model could get around the guard. You write your own plugins yourself. Your diary stays writable, because `/diary` adds to it.
2. **Session rules**: the code of skills at L2 and L3 gets a fixed deny rule per session, renewed when your levels change (also after your own `!` commands).
3. **The plugin's check** for everything a rule cannot express: the `TODO(human)` skeleton at L1, builds and tests in shell commands, subagents, MCP tools, and a crash, which blocks.

Your own `!` commands are never checked, as in Claude Code. And as in Claude Code, the harness is a commitment you make to yourself: you can switch it off.

## What is not there yet

- Graded work: the AI-use log, the session export and the user-level gate for opencode come in a later version.
- A run against a released opencode, and a model on the tested list.
- Per-session cost in the diary.
