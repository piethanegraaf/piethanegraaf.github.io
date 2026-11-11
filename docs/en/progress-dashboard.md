---
title: "Progress dashboard: skill levels, tasks, reflections"
description: "What the progress dashboard shows per skill, from levels and tasks to reviews and reflections, and how to publish your own data with a filtered export."
---
# Updating the dashboard

## What the dashboard shows

The [dashboard](/dashboard/?lang=en) shows progress per skill and microskill:

- your **level** and its history;
- what each **level means**: point at a level in the bar, the legend or a skill (or Tab to it) for what it is, why, the evidence and the step to the next level. All of it together is under *What do the levels mean?*;
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

In Claude Code, in this repo, `/update-dashboard ../my-practice-folder` does steps 3 to 5 for you. It stops before the commit.

## Translations

Your record is in one language (`settings.language`), and the dashboard is in Dutch and English. That is why every free text gets a translation in the other language: explanations, the diary (the facts and your reflection), your own notes and microskills, and the reasons for corrections and overrides. Titles from the skill map, the fixed notes of the harness and the signals already exist in both languages.

- **Claude translates, not the export.** The export has no network access. Claude translates faithfully: the same meaning and tone, nothing corrected or added. Code, test names and skill ids stay as they are.
- **Only new texts.** The export reuses the translations of the previous export. A text that changes is asked for again, and a text that is gone takes its translation with it.
- **Marked on the page.** A translation has a dotted underline. Point at it, or go to it with Tab, to see the original.
- **The same privacy filters.** The translations pass the same filters as the originals, including `.learning/private.json`.
- **Checked in the build.** The build of the site runs `node harness/export.mjs --check site-src/dashboard/data/progress.json`. A missing translation stops the build, so the dashboard never shows half of it in the other language. With `--allow-untranslated` the export writes the data anyway, for example to have a look locally, but the build still refuses it.

The dashboard is static: HTML, CSS and JavaScript without dependencies, with a strict Content Security Policy. All text from the data goes into the page through `textContent`.
