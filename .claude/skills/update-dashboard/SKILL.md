---
name: update-dashboard
description: Update the learning dashboard from a practice folder - export with the privacy filters, translate every new free text into the other language of the dashboard, and check the result. Use when the user asks to update, export or publish the dashboard data, or to fill in translations.todo.json.
---

# Update the dashboard

Answer in the user's language. Never commit or push: the user checks the diff and does that.

## Steps

1. The practice folder is the argument (for example `../ood`). Not given? Ask for it.
2. Preview: `node harness/export.mjs <folder> --dry-run`. Show the user what is filtered and how many texts have no translation yet.
3. Export: `node harness/export.mjs <folder>`.
   - Exit code 0: go to step 5.
   - Exit code 2: translations are missing. Go to step 4.
   - Exit code 1: an error. Show it and stop.
4. Translate: open `site-src/dashboard/data/translations.todo.json` and fill in every empty language field, following the rules below and the `about` field of the file. Then run step 3 again. It takes the translations over and removes the file.
5. Check: `node harness/export.mjs --check site-src/dashboard/data/progress.json`. Then give a short summary of the diff of `site-src/dashboard/data/progress.json`: new tasks and diary sessions, and the new translations. Point out any translation you were unsure of.

## Translating

- **Faithful:** the same meaning, tone and length. Do not correct, improve, summarize or add anything. A short, informal reflection stays short and informal. Translate what was meant: a typo does not need to be copied.
- **The learner's own words:** explanations (`task.explanation`) and reflections (`diary.reflection.*`) keep the learner's voice. The dashboard marks every translation and shows the original next to it.
- **Unchanged:** code, identifiers and test names, skill ids (such as `cs.basis`), levels (L0-L4), compiler codes (such as CS0161), numbers, dates, times and placeholders in square brackets (such as `[privé]`).
- **The dashboard's words:** trede = rung, vaardigheid = skill, microvaardigheid = microskill, uitleg = explanation, herhaling = review, doorstroom = promotion, terugval = relapse, opdracht = exercise, dagboek = diary, plaatsing = placement, zelfvertrouwen = confidence, kalibratie = calibration, (leer)harnas = (learning) harness, overgeslagen = skipped.
- **Unclear text:** translate it as literally as you can, never invent context, and name it in step 5.
- Only fill in the todo file. Never edit `progress.json` by hand: the export writes it, with the privacy filters.
