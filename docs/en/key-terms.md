---
title: "Key terms: desirable difficulties, never-skilling and the eternal junior"
description: "Short definitions of the terms behind learning to program with AI: desirable difficulties, productive failure, cognitive offloading, deskilling, never-skilling, the eternal junior and more."
---
# Key terms

The terms behind this project, each defined in one sentence, with its source and the section of the [literature review](research.md) that discusses it.

## Desirable difficulties

**Desirable difficulties** are conditions that make practice feel slower and harder, but improve long-term retention and transfer, such as spacing, retrieval and generating an answer yourself (Bjork, 1994; Bjork & Bjork, 2011). An AI assistant removes exactly these difficulties, which is why the harness puts some of them back. See [§2.2](research.md#22-friction-desirable-difficulties-vs-getting-stuck).

## Illusion of competence

An **illusion of competence** is the belief that you have learned something because practice felt easy, a judgment that is systematically wrong (Koriat & Bjork, 2005). Working code and a fluent explanation from an AI make it stronger. See [§2.2](research.md#22-friction-desirable-difficulties-vs-getting-stuck).

## Productive failure

**Productive failure** is struggling with a problem before you get instruction, which can improve understanding and transfer, as long as an explanation follows that builds on your attempt (Kapur, 2008, 2016). A meta-analysis of 53 studies found a moderate advantage (g = 0.36; Sinha & Kapur, 2021). See [§2.2](research.md#22-friction-desirable-difficulties-vs-getting-stuck).

## Cognitive offloading

**Cognitive offloading** is using an external tool to reduce the mental work of a task, which people do whenever it is cheaper (Risko & Gilbert, 2016). It lowers memory for the offloaded content mainly when there is no explicit goal to learn it. See [§2.10](research.md#210-automation-offloading-over-reliance-and-deskilling).

## Deskilling

**Deskilling** is the loss of a skill you had, because automation now does the work. Automating routine work removes the practice people need for the rare hard cases (Bainbridge, 1983). The first strong real-world signal comes from medicine: after routine use of AI, experienced endoscopists found fewer adenomas without it (Budzyń et al., 2025). See [§2.10](research.md#210-automation-offloading-over-reliance-and-deskilling).

## Never-skilling

**Never-skilling** is not building a skill at all, because AI does the work before you ever learned it. Medical educators use the term for trainees (Abdulnour, Gin & Boscardin, 2025). For a student or a junior it is the sharper risk: an expert has to *keep* a skill, a beginner still has to *acquire* it. See [§2.10](research.md#210-automation-offloading-over-reliance-and-deskilling).

## The eternal-junior problem

The **eternal-junior problem** is what happens when a junior developer hands work to an AI agent before they can do it themselves: the work gets done, but the skills that make a mid-level or senior developer do not grow. This review coined the term; it is never-skilling at work. See [§2.12](research.md#212-the-eternal-junior-problem) and [For junior developers](for-juniors.md).

## Paradox of supervision

The **paradox of supervision** is that checking AI output needs the very skills that delegating to AI erodes. Anthropic named it after interviewing its own engineers (vendor source). See [§2.10](research.md#210-automation-offloading-over-reliance-and-deskilling).

## Build, delegate, maintain

**Build, delegate, maintain** is the trade-off this project proposes: build a skill by hand first, delegate it to the AI once you master it, and keep it with short reviews in your own work. Each part follows a principle with empirical support; the combination has not been tested. See [§2.11](research.md#211-synthesis-design-principles) and [For researchers](researchers.md).

## Autonomy ladder (L0–L4)

The **autonomy ladder** is a level per skill that sets how much the AI may do: from L0 (the AI demonstrates on another topic) to L4 (the AI does it, you supervise). At L1–L3 a hook stops the AI from writing, building or testing your code. See [How it works](how-it-works.md#levels-per-skill) and [§5.2](research.md#52-the-autonomy-ladder-per-skill).

## Hint ladder

A **hint ladder** is help in rungs that each give away a little more: a question, a pointer, a sketch, a small example on another topic, and only then a worked solution. The next rung comes only after a visible attempt. See [How it works](how-it-works.md#the-hint-ladder-l2) and [§5.3](research.md#53-friction-calibration-the-hint-ladder).

## Spaced reinforcement

**Spaced reinforcement** is reviewing a mastered skill at growing intervals, so it does not decay. Spaced practice beats massed practice (Cepeda et al., 2006), and cognitive skills such as writing correct code from memory decay faster than physical ones (Arthur et al., 1998). In the harness, a review at L4 is the next time the skill comes by in your own work. See [§2.5](research.md#25-retention-after-mastery-spacing-retrieval-and-skill-decay) and [§5.7](research.md#57-spaced-reinforcement-after-mastery).

## Transfer task

A **transfer task** is a new exercise in another domain, solved without any hint, that shows a skill works outside the exercises you practised on. In the harness it is needed before a skill goes from L3 to L4. See [How it works](how-it-works.md#promotion-and-reviews).
