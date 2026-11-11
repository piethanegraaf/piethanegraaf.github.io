---
title: "Progress dashboard: skill levels, tasks, reflections"
description: "What the progress dashboard shows per skill, from levels and tasks to reviews and reflections, and how to publish your own data with a filtered export."
---
# Updating the dashboard

## What the dashboard shows

![The learning dashboard with made-up demo data: 86% solved independently, the number of skills per level, and progress per skill and microskill](../assets/images/dashboard-demo-en.png)

*The dashboard with made-up demo data.*

The [dashboard](/dashboard/?lang=en) shows progress per skill and microskill:

- your **level** and its history;
- what each **level means**: point at a level in the legend or the bar (or Tab to it) for what it is and the step to the next level. Esc closes the explanation. Why, the evidence and the route from the start (placement open) to L4 are under *What do the levels mean?*: the criteria per step, and how you go up and down;
- how many tasks were **solved** with at most rung 2, over the last 10 explained tasks, against the 85% target;
- per task: the rung, the source (test, logged yourself, chat), your **explanation**, and when it was **rejected** or **corrected**;
- the **reviews** (only L4, Fibonacci), neutral: when the next one is ready, and when you **last** saw the skill in your work. Nothing is "overdue": a review waits until the skill comes by;
- **skipped** tasks: the explanation did not come right away, so they do not count. They are shown apart from failed and from waiting for an explanation, and hatched in the chart;
- what the harness did **automatically**: the placement of a new skill and automatic demotion, marked in the level history;
- **promotion and relapse signals**, **regressions** and **overrides**;
- a **diary timeline** with your reflections and the **calibration**: your confidence before and after.

Every chart has a table view. You can switch between Dutch and English, and between the real data and the [demo with made-up data](/dashboard/?lang=en&data=demo).

## Publishing your own data

1. Create `.learning/private.json` with the names and terms that must not go online (see [Configuration and privacy](configuration.md#privacy)).
2. Did an approved explanation get lost, for example through a harness bug? Recover it first with `replay` (see the [reference](reference.md)). Otherwise the task shows up online as open or skipped.
3. Look at what will be filtered: `node harness/export.mjs ../my-practice-folder --dry-run`
4. Export: `node harness/export.mjs ../my-practice-folder`. Are there texts without a translation (see [Translations](#translations))? Then the export writes no data. It stops with exit code 2 and lists those texts in `site-src/dashboard/data/translations.todo.json`.
5. Let Claude fill in the translations ("fill in translations.todo.json") and export again. The export takes the translations over, removes the todo file and writes `progress.json`.
6. Check the diff of `site-src/dashboard/data/progress.json`, the translations too, then commit and push it yourself. The dashboard shows the date and time of the export, so you can see how current it is.

In Claude Code, in this repo, `/update-dashboard ../my-practice-folder` does steps 3 to 6 for you, up to a pull request:

- **In its own worktree.** It never works in your main checkout. Is a dashboard pull request still open? Then it continues on that branch: the two do not conflict, and the translations in it are kept. Otherwise it starts a new branch `dashboard-YYYY-MM-DD` from `origin/main`.
- **Checked.** After the export and the translations it runs `--check` and the security check, with the private terms of your practice folder. A fresh worktree has no `.learning/private.json` of its own, because that file is never committed.
- **Only after your approval.** It shows you the diff and the translations it was unsure of, and asks whether it may go on. Only then does it commit `progress.json`, push the branch and open the pull request (or add a commit to the open one). Merging is up to you.

## Since the last export

When the export writes the data, it also writes `.learning/state/last-export.json` in your practice folder: the moment and three totals (tasks, diary sessions and level changes). No texts and no paths.

From then on the harness says in one line what is new since that export, for example:

> Since the last export (11 Nov 13:50): 3 tasks, 1 diary session, 2 level changes. Update the dashboard with /update-dashboard in the repo.

- **At the start of a session**, only when something is new.
- **At the end of `/diary`**, always. You can also run `! node .claude/hooks/skill.mjs since-export` yourself.
- **Without an export, nothing.** Without `last-export.json`, for example when you do not use the dashboard, the harness says nothing about it.

A level change is every new line in the level history, so a placement and an automatic demotion count too. The counter starts again at every export that writes the data, also when you do not approve the pull request after all. `--dry-run` and an export that stops for translations (exit code 2) do not touch it.

## Translations

Your record is in one language (`settings.language`), and the dashboard is in Dutch and English. That is why every free text gets a translation in the other language: explanations, the diary (the facts and your reflection), your own notes and microskills, and the reasons for corrections and overrides. Titles from the skill map, the fixed notes of the harness and the signals already exist in both languages.

- **Claude translates, not the export.** The export has no network access. Claude translates faithfully: the same meaning and tone, nothing corrected or added. Code, test names and skill ids stay as they are.
- **Only new texts.** The export reuses the translations of the previous export. A text that changes is asked for again, and a text that is gone takes its translation with it.
- **One button for the original.** A notice at the top says the texts are translated. *Show original* shows all of the learner's texts in the language they were written in, and *Show translation* switches back.
- **The same privacy filters.** The translations pass the same filters as the originals, including `.learning/private.json`.
- **Checked in the build.** The build of the site runs `node harness/export.mjs --check site-src/dashboard/data/progress.json`. A missing translation stops the build, so the dashboard never shows half of it in the other language. With `--allow-untranslated` the export writes the data anyway, for example to have a look locally, but the build still refuses it.

The dashboard is static: HTML, CSS and JavaScript without dependencies, with a strict Content Security Policy. All text from the data goes into the page through `textContent`.
