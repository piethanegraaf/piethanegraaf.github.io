---
title: "Leerharnas voor Claude Code: leer zelf programmeren met AI"
description: "Gratis Claude Code-opzet voor studenten: hooks voorkomen dat de AI je oefencode schrijft, hints komen in stappen en een dashboard volgt je vaardigheden."
---
# Leerharnas

Een leerharnas voor [Claude Code](https://docs.claude.com/en/docs/claude-code/overview) die zorgt dat je **zelf** leert programmeren, ook als er een AI meekijkt.
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

!!! info "AI-verklaring"
    De leerharnas, het dashboard en deze documentatie zijn gemaakt met hulp van Claude (Anthropic). De leerdata en de reflecties in het dashboard zijn van de student zelf. Zie [AI-verklaring](ai-statement.md).
