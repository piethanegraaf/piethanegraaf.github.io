---
title: "Voor onderzoekers: de leerharnas toetsen in een experiment"
description: Een uitnodiging om de leerharnas voor Claude Code te toetsen in een gerandomiseerd experiment, met hypothesen, groepen, uitkomsten en wat de harnas al vastlegt.
---

# Voor onderzoekers

De leerharnas geeft antwoord op een praktische vraag: hoe blijf je leren programmeren als een AI-agent het werk voor je kan doen? Hij is er voor twee groepen:

- studenten die met Claude Code oefenen;
- junior developers op hun werk die niet junior willen blijven omdat de AI al het werk doet. Dat is het "eeuwige-juniorprobleem" uit [§2.12 van het onderzoek](research.md#212-het-eeuwige-juniorprobleem).

Deze pagina nodigt onderzoekers uit om de harnas te toetsen in een gerandomiseerd gecontroleerd experiment (RCT).

## Wat bekend is, en wat niet

- **Elk onderdeel is onderbouwd.** Elke regel van de harnas volgt een ontwerpprincipe met empirische steun uit de leerwetenschap en uit onderzoek naar automatisering ([§2.11](research.md#211-synthese-ontwerpprincipes)). De steun is het sterkst voor hulp die afneemt naarmate je meer kunt, en voor gespreid oefenen na beheersing.
- **De combinatie is niet getest.** Geen enkele studie heeft deze combinatie getest. Er bestaat nog geen gecontroleerde studie naar hoe mensen leren met agentische tools zoals Claude Code ([§7](research.md#7-beperkingen)). Tot nu toe heeft één student de harnas gebruikt.
- **Een literatuuronderzoek kan dit niet beslissen.** Het onderzoek is narratief, niet systematisch, en geen studie meet de beste mix van oefenen met de hand en uitbesteden aan AI. Alleen een experiment kan laten zien of de afweging werkt.

## De afweging die getest moet worden

1. **Opbouwen:** op L0–L3 schrijft de AI de code van de lerende niet. Hulp komt in kleine treden, en een taak telt pas na een uitleg in eigen woorden.
2. **Uitbesteden:** op L4 (beheerst) doet de AI het werk meteen.
3. **Onderhouden:** met Fibonacci-intervallen doet de lerende een L4-vaardigheid de eerstvolgende keer dat die in echt werk langskomt zelf, zonder AI. Gaat dat mis, dan zakt de vaardigheid.

## Hypothesen

- **H1, leren.** Op een toets zonder AI, minstens acht weken na het laatste oefenen, scoren lerenden met de harnas hoger dan lerenden die Claude Code vrij gebruiken.
- **H2, toezicht.** Lerenden met de harnas vinden meer geplante fouten in code die door AI is geschreven.
- **H3, handhaving.** De harnas werkt beter dan vangrails die alleen in een prompt worden gevraagd, zoals de *Learning* output style van Claude Code. Een tutor sturen via zijn systeemprompt had geen effect in een experiment met 1,059 studenten (Barth et al., 2026).
- **H4, kosten.** Zolang vaardigheden op L1–L3 staan, maken lerenden met de harnas minder taken af. Het verschil verdwijnt naarmate hun vaardigheden L4 bereiken.
- **H5, onderhoud.** L4-vaardigheden met herhalingen zakken minder weg dan L4-vaardigheden zonder. Dat kun je binnen één persoon toetsen, door te loten welke vaardigheden herhalingen krijgen.

## Een mogelijk ontwerp

| Onderdeel | Voorstel |
|---|---|
| **Groepen** | (1) Claude Code zonder beperkingen; (2) Claude Code met alleen een leerprompt (de *Learning* output style); (3) Claude Code met de harnas. Optioneel: (4) geen AI. |
| **Deelnemers** | Studenten in een programmeervak, of junior developers met 0–2 jaar ervaring. Loot per persoon, of per team (cluster) als deelnemers samenwerken, zodat de groepen elkaar minder beïnvloeden. |
| **Duur** | Minstens één vak of ongeveer drie maanden, plus een uitgestelde toets minstens acht weken na het laatste oefenen. |
| **Primaire uitkomst** | Een getimede transfertoets zonder AI op de vaardigheden van de kaart. |
| **Secundaire uitkomsten** | Gevonden geplante fouten in code die door AI is geschreven; afgeronde taken en tijd per taak; kalibratie; tijd tot L4; het percentage overrides en uitvallers, als maat voor hoe aanvaardbaar de frictie is. |
| **Analyse** | Intention to treat. Deelnemers kunnen de hooks uitzetten, dus overrides horen bij de behandeling en zijn geen protocolschending. |
| **Omvang** | Een vergelijking van twee groepen met 80% power bij α = .05 vraagt ongeveer 64 deelnemers per groep bij d = 0.5, en ongeveer 175 per groep bij d = 0.3. In vergelijkbare experimenten lagen de effecten van AI-gebruik op leren rond 0.3 SD (Contractor & Reyes, 2026; Liu et al., 2026). |

Registreer het experiment vooraf, bijvoorbeeld op OSF.

## Wat de harnas al biedt

- **Vastleggen per vaardigheid:** het niveau en de geschiedenis daarvan; taken met de hinttrede, de bron, de uitleg, afwijzingen en correcties; herhalingen; overrides; en de reflecties uit het dagboek. Alles blijft op de eigen computer van de deelnemer, in `.learning/`.
- **Een export met privacyfilters.** `export.mjs` neemt alleen een whitelist van velden mee. Hij filtert e-mailadressen, paden, gebruikersnamen, sessie-ID's en de eigen termen van de deelnemer ([Configuratie en privacy](configuration.md#privacy)). Ruwe events en transcripts gaan nooit mee.
- **Twee talen.** Alle meldingen, regels en skills bestaan in het Nederlands en het Engels.
- **Drie vaardighedenkaarten:** Object-Oriented Design in C# voor studenten, een voorbeeldkaart voor junior developers op het werk in C#/.NET (`junior-dotnet`), waarin code buiten de vaardigheden van de kaart op L4 staat, en een oefenkaart voor veilig programmeren (`security-dotnet`) met acht oefeningen. Die laatste kan een uitkomstmaat leveren: of code veilig is, en of de maker dat terecht denkt (§2.13 van het [onderzoek](research.md)). Een ander vak, of de stack van een team, heeft een eigen of aangepaste kaart nodig ([Een eigen vak](configuration.md#een-eigen-vak)).

## Wat nog ontbreekt

- **Een modus die alleen vastlegt**, voor de controlegroepen. Nu werkt het vastleggen alleen samen met de regels.
- **Testrunners naast `dotnet test`.** Lerenden kunnen een taak ook zelf of in de chat afmelden, maar automatisch vastleggen vanuit tests werkt alleen voor .NET.
- **Gevalideerde drempels.** De getallen (85% gelukt, de intervallen) zijn vuistregels uit de literatuur ([§7](research.md#7-beperkingen)).

## Licentie

- **Code:** AGPL-3.0-only. Je mag de code zonder te vragen gebruiken en aanpassen voor onderzoek. Bied je een aangepaste versie via een netwerk aan anderen aan, dan moet je de broncode daarvan delen.
- **Teksten en data:** CC BY-NC 4.0, vrij voor niet-commercieel gebruik met naamsvermelding.

## Contact

Plan je een studie, of wil je een ontwerp bespreken? Mail naar [hanegraafpiet@gmail.com](mailto:hanegraafpiet@gmail.com), of [open een issue](https://github.com/piethanegraaf/piethanegraaf.github.io/issues/new) op GitHub, met "Research" in de titel.
