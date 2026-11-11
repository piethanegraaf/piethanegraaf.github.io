---
title: "Naslag: hooks, commando's en bestanden"
description: "De vier Claude Code-hooks van de leerharnas, elk commando van skill.mjs, de testrunner, markers, events en bestanden: wat ze doen en wanneer ze draaien."
---
# Naslag: hooks en commando's

## Hooks

| Event | Script | Wat het doet |
|---|---|---|
| `SessionStart` | `session-start.mjs` | Zet het register, open uitleg en doorstroomvoorstellen in de context, en vraagt naar je doel. Een open voorstel zie je ook zelf, in de melding bij de start. Open uitleg van eerdere sessies vervalt hier. Herhalingen noemt hij niet. |
| `UserPromptSubmit` | `prompt-gate.mjs` | Herkent de vaardigheid, bepaalt of er een nieuwe trede bij mag, logt opgeloste taken en vraagt om uitleg. Zet het niveau als jij een voorstel bevestigt met "ja, doorzetten". Tijdens een transfertaak ontgrendelt geen trede. Berichten van agents, notificaties en systeemherinneringen tellen niet als jouw woorden. |
| `PreToolUse` | `guard.mjs` | Blokkeert schrijven, bouwen en testen van code op L1–L3, en elke wijziging aan het register, de state en de harnas zelf. Een shell-commando beoordeelt hij per los commando, op het programma dat draait. `eval`, `iex` en `Invoke-Expression` weigert hij altijd. |
| `Stop` | `reflect-gate.mjs` | Verwerkt de markers in Claude's antwoord, controleert je uitleg, de transfertaak en het oordeel van de demotie-analist, en vraagt om het dagboek als je wilt stoppen. Haalt een uitleg een doorstroomcriterium, dan laat hij je meteen het voorstel zien. Na het dagboek vervalt wat nog open staat. |

## `skill.mjs` (je draait het zelf, met `!`)

| Commando | Wat |
|---|---|
| `list` / `status` | Overzicht; herhalingen (L4) die klaarstaan, open en overgeslagen uitleg, en signalen. Deze twee mag Claude ook draaien. |
| `set <id> <L0..L4> "notitie"` | Niveau zetten. Omhoog kan pas als er geen taken meer op uitleg wachten. Een voorstel van de harnas bevestig je makkelijker in de chat: typ "ja, doorzetten" (eventueel met de id). |
| `review <id> pass\|shaky\|fail` | De uitkomst van een herhaling zelf opgeven. Meestal niet nodig: de eerstvolgende taak van een L4-vaardigheid bepaalt hem. |
| `add-micro <parent> <id> <niveau> "titel" "trefwoorden"` | Een microvaardigheid toevoegen. Met `autoDemote` maakt de demotie-analist er ook zelf een aan, op het niveau van de ouder min 1. |
| `done <id> "wat"` | Een taak zonder test afmelden (ontwerp, UML). |
| `untask <id>` | De laatst gelogde taak van een vaardigheid schrappen. |
| `correct <taak-id> trede <1-5> "reden"` | Meer hulp dan gelogd: de trede alleen **omhoog** zetten. |
| `correct <taak-id> schrap "reden"` | Eén taak schrappen. |
| `override <id\|*> <minuten> "reden"` | Tijdelijk toestaan dat Claude code schrijft (hooguit 240 minuten, gelogd). |
| `setting <sleutel> <waarde>` | `examDate`, `stuckTimerMinutes`, `idleMinutes`, `defaultLevel`, `course`, `language`. |
| `replay <transcript.jsonl> [--dry-run]` | Herstelt uitleggen die in de chat zijn goedgekeurd maar niet gelogd. Hij zoekt de markers `[uitleg-ok <tid>]` en controleert jouw bericht met dezelfde check als de Stop-hook. Alleen wat beide sleutels haalt, telt, met bron `replay`. |

In het Engels kan ook `correct <taak-id> rung …` en `correct <taak-id> void …`.

## `check.mjs` (testrunner)

```text
! node .claude/hooks/check.mjs ood-opdrachten-01/05-de-auto
```

Draait `dotnet test` met een trx-logger en toont een korte samenvatting. Een test die van rood naar groen gaat, wordt een taak met de trede van dat moment. De eerste run per map is een basislijn. Herstel na een regressie telt niet als taak.

- **Een compileerfout is een startpunt.** Bouwt de map niet (`error CSxxxx`), dan onthoudt `check.mjs` dat. Een test die bij de eerste build die wel lukt groen is, telt dan als nieuw groen. Een fout van de tooling (`NETSDK`, `MSB`) telt niet.
- **De map bepaalt de vaardigheid.** Na een run in een map kiest een trefwoord in je prompt alleen nog een microvaardigheid binnen die familie. Naar een andere familie wissel je met `#id` of de naam van de opdracht.
- **`global.json`:** vraagt die een oudere SDK dan het project gebruikt, zonder `rollForward` naar een nieuwere hoofdversie, dan waarschuwt `check.mjs`.
- Een map relatief aan het project werkt ook als je shell in een andere map staat.

## Markers in Claude's antwoord

| Marker | Betekenis |
|---|---|
| `[trede N]` / `[rung N]` | Er is inhoudelijke hulp gegeven op trede N. |
| `[uitleg-ok <tid>]` / `[explain-ok <tid>]` | De uitleg klopt; de Stop-hook controleert hem nog. |
| `[uitleg-nee <tid>]` / `[explain-no <tid>]` | De uitleg is onvolledig; de taak blijft open. |
| `[demotie {...}]` / `[demotion {...}]` | Het oordeel van de demotie-analist (JSON). De Stop-hook voert het alleen uit als de agent in die beurt echt gedraaid heeft. |
| `[transfer-start <id>]` | Begin van de transfertaak (`/mastery-check`), alleen op L2 of L3. Vanaf dan telt elke `[trede N]` tegen de transfertaak. |
| `[transfer-ok <id>]` / `[transfer-nee <id>]` (`[transfer-no <id>]`) | De transfertaak is gehaald of niet. `ok` telt alleen zonder hulp sinds de start, en als jouw laatste bericht dezelfde check haalt als een uitleg. |
| `<!-- sessie: <id> -->` / `<!-- session: <id> -->` | In het dagboek: de entry van deze sessie. |

## Skills

| Skill | Wat |
|---|---|
| `/diary` | Sluit de sessie af: de feiten van Claude, de reflectie van jou. |
| `/mastery-check <id>` | De transfertaak voor de stap naar L4: een nieuwe opdracht in een ander domein, zonder hulp, en daarna drie waarom-vragen. |

## Events

Alles wat de harnas doet, staat in `.learning/state/events.jsonl`. De events van de review van 10 november 2026:

| Event | Betekenis |
|---|---|
| `task-lapsed` | De uitleg kwam niet direct: de taak vervalt (`other-exercise` of `session-end`). Telt niet; op het dashboard *overgeslagen*. |
| `task-explained` met `source: replay` | Een uitleg die achteraf met `replay` is hersteld. |
| `placement` | Het niveau van een nieuwe vaardigheid, gezet na de eerste taak. |
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

## Bestanden

```text
.learning/
  skills.json        register en instellingen
  keywords.json      trefwoorden per vaardigheid
  private.json       termen die nooit in een export mogen (zelf aanmaken)
  diary/JJJJ-MM-DD.md
  state/             events.jsonl, tests.json, session-*.json, overrides.json
```

## Scripts in deze repository

| Script | Wat |
|---|---|
| `harness/install.mjs` | Installeren en bijwerken. Zie [Installeren](install.md). |
| `harness/export.mjs` | Voortgang exporteren voor het dashboard, met privacyfilters. Zie [Configuratie en privacy](configuration.md). |
| `harness/security-check.mjs` | De controle vóór alles wat online gaat. |
| `harness/demo.mjs` | De demo-data voor het dashboard opnieuw maken. |
| `node --test "test/*.test.mjs"` (in `harness/`) | De tests. |
