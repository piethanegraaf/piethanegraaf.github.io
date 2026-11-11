---
title: "For junior developers: keep learning while AI writes code"
description: "How a junior developer keeps growing with Claude Code at work: build the skills you are learning yourself, let the AI do the rest, keep it out of team commits."
---
# For junior developers

If an AI agent does all your work, the work gets done, but you skip the practice that makes you a medior: writing, debugging and designing code yourself. The learning harness lets you choose which skills you build by hand, and lets Claude Code do the rest.

## The trade-off

1. **Build what you are learning.** For files of a skill you are learning (levels L1–L3), a hook stops Claude from writing, building or testing your code. You get hints instead: a question, then where to look, then a sketch.
2. **Delegate the rest.** Code that belongs to no skill is at L4: Claude may write it straight away, and you supervise.
3. **Maintain what you mastered.** At growing intervals, the next time an L4 skill comes by in your work, you do that part yourself.

It probably has a cost: while a skill is at L1–L3, you finish fewer tasks. Each part follows a principle with empirical support, but whether the combination works has not been tested yet. That is why there is an [invitation to researchers](researchers.md).

## The example map for C#/.NET

Install with `--map junior-dotnet`. The map has ten skills: debugging, reading unfamiliar code, unit tests, refactoring safely, ASP.NET Core APIs, EF Core and LINQ, async/await, security basics, reviewing code written by AI, and specifying a task for an agent.

The guard only protects files under the paths of a skill. A skill without paths, such as debugging, still gets the hint ladder, but nothing is blocked. Adapt the map to your own codebase (see [Your own course](configuration.md#your-own-course)).

## At work

- **Keep it out of the team's commits.** The harness is your own commitment device. Add its files to `.git/info/exclude`, and do not commit the changes to shared files without agreeing it with your team. See [In a team repository](install.md#in-a-team-repository).
- **The team's code stays the team's.** The map tells Claude not to change project files, CI configuration or shared settings without asking you.
- **No company data online.** Your diary is about the skill, not about customers or colleagues. If you publish a dashboard, add your employer and colleagues to `.learning/private.json` and check the export first (see [Configuration and privacy](configuration.md#privacy)).
- **Check your employer's rules** for AI tools before you install anything in a work repository.

## Why this matters

Juniors who let an agent do all the work can stay junior: the [research on the eternal-junior problem](research.md#212-the-eternal-junior-problem) covers the studies and the parallels with other professions, and the [research notes](notes/eternal_junior.md) list the sources.

## Next step

[Install the harness](install.md) with `--map junior-dotnet`. Questions? [Open an issue on GitHub](https://github.com/piethanegraaf/piethanegraaf.github.io/issues/new).
