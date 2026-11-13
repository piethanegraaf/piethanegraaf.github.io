---
title: "Learning harness for Claude Code: practise coding yourself"
description: "Free Claude Code setup for students and junior developers: hooks stop the AI writing your practice code, hints come in steps, a dashboard tracks your skills."
jsonld: software
---
# Learning harness

**AI can make you faster at programming and worse at it at the same time.**

This free, open-source harness for [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) keeps the learning with you, at school and at work: hints instead of the code you are still learning to write, until you can do it yourself. Then the AI may take over, and you keep the skill up by doing it yourself now and then.

[Install it](install.md){ .md-button .md-button--primary } [How it works](how-it-works.md){ .md-button } [The research](research.md#key-findings){ .md-button }

## Why I built it

The practice test of my university course on object-oriented programming went fine. I did most of it without AI, and asked for help when I got stuck. The diagnostic test after it was different: a half-built project with an existing design, design tasks to finish, and unit tests to complete, which were new to me. I just wanted to get through it. I was stressed and upset, and in the end I handed in only the solution file, without the project.

Looking back, I had rarely explained to myself the code I practised with, and my experience with AI agents at work had given me a false sense of security. Research shows the same risk: in a high-school maths trial, unlimited AI raised practice scores by 48% but lowered exam scores by 17% once it was gone ([Bastani et al., 2025](research.md#key-findings)).

So I built a harness that keeps the learning with me. I practise with it now; the real exam is still to come, and you can follow my progress on the [dashboard](/dashboard/?lang=en).

Junior developers face the same trap: the agent gets the work done, but the skills that make you a medior do not grow ([§2.12 of the research](research.md#212-the-eternal-junior-problem)).

## What do you think? {#poll}

<div class="poll" data-poll="judge-code" data-t-loading="Loading the results…" data-t-results="Results so far: {n} votes" data-t-results-one="Results so far: 1 vote" data-t-yours="your vote" data-t-delay="New votes can take a few hours to show up in the totals." data-t-unavailable="Thanks for voting. The results cannot be shown right now." data-t-thanks="Thanks!">
<p class="poll__premise">AI already drafts most new code at AI-forward companies.</p>
<p class="poll__question" id="poll-question">Is learning to judge code (reviewing, testing, debugging, design) still worth your time, or will AI take that over within a year too?</p>
<div class="poll__answers" role="group" aria-labelledby="poll-question">
<button type="button" class="md-button" data-answer="more-than-ever">Yes, more than ever: someone has to check AI's work</button>
<button type="button" class="md-button" data-answer="for-now">Yes, for now, but not for long</button>
<button type="button" class="md-button" data-answer="not-sure">Not sure</button>
<button type="button" class="md-button" data-answer="ai-takes-over">No, AI will judge code itself within a year</button>
</div>
<div class="poll__result" aria-live="polite" hidden></div>
<div class="poll__role" hidden>
<p id="poll-role">And you are…?</p>
<div class="poll__roles" role="group" aria-labelledby="poll-role">
<button type="button" class="md-button" data-role="student">A student</button>
<button type="button" class="md-button" data-role="junior">A junior developer</button>
<button type="button" class="md-button" data-role="experienced">An experienced developer</button>
<button type="button" class="md-button" data-role="teacher-researcher">A teacher or researcher</button>
<button type="button" class="md-button" data-role="other">Something else</button>
</div>
</div>
<p class="poll__note">Anonymous: counted with GoatCounter, without cookies. One vote per browser; the totals are public.</p>
</div>

<div class="grid cards" markdown>

- **Install**

    Put the harness in your own project folder with one command.

    [Go to the installation](install.md)

- **How it works**

    Levels, the hint ladder, the guard, explanations in your own words and reviews.

    [Go to the explanation](how-it-works.md)

- **The research**

    What studies say about learning to program with AI: the key findings, a risk assessment and the sources.

    [Go to the key findings](research.md#key-findings)

- **Dashboard**

    Progress per (micro)skill, with real data and a demo.

    [Go to the dashboard](/dashboard/?lang=en)

- **C# OOP cheat sheet**

    The course's reference: classes, inheritance, UML, patterns.

    [Go to the cheat sheet](/en/cheatsheet/)

</div>

## The idea: build first, then delegate, and maintain

1. **Build a skill yourself first.** Every skill has a level from L0 (*demonstrate*) to L4 (*automated*). At L1–L3 a hook blocks the AI from writing, building or testing your code. Help comes in small rungs: first a question, then where to look, then a sketch, each only after a visible attempt by you. A task only counts once you explain in your own words *why* it works.
2. **Then delegate it.** Once a skill is at L4, the AI may do it straight away, and you supervise. Your own time goes to what you are still learning.
3. **Maintain it now and then.** At growing intervals, the next time an L4 skill comes by in your work, you do that part yourself. If that goes wrong, the skill goes down a level.

Each part follows a principle with empirical support from learning science and from research on automation: see the [research](research.md), with the sources in the [research notes](notes/index.md). Whether the combination works has not been tested. That is why researchers are invited to test it in a randomized trial ([For researchers](researchers.md)).

## Who it is for

- **Students** who want to practise with Claude Code without the AI taking over the learning. The included map is for **Object-Oriented Design in C#** (HBO-ICT, the Netherlands).
- **Junior developers at work** who want to keep growing while they work with an AI agent. There is an example map for C#/.NET (`junior-dotnet`): code that belongs to no skill may be written by the AI, and only what you are learning is protected. You adapt it to your own codebase (see [Your own course](configuration.md#your-own-course) and [In a team repository](install.md#in-a-team-repository)). For now, tasks are logged automatically from tests only with `dotnet test`; otherwise you log them yourself. For secure coding there is a practice map with eight exercises (`security-dotnet`). See [For junior developers](for-juniors.md).
- **Teachers and course coordinators** who want to use it in a course: see [For educators](for-educators.md).
- **Researchers** who want to test the harness: see [For researchers](researchers.md).

## Frequently asked questions

### Is using Claude Code for practice cheating?

Whether you may use AI is up to your course, not to the harness. The harness makes sure the AI does not do the practice for you: at L1–L3 a hook blocks it from writing, building or testing your code, and every exception you allow is logged. Check your course's AI policy. For graded work, such as a final assignment, you can name its repo as [graded work](how-it-works.md#graded-work): then Claude writes no content there (only fixed tooling, such as `dotnet new` or the official arc42 template), gives hints up to rung 4, and every answer goes into an AI-use log for your statement of AI use.

### Can I stop Claude Code from writing my code?

Yes. That is what the guard hook does: per skill, at levels L1–L3, it blocks Claude from writing, deleting, building or testing your code. You can still allow it for a while with an override that you set yourself, and that is logged. In the paths of graded work it blocks this at every level, and there is no override. See [How it works](how-it-works.md#the-guard).

### Does it work for courses other than C#?

Yes, with a skill map for your course: the skills, keywords and notes in `harness/maps/<id>/`. The included maps are Object-Oriented Design in C# for students, an example for a junior developer in C#/.NET, and a practice map for secure coding in C#/.NET with eight exercises. For another language you set which files are code and which commands build; the test runner `check.mjs` only supports `dotnet test` for now. See [Configuration](configuration.md#your-own-course).

### Will AI make me stay a junior developer?

It can. A junior who hands work to an agent before they can do it themselves gets the work done, but may not build the skills that make a medior: debugging, reading code, design judgement and checking AI output. In one short randomized trial, engineers who learned a new library with AI scored 50% against 67% on a quiz afterwards (Shen & Tamkin, 2026). With the harness you build what you are learning yourself and delegate the rest. See [For junior developers](for-juniors.md).

### What data does it store, and where?

Everything stays on your computer, in `.learning/` in your project folder (or, with `--learning-dir`, in that of your practice folder), which the installer keeps out of git. One exception is intended: in [graded work](how-it-works.md#graded-work) the hooks write a filtered AI-use log into the repo of the assignment, for your teacher. The hooks make no network connections. Only if you choose to publish a dashboard does a filtered export leave the folder, with a whitelist of fields and filters for names, paths and e-mail addresses. See [Configuration and privacy](configuration.md#privacy).

### Is it free?

Yes. The code is open source under AGPL-3.0, and the texts, docs and data are under CC BY-NC 4.0. You do need access to Claude Code itself, through a Claude plan or the API.

## Get started

Install the harness in your own project, see how it works, or read the research behind it.

[Install it](install.md){ .md-button .md-button--primary } [How it works](how-it-works.md){ .md-button } [The research](research.md#key-findings){ .md-button }

!!! info "AI statement"
    The learning harness, the dashboard and this documentation were made with help from Claude (Anthropic). The learning data and the reflections in the dashboard are the learner's own. See [AI statement](ai-statement.md).
