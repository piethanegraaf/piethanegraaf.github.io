# Learning harness

A learning harness for [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) that makes sure you learn to program **yourself**, even with an AI looking over your shoulder. It is for students, and for junior developers at work who do not want to stay junior because the AI does all the work.
The harness knows how far along you are per skill, and adjusts the AI's help to that. What you are still learning, you do yourself, with hints instead of solutions. What you have mastered, the AI may do straight away, and you maintain it by doing it yourself again now and then, when it comes by in your work.

<div class="grid cards" markdown>

- **Install**

    Put the harness in your own project folder with one command.

    [Go to the installation](install.md)

- **How it works**

    Levels, the hint ladder, the guard, explanations in your own words and reviews.

    [Go to the explanation](how-it-works.md)

- **Dashboard**

    Progress per (micro)skill, with real data and a demo.

    [Go to the dashboard](/dashboard/?lang=en)

- **C# OOP cheat sheet**

    The course's reference: classes, inheritance, UML, patterns.

    [Go to the cheat sheet](/en/cheatsheet/)

- **For researchers**

    Test the harness in a randomized trial: hypotheses, arms and outcomes.

    [Go to the invitation](researchers.md)

</div>

## Background

On the first test where AI was not allowed, I got stuck. I did not want that to happen again. So I looked into whether Claude had undermined my learning, and partly it had. The scientific literature also shows that this is a real risk: if you let the AI do the thinking while you practise, you can do less without it afterwards. An AI agent such as Claude Code makes that kind of offloading very easy (see the [risk assessment](research.md#3-risk-assessment)). That is why I built this harness.

The same risk does not stop at graduation. A junior developer who lets an agent do all the work gets the work done, but skips the practice through which you become a medior or senior: writing, debugging and designing yourself. That junior can stay junior. Interviews with juniors and seniors describe this pattern, and so do practitioners in talks and blog posts (see [§2.12](research.md#212-the-eternal-junior-problem)). That is the second goal of the harness.

In short, the harness helps you enough that you do not get stuck, but keeps things hard enough that you really learn. On the [dashboard](progress-dashboard.md) you can follow how your skills are developing.

## The idea: build first, then delegate, and maintain

1. **Build a skill yourself first.** Every skill has a level from L0 (*demonstrate*) to L4 (*automated*). At L1–L3 a hook blocks the AI from writing, building or testing your code. Help comes in small rungs: first a question, then where to look, then a sketch, each only after a visible attempt by you. A task only counts once you explain in your own words *why* it works.
2. **Then delegate it.** Once a skill is at L4, the AI may do it straight away, and you supervise. Your own time goes to what you are still learning.
3. **Maintain it now and then.** At growing intervals, the next time an L4 skill comes by in your work, you do that part yourself. If that goes wrong, the skill goes down a level.

Each part follows a principle with empirical support from learning science and from research on automation: see the [research](research.md), with the sources in the [research notes](notes/index.md). Whether the combination works has not been tested. That is why researchers are invited to test it in a randomized trial ([For researchers](researchers.md)).

## Who it is for

- **Students** who want to practise with Claude Code without the AI taking over the learning. The included map is for **Object-Oriented Design in C#** (HBO-ICT, the Netherlands).
- **Junior developers at work** who want to keep growing while they work with an AI agent. You make a skill map for your own stack (see [Your own course](configuration.md#your-own-course)). For now, tasks are logged automatically from tests only with `dotnet test`; otherwise you log them yourself.
- **Researchers** who want to test the harness: see [For researchers](researchers.md).

!!! info "AI statement"
    The learning harness, the dashboard and this documentation were made with help from Claude (Anthropic). The learning data and the reflections in the dashboard are the learner's own. See [AI statement](ai-statement.md).
