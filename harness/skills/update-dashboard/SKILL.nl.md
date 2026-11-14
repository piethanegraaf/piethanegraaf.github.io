---
name: update-dashboard
description: Werk het leerdashboard bij vanuit een oefenmap, tot en met een pull request - in een eigen git-worktree van de dashboardrepo, exporteren met de privacyfilters, elke nieuwe vrije tekst vertalen naar de andere taal van het dashboard, het resultaat en de security controleren, en na akkoord van de gebruiker committen, pushen en de pull request openen (of aanvullen). Gebruik dit na /diary als de student ja zegt op "Dashboard nu bijwerken?", of als de gebruiker vraagt de dashboarddata bij te werken, te exporteren of te publiceren, of translations.todo.json in te vullen.
---

# Het dashboard bijwerken

Antwoord in de taal van de gebruiker. Werk in een eigen git-worktree van de repo, nooit in de hoofdcheckout: daar kunnen andere sessies bezig zijn. Commit en push pas na akkoord van de gebruiker, en merge nooit: de gebruiker merget de pull request.

De shell kan bij elk commando in een andere map beginnen (in een oefensessie: de oefenmap). Geef elk commando dus zijn map mee: `git -C "<repo>" …` of `cd "<worktree>" && …`.

## Stappen

1. **De twee mappen.** Maak van allebei nu een absoluut pad: in de worktree wijst een relatief pad ergens anders heen.
   - **In een oefensessie** (dit project heeft `.learning/skills.json`, bijvoorbeeld na `/diary`): de oefenmap is dit project. De repo is `settings.dashboardRepo` in `.learning/skills.json`; lees die met Read.
     - `off`: deze map heeft geen dashboard. Zeg dat en stop.
     - Niet ingesteld: vraag de gebruiker één keer naar het pad van de clone van de repo (de map met `harness/export.mjs`), en controleer dat het bestand er staat. Stel daarna voor om het op te slaan, zodat de volgende keer geen vraag nodig is: `! node .claude/hooks/skill.mjs setting dashboardRepo "<pad>"`. Zelf kun je dat niet draaien: de guard blokkeert het.
   - **In de repo** (dit project heeft `harness/export.mjs`): de repo is deze checkout, en de oefenmap is het argument (bijvoorbeeld `../ood`). Niet gegeven? Vraag erom.
2. **Rondkijken**, zonder de hoofdcheckout van de repo te wijzigen:
   - `git -C "<repo>" fetch origin` en `git -C "<repo>" worktree list`.
   - **Waar de pull request heen gaat:** `git -C "<repo>" remote get-url origin` geeft `<eigenaar>/<naam>` (noem het `<origin-repo>`). Geef dat aan elk `gh`-commando mee met `--repo <origin-repo>`. In een fork kiest `gh` anders de oorspronkelijke repo, en dan gaat de pull request naar de repository van iemand anders. Staat `origin` niet op GitHub, of mag je er niet naar pushen? Zeg dat en stop.
   - Staat er nog een dashboard-pull-request open? `cd "<repo>" && gh pr list --repo <origin-repo> --state open --json number,url,headRefName,files` en zoek die waarvan de bestanden `site-src/dashboard/data/progress.json` bevatten.
     - **Eén, op een branch `dashboard-*`:** ga daarop verder (stap 3a). Twee dashboard-pull-requests zouden botsen op `progress.json`, en de vertalingen in de open pull request staan nog niet op `main`.
     - **Meer dan één, of één op een andere branch:** vraag de gebruiker welke je gebruikt, of dat je stopt.
     - **Geen:** een nieuwe branch (stap 3b).
3. **De worktree**, in je scratchpadmap (bijvoorbeeld `<scratchpad>/wt-dashboard`; kies een andere naam als die al bestaat):
   - **3a. Op de open pull request:** `git -C "<repo>" worktree add -B <branch> <pad> origin/<branch>`. Heeft een lokale branch met die naam commits die niet op `origin` staan (`git -C "<repo>" log origin/<branch>..<branch>`)? Vraag het dan eerst: `-B` zou hem terugzetten. Staat de branch al in een andere worktree (zie `git worktree list`)? Gebruik dan die worktree als `git status` daar schoon is, en vraag het anders.
   - **3b. Nieuw:** de branch heet `dashboard-JJJJ-MM-DD` (vandaag); is die naam bezet, lokaal of op `origin` (`git -C "<repo>" branch -a --list "*dashboard-JJJJ-MM-DD*"`), voeg dan `-2`, `-3` enzovoort toe. `git -C "<repo>" worktree add --no-track -b <branch> <pad> origin/main`.
   - Draai elk volgend commando in de worktree.
4. **Voorbeeld:** `node harness/export.mjs "<oefenmap>" --dry-run`. Laat de gebruiker zien wat er gefilterd wordt en hoeveel teksten nog geen vertaling hebben. Heeft de map geen `.learning/private.json`? Zeg dat, en vraag of je verder mag.
   - In een oefensessie laat de guard dit programma bewust toe: het is het enige dat daar `.learning/state/last-export.json` mag schrijven (een moment en drie totalen). Geef het nooit `--out` mee.
5. **Exporteren:** `node harness/export.mjs "<oefenmap>"`.
   - Exitcode 0: ga naar stap 7.
   - Exitcode 2: er ontbreken vertalingen. Ga naar stap 6.
   - Exitcode 1: een fout. Laat hem zien en stop.
6. **Vertalen:** open `site-src/dashboard/data/translations.todo.json` in de worktree en vul elk leeg taalveld in, volgens de regels hieronder en het veld `about` van het bestand. Draai daarna stap 5 opnieuw. Die neemt de vertalingen over en verwijdert het bestand.
7. **Controleren:**
   - `node harness/export.mjs --check site-src/dashboard/data/progress.json`.
   - `LEERHARNAS_PRIVATE=<oefenmap>/.learning/private.json node harness/security-check.mjs` (PowerShell: `$env:LEERHARNAS_PRIVATE = "<oefenmap>\.learning\private.json"; node harness/security-check.mjs`). De variabele is nodig: `.learning/private.json` staat in `.gitignore`, dus een nieuwe worktree heeft hem niet, en zonder het bestand zoekt de check niet naar de privétermen. Bij BLOKKEER of TWIJFEL: laat het zien en stop.
8. **Laten zien en vragen.** Vat de diff van `site-src/dashboard/data/progress.json` kort samen: nieuwe taken, dagboeksessies, niveauwijzigingen (doorstroom, plaatsingen, verlagingen), regressies en de nieuwe vertalingen. Noem elke vertaling waarover je twijfelde. Vraag dan akkoord met AskUserQuestion: committen en de pull request openen (of de commit aan de open pull request toevoegen), eerst een vertaling aanpassen, of stoppen.
   - Zeg erbij dat deze export de teller in `<oefenmap>/.learning/state/last-export.json` al op nul heeft gezet (de regel "sinds de laatste export" bij de sessiestart en in `/diary`): stoppen maakt dat niet ongedaan. Zo is het gekozen.
   - **Een vertaling aanpassen:** schrijf `site-src/dashboard/data/translations.todo.json` met `"source"` (de taal van het register) en één item per wijziging, `{ "text": "<origineel>", "<taal>": "<nieuwe vertaling>" }`. Een vertaling in het todo-bestand wint van de eerdere. Draai stap 5, daarna stap 7 en 8 opnieuw. Wijzig `progress.json` nooit met de hand.
   - **Stoppen:** commit niets. Laat de worktree staan en zeg waar hij staat.
9. **Pas na akkoord:**
   - `git add site-src/dashboard/data/progress.json` en verder niets. Controleer met `git status --short` dat er geen ander bestand klaarstaat.
   - Commit, bijvoorbeeld "Export the progress of the practice session of 11 November", met een korte body (nieuwe taken, niveauwijzigingen, dagboeksessies, aantal vertalingen) en de attributieregels die je sessie vraagt.
   - `LEERHARNAS_PRIVATE=<oefenmap>/.learning/private.json node harness/security-check.mjs --range origin/main..HEAD`. Bij BLOKKEER of TWIJFEL: stop en laat het zien; push niet.
   - `git push -u origin <branch>`. Weigert een hook de push? Laat het zien en stop; gebruik nooit `--no-verify`.
   - **Nieuwe branch:** `gh pr create --repo <origin-repo> --base main --head <branch>`, met een titel zoals de commit, en een body met wat er veranderde, de controles die je draaide en de vertalingen om naar te kijken. **Open pull request:** zeg dat hij een nieuwe commit kreeg, met de URL.
   - `git -C "<repo>" worktree remove <pad>`. Weigert git (er zijn nog wijzigingen)? Laat ze zien en vraag het; forceer niets. De branch blijft op GitHub staan.
   - Geef de gebruiker de URL van de pull request. Merge hem nooit.

## Vertalen

- **Getrouw:** dezelfde betekenis, toon en lengte. Niets verbeteren, aanvullen, samenvatten of toevoegen. Een korte, informele reflectie blijft kort en informeel. Vertaal wat bedoeld is: een tikfout hoef je niet over te nemen.
- **De eigen woorden van de student:** uitleg (`task.explanation`) en reflecties (`diary.reflection.*`) houden de stem van de student. Het dashboard markeert elke vertaling en toont het origineel ernaast.
- **Ongewijzigd:** code, identifiers en testnamen, vaardigheids-id's (zoals `cs.basis`), niveaus (L0-L4), compilercodes (zoals CS0161), getallen, datums, tijden en placeholders tussen vierkante haken (zoals `[privé]`).
- **De woorden van het dashboard:** trede = rung, vaardigheid = skill, microvaardigheid = microskill, uitleg = explanation, herhaling = review, doorstroom = promotion, terugval = relapse, opdracht = exercise, dagboek = diary, plaatsing = placement, zelfvertrouwen = confidence, kalibratie = calibration, (leer)harnas = (learning) harness, overgeslagen = skipped.
- **Consequent:** kijk hoe de eerdere vertalingen in `progress.json` dezelfde zin weergeven, en houd je daaraan.
- **Onduidelijke tekst:** vertaal zo letterlijk mogelijk, verzin nooit context, en noem hem in stap 8.
- Vul alleen het todo-bestand in. Wijzig `progress.json` nooit met de hand: de export schrijft hem, met de privacyfilters.
