---
name: update-dashboard
description: Update the learning dashboard from a practice folder, up to a pull request - in its own git worktree, export with the privacy filters, translate every new free text into the other language of the dashboard, check the result and the security, and after the user's approval commit, push and open (or extend) the pull request. Use when the user asks to update, export or publish the dashboard data, or to fill in translations.todo.json.
---

# Update the dashboard

The steps have one source: `harness/skills/update-dashboard/SKILL.en.md` (Dutch: `SKILL.nl.md`). The installer copies that skill into every practice folder, so that `/diary` can update the dashboard from a practice session too.

Read `harness/skills/update-dashboard/SKILL.en.md` in this checkout and follow it. Here, in the repo, the practice folder is the argument (for example `../ood`).
