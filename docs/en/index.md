# Learning harness

A learning harness for [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) that makes sure you learn to program **yourself**, even with an AI looking over your shoulder.
The harness knows how far along you are per skill, and adjusts the AI's help to that. What you have mastered, you maintain with short reviews. What you are still learning, you do yourself, with hints instead of solutions.

<div class="grid cards" markdown>

- **Install**

    Put the harness in your own project folder with one command.

    [Go to the installation](install.md)

- **How it works**

    Levels, the hint ladder, the guard, explanations in your own words and reviews.

    [Go to the explanation](how-it-works.md)

- **Dashboard**

    Progress per (micro)skill, with real data and a demo.

    [Go to the dashboard](progress-dashboard.md)

- **C# OOP cheat sheet**

    The course's reference: classes, inheritance, UML, patterns (in Dutch).

    [Go to the cheat sheet](/cheatsheet/)

</div>

## The idea in three sentences

1. **The AI does not write your practice code.** Every skill has a level from L0 (*demonstrate*) to L4 (*automated*). At L1–L3 a hook blocks the AI from writing, building or testing your code.
2. **Help comes in small rungs.** First a question, then where to look, then a sketch. The next rung only comes after a visible attempt by you.
3. **A task only counts after your explanation.** A green test is evidence, but it only counts towards your level once you explain in your own words *why* it works.

The design choices are grounded in the [research](research.md), with the sources in the [research notes](notes/index.md).

## Who it is for

For students who want to practise with Claude Code without the AI taking over the learning. The included map is for **Object-Oriented Design in C#** (HBO-ICT, the Netherlands), but the harness works for any course you make a skill map for.

!!! info "AI statement"
    The learning harness, the dashboard and this documentation were made with help from Claude (Anthropic). The learning data and the reflections in the dashboard are the learner's own. See [AI statement](ai-statement.md).
