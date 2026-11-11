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
| `codeExtensions` | `cs, csproj, sln, slnx` | Welke bestanden code van de student zijn. |
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

## Privacy

Je leerdata blijft lokaal in `.learning/`. De installer zet die map in `.gitignore`.

Wil je je voortgang laten zien, zoals in het [dashboard](progress-dashboard.md), dan gebruik je de export:

```bash
node harness/export.mjs ../mijn-oefenmap --dry-run   # rapport, schrijft niets
node harness/export.mjs ../mijn-oefenmap             # schrijft site-src/dashboard/data/progress.json
```

Heeft een vrije tekst nog geen vertaling in de andere taal? Dan vraagt de export eerst om de vertalingen (zie [Vertalingen](progress-dashboard.md#vertalingen)).

- **Alleen een whitelist.** Niveaus, taken (trede, bron, uitleg, afwijzingen, correcties, overgeslagen), herhalingen, signalen, en uit het dagboek alleen het plan, wat goed ging, de reflectie en de kalibratie. Nooit ruwe events, sessie-id's, testnamen of paden.
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
