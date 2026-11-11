---
name: update-dashboard
description: Update the learning dashboard from a practice folder, up to a pull request - in its own git worktree, export with the privacy filters, translate every new free text into the other language of the dashboard, check the result and the security, and after the user's approval commit, push and open (or extend) the pull request. Use when the user asks to update, export or publish the dashboard data, or to fill in translations.todo.json.
---

# Update the dashboard

Answer in the user's language. Work in your own git worktree, never in the main checkout. Commit and push only after the user's approval, and never merge: the user merges the pull request.

## Steps

1. **The practice folder** is the argument (for example `../ood`). Not given? Ask for it. Make it an absolute path now, from the main checkout: in the worktree a relative path points somewhere else.
2. **Look around**, without changing the main checkout:
   - `git fetch origin` and `git worktree list`.
   - Is a dashboard pull request still open? `gh pr list --state open --json number,url,headRefName,files` and look for the ones whose files include `site-src/dashboard/data/progress.json`.
     - **One, on a `dashboard-*` branch:** continue on it (step 3a). Two dashboard pull requests would conflict on `progress.json`, and the translations in the open one are not on `main` yet.
     - **More than one, or one on another branch:** ask the user which one to use, or whether to stop.
     - **None:** a new branch (step 3b).
3. **The worktree**, in your scratchpad directory (for example `<scratchpad>/wt-dashboard`; pick another name when it exists):
   - **3a. On the open pull request:** `git worktree add -B <branch> <path> origin/<branch>`. Does a local branch of that name have commits that are not on `origin` (`git log origin/<branch>..<branch>`)? Then ask first: `-B` would set it back. Is the branch already checked out in another worktree (see `git worktree list`)? Then use that worktree if `git status` is clean there, and otherwise ask.
   - **3b. New:** the branch is `dashboard-YYYY-MM-DD` (today); is that name taken, locally or on `origin` (`git branch -a --list "*dashboard-YYYY-MM-DD*"`), add `-2`, `-3`, and so on. `git worktree add --no-track -b <branch> <path> origin/main`.
   - Run every next command in the worktree.
4. **Preview:** `node harness/export.mjs <folder> --dry-run`. Show the user what is filtered and how many texts have no translation yet. Does the folder have no `.learning/private.json`? Say so, and ask whether to go on.
5. **Export:** `node harness/export.mjs <folder>`.
   - Exit code 0: go to step 7.
   - Exit code 2: translations are missing. Go to step 6.
   - Exit code 1: an error. Show it and stop.
6. **Translate:** open `site-src/dashboard/data/translations.todo.json` and fill in every empty language field, following the rules below and the `about` field of the file. Then run step 5 again. It takes the translations over and removes the file.
7. **Check:**
   - `node harness/export.mjs --check site-src/dashboard/data/progress.json`.
   - `LEERHARNAS_PRIVATE=<folder>/.learning/private.json node harness/security-check.mjs`. The variable matters: `.learning/private.json` is git-ignored, so a fresh worktree has none, and without it the check does not look for the private terms. With BLOKKEER or TWIJFEL: show it and stop.
8. **Show and ask.** Give a short summary of the diff of `site-src/dashboard/data/progress.json`: new tasks, diary sessions, level changes (promotions, placements, demotions), regressions, and the new translations. Point out every translation you were unsure of. Then ask for approval with AskUserQuestion: commit and open the pull request (or add the commit to the open one), change a translation first, or stop.
   - Say that this export has already reset the counter in `<folder>/.learning/state/last-export.json` (the line "since the last export" at the session start and in `/diary`): stopping does not undo that. That is how it was chosen.
   - **Change a translation:** write `site-src/dashboard/data/translations.todo.json` with `"source"` (the language of the record) and one item per change, `{ "text": "<original>", "<language>": "<new translation>" }`. A translation in the todo file wins over the earlier one. Run step 5, then step 7 and 8 again. Never edit `progress.json` by hand.
   - **Stop:** commit nothing. Leave the worktree and say where it is.
9. **Only after approval:**
   - `git add site-src/dashboard/data/progress.json` and nothing else. Check with `git status --short` that no other file is staged.
   - Commit, for example "Export the progress of the practice session of 11 November", with a short body (new tasks, level changes, diary sessions, number of translations) and the attribution lines your session asks for.
   - `LEERHARNAS_PRIVATE=<folder>/.learning/private.json node harness/security-check.mjs --range origin/main..HEAD`. With BLOKKEER or TWIJFEL: stop and show it; do not push.
   - `git push -u origin <branch>`. Does a hook refuse the push? Show it and stop; never use `--no-verify`.
   - **New branch:** `gh pr create --base main --head <branch>` with a title like the commit, and a body with what changed, the checks you ran, and the translations to look at. **Open pull request:** say that it got a new commit, with its URL.
   - `git worktree remove <path>`. Does git refuse (changes left)? Show them and ask; do not force it. The branch stays on GitHub.
   - Give the user the URL of the pull request. Never merge it.

## Translating

- **Faithful:** the same meaning, tone and length. Do not correct, improve, summarize or add anything. A short, informal reflection stays short and informal. Translate what was meant: a typo does not need to be copied.
- **The learner's own words:** explanations (`task.explanation`) and reflections (`diary.reflection.*`) keep the learner's voice. The dashboard marks every translation and shows the original next to it.
- **Unchanged:** code, identifiers and test names, skill ids (such as `cs.basis`), levels (L0-L4), compiler codes (such as CS0161), numbers, dates, times and placeholders in square brackets (such as `[privé]`).
- **The dashboard's words:** trede = rung, vaardigheid = skill, microvaardigheid = microskill, uitleg = explanation, herhaling = review, doorstroom = promotion, terugval = relapse, opdracht = exercise, dagboek = diary, plaatsing = placement, zelfvertrouwen = confidence, kalibratie = calibration, (leer)harnas = (learning) harness, overgeslagen = skipped.
- **Consistent:** look at how the earlier translations in `progress.json` render the same phrase, and keep to that.
- **Unclear text:** translate it as literally as you can, never invent context, and name it in step 8.
- Only fill in the todo file. Never edit `progress.json` by hand: the export writes it, with the privacy filters.
