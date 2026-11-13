---
title: "Voor junior developers: blijf leren naast een AI-agent"
description: "Hoe je als junior blijft groeien met Claude Code op je werk: bouw zelf wat je leert, laat de AI de rest doen, en houd het buiten de commits van je team."
---
# Voor junior developers

Laat je een AI-agent al je werk doen, dan komt het werk af, maar sla je de oefening over die je medior maakt: zelf code schrijven, debuggen en ontwerpen. Met de leerharnas kies je welke vaardigheden je met de hand opbouwt, en laat je Claude Code de rest doen.

## De afweging

1. **Bouw zelf op wat je leert.** Bij bestanden van een vaardigheid die je leert (niveau L1–L3) voorkomt een hook dat Claude je code schrijft, bouwt of test. Je krijgt hints: eerst een vraag, dan waar het staat, dan een schets.
2. **Besteed de rest uit.** Code die bij geen vaardigheid hoort, staat op L4: Claude mag die meteen schrijven, en jij superviseert.
3. **Onderhoud wat je beheerst.** Met groeiende tussenpozen doe je een L4-vaardigheid weer zelf, de eerstvolgende keer dat die in je werk langskomt.

Dat heeft waarschijnlijk een prijs: zolang een vaardigheid op L1–L3 staat, rond je minder taken af. Elk onderdeel volgt een principe met empirische steun, maar of de combinatie werkt, is nog niet getest. Daarom is er een [uitnodiging aan onderzoekers](researchers.md).

## De voorbeeldkaart voor C#/.NET

Installeer met `--map junior-dotnet`. De kaart heeft tien vaardigheden: debuggen, onbekende code lezen, unit tests, veilig refactoren, ASP.NET Core-API's, EF Core en LINQ, async/await, veiligheid, code van AI reviewen en een taak specificeren voor een agent.

De guard beschermt alleen bestanden onder de paden van een vaardigheid (en de paden van [beoordeeld werk](how-it-works.md#beoordeeld-werk), die je op je werk niet nodig hebt). Een vaardigheid zonder paden, zoals debuggen, krijgt wel de hintladder, maar de guard houdt niets tegen. Pas de kaart aan op je eigen codebase (zie [Een eigen vak](configuration.md#een-eigen-vak)).

## Veilige code naast een AI-agent

Je vraagt Claude Code om een zoekpagina die de zoekterm van de gebruiker terugtoont. De code compileert, de tests slagen en de pagina werkt. Of de zoekterm wordt gecodeerd voordat die in de HTML komt, zie je niet, en daar gaat AI-code het vaakst mis. In een meting van oktober 2026 ging cross-site scripting maar in 18% van de gevallen goed. Bij echte feature-verzoeken was de beste agent in 57% van de taken correct, maar in 11,8% ook veilig.

Het grootste risico is niet de code zelf, maar je vertrouwen erin. Wie met een AI-assistent werkt, denkt vaker dan terecht dat de code veilig is, en merkt niet waar het misgaat. Wat wel helpt, is aandacht op het moment van de beslissing: reviewers die de opdracht kregen op security te letten, vonden de kwetsbaarheid veel vaker, en een checklist voegde daar niets aan toe. Je werkgever gaat er ook naar vragen. Sinds augustus 2026 vallen ruim 8.000 organisaties onder de Cyberbeveiligingswet, en vanaf december 2027 mogen producten onder de Cyber Resilience Act niet meer met bekende uitbuitbare kwetsbaarheden op de markt komen.

Daarom is veilig programmeren de eerste niche die we voor juniors uitwerken. Het plan:

- `security.basics` wordt vier vaardigheden: uitvoer coderen en invoer valideren, geparametriseerde queries, geheimen en configuratie, en AI-code reviewen op security.
- Je legt bij een securitytaak uit wat een aanvaller in handen heeft, welke maatregel dat tegenhoudt, en hoe je dat controleert.
- Naast `dotnet test` komt een statische analyser. Jij legt de waarschuwingen uit; Claude lost ze niet voor je op.
- Bevindingen over kwetsbaarheden gaan niet mee in de export voor het dashboard.

Dit is nog niet gebouwd, en of het juniors veiliger laat programmeren, is niet getest. De studies en hun grenzen staan in [§2.13 van het onderzoek](research.md#213-veilige-code-als-eerste-niche-voor-juniors).

## Op je werk

- **Houd hem buiten de commits van het team.** De harnas is je eigen commitment device. Zet zijn bestanden in `.git/info/exclude`, en commit de wijzigingen aan gedeelde bestanden niet zonder afspraak met je team. Zie [In de repository van een team](install.md#in-de-repository-van-een-team).
- **De code van het team blijft van het team.** De kaart zegt Claude dat hij projectbestanden, CI-configuratie en gedeelde instellingen niet verandert zonder het jou te vragen.
- **Geen bedrijfsdata online.** Je dagboek gaat over de vaardigheid, niet over klanten of collega's. Publiceer je een dashboard, zet dan je werkgever en collega's in `.learning/private.json` en controleer eerst de export (zie [Configuratie en privacy](configuration.md#privacy)).
- **Check de regels van je werkgever** voor AI-tools voordat je iets in een repository van je werk installeert.

## Waarom dit ertoe doet

Juniors die een agent al het werk laten doen, kunnen junior blijven: het [onderzoek naar het eeuwige-juniorprobleem](research.md#212-het-eeuwige-juniorprobleem) behandelt de studies en de parallellen met andere beroepen, en de [onderzoeksnotities](/en/notes/eternal_junior/) (Engels) geven de bronnen.

## Volgende stap

[Installeer de harnas](install.md) met `--map junior-dotnet`. Vragen? Mail naar [hanegraafpiet@gmail.com](mailto:hanegraafpiet@gmail.com). Bugs horen in een [issue op GitHub](https://github.com/piethanegraaf/piethanegraaf.github.io/issues/new).
