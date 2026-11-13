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

## Beoordeeld werk

Staat je instelling AI als hulpmiddel toe bij beoordeeld werk, maar geen code van de AI? Bij CHE bijvoorbeeld staat de OER (art. 7.11) AI-niveau 1 toe: AI "om ideeën te genereren of structuur aan te brengen", met een verantwoording van hoe het is gebruikt. De student kan dan de repo van de opdracht als beoordeeld werk instellen. In die paden:

- **Claude schrijft niets**, op geen enkel niveau en zonder override: geen code, geen tooling, niet bouwen of testen. Lezen mag.
- **Hulp stopt bij trede 4**: een vraag, waar het staat, een schets, of een voorbeeld van hoogstens 5 regels over een ander onderwerp. Een uitgewerkte oplossing is daar nooit beschikbaar. Op AI-niveau 0 geeft Claude helemaal geen hulp.
- **Elk antwoord komt in een AI-logboek** in de repo, in `ai-verantwoording/`, geschreven door de hooks en niet door Claude: een regel per antwoord met de trede en het soort hulp, en een export van elke sessie. De laatste kolom is voor de student: wat die met de hulp deed en hoe die het controleerde.

Zo heb je materiaal voor de verantwoording van het AI-gebruik, maar ook dit is geen bewijs: dezelfde grenzen als hierboven gelden. Of een voorbeeld op trede 4 nog telt als "ideeën genereren of structuur aanbrengen", bepaalt je instelling; het logboek noemt elk voorbeeld. Zie [Beoordeeld werk](how-it-works.md#beoordeeld-werk) en de onderbouwing in [§10.8 van het onderzoek](research.md#108-herziening-van-13-november-2026-beoordeeld-werk-volgens-de-oer).

## Afstemmen op je vak

De harnas leest een kaart met vaardigheden: de vaardigheden van je vak, de trefwoorden die een prompt van de student aan een vaardigheid koppelen, en notities met afspraken voor Claude die bij het vak horen. De meegeleverde kaart in [`harness/maps/ood/`](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/main/harness/maps/ood) is een uitgewerkt voorbeeld voor Object-Oriented Design in C#:

- `skills.json`: de vaardigheden, de bestanden die elke vaardigheid dekt, en de standaardinstellingen;
- `keywords.json`: de woorden die een prompt aan een vaardigheid koppelen;
- `notes.nl.md` en `notes.en.md`: de eigen afspraken van het vak voor Claude.

Voor een andere taal dan C# stel je in welke bestanden code zijn en welke commando's bouwen. De testrunner `check.mjs` werkt voorlopig alleen met `dotnet test`. Zie [Configuratie](configuration.md#een-eigen-vak).

## Wat er met studentdata gebeurt

Alles blijft op de computer van de student, in `.learning/` in de projectmap. De hooks maken geen netwerkverbindingen, dus je ziet niets, tenzij een student zelf een dashboard publiceert. Die export bevat alleen een whitelist van velden, en filtert namen, paden en e-mailadressen uit elke tekst. Zie [Configuratie en privacy](configuration.md#privacy).

Eén uitzondering is juist voor jou bedoeld: het AI-logboek van beoordeeld werk staat in de repo van de opdracht, dus je ziet het als de student die repo inlevert. Dezelfde filters halen er e-mailadressen, de thuismap en de eigen termen van de student uit.

## Mag ik hem gebruiken?

- **De code** valt onder AGPL-3.0-only. Je mag hem gebruiken, aanpassen en delen. Bied je een aangepaste versie aan als netwerkdienst, dan deel je ook de broncode daarvan.
- **De teksten, docs, het onderzoek en de cheat sheet** vallen onder CC BY-NC 4.0: je mag ze gebruiken voor niet-commerciële doelen, met naamsvermelding.
- **Commerciële opleiders** hebben een commerciële licentie nodig. Zie [Licentie](https://github.com/piethanegraaf/piethanegraaf.github.io/blob/main/README.nl.md#licentie) in de README.

## Een alinea voor je studiehandleiding

Pas hem aan op je vak:

> Je mag Claude Code in dit vak gebruiken als de leerharnas is geïnstalleerd. De harnas voorkomt dat de AI je oefencode schrijft en geeft je in plaats daarvan hints. Hij kan niet controleren of je zonder AI hebt gewerkt, dus [de toetsen in dit vak maak je zonder AI].

Of, als AI als hulpmiddel mag bij de eindopdracht:

> Bij de eindopdracht mag je Claude Code gebruiken op AI-niveau 1, met de leerharnas geïnstalleerd in de repo van de opdracht en die repo ingesteld als beoordeeld werk. Lever het AI-logboek (`ai-verantwoording/`) in met je repo, met de laatste kolom ingevuld.

## Volgende stappen

- **Maak een kaart met vaardigheden** voor je vak, met de [OOD-kaart](https://github.com/piethanegraaf/piethanegraaf.github.io/tree/main/harness/maps/ood) als startpunt, en [installeer](install.md) de harnas ermee.
- **Vragen, of wil je het in een vak proberen?** Mail naar [hanegraafpiet@gmail.com](mailto:hanegraafpiet@gmail.com).
- **Waarom hij zo gebouwd is:** het [literatuuronderzoek](research.md) legt het bewijs achter elke keuze uit.
