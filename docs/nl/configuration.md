---
title: "Configuratie en privacy: instellingen, kaarten, data"
description: "Pas de instellingen van de harnas aan, maak een kaart met vaardigheden voor je eigen vak en zie welke leerdata lokaal blijft en wat de export publiceert."
---
# Configuratie en privacy

## Instellingen

De instellingen staan in `.learning/skills.json`, onder `settings`. Je wijzigt ze met `! node .claude/hooks/skill.mjs setting <sleutel> <waarde>`, of met de hand.

| Sleutel | Standaard | Betekenis |
|---|---|---|
| `course` | `""` | De naam van het vak, voor de sessiestart en het dashboard. |
| `language` | `nl` | `nl` of `en`: de taal van de meldingen. De herkenning werkt altijd in beide talen. |
| `examDate` | geen | De toetsdatum. Herhalingen (L4) vallen uiterlijk 3 dagen ervoor. |
| `defaultLevel` | `L2` | Het niveau van code die bij geen vaardigheid hoort. |
| `stuckTimerMinutes` | `12` | Na zoveel minuten **actieve tijd** vastzitten mag een nieuwe trede, ook zonder poging. |
| `idleMinutes` | `20` | Een pauze die langer duurt, telt niet als actieve tijd: niet voor de vasttimer, niet voor de minuten per taak en niet voor de melding na een uur. |
| `targetSuccess` | `0.85` | Het doel voor doorstromen van L2 naar L3. |
| `autoDemote` | `false` | Automatisch omlaag op bewijs, met de demotie-analist voor een hoofdvaardigheid. Zet het pas aan als het loggen een paar sessies betrouwbaar was: `setting autoDemote true`. |
| `securityAnalyzer` | `false` (`true` in `junior-dotnet` en `security-dotnet`) | `check.mjs` bouwt de map eerst opnieuw met de securityregels van de analyzers van de .NET SDK (zoals CA2100, CA3001 en CA5394), en toont de waarschuwingen. Offline, en zonder je projectbestanden te wijzigen. Zie [Voor junior developers](for-juniors.md#veilige-code-naast-een-ai-agent). |
| `dashboardRepo` | geen | Het absolute pad van je clone van de repo met het dashboard, zodat `/diary` het dashboard vanuit je oefenmap kan bijwerken. `off` als je geen dashboard gebruikt: dan vraagt `/diary` er niet naar. Zie [Na het dagboek](progress-dashboard.md#na-het-dagboek). |
| `graded` | geen | Beoordeeld werk: `{ paths, aiLevel, maxRung, logDir }`. Zet het met `setting graded add "<pad>"`; zie [Beoordeeld werk](how-it-works.md#beoordeeld-werk). `aiLevel` 1 (standaard) geeft de hintladder tot `maxRung` (standaard en hooguit 4); `aiLevel` 0 geeft geen hulp. `logDir` is standaard `ai-verantwoording/` in het eerste pad. |
| `codeExtensions` | `cs, csproj, sln, slnx` | Welke bestanden code van de student zijn. De OOD-kaart voegt `razor, cshtml, sql, yml, yaml` toe, voor een project met een UI, een database en een pipeline. |
| `codeFiles` | (leeg) | Bestanden zonder sprekende extensie die ook werk van de student zijn, op naam. `*` staat voor alles behalve `/`. De OOD-kaart zet `Dockerfile, appsettings*.json`. |
| `buildCommands` | `dotnet build/test/run …`, `msbuild` | Reguliere expressies voor commando's die bouwen of testen. `check.mjs` telt altijd mee. |
| `toolingTerms` | `rider, sdk, nuget …` | Woorden over tooling: "het werkt" daarover is geen opgeloste taak. |

Een ongeldige waarde valt terug op de standaard. De guard laat dan dus nooit alles door.

## Instellingen van Claude Code

De installer zet in `.claude/settings.json` ook `"promptSuggestionEnabled": false`. Claude Code stelt anders zelf een volgende prompt voor, en zo'n voorstel kan een hint verklappen. Zet je de waarde zelf op `true`, dan laat de installer je keuze staan.

## Een eigen vak

Een kaart staat in `harness/maps/<id>/`:

- `skills.json`: de vaardigheden met hun paden (globs), en de standaardinstellingen. Titels mogen tweetalig zijn: `{"nl": "…", "en": "…"}`.
- `keywords.json`: trefwoorden om een prompt aan een vaardigheid te koppelen.
- `notes.nl.md` en `notes.en.md`: vakspecifieke afspraken voor Claude.

Voor een andere taal dan C# zet je `codeExtensions` en `buildCommands`. `check.mjs` werkt voorlopig alleen met `dotnet test`.

Er zijn drie kaarten:

- **`ood`:** Object-Oriented Design in C#, met genummerde opdrachtmappen. Code die bij geen vaardigheid hoort, staat op L2.
- **`junior-dotnet`:** een voorbeeldkaart voor een junior developer op het werk, in C#/.NET. Dertien vaardigheden: debuggen, onbekende code lezen, unit tests, veilig refactoren, ASP.NET Core-API's, EF Core, async/await, vier securityvaardigheden (uitvoer coderen, geparametriseerde queries, geheimen en configuratie, AI-code reviewen op security), code van AI reviewen en een taak specificeren voor een agent. De securityvaardigheden zijn `sensitive`: de vrije teksten van hun taken gaan niet mee in de export voor het dashboard. Code die bij geen vaardigheid hoort, staat op **L4**: die mag de AI schrijven. Alleen wat je leert, is beschermd. Pas de paden aan naar de mappen van je eigen codebase (zie ook [In de repository van een team](install.md#in-de-repository-van-een-team)).
- **`security-dotnet`:** een oefenkaart voor veilig programmeren in C#/.NET, voor een eigen map. De vier securityvaardigheden, elk met paden naar zijn twee oefeningen in `oefeningen/` (die de installer meezet), code daarbuiten op **L2** zoals in `ood`, en de security-analyser aan. Zie [Voor junior developers](for-juniors.md#oefenen-in-een-eigen-map).

De guard beschermt alleen bestanden die onder de paden van een vaardigheid vallen. Een vaardigheid zonder paden, zoals debuggen, krijgt de hintladder, maar de guard houdt niets tegen.

## Privacy

Je leerdata blijft lokaal in `.learning/`. De installer zet die map in `.gitignore`.

Wil je je voortgang laten zien, zoals in het [dashboard](progress-dashboard.md), dan gebruik je de export:

```bash
node harness/export.mjs ../mijn-oefenmap --dry-run   # rapport, schrijft niets
node harness/export.mjs ../mijn-oefenmap             # schrijft site-src/dashboard/data/progress.json
```

Heeft een vrije tekst nog geen vertaling in de andere taal? Dan vraagt de export eerst om de vertalingen (zie [Vertalingen](progress-dashboard.md#vertalingen)).

Schrijft de export de data, dan schrijft hij ook `.learning/state/last-export.json` in je oefenmap: alleen het moment en drie totalen, geen teksten en geen paden. De harnas gebruikt dat om te melden wat er sindsdien nieuw is (zie [Sinds de laatste export](progress-dashboard.md#sinds-de-laatste-export)). Het bestand blijft lokaal.

- **Alleen een whitelist.** Niveaus, taken (trede, bron, uitleg, afwijzingen, correcties, overgeslagen), herhalingen, signalen, en uit het dagboek alleen het plan, wat goed ging, de reflectie en de kalibratie. Bij een taak gaat mee wat het was: de methodenamen van de tests die groen werden, zonder namespace of klasse, of de tekst die je bij `done` gaf; bij een gevoelige vaardigheid ook dat niet. Nooit ruwe events, sessie-id's, volledige testnamen of paden.
- **Vaste filters** op alle vrije tekst: e-mailadressen, absolute paden, je gebruikersnaam, sessie- en transcript-id's, en HTML-commentaar. De naam in `skills.json` (`learner`) wordt ook gefilterd.
- **Je eigen filter** in `.learning/private.json`:

```json
{
  "terms": ["Voornaam", "Achternaam", "Naam van je werkgever"],
  "replace": { "Naam van een medestudent": "een medestudent" }
}
```

Controleer de diff van `progress.json` altijd zelf voordat je commit of pusht.

## De security check

`harness/security-check.mjs` draait in CI bij elke push en pull request, en lokaal als pre-push-hook (`--install-hook`). Elke bevinding is **BLOKKEER**, **TWIJFEL** of **OK**:

- geheimen (tokens, sleutels), privacy (e-mail, paden, sessie-id's, je privé-termen, het e-mailadres van commits), verboden bestanden (pdf, docx, zip, drawio, ruwe leerdata, toetsmateriaal);
- lange citaten in de onderzoeksnotities (auteursrecht);
- de webpagina's: externe scripts alleen met SRI, een CSP, geen `innerHTML` met vrije tekst, geen `eval`;
- de CI: actions gepind op een commit-SHA, minimale rechten, geen `pull_request_target`;
- de harnas zelf: geen netwerk, geen `eval`, geen shell.

Een TWIJFEL wordt pas OK met een regel in `.security-allowlist.json`, met een reden. Een BLOKKEER kan nooit worden toegestaan.
