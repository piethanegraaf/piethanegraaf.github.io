---
name: diary
description: Close a learning session with a diary entry in .learning/diary/. Use this when the learner stops, says "done" or types /diary. Claude logs the facts, the learner writes the reflection.
---

# Writing a diary entry

Goal: self-regulation (plan → execution → reflection). The learner writes the reflection, so the learning effect stays with the learner. So never write the reflection yourself.

## Steps

1. **Collect the facts** of this session:
   - Which skills and microskills (ids from `.learning/skills.json`) and at which level.
   - What the learner wrote themselves and what you wrote: files, roughly how much.
   - What the learner reported about builds and tests, and the output of `check.mjs` if there is any.
   - Run `node .claude/hooks/skill.mjs status` (allowed): reviews, open explanations, independent successes and promotion signals.
   - Events of this session in `.learning/state/events.jsonl`. Read the file with Read, not through the shell.
     - `hint-unlock`: rung and reason. `hint-hold`: rung refused because there was no attempt. `rung-mark`: help you marked with `[rung N]`.
     - `review-help`: help in a review after a task, with `[review-rung N #id]`, and `reviewOf` (the task the review belonged to). It only counts for the next task about the same concept; a task with `reviewRung` got its rung from it. Name it apart from the ordinary help.
     - `task-start`: new work began (the reason: `code-elsewhere`, `check-elsewhere`, `prompt-exercise` or `prompt-id`). `help-dropped`: ordinary help from before that start, which does not count for the new task. Name it separately, with the rung.
     - `paths`: the learner linked an exercise folder to a skill, or removed one.
     - `task` (with `tid`, `source`: chat, check or done): a finished task, with success and the highest rung. `test-green`: which tests turned green.
     - `task-explained`: explanation approved (counts); with `source: replay` recovered afterwards. `explain-rejected`: explanation rejected, by you (`claude`) or by the check (`hook`).
     - `task-lapsed`: the explanation did not come right away, so the task lapsed (`other-exercise` or `session-end`). List those tasks as **skipped**, apart from failed.
     - `task-void`: voided by the learner. Mention this explicitly. `task-correct`: rung raised afterwards by the learner, with a reason. Mention this too.
     - `regression`: tests that were green and turned red. `regression-fixed`: green again after a relapse (no new task). Many of both in a short time can point to guessing.
     - `deny`, `override`, `override-used`: what the guard did.
     - `review`, `level`, `micro-add`, `setting`: reviews, level changes, new microskills, settings.
     - Promotion: `promotion-offered` (the harness made a proposal, with `from` and `to`), `promotion-confirmed` and a `level` with `by: learner` and `via: voorstel` (the learner said "yes, promote"), `promotion-declined` (the learner said no). Name a promoted skill concretely, with the evidence.
     - The transfer task (`/mastery-check`): `transfer-start`, `transfer-passed`, or `transfer-failed` (with `why`: `help` when there was a hint, `claude` when Claude judged it not passed).
     - Done automatically by the harness, mention it separately: `placement` (level of a new skill after its first task), `level` with `auto: true` (automatic demotion; `by` says by whom: harness, demotion analyst or backstop), `micro-add` with `auto: true` and `task-retag` (the analyst linked tasks to a microskill), `demotion-verdict` (the analyst's verdict, with reason). If it says `doubt: true`, note "the analyst was in doubt".
     - `review` with `auto: true`: the outcome of an L4 review, from normal work. `review-due`: the review came by.
   - The plan and confidence from the start, if there are any.

2. **Ask for the reflection in one message** and then wait:
   > 1. What did you learn? Explain it as if you were telling a classmate.
   > 2. What was confusing, or what would you do differently next time?
   > 3. How confident are you now (1–5), and what is your next step?

   Are there still tasks waiting for an explanation? Then ask for that explanation in this message too: it is the last chance. Per task: why does it work now?
   - Judge that explanation as in CLAUDE.md: write `[explain-ok <tid>]` or `[explain-no <tid>]`.
   - What is still open after the diary **lapses**: it does not count and the dashboard shows it as skipped. No open explanation goes on to the next session.

   Copy the answers **literally**: do not correct or add anything. If the learner does not want to reflect, write "skipped".

3. **Append to** `.learning/diary/YYYY-MM-DD.md` (today's date). If the file already exists, put the entry below it as a new session. Use this format:

   Put the marker `<!-- session: <session-id> -->` right below the heading. The session id is in the context of the learning harness. Without that marker the Stop hook does not let you close.

```markdown
## Session <n> · <start time>–<end time> · <skill-id> (<level>), ...
<!-- session: <session-id> -->

**Plan (learner):** <goal> · confidence before: <1-5 or unknown>

**Facts (logged):**
- Hint rungs: <e.g. 1, 2> · marked help: <[rung N] ...> · refused without an attempt: <n> · worked solution given: <yes/no>
- Review help: <[review-rung N #id] at task [tid], or "none"> · dropped help (help-dropped): <rung, or "none">
- Tasks: <id [tid]: solved/not, highest rung, source (check/done/chat), explanation approved/rejected/skipped>
- Written by the learner: <...> · written by the AI: <...>
- Tests (by the learner, check.mjs): <green/red, new green>
- Guard denials: <n> · overrides: <n, with reason> · voided tasks: <n>
- Reviews (L4, from normal work): <id: pass/shaky/fail → next date, or "none">
- Automatic: <placements, automatic demotions, microskills from the analyst, doubt of the analyst, or "nothing">

**What went well (independently):** <(micro)skills that worked at rung 0–2, concretely>
**Promotion signals:** <from `status`, with command, or "none">
**Suggested microskills:** <add-micro suggestions from this session, or "none">

**Reflection (own words):**
1. *Learned:* <literally>
2. *Confusing / different:* <literally>
3. *Confidence now:* <1-5> · *Next step:* <literally>

**Calibration:** before <x> → <what really happened, e.g. "solved with rung ≤1"> → <underestimated / right / overestimated>
```

4. **Up: suggest, do not run.** If a promotion criterion from CLAUDE.md seems to be met, name the command the learner can run themselves. The harness goes down by itself when `autoDemote` is on: then say what happened and how to revert it. When it is off, name the command for a relapse too. For example:
   `! node .claude/hooks/skill.mjs set ood.encapsulatie L3 "5/5 solved, mostly rung 0-1"`.
   The decision is the learner's. Raising a level is only possible when no tasks of that skill wait for an explanation anymore.

5. **The dashboard.** Last, after writing the entry, run `node .claude/hooks/skill.mjs since-export` (allowed). If it prints a line, give that line to the learner as it is, as the last line of your message. If it prints nothing (there was no export yet), say nothing about the dashboard.
