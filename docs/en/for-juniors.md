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

Install with `--map junior-dotnet`. The map has thirteen skills: debugging, reading unfamiliar code, unit tests, refactoring safely, ASP.NET Core APIs, EF Core and LINQ, async/await, four security skills (see below), reviewing code written by AI, and specifying a task for an agent.

The guard only protects files under the paths of a skill (and the paths of [graded work](how-it-works.md#graded-work), which you will not need at work). A skill without paths, such as debugging, still gets the hint ladder, but nothing is blocked. Adapt the map to your own codebase (see [Your own course](configuration.md#your-own-course)).

## Secure code next to an AI agent

You ask Claude Code for a search page that shows the user's search term back. The code compiles, the tests pass and the page works. Whether the search term is encoded before it goes into the HTML, you do not see, and that is where AI code fails most often. In a measurement of October 2026, cross-site scripting was handled correctly in only 18% of cases. On real feature requests, the best agent was correct on 57% of the tasks, but also secure on 11.8%.

The biggest risk is not the code itself, but your confidence in it. People who work with an AI assistant more often believe their code is secure than is justified, and do not notice where it goes wrong. What does help is attention at the moment of the decision: reviewers who were told to focus on security found the vulnerability much more often, and a checklist added nothing to that. Your employer will ask for it too. Since August 2026 more than 8,000 Dutch organisations fall under the Cyberbeveiligingswet (the Dutch NIS2 law), and from December 2027 products under the EU Cyber Resilience Act may no longer be made available with known exploitable vulnerabilities.

That is why secure coding is the first niche we are working out for juniors. Since 13 November 2026 it is in the `junior-dotnet` map:

- **Four security skills:** output encoding and input validation (`security.output-encoding`), parameterized queries (`security.sql-params`), secrets and configuration (`security.secrets-config`), and reviewing AI code for security (`security.ai-review`).
- **The attacker first.** Rung 1 is always the question: what does an attacker control here? In the explanation of a security task you say what the attacker controls, which measure stops it, how you check that, and how sure you are.
- **An analyser next to your tests.** `check.mjs` first rebuilds your code with the security rules of the .NET SDK, without network and without changing your project files. You explain the warnings; at L1–L3 Claude does not fix them for you. No warnings does not mean the code is secure: the analyser does not see access control or logic.
- **Nothing about vulnerabilities online.** The free texts of security tasks, such as your explanation and the names of tests, stay out of the export for the dashboard. Only the numbers go along.

Security flaws are spread through the code, so these skills have no paths: the guard does not stop Claude here, the rules do. Turn the analyser off with `! node .claude/hooks/skill.mjs setting securityAnalyzer false`. Whether this makes juniors code more securely has not been tested. The studies and their limits are in [§2.13 of the research](research.md#213-secure-code-as-a-first-niche-for-juniors).

## At work

- **Keep it out of the team's commits.** The harness is your own commitment device. Add its files to `.git/info/exclude`, and do not commit the changes to shared files without agreeing it with your team. See [In a team repository](install.md#in-a-team-repository).
- **The team's code stays the team's.** The map tells Claude not to change project files, CI configuration or shared settings without asking you.
- **No company data online.** Your diary is about the skill, not about customers or colleagues. If you publish a dashboard, add your employer and colleagues to `.learning/private.json` and check the export first (see [Configuration and privacy](configuration.md#privacy)).
- **Check your employer's rules** for AI tools before you install anything in a work repository.

## Why this matters

Juniors who let an agent do all the work can stay junior: the [research on the eternal-junior problem](research.md#212-the-eternal-junior-problem) covers the studies and the parallels with other professions, and the [research notes](notes/eternal_junior.md) list the sources.

## Next step

[Install the harness](install.md) with `--map junior-dotnet`. Questions? E-mail [hanegraafpiet@gmail.com](mailto:hanegraafpiet@gmail.com). Bugs go in an [issue on GitHub](https://github.com/piethanegraaf/piethanegraaf.github.io/issues/new).
