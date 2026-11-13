---
title: "Naslag: hooks, commando's en bestanden"
description: "De vier Claude Code-hooks van de leerharnas, elk commando van skill.mjs, de testrunner, markers, events en bestanden: wat ze doen en wanneer ze draaien."
---
# Naslag: hooks en commando's

## Hooks

| Event | Script | Wat het doet |
|---|---|---|
| `SessionStart` | `session-start.mjs` | Zet het register, open uitleg en doorstroomvoorstellen in de context, en vraagt naar je doel. Een open voorstel zie je ook zelf, in de melding bij de start. Open uitleg van eerdere sessies vervalt hier. Herhalingen noemt hij niet. Na een eerste export naar het dashboard meldt hij ook wat er sindsdien nieuw is (zie `since-export`), behalve als `dashboardRepo` op `off` staat. Voor een eerdere sessie met werk die zonder dagboek sloot, biedt hij één keer een inhaaldagboek aan. In het beoordeelde project noemt hij de bestanden die sinds de vorige sessie zijn gewijzigd, met hun vaardigheid (via `paths` of via de inhoud). |
| `UserPromptSubmit` | `prompt-gate.mjs` | Herkent de vaardigheid, bepaalt of er een nieuwe trede bij mag, logt opgeloste taken en vraagt om uitleg. Zet het niveau als jij een voorstel bevestigt met "ja, doorzetten", en voegt een microvaardigheid toe als jij een voorstel bevestigt met "ja, toevoegen". Tijdens een transfertaak ontgrendelt geen trede. Berichten van agents, notificaties en systeemherinneringen tellen niet als jouw woorden. Logt je eerste bericht als het plan (`plan`) en een getal na Claude's "(1–5)" als je zelfvertrouwen (`confidence`). Een bericht dat begint met `af: <onderdeel>` (of `done: <part>`) logt een taak, net als `done`. Een stopverzoek herkent hij aan het begin van een bericht ("klaar", "stoppen") en, in een kort bericht, aan het eind ("ik wil stoppen", "laten we afronden"). |
| `PreToolUse` | `guard.mjs` | Blokkeert schrijven, bouwen en testen van code op L1–L3, en elke wijziging aan het register, de state en de harnas zelf. Een shell-commando beoordeelt hij per los commando, op het programma dat draait. `eval`, `iex` en `Invoke-Expression` weigert hij altijd. Eén programma laat hij bewust toe: de dashboardexport `node <repo>/harness/export.mjs <oefenmap>`, die in de oefenmap alleen `last-export.json` schrijft (niet met `--out` in de oefenmap). In beoordeeld werk laat hij alleen vaste tooling toe (`dotnet new` met sln/console/classlib/nunit/xunit/gitignore, `dotnet sln add`, `dotnet add reference\|package`, `git init`, `git remote add`, `git branch -m`, `mkdir`, `scaffold.mjs arc42`), en die logt hij; git-commando's die alleen lezen (`status`, `log`, `remote -v`, `branch --show-current` …) mogen altijd. |
| `Stop` | `reflect-gate.mjs` | Verwerkt de markers in Claude's antwoord, controleert je uitleg, de transfertaak en het oordeel van de demotie-analist, en vraagt om het dagboek als je wilt stoppen. Haalt een uitleg een doorstroomcriterium, dan laat hij je meteen het voorstel zien. Hij toont ook een voorstel voor een microvaardigheid, als Claude erom vraagt en deze sessie het bewijs heeft. Na het dagboek vervalt wat nog open staat. Bij beoordeeld werk schrijft hij het AI-logboek, met een regel per toegestaan tooling-commando, en zet hij jouw eigen woorden in de laatste kolom (`[logboek "…"]`). |
| `SessionEnd` | `session-end.mjs` | Noteert wanneer de sessie eindigde en of er werk was zonder dagboek, voor het inhaaldagboek bij de volgende start. Vraagt en blokkeert niets. |

## `skill.mjs` (je draait het zelf, met `!`)

| Commando | Wat |
|---|---|
| `list` / `status` | Overzicht; herhalingen (L4) die klaarstaan, open en overgeslagen uitleg, en signalen. `status` toont ook hulp over een vaardigheid tijdens taken van een andere vaardigheid (`concept-help`), alleen ter info. Deze twee mag Claude ook draaien. |
| `since-export` | Wat er nieuw is sinds de laatste export naar het dashboard, in één regel: taken, dagboeksessies en niveauwijzigingen. Zonder export: dat er nog geen export bekend is. Daarna, als er iets nieuw is of niets bekend, de vraag "Dashboard nu bijwerken? (ja / later)" die `/diary` stelt. Niets als `dashboardRepo` op `off` staat. Het leest alleen, dus Claude mag het ook draaien: `/diary` sluit ermee af. Zie [Sinds de laatste export](progress-dashboard.md#sinds-de-laatste-export). |
| `set <id> <L0..L4> "notitie"` | Niveau zetten. Omhoog kan pas als er geen taken meer op uitleg wachten. Een voorstel van de harnas bevestig je makkelijker in de chat: typ "ja, doorzetten" (eventueel met de id). |
| `review <id> pass\|shaky\|fail` | De uitkomst van een herhaling zelf opgeven. Meestal niet nodig: de eerstvolgende taak van een L4-vaardigheid bepaalt hem. |
| `add <id> "titel" ["trefwoorden"]` | Een nieuwe hoofdvaardigheid toevoegen, bijvoorbeeld voor een onderdeel van de toets dat niet in de kaart staat. Hij begint met een open plaatsing: je eerste taak bepaalt het niveau. Mappen koppel je met `paths`. Gelogd als event `skill-add`. |
| `add-micro <parent> <id> <niveau> "titel" "trefwoorden"` | Een microvaardigheid toevoegen. Met `autoDemote` maakt de demotie-analist er ook zelf een aan, op het niveau van de ouder min 1. Na echte hulp in een sessie kan de harnas er ook een voorstellen; die voeg je toe met "ja, toevoegen" in de chat. |
| `done <id> "wat"` | Een taak zonder test afmelden (ontwerp, UML). Zonder commando: een bericht dat begint met `af: <onderdeel>`. |
| `untask <id>` | De laatst gelogde taak van een vaardigheid schrappen. |
| `correct <taak-id> trede <1-5> "reden"` | Meer hulp dan gelogd: de trede alleen **omhoog** zetten. |
| `correct <taak-id> schrap "reden"` | Eén taak schrappen. |
| `override <id\|*> <minuten> "reden"` | Tijdelijk toestaan dat Claude code schrijft (hooguit 240 minuten, gelogd). |
| `setting <sleutel> <waarde>` | `examDate`, `stuckTimerMinutes`, `idleMinutes`, `defaultLevel`, `course`, `language`, `autoDemote`, `securityAnalyzer`, `dashboardRepo` (het absolute pad van je clone van de repo met het dashboard, of `off`), en `codeExtensions` en `codeFiles` als lijst met komma's. Zie [Configuratie](configuration.md). |
| `setting graded add\|remove "<pad>"` | Beoordeeld werk: de paden (absoluut, of relatief aan het project) waar Claude niets schrijft en de hintladder tot trede 4 gaat. Ook `setting graded maxRung 0..4`, `aiLevel 0\|1`, `logDir "<pad>"` en `off`. Zie [Beoordeeld werk](how-it-works.md#beoordeeld-werk). Gelogd als het event `setting`. |
| `paths <id> add|remove "<glob>"` | Welke opdrachtmappen bij een vaardigheid horen, bijvoorbeeld `paths ood.associaties add "ood-opdrachten-01/09-*/**"`. De map bepaalt de vaardigheid van een taak en het niveau dat de guard gebruikt. Niet voor een microvaardigheid: die gebruikt het niveau van de hoofdvaardigheid. Heeft een andere vaardigheid hetzelfde pad, dan waarschuwt hij. Gelogd als event `paths`. |
| `replay <transcript.jsonl> [--dry-run]` | Herstelt uitleggen die in de chat zijn goedgekeurd maar niet gelogd. Hij zoekt de markers `[uitleg-ok <tid>]` en controleert jouw bericht met dezelfde check als de Stop-hook. Alleen wat beide sleutels haalt, telt, met bron `replay`. |

In het Engels kan ook `correct <taak-id> rung …` en `correct <taak-id> void …`.

## `check.mjs` (testrunner)

```text
! node .claude/hooks/check.mjs ood-opdrachten-01/05-de-auto
```

Draait `dotnet test` met een trx-logger en toont een korte samenvatting. Een test die van rood naar groen gaat, wordt een taak met de trede van dat moment. De eerste run per map is een basislijn. Herstel na een regressie telt niet als taak.

- **Code geschreven vóór de eerste run.** Is de eerste run in een map helemaal groen, en is er in deze sessie code in die map gewijzigd, dan telt dat groen ook als taak (`test-green` met `firstRun: true`). Code van een eerdere sessie blijft een basislijn. Draai `check.mjs` dus eerst, vóór je code schrijft.
- **Een andere map begint een nieuwe taak.** Een run in een andere map dan die van de vorige taak is een signaal van nieuw werk: de ladder begint opnieuw (`task-start`), en hulp sinds de vorige taak telt niet voor de nieuwe (`help-dropped`).
- **Een compileerfout is een startpunt.** Bouwt de map niet (`error CSxxxx`), dan onthoudt `check.mjs` dat. Een test die bij de eerste build die wel lukt groen is, telt dan als nieuw groen. Een fout van de tooling (`NETSDK`, `MSB`) telt niet.
- **De map bepaalt de vaardigheid.** Na een run in een map kiest een trefwoord in je prompt alleen nog een microvaardigheid binnen die familie. Naar een andere familie wissel je met `#id` of de naam van de opdracht.
- **`global.json`:** vraagt die een oudere SDK dan het project gebruikt, zonder `rollForward` naar een nieuwere hoofdversie, dan waarschuwt `check.mjs`.
- **Security-analyser.** Met `securityAnalyzer` bouwt `check.mjs` de map eerst opnieuw (`dotnet build --no-incremental`) met de securityregels van de .NET SDK (`AnalysisModeSecurity=All`, nooit als fout), en draait daarna de tests met dezelfde instellingen. Het toont elke waarschuwing met regel, bestand en regelnummer, en vraagt jou die uit te leggen. Opnieuw bouwen is nodig, omdat de analyzers alleen melden als de compiler echt draait.
- Een map relatief aan het project werkt ook als je shell in een andere map staat.

## Markers in Claude's antwoord

| Marker | Betekenis |
|---|---|
| `[trede N]` / `[rung N]` | Er is inhoudelijke hulp gegeven op trede N. |
| `[trede N #id]` / `[rung N #id]` | Hetzelfde, en de hulp ging over het concept `id` uit `skills.json`. De taak houdt de trede. Een concept van een andere familie krijgt daarnaast een event `concept-help`; een concept van dezelfde familie, of een id dat niet bestaat, maakt er een gewone `[trede N]` van. |
| `[micro-voorstel <id> "titel" "trefwoorden"]` / `[micro-proposal …]` | Claude vraagt de harnas een microvaardigheid voor te stellen. De harnas toont dat alleen met een geldig id onder een hoofdvaardigheid, 1–6 trefwoorden, en bewijs uit deze sessie: hulp op trede 2 of hoger in een review of over een ander concept, of een taak van die familie op trede 2 of hoger. Anders zegt de Stop-hook waarom hij het weigert. |
| `[review-trede N #id]` / `[review-rung N #id]` | Hulp op trede N in een review na een taak, over het concept `id` uit `skills.json`. Die verhoogt de trede van de volgende taak niet, behalve als die taak over hetzelfde concept gaat (dezelfde familie). Zonder geldig id, zonder gelogde taak ervoor, of na een signaal van nieuw werk telt hij als een gewone `[trede N]`. |
| `[uitleg-ok <tid>]` / `[explain-ok <tid>]` | De uitleg klopt; de Stop-hook controleert hem nog. |
| `[uitleg-nee <tid>]` / `[explain-no <tid>]` | De uitleg is onvolledig; de taak blijft open. |
| `[demotie {...}]` / `[demotion {...}]` | Alleen een terugval: de Stop-hook leest het oordeel van de analist uit het rapport van de agent zelf, dus Claude zet de JSON niet in de chat. De marker wordt alleen uitgevoerd als de agent in die beurt echt gedraaid heeft. |
| `[transfer-start <id>]` | Begin van de transfertaak (`/mastery-check`), alleen op L2 of L3. Vanaf dan telt elke `[trede N]` tegen de transfertaak. |
| `[transfer-ok <id>]` / `[transfer-nee <id>]` (`[transfer-no <id>]`) | De transfertaak is gehaald of niet. `ok` telt alleen zonder hulp sinds de start, en als jouw laatste bericht dezelfde check haalt als een uitleg. |
| `[controlevraag <id> goed\|half\|open]` / `[check-question <id> right\|half\|open]` | De uitkomst van een controlevraag aan het eind van de sessie, over de vaardigheid `id`. Gelogd als `check-question`: bewijs voor een voorstel voor een microvaardigheid, nooit voor een niveau. |
| `[logboek "<tekst>"]` / `[log "<text>"]` | Beoordeeld werk: jouw eigen woorden voor de laatste kolom van het AI-logboek. De Stop-hook schrijft ze alleen als ze letterlijk deel zijn van jouw bericht, en alleen in de lege regels van deze sessie (`[logboek <8 tekens van een sessie-id> "<tekst>"]` bij een inhaaldagboek). |
| `<!-- sessie: <id> -->` / `<!-- session: <id> -->` | In het dagboek: de entry van deze sessie. |

## Skills

| Skill | Wat |
|---|---|
| `/diary` | Sluit de sessie af: de feiten van Claude, de reflectie van jou. |
| `/mastery-check <id>` | De transfertaak voor de stap naar L4: een nieuwe opdracht in een ander domein, zonder hulp, en daarna drie waarom-vragen. |
| `/update-dashboard` | Werkt het dashboard bij, tot en met een pull request: in een eigen worktree van de repo, met de export, de vertalingen en de securitycheck. `/diary` vraagt erom; je kunt hem ook zelf starten. Mergen doe je zelf. Zie [Dashboard bijwerken](progress-dashboard.md). |

## Events

Alles wat de harnas doet, staat in `.learning/state/events.jsonl`. De events van de review van 10 november 2026:

| Event | Betekenis |
|---|---|
| `task-lapsed` | De uitleg kwam niet direct: de taak vervalt (`other-exercise` of `session-end`). Telt niet; op het dashboard *overgeslagen*. |
| `task-explained` met `source: replay` | Een uitleg die achteraf met `replay` is hersteld. |
| `placement` | Het niveau van een nieuwe vaardigheid, gezet bij de goedgekeurde uitleg van de eerste taak (`tid`). |
| `review` met `auto: true` | De uitkomst van een L4-herhaling, uit de eerstvolgende taak. `review-due`: de herhaling kwam langs. |
| `level` met `auto: true` | Automatisch omlaag; `by` zegt door wie: `harnas`, `demotie-analist` of `achtervang`. |
| `demotion-pending`, `demotion-verdict`, `demotion-rejected` | De analist is nodig, zijn oordeel, of een oordeel dat de Stop-hook weigerde. |
| `micro-add` met `auto: true`, `task-retag` | De analist maakte een microvaardigheid en koppelde taken eraan. |
| `build-failed` | Een compileerfout, onthouden als startpunt van de map. |

En van de aanvulling van 11 november 2026 (doorstromen):

| Event | Betekenis |
|---|---|
| `task` met `level` | Het niveau van de vaardigheid toen de taak gelogd werd. Een taak op L0 of L1 draagt geen sprong. |
| `promotion-offered` | De harnas toonde een voorstel om door te zetten (`from`, `to`), of de hint dat alleen de transfertaak nog ontbreekt (`to: transfer`). |
| `promotion-confirmed`, `promotion-refused` | Je typte "ja, doorzetten"; doorgezet, of geweigerd omdat er nog een taak op uitleg wacht. |
| `level` met `by: learner`, `via: voorstel` | Het niveau, gezet na jouw bevestiging. |
| `promotion-declined` | Je zei "nee" of "later" op een voorstel. Het komt terug na een nieuwe taak die het criterium haalt. |
| `transfer-start`, `transfer-passed`, `transfer-failed`, `transfer-rejected` | De transfertaak: begonnen, gehaald, niet gehaald (`why: help` of `claude`), of een marker die de Stop-hook weigerde. |

En van de setup review van 11 november 2026 (het begin van een taak, reviews en paden):

| Event | Betekenis |
|---|---|
| `task-start` | Er begon nieuw werk, met de reden: `code-elsewhere`, `check-elsewhere`, `prompt-exercise` of `prompt-id`. `after`: de taak ervoor. |
| `help-dropped` | Gewone hulp van vóór dat begin (`rung`). Die telt niet voor de nieuwe taak. |
| `review-help` | Hulp in een review na een taak: `skill` is het concept, `reviewOf` de taak van de review. |
| `task` met `reviewRung` | De taak kreeg zijn trede uit de review van de vorige taak, over hetzelfde concept. |
| `rung-mark` met `review: true` | Een reviewmarker die als gewone trede telde. |
| `test-green` met `firstRun: true` | De eerste run in een map was helemaal groen, met code die in deze sessie is geschreven. |
| `paths` | Je koppelde een opdrachtmap aan een vaardigheid, of haalde hem weg (`action`, `glob`). |

En van de setupreview van 11 november 2026, middag (hulp per concept, voorstellen voor microvaardigheden):

| Event | Betekenis |
|---|---|
| `concept-help` | Hulp over een concept van een andere familie tijdens een taak (`skill`, `rung`, `taskSkill`). `taskTid` is het id dat de taak krijgt als hij gelogd wordt. Geen taak van dat concept. |
| `help-dropped` met `taskTid` | Na concepthulp begon nieuw werk: dat taak-id wordt nooit gelogd. |
| `micro-offered` | De harnas toonde een voorstel voor een microvaardigheid (`skill`, `parent`, `level`, `evidence`: `review`, `concept` of `task`). |
| `micro-rejected` | Een voorstel dat de Stop-hook weigerde (`why`). |
| `micro-declined` | Je zei "nee" tegen het voorstel. Het komt in die sessie niet terug. |
| `micro-add` met `by: learner`, `via: voorstel` | De microvaardigheid, toegevoegd na jouw "ja, toevoegen". |

En van de setupreview van 12 november 2026 (positieve feedback, demoties en de fasegeschiedenis):

| Event | Betekenis |
|---|---|
| `task` met `familyRung` | De trede zonder hulp over een concept van een andere familie, als die lager is dan `maxRung`. Automatisch omlaag en de plaatsing gebruiken hem; de taak houdt zijn `maxRung`. |
| `rung-mark` met `concept` | Een trede over een concept van een andere familie: die verhoogde de trede van de taak, niet de familietrede. |
| `demotion-cancelled` | Een verlaging die openstond, maar waarvan het criterium op het bewijs van nu niet meer klopte (`why: criterion`). Er ging niets omlaag. |
| `demotion-rejected` met `source: agent-report` | Een oordeel in het rapport van de analist dat de harnas weigerde. De verlaging blijft openstaan. |
| `effort-intro` | De eenmalige melding bij de sessiestart dat moeite het doel is, geen falen. |

En van de setup van 13 november 2026 (beoordeeld werk):

| Event | Betekenis |
|---|---|
| `graded-session` | Deze sessie gaat over beoordeeld werk, met `why`: `project`, `cwd`, `prompt` of `tool`. Vanaf dan komt elk antwoord in het AI-logboek. |
| `deny` met `graded: true` | De guard blokkeerde schrijven, bouwen of een commit in beoordeeld werk. |
| `hint-hold` met `graded: true` | Geen nieuwe trede: het plafond van beoordeeld werk, of AI-niveau 0. |
| `graded-solution-refused` | De student vroeg om een uitwerking bij beoordeeld werk; Claude kreeg de opdracht te weigeren. |
| `graded-over-max` | Een antwoord had een trede boven het plafond. Het logboek noemt het, en de student kreeg een melding. |
| `graded-log-error` | De hook kon het AI-logboek niet schrijven (met de fout). |
| `security-warnings` | `check.mjs` met `securityAnalyzer`: het aantal waarschuwingen en de regels (zoals `CA2100`), zonder bestandsnamen. |

En van de review van 13 november 2026, 's avonds (de eerste sessies aan de eindopdracht):

| Event | Betekenis |
|---|---|
| `graded-tooling` | De guard liet een vast tooling-commando toe in beoordeeld werk (`cmd`, met `~` voor de thuismap). Het krijgt een regel in het AI-logboek. |
| `plan`, `confidence` | Je eerste bericht van de sessie (hooguit 300 tekens), en het getal 1–5 dat je gaf na Claude's "(1–5)". Gaat niet naar het dashboard. |
| `session-end` | De sessie sloot, met `reason`, `diary` en `work`. |
| `catchup-offered` | De start bood een inhaaldagboek aan voor de sessie `of`. |
| `task` met `source: af` | Een taak die je afmeldde met `af: <onderdeel>` of `done: <part>`. Het dashboard toont hem als `done`. |
| `af-refused` | `af:` in beoordeeld werk zonder gewijzigd bestand sinds de vorige taak van die vaardigheid. |
| `check-question` | De uitkomst van een controlevraag: `right`, `half` of `open`. |
| `log-filled`, `log-fill-refused` | Je eigen woorden kwamen in de laatste kolom van het AI-logboek (`rows`), of de tekst was niet letterlijk van jou. |

## Bestanden

```text
.learning/
  skills.json        register en instellingen
  keywords.json      trefwoorden per vaardigheid
  private.json       termen die nooit in een export mogen (zelf aanmaken)
  diary/JJJJ-MM-DD.md
  state/             events.jsonl, tests.json, session-*.json, overrides.json,
                     last-export.json (moment en totalen van de laatste dashboardexport)
```

Met `--map security-dotnet` (één keer neergezet door de installer, daarna van jou):

```text
oefeningen/
  README.md          het overzicht: oefeningen, vaardigheden, hoe je ze draait, de uitleg
  01-sql-search/ … 08-ai-review-orders/   elk een xUnit-project, met README.md
```

In de repo van beoordeeld werk (alleen de hooks schrijven hier):

```text
ai-verantwoording/
  README.md          AI-niveau, de ladder, APA-verwijzing, hoe de export tot stand komt (één keer geschreven)
  logboek.md         een regel per antwoord; de laatste kolom vul je zelf in
  sessies/<datum>-<sessie>.md   je prompts en de tekst van Claude, zonder tooluitvoer
.claude/leerharnas.local.json   het register van een andere map (install.mjs --learning-dir); niet in git
```

Met de poort op gebruikersniveau (`install.mjs <map> --user-guard`):

```text
~/.claude/leerharnas/graded-gate.mjs   de poort, in elk project
~/.claude/leerharnas/graded.json       de beoordeelde paden, de namen die tegengehouden worden, de meldingen
~/.claude/settings.json                twee hooks erbij (UserPromptSubmit, PreToolUse); de rest blijft
~/.claude/CLAUDE.md                    een blok tussen <!-- leerharnas:graded:start/end -->
```

## Scripts in deze repository

| Script | Wat |
|---|---|
| `harness/install.mjs` | Installeren en bijwerken. Met `--user-guard` ook de poort op gebruikersniveau voor beoordeeld werk. Zie [Installeren](install.md). |
| `harness/hooks/scaffold.mjs` | `arc42 <map> --from <zip> [--lang nl\|en] [--with-help]`: het officiële arc42-sjabloon (release 2026.10.19, GitHub Markdown, één bestand per hoofdstuk), uit een zip die eerst gedownload is (zonder `--from` toont hij de link en het `curl`-commando), gecontroleerd met een vaste sha256 en ongewijzigd uitgepakt in een nieuwe of lege map. Hij heeft geen netwerkcode. Geïnstalleerd als `.claude/hooks/scaffold.mjs`; in beoordeeld werk laat de guard alleen die kopie toe. |
| `harness/user/graded-gate.mjs` | De poort op gebruikersniveau (#61), geïnstalleerd door `install.mjs --user-guard`. |
| `harness/export.mjs` | Voortgang exporteren voor het dashboard, met privacyfilters. Schrijft ook `.learning/state/last-export.json` in de oefenmap. Vanuit een oefensessie laat de guard hem bewust toe. Zie [Configuratie en privacy](configuration.md). |
| `harness/security-check.mjs` | De controle vóór alles wat online gaat. |
| `harness/demo.mjs` | De demo-data voor het dashboard opnieuw maken. |
| `node --test "test/*.test.mjs"` (in `harness/`) | De tests. |
