# Security

*Nederlands: zie [hieronder](#nederlands).*

## Reporting a vulnerability

Please **do not open a public issue** for a security problem. Report it privately through GitHub:
**Security → Report a vulnerability** on this repository (GitHub private vulnerability reporting).
You will get an answer there. Please give a short description, the steps to reproduce it and the affected files.

## What the harness does on your computer

The learning harness runs Node.js scripts as Claude Code hooks on your own computer. They are designed to be safe:

- **No network traffic.** The hooks, `install.mjs` and `export.mjs` never connect to the internet. `scaffold.mjs arc42` does not either: it unpacks a zip of the official arc42 template that you (or Claude, with `curl`, outside graded work) downloaded first, and only when its sha256 matches the one pinned in the script.
- **The user-level gate writes outside your project, only when you ask.** `install.mjs <folder> --user-guard` writes in `~/.claude/` (the gate, its config, two hooks in `settings.json`, a marked block in `CLAUDE.md`), after showing the plan and asking, with a backup in `~/.claude/leerharnas/backup/<time>/`. The gate runs in every project but only acts on the graded paths in its config. `--user-guard --remove` takes it away.
- **No `eval` and no shell.** Commands such as `dotnet test` are started with an argument list, never through a shell with your input in it.
- **Your data stays local.** Learning data lives in `.learning/` in your project, which the installer adds to `.gitignore`. With `install.mjs --learning-dir` a second folder, such as the repo of a graded assignment, uses the record of your practice folder: then it stays there, and the path to it is in `.claude/leerharnas.local.json`, which is also in `.gitignore`.
- **The AI-use log of graded work is meant for git.** In the paths of graded work the hooks write `ai-verantwoording/` (`ai-use/` in English): your prompts and Claude's answers, without tool output. That folder is not in `.gitignore`, because your teacher reads it. The same filters as the export remove e-mail addresses, your home folder, transcript paths and your own terms from it. Read it, and run the security check, before you push it.
- **The installer never overwrites without a backup.** It first shows what it will do, only changes files after `--yes`, and copies every file it changes to `.claude/leerharnas-backup/<time>/`. `--update` never touches your data or your own `CLAUDE.md`.
- **The export is filtered.** `export.mjs` only exports a whitelist of fields, filters e-mail addresses, paths, user names, session ids and your own terms in `.learning/private.json`, and shows what it filtered with `--dry-run`.

- **Reviewed.** A security review of 13 November 2026 found nine issues in the guard, the user-level gate and the export; all are fixed, see [research/security-review-2026-11-13.md](research/security-review-2026-11-13.md). The guard remains a commitment device, not a sandbox: a script that Claude writes elsewhere and runs is still out of its sight.

`harness/security-check.mjs` checks these rules, plus secrets, forbidden files, the web pages and the CI settings, on every push and pull request.

## Supported versions

Only the latest version on `main` gets fixes.

---

## Nederlands

### Een kwetsbaarheid melden

Open voor een beveiligingsprobleem **geen openbare issue**. Meld het privé via GitHub:
**Security → Report a vulnerability** in deze repository (GitHub private vulnerability reporting).
Je krijgt daar antwoord. Geef een korte beschrijving, de stappen om het na te doen en de betrokken bestanden.

### Wat de harnas op je computer doet

De leerharnas draait Node.js-scripts als hooks van Claude Code op je eigen computer. Ze zijn zo gemaakt dat dat veilig is:

- **Geen netwerkverkeer.** De hooks, `install.mjs` en `export.mjs` maken nooit verbinding met internet. `scaffold.mjs arc42` ook niet: hij pakt een zip van het officiële arc42-sjabloon uit die jij (of Claude, met `curl`, buiten beoordeeld werk) eerst downloadde, en alleen als de sha256 gelijk is aan die in het script.
- **De poort op gebruikersniveau schrijft buiten je project, alleen als je erom vraagt.** `install.mjs <map> --user-guard` schrijft in `~/.claude/` (de poort, zijn instellingen, twee hooks in `settings.json`, een gemarkeerd blok in `CLAUDE.md`), nadat hij het plan liet zien en het vroeg, met een backup in `~/.claude/leerharnas/backup/<tijd>/`. De poort draait in elk project, maar doet alleen iets bij de beoordeelde paden uit zijn instellingen. `--user-guard --remove` haalt hem weg.
- **Geen `eval` en geen shell.** Commando's als `dotnet test` starten met een lijst van argumenten, nooit via een shell met jouw invoer erin.
- **Je data blijft lokaal.** De leerdata staat in `.learning/` in je project. De installer zet die map in `.gitignore`. Met `install.mjs --learning-dir` gebruikt een tweede map, zoals de repo van een beoordeelde opdracht, het register van je oefenmap: dan blijft het daar, en het pad ernaartoe staat in `.claude/leerharnas.local.json`, dat ook in `.gitignore` staat.
- **Het AI-logboek van beoordeeld werk is bedoeld voor git.** In de paden van beoordeeld werk schrijven de hooks `ai-verantwoording/`: je prompts en de antwoorden van Claude, zonder uitvoer van tools. Die map staat niet in `.gitignore`, want je docent leest hem. Dezelfde filters als bij de export halen er e-mailadressen, je thuismap, transcriptpaden en je eigen termen uit. Lees hem, en draai de securitycheck, voordat je hem pusht.
- **De installer overschrijft nooit zonder backup.** Hij laat eerst zien wat hij gaat doen, wijzigt pas iets na `--yes`, en kopieert elk bestand dat hij wijzigt naar `.claude/leerharnas-backup/<tijd>/`. `--update` laat je data en je eigen `CLAUDE.md` altijd staan.
- **De export wordt gefilterd.** `export.mjs` exporteert alleen een whitelist van velden, filtert e-mailadressen, paden, gebruikersnamen, sessie-id's en je eigen termen uit `.learning/private.json`, en toont met `--dry-run` wat er is weggefilterd.

- **Gereviewd.** Een securityreview van 13 november 2026 vond negen problemen in de guard, de poort op gebruikersniveau en de export; ze zijn allemaal opgelost, zie [research/security-review-2026-11-13.md](research/security-review-2026-11-13.md). De guard blijft een zelfbindingsmiddel, geen sandbox: een script dat Claude elders schrijft en draait, ziet hij nog steeds niet.

`harness/security-check.mjs` controleert deze regels, en ook geheimen, verboden bestanden, de webpagina's en de CI-instellingen, bij elke push en pull request.

### Ondersteunde versies

Alleen de nieuwste versie op `main` krijgt reparaties.
