# Security exercises (C#/.NET)

Eight small exercises for secure code. Each folder is one xUnit test project: the code and its tests are in the
same project, and each exercise starts from a short situation at work.

| Folder | Skill | What you practise |
|---|---|---|
| `01-sql-search` | `security.sql-params` | A search query built from user input: parameters instead of string concatenation |
| `02-sql-filter-sort` | `security.sql-params` (harder) | A value and a sort column: a parameter for the value, an allow-list for the column name |
| `03-greeting-html` | `security.output-encoding` | A name in HTML text and in an attribute: HTML encoding |
| `04-audit-log-validation` | `security.output-encoding` (harder) | Log injection with line breaks, and validating a username at the boundary |
| `05-api-key-config` | `security.secrets-config` | A hard-coded API key: from configuration, no fallback, masked in output |
| `06-reset-token` | `security.secrets-config` (harder) | A password-reset token: a cryptographically secure random generator |
| `07-ai-review-comments` | `security.ai-review` | Reviewing AI code: one problem, you write the test that exposes it |
| `08-ai-review-orders` | `security.ai-review` (harder) | Reviewing AI code: two problems, you write the tests that expose them |

## How it works

In exercises 01–06 the code is vulnerable. The functional tests are green and the attack tests are red. In
exercises 07 and 08 all tests are green, and the code still has a problem: you write the red test yourself.

1. Read the README of the exercise.
2. Run the tests **before** you change anything, so the harness sees the red tests (in Claude Code, a line that
   starts with `!` runs as a command):

   ```
   ! node .claude/hooks/check.mjs oefeningen/01-sql-search
   ```

3. Fix the code. Ask Claude for help when you are stuck: Claude gives hints, not the code.
4. Run the same command again. A test that goes from red to green counts as a task, but only after you explain
   it in your own words.

Do not change the tests that come with the exercise (except `ReviewTests.cs` in 07 and 08, which is yours).

## Your explanation after a green test

The harness asks four things:

1. **What does the attacker control?** Which input, and where does it come from?
2. **Which measure stops it?** And why does it work: what does it change about how the input is treated?
3. **How do you check that?** Which test with which attack string, or which analyser rule.
4. **How sure are you that this is secure, from 1 to 5?** And what does your check not see?

A green test shows that the attacks in the test are stopped, not that the code is secure. A clean run of the
analyser (`securityAnalyzer`) is no proof either: it does not see every flaw, and it never sees access control
or logic. Name what is still open.
