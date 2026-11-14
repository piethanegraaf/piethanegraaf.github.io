---
title: "Het onderzoek van Anthropic naar AI en programmeervaardigheden: wat het vond en wat je ermee doet"
description: "In het gerandomiseerde experiment van Anthropic scoorden ontwikkelaars die een nieuwe library met AI leerden 50% tegen 67% op een toets, met het grootste verschil bij debuggen. Wat het laat zien en wat niet."
---
# Het onderzoek van Anthropic naar AI en programmeervaardigheden: wat het vond en wat je ermee doet

**Kort antwoord:** in een gerandomiseerd experiment dat Anthropic in januari 2026 publiceerde, scoorden ontwikkelaars die een nieuwe Python-library leerden met een AI-assistent 50% op een toets achteraf, tegen 67% voor wie met de hand codeerde. Het grootste verschil zat bij debuggen, en de AI-groep was niet significant sneller. Deelnemers die de AI vragen over concepten stelden, scoorden veel hoger dan wie de code uitbesteedde, maar die vergelijking is correlationeel. Wat je ermee doet: maak de werkwijze met de hoge scores de standaard, en dwing die af zolang je een vaardigheid nog leert.

## Wat het onderzoek deed

| | |
|---|---|
| **Artikel** | Shen & Tamkin (2026), *How AI Impacts Skill Formation*, arXiv-preprint (Anthropic Fellows) |
| **Opzet** | Gerandomiseerd: met of zonder AI-assistent (gebaseerd op GPT-4o) |
| **Deelnemers** | 52 ontwikkelaars, vooral professionals of freelancers, ongeveer 25–35 jaar, geworven via een crowdworkplatform |
| **Taak** | Trio leren, een asynchrone Python-library die ze niet kenden, en die gebruiken |
| **Uitkomst** | Een toets achteraf, zonder AI, met vragen over debuggen |

## Wat het vond

- **Minder geleerd.** De AI-groep scoorde 50% tegen 67% op de toets (d = 0,74, p = 0,01).
- **Debuggen leed het meest.** Het grootste verschil zat bij de vragen over debuggen, de vaardigheid die je nodig hebt om code van een AI te controleren.
- **Niet sneller.** De AI-groep was maar ongeveer twee minuten sneller, en dat was niet significant.
- **Hoe mensen de AI gebruikten, maakte uit.** De werkwijzen waarbij mensen zelf bleven nadenken, zoals vragen over concepten stellen, of code laten maken en daarna checken of je die begrijpt, scoorden 65–86%. Werkwijzen van uitbesteden scoorden 24–39%.

## Wat het niet laat zien

- **De werkwijzen zijn correlationeel.** Ze zijn achteraf uit schermopnames gehaald, met 2 tot 7 mensen per werkwijze. Sterkere of gemotiveerdere deelnemers kozen ze misschien gewoon. Het gerandomiseerde resultaat is het verschil tussen de groepen, niet het effect van een werkwijze.
- **Kort en klein.** Eén taak, één toets direct daarna, 52 mensen. Niets over wat er in maanden gebeurt.
- **Geen studenten.** De meeste deelnemers werkten al als ontwikkelaar. Voor beginners staat er meer op het spel: zij moeten de vaardigheden nog verwerven die experts alleen hoeven te houden.
- **Een onderzoek van een leverancier.** Anthropic maakt AI-tools om mee te programmeren, maar deze uitkomst gaat tegen zijn commerciële belang in, en dat maakt hem eerder geloofwaardiger dan minder.

Het [literatuuronderzoek](research/literature.md#28-generatieve-ai-en-leren-programmeren-het-bewijs-tot-nu-toe) geeft het hoofdeffect bewijsgraad A en de werkwijzen graad C.

## Hoe het past bij ander bewijs

Grotere experimenten laten hetzelfde beeld zien. Op een middelbare school met ongeveer 1.000 leerlingen verhoogde onbeperkte GPT-4 de oefenscores met 48%, maar verlaagde hij de examenscores met 17% zodra de toegang wegviel. Een versie die hints gaf en geen antwoorden, vermeed die schade (Bastani et al., 2025). En een tutor in zijn systeemprompt vragen om stap voor stap te helpen, veranderde niets in een experiment met 1.059 studenten; poortjes in de werkwijze zelf werkten beter (Barth et al., 2026). Zie de [belangrijkste bevindingen](research/index.md#key-findings).

## Wat je ermee doet

De werkwijzen met de hoge scores kiezen vraagt discipline, zeker vlak voor een deadline. De leerharnas maakt ze de standaard voor de vaardigheden die je nog leert, en blokkeert de werkwijze met de lage scores:

| In het onderzoek | In de leerharnas |
|---|---|
| Vragen over concepten stellen scoorde hoog | Zit je vast, dan is de eerste hint een vraag, dan waar je moet kijken, dan een schets, en pas daarna een klein voorbeeld: concepten vóór code |
| Code laten maken en daarna je begrip checken scoorde hoog | Een taak telt pas nadat je hem in je eigen woorden uitlegt, beoordeeld door Claude en gecontroleerd door een hook |
| De code uitbesteden scoorde laag | Op niveau L1–L3 houdt een hook Claude tegen om je code te schrijven, te verwijderen, te bouwen of te testen |
| Debuggen had het grootste verschil | Debuggen is een eigen vaardigheid in de kaart voor junior developers: hints, niet de oplossing |
| AI-gebruikers waren niet sneller tijdens het leren | De kosten van met de hand oefenen zijn misschien het kleinst zolang een vaardigheid nieuw is; je besteedt hem uit zodra je hem beheerst (L4) |

Of dit het leren van de deelnemers met hoge scores oplevert, is niet getest. Daarvoor is de [uitnodiging aan onderzoekers](researchers.md). Zie [Hoe het werkt](how-it-works.md) en [Leermodus van Claude Code vs. een leerharnas](claude-code-learning-mode.md).

## Veelgestelde vragen

### Vond Anthropic dat AI ontwikkelaars slechter maakt?

Niet precies. Het vond dat ontwikkelaars die een nieuwe library met AI leerden, er minder van leerden, vooral van debuggen. Wie de AI gebruikte om te begrijpen in plaats van om code te maken, deed het veel beter, maar dat deel is correlationeel.

### Waren de ontwikkelaars met AI sneller?

Maar ongeveer twee minuten, en dat was statistisch niet significant. Terwijl je iets nieuws leert, kost AI je misschien leren zonder veel tijd te besparen.

### Moeten junior developers stoppen met AI?

Nee. Het onderzoek wijst op ander gebruik zolang je leert: vraag om uitleg, schrijf de code zelf, en check je eigen begrip. Beheers je een vaardigheid, dan is uitbesteden prima, zolang je hem bijhoudt met af en toe een herhaling.

### Waar lees ik het onderzoek?

Het artikel staat op [arXiv (2601.20245)](https://arxiv.org/abs/2601.20245), en Anthropic vatte het samen in [How AI assistance impacts the formation of coding skills](https://www.anthropic.com/research/AI-assistance-coding-skills).
