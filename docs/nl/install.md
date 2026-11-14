---
title: "De leerharnas installeren in Claude Code"
description: "Clone de repo en draai de Node.js-installer in je projectmap: die zet de hooks, de skills en de C# OOP-kaart klaar. Updates laten je eigen data staan."
jsonld: software
---
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
- `--lang nl|en` kiest de taal van de meldingen, de regels en de skills.
- `--map` is de kaart met vaardigheden: `ood` (Object-Oriented Design in C#, de standaard), `junior-dotnet` (een voorbeeldkaart voor een junior developer op het werk, in C#/.NET), of `security-dotnet` (een oefenkaart voor veilig programmeren, met acht oefeningen in `oefeningen/`). Zie [Een eigen vak](configuration.md#een-eigen-vak).
- `--course` en `--exam` zijn optioneel. Je kunt ze later zetten met `skill.mjs setting`.

Wat de installer aanmaakt:

| Pad | Wat | Van wie |
|---|---|---|
| `.claude/hooks/` | de hooks, de CLI en de meldingen (`i18n/`) | harnas |
| `.claude/skills/diary/SKILL.md` | de diary-skill voor het einde van een sessie | harnas |
| `.claude/skills/mastery-check/SKILL.md` | de transfertaak voor de stap naar L4 (`/mastery-check`) | harnas |
| `.claude/skills/update-dashboard/SKILL.md` | het dashboard bijwerken na `/diary` (`/update-dashboard`) | harnas |
| `.claude/agents/demotie-analist.md` | de agent die alleen leest en beslist wat zakt (`autoDemote`) | harnas |
| `.claude/leerharnas.md` | de regels voor Claude, plus de notities van de kaart | harnas |
| `.claude/settings.json` | de vijf hooks, met `$CLAUDE_PROJECT_DIR` (geen absolute paden) | samengevoegd met jouw instellingen |
| `.claude/leerharnas.json` | het manifest: kaart, taal, versie en een vingerafdruk van elk bestand van de harnas, voor `--update` | harnas |
| `.claude/leerharnas.local.json` | alleen met `--learning-dir`: het pad van het register in een andere map; niet in git | harnas |
| `.learning/skills.json`, `keywords.json` | je vaardighedenregister en trefwoorden, uit de kaart | **jij** (data) |
| `CLAUDE.md` | verwijst naar `.claude/leerharnas.md`; eigen afspraken zet je hier | **jij** |
| `.gitignore` | `.learning/`, de backups en `.claude/leerharnas.local.json` niet delen | aangevuld |
| `oefeningen/` | alleen met `--map security-dotnet`: acht oefeningen, elk met een `README.md` | **jij** (nooit vervangen) |

Bestaat een bestand al en verandert het, dan maakt de installer eerst een backup in `.claude/leerharnas-backup/<tijd>/`.

## Bijwerken

Haal eerst de nieuwe versie van de harnas op in je kopie van deze repository, en werk dan bij:

```bash
git pull
node harness/install.mjs ../mijn-oefenmap --update --yes
```

`--update` vervangt alleen de bestanden van de harnas. Oefeningen in `oefeningen/` zijn van jou: een oefening die er al staat, blijft zoals hij is, en een nieuwe oefening komt erbij. Je data in `.learning/` en je eigen `CLAUDE.md` blijven staan. Heb je een hook zelf aangepast, dan zegt de installer dat ("lokaal aangepast") en bewaart hij je versie in de backupmap.

**Niet tijdens een oefensessie.** Een update vervangt de regels en hooks onder een lopende sessie. Was er in de laatste `idleMinutes` (standaard 20) een sessie actief in de oefenmap, dan waarschuwt `--update` je daarom. In een terminal vraagt hij "Toch doorgaan?". Met `--yes`, of zonder terminal (bijvoorbeeld als een andere Claude-sessie hem draait), stopt hij en verandert hij niets. Zet `--force` erbij als je het zeker weet, bijvoorbeeld als die sessie al klaar is. De regels zeggen dat Claude `--force` nooit zonder jouw ja gebruikt. `--dry-run` toont alleen de waarschuwing.

Een oudere installatie zonder manifest (met absolute paden in `settings.json`) wordt ook herkend en omgezet.

## In de repository van een team

Op het werk installeer je de harnas in een repository die je met je team deelt. De harnas is jouw eigen zelfbindingsmechanisme, dus houd hem buiten de commits van het team:

- **Nieuwe bestanden:** zet ze in `.git/info/exclude`. Dat geldt alleen voor je eigen kopie:

    ```text
    .claude/hooks/
    .claude/skills/diary/
    .claude/skills/mastery-check/
    .claude/skills/update-dashboard/
    .claude/agents/demotie-analist.md
    .claude/leerharnas.md
    .claude/leerharnas.json
    .claude/leerharnas.local.json
    .claude/leerharnas-backup/
    .learning/
    voorbeelden/
    ```

- **Bestanden die het team al heeft:** de installer breidt `.gitignore` uit, zet een regel in `CLAUDE.md` en voegt de hooks samen in `.claude/settings.json`. Commit die wijzigingen niet zonder afspraak met je team.
- **Geen bedrijfsgegevens online:** controleer de diff van de export voordat je een dashboard publiceert (zie [Configuratie en privacy](configuration.md#privacy)), en zet je werkgever en collega's in `.learning/private.json`.

Een installatie die alleen naar lokale bestanden schrijft, bestaat nog niet.

## In de repo van een beoordeelde opdracht

Voor beoordeeld werk, zoals de eindopdracht van een vak, kun je de harnas in de repo van die opdracht installeren en hem het register van je oefenmap laten gebruiken. Dan telt een taak in de opdracht mee voor dezelfde vaardigheid:

```bash
node harness/install.mjs ../<opdracht> --map ood --lang nl --learning-dir "C:/Users/<jij>/<oefenmap>/.learning"
```

- Er komt geen `.learning/` in de repo. Het pad van het register gaat in `.claude/leerharnas.local.json`, dat de installer aan `.gitignore` toevoegt. `--update` houdt het.
- Noem de repo daarna als beoordeeld werk, in een sessie of met `!`: `node .claude/hooks/skill.mjs setting graded add "C:/Users/<jij>/source/repos/<opdracht>"`. Gebruik een absoluut pad: de instelling staat in het gedeelde register, dus ze beschermt de repo ook vanuit een sessie in je oefenmap. Zie [Beoordeeld werk](how-it-works.md#beoordeeld-werk).
- **Wat in git komt:** `.claude/` (je docent ziet welke regels de AI volgde) en `ai-verantwoording/` (het AI-logboek). `.learning/` en `.claude/leerharnas.local.json` blijven erbuiten. Draai de securitycheck voordat je het logboek pusht: het staat in een repo die je docent leest.
- **Sluit de opdracht af vanuit andere mappen** (optioneel, maar aangeraden). Een vraag over de opdracht die je in een sessie in een andere map stelt, krijgt geen trede-grens en geen regel in het logboek. De poort op gebruikersniveau sluit dat af:

    ```bash
    node harness/install.mjs ../<opdracht> --user-guard
    ```

    Hij leest de beoordeelde paden uit het register, laat zijn plan zien en vraagt het voordat hij in `~/.claude/` schrijft: de poort en zijn instellingen, twee hooks in `settings.json` en een blok in `CLAUDE.md`, met een backup van wat verandert. Vanaf dan wordt in elke andere map een prompt die de opdracht noemt (het pad, de mapnaam of de map van de solution) tegengehouden, en elke tool op de paden ervan geweigerd, ook lezen. Alleen de setup daar (`.claude/` en `CLAUDE.md`) blijft open, zodat `--update` blijft werken. Draai hem opnieuw na `setting graded add`; weghalen doe je met `--user-guard --remove`.

## Voordat je gaat oefenen

Zet de AI-hulp buiten Claude Code uit. Anders vult je IDE de code aan die je zelf hoort te schrijven, en daar ziet de harnas niets van.

- **Rider:** zet *Full Line Code Completion* uit (Settings → Plugins), en ook *JetBrains AI Assistant* als je die hebt.
- **Visual Studio:** zet *IntelliCode* (hele regels aanvullen) en *GitHub Copilot* uit.
- **VS Code:** zet *GitHub Copilot* en andere extensies voor inline-suggesties uit voor deze map.
- **Claude Code:** de installer zet de prompt-suggesties uit (`promptSuggestionEnabled: false`), omdat een voorgestelde prompt een hint kan verklappen.

## Na de installatie

1. Start Claude Code in je projectmap. De hook bij de sessiestart laat je vaardigheden zien.
2. Nog geen `--exam`, en heb je een toets? Zet de datum: `! node .claude/hooks/skill.mjs setting examDate 2027-01-20`. Met `--learning-dir` staat deze instelling in het register van de andere map; zet hem daar.
3. Je eerste poging bij een vaardigheid bepaalt het niveau (plaatsing). Kun je iets al? Zet het dan zelf hoger: `! node .claude/hooks/skill.mjs set ood.overerving L3 "nulmeting: zelf gelukt"`
4. Met `--map security-dotnet`: begin bij `oefeningen/README.md`, en draai de tests van een oefening voordat je iets verandert: `! node .claude/hooks/check.mjs oefeningen/01-sql-search`

!!! tip "Het `!`-teken"
    Met `!` voor een commando draai je het zelf in Claude Code. Alleen zo mag je het register wijzigen: de guard laat Claude dat niet doen.

## Verwijderen

Verwijder `.claude/hooks/`, `.claude/skills/diary/`, `.claude/skills/mastery-check/`, `.claude/skills/update-dashboard/`, `.claude/agents/demotie-analist.md`, `.claude/leerharnas.md`, `.claude/leerharnas.json`, `.claude/leerharnas.local.json` (als die er is) en de vijf hooks van de harnas uit `.claude/settings.json` (`session-start`, `prompt-gate`, `guard`, `reflect-gate` en `session-end`; laat je eigen hooks staan). Heb je de poort voor beoordeeld werk geïnstalleerd? Haal die weg met `node harness/install.mjs <map> --user-guard --remove`. Je data in `.learning/` en je oefeningen in `oefeningen/` blijven van jou.
