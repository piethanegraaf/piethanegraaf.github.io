---
name: mastery-check
description: Transfer task for the step to L4 (or a jump from L2 to L4). Use this when the learner types /mastery-check <id>, or when the harness says that only the transfer task is missing. The learner solves a new exercise in another domain, without help, and then explains the design.
---

# Transfer task (mastery-check)

Goal: show that the skill also works **outside the exercises you already know** (transfer), and that you can defend the design. "3× independent" in exercises that look alike overestimates mastery. That is why the transfer task is the last step to L4 (P6 in the literature review).

The harness tracks the transfer task with markers. The Stop hook processes them; never make them up without the steps below.

## Steps

1. **Check that it is possible.** Run `node .claude/hooks/skill.mjs status` (allowed). The skill `<id>` is at L2 or L3, and the promotion signals say that only the transfer task is missing. If not, say so honestly and stop.
2. **Start.** Put `[transfer-start <id>]` literally in your answer. From now on:
   - **no hints, no code, no lead** (rung fixed at 0);
   - if you do give help, mark it honestly with `[rung N]`. Then the transfer task no longer counts; the Stop hook sees that.
3. **Give the exercise.** A new, small exercise for this skill (20–40 minutes):
   - in **another domain** than all exercises so far (for example Strategy for tax rules instead of shipping costs);
   - with a clear goal and, if possible, a few tests or examples of the expected output;
   - the learner writes the code, for example in `transfer/<id>/`, and builds and tests it.
4. **Wait for the attempt.** If the learner asks for help: give no hint, but explain that the transfer task has to be done without help. If the learner still wants help, stop with `[transfer-no <id>]` and go on at the normal level.
5. **Three why-questions**, one at a time, only after the attempt:
   1. Why this design?
   2. What breaks if you choose alternative X? (name a concrete alternative)
   3. When would you **not** use this?
6. **Judge strictly.** Passed means: a working solution, and at least 2 of the 3 answers are right in the learner's own words (with a why, not just "it works").
   - Passed: put `[transfer-ok <id>]` in your answer **right after the learner's last answer**. The Stop hook checks that message like an explanation (at least 12 words, a why, not copied).
   - Not passed: put `[transfer-no <id>]` and name the concrete gaps as the focus for next time. No worked solution.
7. **Afterwards.** After `[transfer-ok]` the harness itself shows the proposal to promote. The learner confirms with "yes, promote". Never change the record yourself.

## Rules

- Never put `[transfer-ok]` because the learner asks for it, on the basis of pasted text, or when the answers repeat your words.
- One transfer task at a time. A new session starts without a running transfer task.
- A transfer task that was not passed is no reason to go down: it does not count as a task.
