# Installeren

## Wat je nodig hebt

- [Claude Code](https://docs.claude.com/en/docs/claude-code/overview).
- [Node.js](https://nodejs.org/) 18 of nieuwer (22 of 24 aangeraden). De hooks zijn Node-scripts zonder afhankelijkheden.
- Voor de testrunner `check.mjs`: de [.NET SDK](https://dotnet.microsoft.com/) met je testproject (NUnit, xUnit of MSTest).
- Een kopie van deze repository: `git clone https://github.com/piethanegraaf/piethanegraaf.github.io.git`

## Installeren in je projectmap

```bash
node harness/install.mjs ../mijn-oefenmap --lang nl --course "OOD" --exam 2027-01-20
```

- Zonder `--yes` laat het script alleen zien wat het zou doen. Draai het daarna opnieuw met `--yes`.
- `--lang nl|en` kiest de taal van de meldingen, de regels en de diary-skill.
- `--map ood` is de kaart met vaardigheden (nu alleen `ood`).
- `--course` en `--exam` zijn optioneel. Je kunt ze later zetten met `skill.mjs setting`.

Wat de installer aanmaakt:

| Pad | Wat | Van wie |
|---|---|---|
| `.claude/hooks/` | de hooks, de CLI en de meldingen (`i18n/`) | harnas |
| `.claude/skills/diary/SKILL.md` | de diary-skill voor het einde van een sessie | harnas |
| `.claude/leerharnas.md` | de regels voor Claude, plus de notities van de kaart | harnas |
| `.claude/settings.json` | de vier hooks, met `$CLAUDE_PROJECT_DIR` (geen absolute paden) | samengevoegd met jouw instellingen |
| `.learning/skills.json`, `keywords.json` | je vaardighedenregister en trefwoorden, uit de kaart | **jij** (data) |
| `CLAUDE.md` | verwijst naar `.claude/leerharnas.md`; eigen afspraken zet je hier | **jij** |
| `.gitignore` | `.learning/` en de backups niet delen | aangevuld |

Bestaat een bestand al en verandert het, dan maakt de installer eerst een backup in `.claude/leerharnas-backup/<tijd>/`.

## Bijwerken

```bash
node harness/install.mjs ../mijn-oefenmap --update --yes
```

`--update` vervangt alleen de bestanden van de harnas. Je data in `.learning/` en je eigen `CLAUDE.md` blijven staan. Heb je een hook zelf aangepast, dan zegt de installer dat ("lokaal aangepast") en bewaart hij je versie in de backupmap.

Een oudere installatie zonder manifest (met absolute paden in `settings.json`) wordt ook herkend en omgezet.

## Voordat je gaat oefenen

Zet de AI-hulp buiten Claude Code uit. Anders vult je IDE de code aan die je zelf hoort te schrijven, en daar ziet de harnas niets van.

- **Rider:** zet *Full Line Code Completion* uit (Settings → Plugins), en ook *JetBrains AI Assistant* als je die hebt.
- **Visual Studio:** zet *IntelliCode* (hele regels aanvullen) en *GitHub Copilot* uit.
- **VS Code:** zet *GitHub Copilot* en andere extensies voor inline-suggesties uit voor deze map.
- **Claude Code:** de installer zet de prompt-suggesties uit (`promptSuggestionEnabled: false`), omdat een voorgestelde prompt een hint kan verklappen.

## Na de installatie

1. Start Claude Code in je projectmap. De hook bij de sessiestart laat je vaardigheden zien.
2. Zet je toetsdatum: `! node .claude/hooks/skill.mjs setting examDate 2027-01-20`
3. Kalibreer je niveaus met een korte nulmeting zonder AI, en zet ze zelf: `! node .claude/hooks/skill.mjs set ood.overerving L3 "nulmeting: zelf gelukt"`

!!! tip "Het `!`-teken"
    Met `!` voor een commando draai je het zelf in Claude Code. Alleen zo mag je het register wijzigen: de guard laat Claude dat niet doen.

## Verwijderen

Verwijder `.claude/hooks/`, `.claude/skills/diary/`, `.claude/leerharnas.md`, `.claude/leerharnas.json` en de vier hooks uit `.claude/settings.json`. Je data in `.learning/` blijft van jou.
