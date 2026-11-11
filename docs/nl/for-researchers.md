---
title: "Voor onderzoekers: begrensde AI-hulp testen"
description: "Welke vraag de leerharnas toetsbaar maakt, wat hij vastlegt en exporteert, wat een studie nodig zou hebben, en hoe je contact opneemt over een onderzoek."
---
# Voor onderzoekers

De leerharnas maakt één open vraag toetsbaar in een echt vak: beschermt AI-hulp die begrensd is en in stappen komt het leren beter dan onbeperkte AI-hulp? Deze pagina nodigt onderzoekers en vakteams uit om dat te testen.

## De vraag die hij toetsbaar maakt

Onbeperkte AI verhoogt de scores tijdens het oefenen, maar kan verlagen wat studenten daarna zonder AI kunnen ([§1 van het literatuuronderzoek](research.md#1-samenvatting)). Grenzen lijken te werken als ze in de werkwijze worden afgedwongen, en veel minder als er alleen in een prompt om wordt gevraagd: een tutor via zijn systeemprompt vragen om te scaffolden veranderde niets in een studie met 1.059 studenten (Barth et al., 2026). Er is nog geen gecontroleerde studie naar agentische tools zoals Claude Code.

De harnas dwingt de begrenzing af buiten het model, met hooks van Claude Code, dus de conditie hangt niet af van een model dat instructies opvolgt. De sectie [Evaluatie](research.md#6-evaluatie) van het onderzoek noemt uitkomstmaten, en de sectie [Beperkingen](research.md#7-beperkingen) noemt wat nog onbekend is.

## Wat de harnas vastlegt

Tijdens het oefenen houdt de harnas per student lokaal bij: niveaus per vaardigheid, elke taak met de trede hulp die nodig was, de uitleg van de student, overrides en een dagboek. De export (`harness/export.mjs`, schema 1) maakt daar één JSON-bestand van, met alleen velden van een whitelist:

- het niveau van elke vaardigheid en microvaardigheid, en de geschiedenis daarvan;
- per taak: de trede hulp, de bron (test, zelf gelogd, chat), de uitleg, en of die werd afgewezen, gecorrigeerd of overgeslagen;
- herhalingen, regressies, overrides en signalen voor doorstromen;
- activiteit per dag;
- uit het dagboek: het plan, het vertrouwen vooraf, wat goed ging, de reflectie en de kalibratie.

Ruwe events, sessie-id's, transcripts, bestandspaden en testruns verlaten het project van de student nooit. Elke vrije tekst gaat door filters voor e-mailadressen, paden, gebruikersnamen, sessie-id's en de eigen lijst met privétermen van de student, en met `--dry-run` ziet de student wat er weggefilterd zou worden. Daarmee is de export een degelijke basis voor onderzoeksdata. Een studie heeft nog wel een eigen toestemming en een eigen data-overeenkomst nodig.

## Wat een studie nodig zou hebben

Dit zijn open ontwerpvragen, geen kant-en-klaar protocol:

- **Condities:** de harnas, onbeperkt Claude Code, en geen AI.
- **Uitkomsten:** transfertoetsen zonder hulp bij de start, na ongeveer een maand en voor het tentamen, plus retentie na een aantal weken.
- **Setting:** een cohort van een vak, ethische goedkeuring, geïnformeerde toestemming, en een AVG-proof omgang met de geëxporteerde data.
- **Trouw aan de interventie:** studenten kunnen de harnas uitzetten, dus de log met overrides en de export laten zien hoe hij werkelijk is gebruikt.

## Wat er wordt aangeboden

- De harnas zelf: open source (AGPL-3.0-only) en per vak in te stellen met een kaart met vaardigheden.
- Een uitgewerkte kaart met vaardigheden voor Object-Oriented Design in C#.
- Hulp bij het opzetten en aanpassen voor een studie.

## Contact

We zoeken onderwijsonderzoekers en vakteams die begrensde AI-hulp in een programmeervak willen testen. [Open een issue op GitHub](https://github.com/piethanegraaf/piethanegraaf.github.io/issues/new) om contact op te nemen.
