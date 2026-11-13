---
title: "For educators: the learning harness in your course"
description: "What the learning harness enforces and what it cannot, how to fit it to your course with a skill map, what happens to student data, and what the licences allow."
---
# For educators

The learning harness lets students use Claude Code in a programming course without the AI doing their practice for them. Students install it themselves. It supports their learning; it is not a proctoring tool.

## What it enforces, and what it cannot

- **No AI-written practice code.** At levels L1–L3 a hook blocks Claude from writing, building or testing the student's code. Help comes as a hint ladder: a question, then where to look, then a sketch.
- **Explanations count, not green tests.** A task only counts after the student explains in their own words why it works.
- **Exceptions are visible.** When a student allows Claude to write code for a while (an override), that is logged and shows up in the diary.
- **It cannot prove that a student worked without AI.** Students can switch the hooks off, use another AI tool, or find a way around the rules. The harness works because the student chooses it. Use it for practice, and keep your assessments under your own conditions.

## Graded work

Does your institution allow AI as an aid in graded work, but not AI-written code? At CHE, for example, the exam rules (OER art. 7.11) allow AI level 1: AI "to generate ideas or bring structure", with a statement of how it was used. The student can then name the repo of the assignment as graded work. In those paths:

- **Claude writes nothing**, at any level and without an override: no code, no tooling, no builds or tests. Reading is allowed.
- **Help stops at rung 4**: a question, where to look, a sketch, or an example of at most 5 lines on another topic. A worked solution is never available there. At AI level 0 Claude gives no help at all.
- **Every answer goes into an AI-use log** in the repo, in `ai-verantwoording/` (`ai-use/` in English), written by the hooks and not by Claude: one row per answer with the rung and the kind of help, and an export of each session. The last column is for the student: what they did with the help and how they checked it.

This gives you material for the statement of AI use, but it is not proof either: the same limits as above apply. Whether an example at rung 4 still counts as "generating ideas or bringing structure" is for your institution to decide; the log names every one. See [Graded work](how-it-works.md#graded-work) and the reasons in [§10.8 of the research](research.md#108-revision-of-13-november-2026-graded-work-under-the-exam-rules).

## Fitting it to your course

The harness reads a skill map: the skills of your course, the keywords that link a student's prompt to a skill, and notes with course-specific agreements for Claude. The included map in [`harness/maps/ood/`](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/main/harness/maps/ood) is a worked example for Object-Oriented Design in C#:

- `skills.json`: the skills, the files each skill covers, and the default settings;
- `keywords.json`: the words that link a prompt to a skill;
- `notes.nl.md` and `notes.en.md`: the course's own agreements for Claude.

For a language other than C#, you set which files are code and which commands build. The test runner `check.mjs` only supports `dotnet test` for now. See [Configuration](configuration.md#your-own-course).

## What happens to student data

Everything stays on the student's computer, in `.learning/` in their project folder. The hooks make no network connections, so you see nothing unless a student chooses to publish a dashboard. That export contains only a whitelist of fields, and filters names, paths and e-mail addresses out of every text. See [Configuration and privacy](configuration.md#privacy).

One exception is meant for you: the AI-use log of graded work is in the repo of the assignment, so you see it when the student hands in that repo. The same filters remove e-mail addresses, the home folder and the student's own terms from it.

## May I use it?

- **The code** is licensed under AGPL-3.0-only. You may use it, change it and share it. If you offer a changed version as a network service, you share its source code too.
- **The texts, docs, research and cheat sheet** are licensed under CC BY-NC 4.0: you may use them for non-commercial purposes, with attribution.
- **Commercial training providers** need a commercial licence. See [Licence](https://github.com/piethanegraaf/piethanegraaf.github.io#license) in the README.

## A paragraph for your course guide

Adapt it to your course:

> You may use Claude Code in this course if the learning harness is installed. The harness stops the AI from writing your practice code and gives you hints instead. It cannot check whether you worked without AI, so [the assessments in this course are done without AI].

Or, if AI is allowed as an aid in the final assignment:

> In the final assignment you may use Claude Code at AI level 1, with the learning harness installed in the repo of the assignment and that repo named as graded work. Hand in the AI-use log (`ai-verantwoording/`) with your repo, with the last column filled in.

## Next steps

- **Write a skill map** for your course, starting from the [OOD map](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/main/harness/maps/ood), and [install](install.md) the harness with it.
- **Questions, or want to try it in a course?** E-mail [hanegraafpiet@gmail.com](mailto:hanegraafpiet@gmail.com).
- **Why it is built this way:** the [literature review](research.md) explains the evidence behind each choice.
