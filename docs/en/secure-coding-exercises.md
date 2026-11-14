---
title: "Free secure coding exercises in C# and .NET (OWASP Top 10:2025)"
description: "Eight free secure coding exercises in C#/.NET for junior developers: SQL injection, XSS, log injection, secrets and tokens, and reviewing AI-generated code. Attack tests start red."
---
# Secure coding exercises in C# and .NET

**Short answer:** eight free exercises for junior developers who want to learn secure coding while an AI writes more and more of the code. Each one is a small xUnit project with a story from work. In six of them the code has a vulnerability and the attack tests start red. In the last two the code was written by an AI, every test is green, and you find the flaw yourself. With the learning harness, Claude Code gives hints but does not write the fix.

## The exercises

| Exercise | What you practise | OWASP Top 10:2025 |
|---|---|---|
| `01-sql-search` | A search query built from user input: parameters instead of string concatenation | A05 Injection (CWE-89) |
| `02-sql-filter-sort` | A value and a sort column: a parameter for the value, an allow-list for the column name (harder) | A05 Injection (CWE-89) |
| `03-greeting-html` | A name in HTML text and in an attribute: HTML encoding | A05 Injection (CWE-79, cross-site scripting) |
| `04-audit-log-validation` | Log injection with line breaks, and validating a username at the boundary (harder) | A09 Security Logging and Alerting Failures (CWE-117), A05 Injection (CWE-20) |
| `05-api-key-config` | A hard-coded API key: from configuration, no fallback, masked in output | A07 Authentication Failures (CWE-798) |
| `06-reset-token` | A password-reset token: a cryptographically secure random generator (harder) | A04 Cryptographic Failures (CWE-330, CWE-338) |
| `07-ai-review-comments` | Code written by an AI: you find one problem and write the test that exposes it | You find out which |
| `08-ai-review-orders` | Code written by an AI: two problems, two tests (harder) | You find out which |

The categories of 07 and 08 are left out on purpose: naming them would give away the exercise.

## How an exercise works

1. Read the `README.md` of the exercise: a short situation at work, and the task.
2. Run the tests **before** you change anything, so the harness sees the red attack tests:
   `! node .claude/hooks/check.mjs oefeningen/01-sql-search`
3. Fix the code. When you are stuck, Claude gives hints, not code. The first hint is always the same question: *what does an attacker control here?*
4. Run the tests again. A test that goes from red to green counts as a task, but only after you explain it.

In 07 and 08 all tests are green at the start. You write a test that fails first, and then you fix the code.

## Your explanation: four questions

1. **What does the attacker control?** Which input, and where does it come from?
2. **Which measure stops it?** And why does it work?
3. **How do you check that?** Which test, with which attack string, or which analyser rule.
4. **How sure are you that this is secure, from 1 to 5?** And what does your check not see?

There is no checklist on purpose. In a study with 150 reviewers, those who were told to focus on security had about eight times higher odds of finding the vulnerability. A checklist added nothing significant (Braz et al., 2022).

## The analyser

Before the tests, `check.mjs` rebuilds your code with the security rules of the .NET SDK, without network access and without changing your project files. You explain the warnings; Claude does not fix them for you. The analyser catches four of the eight vulnerabilities: the SQL built from strings and the use of `System.Random`. It does not see the others, and it never sees access control or logic. That is part of the lesson: a clean run is not proof.

## Why secure coding, now

- **AI code is often insecure when an agent builds a whole feature.** On real feature requests, the best agent setup was functionally correct on 57% of the tasks, but also secure on 11.8% (Zhao et al., 2026).
- **The weak spots are predictable.** In Veracode's measurement of October 2026, AI code handled cross-site scripting correctly in 18% of cases and log injection in 13%, against 84% for SQL injection. That is why exercises 03 and 04 exist.
- **The risk is confidence.** In a randomized study, people with an AI assistant wrote less secure code and more often believed it was secure (Perry et al., 2023).
- **Mistakes come from misunderstanding, not carelessness.** In a build-it, break-it, fix-it contest, 78% of the projects had flaws from misunderstood security concepts (Votipka et al., 2020). So the harness asks you to explain, not just to make a test green.

The studies, their evidence grades and their limits are in [§2.13 of the literature review](research/literature.md#213-secure-code-as-a-first-niche-for-juniors). Whether these exercises make juniors code more securely has not been tested.

## Install

You need Claude Code, Node.js 18 or later and the .NET 10 SDK. Install the harness with the practice map in a folder of its own:

```bash
git clone https://github.com/piethanegraaf/piethanegraaf.github.io.git
cd piethanegraaf.github.io
node harness/install.mjs ../security-practice --map security-dotnet --lang en --yes
```

The installer puts the eight exercises in `oefeningen/`. Start at `oefeningen/README.md`. See [Install](install.md) for the details, and [For junior developers](for-juniors.md#secure-code-next-to-an-ai-agent) for the four security skills in a team repository.

## Frequently asked questions

### Can I do the exercises without Claude Code?

Yes. Each exercise is a plain xUnit project, so `dotnet test` works. The harness adds the hints instead of code, the analyser step and the check of your explanation.

### Are the attack strings safe to use?

They are meant for these exercises only. They stay in the tests, and are not for testing other people's systems.

### Does Claude ever write the fix?

No. For these exercises Claude gives hints only, never a worked solution, not even in parts. At levels L1 to L3 a hook also stops it from editing the exercise files.

### Is it free?

Yes. The exercises and the harness are open source. The code is AGPL-3.0, and the texts are CC BY-NC 4.0.
