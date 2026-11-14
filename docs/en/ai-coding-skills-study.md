---
title: "Anthropic's study on AI and coding skills: what it found and what to do"
description: "In Anthropic's randomized trial, developers who learned a new library with AI scored 50% vs. 67% on a quiz, with the biggest gap on debugging. What it shows, what it does not, and what to do."
---
# Anthropic's study on AI and coding skills: what it found and what to do

**Short answer:** in a randomized trial published by Anthropic in January 2026, developers who learned a new Python library with an AI assistant scored 50% on a quiz afterwards, against 67% for those who coded by hand. The largest gap was on debugging, and the AI group was not significantly faster. Participants who asked the AI conceptual questions scored much higher than those who delegated the code, but that comparison is correlational. What to do with it: make the high-scoring way of working the default, and enforce it while you are still learning a skill.

## What the study did

| | |
|---|---|
| **Paper** | Shen & Tamkin (2026), *How AI Impacts Skill Formation*, arXiv preprint (Anthropic Fellows) |
| **Design** | Randomized: with or without an AI assistant (based on GPT-4o) |
| **Participants** | 52 developers, mostly professional or freelance, aged about 25–35, recruited through a crowdworker platform |
| **Task** | Learn Trio, an asynchronous Python library they did not know, and use it |
| **Outcome** | A quiz afterwards, without AI, including debugging questions |

## What it found

- **Less learning.** The AI group scored 50% against 67% on the quiz (d = 0.74, p = 0.01).
- **Debugging suffered most.** The largest gap was on the debugging questions, the skill you need to check code an AI wrote.
- **Not faster.** The AI group was only about two minutes faster, which was not significant.
- **How people used the AI mattered.** The interaction patterns with cognitive engagement, such as asking conceptual questions, or generating code and then checking their understanding of it, scored 65–86%. Patterns of delegation scored 24–39%.

## What it does not show

- **The patterns are correlational.** They were identified afterwards from screen recordings, with 2 to 7 people per pattern. Stronger or more motivated participants may simply have chosen them. The randomized result is the gap between the groups, not the effect of a pattern.
- **Short-term and small.** One task, one quiz right after it, 52 people. Nothing about what happens over months.
- **Not students.** Most participants already worked as developers. For beginners the stakes are higher: they still have to acquire the skills that experts only need to keep.
- **A vendor study.** Anthropic makes AI coding tools, but this result runs against its commercial interest, which makes it more credible rather than less.

The [literature review](research.md#28-generative-ai-and-learning-to-program-the-evidence-so-far) grades it A for the main effect and C for the patterns.

## How it fits the other evidence

The same picture appears in larger trials. In a high school with about 1,000 students, unrestricted GPT-4 raised practice scores by 48% but lowered exam scores by 17% once access was removed. A version that gave hints and no answers avoided the harm (Bastani et al., 2025). And telling a tutor in its system prompt to scaffold changed nothing in a trial with 1,059 students; gates built into the workflow did better (Barth et al., 2026). See the [key findings](research.md#key-findings).

## What to do with it

Choosing the high-scoring patterns takes discipline, especially near a deadline. The learning harness makes them the default for the skills you are still learning, and blocks the low-scoring one:

| In the study | In the learning harness |
|---|---|
| Asking conceptual questions scored high | When you are stuck, the first hint is a question, then where to look, then a sketch: concepts before code |
| Generating code, then checking your understanding, scored high | A task only counts after you explain it in your own words, judged by Claude and checked by a hook |
| Delegating the code scored low | At levels L1–L3 a hook stops Claude from writing, building or testing your code |
| Debugging had the largest gap | Debugging is a skill of its own in the map for junior developers: hints, not the fix |
| AI users were not faster while learning | The cost of practising by hand may be smallest while a skill is new; you delegate it once you master it (L4) |

Whether this produces the learning of the high-scoring participants has not been tested. That is what the [invitation to researchers](researchers.md) is for. See [How it works](how-it-works.md) and [Claude Code learning mode vs. a learning harness](claude-code-learning-mode.md).

## Frequently asked questions

### Did Anthropic find that AI makes developers worse?

Not exactly. It found that developers who learned a new library with AI learned less of it, especially debugging. Those who used the AI to understand, rather than to produce code, did much better, but that part is correlational.

### Were the developers with AI faster?

Only about two minutes, which was not statistically significant. While you are learning something new, AI may cost learning without saving much time.

### Should junior developers stop using AI?

No. The study suggests using it differently while you learn: ask for explanations, write the code yourself, and check your own understanding. Once you master a skill, delegating it is fine, as long as you keep it with an occasional review.

### Where can I read the study?

The paper is on [arXiv (2601.20245)](https://arxiv.org/abs/2601.20245), and Anthropic summarised it in [How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills).
