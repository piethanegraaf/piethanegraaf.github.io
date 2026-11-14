---
title: "De verschuiving in gevraagde vaardigheden: banen, de economie van handgeschreven code en wat je moet oefenen"
description: "Welke programmeervaardigheden nog lonen nu AI meer code schrijft: bewijs over banen, kosten en kwaliteit, en wat lerenden nog met de hand moeten oefenen."
---
# 2.9 De verschuiving in gevraagde vaardigheden: banen, de economie van handgeschreven code en wat je moet oefenen

!!! warning "Machinevertaling"
    Dit is een machinevertaling door Claude (Anthropic) van het [Engelse origineel](/research/skill-shift/). Een mens heeft de vertaling niet nagekeken. Bij twijfel geldt de Engelse tekst.

AI verandert snel. Het zou dus zonde zijn om oefentijd te besteden aan vaardigheden die economisch niet meer lonen. Maar een basis blijft nodig. Kinderen leren nog steeds rekenen, hoewel rekenmachines al meer dan een eeuw bestaan en nu veel goedkoper zijn dan iemand het minimumloon betalen om de sommen te maken. Die vergelijking is een redenering naar analogie, geen bewijs. Deze pagina gebruikt het bewijs hieronder om uit te zoeken welke programmeervaardigheden bij de basis horen en welke niet meer lonen.

Voor een toets zonder AI is het antwoord eenvoudig: studenten moeten code met de hand schrijven, bijvoorbeeld bij een toets die AI alleen toestaat op AI-niveau 0 of 1 ([hieronder omschreven](#hoe-opleidingen-reageren)) en die een mondelinge verdediging heeft. De loopbaan daarna vraagt een eigen onderbouwing. Deze pagina toetst de bewering dat **code met de hand schrijven niet meer rendabel is**. Ook vraagt ze voor welke vaardigheden werkgevers nu betalen.

Het meeste bewijs komt uit de VS. Waar Nederlandse gegevens bestaan, zijn die toegevoegd. De meeste bronnen zijn werkpapers, overheidsstatistieken of rapporten uit de branche, geen peer-reviewed studies. Elke bron heeft een bewijsgraad van A (het sterkst, zoals gerandomiseerde experimenten met uitkomsten die zonder AI zijn gemeten) tot D (beweringen van bedrijven, berichten in de pers, meningen), zoals omschreven in [§2.0](literature.md#20-afbakening-methode-en-bewijsgraden).

## Hoeveel code AI al schrijft

De cijfers meten verschillende dingen en zijn niet direct te vergelijken.

| Bron | Bewering | Wat er geteld wordt | Bewijsgraad |
|---|---|---|---|
| Google (Pichai, april 2026) | 75% van de nieuwe code, tegen 50% in het najaar van 2025 en 25% in 2024 | "Door AI gegenereerd en goedgekeurd door engineers"; geen definitie gegeven | D |
| Anthropic (mei 2026) | Meer dan 80% van de gemergede code | Regels die naar productie zijn gemerged en die aan Claude zijn toe te schrijven | D (leverancier) |
| Snap (april 2026) | 65% | Niet bekendgemaakt. Het geplande aantal medewerkers werd direct daarna verlaagd | D |
| GitHub Octoverse (oktober 2026) | Agents startten 17% van de pull requests in maart 2026 en meer dan 40% in september | Pull requests waarvan de eerste versie kwam van een agent die GitHub kan herkennen. Een ondergrens, en pull requests, geen regels | C (telemetrie van leverancier) |
| [Daniotti et al. (2026)](https://doi.org/10.1126/science.adz9311), *Science* | Ongeveer 29% van de Python-functies van Amerikaanse ontwikkelaars, eind 2024 | Een classifier op meer dan 30 miljoen openbare GitHub-commits | C (peer-reviewed, onafhankelijk) |
| Sonar-enquête (januari 2026) | Ontwikkelaars schatten het op 42% van hun gecommitte code en verwachten 65% in 2027 | Eigen schatting | C (leverancier) |

Elke maatstaf wijst dezelfde kant op: sterke groei van 2024 tot 2026, met in 2026 een stap van autocomplete naar pull requests die agents opstellen. "Bij AI-gerichte bedrijven stelt AI de meeste nieuwe code op" is aannemelijk. "Overal schrijft AI de meeste code" is niet aangetoond. Elke bedrijfsclaim voegt eraan toe dat engineers de code goedkeuren. Voor elke gemergede regel blijft dus een mens verantwoordelijk.

## Productiviteit: wie wint er, en waarheen het knelpunt verschoof

- **Veldexperimenten met codeaanvulling uit 2022–23** ([Cui et al., 2025](https://www.mertdemirer.com/Papers/Demirer_AI_productivity.pdf)): 4,867 ontwikkelaars bij Microsoft, Accenture en een Fortune-100-bedrijf voltooiden ongeveer 26% meer taken (SE 10.3%). Minder ervaren ontwikkelaars gebruikten het vaker en wonnen meer. Twee co-auteurs werken bij Microsoft. *Bewijsgraad A, werkpaper.*
- **Interne proef van Google** ([Paradis et al., 2024](https://arxiv.org/abs/2410.12944)): ongeveer 21% minder tijd voor één bedrijfstaak, met 96 Google-engineers. *Bewijsgraad B, leverancier.*
- **METR:** ervaren ontwikkelaars waren 19% *trager* in hun eigen volwassen repositories, en het vervolgonderzoek uit 2026 was onbetrouwbaar ([§2.8](literature.md#28-generatieve-ai-en-leren-programmeren-het-bewijs-tot-nu-toe)). *Bewijsgraad A/B.*
- **Gebruik van Cursor** ([He et al., 2026](https://doi.org/10.1145/3793302.3793349); difference-in-differences op GitHub-projecten): een grote maar **tijdelijke** versnelling, alleen significant in de eerste twee maanden. Die ging samen met een **blijvende** stijging van waarschuwingen uit statische analyse (ongeveer +30%) en van codecomplexiteit (ongeveer +41%). Dat vertraagde de projecten later. *Bewijsgraad B.*
- **Soort taak:** winst van ongeveer 35–40% bij eenvoudige greenfield-taken en 10% of minder bij complexe legacy code (Stanford-onderzoek, aangehaald in het ROI-rapport van DORA). *Bewijsgraad C.*
- **Telemetrie van bedrijven over agents** ([Chen & Stratton, 2026](https://fion.ac/jellyfish.pdf); werkpaper van Harvard, versie van 9 november 2026; een versie uit augustus met 718 bedrijven gaf andere cijfers). *Bewijsgraad B, quasi-experimenteel (moment van invoering).* De gegevens komen van Jellyfish, een analyseplatform voor softwareteams: 720,542 medewerkers bij 655 bedrijven, januari 2021 tot augustus 2026. Twaalf maanden na de invoering van AI-agents stegen de regels code met 44.0% en de pull requests met 35.7%, maar het aantal afgehandelde Jira-issues steeg maar met 13.7% (op de grens van significantie). De tijd van het indienen van een review tot de goedkeuring steeg met **56.1%**. Er was geen meetbaar effect op de werkgelegenheid.
- **Code schrijven tegenover software opleveren** ([Demirer, Musolff & Yang, 2026](https://doi.org/10.3386/w35275); NBER-werkpaper, versie van september 2026). *Bewijsgraad B.* Meer dan 500,000 GitHub-ontwikkelaars met telemetrie van hun AI-gebruik: autonome agents verhoogden het aantal commits met 240%, maar het aantal projecten met maar 80% en het aantal releases met 30%.
- **Het knelpunt is verschoven naar review, testen en goedkeuring van wijzigingen.** Chen & Stratton meten dit onafhankelijk (hierboven). Drie leveranciers met verschillende commerciële belangen zijn het eens:
    - Anthropic: "menselijke code review is een nieuw knelpunt geworden".
    - DORA: modelleert een "verificatiebelasting".
    - Sonar: 96% van de ontwikkelaars vertrouwt door AI gegenereerde code niet volledig, maar slechts 48% controleert die altijd voordat ze committen.

## Kwaliteit en beveiliging

- **De benchmark van Veracode** (Veracode verkoopt beveiligingstests): het gemiddelde slagingspercentage voor beveiliging van door AI gegenereerde code was 55–56% tot juli 2026 en 62% in oktober 2026. C# haalde 59.6%; cross-site scripting (18%) en log injection (12.6%) falen nog grotendeels. De syntax is bijna altijd correct. *Bewijsgraad C, benchmark van een leverancier.*
- **GitClear** (verkoopt analyses van ontwikkelaarswerk; correlationeel): gedupliceerde codeblokken stegen met 81% ten opzichte van 2023. Verplaatste code, dus gerefactorde code, daalde van 21% van de wijzigingen (2022) naar 3.8% (2026). *Bewijsgraad C.*
- **CodeRabbit** (verkoopt AI-code-review): ongeveer 1.7 keer zoveel problemen in pull requests waaraan AI meeschreef (470 pull requests). *Bewijsgraad C.*
- **Incidenten in 2025–26:** dit waren vooral agents met te veel rechten die destructieve acties uitvoerden, zoals het wissen van een productiedatabase en de back-ups daarvan, en niet zozeer subtiele bugs. *Bewijsgraad D, secundaire berichten.*

## Kosten

De tool is goedkoop vergeleken met arbeid.

- **Tool:** Anthropic meldt ongeveer $13 per ontwikkelaar per actieve dag ($150–250 per maand) voor Claude Code (leverancier).
- **Arbeid:** het ROI-model van DORA gaat uit van $176,000 per engineer, inclusief alle bijkomende kosten. Dat is ruwweg $800 per werkdag.

De tool kost dus ongeveer 1–2% van de arbeidskosten (eigen berekening van dit overzicht). De economie draait om de menselijke minuten die opgaan aan specificeren, reviewen en herstellen. **Geen enkele studie vergelijkt de totale kosten per opgeleverde feature van gegenereerde en handgeschreven code**, inclusief genereren, review, herstelwerk en incidenten.

## Capaciteit

*Bewijsgraad B/C.*

- **METR (mei 2026):** de beste publiek beschikbare modellen voltooien taken van ongeveer 12 uur in de helft van de gevallen, maar betrouwbaar (80% van de tijd) alleen taken van ongeveer 1.5 uur. METR waarschuwt dat een 50%-horizon van X uur "niet betekent dat we taken van minder dan X uur kunnen delegeren".
- **SWE-bench Verified:** verzadigd en vervuild.
- **SWE-bench Pro:** onafhankelijk gestandaardiseerde topscores liggen rond 60%; scores die leveranciers zelf melden, lopen op tot 89.9%.

## Gebruik en vertrouwen

*Bewijsgraad C.*

- **[Stack Overflow 2026](https://survey.stackoverflow.co/2026/ai)** (meer dan 30,000 respondenten):
    - 66% gebruikt codeerassistenten of agents; het meest voor het genereren van code in bekende gebieden (69.3%).
    - 48% vertrouwt AI alleen als ze de antwoorden makkelijk kunnen controleren, en slechts 6.6% vertrouwt AI met belangrijke beslissingen.
    - Ontwerp (49%) en communicatie (35%) worden het minst nuttig gevonden voor AI.
    - 17.1% vermijdt AI omdat ze bang zijn vaardigheden voor hun werk te verliezen.
- **[JetBrains 2026](https://blog.jetbrains.com/research/2026/08/ai-coding-agent-adoption-2026/):** 90% gebruikt minstens wekelijks agents (leverancier).

## Banen

- **Jonge werknemers in de VS: bewijs voor een AI-effect.** *Bewijsgraad B, quasi-experimentele werkpapers.*
    - **Stanford "Canaries"** (versie van augustus 2026; ADP-salarisgegevens tot juni 2026): de werkgelegenheid van 22–25-jarigen in de beroepen met de meeste blootstelling aan AI ligt 19% lager dan wanneer die gelijk was opgegaan met minder blootgestelde leeftijdsgenoten. Een jaar eerder was dat 15%. Het verschil komt door minder aannemen, niet door ontslagen, en bij oudere werknemers is het er niet. De auteurs noemen het resultaat beschrijvend.
    - **Fed Board** (Crane & Soto, maart 2026): de groei van de werkgelegenheid voor programmeurs ligt sinds ChatGPT ongeveer 3 procentpunt per jaar lager, na correctie voor schokken per sector.
    - **Census** ([Tucker, april 2026](https://www.census.gov/library/working-papers/2026/adrm/CES-WP-26-27.html)): de werkgelegenheid aan het begin van de loopbaan in de meest blootgestelde sectoren daalde met 12% over 10 kwartalen. Monetair beleid verklaart daar hooguit een kwart van.
- **Bewijs tegen AI als oorzaak.** *Bewijsgraad B/C.*
    - In de landelijke ACS-enquête krimpt het Stanford-verschil tot ongeveer −2%, met een betrouwbaarheidsinterval dat nul bevat. Correctie voor opleiding halveert het.
    - De NY Fed schrijft 64% van de stijging van de werkloosheid onder jonge afgestudeerden toe aan thuiswerken (juni 2026).
    - Fairlie & Wu (NBER, september 2026) vinden geen piek in de werkloosheid van pas afgestudeerden in de zomer van 2026.
    - De tracker van het Yale Budget Lab vindt geen duidelijke AI-voetafdruk (september 2026).
    - De Deense studie sluit effecten op inkomen en gewerkte uren van meer dan 2% uit (Humlum & Vestergaard, versie van maart 2026).
    - LinkedIn (eigendom van Microsoft) vindt dat de reële rente het grootste deel van de variatie in het aannemen van software-engineers verklaart.
- **Vacatures.** *Bewijsgraad C.*
    - **Herstel in de VS:** vacatures voor softwareontwikkeling in de VS herstelden. Op 30 oktober 2026 lagen ze 23.8% hoger dan een jaar eerder, maar nog 18% onder februari 2020.
    - **Vooral senior:** in Q1 2026 was slechts 4.5% op instapniveau, 71% van de recente stijging was senior, en 37% van de stijging had "AI" in de functietitel (Indeed, een vacatureplatform).
    - **Europa zwakker:** Duitsland (−14.6% ten opzichte van een jaar eerder, een nieuw dieptepunt in oktober 2026) en Frankrijk (−7.3%).
    - **Nederland:** er bestaat geen Nederlandse reeks.
- **Programmeurs vs. ontwikkelaars (US BLS, augustus 2026).** *Bewijsgraad C, prognose.*
    - **"Computer programmers"** (110,800 banen): verwacht −7% over 2025–35. Als reden wordt genoemd dat AI "repetitieve programmeertaken" automatiseert.
    - **"Software developers"** (1,717,800 banen): +10%, omlaag van +15.8% en +17% in de twee vorige prognoses.

    Code schrijven volgens een specificatie is dus het deel dat naar verwachting geautomatiseerd wordt. Het werk eromheen (eisen, ontwerp, integratie, testen) groeit naar verwachting wel, maar minder dan een jaar eerder voorspeld.

- **Nederland.** *Bewijsgraad C.*
    - **UWV** (Uitvoeringsinstituut Werknemersverzekeringen): de werkgelegenheid in de ICT stijgt nog (589,000 mensen). Maar het aantal ICT-vacatures daalt sinds 2023 (ongeveer 18,900 in Q2 2026), en het aantal WW-uitkeringen in de ICT steeg tot bijna 6,400 in juli 2026, deels door reorganisaties bij banken.
    - **ROA** (het onderzoekscentrum voor de arbeidsmarkt van de Universiteit Maastricht, november 2025): de banengroei in de ICT vertraagt van 2.5% per jaar (2019–2024) naar 0.3% (2025–2030). Voor softwareontwikkelaars zijn er in 2030 "vrijwel geen knelpunten", maar ICT-afgestudeerden met een bachelor hebben "goede" vooruitzichten. ROA zegt dat de prognoses het effect van AI niet meenemen.
    - **Meest directe bewijs voor HBO-ICT** (ICT-opleidingen aan hogescholen): de werkgelegenheid van ICT-afgestudeerden van hbo en wo was tot en met het cohort van 2024 "nauwelijks" negatief ([Cnossen, juli 2026](https://esb.nu/voor-de-meeste-starters-verandert-ai-de-arbeidsmarkt-nog-niet/); microdata van het CBS; correlationeel).
    - **Omstreden:** de −13% van RaboResearch voor jonge werknemers in banen met veel AI-blootstelling wordt betwist door economen die wijzen op monetaire verkrapping ([Salomons & van den Berge, 2026](https://esb.nu/niet-zeker-dat-werkgelegenheid-onder-nederlandse-jongeren-daalt-door-genai/)).
- **Loonpremies.** *Bewijsgraad C.*
    - **Cijfers van verkopers:** [PwC (2026)](references.md#ref-pwc-2026) meldt een premie van 62% voor AI-vaardigheden en Lightcast 28%. Beide verkopen AI- of arbeidsmarktdiensten, en beide cijfers zijn correlationeel.
    - **Onafhankelijke loongegevens:** die wijzen op ervaring en oordeelsvermogen als wat het loon beschermt. Blootstelling aan AI remt de loongroei alleen waar de ervaringspremie laag is ([Dallas Fed, 2026](https://www.dallasfed.org/research/economics/2026/0224)).
    - **De eigen bevinding van PwC:** instapfuncties met AI-blootstelling vragen zeven keer zo vaak om senior "mensintensieve" vaardigheden.

## Wat werkgevers van junioren vragen

*Bewijsgraad D, persberichten over interne memo's.*

- **Verwachting:** werkgevers gingen van AI toestaan naar AI verwachten. Shopify, Microsoft en Coinbase deden dat in 2025, en Meta en JPMorgan koppelden het aan beoordelingsgesprekken.
- **Gebruikscijfers misleiden:** in september 2026 haalde Meta het aantal tokens uit de beoordelingen, nadat medewerkers hun gebruik kunstmatig hadden opgeblazen.
- **AI in sollicitatiegesprekken:** Google test vanaf de tweede helft van 2026 een gespreksronde voor junior- en mediorfuncties. Kandidaten gebruiken Gemini om **een bestaande codebase te lezen, te debuggen en te verbeteren**. Ze worden beoordeeld op het valideren van uitvoer en op debuggen.
- **AI-verboden:** andere bedrijven verbieden AI nog in sommige rondes; Anysphere, de maker van Cursor, doet dat in de eerste programmeerronde.

## Hoe opleidingen reageren

- **CS1-LLM van UC San Diego** (556 studenten): hier kwamen prompten, tracen, uitleggen, testen en debuggen in de plaats van code vanaf nul schrijven, maar de meeste toetsen bleven zonder AI. De toetsscores waren vergelijkbaar met een internationale benchmark en 11% hoger bij het uitleggen van code in gewone taal. Er was geen gerandomiseerde controlegroep.
- **Npuls** (mei 2025), de Nederlandse landelijke handreiking, kiest voor de **tweesporenaanpak**:
    - "Spoor 1" borgt de belangrijkste leeruitkomsten op momenten met toezicht, zonder AI.
    - "Spoor 2" staat AI toe of vereist het zelfs, en vraagt studenten te laten zien hoe ze het gebruikten.
    - "Studenten moeten uiteindelijk hun beroep zonder AI kunnen uitoefenen waar dat nodig is."
- **De Green Paper van de University of Sydney** (augustus 2026) vereist basisvaardigheden vóór taken met AI-ondersteuning en "mogelijkheden om te presteren onafhankelijk van AI".
- **Regels van instellingen** vertalen dit naar AI-niveaus. De regels van CHE, een Nederlandse hogeschool ([OER 2026](https://che.nl/algemeen/oer)–27, ICT, art. 7.11), zijn een voorbeeld, en dit overzicht gebruikt hun drie niveaus:
    - **AI-niveau 0:** geen AI, in een gecontroleerde omgeving.
    - **AI-niveau 1:** AI als hulpmiddel voor ideeën of structuur.
    - **AI-niveau 2:** AI ingebouwd in de taak.

    Op AI-niveau 1 en 2 moeten studenten verantwoording afleggen over hun gebruik, hun prompts linken, in APA citeren en de uitvoer controleren op juistheid en relevantie.

## Oordeel over "code met de hand schrijven is niet meer rendabel"

| Bewering | Bewijs | Oordeel |
|---|---|---|
| Voor routinematige, goed gespecificeerde code op het werk is met de hand schrijven niet meer de goedkoopste manier | Tool kost ongeveer 1–2% van de arbeidskosten; bij AI-gerichte bedrijven stelt AI de meeste nieuwe code op; winst het grootst bij eenvoudige greenfield-taken; BLS verwacht dat banen voor programmeurs krimpen | **Grotendeels ondersteund** (bewijsgraad B–D, veel bronnen van leveranciers) |
| Met de hand code schrijven heeft geen economische waarde meer | Winst klein of negatief bij complexe legacy code; AI-code heeft meer problemen met beveiliging en onderhoudbaarheid; review is het knelpunt (onafhankelijk gemeten door Chen & Stratton); incidenten vragen menselijk oordeel | **Niet ondersteund** |
| Junioren worden door AI minder vaak aangenomen | Verschil in de VS voor jonge werknemers in blootgestelde banen (−19% in ADP-gegevens) tegenover bijna nul in de ACS; thuiswerken en rente verklaren veel; Nederlandse gegevens tonen afkoeling, geen ineenstorting | **Omstreden.** Richting aannemelijk, omvang onbekend |
| Werkgevers betalen voor het controleren en beoordelen van AI-uitvoer | Vormen van sollicitatiegesprekken (Google); alleen vertrouwen als het te controleren is (Stack Overflow); "goedgekeurd door engineers" in elke claim; de bevinding van PwC over instapfuncties; de ervaringspremie van de Dallas Fed | **Consistent over bronnen heen**, maar geen studie meet wat specifieke reviewvaardigheden opleveren |
| Met de hand oefenen is nog steeds hoe lerenden de vaardigheden opbouwen om AI te controleren | Shen & Tamkin (achterstand bij debuggen); Gardella (onthouden); Yu & Moon (productieve worsteling); CS1-LLM houdt toetsen zonder AI | **Ondersteund voor leren** (bewijsgraad A–C). Geen studie geeft de beste mix |

## Wat te oefenen

De economische bewering en de bewering over leren gaan over verschillende dingen:

- **Als manier om code te produceren** wordt met de hand schrijven minder rendabel.
- **Als manier om vaardigheid op te bouwen** is het nog steeds de belangrijkste route naar het lezen, het debuggen en het ontwerpoordeel waardoor AI-uitvoer veilig te accepteren is. De sollicitatievormen van 2026 testen precies die vaardigheden, en delegeren holt ze het meest uit ([§2.8](literature.md#28-generatieve-ai-en-leren-programmeren-het-bewijs-tot-nu-toe), [§2.10](literature.md#210-automatisering-uitbesteden-overmatige-afhankelijkheid-en-vaardigheidsverlies)).

De verschuiving pleit dus voor het **toevoegen** van bewuste oefening in vaardigheden voor het AI-tijdperk. Ze pleit niet voor stoppen met oefenen met de hand voordat een vaardigheid geleerd is. De niveaus hieronder zijn die van de [autonomieladder](design.md#52-de-autonomieladder-per-vaardigheid) van de leerharnas: op L3 schrijft de lerende de code alleen en reviewt de AI die daarna; op L4 schrijft de AI de code en reviewt de lerende die.

1. **Met de hand blijven oefenen tot een vaardigheid L3 bereikt:** de kern van OOD en C# (klassen en toestand, inkapseling, overerving en interfaces, de ontwerppatronen). Een toets zonder AI test ze, en ze zijn de basis om AI-code te beoordelen. AI is ook het zwakst in interfaces, abstracte klassen en overerving ([Lepp & Kaimre, 2026](https://arxiv.org/abs/2608.16318)).
2. **Een nieuwe leerlijn toevoegen voor toezicht op AI:**
    - door AI gegenereerde code lezen en reviewen;
    - een geplante bug vinden;
    - tests schrijven die fouten van AI zouden vangen;
    - een taak zo precies specificeren dat een agent ermee aan de slag kan;
    - voorspellen wat de AI zal maken en dat vergelijken;
    - AI-code controleren op veelvoorkomende beveiligingsfouten, zoals ontbrekende invoervalidatie en injectie.

    Dit werkt alleen bij onderwerpen die de lerende al met de hand kan schrijven, zodat de uitvoer te beoordelen is.

3. **Delegeren wat al op L4 staat:** tooling, projectopzet en boilerplate die de lerende beheerst.

## Het verband met de risico's

De [risicoanalyse](risks.md#risks) geeft de risico's van oefenen met een AI-assistent een score. Het bewijs op deze pagina raakt vooral aan vijf daarvan:

- **R15 Te veel investeren in productiecode met de hand schrijven.** De eerste rij van het oordeel ondersteunt dit risico voor routinecode: die genereren kost ongeveer 1–2% van de arbeidskosten, en de BLS verwacht dat banen voor programmeurs krimpen. De laatste rij beperkt het: oefenen met de hand bouwt nog steeds de vaardigheden op om AI te controleren.
- **R16 Toezichtvaardigheden blijven ongetraind.** Hier is het bewijs het meest consistent van de hele pagina: review is het gemeten knelpunt (de tijd tot goedkeuring steeg met 56.1% bij Chen & Stratton), de pilot van Google met sollicitatiegesprekken beoordeelt valideren en debuggen, en ontwikkelaars vertrouwen AI vooral als ze het kunnen controleren. [§4.1](risks.md#41-oefening-opnieuw-verdelen-voorgestelde-wijzigingen-in-het-vaardighedenregister-jij-beslist) stelt voor hoe de leerharnas deze vaardigheden kan trainen.
- **R17 Onzekerheid over het loopbaanpad.** Het bewijs over banen is omstreden: een verschil van 19% voor jonge Amerikaanse werknemers in blootgestelde banen in salarisgegevens, bijna nul in de ACS-enquête, en in Nederland afkoeling in plaats van ineenstorting. In Q1 2026 was slechts 4.5% van de Amerikaanse vacatures op instapniveau. De richting is aannemelijk; het effect op een individuele student is onzeker.
- **R18 Beslissingen gestuurd door claims van leveranciers of door hype.** Veel cijfers op deze pagina komen van verkopers: claims over het aandeel code met bewijsgraad D, benchmarkscores van leveranciers tot 89.9% tegenover ongeveer 60% bij onafhankelijke standaardisering, en loonpremies van 62% en 28% van bedrijven die AI- of arbeidsmarktdiensten verkopen. De risicoanalyse raadt aan te handelen op bewijs van graad A/B, C te zien als een signaal en D als een bewering.
- **R8 Beheerste vaardigheden nemen af na automatisering.** De derde oefenregel draagt beheerste vaardigheden over aan de AI. Zodra de AI die code schrijft, worden de vaardigheden om die code te reviewen niet meer geoefend, tenzij iets ze vers houdt. Het bewijs over dat verval zelf staat in [§2.10](literature.md#210-automatisering-uitbesteden-overmatige-afhankelijkheid-en-vaardigheidsverlies). In de enquête van Stack Overflow vermijdt 17.1% van de ontwikkelaars AI omdat ze bang zijn vaardigheden voor hun werk te verliezen.

De homepage stelt de korte vorm van de vraag van deze pagina in een [poll](../index.md#poll): is leren om code te beoordelen (reviewen, testen, debuggen, ontwerpen) nog de tijd waard, of neemt AI dat binnen een jaar ook over? Geen enkele bron op deze pagina meet of AI review binnen een jaar overneemt. Lezers kunnen het bewijs hierboven afwegen, stemmen, en hun antwoord vergelijken met wat andere bezoekers kozen.
