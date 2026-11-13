# 07 · Reviewing AI code: blog comments

**Skill:** `security.ai-review`

## The story

Your team's blog gets a comment section. A colleague asked an AI assistant for the renderer, with the
instruction "It must be safe against XSS." The assistant delivered `CommentRenderer.cs` and a set of tests,
all green, and the pull request is assigned to you for review. Your colleague says: "It encodes, the tests pass,
just approve it."

## The task

**There is one security problem in this code.** Find it yourself; the README does not say where.

1. Read `CommentRenderer.cs`. For every piece of data that ends up in the HTML, ask: what does an attacker
   control here?
2. Write a test in `ReviewTests.cs` that shows the problem. It must be **red** on the current code. Run:

   ```
   ! node .claude/hooks/check.mjs oefeningen/07-ai-review-comments
   ```

3. Fix `CommentRenderer.cs` until all tests are green, and run the same command again.

Your test going from red to green is the task. Do not change `CommentRendererTests.cs`: those tests are green
now, and they must stay green.

**Think about it for your explanation:** why were the assistant's tests green?

Claude gives you hints, not the code, and will not point out the problem for you.
