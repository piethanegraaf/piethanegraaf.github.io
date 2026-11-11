---
title: "Learning harness for Claude Code: practise coding yourself"
description: "Free Claude Code setup for students and junior developers: hooks stop the AI writing your practice code, hints come in steps, a dashboard tracks your skills."
jsonld: software
---
# Learning harness

A free, open-source [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) setup that stops the AI from writing the code you are still learning to write, so you learn to program **yourself**, even with an AI looking over your shoulder. It is for students, and for junior developers at work who do not want to stay junior because the AI does all the work.
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
- **Junior developers at work** who want to keep growing while they work with an AI agent. There is an example map for C#/.NET (`junior-dotnet`): code that belongs to no skill may be written by the AI, and only what you are learning is protected. You adapt it to your own codebase (see [Your own course](configuration.md#your-own-course) and [In a team repository](install.md#in-a-team-repository)). For now, tasks are logged automatically from tests only with `dotnet test`; otherwise you log them yourself. See [For junior developers](for-juniors.md).
- **Teachers and course coordinators** who want to use it in a course: see [For educators](for-educators.md).
- **Researchers** who want to test the harness: see [For researchers](researchers.md).

## Frequently asked questions

### Is using Claude Code for practice cheating?

Whether you may use AI is up to your course, not to the harness. The harness makes sure the AI does not do the practice for you: at L1–L3 a hook blocks it from writing, building or testing your code, and every exception you allow is logged. Check your course's AI policy.

### Can I stop Claude Code from writing my code?

Yes. That is what the guard hook does: per skill, at levels L1–L3, it blocks Claude from writing, deleting, building or testing your code. You can still allow it for a while with an override that you set yourself, and that is logged. See [How it works](how-it-works.md#the-guard).

### Does it work for courses other than C#?

Yes, with a skill map for your course: the skills, keywords and notes in `harness/maps/<id>/`. The included maps are Object-Oriented Design in C# for students, and an example for a junior developer in C#/.NET. For another language you set which files are code and which commands build; the test runner `check.mjs` only supports `dotnet test` for now. See [Configuration](configuration.md#your-own-course).

### Will AI make me stay a junior developer?

It can. A junior who hands work to an agent before they can do it themselves gets the work done, but may not build the skills that make a medior: debugging, reading code, design judgement and checking AI output. In one short randomized trial, engineers who learned a new library with AI scored 50% against 67% on a quiz afterwards (Shen & Tamkin, 2026). With the harness you build what you are learning yourself and delegate the rest. See [For junior developers](for-juniors.md).

### What data does it store, and where?

Everything stays on your computer, in `.learning/` in your project folder, which the installer keeps out of git. The hooks make no network connections. Only if you choose to publish a dashboard does a filtered export leave the folder, with a whitelist of fields and filters for names, paths and e-mail addresses. See [Configuration and privacy](configuration.md#privacy).

### Is it free?

Yes. The code is open source under AGPL-3.0, and the texts, docs and data are under CC BY-NC 4.0. You do need access to Claude Code itself, through a Claude plan or the API.

!!! info "AI statement"
    The learning harness, the dashboard and this documentation were made with help from Claude (Anthropic). The learning data and the reflections in the dashboard are the learner's own. See [AI statement](ai-statement.md).
