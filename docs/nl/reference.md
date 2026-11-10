# Naslag: hooks en commando's

## Hooks

| Event | Script | Wat het doet |
|---|---|---|
| `SessionStart` | `session-start.mjs` | Zet het register, de herhalingen van vandaag, open uitleg en doorstroom-signalen in de context, en vraagt naar je doel. |
| `UserPromptSubmit` | `prompt-gate.mjs` | Herkent de vaardigheid, bepaalt of er een nieuwe trede bij mag, logt opgeloste taken en vraagt om uitleg. Berichten van agents, notificaties en systeemherinneringen tellen niet als jouw woorden. |
| `PreToolUse` | `guard.mjs` | Blokkeert schrijven, bouwen en testen van code op L1–L3, en elke wijziging aan het register, de state en de harnas zelf. |
| `Stop` | `reflect-gate.mjs` | Verwerkt de markers in Claude's antwoord, controleert je uitleg, en vraagt om het dagboek als je wilt stoppen. |

## `skill.mjs` (je draait het zelf, met `!`)

| Commando | Wat |
|---|---|
| `list` / `status` | Overzicht; herhalingen, open uitleg en signalen. Deze twee mag Claude ook draaien. |
| `set <id> <L0..L4> "notitie"` | Niveau zetten. Omhoog kan pas als er geen taken meer op uitleg wachten. |
| `review <id> pass\|shaky\|fail` | Uitkomst van een herhaling. |
| `add-micro <parent> <id> <niveau> "titel" "trefwoorden"` | Een microvaardigheid toevoegen. |
| `done <id> "wat"` | Een taak zonder test afmelden (ontwerp, UML). |
| `untask <id>` | De laatst gelogde taak van een vaardigheid schrappen. |
| `correct <taak-id> trede <1-5> "reden"` | Meer hulp dan gelogd: de trede alleen **omhoog** zetten. |
| `correct <taak-id> schrap "reden"` | Eén taak schrappen. |
| `override <id\|*> <minuten> "reden"` | Tijdelijk toestaan dat Claude code schrijft (hooguit 240 minuten, gelogd). |
| `setting <sleutel> <waarde>` | `examDate`, `stuckTimerMinutes`, `defaultLevel`, `course`, `language`. |

In het Engels kan ook `correct <taak-id> rung …` en `correct <taak-id> void …`.

## `check.mjs` (testrunner)

```text
! node .claude/hooks/check.mjs ood-opdrachten-01/05-de-auto
```

Draait `dotnet test` met een trx-logger en toont een korte samenvatting. Een test die van rood naar groen gaat, wordt een taak met de trede van dat moment. De eerste run per map is een basislijn. Herstel na een regressie telt niet als taak.

## Markers in Claude's antwoord

| Marker | Betekenis |
|---|---|
| `[trede N]` / `[rung N]` | Er is inhoudelijke hulp gegeven op trede N. |
| `[uitleg-ok <tid>]` / `[explain-ok <tid>]` | De uitleg klopt; de Stop-hook controleert hem nog. |
| `[uitleg-nee <tid>]` / `[explain-no <tid>]` | De uitleg is onvolledig; de taak blijft open. |
| `<!-- sessie: <id> -->` / `<!-- session: <id> -->` | In het dagboek: de entry van deze sessie. |

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
