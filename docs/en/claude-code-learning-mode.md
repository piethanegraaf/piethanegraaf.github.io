---
title: "Claude Code learning mode vs. a learning harness: what is enforced"
description: "Claude Code's Learning output style asks Claude to leave some code to you, but nothing enforces it. A comparison with CLAUDE.md rules and a learning harness built on hooks."
---
# Claude Code learning mode vs. a learning harness

**Short answer:** Claude Code's built-in *Learning* output style asks Claude to leave a few lines of code for you, but nothing enforces it. The Claude Code docs say an output style "doesn't guarantee that something always happens or never happens", and point to hooks for that. To make sure Claude does not write the code you are learning, you need a hook. The learning harness is a set of such hooks, with a level per skill.

## Three ways to learn with Claude Code

1. **The Learning output style.** Type `/output-style learning`. Claude explains its choices in `Insight` blocks. At a real design decision, such as error handling or a data structure, it leaves a `TODO(human)` comment and waits for you. Claude handles the routine implementation itself.
2. **A rule in `CLAUDE.md`**, such as "do not write my code, only give hints". Claude reads it in every session and usually follows it. It is an instruction too: for what has to happen every time, the docs list hooks, not `CLAUDE.md`.
3. **Hooks.** A hook is a script that Claude Code itself runs at a fixed moment, for example before every file edit. It can refuse the edit. In the words of the docs: "Claude Code runs a hook itself at a lifecycle event, so it doesn't depend on Claude following an instruction."

## The comparison

| | Default | Learning output style | Rule in `CLAUDE.md` | Learning harness |
|---|---|---|---|---|
| **Who writes the code** | Claude | Claude, except a few lines at design decisions | You, as long as Claude follows the rule | You, for the skills you are learning (L1–L3); Claude for the rest (L4) |
| **Enforced** | — | No: an instruction | No: an instruction | Yes: a hook blocks writing, building and testing your code |
| **Per skill** | No | No | Only if you write it out | A level from L0 to L4 per skill and microskill |
| **When you are stuck** | The solution | An explanation | What the rule says | A hint ladder: a question, a pointer, a sketch; the next rung only after a visible attempt |
| **Checks that you understand** | No | No | No | Your explanation in your own words, judged by Claude and checked by a hook (at least 12 words, a reason, not copied) |
| **Keeps a mastered skill alive** | No | No | No | Short reviews at growing intervals, in your own work |
| **Graded work** | No | No | No | In the paths you name, Claude writes no content, and every answer goes into an AI-use log |
| **Setup** | None | `/output-style learning` | One line | `node harness/install.mjs` ([install](install.md)) |

## Which one fits

- **The Learning style** fits when you want the task done and some hands-on practice on the side, for example while you get to know a codebase.
- **The learning harness** fits when you are learning a skill that you must be able to do without AI later: for an exam, or for the step from junior to mid-level at work. You build the skill yourself first, then delegate it to Claude, and keep it with short reviews. See [How it works](how-it-works.md).

Why enforce it at all? In a randomized trial by Anthropic, developers who learned a new library with an AI assistant scored 50% on a quiz afterwards, against 67% for those who coded by hand. The largest gap was on debugging (Shen & Tamkin, 2026; see [what the study found and what to do with it](ai-coding-skills-study.md)). And instructions alone did not hold: telling a tutor in its system prompt to scaffold changed nothing in a trial with 1,059 students, while gates built into the workflow did better (Barth et al., 2026). A hook is such a gate.

## Blocking edits yourself with one hook

The smallest version: a hook that refuses every edit in a `practice/` folder. Register it in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit|NotebookEdit",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/no-edits.mjs" }]
      }
    ]
  }
}
```

And the script, `.claude/hooks/no-edits.mjs`:

```js
// Refuses edits to files under practice/. Exit code 2 blocks the tool call;
// Claude Code shows Claude the message on stderr.
let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const file = JSON.parse(input).tool_input?.file_path ?? "";
  if (/[\\/]practice[\\/]/.test(file)) {
    console.error("This file is practice: give a hint instead of code.");
    process.exit(2);
  }
});
```

This blocks only the edit tools. Claude can still write a file through the shell, and it can still build and test your code. The guard of the learning harness also reads shell commands, blocks builds and tests at L1–L3, and works per skill instead of per folder. See [the guard](how-it-works.md#the-guard).

## Frequently asked questions

### Does the Learning output style stop Claude from writing my code?

No. It asks Claude to leave a few lines for you at design decisions, and Claude does the routine work itself. It is an instruction, not a block.

### Can Claude Code give hints instead of code?

Yes. With the learning harness, Claude gives hints from a ladder for every skill you are learning: first a question, then where to look, then a sketch. A worked solution only comes after you confirm, and then the task counts as not solved.

### Does it work for languages other than C#?

The hooks work for any language. Which files count as code, and which commands build or test, are [settings](configuration.md). The skill maps that come with it are for C# and .NET.

### Is it free?

Yes. The harness is open source (AGPL-3.0) and needs no account. You do need Claude Code itself, and Node.js 18 or later.
