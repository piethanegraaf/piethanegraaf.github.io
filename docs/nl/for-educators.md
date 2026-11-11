---
title: "Voor docenten: de leerharnas in je vak"
description: "Wat de leerharnas afdwingt en wat niet, hoe je hem met een kaart met vaardigheden afstemt op je vak, wat er met studentdata gebeurt, wat de licenties toestaan."
---
# Voor docenten

Met de leerharnas kunnen studenten Claude Code gebruiken in een programmeervak, zonder dat de AI het oefenen van ze overneemt. Studenten installeren hem zelf. Hij ondersteunt hun leren; het is geen surveillancetool.

## Wat hij afdwingt, en wat niet

- **Geen oefencode van de AI.** Op niveau L1–L3 blokkeert een hook dat Claude de code van de student schrijft, bouwt of test. Hulp komt als hintladder: eerst een vraag, dan waar het staat, dan een schets.
- **Uitleg telt, niet een groene test.** Een taak telt pas als de student in eigen woorden uitlegt waarom het werkt.
- **Uitzonderingen zijn zichtbaar.** Laat een student Claude een tijdje toch code schrijven (een override), dan wordt dat gelogd en staat het in het dagboek.
- **Hij kan niet bewijzen dat een student zonder AI werkte.** Studenten kunnen de hooks uitzetten, een andere AI-tool gebruiken of een weg om de regels heen vinden. De harnas werkt omdat de student er zelf voor kiest. Gebruik hem voor het oefenen, en houd je toetsen onder je eigen voorwaarden.

## Afstemmen op je vak

De harnas leest een kaart met vaardigheden: de vaardigheden van je vak, de trefwoorden die een prompt van de student aan een vaardigheid koppelen, en notities met afspraken voor Claude die bij het vak horen. De meegeleverde kaart in [`harness/maps/ood/`](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/main/harness/maps/ood) is een uitgewerkt voorbeeld voor Object-Oriented Design in C#:

- `skills.json`: de vaardigheden, de bestanden die elke vaardigheid dekt, en de standaardinstellingen;
- `keywords.json`: de woorden die een prompt aan een vaardigheid koppelen;
- `notes.nl.md` en `notes.en.md`: de eigen afspraken van het vak voor Claude.

Voor een andere taal dan C# stel je in welke bestanden code zijn en welke commando's bouwen. De testrunner `check.mjs` werkt voorlopig alleen met `dotnet test`. Zie [Configuratie](configuration.md#een-eigen-vak).

## Wat er met studentdata gebeurt

Alles blijft op de computer van de student, in `.learning/` in de projectmap. De hooks maken geen netwerkverbindingen, dus je ziet niets, tenzij een student zelf een dashboard publiceert. Die export bevat alleen een whitelist van velden, en filtert namen, paden en e-mailadressen uit elke tekst. Zie [Configuratie en privacy](configuration.md#privacy).

## Mag ik hem gebruiken?

- **De code** valt onder AGPL-3.0-only. Je mag hem gebruiken, aanpassen en delen. Bied je een aangepaste versie aan als netwerkdienst, dan deel je ook de broncode daarvan.
- **De teksten, docs, het onderzoek en de cheat sheet** vallen onder CC BY-NC 4.0: je mag ze gebruiken voor niet-commerciële doelen, met naamsvermelding.
- **Commerciële opleiders** hebben een commerciële licentie nodig. Zie [Licentie](https://github.com/piethanegraaf/piethanegraaf.github.io/blob/main/README.nl.md#licentie) in de README.

## Een alinea voor je studiehandleiding

Pas hem aan op je vak:

> Je mag Claude Code in dit vak gebruiken als de leerharnas is geïnstalleerd. De harnas voorkomt dat de AI je oefencode schrijft en geeft je in plaats daarvan hints. Hij kan niet controleren of je zonder AI hebt gewerkt, dus [de toetsen in dit vak maak je zonder AI].

## Volgende stappen

- **Maak een kaart met vaardigheden** voor je vak, met de [OOD-kaart](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/main/harness/maps/ood) als startpunt, en [installeer](install.md) de harnas ermee.
- **Vragen, of wil je het in een vak proberen?** [Open een issue op GitHub](https://github.com/piethanegraaf/piethanegraaf.github.io/issues/new).
- **Waarom hij zo gebouwd is:** het [literatuuronderzoek](research.md) legt het bewijs achter elke keuze uit.
