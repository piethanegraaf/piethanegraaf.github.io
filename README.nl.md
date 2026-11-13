# Leerharnas voor Claude Code

*English: [README.md](README.md)*

**Leerharnas voor Claude Code: hooks voorkomen dat de AI je oefencode schrijft, met niveaus per vaardigheid, een voortgangsdashboard en een literatuuronderzoek.** Documentatie: https://piethanegraaf.github.io/

Een leerharnas voor [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) die zorgt dat je **zelf** leert programmeren, ook als er een AI meekijkt. Hij is er voor studenten, en voor junior developers op hun werk die niet junior willen blijven omdat de AI al het werk doet.

**Het idee:** bouw een vaardigheid eerst zelf op (L0–L3, hints in plaats van oplossingen), besteed die daarna uit aan de AI (L4), en onderhoud die met korte herhalingen in je eigen werk. Elk onderdeel volgt een principe met empirische steun; of de combinatie werkt, is nog niet getest. Onderzoekers zijn uitgenodigd om dat te toetsen in een gerandomiseerd experiment: zie [Voor onderzoekers](https://piethanegraaf.github.io/researchers/).

**Site:** https://piethanegraaf.github.io/ · **Dashboard:** https://piethanegraaf.github.io/dashboard/ · **C# OOP-cheat sheet:** https://piethanegraaf.github.io/cheatsheet/

## Wat het doet

- **Niveaus per vaardigheid** (L0 voordoen → L4 geautomatiseerd). Op L1–L3 blokkeert een hook dat de AI jouw code schrijft, bouwt of test.
- **Een hintladder**: een vraag, dan een vindplaats, dan een schets. Een volgende trede pas na een zichtbare poging.
- **Een taak telt pas na jouw eigen uitleg**, gecontroleerd door Claude en door een vaste check.
- **Uitleg direct**: een taak die je niet uitlegt voor de volgende opdracht, vervalt (overgeslagen).
- **Herhalingen alleen op L4**, met Fibonacci-intervallen: de eerstvolgende keer dat zo'n vaardigheid in je werk langskomt, doe je het zelf.
- **Twee kaarten met vaardigheden**: Object-Oriented Design in C# voor studenten (`--map ood`), en een voorbeeldkaart voor een junior developer op het werk in C#/.NET (`--map junior-dotnet`), waarin code buiten de vaardigheden die je leert op L4 staat.
- **Omhoog kies jij, omlaag volgt het bewijs** (optioneel): een agent die alleen leest, beslist of één deelpatroon of de hele vaardigheid zakt.
- **Beoordeeld werk** (optioneel), zoals een eindopdracht onder een OER die AI als hulpmiddel toestaat: in die paden schrijft Claude op geen enkel niveau iets, stoppen hints bij trede 4, en komt elk antwoord in een AI-logboek in de repo (`ai-verantwoording/`). Met `--learning-dir` gebruikt die repo het register van je oefenmap.
- **Een dagboek** aan het eind van elke sessie, met de reflectie in je eigen woorden.
- **Nederlands en Engels**: meldingen, regels en de skills (diary, mastery-check).

## Snel aan de slag

```bash
git clone https://github.com/piethanegraaf/piethanegraaf.github.io.git
cd piethanegraaf.github.io
node harness/install.mjs ../mijn-oefenmap --lang nl          # laat het plan zien
node harness/install.mjs ../mijn-oefenmap --lang nl --yes    # installeert
```

Nodig: Claude Code, Node.js 18+ (22 of 24 aangeraden), en de .NET SDK voor de testrunner. Zie de [installatie](https://piethanegraaf.github.io/install/).

## De repository

| Map | Wat |
|---|---|
| `harness/` | de installeerbare harnas: hooks, skills (diary, mastery-check), meldingen (`i18n/`), kaarten, sjablonen, `install.mjs`, `export.mjs`, `security-check.mjs`, tests |
| `docs/` | de documentatiesite (MkDocs Material, Nederlands en Engels), met het onderzoek en de onderzoeksnotities |
| `site-src/` | statische pagina's: het dashboard en de cheat sheet |
| `.github/workflows/` | tests, security check, bouwen en publiceren |

De tests draai je met `cd harness && node --test "test/*.test.mjs"`.

## Veiligheid en privacy

De hooks draaien op je eigen computer, zonder netwerkverkeer, `eval` of shell. Je leerdata blijft in `.learning/`, of met `--learning-dir` in het register van je oefenmap. Alleen het AI-logboek van beoordeeld werk is bedoeld voor git, na dezelfde filters. De export voor het dashboard neemt alleen een whitelist van velden mee en filtert persoonlijke gegevens. Zie [SECURITY.md](SECURITY.md).

## AI-verklaring

De harnas, het dashboard, de documentatie en het onderzoek zijn gemaakt met hulp van Claude (Anthropic). De leerdata en de reflecties in het dashboard zijn van de student zelf. Zie de [AI-verklaring](https://piethanegraaf.github.io/ai-statement/).

## Licentie

- **Code** (de harnas in `harness/`, de code van het dashboard, de workflows en de buildconfiguratie): [AGPL-3.0-only](LICENSE). Wil je de code gebruiken in een product of dienst zonder de verplichtingen van de AGPL, zoals het delen van je broncode? Een **commerciële licentie** is op aanvraag beschikbaar: hanegraafpiet@gmail.com.
- **Teksten** (de docs en het onderzoek in `docs/`, de cheat sheet en de dashboarddata): [CC BY-NC 4.0](LICENSE-docs).

Tot en met commit [`d8a4399`](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/d8a4399) (10 november 2026) viel de code onder MIT. Wie die versie heeft, mag hem onder MIT blijven gebruiken. Elke latere versie is AGPL-3.0-only.

Bijdragen: zie [CONTRIBUTING.md](CONTRIBUTING.md). Ze vallen onder een bijdragersovereenkomst (CLA), zodat de code onder beide licenties kan blijven vallen.
