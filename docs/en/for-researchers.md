---
title: "For researchers: testing gated AI help in programming"
description: "The question the learning harness makes testable, what it records and exports, what a trial would need, and how to get in touch about a study."
---
# For researchers

The learning harness makes one open question testable in a real course: does AI help that is gated and comes in steps preserve learning better than unrestricted AI help? This page invites researchers and course teams to test it.

## The question it makes testable

Unrestricted AI raises scores during practice but can lower what students can do without it afterwards ([§1 of the literature review](research.md#1-executive-summary)). Guardrails seem to work when they are enforced in the workflow, and much less when they are only asked for in a prompt: telling a tutor in its system prompt to scaffold changed nothing in a trial with 1,059 students (Barth et al., 2026). No controlled study yet covers agentic tools like Claude Code.

The harness enforces the gating outside the model, with Claude Code hooks, so the condition does not depend on the model following instructions. The review's [Evaluation](research.md#6-evaluation) section lists outcome measures, and its [Limitations](research.md#7-limitations) section lists what is still unknown.

## What the harness records

During practice the harness keeps a local record per student: levels per skill, every task with the rung of help it needed, the student's explanations, overrides and a diary. The export (`harness/export.mjs`, schema 1) turns that into one JSON file with whitelisted fields only:

- the level of every skill and microskill, and its history;
- per task: the rung of help, the source (test, logged by the student, chat), the explanation, and whether it was rejected, corrected or skipped;
- reviews, regressions, overrides and promotion signals;
- activity per day;
- from the diary: the plan, confidence before the session, what went well, the reflection and the calibration note.

Raw events, session ids, transcripts, file paths and test runs never leave the student's project. Every free text passes filters for e-mail addresses, paths, user names, session ids and the student's own list of private terms, and students can see what would be filtered with `--dry-run`. That makes the export a sound base for study data. A study still needs its own consent and data agreement.

## What a trial would need

These are open design questions, not a finished protocol:

- **Arms:** the harness, unrestricted Claude Code, and no AI.
- **Outcomes:** unassisted transfer tests at the start, after about a month and before the exam, plus retention after several weeks.
- **Setting:** a course cohort, ethics approval, informed consent, and GDPR (AVG) handling of the exported data.
- **Fidelity:** students can switch the harness off, so the override log and the export show how it was actually used.

## What is on offer

- The harness itself: open source (AGPL-3.0-only) and configurable per course with a skill map.
- A worked skill map for Object-Oriented Design in C#.
- Help with setting it up and adapting it for a study.

## Get in touch

We are looking for education researchers and course teams who want to test gated AI help in a programming course. [Open an issue on GitHub](https://github.com/piethanegraaf/piethanegraaf.github.io/issues/new) to get in touch.
