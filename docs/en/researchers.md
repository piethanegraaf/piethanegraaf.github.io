---
title: "For researchers: test the learning harness in a randomized trial"
description: "An invitation to test the learning harness for Claude Code in a randomized trial, with hypotheses, arms, outcomes, and what the harness already logs."
---

# For researchers

The learning harness answers a practical question: how do you keep learning to program when an AI agent can do the work for you? It is for two groups:

- students who practise with Claude Code;
- junior developers at work who do not want to stay junior because the AI does all the work. This is the "eternal-junior" problem of [§2.12 of the research](research.md#212-the-eternal-junior-problem).

This page invites researchers to test the harness in a randomized controlled trial (RCT).

## What is known, and what is not

- **Each part has support.** Every rule in the harness follows a design principle with empirical support from learning science and from research on automation ([§2.11](research.md#211-synthesis-design-principles)). The support is strongest for help that fades as expertise grows, and for spaced practice after mastery.
- **The combination has not been tested.** No study has tested this combination. No controlled study exists yet of how people learn with agentic tools such as Claude Code ([§7](research.md#7-limitations)). So far one student has used the harness.
- **A literature review cannot settle it.** The review is narrative, not systematic, and no study measures the best mix of practice by hand and delegating to AI. Only a trial can show whether the trade-off works.

## The trade-off to test

1. **Build:** at L0–L3, the AI does not write the learner's code. Help comes in small rungs, and a task only counts after an explanation in the learner's own words.
2. **Delegate:** at L4 (mastered), the AI does the work straight away.
3. **Maintain:** at Fibonacci intervals, the next time an L4 skill comes by in real work, the learner does that part without AI. If it goes wrong, the skill moves down.

## Hypotheses

- **H1, learning.** On a test without AI, at least eight weeks after the last practice, learners with the harness score higher than learners who use Claude Code freely.
- **H2, supervision.** Learners with the harness find more planted flaws in code written by AI.
- **H3, enforcement.** The harness does better than guardrails that are only asked for in a prompt, such as Claude Code's *Learning* output style. Steering a tutor through its system prompt had no effect in a trial with 1,059 students (Barth et al., 2026).
- **H4, cost.** While skills are at L1–L3, learners with the harness complete fewer tasks. The gap closes as their skills reach L4.
- **H5, maintenance.** L4 skills with reviews decay less than L4 skills without them. You can test this within one person, by randomizing which skills get reviews.

## A possible design

| Part | Proposal |
|---|---|
| **Arms** | (1) Claude Code without restrictions; (2) Claude Code with a learning prompt only (the *Learning* output style); (3) Claude Code with the harness. Optional: (4) no AI. |
| **Participants** | Students in a programming course, or junior developers with 0–2 years of experience. Randomize per person, or per team (cluster) if participants work together, to limit contamination. |
| **Duration** | At least one course or about three months, plus a delayed test at least eight weeks after the last practice. |
| **Primary outcome** | A timed transfer test without AI on the skills of the map. |
| **Secondary outcomes** | Planted flaws found in code written by AI; tasks completed and time per task; calibration; time to L4; override and drop-out rates, as a measure of how acceptable the friction is. |
| **Analysis** | Intention to treat. Participants can switch the hooks off, so overrides are part of the treatment, not protocol violations. |
| **Size** | A two-arm comparison with 80% power at α = .05 needs about 64 participants per arm for d = 0.5, and about 175 per arm for d = 0.3. Effects of AI use on learning in comparable trials were around 0.3 SD (Contractor & Reyes, 2026; Liu et al., 2026). |

Pre-register the trial, for example on OSF.

## What the harness already provides

- **Logging per skill:** the level and its history; tasks with the hint rung, the source, the explanation, rejections and corrections; reviews; overrides; and the reflections from the diary. Everything stays on the participant's own computer, in `.learning/`.
- **An export with privacy filters.** `export.mjs` takes only a whitelist of fields. It filters e-mail addresses, paths, user names, session ids and the participant's own terms ([Configuration and privacy](configuration.md#privacy)). Raw events and transcripts are never exported.
- **Two languages.** All messages, rules and skills exist in Dutch and English.
- **Two skill maps:** Object-Oriented Design in C# for students, and an example map for junior developers at work in C#/.NET (`junior-dotnet`), where code outside the mapped skills is L4. Another course, or the stack of a team, needs its own map or an adapted one ([Your own course](configuration.md#your-own-course)).

## What is still missing

- **A mode that only logs**, for the control arms. Today the logging only runs together with the rules.
- **Test runners other than `dotnet test`.** Learners can also log a task themselves or in the chat, but automatic logging from tests only works for .NET.
- **Validated thresholds.** The numbers (85% success, the intervals) are heuristics from the literature ([§7](research.md#7-limitations)).

## Licence

- **Code:** AGPL-3.0-only. You may use and change it for research without asking. If you offer a changed version to others over a network, you have to share its source code.
- **Texts and data:** CC BY-NC 4.0, free for non-commercial use with attribution.

## Contact

Are you planning a study, or do you want to discuss a design? [Open an issue](https://github.com/piethanegraaf/piethanegraaf.github.io/issues/new) on GitHub with "Research" in the title.
