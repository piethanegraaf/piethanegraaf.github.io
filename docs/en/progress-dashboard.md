---
title: "Progress dashboard: skill levels, tasks, reflections"
description: "What the progress dashboard shows per skill, from levels and tasks to reviews and reflections, and how to publish your own data with a filtered export."
---
# Updating the dashboard

## What the dashboard shows

The [dashboard](/dashboard/?lang=en) shows progress per skill and microskill:

- your **level** and its history;
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
4. Export: `node harness/export.mjs ../my-practice-folder`
5. Check the diff of `site-src/dashboard/data/progress.json`, then commit and push it yourself. The dashboard shows the date and time of the export, so you can see how current it is.

The dashboard is static: HTML, CSS and JavaScript without dependencies, with a strict Content Security Policy. All text from the data goes into the page through `textContent`.
