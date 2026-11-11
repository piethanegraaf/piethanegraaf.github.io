# Leerharnas

Een leerharnas voor [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) die zorgt dat je **zelf** leert programmeren, ook als er een AI meekijkt. Hij is er voor studenten, en voor junior developers op hun werk die niet junior willen blijven omdat de AI al het werk doet.
De harnas weet per vaardigheid hoe ver je bent, en past daar de hulp van de AI op aan. Wat je nog leert, doe je zelf, met hints in plaats van oplossingen. Wat je beheerst, mag de AI meteen doen, en je onderhoudt het door het af en toe weer zelf te doen als het in je werk langskomt.

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

- **Voor onderzoekers**

    Toets de harnas in een gerandomiseerd experiment: hypothesen, groepen en uitkomsten.

    [Naar de uitnodiging](researchers.md)

</div>

## Aanleiding

Bij de eerste toets waarbij geen AI mocht, liep ik vast. Dat wilde ik niet nog eens laten gebeuren. Daarom heb ik uitgezocht of Claude mijn leerproces had ondermijnd, en dat bleek deels zo te zijn. Ook de wetenschappelijke literatuur laat zien dat dit een reëel risico is: als je de AI het denkwerk laat doen tijdens het oefenen, kun je daarna minder zonder AI. Een AI-agent zoals Claude Code maakt dat uitbesteden juist heel makkelijk (zie de [risicoanalyse](research.md#3-risicoanalyse)). Daarop heb ik deze harnas gebouwd.

Hetzelfde risico houdt niet op na je studie. Een junior developer die een agent al het werk laat doen, krijgt het werk wel af, maar slaat het oefenen over waardoor je medior of senior wordt: zelf schrijven, debuggen en ontwerpen. Zo'n junior kan junior blijven. Interviews met juniors en seniors beschrijven dit patroon, en ontwikkelaars waarschuwen ervoor in talks en blogs (zie [§2.12](research.md#212-het-eeuwige-juniorprobleem)). Dat is het tweede doel van de harnas.

Kort gezegd helpt de harnas je genoeg om niet vast te lopen, en houdt hij het moeilijk genoeg om echt te leren. Op het [dashboard](progress-dashboard.md) volg je hoe het met je vaardigheden gaat.

## Het idee: eerst opbouwen, dan uitbesteden, en onderhouden

1. **Bouw een vaardigheid eerst zelf op.** Bij elke vaardigheid hoort een niveau van L0 (*voordoen*) tot L4 (*geautomatiseerd*). Op L1–L3 blokkeert een hook dat de AI jouw code schrijft, bouwt of test. Hulp komt in kleine treden: eerst een vraag, dan een vindplaats, dan een schets, telkens pas na een zichtbare poging van jou. Een taak telt pas als je in eigen woorden uitlegt *waarom* het werkt.
2. **Besteed het daarna uit.** Staat een vaardigheid op L4, dan mag de AI het meteen doen, en houd jij toezicht. Je eigen tijd gaat naar wat je nog leert.
3. **Onderhoud het af en toe.** Met groeiende tussenpozen doe je een L4-vaardigheid de eerstvolgende keer dat die in je werk langskomt weer zelf. Gaat dat mis, dan zakt de vaardigheid een niveau.

Elk onderdeel volgt een principe met empirische steun uit de leerwetenschap en uit onderzoek naar automatisering: zie het [onderzoek](research.md), met de bronnen in de [onderzoeksnotities](notes/index.md). Of de combinatie werkt, is niet getest. Daarom worden onderzoekers uitgenodigd om dat te toetsen in een gerandomiseerd experiment ([Voor onderzoekers](researchers.md)).

## Voor wie

- **Studenten** die met Claude Code willen oefenen zonder dat de AI het leren overneemt. De meegeleverde kaart is voor **Object-Oriented Design in C#** (HBO-ICT).
- **Junior developers op hun werk** die willen blijven groeien terwijl ze met een AI-agent werken. Je maakt een kaart voor je eigen stack (zie [Een eigen vak](configuration.md#een-eigen-vak)). Taken worden voorlopig alleen met `dotnet test` automatisch vastgelegd vanuit tests; anders meld je ze zelf af.
- **Onderzoekers** die de harnas willen toetsen: zie [Voor onderzoekers](researchers.md).

!!! info "AI-verklaring"
    De leerharnas, het dashboard en deze documentatie zijn gemaakt met hulp van Claude (Anthropic). De leerdata en de reflecties in het dashboard zijn van de student zelf. Zie [AI-verklaring](ai-statement.md).
