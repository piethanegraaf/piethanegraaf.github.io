---
title: "Leerharnas voor Claude Code: leer zelf programmeren met AI"
description: "Gratis Claude Code-opzet voor studenten en junior developers: hooks houden de AI van je oefencode af, hints komen in stappen, een dashboard volgt je groei."
jsonld: software
---
# Leerharnas

**AI kan je tegelijk sneller en slechter maken in programmeren.**

Deze gratis, open-source harnas voor [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) houdt het leren bij jou, op school en op je werk: hints in plaats van de code die je nog leert schrijven, tot je het zelf kunt. Daarna mag de AI het overnemen, en houd je de vaardigheid bij door het af en toe weer zelf te doen.

[Installeren](install.md){ .md-button .md-button--primary } [Hoe het werkt](how-it-works.md){ .md-button } [Het onderzoek](research.md#key-findings){ .md-button }

## Waarom ik hem bouwde

De oefentoets van mijn vak objectgeoriënteerd programmeren op de hogeschool ging goed. Ik deed die grotendeels zonder AI, en vroeg om hulp als ik vastliep. De diagnostische toets daarna was anders: een half gebouwd project met een bestaand ontwerp, ontwerptaken om af te maken, en unit tests om aan te vullen, en die waren nieuw voor me. Ik wilde er gewoon doorheen komen. Ik was gestrest en van slag, en uiteindelijk leverde ik alleen het solution-bestand in, zonder het project.

Achteraf had ik de code waarmee ik oefende zelden aan mezelf uitgelegd, en mijn ervaring met AI-agents op mijn werk had me een vals gevoel van zekerheid gegeven. Onderzoek laat hetzelfde risico zien: in een studie met wiskunde op de middelbare school verhoogde onbeperkte AI de oefenscores met 48%, maar verlaagde die de toetsscores met 17% zodra de AI weg was ([Bastani et al., 2025](research.md#key-findings)).

Daarom bouwde ik een harnas die het leren bij mij houdt. Ik oefen er nu mee; het echte tentamen moet nog komen, en op het [dashboard](/dashboard/?lang=nl) kun je mijn voortgang volgen.

Junior developers lopen in dezelfde val: de agent krijgt het werk af, maar de vaardigheden die je medior maken, groeien niet ([§2.12 van het onderzoek](research.md#212-het-eeuwige-juniorprobleem)).

## Wat denk jij? {#poll}

<div class="poll" data-poll="judge-code" data-t-loading="De resultaten laden…" data-t-results="Resultaten tot nu toe: {n} stemmen" data-t-results-one="Resultaten tot nu toe: 1 stem" data-t-yours="jouw stem" data-t-delay="Nieuwe stemmen kunnen er een paar uur over doen voor ze in de totalen staan." data-t-unavailable="Dank je voor je stem. De resultaten zijn nu niet te tonen." data-t-thanks="Dank je wel!">
<p class="poll__premise">AI schrijft bij AI-gedreven bedrijven al de eerste versie van de meeste nieuwe code.</p>
<p class="poll__question" id="poll-question">Is leren om code te beoordelen (reviewen, testen, debuggen, ontwerpen) nog je tijd waard, of neemt AI dat binnen een jaar ook over?</p>
<div class="poll__answers" role="group" aria-labelledby="poll-question">
<button type="button" class="md-button" data-answer="more-than-ever">Ja, meer dan ooit: iemand moet het werk van AI controleren</button>
<button type="button" class="md-button" data-answer="for-now">Ja, voorlopig, maar niet lang meer</button>
<button type="button" class="md-button" data-answer="not-sure">Weet ik niet</button>
<button type="button" class="md-button" data-answer="ai-takes-over">Nee, AI beoordeelt code binnen een jaar zelf</button>
</div>
<div class="poll__result" aria-live="polite" hidden></div>
<div class="poll__role" hidden>
<p id="poll-role">En jij bent…?</p>
<div class="poll__roles" role="group" aria-labelledby="poll-role">
<button type="button" class="md-button" data-role="student">Student</button>
<button type="button" class="md-button" data-role="junior">Junior developer</button>
<button type="button" class="md-button" data-role="experienced">Ervaren developer</button>
<button type="button" class="md-button" data-role="teacher-researcher">Docent of onderzoeker</button>
<button type="button" class="md-button" data-role="other">Iets anders</button>
</div>
</div>
<p class="poll__note">Anoniem: geteld met GoatCounter, zonder cookies. Eén stem per browser; de totalen zijn openbaar.</p>
</div>

<div class="grid cards" markdown>

- **Installeren**

    Zet de harnas in je eigen projectmap, met één commando.

    [Naar de installatie](install.md)

- **Hoe het werkt**

    Niveaus, de hintladder, de guard, uitleg in eigen woorden en herhalingen.

    [Naar de uitleg](how-it-works.md)

- **Het onderzoek**

    Wat studies zeggen over leren programmeren met AI: de belangrijkste bevindingen, een risicoanalyse en de bronnen.

    [Naar de bevindingen](research.md#key-findings)

- **Dashboard**

    Voortgang per (micro)vaardigheid, met echte data en een demo.

    [Naar het dashboard](/dashboard/?lang=nl)

- **C# OOP-cheat sheet**

    Het naslagwerk bij het vak: klassen, overerving, UML, patronen.

    [Naar de cheat sheet](/nl/cheatsheet/)

</div>

## Het idee: eerst opbouwen, dan uitbesteden, en onderhouden

1. **Bouw een vaardigheid eerst zelf op.** Bij elke vaardigheid hoort een niveau van L0 (*voordoen*) tot L4 (*geautomatiseerd*). Op L1–L3 blokkeert een hook dat de AI jouw code schrijft, bouwt of test. Hulp komt in kleine treden: eerst een vraag, dan een vindplaats, dan een schets, telkens pas na een zichtbare poging van jou. Een taak telt pas als je in eigen woorden uitlegt *waarom* het werkt.
2. **Besteed het daarna uit.** Staat een vaardigheid op L4, dan mag de AI het meteen doen, en houd jij toezicht. Je eigen tijd gaat naar wat je nog leert.
3. **Onderhoud het af en toe.** Met groeiende tussenpozen doe je een L4-vaardigheid de eerstvolgende keer dat die in je werk langskomt weer zelf. Gaat dat mis, dan zakt de vaardigheid een niveau.

Elk onderdeel volgt een principe met empirische steun uit de leerwetenschap en uit onderzoek naar automatisering: zie het [onderzoek](research.md), met de bronnen in de [onderzoeksnotities](notes/index.md). Of de combinatie werkt, is niet getest. Daarom worden onderzoekers uitgenodigd om dat te toetsen in een gerandomiseerd experiment ([Voor onderzoekers](researchers.md)).

## Voor wie

- **Studenten** die met Claude Code willen oefenen zonder dat de AI het leren overneemt. De meegeleverde kaart is voor **Object-Oriented Design in C#** (HBO-ICT).
- **Junior developers op hun werk** die willen blijven groeien terwijl ze met een AI-agent werken. Er is een voorbeeldkaart voor C#/.NET (`junior-dotnet`): code die bij geen vaardigheid hoort, mag de AI schrijven, en alleen wat je leert, is beschermd. Je past die aan op je eigen codebase (zie [Een eigen vak](configuration.md#een-eigen-vak) en [In de repository van een team](install.md#in-de-repository-van-een-team)). Taken worden voorlopig alleen met `dotnet test` automatisch vastgelegd vanuit tests; anders meld je ze zelf af. Voor veilig programmeren is er een oefenkaart met acht oefeningen (`security-dotnet`). Zie [Voor junior developers](for-juniors.md).
- **Docenten en vakcoördinatoren** die hem in een vak willen gebruiken: zie [Voor docenten](for-educators.md).
- **Onderzoekers** die de harnas willen toetsen: zie [Voor onderzoekers](researchers.md).

## Veelgestelde vragen

### Is oefenen met Claude Code spieken?

Of je AI mag gebruiken, bepaalt je vak, niet de harnas. De harnas zorgt dat de AI het oefenen niet van je overneemt: op L1–L3 blokkeert een hook dat de AI je code schrijft, bouwt of test, en elke uitzondering die je toestaat wordt gelogd. Kijk in de AI-regels van je vak. Voor beoordeeld werk, zoals een eindopdracht, kun je de repo daarvan instellen als [beoordeeld werk](how-it-works.md#beoordeeld-werk): dan schrijft Claude daar geen inhoud (alleen vaste tooling, zoals `dotnet new` of het officiële arc42-sjabloon), krijg je hints tot trede 4, en komt elk antwoord in een AI-logboek voor je verantwoording.

### Kan ik voorkomen dat Claude Code mijn code schrijft?

Ja. Dat doet de guard-hook: per vaardigheid, op niveau L1–L3, blokkeert hij dat Claude je code schrijft, verwijdert, bouwt of test. Je kunt het tijdelijk toch toestaan met een override die je zelf zet, en die wordt gelogd. In de paden van beoordeeld werk blokkeert hij dat op elk niveau, en daar is geen override. Zie [Hoe het werkt](how-it-works.md#de-guard).

### Werkt het ook voor andere vakken dan C#?

Ja, met een kaart met vaardigheden voor je vak: de vaardigheden, trefwoorden en notities in `harness/maps/<id>/`. De meegeleverde kaarten zijn Object-Oriented Design in C# voor studenten, een voorbeeld voor een junior developer in C#/.NET, en een oefenkaart voor veilig programmeren in C#/.NET met acht oefeningen. Voor een andere taal stel je in welke bestanden code zijn en welke commando's bouwen; de testrunner `check.mjs` werkt voorlopig alleen met `dotnet test`. Zie [Configuratie](configuration.md#een-eigen-vak).

### Blijf ik junior als AI mijn werk doet?

Dat kan. Een junior die werk aan een agent overlaat voordat hij het zelf kan, krijgt het werk af, maar bouwt misschien niet de vaardigheden op die je medior maken: debuggen, code lezen, ontwerpkeuzes en AI-output controleren. In een korte gerandomiseerde studie scoorden engineers die met AI een nieuwe library leerden daarna 50% tegen 67% op een quiz (Shen & Tamkin, 2026). Met de harnas bouw je zelf op wat je leert en besteed je de rest uit. Zie [Voor junior developers](for-juniors.md).

### Welke data slaat het op, en waar?

Alles blijft op je eigen computer, in `.learning/` in je projectmap (of met `--learning-dir` in die van je oefenmap), en de installer houdt die map buiten git. Eén uitzondering is bedoeld: bij [beoordeeld werk](how-it-works.md#beoordeeld-werk) schrijven de hooks een gefilterd AI-logboek in de repo van de opdracht, voor je docent. De hooks maken geen netwerkverbindingen. Alleen als je zelf een dashboard publiceert, gaat er een gefilterde export de map uit, met een whitelist van velden en filters voor namen, paden en e-mailadressen. Zie [Configuratie en privacy](configuration.md#privacy).

### Is het gratis?

Ja. De code is open source onder AGPL-3.0, en de teksten, docs en data vallen onder CC BY-NC 4.0. Je hebt wel toegang tot Claude Code zelf nodig, via een abonnement van Claude of de API.

## Aan de slag

Installeer de harnas in je eigen project, bekijk hoe hij werkt, of lees het onderzoek erachter.

[Installeren](install.md){ .md-button .md-button--primary } [Hoe het werkt](how-it-works.md){ .md-button } [Het onderzoek](research.md#key-findings){ .md-button }

!!! info "AI-verklaring"
    De leerharnas, het dashboard en deze documentatie zijn gemaakt met hulp van Claude (Anthropic). De leerdata en de reflecties in het dashboard zijn van de student zelf. Zie [AI-verklaring](ai-statement.md).
