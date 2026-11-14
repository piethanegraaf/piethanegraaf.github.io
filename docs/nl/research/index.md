---
title: "Leren programmeren met AI: literatuuronderzoek (2026)"
jsonld: article
date_published: "2026-11-07"
keywords: ["generatieve AI", "leren programmeren", "wenselijke moeilijkheden", "vaardigheidsverlies", "never-skilling", "informaticaonderwijs", "Claude Code", "veilig programmeren"]
description: "AI die tijdens het oefenen voor je denkt, verlaagt wat je daarna zonder AI kunt; AI als tutor niet. Een review uit 2026, en een uitnodiging om het te testen."
---
# Leren programmeren (en OOD) met AI: literatuuronderzoek, risicoanalyse en een Claude Code-opzet die het leren beschermt

**Piet Hanegraaf, met Claude (Anthropic)** · [Over de maker](../about.md) · [Zo citeer je dit](#cite)

!!! warning "Machinevertaling"
    Dit is een machinevertaling door Claude (Anthropic) van het [Engelse origineel](/research/). Een mens heeft de vertaling niet nagekeken. Bij twijfel geldt de Engelse tekst.

*Voor studenten die programmeren en Object-Oriented Design (OOD) leren met AI, voor junior developers op hun werk, en voor de docenten en onderzoekers die met hen werken. Versie van 14 november 2026; wat er wanneer is veranderd, staat in het [wijzigingslog](build-log.md#changelog).*

**In het kort:** als je AI het denkwerk laat doen terwijl je oefent, kun je daarna minder zonder AI. AI die uitlegt, vragen stelt of hints geeft, schaadt niet, en helpt soms. Dit onderzoek verzamelt het bewijs daarvoor, schat de risico's in en beschrijft een opzet voor Claude Code die daarop voortbouwt. Of die opzet werkt, is nog niet getest, en dat is de belangrijkste reden dat deze pagina bestaat: ze vraagt docenten en onderzoekers om [mee te helpen testen](#help-test-it).

---

## Belangrijkste bevindingen {#key-findings}

1. **AI die tijdens het oefenen voor je denkt, verlaagt wat je daarna zonder AI kunt.** Onbeperkt GPT-4 verhoogde de oefenscores met 48%, maar verlaagde de examenscores met 17% toen de toegang wegviel ([Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122)). Een AI-tutor die vooral directe antwoorden gaf, verlaagde de eindcijfers met 0,37 SD in een studie met 2.379 studenten ([Liu et al., 2026](https://doi.org/10.26300/y3f8-vh05), working paper). Zie [§1](#summary).
2. **Bij programmeren onthielden studenten minder na oefenen met AI.** Copilot verhoogde de scores tijdens de sessie, maar een week later onthielden studenten minder ([Gardella et al., 2026](https://arxiv.org/abs/2604.18538)). De groep die zonder AI programmeerde en debugde, onthield na zeven weken meer ([Albadarin, 2026](https://phys.org/news/2026-11-qa-exploring-generative-ai-impact.html), proefschrift).
3. **AI als tutor kan helpen.** In een gesurveilleerde studie verhoogde toegang tot ChatGPT de toetsscores zonder AI met 0,28 SD, vooral bij studenten die het als tutor gebruikten ([Contractor & Reyes, 2026](https://arxiv.org/abs/2607.08849), working paper).
4. **Ontwikkelaars die met AI een nieuwe library leerden, leerden minder en waren niet sneller.** Ze scoorden 50% tegen 67% op een quiz achteraf, met het grootste verschil bij debuggen ([Shen & Tamkin, 2026](https://arxiv.org/abs/2601.20245), preprint).
5. **Grenzen werken als ze worden afgedwongen, niet als erom wordt gevraagd.** Een tutor via zijn systeemprompt vragen om te scaffolden veranderde niets in een studie met 1.059 studenten ([Barth et al., 2026](https://doi.org/10.1145/3765964.3811656)). Grenzen die in de werkwijze zijn ingebouwd, deden het beter.
6. **Gepoolde positieve effecten zijn vooral publicatiebias.** De strengste meta-analyse uit 2026 laat g = 0,84 na correctie krimpen tot 0,08 ([Boolzen et al., 2026](https://doi.org/10.1007/s10462-026-11665-9)), en een audit van 14 positieve meta-analyses vond onmogelijke statistiek en verzonnen bronnen ([O'Neill, 2026](https://hechingerreport.org/proof-points-ai-education-meta-analysis/), preprint).
7. **De verschuiving in vaardigheden is echt, maar blijf zelf code schrijven zolang je leert.** Het knelpunt is verschoven naar reviewen en testen ([Chen & Stratton, 2026](https://fion.ac/jellyfish.pdf)), en oefenen met de hand bouwt juist die toezichtsvaardigheden op. Zie [de verschuiving in gevraagde vaardigheden](skill-shift.md) en [§2.10](literature.md#210-automatisering-uitbesteden-overmatige-afhankelijkheid-en-vaardigheidsverlies).
8. **Juniors op het werk lopen hetzelfde risico: het eeuwige-juniorprobleem.** Korte experimenten laten het mechanisme zien en interviews beschrijven het patroon, maar geen studie heeft juniors op het werk nog over langere tijd gevolgd. Zie [§2.12](literature.md#212-het-eeuwige-juniorprobleem).

## Wat dit voor jou betekent {#for-you}

Leer je programmeren, tijdens je opleiding of in je eerste baan, dan wijst het bewijs op één afweging:

1. **Bouw een vaardigheid eerst met de hand op.** Schrijf de code zelf en gebruik de AI om uit te leggen, vragen te stellen en hints te geven, niet om de oplossing te schrijven.
2. **Besteed die uit zodra je die beheerst.** Dan mag de AI dat soort code voor je schrijven, en jij reviewt die.
3. **Houd die bij.** Doe het af en toe weer met de hand, zodat je het werk van de AI nog kunt controleren en het kunt overnemen als de AI faalt.

Elke stap rust op een principe met empirische steun; hoe sterk die steun per keuze is, staat op de [ontwerppagina](design.md#211-synthese-ontwerpprincipes). Dit in je eentje volhouden vraagt discipline, zeker vlak voor een deadline. De leerharnas voor Claude Code dwingt het af met hooks die je zelf aanzet: [hoe het werkt](../how-it-works.md), en de pagina's [voor junior developers](../for-juniors.md) en [voor docenten](../for-educators.md).

## Help mee testen {#help-test-it}

Nog geen studie heeft deze combinatie getest, niet bij studenten en niet bij juniors op het werk. Een literatuuronderzoek kan niet beslissen of ze werkt. Daarvoor zijn mensen nodig die lesgeven en mensen die onderzoek doen.

- **Geef je les in programmeren,** dan kun je de leerharnas zoals hij is in een vak gebruiken: hij is gratis en open source, hij is bedoeld om mee te oefenen, en je toetsen blijven onder je eigen voorwaarden. [Voor docenten](../for-educators.md) legt uit wat hij afdwingt, wat hij niet kan, en hoe hij past bij de AI-regels van een vak.
- **Doe je onderzoek naar informaticaonderwijs of leerwetenschap,** dan zou een gerandomiseerd experiment de open vraag beantwoorden. [Voor onderzoekers](../researchers.md) stelt er een voor: drie groepen (geen beperkingen, alleen een leerprompt, de harnas), een uitgestelde transfertoets zonder AI als primaire uitkomst, en de logs die de harnas al bijhoudt. De opzet in het kort staat in [§6.1](#61-uitnodiging-aan-onderzoekers-een-gerandomiseerd-experiment).

Wat nog niet bekend is, staat bij de [beperkingen](#limitations).

## Lees het hele onderzoek {#contents}

Het onderzoek staat verdeeld over een aantal pagina's. Dit overzicht is voor iedereen; de pagina's hieronder zijn voor lezers die het bewijs en het ontwerp willen controleren.

- [Literatuuronderzoek](literature.md) (§2): wat onderzoek laat zien over leren programmeren, met en zonder AI, met een bewijsgraad per studie.
- [De verschuiving in gevraagde vaardigheden](skill-shift.md) (§2.9): banen, de economie van handgeschreven code, en welke vaardigheden nog de moeite waard zijn om met de hand te oefenen.
- [Risicoanalyse en maatregelen](risks.md) (§3–4): achttien risico's, elk met een score, en wat ze kleiner maakt.
- [Ontwerp: principes en inrichting van Claude Code](design.md) (§2.11, §5 en de bijlage): de ontwerpkeuzes, elk met een label: sterk bewijs, beperkt bewijs of een pragmatische keuze.
- [Bouwlog](build-log.md) (§10–11): wat de eerste sessies lieten zien, wat er is veranderd, en het wijzigingslog.
- [Literatuurlijst](references.md) (§8).

Deze pagina bevat de belangrijkste bevindingen, de samenvatting (§1), de evaluatie (§6), de beperkingen (§7) en hoe je het onderzoek citeert.

---

<a id="1-samenvatting"></a>

## 1. Samenvatting {#summary}

**De literatuur laat niet zien dat AI op zichzelf het leren schaadt. Als je AI het denkwerk laat doen tijdens het oefenen, kun je daarna minder zonder AI. AI die uitlegt of als tutor begeleidt, schaadt niet of helpt een beetje.** Het sterkste bewijs:

- **Presteren met AI is geen leren.**
    - **Wiskunde op de middelbare school:** onbeperkte GPT-4 verhoogde de oefenscores met 48%, maar verlaagde de toetsscores met **17%** zodra de toegang was weggehaald. Een tutor die hints gaf en geen antwoorden, voorkwam die schade ([Bastani et al., 2025](https://doi.org/10.1073/pnas.2422633122)).
    - **Universitaire cursus:** in een experiment uit 2026 met 2,379 studenten verlaagde een AI-tutor die vooral voor directe antwoorden werd gebruikt, de eindcijfers met 0.37 SD binnen dezelfde cursus ([Liu et al., 2026](https://doi.org/10.26300/y3f8-vh05), working paper).
    - **Programmeren:** in een kleine studie verhoogde Copilot de scores tijdens de sessie, maar een week later hadden studenten minder onthouden ([Gardella et al., 2026](https://arxiv.org/abs/2604.18538)). In een quasi-experiment met 152 studenten onthield de groep die zonder AI programmeerde en debugde na zeven weken meer ([Albadarin, 2026](https://phys.org/news/2026-11-qa-exploring-generative-ai-impact.html), proefschrift).
- **AI kan ook helpen.** In een experiment onder toezicht verhoogde toegang tot ChatGPT de toetsscores zonder AI met 0.28 SD, vooral bij studenten die het als tutor gebruikten ([Contractor & Reyes, 2026](https://arxiv.org/abs/2607.08849), working paper). Doorslaggevend is of de AI jouw denken vervangt of ondersteunt ([Boolzen et al., 2026](https://doi.org/10.1007/s10462-026-11665-9)).
- **Ontwikkelaars die een nieuwe library leerden** met een AI-assistent, scoorden 50% tegenover 67% op een quiz achteraf, met het grootste verschil bij debuggen. Ze waren niet significant sneller ([Shen & Tamkin, 2026](https://arxiv.org/abs/2601.20245), preprint).
- **Afgedwongen vangrails werken beter dan gevraagde.** Een tutor in zijn systeemprompt opdragen om scaffolding (ondersteuning) te bieden, veranderde niets in een experiment met 1,059 studenten ([Barth et al., 2026](https://doi.org/10.1145/3765964.3811656)). Poorten die in de werkwijze zijn ingebouwd, deden het beter: beheersingsregels, uitlegpoorten, blokkades buiten het model. Dat is het argument voor hooks in plaats van een prompt voor een "leermodus".
- **Gepoolde positieve effecten zijn vooral publicatiebias.** De strengste meta-analyse uit 2026 laat g = 0.84 na correctie krimpen tot 0.08, en de meest geciteerde meta-analyse uit 2025 is ingetrokken. Een onafhankelijke audit van 14 positieve meta-analyses vond onmogelijke statistiek en verzonnen referenties ([O'Neill, 2026](https://hechingerreport.org/proof-points-ai-education-meta-analysis/), preprint).
- **Zwakker dan vaak wordt beweerd:**
    - dat bepaalde interactiepatronen beter leren *veroorzaken*: in elke studie tot nu toe kozen studenten hun eigen patroon;
    - dat LLM's de kloof tussen sterke en zwakke studenten groter maken: dit berust op een verkennende analyse;
    - dat de "85%-regel" voor mensen geldt: die is alleen in simulaties aangetoond;
    - dat groeiende intervallen tussen herhalingen beter werken dan gelijke: dat doen ze niet betrouwbaar;
    - het "Google-effect": het eerste experiment ervan is twee keer niet gerepliceerd.

**De verschuiving in vaardigheden is echt, maar het is geen reden om te stoppen met code met de hand schrijven terwijl je het nog leert ([§2.9](skill-shift.md)).**

- **Voor de verschuiving:**
    - bij bedrijven die voorop lopen met AI, stelt AI nu de meeste nieuwe code op;
    - de tool kost ongeveer 1–2% van de loonkosten van een ontwikkelaar;
    - Amerikaanse prognoses verwachten dat banen als "programmeur" krimpen, en dat banen als "ontwikkelaar" langzamer groeien dan eerder voorspeld.

    Voor routinematige, goed gespecificeerde code op het werk is met de hand schrijven niet meer de goedkoopste manier.

- **Tegen het schrappen van oefenen met de hand:**
    - het knelpunt is verschoven naar reviewen en testen, en een studie bij 655 bedrijven heeft dat nu onafhankelijk gemeten ([Chen & Stratton, 2026](https://fion.ac/jellyfish.pdf));
    - AI-code zakt nog steeds voor meer dan een derde van de beveiligingscontroles;
    - in de VS wordt minder aangenomen op instapniveau, maar hoeveel daarvan door AI komt, staat ter discussie;
    - nieuwe vormen van sollicitatiegesprekken toetsen lezen, debuggen en het controleren van AI-uitvoer.

    Oefenen met de hand bouwt juist die toezichtsvaardigheden op, en delegeren tast ze het meest aan ([§2.10](literature.md#210-automatisering-uitbesteden-overmatige-afhankelijkheid-en-vaardigheidsverlies)).

Het bewijs pleit dus voor het **toevoegen** van doelbewust oefenen met vaardigheden uit het AI-tijdperk (reviewen, testen, specificeren, verifiëren) bovenop fundamenten die je met de hand schrijft, niet voor het vervangen daarvan. Het past ook bij opleidingen die het eindassessment op AI-niveau 0/1 houden. Dat sluit aan bij de Nederlandse consensus over twee sporen (Npuls); het is geen uitzondering.

**Twee horizonnen.** Tot je toets is het doel bekwaamheid zonder AI onder de omstandigheden van je toets. Dat betekent: getimed oefenen, zonder AI, in de omgeving van je toets ([§2.6](literature.md#26-oefenomstandigheden-en-transfer-naar-de-toets)). Na de toets, en voor je werk na je studie, volgt het doel de verschuiving in benodigde vaardigheden: de toezichtskant van werken met AI, zoals specificeren, testen en reviewen van AI-uitvoer ([§2.9](skill-shift.md)). Het [risicoregister](risks.md#risks) (§3) dekt beide horizonnen, ook de risico's van te veel en te weinig investeren in code met de hand schrijven.

!!! example "Voorbeeld: de situatie van één student"
    Dit literatuuronderzoek is eerst geschreven voor een tweedejaars student HBO-ICT. De OOD-toets van die student bij CHE was getimed, op AI-niveau 0/1, en viel ongeveer tien weken na het schrijven van het onderzoek. Voor die student liep de eerste horizon tot die toetsdatum. Daarna kon de aandacht breder worden, naar de toezichtsvaardigheden uit §2.9.

**Junior developers op hun werk.** Het risico houdt niet op bij de toets. Een junior die het werk aan een agent overlaat voordat het zelf lukt, krijgt het werk wel af, maar slaat het oefenen over waardoor een junior medior of senior wordt. Dit onderzoek noemt dat het **eeuwige-juniorprobleem** ([§2.12](literature.md#212-het-eeuwige-juniorprobleem)). Experimenten laten het mechanisme op korte termijn zien, en interviews in softwareteams beschrijven het patroon. Ontwikkelaars waarschuwen ervoor in talks en blogs (bewijsgraad D). Nog geen enkele studie heeft juniors op hun werk over langere tijd gevolgd, en AI kan mensen op het werk ook helpen leren.

De fundamenten uit de leerwetenschap sluiten hierop aan:

- **Inspanning:** leren hangt af van inspannend zelf genereren en ophalen ([Bjork, 1994](https://doi.org/10.7551/mitpress/4561.003.0011); [Roediger & Karpicke, 2006](https://doi.org/10.1111/j.1467-9280.2006.01693.x)).
- **Expertise:** de juiste hoeveelheid hulp verandert met je expertise ([Kalyuga et al., 2003](https://doi.org/10.1207/s15326985ep3801_4)).
- **Afbouwen:** scaffolding moet worden **afgebouwd** ([Renkl & Atkinson, 2003](https://doi.org/10.1207/s15326985ep3801_3); [Wood, Bruner & Ross, 1976](https://doi.org/10.1111/j.1469-7610.1976.tb00381.x)).
- **Moeilijkheid:** oefenen moet zo moeilijk zijn dat je soms faalt.
- **Verval:** vaardigheden die je beheerst, **zakken weg**, tenzij ze met gespreide tussenpozen worden versterkt ([Arthur et al., 1998](https://doi.org/10.1207/s15327043hup1101_3); [Cepeda et al., 2006](https://doi.org/10.1037/0033-2909.132.3.354)).
- **Transfer:** oefenen leidt tot de beste transfer als het past bij de omstandigheden van de toets ([Morris, Bransford & Franks, 1977](https://doi.org/10.1016/S0022-5371%2877%2980016-9)).

**De opzet:** een Claude Code-opzet waarin elke vaardigheid vijf **leerfasen** doorloopt ([§5.2](design.md#52-leerfasen-per-vaardigheid)). De fasen lopen van *AI doet voor*, via *ik vul aan*, *ik schrijf met hints* en *ik schrijf zelfstandig*, naar *beheerst → AI automatiseert*. Ze eindigen met gespreide controles voor "onderhoud", die de vaardigheid weer kunnen terugzetten. Drie onderdelen van de infrastructuur dwingen dit af:

1. Een **vaardighedenregister** (`skills.json`) dat per vaardigheid het niveau, het bewijs en de volgende herhalingsdatum bijhoudt.
2. Een **AI-dagboek**: één notitie per sessie, met feiten die de AI vastlegt en reflectie die jij schrijft.
3. **Hooks** die tutorregels voor het juiste niveau toevoegen, de AI tegenhouden als die code wil schrijven die jij nog zelf hoort te schrijven, herhalingen inplannen en tot reflectie aanzetten.

De hooks zijn een **zelfbindingsmechanisme** (commitment device) dat je zelf kiest, geen gevangenis: een ontwerpkeuze, geen bevinding. Je kunt er bewust uitstappen, en dat uitstappen wordt gelogd.

**De afweging in één zin:** bouw een vaardigheid eerst met de hand op, besteed die uit aan de AI zodra je die beheerst, en onderhoud die af en toe door het weer met de hand te doen. Elk onderdeel volgt een principe met empirische steun ([§2.11](design.md#211-synthese-ontwerpprincipes)). Of de combinatie werkt, voor studenten of voor juniors op hun werk, is niet getest. Een literatuuronderzoek kan dat niet beslissen, dus [§6.1](#61-uitnodiging-aan-onderzoekers-een-gerandomiseerd-experiment) nodigt onderzoekers uit om het te toetsen in een gerandomiseerd experiment.

**Voor docenten en opleidingen.** [§4.2](risks.md#42-voor-docenten-en-opleidingen) vertaalt dit bewijs naar punten voor het AI-beleid van een cursus of opleiding.

---

<a id="6-evaluatie"></a>

## 6. Evaluatie {#evaluation}

Hoe weet je of de harnas je leren beschermt en niet alleen frictie toevoegt? Controleer deze punten:

1. **Transfertests zonder hulp** aan het begin (nulmeting), na ongeveer een maand en kort voor je toets. Gebruik kleine OOD-taken *zonder AI*: ontwerp een klassendiagram, refactor een klasse met code smells, pas een patroon toe op een nieuw domein. Dit is de meting die het meest telt. [Bastani et al. (2025)](https://doi.org/10.1073/pnas.2422633122) lieten zien dat hoe goed je het doet bij het oefenen met AI, weinig zegt over hoe goed je het doet zonder AI.
2. **Het succespercentage per vaardigheid** moet rond 70–95% blijven. Blijft het boven 95%, dan is de frictie te laag. Blijft het onder 70%, dan is de frictie te hoog.
3. **Percentage overrides.** Stijgt dat, dan is dat een teken van frustratie (R6) of van het omzeilen van de regels (R5). Lees de redenen in het dagboek.
4. **Kalibratie.** Het verschil tussen het vertrouwen dat je vooraf inschat en hoe zelfstandig je echt werkt, moet in de loop van de tijd kleiner worden (R2).
5. **Het slagingspercentage van herhalingen** voor L4-vaardigheden moet 80% of hoger zijn. Is het lager, verkort dan de intervallen.
6. **Tijd tot beheersing per vaardigheid.** Die moet *afnemen* voor latere vaardigheden die voortbouwen op vereiste vaardigheden die je al beheerst. Dit is een transfereffect.
7. **Proeftoets vs. oefenen (R14).** Maak een proeftoets met tijdslimiet, zonder AI, in dezelfde omgeving (IDE) als je toets. Vergelijk je score met je succespercentage tijdens het oefenen. Is het verschil groot, dan zijn je omstandigheden bij het oefenen te makkelijk, of wijken ze te veel af van de toets.
8. **Toezichtcontrole (R16, na je toets).** Neem een korte klasse die door AI is geschreven en waarin bewust fouten in OOD en tests zijn verstopt. Tel hoeveel fouten je zonder hulp vindt. Herhaal dit elke maand.

De R-nummers verwijzen naar het [risicoregister](risks.md#risks).

### 6.1 Uitnodiging aan onderzoekers: een gerandomiseerd experiment

De controles hierboven zijn voor één lerende. Of de harnas in het algemeen werkt, vraagt om een gerandomiseerd gecontroleerd experiment. De pagina [Voor onderzoekers](../researchers.md) stelt er een voor. In het kort:

- **Groepen:** Claude Code zonder beperkingen; Claude Code met alleen een leerprompt (de *Learning* output style); Claude Code met de harnas.
- **Deelnemers:** studenten in een programmeervak, of junior developers met 0–2 jaar ervaring.
- **Primaire uitkomst:** een getimede transfertoets zonder AI, minstens acht weken na het laatste oefenen.
- **Secundaire uitkomsten:** gevonden geplante fouten in code die door AI is geschreven, afgeronde taken, tijd tot L4, en overrides.
- **Onderhoud binnen één persoon:** loot welke L4-vaardigheden herhalingen krijgen.

De harnas is open source (AGPL-3.0). De logs blijven op de computer van elke deelnemer, en een export met privacyfilters neemt alleen een vaste lijst velden mee ([Voor onderzoekers](../researchers.md#wat-de-harnas-al-biedt)).

---

<a id="7-beperkingen"></a>

## 7. Beperkingen {#limitations}

- **De bewijsbasis is jong.** De meeste studies over generatieve AI komen uit 2023–2026. Vaak hebben ze kleine steekproeven of een korte looptijd, of zijn het preprints en working papers (bijv. [Kosmyna et al., 2025](https://arxiv.org/abs/2506.08872); [Shen & Tamkin, 2026](https://arxiv.org/abs/2601.20245); [Lehmann et al., 2025](https://arxiv.org/abs/2409.09047); de meeste experimenten uit 2026 in [§2.8](literature.md#28-generatieve-ai-en-leren-programmeren-het-bewijs-tot-nu-toe)). In het hoger onderwijs heeft maar één studie gemeten wat er na meer dan ongeveer een week is blijven hangen: een quasi-experiment met een toets na zeven weken ([Albadarin, 2026](https://phys.org/news/2026-11-qa-exploring-generative-ai-impact.html)). Ook het overzicht van Stanford SCALE (november 2026) vindt blijvende leerwinst nog niet aangetoond. Effecten kunnen veranderen als de tools veranderen.
- **Een verhalend literatuuroverzicht, geen systematisch.** Er is gericht gezocht, zonder protocol, dus selectiebias is mogelijk. Beweringen die verder gingen dan hun bron, zijn na twee citatiechecks gecorrigeerd; de correcties staan in het [wijzigingslog](build-log.md#changelog).
- **Weinig AI-onderzoek specifiek over OOD, en geen onderzoek over agentische tools.** De meeste studies naar AI in het informaticaonderwijs gaan over programmeertaken uit CS1 (de eerste programmeercursus). Ze toepassen op ontwerpvaardigheden is een afleiding uit onderzoek naar misvattingen bij OOD, aangevuld met algemene leerwetenschap. Er bestaat nog geen gecontroleerde studie naar hoe studenten leren met agentische tools zoals Claude Code.
- **Het bewijs over de verschuiving in vaardigheden is vooral Amerikaans, beschrijvend en commercieel.** Causale studies naar de arbeidsmarkt spreken elkaar tegen. Nederlandse gegevens zijn schaars en correlationeel. De cijfers over hoeveel code AI schrijft, komen vooral van bedrijven die AI verkopen. Geen enkele studie meet de beste mix van oefenen met de hand en oefenen in toezicht op AI-uitvoer. [§2.9](skill-shift.md) en [§4.1](risks.md#41-oefening-opnieuw-verdelen-voorgestelde-wijzigingen-in-het-vaardighedenregister-jij-beslist) zijn dus afleidingen.
- **Belangenconflict.** Dit document is geschreven met Claude, een model van Anthropic, en het steunt op sommige plekken op onderzoek van Anthropic. Controleer de belangrijke beweringen via de gelinkte bronnen.
- **Hooks zijn een middel om jezelf te binden (commitment device), geen beveiliging.** Je kunt ze altijd uitzetten, en de AI vindt soms routes om de regels heen (bijv. shell-commando's die bestanden schrijven). Daarom kan de harnas tegenover een docent niet bewijzen dat een student zonder AI heeft gewerkt. De harnas werkt omdat *jij* ervoor hebt gekozen. De guard leest al shellcommando's (`Bash` en `PowerShell`) en beoordeelt elk los commando op het programma dat draait, maar dit wordt nooit waterdicht: er kan altijd een nieuwe route omheen opduiken. Hooks kunnen ook de andere kant op de fout in gaan. In de eerste sessies van de pilot werden rapporten van achtergrondagents behandeld als de eigen prompts van de student, en speelden ze zo hinttreden vrij, totdat dit werd opgelost ([§10.2](build-log.md#102-wat-er-is-veranderd), punt 10).
- **Tot nu toe door één student uitgeprobeerd.** Het ontwerp is voor het eerst uitgeprobeerd in een pilot met één student. Wat het [bouwlog](build-log.md#first-sessions) beschrijft, komt uit die eerste sessies. Het laat zien wat er misging en wat er is veranderd, niet hoe goed de harnas werkt voor studenten in het algemeen.
- **Niet uitgeprobeerd op het werk.** De onderbouwing voor junior developers op hun werk ([§2.12](literature.md#212-het-eeuwige-juniorprobleem)) rust op een experiment op korte termijn, kleine interviewstudies, vergelijkingen met andere beroepen en praktijkbronnen met bewijsgraad D. Nog geen junior developer heeft de harnas op het werk gebruikt.
- **Praktijkbronnen tonen zorg, geen bewijs.** De talks, interviews, nieuwsartikelen en blogs in §2.12 laten zien dat de zorg breed leeft. Ze laten niet zien dat die zorg terecht is.
- **Drempels voor beheersing zijn heuristieken.** De getallen (85%, 3 successen over 2 dagen, de intervallen) komen uit de literatuur, maar zijn niet gevalideerd voor deze opzet. Pas ze aan met je eigen evaluatiegegevens (§6).
- **Vaardigheden herkennen in prompts lukt maar bij benadering.** Koppelen op trefwoorden kiest soms de verkeerde vaardigheid. Koppel een oefenmap aan haar vaardigheid, dan beslist de map en niet de trefwoorden: `! node .claude/hooks/skill.mjs paths pattern.strategy add "07-strategy/**"`.

---

<a id="zo-citeer-je-dit-onderzoek"></a>

## Zo citeer je dit onderzoek {#cite}

Geschreven door Piet Hanegraaf met Claude (Anthropic); zie de [AI-verklaring](../ai-statement.md). Citeer het Engelse origineel: deze Nederlandse versie is een machinevertaling. Noem de versie en de datum waarop je het las, want het onderzoek wordt bijgewerkt.

**APA**

> Hanegraaf, P. (2026). *Learning to code (and OOD) with AI: Literature review, risk assessment and a learning-preserving Claude Code setup* (version of 14 November 2026; written with Claude, Anthropic). https://piethanegraaf.github.io/research/

**BibTeX**

```bibtex
@misc{hanegraaf2026learning,
  author       = {Hanegraaf, Piet},
  title        = {Learning to Code (and {OOD}) with {AI}: Literature Review, Risk Assessment and a Learning-Preserving {Claude Code} Setup},
  year         = {2026},
  month        = nov,
  howpublished = {\url{https://piethanegraaf.github.io/research/}},
  note         = {Version of 14 November 2026. Written with Claude (Anthropic).}
}
```
