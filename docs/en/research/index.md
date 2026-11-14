---
title: "Learning to code with AI: literature review (2026)"
citation_title: "Learning to Code (and OOD) with AI: Literature Review, Risk Assessment & a Learning-Preserving Claude Code Setup"
citation_date: "2026/11/07"
jsonld: article
date_published: "2026-11-07"
keywords: ["generative AI", "learning to program", "desirable difficulties", "deskilling", "never-skilling", "computing education", "Claude Code", "secure coding"]
description: "AI that does your thinking while you practise lowers what you can do without it; AI used as a tutor does not. A 2026 review with a Claude Code setup."
---
# Learning to Code (and OOD) with AI: Literature Review, Risk Assessment & a Learning-Preserving Claude Code Setup

**Piet Hanegraaf, with Claude (Anthropic)** · [About the author](../about.md) · [How to cite](#cite)

*Prepared 7 November 2026 · revised 8 November 2026, rewritten for students and teachers on 10 November 2026 and updated with new literature the same day, extended for junior developers at work on 11 November 2026 (see §11) · For students who learn programming and Object-Oriented Design (OOD) with AI, for their teachers, and for junior developers at work*

> **Published version.** This review was first written for one student. This version is written for students and teachers in general; that student's situation remains as examples in boxes. Since 11 November 2026 it also covers junior developers at work (§2.12), and it invites researchers to test the harness (§6.1). Files it refers to, such as the session logs, are not published.

---

## Key findings {#key-findings}

1. **AI that does the thinking during practice lowers what you can do without it.** Unrestricted GPT-4 raised practice scores by 48% but lowered exam scores by 17% once access was removed ([Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122)). An AI tutor used mostly for direct answers lowered final grades by 0.37 SD in a trial with 2,379 students ([Liu et al., 2026](https://doi.org/10.26300/y3f8-vh05), working paper). See [§1](#summary).
2. **In programming, students retained less after practising with AI.** Copilot raised scores during the session, but students retained less a week later ([Gardella et al., 2026](https://arxiv.org/abs/2604.18538)). The group that programmed and debugged without AI retained more after seven weeks ([Albadarin, 2026](https://phys.org/news/2026-11-qa-exploring-generative-ai-impact.html), dissertation).
3. **AI used as a tutor can help.** In a proctored trial, ChatGPT access raised test scores without AI by 0.28 SD, mainly for students who used it like a tutor ([Contractor & Reyes, 2026](https://arxiv.org/abs/2607.08849), working paper).
4. **Developers who learned a new library with AI learned less and were not faster.** They scored 50% against 67% on a follow-up quiz, with the largest gap on debugging ([Shen & Tamkin, 2026](https://arxiv.org/abs/2601.20245), preprint).
5. **Guardrails work when they are enforced, not when they are requested.** Telling a tutor in its system prompt to scaffold changed nothing in a trial with 1,059 students ([Barth et al., 2026](https://doi.org/10.1145/3765964.3811656)). Gates built into the workflow did better.
6. **Pooled positive effects are mostly publication bias.** The most rigorous 2026 meta-analysis shrinks g = 0.84 to 0.08 after correction ([Boolzen et al., 2026](https://doi.org/10.1007/s10462-026-11665-9)), and an audit of 14 positive meta-analyses found impossible statistics and fabricated references ([O'Neill, 2026](https://hechingerreport.org/proof-points-ai-education-meta-analysis/), preprint).
7. **The skill shift is real, but keep writing code by hand while you learn.** The bottleneck has moved to reviewing and testing ([Chen & Stratton, 2026](https://fion.ac/jellyfish.pdf)), and hand practice builds those supervision skills. See §2.9 and §2.10.
8. **Juniors at work face the same risk: the eternal-junior problem.** Short-term experiments show the mechanism and interviews describe the pattern, but no study has followed juniors at work over time yet. See [§2.12](literature.md#212-the-eternal-junior-problem).

## Contents

This review is split over several pages:

- [Literature review](literature.md) (§2): what research says about learning to program, with and without AI.
- [The shift in skill needs](skill-shift.md) (§2.9): jobs, the economics of hand-written code, and what to practise.
- [Risk assessment and mitigation](risks.md) (§3–4).
- [Design: principles and Claude Code setup](design.md) (§2.11, §5 and the appendix).
- [Build log](build-log.md) (§10–11): what the first sessions showed, and the change log.
- [References](references.md) (§8).

This page has the key findings, the executive summary (§1), the evaluation (§6), the limitations (§7) and how to cite the review.

> **Status note.** Sections 1–9 are the original design. §1–4, §6–8 and §5.3/§5.7 were revised on 8 November 2026 with research from May–November 2026, the shift in skill needs, and a critical review of the original literature review; what changed and why is in the change log (§11). The harness as actually built differs in places: there are microskills, a test runner (`check.mjs`) instead of a PostToolUse evidence hook, a hard own-words explanation check, placement of a new skill by a first attempt, automatic demotion on evidence, Fibonacci reviews at L4 through real work, and a tooling zone. Those differences are summarized in §10, which reports what the first sessions showed; §10.4 covers the revision of 10 November 2026. If you use the harness, its `CLAUDE.md` is authoritative for day-to-day rules. A short literature update on 10 November 2026 added seven sources (change log, §11). On 11 November 2026, §2.12 (the eternal-junior problem) and §6.1 (an invitation to run a randomized trial) were added. On 13 November 2026, §2.13 (secure code as a first niche for juniors) was added.

---

<a id="1-executive-summary"></a>

## 1. Executive summary {#summary}

**The literature does not show that AI harms learning by itself. Letting AI do the thinking during practice lowers what you can do without it afterwards. AI that explains or tutors does no harm or helps a little.** The strongest evidence:

- **Performance with AI is not learning.**
    - **High-school maths:** unrestricted GPT-4 raised practice scores by 48% but lowered exam scores by **17%** once access was removed. A tutor that gave hints and no answers avoided the harm ([Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122)).
    - **University course:** in a 2026 trial with 2,379 students, an AI tutor used mostly for direct answers lowered final grades by 0.37 SD within the same course ([Liu et al., 2026](https://doi.org/10.26300/y3f8-vh05), working paper).
    - **Programming:** in a small study, Copilot raised scores during the session, but students retained less a week later ([Gardella et al., 2026](https://arxiv.org/abs/2604.18538)). In a quasi-experiment with 152 students, the group that programmed and debugged without AI retained more after seven weeks ([Albadarin, 2026](https://phys.org/news/2026-11-qa-exploring-generative-ai-impact.html), dissertation).
- **AI can also help.** In a proctored trial, ChatGPT access raised test scores without AI by 0.28 SD, mainly for students who used it like a tutor ([Contractor & Reyes, 2026](https://arxiv.org/abs/2607.08849), working paper). What decides it is whether the AI replaces your thinking or supports it ([Boolzen et al., 2026](https://doi.org/10.1007/s10462-026-11665-9)).
- **Developers learning a new library** with an AI assistant scored 50% vs. 67% on a follow-up quiz, with the largest gap on debugging, and were not significantly faster ([Shen & Tamkin, 2026](https://arxiv.org/abs/2601.20245), preprint).
- **Enforced guardrails work better than requested ones.** Telling a tutor in its system prompt to scaffold changed nothing in a trial with 1,059 students ([Barth et al., 2026](https://doi.org/10.1145/3765964.3811656)). Gates built into the workflow did better: mastery rules, explanation gates, blocks outside the model. That is the case for hooks over a "learning mode" prompt.
- **Pooled positive effects are mostly publication bias.** The most rigorous 2026 meta-analysis shrinks g = 0.84 to 0.08 after correction, and the most-cited 2025 meta-analysis was retracted. An independent audit of 14 positive meta-analyses found impossible statistics and fabricated references ([O'Neill, 2026](https://hechingerreport.org/proof-points-ai-education-meta-analysis/), preprint).
- **Weaker than the first version claimed** (see the change log, §11):
    - that specific interaction patterns *cause* better learning: every study so far let students choose their own pattern;
    - that LLMs widen the gap between strong and weak students: this rests on an exploratory analysis;
    - that the "85% rule" applies to people: it was shown only in simulations;
    - that expanding review intervals beat equal ones: they do not, reliably;
    - the "Google effect": its first experiment failed to replicate, twice.

**The skill shift is real, but it is not a reason to stop writing code by hand while you are learning it (§2.9).**

- **For the shift:**
    - most new code at AI-forward companies is now drafted by AI;
    - the tool costs about 1–2% of a developer's labour cost;
    - US projections expect "programmer" jobs to shrink, and "developer" jobs to grow more slowly than forecast before.

    For routine, well-specified code at work, writing it by hand is no longer the cheapest way.

- **Against dropping hand practice:**
    - the bottleneck has moved to reviewing and testing, which a study of 655 firms has now measured independently ([Chen & Stratton, 2026](https://fion.ac/jellyfish.pdf));
    - AI code still fails more than a third of security checks;
    - entry-level hiring has weakened in the US, but how much of that is due to AI is contested;
    - new interview formats test reading, debugging and checking AI output.

    Hand practice builds those supervision skills, and delegation erodes them most (§2.10).

So the evidence argues for **adding** deliberate practice of AI-era skills (review, testing, specification, verification) on top of hand-written fundamentals, not for replacing them. It also fits programmes that hold the final assessment at AI level 0/1. That matches the Dutch two-lane consensus (Npuls); it is not an outlier.

**Two horizons.** Until your exam, the target is competence without AI under the conditions of your exam. That means practising timed, without AI, in the environment of your exam (§2.6). After the exam, and for your work after your studies, the target follows the shift in skill needs: the supervision side of working with AI, such as specifying, testing and reviewing AI output (§2.9). The risk register (§3) covers both horizons, including the risks of investing too much and too little in writing code by hand.

!!! example "Example: one student's situation"
    This review was first written for a second-year HBO-ICT student. The student's OOD exam at CHE was timed, at AI level 0/1, and about ten weeks after the review was written. For that student, the first horizon ran until that exam date. After it, the focus could widen to the supervision skills of §2.9.

**A second target group: junior developers at work.** The risk does not end with the exam. A junior who lets an agent do the work before they can do it themselves gets the work done, but skips the practice through which a junior becomes a medior or senior. This review calls that the **eternal-junior problem** (§2.12). Experiments show the mechanism in the short term, and interviews in software teams describe the pattern. Practitioners warn about it in talks and blog posts (grade D). No study has followed juniors at work over time yet, and AI can also help people learn on the job.

The learning-science foundations line up with this:

- **Effort:** learning depends on effortful generation and retrieval ([Bjork, 1994](https://doi.org/10.7551/mitpress/4561.003.0011); [Roediger & Karpicke, 2006](https://doi.org/10.1111/j.1467-9280.2006.01693.x)).
- **Expertise:** the right amount of help changes with your expertise ([Kalyuga et al., 2003](https://doi.org/10.1207/s15326985ep3801_4)).
- **Fading:** scaffolds should be **faded** ([Renkl & Atkinson, 2003](https://doi.org/10.1207/s15326985ep3801_3); [Wood, Bruner & Ross, 1976](https://doi.org/10.1111/j.1469-7610.1976.tb00381.x)).
- **Difficulty:** practice should be hard enough that you sometimes fail.
- **Decay:** mastered skills **decay** unless they are reinforced at spaced intervals ([Arthur et al., 1998](https://doi.org/10.1207/s15327043hup1101_3); [Cepeda et al., 2006](https://doi.org/10.1037/0033-2909.132.3.354)).
- **Transfer:** practice transfers best when it matches the conditions of the test ([Morris, Bransford & Franks, 1977](https://doi.org/10.1016/S0022-5371%2877%2980016-9)).

**Proposal:** a Claude Code setup in which every skill moves up an **Autonomy Ladder**. The ladder goes from *AI demonstrates*, to *I complete*, to *I write with hints*, to *I write alone*, to *mastered → AI automates*, and ends with spaced "maintenance" checks that can demote the skill again. Three pieces of infrastructure enforce it:

1. A **skill record** (`skills.json`) that tracks the level, evidence and next review date for each skill.
2. An **AI diary**: one entry per session, with facts logged by the AI and reflection written by you.
3. **Hooks** (`SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`) that inject level-appropriate tutoring rules, block the AI from writing code you are still supposed to write, schedule reviews and prompt reflection.

The hooks are a **commitment device** you choose for yourself ([Ariely & Wertenbroch, 2002](https://doi.org/10.1111/1467-9280.00441)), not a prison. You can step out deliberately, and stepping out gets logged.

**The trade-off in one line:** build a skill by hand first, delegate it to the AI once you have mastered it, and maintain it with practice by hand now and then. Each part follows a principle with empirical support (§2.11). Whether the combination works, for students or for juniors at work, has not been tested. A literature review cannot settle that, so §6.1 invites researchers to test it in a randomized trial.

**For teachers and programmes.** This review is written mainly for students. §4.2 is a separate part for teachers and programmes: it turns this evidence into points for the AI policy of a course or programme.

---

<a id="6-evaluation"></a>

## 6. Evaluation {#evaluation}

How do you know whether the harness protects your learning and does not just add friction? Check these points:

1. **Unassisted transfer tests** at the start (baseline), after about a month, and shortly before your exam. Use small OOD tasks *without AI*: design a class diagram, refactor a smelly class, apply a pattern to a new domain. This is the measure that matters most. [Bastani et al. (2025)](https://doi.org/10.1073/pnas.2422633122) showed that how well you do in practice with AI tells you little about how well you do without it.
2. **Success rate per skill** should stay around 70–95%. If it stays above 95%, the friction is too low. If it stays below 70%, the friction is too high.
3. **Override rate.** If it rises, that is a sign of frustration (R6) or of bypassing the rules (R5). Read the reasons in the diary.
4. **Calibration.** The gap between your predicted confidence and how independently you actually work should shrink over time (R2).
5. **Review pass rate** for L4 skills should be 80% or higher. If it is lower, shorten the intervals.
6. **Time to mastery per skill.** It should *decrease* for later skills that build on prerequisites you have already mastered. This is a transfer effect.
7. **Mock exam vs. practice (R14).** Do a timed mock exam without AI, in the same environment (IDE) as your exam. Compare your score with your success rate in practice. A big gap means that your practice conditions are too easy, or too different from the test.
8. **Supervision check (R16, after your exam).** Take a short class written by AI, with planted OOD and test flaws, and count how many flaws you find without help. Repeat this every month.

### 6.1 Invitation to researchers: a randomized trial

The checks above are for one learner. Whether the harness works in general needs a randomized controlled trial. The page [For researchers](../researchers.md) proposes one. In short:

- **Arms:** Claude Code without restrictions; Claude Code with a learning prompt only (the *Learning* output style); Claude Code with the harness.
- **Participants:** students in a programming course, or junior developers with 0–2 years of experience.
- **Primary outcome:** a timed transfer test without AI, at least eight weeks after the last practice.
- **Secondary outcomes:** planted flaws found in code written by AI, tasks completed, time to L4, and overrides.
- **Maintenance within one person:** randomize which L4 skills get reviews.

---

<a id="7-limitations"></a>

## 7. Limitations {#limitations}

- **The evidence base is young.** Most studies on generative AI date from 2023–2026. They often have small samples or short durations, or they are preprints and working papers (e.g. [Kosmyna et al., 2025](https://arxiv.org/abs/2506.08872); [Shen & Tamkin, 2026](https://arxiv.org/abs/2601.20245); [Lehmann et al., 2025](https://arxiv.org/abs/2409.09047); most of the 2026 trials in §2.8). In higher education, only one study has measured retention beyond about a week: a quasi-experiment with a seven-week test ([Albadarin, 2026](https://phys.org/news/2026-11-qa-exploring-generative-ai-impact.html)). The Stanford SCALE review (November 2026) also finds long-term gains still unshown. Effects may change as the tools change.
- **A narrative review, corrected once.** There was no search protocol, and the first version overstated several findings (§11). The revision added evidence grades and targeted searches. It is still not systematic, so selection bias is possible.
- **Little OOD-specific AI research, and none on agentic tools.** Most studies of AI in computing education focus on programming tasks from CS1 (the first programming course). Applying them to design skills is an inference from research on OOD misconceptions plus general learning science. No controlled study yet exists of how students learn with agentic tools like Claude Code.
- **The evidence on the skill shift is mostly American, descriptive and commercial.** Causal labour-market studies disagree. Dutch data are thin and correlational. The figures on how much code AI writes come mainly from companies that sell AI. No study measures the best mix of practice by hand and practice in supervision, so §2.9 and §4.1 are inferences.
- **Conflict of interest.** This document was written by Claude, an Anthropic model, and it relies in places on Anthropic research. Check the important claims through the linked sources.
- **Hooks are a commitment device, not security.** You can always switch them off, and the AI can sometimes find routes around the rules (e.g. shell commands that write files). So the harness cannot prove to a teacher that a student worked without AI. It works because *you* chose it. The `PreToolUse` matcher can be extended to `Bash` for common file-writing commands, but this will never be airtight. Hooks can also misfire the other way. In the first sessions of the pilot, reports from background agents were treated as the student's own prompts and unlocked hint rungs, until this was fixed (§10.2, item 10).
- **Tried by one student so far.** The design was first tried in a pilot with one student. What §10 reports comes from those first sessions. It shows what went wrong and what was changed, not how well the harness works for students in general.
- **Not tried at work.** The case for junior developers at work (§2.12) rests on a short-term experiment, small interview studies, analogies with other professions, and practitioner sources of grade D. No junior developer has used the harness at work yet.
- **Practitioner sources show concern, not proof.** The talks, interviews, news articles and blog posts in §2.12 show that the concern is widespread. They do not show that it is true.
- **Mastery thresholds are heuristics.** The numbers (85%, 3 successes over 2 days, the intervals) come from the literature, but they have not been validated for this setup. Adjust them using your own evaluation data (§6).
- **Detecting skills from prompts is approximate.** Matching on keywords will sometimes pick the wrong skill. Let the AI propose a skill and confirm it, or name the skill yourself (`/learn ood.strategy`).

---

<a id="how-to-cite-this-review"></a>

## How to cite this review {#cite}

Written by Piet Hanegraaf with Claude (Anthropic); see the [AI statement](../ai-statement.md). Cite the version and the date you read, because the review is updated.

**APA**

> Hanegraaf, P. (2026). *Learning to code (and OOD) with AI: Literature review, risk assessment and a learning-preserving Claude Code setup* (version of 11 November 2026; written with Claude, Anthropic). https://piethanegraaf.github.io/en/research/

**BibTeX**

```bibtex
@misc{hanegraaf2026learning,
  author       = {Hanegraaf, Piet},
  title        = {Learning to Code (and {OOD}) with {AI}: Literature Review, Risk Assessment and a Learning-Preserving {Claude Code} Setup},
  year         = {2026},
  month        = nov,
  howpublished = {\url{https://piethanegraaf.github.io/research/}},
  note         = {Version of 11 November 2026. Written with Claude (Anthropic).}
}
```
