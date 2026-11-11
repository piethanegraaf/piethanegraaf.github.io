---
title: "Learning harness for Claude Code: practise coding yourself"
description: "Free Claude Code setup for students: hooks stop the AI from writing your practice code, hints come in steps, and a dashboard tracks your skills."
jsonld: software
---
# Learning harness

A free, open-source [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) setup that stops the AI from writing your practice code, so you learn to program **yourself**, even with an AI looking over your shoulder.
The harness knows how far along you are per skill, and adjusts the AI's help to that. What you have mastered, you maintain by doing it yourself again now and then, when it comes by in your work. What you are still learning, you do yourself, with hints instead of solutions.

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

</div>

## Background

On the first test where AI was not allowed, I got stuck. I did not want that to happen again. So I looked into whether Claude had undermined my learning, and partly it had. The scientific literature also shows that this is a real risk: if you let the AI do the thinking while you practise, you can do less without it afterwards. An AI agent such as Claude Code makes that kind of offloading very easy (see the [risk assessment](research.md#3-risk-assessment)). That is why I built this harness.

In short, the harness helps you enough that you do not get stuck, but keeps things hard enough that you really learn. On the [dashboard](progress-dashboard.md) you can follow how your skills are developing.

## The idea in three sentences

1. **The AI does not write your practice code.** Every skill has a level from L0 (*demonstrate*) to L4 (*automated*). At L1–L3 a hook blocks the AI from writing, building or testing your code.
2. **Help comes in small rungs.** First a question, then where to look, then a sketch. The next rung only comes after a visible attempt by you.
3. **A task only counts after your explanation.** A green test is evidence, but it only counts towards your level once you explain in your own words *why* it works.

The design choices are grounded in the [research](research.md), with the sources in the [research notes](notes/index.md).

## Who it is for

For students who want to practise with Claude Code without the AI taking over the learning. The included map is for **Object-Oriented Design in C#** (HBO-ICT, the Netherlands), but the harness works for any course you make a skill map for.

- **Teachers and course coordinators:** see [For educators](for-educators.md): what it enforces, how to fit it to your course, and what happens to student data.
- **Education researchers:** see [For researchers](for-researchers.md): the question it makes testable and what a trial would need.

## Frequently asked questions

### Is using Claude Code for practice cheating?

Whether you may use AI is up to your course, not to the harness. The harness makes sure the AI does not do the practice for you: at L1–L3 a hook blocks it from writing, building or testing your code, and every exception you allow is logged. Check your course's AI policy.

### Can I stop Claude Code from writing my code?

Yes. That is what the guard hook does: per skill, at levels L1–L3, it blocks Claude from writing, deleting, building or testing your code. You can still allow it for a while with an override that you set yourself, and that is logged. See [How it works](how-it-works.md#the-guard).

### Does it work for courses other than C#?

Yes, with a skill map for your course: the skills, keywords and notes in `harness/maps/<id>/`. The included map is for Object-Oriented Design in C#. For another language you set which files are code and which commands build; the test runner `check.mjs` only supports `dotnet test` for now. See [Configuration](configuration.md#your-own-course).

### What data does it store, and where?

Everything stays on your computer, in `.learning/` in your project folder, which the installer keeps out of git. The hooks make no network connections. Only if you choose to publish a dashboard does a filtered export leave the folder, with a whitelist of fields and filters for names, paths and e-mail addresses. See [Configuration and privacy](configuration.md#privacy).

### Is it free?

Yes. The code is open source under AGPL-3.0, and the texts, docs and data are under CC BY-NC 4.0. You do need access to Claude Code itself, through a Claude plan or the API.

!!! info "AI statement"
    The learning harness, the dashboard and this documentation were made with help from Claude (Anthropic). The learning data and the reflections in the dashboard are the learner's own. See [AI statement](ai-statement.md).
