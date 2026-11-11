---
title: "Leerharnas voor Claude Code: leer zelf programmeren met AI"
description: "Gratis Claude Code-opzet voor studenten: hooks voorkomen dat de AI je oefencode schrijft, hints komen in stappen en een dashboard volgt je vaardigheden."
jsonld: software
---
# Leerharnas

Een gratis, open-source opzet voor [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) die voorkomt dat de AI je oefencode schrijft, zodat je **zelf** leert programmeren, ook als er een AI meekijkt.
De harnas weet per vaardigheid hoe ver je bent, en past daar de hulp van de AI op aan. Wat je al beheerst, onderhoud je door het af en toe weer zelf te doen als het in je werk langskomt. Wat je nog leert, doe je zelf, met hints in plaats van oplossingen.

<div class="grid cards" markdown>

- **Installeren**

    Zet de harnas in je eigen projectmap, met één commando.

    [Naar de installatie](install.md)

- **Hoe het werkt**

    Niveaus, de hintladder, de guard, uitleg in eigen woorden en herhalingen.

    [Naar de uitleg](how-it-works.md)

- **Dashboard**

    Voortgang per (micro)vaardigheid, met echte data en een demo.

    [Naar het dashboard](/dashboard/)

- **C# OOP-cheat sheet**

    Het naslagwerk bij het vak: klassen, overerving, UML, patronen.

    [Naar de cheat sheet](/cheatsheet/)

</div>

## Aanleiding

Bij de eerste toets waarbij geen AI mocht, liep ik vast. Dat wilde ik niet nog eens laten gebeuren. Daarom heb ik uitgezocht of Claude mijn leerproces had ondermijnd, en dat bleek deels zo te zijn. Ook de wetenschappelijke literatuur laat zien dat dit een reëel risico is: als je de AI het denkwerk laat doen tijdens het oefenen, kun je daarna minder zonder AI. Een AI-agent zoals Claude Code maakt dat uitbesteden juist heel makkelijk (zie de [risicoanalyse](research.md#3-risicoanalyse)). Daarop heb ik deze harnas gebouwd.

Kort gezegd helpt de harnas je genoeg om niet vast te lopen, en houdt hij het moeilijk genoeg om echt te leren. Op het [dashboard](progress-dashboard.md) volg je hoe het met je vaardigheden gaat.

## Het idee in drie zinnen

1. **De AI schrijft je oefencode niet.** Bij elke vaardigheid hoort een niveau van L0 (*voordoen*) tot L4 (*geautomatiseerd*). Op L1–L3 blokkeert een hook dat de AI jouw code schrijft, bouwt of test.
2. **Hulp gaat in kleine treden.** Eerst een vraag, dan een vindplaats, dan een schets. Een volgende trede komt pas na een zichtbare poging van jou.
3. **Een taak telt pas na jouw uitleg.** Een groene test is bewijs, maar pas als je in eigen woorden uitlegt *waarom* het werkt, telt hij mee voor je niveau.

De ontwerpkeuzes zijn onderbouwd in het [onderzoek](research.md), met de bronnen in de [onderzoeksnotities](notes/index.md).

## Voor wie

Voor studenten die met Claude Code willen oefenen zonder dat de AI het leren overneemt. De meegeleverde kaart is voor **Object-Oriented Design in C#** (HBO-ICT), maar de harnas werkt voor elk vak waarvoor je een kaart met vaardigheden maakt.

## Veelgestelde vragen

### Is oefenen met Claude Code spieken?

Of je AI mag gebruiken, bepaalt je vak, niet de harnas. De harnas zorgt dat de AI het oefenen niet van je overneemt: op L1–L3 blokkeert een hook dat de AI je code schrijft, bouwt of test, en elke uitzondering die je toestaat wordt gelogd. Kijk in de AI-regels van je vak.

### Kan ik voorkomen dat Claude Code mijn code schrijft?

Ja. Dat doet de guard-hook: per vaardigheid, op niveau L1–L3, blokkeert hij dat Claude je code schrijft, verwijdert, bouwt of test. Je kunt het tijdelijk toch toestaan met een override die je zelf zet, en die wordt gelogd. Zie [Hoe het werkt](how-it-works.md#de-guard).

### Werkt het ook voor andere vakken dan C#?

Ja, met een kaart met vaardigheden voor je vak: de vaardigheden, trefwoorden en notities in `harness/maps/<id>/`. De meegeleverde kaart is voor Object-Oriented Design in C#. Voor een andere taal stel je in welke bestanden code zijn en welke commando's bouwen; de testrunner `check.mjs` werkt voorlopig alleen met `dotnet test`. Zie [Configuratie](configuration.md#een-eigen-vak).

### Welke data slaat het op, en waar?

Alles blijft op je eigen computer, in `.learning/` in je projectmap, en de installer houdt die map buiten git. De hooks maken geen netwerkverbindingen. Alleen als je zelf een dashboard publiceert, gaat er een gefilterde export de map uit, met een whitelist van velden en filters voor namen, paden en e-mailadressen. Zie [Configuratie en privacy](configuration.md#privacy).

### Is het gratis?

Ja. De code is open source onder AGPL-3.0, en de teksten, docs en data vallen onder CC BY-NC 4.0. Je hebt wel toegang tot Claude Code zelf nodig, via een abonnement van Claude of de API.

!!! info "AI-verklaring"
    De leerharnas, het dashboard en deze documentatie zijn gemaakt met hulp van Claude (Anthropic). De leerdata en de reflecties in het dashboard zijn van de student zelf. Zie [AI-verklaring](ai-statement.md).
