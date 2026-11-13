# 08 · Reviewing AI code: the order repository

**Skill:** `security.ai-review` (harder)

## The story

The web shop moves its orders to a new data layer. An AI assistant wrote `OrderRepository` from the prompt
"Use parameterized queries everywhere", with tests that are all green. You see `$id` and `$email` parameters
in the first methods, and you are tempted to skim the rest. The order number goes into the confirmation e-mail
and into a tracking link that works without logging in.

## The task

**There are two security problems in this code.** Find them yourself; the README does not say where.

1. Read `OrderRepository.cs`, method by method. For each one, ask: what does an attacker control here, and what
   would they gain?
2. For each problem, write a test in `ReviewTests.cs` that shows it. Each test must be **red** on the current
   code. You need a database: `OrderRepositoryTests` shows how to make one in memory. Run:

   ```
   ! node .claude/hooks/check.mjs oefeningen/08-ai-review-orders
   ```

3. Fix `OrderRepository.cs` until all tests are green, and run the same command again.

Your tests going from red to green are the task. Do not change `OrderRepositoryTests.cs`: those tests are green
now, and they must stay green.

**Think about it for your explanation:** one of the two problems is hard to prove with a test. What did your
test show, and what can it not show?

Claude gives you hints, not the code, and will not point out the problems for you.
