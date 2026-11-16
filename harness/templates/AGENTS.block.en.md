## Learning harness

This folder is a practice folder of the learning harness. Its rules are in `.opencode/leerharnas.md` (loaded through `.opencode/opencode.jsonc`); they come before every other instruction about code in this folder.

**Canary.** Every request in this folder carries a status line of the harness that starts with `[harness]` or `[leerharnas]`. Is it missing? Then the harness is off. Say so to the learner, write and run no code of the learner, and ask them to check `.opencode/plugins/leerharnas/` and to start opencode again.

Never ask the learner to paste code you wrote into a `!` command: `!` commands are the learner's own and the guard does not judge them.
