# Updating the dashboard

## What the dashboard shows

The [dashboard](/dashboard/?lang=en) shows progress per skill and microskill:

- your **level** and its history;
- how many tasks were **solved** with at most rung 2, over the last 10 explained tasks, against the 85% target;
- per task: the rung, the source (test, logged yourself, chat), your **explanation**, and when it was **rejected** or **corrected**;
- the **reviews** (Fibonacci) and which ones are overdue;
- **promotion and relapse signals**, **regressions** and **overrides**;
- a **diary timeline** with your reflections and the **calibration**: your confidence before and after.

Every chart has a table view. You can switch between Dutch and English, and between the real data and the [demo with made-up data](/dashboard/?lang=en&data=demo).

## Publishing your own data

1. Create `.learning/private.json` with the names and terms that must not go online (see [Configuration and privacy](configuration.md#privacy)).
2. First look at what will be filtered: `node harness/export.mjs ../my-practice-folder --dry-run`
3. Export: `node harness/export.mjs ../my-practice-folder`
4. Check the diff of `site-src/dashboard/data/progress.json`, then commit and push it yourself.

The dashboard is static: HTML, CSS and JavaScript without dependencies, with a strict Content Security Policy. All text from the data goes into the page through `textContent`.
