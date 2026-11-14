---
title: "Literatuuronderzoek: wat onderzoek zegt over leren programmeren met AI (2026)"
description: "Wenselijke moeilijkheden, scaffolding, beheersing, onthouden, AI en beginnende programmeurs, vaardigheidsverlies en het eeuwige-juniorprobleem: het bewijs per studie beoordeeld."
---
<a id="2-literatuuronderzoek"></a>

# 2. Literatuuronderzoek {#literature-review}

!!! warning "Machinevertaling"
    Dit is een machinevertaling door Claude (Anthropic) van het [Engelse origineel](/research/literature/). Een mens heeft de vertaling niet nagekeken. Bij twijfel geldt de Engelse tekst.

## 2.0 Afbakening, methode en bewijsgraden

Dit is een **narratief literatuuroverzicht**, geen systematisch overzicht. De eerste versie (7 november 2026) had geen zoekprotocol, geen inclusiecriteria en geen kwaliteitsbeoordeling. Ook stonden gerandomiseerde experimenten, kleine interviewstudies en preprints door elkaar in dezelfde tabellen. De herziening van 8 november 2026 voegde toe:

- **Gerichte zoekopdrachten.** Vier zoekopdrachten besloegen mei–november 2026: leeronderzoek, de arbeidsmarkt, de economie van coderen met AI, en beleid over vaardigheden en toetsing. Twee citatiecontroles vergeleken de oorspronkelijke beweringen met hun primaire bronnen. De aantekeningen, met een link bij elk getal, staan in de [onderzoeksnotities](../notes/index.md) (Engels). De synthese staat in `reports/` en is niet gepubliceerd. Een korte vervolgzoektocht op 10 november 2026 besloeg 8–10 november en studies die de eerste zoekopdrachten hadden gemist (zie de [notities bij de update](/notes/update_2026-11-10/){ hreflang="en" }, Engels).
- **Correcties** overal waar een bewering verder ging dan de bron (opgesomd in het wijzigingslogboek, §11).
- **Een bewijsgraad** voor elke studie:

| Graad | Betekenis |
|---|---|
| **A** | Gerandomiseerd experiment met een uitkomst die *zonder* AI of na een vertraging is gemeten, of een meta-analyse die is gecorrigeerd voor publicatiebias |
| **B** | Gerandomiseerd of quasi-experimenteel, maar alleen met uitkomsten op korte termijn of met AI |
| **C** | Observationeel, correlationeel, kwalitatief, klein, of beschrijvende gebruiksdata |
| **D** | Beweringen van bedrijven of bestuurders, berichten in de pers, meningen |

**Belangenconflicten.** Een aantal belangrijke bronnen komt van AI-leveranciers:

- **Anthropic:** Shen & Tamkin, het Education Report en de studie naar de eigen engineers.
- **Microsoft en GitHub:** Peng et al., Cui et al., Lee et al.
- **Google:** DORA.

Dit document is geschreven met Claude, het model van Anthropic, en Claude-agents deden het onderzoek voor de herziening. Een leveranciersstudie die *schade* door het eigen product meldt, zoals Shen & Tamkin, is geloofwaardiger dan een bewering van een leverancier over hoeveel code AI al schrijft. Zulke beweringen krijgen graad D. Controleer belangrijke beweringen via de gelinkte primaire bron.

**Drie vragen.** Het overzicht beantwoordt drie verschillende vragen, en het bewijs beantwoordt ze verschillend:

- **Korte termijn (§2.1–2.8):** wat je helpt om op je toetsdatum te slagen voor een toets op AI-niveau 0/1.
- **Lange termijn (§2.9):** welke vaardigheden na je studie tellen op de arbeidsmarkt.
- **Op het werk (§2.12):** hoe een junior developer blijft groeien als een agent het werk kan doen.

## 2.1 Hoe je programmeer- en OOD-vaardigheden leert

**Programmeren is moeilijk te leren, en de moeilijkheid zit meer in het opdelen van problemen en in mentale modellen dan in syntaxis.** De multinationale studie van McCracken et al. (2001) vond dat de meeste eerstejaars een middelzwaar programmeerprobleem niet konden oplossen. Robins, Rountree & Rountree (2003) brachten het vakgebied in kaart en concludeerden dat beginners *schema's* (plannen) en *mentale modellen* van programma-uitvoering missen. Beginners hebben moeite om bekende constructies te combineren tot oplossingen. De constructies kennen is niet het knelpunt.

**Lezen en traceren gaan voor schrijven.** Lister et al. (2004) lieten zien dat veel studenten code niet betrouwbaar kunnen *traceren*. Lopez et al. (2008) vonden een hiërarchie waarin het traceren en uitleggen van code het schrijfvermogen voorspellen. **Dit is belangrijk voor AI-gebruik:** als AI de code schrijft, krijg je hooguit *lees*oefening. Leesoefening levert alleen iets op als je de code echt traceert en uitlegt. Passief accepteren telt niet.

**OOD heeft eigen misvattingen.** Holland, Griffiths & Woodman (1997) beschreven veelvoorkomende misvattingen over objecten, bijvoorbeeld een klasse verwarren met een instantie, of objecten zien als alleen maar datarecords. Ragonis & Ben-Ari (2005) volgden beginners lange tijd en vonden hardnekkige problemen met de toestand van objecten, constructors en het onderscheid tussen statisch en dynamisch. Eckerdal & Thuné (2005) lieten zien dat de *opvattingen* van studenten over object en klasse lopen van "een stuk code" tot "een model van iets in het probleemdomein". Die laatste opvatting is wat OOD nodig heeft. Sanders & Thomas (2007) maakten een checklist van OO-concepten en misvattingen voor toetsing. Kölling (1999) betoogde dat OOP een "objects first"-aanpak nodig heeft, met geschikte tools. **Wat dit voor jou betekent:** OOD-vaardigheid is grotendeels *ontwerpoordeel*. Dat zie je aan het kiezen van verantwoordelijkheden, abstracties en relaties. Een AI die kant-en-klare ontwerpen vol patronen aanlevert, laat jou precies dat oordeel overslaan.

**Instructietechnieken met goed bewijs in het informatica-onderwijs:**

- **Uitgewerkte voorbeelden** verlagen de cognitieve belasting voor beginners (Sweller & Cooper, 1985; Sweller, 1988).
- **Subdoellabels** (benoemde stappen in een uitgewerkt voorbeeld) verbeteren probleemoplossen en transfer bij programmeren (Margulieux, Catrambone & Guzdial, 2012; Morrison, Margulieux & Guzdial, 2015).
- **Parsons-opgaven** (gegeven codefragmenten in de juiste volgorde zetten) zijn een efficiënte brug tussen lezen en schrijven (Parsons & Haden, 2006; Ericson, Margulieux & Rick, 2017).
- **Zelfuitleg** bij voorbeelden voorspelt sterk hoeveel je leert (Chi et al., 1989).
- **Zelf antwoorden genereren** verbetert het geheugen in vergelijking met ze lezen: het *generatie-effect* (Slamecka & Graf, 1978; meta-analyse Bertsch et al., 2007).

## 2.2 Frictie: wenselijke moeilijkheden (desirable difficulties) tegenover vastlopen

**Wenselijke moeilijkheden.** Bjork (1994) en Bjork & Bjork (2011) lieten zien dat omstandigheden die de *zichtbare* vooruitgang tijdens het oefenen vertragen, het onthouden en de transfer op lange termijn vaak *verbeteren*. Voorbeelden zijn gespreid oefenen, interleaving, ophalen en genereren. Vlot, makkelijk oefenen geeft een *illusie van bekwaamheid*: studenten beoordelen hun leren naar hoe makkelijk het oefenen voelde, en dat oordeel zit er systematisch naast (Koriat & Bjork, 2005; Kornell & Bjork, 2008). AI-hulp komt dicht bij de ultieme vlotheidsmachine.

**Maar de moeilijkheid moet *wenselijk* zijn. Dat betekent dat je die kunt overwinnen:**

- **Minimale begeleiding laat beginners in de steek.** Kirschner, Sweller & Clark (2006) zetten het bewijs op een rij dat ontdekken zonder begeleiding het werkgeheugen overbelast.
- **Productief falen.** Kapur (2008, 2016) liet zien dat worstelen met een probleem *vóór* de instructie het conceptuele begrip en de transfer kan verbeteren, maar alleen als er na het worstelen consolidatie volgt. Kapur (2016) onderscheidt *productief falen* van *onproductief falen*, waarbij een student zonder steun blijft ploeteren. Een meta-analyse van 53 studies vond een matig voordeel voor problemen oplossen vóór de instructie (g = 0.36, 95% CI 0.20–0.51), en een groter voordeel (0.37–0.58) als het ontwerp de principes van productief falen volgde. Eerst instructie werkte beter voor jonge lerenden en voor domeinoverstijgende vaardigheden (Sinha & Kapur, 2021). Het debat met Kirschner et al. is dus genuanceerd, niet beslecht. Een poging telt alleen als productief falen als er een uitleg op volgt die erop voortbouwt en de poging vergelijkt met een standaardoplossing. Zonder dat is "eerst proberen" het geval met minimale begeleiding dat Kirschner et al. bekritiseren.
- **Verwarring kan helpen.** D'Mello et al. (2014) vonden dat verwarring het leren verbetert *als ze wordt opgelost*. Onopgeloste verwarring slaat om in frustratie en afhaken.
- **De 85%-regel is een heuristiek, geen bewijs.** Wilson et al. (2019) leidden af dat lerende systemen die met stochastic gradient descent worden getraind op taken met *binaire classificatie*, het snelst leren bij een foutpercentage van ongeveer 15.87% tijdens de training (nauwkeurigheid ≈ 85%).
    - **Alleen simulaties:** ze lieten het zien in een perceptron, een netwerk met twee lagen op MNIST-cijfers en een model van perceptueel leren bij apen. Ze verzamelden geen gegevens van mensen en noemen een test bij mensen toekomstig werk.
    - **Hangt af van ruis:** bij niet-Gaussische ruis verschuift het optimum naar 82% of 75%.
    - **Moeilijkheid, geen beheersing:** het getal is een doel voor de moeilijkheid *tijdens* het oefenen, geen drempel voor beheersing.
    - **Hier niet meetbaar:** over 5 taken kan een succespercentage alleen 80% of 100% zijn.

    De harnas gebruikt "ongeveer 85%" daarom alleen als vuistregel: oefenen moet zo moeilijk zijn dat je soms faalt.

- **Zone van naaste ontwikkeling / region of proximal learning.** Vygotsky (1978) beschreef de zone waarin je slaagt *met* hulp, maar nog niet alleen. Metcalfe & Kornell (2005) lieten zien dat studenten het meest winnen bij het bestuderen van stof die net boven hun huidige beheersing ligt.
- **Flow.** Csikszentmihalyi (1990) vond dat betrokkenheid het hoogst is als de uitdaging past bij de vaardigheid. Te makkelijk leidt tot verveling, te moeilijk tot angst.

**Ook hulp zoeken kan misgaan.** Aleven & Koedinger (2000) en Aleven et al. (2003) lieten zien dat studenten in tutorsystemen hulp vaak *verkeerd gebruiken*: ze klikken door de hints heen om bij het antwoord te komen ("help abuse"), of ze vermijden hulp als ze die nodig hebben. Baker et al. (2004) beschreven "gaming the system" en het negatieve verband daarvan met leren. **Een AI-codeerassistent is een hintknop zonder limiet.** Hulpzoekgedrag heeft daarom structuur nodig, zoals hintladders, tijdslimieten en de eis dat je eerst een poging doet.

**Conclusie over frictie:** mik op *worstelen met een vangnet*. Je probeert eerst. Hulp neemt stap voor stap toe, en alleen na een echte poging. Als je vastzit, blijf je nooit te lang alleen. En elke worsteling eindigt met consolidatie (een uitleg, een reflectie of een uitgewerkte oplossing *na* de poging).

## 2.3 Scaffolding, afbouwen en het expertise-omkeereffect

- **Scaffolding** (ondersteuning) werd door Wood, Bruner & Ross (1976) gedefinieerd als steun van een tutor die de delen van een taak overneemt die de student nog niet aankan. Pea (2004) en Puntambekar & Hübscher (2005) benadrukten dat scaffolding alleen als scaffolding telt als die wordt **afgebouwd**. Blijvende steun is gewoon een kruk.
- **Cognitief leerlingschap** (cognitive apprenticeship; Collins, Brown & Newman, 1989) doorloopt *voordoen → coachen → scaffolding → afbouwen → verwoorden → reflecteren → verkennen*. Deze volgorde is vrijwel de blauwdruk voor de Autonomieladder in §5.
- **Afgebouwde uitgewerkte voorbeelden.** Renkl & Atkinson (2003) en Atkinson, Renkl & Merrill (2003) lieten zien dat het geleidelijk weghalen van oplossingsstappen uit uitgewerkte voorbeelden (*backward fading*) beter werkt dan in één keer overstappen van voorbeelden naar opgaven.
- **Expertise-omkeereffect.** Kalyuga et al. (2003) lieten zien dat begeleiding die beginners helpt, *overbodig en schadelijk* wordt voor gevorderde studenten. **Het hulpniveau moet daarom per vaardigheid jouw expertise volgen.** Een vaste "tutormodus" is te veel voor sommige vaardigheden en te weinig voor andere.
- **Contingente begeleiding.** De regel *geef meer hulp na falen, minder na succes* gaat terug op observaties van moeders die hun jonge kind hielpen (Wood & Middleton 1975) en op een experiment met vier manieren van lesgeven (Wood, Wood & Middleton 1978). Wood & Wood (1999) bouwden hem in een computertutor. Je kunt de regel direct implementeren (§5.3), maar het bewijs dat het meebewegen zelf helpt, is zwak:
    - een vooraf geregistreerde directe replicatie van het experiment uit 1978, met 285 driejarigen, vond het effect op zelfstandig presteren niet terug (Smit et al. 2025);
    - in een meta-analyse van hulp in leersoftware voor STEM hielp die hulp (ḡ = 0,46 over 144 studies), maar het effect hing er niet van af of en hoe de hulp in de tijd veranderde (Belland et al. 2017);
    - in een klasexperiment hielp meebewegende hulp alleen als leerlingen eerst langer zelfstandig hadden gewerkt (van de Pol et al. 2015).

    Hulp in stappen is dus goed onderbouwd; dat die hulp elk succes en elke mislukking moet volgen, niet.

## 2.4 Beheersing, fasen van vaardigheidsverwerving en wanneer je automatiseert

- **Fasen van vaardigheidsverwerving.** Fitts & Posner (1967) stelden de fasen cognitief → associatief → autonoom voor. Anderson (1982) formaliseerde dit als declaratieve kennis die wordt gecompileerd tot procedures. Dreyfus & Dreyfus (1980) beschreven beginner → gevorderde beginner → competent → bekwaam → expert. Zodra een vaardigheid *autonoom* is, heeft die geen bewuste aandacht meer nodig. **Dat is het juiste moment om de vaardigheid aan automatisering over te dragen:** de cognitieve capaciteit komt dan vrij voor de volgende vaardigheid, en je hebt nog de bekwaamheid om op de automatisering *toe te zien*.
- **Beheersingsleren (mastery learning).** Bloom (1968, 1984) stelde voor dat studenten pas verdergaan als ze beheersing hebben laten zien (≈ 80–90% op een criteriumtoets).
    - **Toetsen van de cursus:** een meta-analyse van 108 evaluaties vond positieve effecten, het sterkst bij zwakkere studenten (Kulik, Kulik & Bangert-Drowns, 1990).
    - **Gestandaardiseerde toetsen:** de effecten zijn in wezen nul, een punt dat Kulik et al. erkenden (Slavin, 1987, 1990).
    - **Kosten:** beheersingspoorten kosten tijd en verkleinen hoeveel stof je behandelt.

    Beide punten zijn hier van belang. De winst zie je op smalle toetsen die op de cursus aansluiten, en een cursustoets is zo'n toets. Een strenge poort, zoals "geen promotie zolang er uitleg openstaat", ruilt breedte in voor diepte.

- **De "2 sigma"-claim houdt geen stand.** Het effect van twee standaarddeviaties van één-op-één-begeleiding door een tutor bij Bloom (1984) berustte op twee dissertatiestudies van drie weken met smalle toetsen. Ongeveer de helft ervan kwam van de beheersingstoetsen en de corrigerende feedback, niet van de begeleiding zelf (von Hippel, 2024). Betere schattingen:
    - begeleiding door een menselijke tutor d ≈ 0.79 en intelligente tutorsystemen d ≈ 0.76 (VanLehn, 2011);
    - tutorprogramma's ongeveer 0.29 SD (Nickow, Oreopoulos & Quan, 2024);
    - tutorsystemen een mediaan van 0.66 SD, veel groter op lokaal gemaakte toetsen dan op gestandaardiseerde (Kulik & Fletcher, 2016).

    Een realistische verwachting voor een AI-tutor is een fractie van een standaarddeviatie, niet twee.

- **Knowledge tracing.** Corbett & Anderson (1994) modelleerden de kans dat een vaardigheid wordt beheerst, werkten die kans na elke poging bij, en verklaarden beheersing bij P(known) ≥ 0.95. Dit idee zit achter het vaardighedenregister in §5.5. Anderson et al. (1995) en VanLehn (2011) lieten zien dat intelligente tutorsystemen die per stap werken, bijna zo effectief zijn als begeleiding door een menselijke tutor.
- **Doelbewust oefenen (deliberate practice).** Ericsson, Krampe & Tesch-Römer (1993) wezen inspannend oefenen op specifieke zwakke punten, met directe feedback, aan als de motor van expertise. Oefenen op een makkelijke "automatische piloot" heeft niet hetzelfde effect. Zie dit als een principe over de *kwaliteit* van oefenen. Het laat niet zien dat de hoeveelheid oefening de meeste verschillen tussen mensen verklaart:
    - **Verklaarde variantie:** doelbewust oefenen verklaarde 26% bij spellen, 21% bij muziek, 18% bij sport, 4% in het onderwijs en minder dan 1% in beroepen (Macnamara, Hambrick & Oswald, 2014).
    - **Replicatie:** een directe replicatie van de oorspronkelijke studie mislukte (Macnamara & Maitra, 2019).
    - **Tegenclaim:** Ericsson & Harwell (2019) melden hogere aandelen als ze alleen studies meenemen die passen bij de oorspronkelijke definitie.
- **Overleren** (doorgaan met oefenen na de eerste beheersing) verbetert het onthouden, maar het voordeel neemt in de loop van de tijd af (Driskell, Willis & Copper, 1992). *Gespreid oefenen* is een efficiëntere besteding van extra oefening (Rohrer et al., 2005).

## 2.5 Onthouden na beheersing: gespreid oefenen, ophalen en verval van vaardigheden

- **Vergeten** volgt een steile curve die in de loop van de tijd afvlakt (Ebbinghaus, 1885).
- **Spreidingseffect (spacing effect).** Cepeda et al. (2006) bekeken 317 experimenten: oefening die over de tijd is gespreid, wint van geconcentreerd oefenen. Cepeda et al. (2008) vonden dat de beste tussenpoos groeit met de tijd tot de toets, maar als aandeel daarvan kleiner wordt: van ongeveer **20–40% bij een toets na één week** tot ongeveer **5–10% bij een toets na één jaar**. Als je toets ongeveer tien weken weg is, wijst dat op tussenpozen van één tot twee weken tussen herhalingen van een geleerde vaardigheid. De studie gebruikte weetjes met één herhaling, dus toepassen op programmeervaardigheid is een extrapolatie. Kang (2016) besprak gespreid oefenen als een praktische, efficiënte strategie.
- **Groeiende intervallen zijn niet aantoonbaar beter.**
    - **Gespreid tegenover geconcentreerd:** gespreid ophalen wint van geconcentreerd ophalen (g = 0.74).
    - **Groeiend tegenover gelijk:** groeiende schema's, zoals de Fibonacci-intervallen van de harnas, wonnen niet van gelijke tussenpozen (g = 0.034, niet significant). Ze leveren alleen winst op als items vaak worden opgehaald (Latimier, Peyre & Ramus, 2021).
    - **Eerste keer ophalen:** het belangrijkst is dat je de eerste keer ophalen uitstelt (Karpicke & Roediger, 2007).
    - **Tijdens de training:** groeiende en gelijke tussenpozen scoren gelijk op een toets acht weken later, maar met groeiende tussenpozen blijft het herinneren tijdens de trainingsperiode veel hoger (Kang et al., 2014).

    Het Fibonacci-schema is dus te verdedigen omdat het de vroege herhalingen succesvol houdt en ze vóór je toets plaatst. Dat groeiende intervallen beter zijn, is niet bewezen.

- **Ophaaloefening (het testeffect).** Ophalen uit het geheugen wint van opnieuw bestuderen (Roediger & Karpicke, 2006; Karpicke & Roediger, 2008). Meta-analyses: Adesope, Trevisan & Sundararajan (2017); specifiek voor gespreid ophalen: Latimier, Peyre & Ramus (2021). Dunlosky et al. (2013) beoordeelden oefentoetsen en gespreid oefenen als de twee leertechnieken met het *hoogste nut*.
- **Interleaving** (soorten opgaven door elkaar oefenen) verbetert het vermogen om de juiste strategie te *kiezen* (Rohrer & Taylor, 2007). Een meta-analyse vond g = 0.42, het grootst als de categorieën op elkaar lijken (Brunmair & Richter, 2019). Er is nog geen gerandomiseerd experiment bij programmeren. Kiezen is cruciaal bij OOD, waar het lastige deel is weten *welk* patroon of principe van toepassing is. Studenten vinden interleaving moeilijker en denken ten onrechte dat ze er minder van leren (Samani & Pan, 2021). Een herhalingssessie die slechter voelt, is dus geen bewijs dat die slechter werkt.
- **Verval van vaardigheden.** Arthur et al. (1998) deden een meta-analyse van 53 artikelen.
    - **Over de tijd:** het verval groeide van d ≈ −0.01 direct na de training tot d ≈ −1.4 na meer dan een jaar niet gebruiken.
    - **Per soort taak:** **cognitieve, kunstmatige en op nauwkeurigheid gerichte taken vervallen sneller** dan fysieke, natuurlijke en op snelheid gerichte taken.
    - **Omstandigheden bij het ophalen:** retentietoetsen onder omstandigheden die op de training leken, lieten minder verlies zien.
    - **Nieuwere schatting:** een meta-analyse uit 2025 van procedurele vaardigheden vond dat de helft van de aanvankelijke winst in nauwkeurigheid na ongeveer 6.5 maanden verloren was (Tatel & Ackerman, 2025).

    Correcte code uit je hoofd schrijven, bijvoorbeeld C#, valt in de categorie die snel vervalt.

- **Adaptief plannen.** Het Leitner-systeem (Leitner, 1972) en half-life regression (Settles & Meeder, 2016, van Duolingo) stellen de intervallen tussen herhalingen adaptief in op basis van eerdere successen. Dit is het model achter §5.7.

## 2.6 Oefenomstandigheden en transfer naar de toets

Hoe en waar je oefent, bepaalt mee hoe goed je vaardigheid meegaat naar de toets. Twee omstandigheden tellen hier: of je getimed en zonder hulp hebt geoefend, en of je hebt geoefend in de IDE die je toets gebruikt. De literatuur ondersteunt dat je op allebei let, met één correctie over wat het zwaarst weegt.

!!! example "Voorbeeld: de situatie van één student"
    Een tweedejaars student HBO-ICT oefende OOD in Visual Studio, met AI binnen handbereik. Een diagnostische toets bij CHE was in Rider, getimed en zonder AI. De eigen analyse van de student noemde de oefenomstandigheden als een hoofdoorzaak van het resultaat: er was niet getimed geoefend zonder hulp, en de toets was in een andere IDE.

- **Transfergerichte verwerking (transfer-appropriate processing).** Prestaties hangen af van hoe goed de verwerking tijdens het oefenen past bij de verwerking bij de toets (Morris, Bransford & Franks, 1977; zie ook encoderingsspecificiteit, Tulving & Thomson, 1973). Oefenen in de vorm van de toets leidt tot betere transfer:
    - **Quizzen in de klas:** g ≈ 0.50, afhankelijk van hoe goed de oefenvorm overeenkomt met de toetsvorm (Yang et al., 2021).
    - **Leren door toetsen (test-enhanced learning):** dit geeft transfer met d ≈ 0.40, vooral naar andere vormen en naar toepassingsvragen. Na correctie voor publicatiebias is er zonder die ondersteunende omstandigheden nauwelijks transfer (Pan & Rickard, 2018).
- **De ruimte telt minder dan de taak.** Effecten van de fysieke omgeving zijn betrouwbaar maar bescheiden (d ≈ 0.28; Smith & Vela, 2001, zoals samengevat door Smith et al., 2014), en de klassieke onderwaterstudie is niet gerepliceerd (Murre, 2021). Een IDE is echter geen achtergrondcontext. Klassen aanmaken, tests draaien en compileruitvoer lezen in de IDE van je toets horen bij de procedure die wordt getoetst.
- **Stress en belang.** In één studie beschermde ophaaloefening het herinneren tegen acute stress (Smith, Floerke & Thomas, 2016), met wisselende resultaten in vervolgstudies. Quizzen waarbij veel op het spel stond *tijdens het leren*, haalden het voordeel van ophaaloefening weg (Hinze & Rapp, 2014). Trainen onder stress verbetert prestaties onder stress, en dat effect gaat mee naar nieuwe stressoren en taken (Saunders et al., 1996; Driskell, Johnston & Salas, 2001).
- **Wat dit betekent.** Leer eerst met weinig op het spel, met hints. Oefen in de laatste weken voor je toets getimede sessies zonder AI in de IDE van je toets. Begin kort en bouw op naar volledige proeftoetsen. Geen enkele studie heeft specifiek gemeten wat een onbekende IDE kost, dus dit is een afleiding uit de principes hierboven.

## 2.7 Reflectie, leerdagboeken en zelfregulatie

- **Zelfgereguleerd leren (SRL).** Zimmerman (2002) beschreef een cyclus van *vooruitdenken → uitvoeren → zelfreflectie*. Studenten die plannen, monitoren en reflecteren, leren meer.
- **Leerprotocollen schrijven.** Nückles, Hübner & Renkl (2009) lieten zien dat dagboekschrijven met **cognitieve en metacognitieve prompts** de leerresultaten verbetert. Nückles et al. (2020) werkten dit uit tot een verklaring van schrijven-om-te-leren vanuit zelfregulatie. Moon (2006) geeft praktische richtlijnen voor leerdagboeken. Schön (1983) en Boud, Keogh & Walker (1985) legden de basis voor reflectieve praktijk.
- **Feedback** hoort bij de sterkere invloeden op leren, vooral als die veel informatie bevat en gaat over de taak, het proces en de zelfregulatie in plaats van over de persoon (Hattie & Timperley, 2007; Shute, 2008).
    - **Gemiddeld effect:** de nieuwere meta-analytische schatting is d = 0.48 (95% CI 0.44–0.51) (Wisniewski, Zierer & Hattie, 2020).
    - **Per soort feedback:** feedback met veel informatie haalt d ≈ 0.99, lof of beloningen d ≈ 0.24 (zelfde bron).
    - **Schade:** meer dan een derde van de feedbackinterventies maakte de prestaties *slechter* (Kluger & DeNisi, 1996).

    Voor de harnas betekent dit: positieve signalen moeten de specifieke (micro)vaardigheid en strategie noemen die werkte, en niet de persoon prijzen. **Leren van fouten** werkt het best als de fouten worden verbeterd en als erop wordt gereflecteerd (Metcalfe, 2017).

- **Zelfdeterminatietheorie.** Ryan & Deci (2000) lieten zien dat autonomie, competentie en verbondenheid de motivatie in stand houden. Een opzet die *jij* instelt en die je voortgang zichtbaar maakt, ondersteunt autonomie en competentie. Een opzet die zeurt en je willekeurig blokkeert, ondermijnt ze.

**Gevolg voor een AI-dagboek:** de *feiten* kunnen automatisch worden gelogd (vaardigheden waaraan is gewerkt, gebruikte hints, niveaus, testresultaten). De *reflectie* moet **door jou worden geschreven**, aangezet door specifieke vragen. Als de AI je reflectie schrijft, verlies je het generatie-effect (Slamecka & Graf, 1978; Bertsch et al., 2007) en het voordeel van schrijven om te leren (Nückles et al., 2009). Fan et al. (2025) worden hier vaak aangehaald, maar zij onderzochten geen door AI geschreven reflecties. Ze vonden dat steun van ChatGPT een essay beter maakte zonder de kenniswinst of transfer te verbeteren, en ze *interpreteerden* dat als metacognitieve luiheid.

## 2.8 Generatieve AI en leren programmeren: het bewijs tot nu toe

**Mogelijkheden en vroege beeldvorming.** In 2022 konden LLM's al typische toetsopgaven van CS1 oplossen (Finnie-Ansley et al., 2022). Becker et al. (2023) en Denny et al. (2024) betoogden dat dit verandert wat informatica-onderwijs moet onderwijzen. De ITiCSE-werkgroep van Prather et al. (2023) hield een enquête onder studenten en docenten. Lau & Guo (2023) beschreven houdingen van docenten die liepen van "verbieden" tot "verzet is zinloos". Zastudil et al. (2023) vonden dat studenten en docenten zich allebei zorgen maakten over overmatige afhankelijkheid.

In 2026 scoorden vijf actuele modellen hoger dan de gemiddelde student op de toetsen en toetsopgaven van een inleidende universitaire OOP-cursus: ChatGPT-5.2, DeepSeek-V3, Gemini 2.5 Flash, Claude Sonnet 4.5 en M365 Copilot. Op de langere opgaven haalden ze vaak de volle score. Toch maakten ze soms nog code die niet compileerde, en ze **hadden moeite met interfaces, abstracte klassen en sommige opgaven over overerving** (Lepp & Kaimre, 2026, preprint). Dat zijn kernconstructies van OOD. Wie daar op AI vertrouwt, vertrouwt er dus op waar die het minst betrouwbaar is.

**Studies naar AI en beginnende programmeurs** (bewijsgraden zoals in §2.0):

| Studie | Opzet | Belangrijkste bevinding | Graad |
|---|---|---|---|
| Kazemitabaar et al. (2023), CHI | Gerandomiseerd; 69 beginners van 10–17 jaar; Codex tegenover niets; retentietoets na een week | Beter code schrijven met Codex, minder frustratie. **Geen significant verschil in retentie na één week**; de Codex-groep deed het iets beter. Studenten met meer voorkennis hadden er meer baat bij. | A (klein) |
| Kazemitabaar et al. (2023b), Koli Calling | Observationeel; alleen de 33 studenten die Codex hadden | Hele opdrachten kopiëren en plakken ging samen met slechtere retentie, en eerst zelf code schrijven en daarna AI vragen ging samen met betere retentie. **Dit waren trends, niet significant.** | C |
| Prather et al. (2024b), TOCHI | Kwalitatief; beginners die Copilot gebruiken | Nieuwe metacognitieve problemen: "meegezogen" worden door suggesties, je eigen plan kwijtraken. | C |
| Prather et al. (2024), ICER "Widening Gap" | Kwalitatieve labstudie; 21 beginners; observatie, eyetracking, interviews | Sterke studenten versnelden, zwakke studenten raakten ontspoord. **Illusie van bekwaamheid.** | C |
| Margulieux et al. (2024), ITiCSE | Observationeel; beginners met LLM's | Zelfregulatie, geloof in eigen kunnen en faalangst bepaalden *hoe* studenten LLM's gebruikten. | C |
| Kazemitabaar et al. (2024), CHI: CodeAid | Praktijkinzet; 700 studenten, 12 weken; de tool geeft geen volledige oplossingen | Docenten waardeerden het didactische ontwerp. Risico's: af en toe verkeerde feedback, en **studenten die terugvielen op ChatGPT** voor directe antwoorden. | C |
| Liffiton et al. (2023): CodeHelp | Praktijkinzet; LLM-hulp met vangrails in lessen | Vangrails (geen codeoplossingen) waren op grote schaal haalbaar en werden goed ontvangen. | C |
| Liu et al. (2024): CS50 "duck" | Praktijkinzet; AI-tutor in Harvard CS50 | Een didactisch begrensde AI-tutor draaide op grote schaal; studenten vonden hem behulpzaam. | C |
| Lyu et al. (2024): CodeTutor | Veldstudie van een semester; 50 studenten; **niet gerandomiseerd** (de onderzoekers deelden de groepen in) | Binnen beide groepen stegen de scores, maar er was geen directe vergelijking tussen de groepen. Kritisch denken en de kwaliteit van prompts deden ertoe. | C |
| Jošt, Taneski & Karakatič (2024) | Correlationeel; 32 studenten gedurende 10 weken; geen controlegroep | Meer leunen op LLM's ging samen met **lagere** cijfers. | C |
| Hellas et al. (2023), ICER | Analyse van LLM-antwoorden op hulpvragen van beginners | Vaak behulpzaam, maar **bevatte vaak onjuiste** inhoud of volledige oplossingen. | C |
| Leinonen et al. (2023); Sarsa et al. (2022) | Uitleg van foutmeldingen en het maken van oefeningen door LLM's | Nuttig als *generatoren* van uitleg en oefeningen, een goede rol voor AI. | C |
| Denny et al. (2024b): Prompt Problems | Nieuw soort oefening | Studenten leren problemen precies te specificeren voor AI, een nieuwe vaardigheid die het oefenen waard is. | C |
| Kazemitabaar et al. (2025), IUI | Gerandomiseerd; 82 in een between-subjects-opzet, daarna 42 in een within-subjects-opzet; zeven manieren om met door AI gegenereerde code om te gaan | De beste techniek leidt studenten stap voor stap door het probleem en vraagt wat elke fase nodig heeft, *voordat* de code wordt getoond. Technieken die studenten actief laten meedoen, winnen van passief bekijken. | B |
| **Nieuw:** Gardella et al. (2026), ICER | Within-subjects; 22 studenten CS2/CS3; Copilot tegenover een menselijke pairpartner, elk 20 min; een week later een hertoets alleen en zonder AI | Met Copilot steeg de prestatie met 14 punten (g = 0.99) en daalde de werkbelasting. Van de sessie tot de hertoets daalden de scores na de Copilot-ronde 18.9 punten meer (g = −1.13, p_adj = .054). Het absolute verschil op de hertoets was niet significant. | A (klein) |
| **Nieuw:** Barth et al. (2026), ICER | Vooraf geregistreerde cross-over; 1,059 CS1-studenten gedurende zes weken | De didactiek van de tutor sturen via systeemprompts (scaffolds voor zelfregulatie of ICAP) maakte **geen verschil** op enige vooraf geregistreerde uitkomst. De auteurs concluderen dat de didactiek van een tutor "misschien niet makkelijk alleen met systeemprompts te sturen is". | A |
| **Nieuw:** Pădurean et al. (2026), ICER | Logstudie; 917 CS1-studenten, 2,636 sessies; realistische bugs ingevoegd in door AI gegenereerde oplossingen | Door ingevoegde bugs gingen studenten de code zelf aanpassen en repareren, met meer succes bij de volgende poging. Als een prompt uit zichzelf mislukte, formuleerden ze in plaats daarvan de prompt anders. | C |
| **Nieuw:** Prather et al. (2026), ICER: "Scaffolding Autocomplete" | Een oefening die traint in het onderscheiden van goede en slechte AI-suggesties | Studenten deden het beter met één suggestie dan met meerdere. Steekproef en opzet niet geverifieerd. | C |
| **Nieuw:** Ardic, Le Dilavrec & Zaidman (2026), *Empirical Software Engineering* | Observationeel; 12 studenten die met ChatGPT (GPT-3.5) unittests schreven | Vier strategieën, afhankelijk van wie het idee voor de test had en wie de code schreef. Studenten bespaarden tijd, maar vertrouwden de tests minder en voelden minder eigenaarschap. | C |
| Sankaranarayanan (2026), preprint, februari | 78 online lerenden; handmatig tegenover onbeperkte AI tegenover AI achter een "uitlegpoort" (teach-back), in Cursor | Beide AI-groepen leverden meer werkende code op. Bij een latere onderhoudstaak van 30 minuten, waarbij AI was geblokkeerd, **faalde 77% na onbeperkte AI tegenover 39% na de uitlegpoort**. Randomisatie niet vermeld. | C |
| **Nieuw (10 nov):** Bergh, Tag, Vassar & Renzella (2026), preprint, september | Gecontroleerd between-subjects-experiment; 55 bachelorstudenten informatica; drie C-opdrachten met ChatGPT tegenover zoeken op het web; geheugentoetsen direct erna en 48 uur later | Met ChatGPT waren de programmeerscores hoger (89% tegenover 69%), maar **onthielden studenten minder**, direct (41% tegenover 53%) en na 48 uur (39% tegenover 52%). Studenten rekenden 45% van hun ingeleverde code aan zichzelf toe, tegen 81% zonder ChatGPT. De mentale inspanning nam over de opdrachten minder toe. Randomisatie niet vermeld in de samenvatting. | B |
| **Nieuw (10 nov):** Albadarin (2026), proefschrift, University of Eastern Finland | Quasi-experimenteel; 152 studenten; programmeren en debuggen met Llama 3.1 tegenover zonder AI; retentietoets zeven weken later | De AI-groep was beter en sneller bij sommige debugtaken, maar **de groep zonder AI onthield na zeven weken meer**. Cijfers uit een interview van de universiteit (10 nov 2026); scores en effectgroottes nog niet gezien. | B |
| **Nieuw (10 nov):** Lepp (2026), FIE, preprint | Enquête; 210 eerstejaars in een OOP-vak waarin AI mocht bij opdrachten en verboden was bij toetsen; clusteranalyse | Vijf gebruiksprofielen, waaronder een "slim" profiel (weinig code laten genereren, veel hulp bij begrip en debuggen). **Geen significant verschil in toetsscores** tussen de profielen. | C |

**Studies naar AI en leren in het algemeen:**

- **Bastani et al. (2025), PNAS.** *Grade A.* Gerandomiseerd per klas; ongeveer 1,000 leerlingen in leerjaar 9–11 van één Turkse middelbare school.
    - **GPT Base** (onbeperkt): +48% bij het oefenen, maar **−17% op de toets** nadat de toegang was weggehaald.
    - **GPT Tutor** (hints, vangrails): +127% bij het oefenen en geen schade op de toets (−0.004, niet significant).

    Leerlingen gebruikten de onbeperkte tool "als kruk".

- **Shen & Tamkin (2026), arXiv-preprint (Anthropic Fellows).** *Grade A voor het hoofdeffect, C voor de patronen.*
    - **Opzet:** gerandomiseerd; 52 vooral professionele of freelance ontwikkelaars (ongeveer 25–35 jaar, geworven via een crowdworkplatform) leerden de asynchrone Python-library Trio, met of zonder een assistent op basis van GPT-4o.
    - **Resultaat:** de AI-groep scoorde **50% tegenover 67%** op de quiz achteraf (d = 0.74, p = 0.01), met het grootste verschil bij debuggen. De groep was maar ongeveer twee minuten sneller, en dat was niet significant. Het artikel noemt het verschil "17%"; de eigen cijfers geven 15.4 punten.
    - **Patronen:** de zes interactiepatronen met cognitieve betrokkenheid (conceptuele vragen stellen; code laten genereren en daarna je begrip controleren) scoorden 65–86%, tegenover 24–39% bij delegeren. **De patronen zijn achteraf vastgesteld uit schermopnames, met elk 2–7 personen, dus ze zijn correlationeel.** Misschien kiezen sterkere of gemotiveerdere deelnemers ze gewoon.
    - **Leverancier:** een studie van een leverancier, maar de uitkomst gaat in tegen het commerciële belang van die leverancier.
- **Lehmann, Cornelius & Sting (2025), arXiv-preprint, nog niet gepubliceerd.** *Grade A voor het nuleffect, C voor de rest.*
    - **Opzet:** een veldstudie (observationeel) plus twee vooraf geregistreerde labexperimenten waarin alleen de toegang tot LLM's werd gerandomiseerd.
    - **Gemiddeld effect:** **geen van beide labexperimenten vond een gemiddeld effect op het leren** (n = 107 en n = 69).
    - **Oplossingen tegenover uitleg:** het contrast tussen vragen om oplossingen (breedte zonder diepte) en vragen om uitleg (diepte) komt uit de observationele data.
    - **"Groeiende kloof":** de kloof tussen studenten met weinig en veel voorkennis komt uit een **verkennende** mediaansplitsing (gepoolde n = 176, interactie p = 0.028).
- **Fan et al. (2025), BJET, "metacognitieve luiheid".** *Grade B.* Labexperiment, 117 studenten in vier condities: ChatGPT, een menselijke expert, schrijfanalysetools, niets. ChatGPT verbeterde het essay als *product* het meest, maar kenniswinst en transfer verschilden niet. "Metacognitieve luiheid" is de interpretatie van de auteurs, geen gemeten uitkomst.
- **Stadler, Bannert & Sailer (2024), Computers in Human Behavior.** *Grade B.* Gerandomiseerd; 91 studenten; ChatGPT-3.5 tegenover zoeken met Google. LLM's verminderden de mentale inspanning tijdens wetenschappelijk onderzoek, maar de redeneringen waren minder diep.
- **Darvishi et al. (2024), Computers & Education.** *Grade A.* Gerandomiseerd; 1,625 studenten in 10 cursussen. Studenten leunden op AI-hulp bij peerfeedback, en hun eigen prestaties daalden toen die hulp werd weggehaald. Strategieën voor zelfregulatie hielpen hen de regie te houden.
- **Kestin et al. (2025), Scientific Reports.** *Grade B, alleen korte termijn.* Cross-over van twee weken in een natuurkundecursus aan Harvard; 194 van de 233 studenten geanalyseerd. Een AI-tutor die was gebouwd op didactische best practices, won van actief leren in de klas (0.73–1.3 SD), in minder tijd (mediaan 49 tegenover ongeveer 60 minuten). Beperkingen:
    - de natoets kwam **direct na elke les, zonder retentietoets**;
    - de tutor werd thuis gebruikt;
    - hij leunde op vooraf geschreven antwoorden.
- **Kosmyna et al. (2025), arXiv-preprint, niet peer-reviewed.** *Grade C.* 54 deelnemers, en maar 18 in de vierde sessie. Bij een essaytaak liet de LLM-groep de laagste EEG-connectiviteit zien, het laagste gevoel van eigenaarschap en een slechte herinnering aan de eigen essays ("cognitieve schuld"). Er bestaat een formele methodologische kritiek (Stanković et al., 2026).
- **Gerlich (2025), Societies; Lee et al. (2025), CHI.** *Grade C.* Allebei correlationeel:
    - Gerlich: een enquête onder 666 mensen, met een gepubliceerde correctie op een tabel.
    - Lee et al.: een enquête met zelfrapportage onder 319 kenniswerkers (936 voorbeelden), door auteurs van Microsoft.

    Meer AI-gebruik en meer vertrouwen in AI gaan samen met minder inspanning voor kritisch denken. Bij kenniswerkers verschuift kritisch denken naar het controleren van uitvoer.

- **Anthropic (2025a), Education Report.** *Grade C, data van de leverancier.* 574,740 gesprekken van studenten; **≈ 47% was "direct"**: de student wilde het antwoord, met zo min mogelijk eigen inbreng. Studenten delegeerden ook taken van hogere orde, zoals creëren en analyseren. Informatica was goed voor 36.8% van de gesprekken (38.6% in de hoofdtekst van het rapport), tegenover 5.4% van de Amerikaanse diploma's.
- **Productiviteit is geen leren.**
    - **Peng et al. (2023):** ontwikkelaars waren 55.8% sneller met Copilot (95% CI 21–89%) bij één goed gespecificeerde greenfield-taak. Er werden 95 mensen geworven, en per groep maakten 35 het af. Preprint, door auteurs van GitHub en Microsoft.
    - **METR (Becker et al., 2025):** 16 ervaren open-sourceontwikkelaars, die aan 246 van hun eigen taken werkten, waren **19% langzamer** met tools uit begin 2025 (CI +2% tot +39%). Vooraf hadden ze 24% versnelling voorspeld, en achteraf dachten ze dat het 20% was geweest.
    - **METR-vervolgstudie (februari 2026):** 57 ontwikkelaars en meer dan 800 taken gaven geschatte versnellingen van 18% en 4%, allebei met intervallen waarin nul valt. METR noemt de data onbetrouwbaar, omdat 30–50% van de ontwikkelaars taken achterhield die ze niet zonder AI wilden doen. METR ontwerpt de studie opnieuw.

    Gevoelde en werkelijke winst kunnen uit elkaar lopen, zelfs bij experts.

- **"Leermodi" van leveranciers.** Een aantal producten bouwt didactiek in het gedrag van het model in:
    - de output style *Learning* van Claude Code, met `TODO(human)`-markeringen;
    - de study mode van ChatGPT van OpenAI (juli 2025);
    - Guided Learning van Google in Gemini (augustus 2025); LearnLM is geen apart model meer.

    Ze zijn allemaal **opt-in en makkelijk uit te zetten**, geen enkele houdt beheersing per vaardigheid bij, en er is **geen evaluatie van hun leeropbrengst** gevonden.

**Nieuw bewijs, mei–november 2026:**

- **Experiment in Maryland (Liu et al., 2026; working paper).** *Grade A, niet peer-reviewed.*
    - **Opzet:** gerandomiseerd per docent; 2,379 bachelorstudenten en 30 docenten. Een GPT-4o-tutor was in de cursus ingebouwd, vooral in een modus met directe antwoorden, en beide groepen hadden ook ChatGPT en Gemini. Maar ongeveer 15% van de studenten gebruikte de tutor.
    - **Cijfers:** de eindcijfers daalden met **0.37 SD** in vergelijkingen binnen dezelfde cursus. Over de hele steekproef was de daling niet significant.
    - **Betrokkenheid:** de geregistreerde deelname daalde met 0.90 SD.
    - **Kansengelijkheid:** eerstegeneratiestudenten verloren meer (−0.50 tegenover −0.22 SD).
    - **Gebruik:** 73.8% van de verzoeken vroeg om informatie, uitleg of oplossingen; 0.7% vroeg om feedback op eigen werk van de student.
- **Experiment in Middlebury (Contractor & Reyes, 2026; working paper).** *Grade A, niet peer-reviewed; één korte taak.*
    - **Opzet:** gerandomiseerd en onder toezicht; 211 bachelorstudenten hadden een leerfase van 35 minuten over een onbekend onderwerp en maakten daarna alle toetsen zonder AI.
    - **Resultaat:** toegang tot ChatGPT **verhoogde** de toetsscores zonder AI met 0.28 SD, en een week later met ongeveer 0.21 SD (p = 0.068).
    - **Soort gebruik:** studenten die het als tutor gebruikten, gingen erop vooruit. Studenten die het voor zich lieten schrijven, verloren hun voorsprong bij het essay zodra AI werd weggehaald. Die tweedeling is zelfgekozen.
    - **Kanttekeningen:** niet over programmeren; cijfers uit de HTML-versie op arXiv.
- **Experiment met beheersingsoefening (Oreopoulos, Liut, Sungu & Low, 2026; working paper; middle school).** *Grade A, K-12.* Individueel gerandomiseerd; meer dan 6,000 leerlingen. Een tutor met vangrails verbeterde een toets na één week met maar **3.1 procentpunt (p = 0.065)**, en alleen binnen een werkwijze gericht op beheersing. Beheersing alleen verbeterde het leren bij een latere meting niet. Eén auteur is co-auteur van Bastani et al.
- **Veldexperiment bij een MBA (Yang, Van Alstyne & Dellarocas, 2026; preprint).** *Grade B.* Vooraf geregistreerd; 86 studenten. Een gestructureerde tutor die op de cursus was gebaseerd, won met 6.63 punten van vrij beschikbare consumenten-AI (p = .007).
- **"Leerstraf van generatieve AI" (Strömberg, Lei & Wu, 2026; CEPR working paper).** *Grade B, quasi-experimenteel, geen hoger onderwijs.* Difference-in-differences bij 26,811 leerlingen in het voortgezet onderwijs in China. Na de invoering van AI stegen de huiswerkscores met 18%, terwijl de scores op toetsen met gesloten boek binnen zes maanden met ongeveer 20% daalden. Ongeveer 80% van de gebruikers liet tekenen zien dat ze hun huiswerk uitbesteedden.
- **AI-tutors helpen te veel (Teo et al., 2026; preprint).** *Grade C.* In simulaties grijpen LLM-"docenten" eerder en vaker in dan menselijke docenten, en delen ze complete oplossingen uit in plaats van gerichte hints.
- **Meta-analyses.** De strengste (Boolzen et al., 2026, *Artificial Intelligence Review*, vooraf geregistreerd) poolde 49 studies naar AI in het STEM-onderwijs:
    - de ongecorrigeerde g = 0.84 zakt naar **0.08 na correctie voor publicatiebias**;
    - geen van de 34 gerandomiseerde experimenten had een laag risico op bias;
    - 33 studies lieten alleen grote effecten zien omdat de twee groepen ander cognitief werk deden;
    - AI hielp als die de activiteit van de student versterkte, en kon schaden als die de activiteit verving.

    Twee andere meta-analyses uit 2026 melden g = 0.50 en g = 1.10 zonder correctie voor bias (Fan, Ke, Chen & Lv, 2026; Liu, Xie & Xu, 2026). De meest geciteerde meta-analyse uit 2025 (Wang & Fan, g = 0.87) **werd in 2026 ingetrokken** na kritiek op de methoden. Hij was meer dan 500 keer geciteerd. *Ongecorrigeerde gepoolde effecten moet je niet aanhalen als bewijs dat AI het leren verbetert.*

    Een onafhankelijke audit (O'Neill, 2026, preprint op EdArXiv) van 14 van de 39 meta-analyses met positieve effecten vond "onmogelijke statistiek", "gehallucineerde referenties", vergelijkingen van studeren met AI-hulp met helemaal niet studeren, en geen correctie voor publicatiebias. Twee derde van de calls for papers leek nul- of negatieve resultaten te ontmoedigen. Zijn voorlopige pooling van 44 goed opgezette experimenten kwam gemiddeld uit op ongeveer nul. *Voorlopig; bekend uit de pers, de preprint zelf is niet gelezen.*

- **Bewijsoverzicht van Stanford SCALE (Walker, Fesler, Martinez Claeys, Agnew & Loeb, 10 november 2026).** *Een gescreende synthese, geen meta-analyse.* Een LLM screende 868 papers van oktober 2025 tot juni 2026 vooraf op de criteria van de What Works Clearinghouse, en minstens twee onderzoekers beoordeelden elke causale paper. 52 papers halen nu de lat voor sterk causaal bewijs, waarvan 32 nieuw. Ondanks de titel ("K-12") komen de meeste nieuwe papers uit het hoger onderwijs, en het grootste deel van de verzameling bestaat uit preprints zonder peer review. De conclusies:
    - AI "lijkt beter voor het leren als studenten het gebruiken als ondersteuning bij het leren dan om werk te maken, al verbetert geen van beide soorten gebruik het leren consequent";
    - werk uitbesteden aan AI kan de prestatie verlagen als studenten later zonder AI werken;
    - AI kan de *ervaring* van het leren verbeteren zonder de leeruitkomsten te verbeteren;
    - het bewijs "laat nog steeds niet zien of AI-tools blijvende leerwinst kunnen opleveren".
- **Opdrachten geven een te rooskleurig beeld van beheersing.**
    - **Đức Minh (2026):** *grade C, observationeel.* Bij 1,498 Vietnamese bachelorstudenten was het gemiddelde voor opdrachten met AI-hulp 7.62, terwijl beheersing die willekeurig en zonder apparaten werd gecontroleerd, gemiddeld 5.55 was.
    - **Eleftheriou, Pallis & Constantinides (2026):** *grade B; april, net voor de zoekperiode; n = 85.* Een standaard-LLM gaf het hoogste *gevoelde* begrip en het laagste *gemeten* leren, en begeleide hints gaven de grootste winst.
- **Agentische tools en OOD: een bewijsvacuüm.** Er is nog geen gecontroleerde studie die het leren van studenten meet met Claude Code, Cursor, Copilot agent mode of Codex. Geen studie meet ontwerpvaardigheid zonder AI na oefenen met AI-hulp. Het enige UML-experiment (EDULEARN26) mat prestaties en beleving alleen *met* ChatGPT. Alles wat dit document zegt over agentische tools, is doorgetrokken uit studies naar chat en autocomplete.

**Wat het bewijs ondersteunt, en hoe sterk:**

- **Sterk (meerdere grade-A-studies zijn het eens): presteren met AI is geen leren.** Als AI tijdens het oefenen het cognitieve werk doet, zijn de prestaties zonder AI later gelijk of lager (Bastani; Liu; Gardella; Strömberg; en met grade B: Bergh na 48 uur en Albadarin na zeven weken). Als AI uitlegt of als tutor begeleidt, lopen de resultaten van geen schade tot bescheiden winst (de tutor van Bastani; Contractor & Reyes; Kazemitabaar 2023). De moderator van Boolzen, versterken tegenover vervangen, zegt hetzelfde, en het overzicht van 52 causale studies van Stanford SCALE ook (november 2026).
- **Matig: vangrails werken als ze in de werkwijze worden afgedwongen** (beheersingspoorten, uitlegpoorten, gestructureerde tutors, blokkades buiten het model), en veel minder als er alleen in een systeemprompt om wordt gevraagd (het nulresultaat van Barth; de tutors van Teo die te veel helpen). Dat pleit voor de hooks van de harnas in plaats van te vertrouwen op een prompt voor een "leermodus".
- **Zwak, alleen correlationeel: dat bepaalde interactiepatronen beter leren veroorzaken.** Het gaat om vragen om uitleg en eerst zelf proberen. In elke studie tot nu toe koos de student het patroon zelf (Shen & Tamkin; Contractor & Reyes; Kazemitabaar 2023b). Geen enkel gerandomiseerd experiment heeft eerst zelf proberen vergeleken met eerst AI. Het idee van de patronen is de beste werkhypothese, geen bevinding. Het past bij het experimentele resultaat dat alleen uitleg *zonder* het antwoord tot leren leidde (Gajos & Mamykina, 2022; §2.10). Een observationele OOP-studie voegt een nulresultaat toe: studenten met een "slim" gebruiksprofiel scoorden op toetsen zonder AI niet beter dan de andere profielen (Lepp, 2026).
- **Kansengelijkheid: zwakkere studenten en eerstegeneratiestudenten lijden meer schade en gebruiken vaker nooduitgangen** (Liu; Kapoor et al., 2025; Lehmann, verkennend; Prather, kwalitatief). **Vangrails zijn het belangrijkst voor de studenten die er het minst snel zelf voor kiezen.**
- **Onbekend of dun:** retentie na meer dan ongeveer een week in het hoger onderwijs (tot nu toe één quasi-experiment, over debuggen, met een toets na zeven weken: Albadarin, 2026), agentische tools, en OOD-vaardigheid op ontwerpniveau.
## 2.10 Automatisering, uitbesteden, overmatige afhankelijkheid en vaardigheidsverlies

- **Cognitief uitbesteden.** Mensen besteden denkwerk uit aan externe hulpmiddelen als dat goedkoper is (Risko & Gilbert, 2016). Uitbesteden gaat niet alleen ten koste van het geheugen:
    - **Vrijgekomen capaciteit:** informatie opslaan kan ruimte vrijmaken voor nieuwe stof ("saving-enhanced memory"; Storm & Stone, 2015, met latere replicaties).
    - **Parallelle taken:** het verbetert de prestatie op een taak die je tegelijk uitvoert (Grinschgl et al., 2023).
    - **De prijs:** het verlaagt het geheugen voor de uitbestede inhoud, vooral als er geen expliciet doel is om die te leren. Een expliciet doel heft de prijs bijna op (Grinschgl, Papenmeier & Meyerhoff, 2021).

    Dat is de grens die de harnas trekt. Besteed tooling en boilerplate vrij uit (L4), maar niet de vaardigheid die je aan het leren bent. Maak het leerdoel expliciet (eerst zelf proberen, uitleggen in je eigen woorden).

- **Het "Google-effect" is omstreden.** Sparrow, Liu & Wegner (2011) meldden dat mensen onthouden *waar* informatie staat in plaats van de informatie zelf.
    - **Mislukte replicaties:** hun eerste experiment kon niet worden gerepliceerd (Camerer et al., 2018; Hesselmann, 2020).
    - **Nooit gerepliceerd:** het experiment over "waar, niet wat" is nooit direct gerepliceerd.
    - **Wat wel gerepliceerd werd:** opgeslagen informatie wordt minder goed onthouden, maar alleen als het opslaan als betrouwbaar wordt ervaren (Schooler & Storm, 2021).

    Een AI-tutor die altijd beschikbaar is, is precies die betrouwbare situatie. Dat pleit voor bewust oefenen zonder AI.

- **Ironieën van automatisering.** Bainbridge (1983) wees erop dat het automatiseren van routinewerk de oefening weghaalt die operators nodig hebben voor de zeldzame moeilijke gevallen. Hoe betrouwbaarder de automatisering, hoe minder goed de mens het werk kan overnemen.
- **Zelfgenoegzaamheid en automatiseringsbias.** Parasuraman & Manzey (2010) lieten zien dat mensen betrouwbare automatisering te veel vertrouwen en te weinig in de gaten houden. Endsley & Kiris (1995) lieten zien dat operators die *out-of-the-loop* zijn hun situationeel bewustzijn verliezen. Parasuraman, Sheridan & Wickens (2000) stelden voor om per functie *automatiseringsniveaus* te kiezen. Dat is precies het idee achter niveaus per vaardigheid.
- **Mensen dwingen eerst na te denken werkt, maar het heeft een prijs.**
    - **Eerst beslissen:** ontwerpen waarbij mensen beslissen voordat ze het antwoord van de AI zien, of die het antwoord uitstellen of verbergen, verminderen overmatige afhankelijkheid. Dat werkt beter dan alleen een uitleg tonen. Gebruikers beoordelen deze ontwerpen het minst gunstig, en mensen met een hoge behoefte aan cognitie hebben er het meeste aan (Buçinca, Malaya & Gajos, 2021; n = 199).
    - **Alleen uitleg:** uitleg *verhoogt* de acceptatie van AI-advies, of dat nu goed of fout is (Bansal et al., 2021). Dat is anders als de uitleg controleren goedkoper maakt dan de taak zelf doen (Vasconcelos et al., 2023).
    - **Leren:** dit is het belangrijkste resultaat voor een tutor. Bij Gajos & Mamykina (2022) leidde eerst beslissen en dan de aanbeveling van de AI zien tot betere beslissingen, maar **niet tot leren**. Alleen een uitleg *zonder* het antwoord, zodat mensen zelf tot het antwoord moesten komen, leverde leerwinst op.
    - **Nooduitgangen worden gebruikt:** in één cursus gebruikte 50% van 885 studenten minstens één keer een optionele knop "See Solution". Studenten die zwakker presteerden, gebruikten die vaker, en vaker vlak voor deadlines (Kapoor et al., 2025, preprint).
- **Vaardigheidsverlies in de beroepspraktijk.** Het eerste sterke signaal uit de praktijk komt uit de geneeskunde. Na routinematig gebruik van AI-ondersteunde coloscopie daalde het adenoomdetectiepercentage van ervaren endoscopisten *zonder* AI van 28.4% naar 22.4% (Budzyń et al., 2025; observationeel, 19 endoscopisten in vier Poolse centra).
    - **Geen longitudinale softwarestudie:** voor softwareontwikkelaars is er nog geen longitudinale studie naar het afnemen van vaardigheden.
    - **De studie van Anthropic naar de eigen engineers:** 132 ondervraagd en 53 geïnterviewd; een bron van de leverancier, en niet anoniem. De studie meldt dat het zelfgerapporteerde gebruik van Claude steeg van 28% naar 59% van hun werk, en ze meldt zorgen over het verkommeren van vaardigheden. Ze noemt de **"paradox van het toezicht"**: het controleren van AI-uitvoer vraagt precies de vaardigheden die delegeren aan AI uitholt (Anthropic, 2025b).
    - **Junioren:** geïnterviewden beschrijven hoe instapwerk wordt opgeslokt door de AI-workflows van senioren. Junioren verliezen zo de "productieve worsteling" waardoor expertise ontstaat (Yu & Moon, 2026; 14 interviews). §2.12 werkt dit uit voor junior developers op hun werk.
    - **Voor een student is het scherper:** een engineer moet toezichtvaardigheden *behouden*, een student moet ze *verwerven*. Medisch opleiders noemen dit "never-skilling" (Abdulnour, Gin & Boscardin, 2025).

**Gevolg:** een beheerste vaardigheid automatiseren is prima, en dat is ook het doel van het systeem. Er gelden drie voorwaarden:

- **(a) Toezicht houden:** de mens houdt een *toezichthoudende* rol. Die reviewt AI-uitvoer, voorspelt die en controleert steekproeven.
- **(b) Onderhouden:** de vaardigheid krijgt *periodieke onderhoudsoefening*, zodat het vermogen om toezicht te houden en het werk over te nemen niet afneemt.
- **(c) Toezicht zelf trainen:** toezicht is een vaardigheid die je bewust moet oefenen (§2.9). Het komt niet vanzelf door met de hand code te schrijven, en ook niet door te delegeren.

## 2.12 Het eeuwige-juniorprobleem

**Het probleem.** Een junior developer die werk aan een agent overlaat voordat het zelf lukt, krijgt het werk wel af, maar bouwt de vaardigheden niet op die een medior of senior maken: debuggen, code lezen, ontwerpoordeel en het controleren van AI-uitvoer. Het werk ziet er productief uit, dus het gat blijft verborgen. Medisch opleiders noemen de variant bij artsen in opleiding "never-skilling" (Abdulnour, Gin & Boscardin, 2025). Dit onderzoek noemt het het **eeuwige-juniorprobleem**. Het is een andere vraag dan die in §2.9. Daar gaat het erom of juniors nog worden aangenomen; hier of de juniors die worden aangenomen nog groeien.

**Bewijs dat het mechanisme echt is.**

- **Experiment.** In een gerandomiseerd experiment met 52 vooral junior engineers die een nieuwe library leerden, scoorde de AI-groep achteraf 50% tegenover 67% op een quiz. Wie het schrijven van code aan de AI overliet, scoorde onder de 40%; wie de AI conceptuele vragen stelde, 65% of meer. De AI-groep was niet significant sneller (Shen & Tamkin, 2026; bewijsgraad B, korte termijn, leverancier).
- **Interviews in softwareteams:**
    - Instapwerk wordt opgeslokt door de AI-workflows van seniors. Juniors verliezen de productieve worsteling waardoor expertise ontstaat, en seniors en juniors zien de situatie verschillend (Yu & Moon, 2026; 14 interviews; bewijsgraad C).
    - Juniors schommelen "between over-reliance and cautious avoidance". Seniors sturen de AI met vaardigheden die ze opbouwden voordat er AI was. Wat juniors met AI mogen, wordt vooral bepaald door het beleid van hun organisatie (Feng, Yun & Wang, 2026; 10 juniors en 10 seniors; bewijsgraad C).
    - De eigen engineers van Anthropic maken zich zorgen over het verkommeren van vaardigheden en beschrijven de "paradox van het toezicht" (Anthropic, 2025b; bewijsgraad C, leverancier; §2.10).
- **Andere beroepen:**
    - **Robotchirurgie.** Artsen in opleiding kregen veel minder praktijk dan bij open chirurgie. Wie toch vaardig werd, deed dat via "shadow learning" buiten de goedgekeurde routes. Dat leidde tot hyperspecialisatie en minder experts (Beane, 2019; een etnografie van twee jaar op vijf locaties plus interviews in 13 academische ziekenhuizen; bewijsgraad C). Beane (2024) trekt dit breder naar slimme technologie op het werk: vaardigheid groeit door uitdaging, complexiteit en contact met experts, en technologie die wordt ingezet om experts productiever te maken, tast alle drie aan.
    - **Geneeskunde.** Ervaren endoscopisten vonden zonder AI minder adenomen nadat ze routinematig met AI hadden gewerkt (Budzyń et al., 2025; §2.10).

**Ontwikkelaars beschrijven hetzelfde patroon (bewijsgraad D).** Sinds 2024 beschrijven engineers, managers en bestuurders het in talks, interviews, nieuwsartikelen en blogs. De citaten en links staan in de [notities](/notes/eternal_junior/#3-practitioner-sources-talks-interviews-news-and-blogs-grade-d){ hreflang="en" } (Engels).

- **Juniors die niet groeien.** "The output looked senior. The understanding was still junior" (Scalzo, LeadDev 2026). AI heeft de leerervaringen van elke trede van de loopbaanladder weggehaald: "The result is juniors who ship like mids but can't debug like them" (Allan, QCon London 2026). Juniors die de "hard way" overslaan, "may plateau early" (Osmani, 2025). In een enquête van The Pragmatic Engineer (2026) krijgen juniors minder taken waaraan ze kunnen groeien.
- **De pijplijn.** Het kost "seven-plus years" om een bekwame engineer te vormen, en geen juniors opleiden is "cannibalizing our own future" (Majors, 2024). De CEO van AWS noemde juniors vervangen door AI "the dumbest thing I've ever heard" (Garman, 2025). Twee leidinggevenden van Microsoft beschrijven een "AI drag" voor beginnende developers en stellen een preceptorprogramma met senior mentoren voor (Russinovich & Hanselman, CACM 2026).
- **Nederland.** In een enquête van YouGov voor recruiter SThree (793 Nederlandse bèta-technische professionals, 2026) zegt vier op de tien dat seniors nu werk doen dat vroeger bij juniors lag. Het werk waarmee juniors het vak leren, wordt steeds vaker door AI gedaan (AG Connect, 2026).
- **De oplossingen die ze voorstellen, lijken op de harnas.** Probeer het 15–30 minuten zelf voordat je de AI vraagt, een dag per week zonder AI, een leerdagboek, en de oplossing van de AI in eigen woorden uitleggen (Osmani, 2025); sessies zonder AI en "Explain the Machine" (Scalzo, 2026); "manage juniors for learning, not production" (Beck, 2025). Dat is een overeenkomst in richting, geen bewijs dat de harnas werkt.
- **Tegengeluiden.** Beck (2025) en Willison (2025) zien AI als een geduldige tutor die leren versnelt, op één voorwaarde: besteed niet "the bits you need to learn" uit (Willison). Juniors nemen AI sneller over dan seniors (Yegge, 2025). Juniors passen zich wel aan, en seniors die nooit zijn gegroeid zijn het grotere risico (Danjou, 2026). Een directeur van Randstad noemt de daling in het aannemen van junior IT'ers vooral conjunctureel (AG Connect, 2026). In een enquête van een leverancier zegt 85% van de juniors dat AI hun begrip verbeterde, terwijl 16% van de seniors denkt dat juniors de AI-code die ze inleveren volledig begrijpen (BairesDev, 2026).
- **Belangen.** Veel van deze stemmen hebben een belang: AI-leveranciers (AWS, Microsoft, GitHub, Google, Sourcegraph) en recruiters of uitzendbureaus (SThree, Randstad). Ook de leveranciers zelf waarschuwen.

**Tegenbewijs.**

- **AI kan op het werk ook leren.** In een callcenter met 5,172 medewerkers hielp een AI-assistent beginners het meest. Viel de AI uit, dan handelden medewerkers met drie maanden AI-ervaring hun chats nog steeds sneller af dan voorheen, maar alleen als ze de suggesties van de AI nauw hadden gevolgd (Brynjolfsson, Li & Raymond, 2025; bewijsgraad B; de auteurs noemen de schattingen tijdens storingen onnauwkeurig). Daar deden de medewerkers het werk nog zelf en zagen ze hoe klanten reageerden. Een agent die de code schrijft, neemt juist dat deel over.
- **De kosten zijn echt.** Juniors winnen de meeste productiviteit met AI-tools (Cui et al., 2025). Elk uur oefenen met de hand op L1–L3 is een uur tragere uitvoer. De kosten zijn misschien het kleinst zolang een vaardigheid nieuw is: bij Shen & Tamkin (2026) was de AI-groep niet significant sneller bij het leren van een nieuwe library.

**Wat ontbreekt.** Geen enkele studie heeft juniors op hun werk over langere tijd gevolgd. Geen enkele studie meet de beste mix van oefenen met de hand en uitbesteden (§2.9). Het bewijs van de werkvloer is kwalitatief, klein en recent.

**De afweging van de harnas.** De harnas verbiedt AI niet. Hij koppelt het moment van uitbesteden aan beheersing, per vaardigheid:

| Fase | Niveaus | Wat er gebeurt | Principes |
|---|---|---|---|
| **Opbouwen** | L0–L3 | De junior schrijft de code. De AI doet voor, geeft een skelet of geeft hints. Een taak telt na een uitleg in eigen woorden. | P1–P6, P11 |
| **Uitbesteden** | L4 | De AI doet het werk meteen, en de junior houdt toezicht. | P7, P13 |
| **Onderhouden** | L4 | Met Fibonacci-intervallen doet de junior dat deel de eerstvolgende keer dat de vaardigheid in echt werk langskomt zelf, zonder AI. Gaat het mis, dan zakt de vaardigheid. | P8 |

De luchtvaart maakte dezelfde afweging. Verkeersvliegers houden het grootste deel van de tijd toezicht op de automatische piloot. In een simulatorstudie met 16 verkeersvliegers bleef het met de hand vliegen grotendeels goed. Bij de denkvaardigheden van handmatig vliegen, zoals de positie van het vliegtuig bijhouden, de volgende stap bepalen en storingen herkennen, ontstonden vaker en grotere problemen, en die gingen samen met afdwalende gedachten terwijl de automatische piloot vloog (Casner et al., 2014; bewijsgraad C). De FAA moedigt luchtvaartmaatschappijen aan om piloten gelegenheid te geven met de hand te vliegen, en handmatig vliegen op te nemen in training en controles (FAA, 2013, 2017; beleid, bewijsgraad D). Dat is onderhoud op L4: uitbesteden, en het af en toe toch zelf doen. Bij software telt juist de denkkant het zwaarst: ontwerpen, debuggen en code lezen.

**Wat de harnas niet oplost.**

- **Contact.** Contact met experts, de derde voorwaarde van Beane, levert een tool niet. De harnas vervangt geen mentor en geen review door een senior.
- **De organisatie.** Of een junior tijd krijgt om met de hand te oefenen, hangt af van het team (Feng, Yun & Wang, 2026; Yu & Moon, 2026). De harnas is een zelfbindingsmechanisme dat de junior zelf kiest (P10). Legt een werkgever hem op, dan geldt dat argument niet meer, en dan vragen de leerdata om andere privacyregels.
- **De kaart.** Er is een voorbeeldkaart voor juniors op het werk in C#/.NET (`junior-dotnet`). Daarin staat code buiten de vaardigheden van de kaart op L4: die mag de AI schrijven, en alleen de vaardigheden die je leert, zijn beschermd. Een junior moet de paden aanpassen aan de eigen codebase, de guard beschermt alleen vaardigheden met paden, en taken automatisch vastleggen vanuit tests werkt alleen met `dotnet test`.

**Hoe sterk is dit?** Elk onderdeel van de afweging volgt een principe met empirische steun (§2.11). De combinatie, en het gebruik op het werk, zijn niet getest. Een narratief literatuuroverzicht kan niet laten zien dat dit de beste afweging is; alleen een experiment kan dat. §6.1 stelt er een voor. De bronnen, met een link bij elke bewering, staan in de [notities over het eeuwige-juniorprobleem](/notes/eternal_junior/){ hreflang="en" } (Engels).

## 2.13 Veilige code als eerste niche voor juniors

**Het probleem.** Een junior vraagt Claude Code om een zoekpagina die de zoekterm van de gebruiker terugtoont. De code compileert, de tests slagen en de pagina werkt. Of de zoekterm wordt gecodeerd voordat die in de HTML komt, ziet de junior niet, en juist daar gaat AI-code het vaakst mis. Bij security komt er dus een tweede gat bij het gat van §2.12: code die werkt, maar niet veilig is. Deze sectie vraagt of veilig programmeren een goede eerste niche is voor de harnas, en welke invalshoek dan past bij de huidige fase van het project: (A) junior developers die op het werk basale security leren, of (B) junior securityspecialisten in een SOC, als pentester of als AppSec-engineer. Alle bronnen hieronder zijn op 13 november 2026 nagelopen ([citatiecheck](https://github.com/piethanegraaf/piethanegraaf.github.io/blob/main/research/citation-checks/citation_check_learning_science.md), sectie H).

**AI-code is vaak onveilig, vooral als een agent een hele feature bouwt.**

- **Losse codefragmenten.** In securityscenario's was ongeveer 40% van de programma's van Copilot kwetsbaar (Pearce et al., 2022; bewijsgraad C). Een replicatie in Python zag dat aandeel dalen van 36,5% naar 27,3% (Majdinasab et al., 2024; C). In echte GitHub-projecten had 29,5% van de Python-fragmenten en 24,2% van de JavaScript-fragmenten van AI-assistenten een zwakte, verspreid over 43 CWE-typen (Fu et al., 2025; C).
- **Hele features.** In BaxBench was het beste model in 35% van de backendtaken correct én veilig (Vero et al., 2025; C). In SusVibes, met echte feature-verzoeken voor agents, was de beste opzet (SWE-agent met Claude 4 Sonnet) in 57% van de taken functioneel correct, maar in 11,8% ook veilig. Het type kwetsbaarheid in de prompt noemen hielp nauwelijks (Zhao et al., 2026; C).
- **Per taal en soort fout.** In de meting van oktober 2026 van Veracode haalde C# 60%. Cross-site scripting ging in 18% van de gevallen goed en log injection in 13%, terwijl SQL injection (84%) en cryptografie (87%) meestal goed gaan. De beste modellen, waaronder Claude Opus 5.5, kwamen op 73% (Veracode, 2026; C, leverancier).
- **Nieuwe soorten fouten.** Codemodellen verzinnen pakketnamen: minstens 5,2% bij commerciële en 21,7% bij open-sourcemodellen. Een aanvaller kan zo'n naam registreren (Spracklen et al., 2025; C).

**Het hardnekkigste effect is vertrouwen dat niet klopt.** In een gerandomiseerde studie schreven deelnemers met een AI-assistent minder veilige code en dachten ze vaker dat die veilig was. Wie de AI minder vertrouwde, deed het beter (Perry et al., 2023; B, n = 47). Andere experimenten vonden geen of maar een klein verschil in de code zelf (Sandoval et al., 2023; Mousavi et al., 2026; Jost et al., 2026, preprint; alle B). Wat wel steeds terugkomt, is dat mensen niet merken dat hun code onveilig is. Ontwikkelaars zeggen dat ze AI-code net zo controleren als code van een collega, en melden zelden securityproblemen. De auteurs concluderen dat ze hun eigen controle overschatten (Klemmer et al., 2024; C). Deelnemers kozen de veiligste en de onveiligste AI-suggestie ongeveer even vaak (37,7% tegen 35,0%), en wie suggesties meer bewerkte, had minder kwetsbaarheden (Khalid et al., 2026; C, verschijnt bij IEEE S&P 2027). Bijna niemand zette securityeisen in de eerste prompt (Bappy et al., 2026; C).

Of juniors hier extra kwetsbaar voor zijn, is niet aangetoond. Ervaring voorspelde veilige code significant, maar bescheiden (Jost et al., 2026), en een studie die juniors en seniors met AI rechtstreeks op security vergelijkt, ontbreekt. De harnas kan dus zeggen: "bij security telt ervaring, en AI vervangt die niet". Hij kan nog niet zeggen dat juniors door AI extra gevaar lopen.

**Wat juniors missen.** Het probleem is begrip, geen slordigheid. In een wedstrijd waarin teams software bouwden, aanvielen en repareerden, kwamen de fouten in 78% van de 94 projecten uit een verkeerd begrip van securityconcepten, en in 21% uit een eenvoudige vergissing (Votipka et al., 2020; C). Security blijft bovendien een bijzaak zolang niemand ernaar vraagt. Geen van de tien studenten zonder opdracht sloeg wachtwoorden veilig op, en met opdracht deden vier van de tien het (Naiakshina et al., 2017; C). Freelancers deden het evenmin, tenzij erom werd gevraagd (Naiakshina et al., 2019; C).

Wat helpt, is aandacht op het moment van de beslissing. Reviewers die de opdracht kregen op security te letten, hadden ongeveer acht keer hogere odds om de kwetsbaarheid te vinden; een checklist voegde niets significants toe (Braz et al., 2022; B, n = 150, vooral professionals). Een plug-in die securityproblemen in de IDE markeerde, verminderde de fouten in de code die werd geschreven (Nguyen et al., 2017; B, n = 39). Zes uur workshops in drie maanden veranderde de praktijk van teams, en na twaalf maanden was dat nog te zien in de twee teams die opnieuw konden worden geïnterviewd (Weir et al., 2020; C). Geen enkele trainingsmethode is in een gerandomiseerd experiment met juniors op het werk getest.

**Wat werkgevers moeten aantonen.** Vacatures zeggen weinig: er is geen studie die securityeisen in vacatures voor developers telt. De druk komt uit wetten en normen, en bereikt de developer via de werkgever.

- **De Cyberbeveiligingswet** (Stb. 2026, 187), de Nederlandse invoering van NIS2, geldt sinds 15 augustus 2026 voor ruim 8.000 organisaties (Rijksoverheid, 2026; wet).
- **De Cyber Resilience Act** verplicht fabrikanten sinds 11 september 2026 om actief uitgebuite kwetsbaarheden binnen 24 uur vooraf te melden en binnen 72 uur te melden. Vanaf 11 december 2027 moeten producten met digitale elementen, op basis van de risicoanalyse, op de markt komen zonder bekende uitbuitbare kwetsbaarheden, en houdt de fabrikant een SBOM bij (Verordening (EU) 2024/2847; wet).
- **Normen en richtlijnen** maken het concreet. ISO/IEC 27001:2022 kreeg een eigen maatregel voor secure coding (A.8.28). NIST SSDF vraagt rolgebonden training (PO.2.2), veilige codeerpraktijken (PW.5) en codereview (PW.7). OWASP SAMM begint met bewustwording voor iedereen die software maakt, en niveau 1 van OWASP ASVS 5.0 is de basislijst. In het Nederlands zijn er de ICT-beveiligingsrichtlijnen voor webapplicaties van het NCSC (mei 2024).
- **Geen beroep, wel een deel van het vak.** Het Europese ECSF kent twaalf rolprofielen, en geen daarvan is softwaredeveloper (ENISA, 2022). Voor een developer is security dus geen functie, maar een vaardigheid binnen het eigen werk.

**Twee invalshoeken.**

| | A: junior developer leert veilig programmeren | B: junior securityspecialist |
|---|---|---|
| Waar het werk gebeurt | in codebestanden, waar de guard werkt | in terminals, tools en rapporten |
| Past bij C# en `dotnet test` | ja; `security.basics` staat al in `junior-dotnet` | nauwelijks |
| Wat de harnas raakt | het vertrouwen in AI-code, en uitleggen waarom iets veilig is | uitleggen en rapporteren wel, de guard niet |
| Nieuwe risico's | klein: defensief werk | dual-use: een agent met een shell kan scans of exploits draaien |
| Doelgroep | alle junior developers | kleiner, en de instroom krimpt |

Hoek B past slecht bij deze fase. SOC-analisten controleren alarmen met de hand (Alahmadi et al., 2022; C). Securitywerk vraagt veel technische kennis, maar de gevraagde taken en vaardigheden zijn grotendeels niet-technisch (PTvT & Dialogic, 2024; C). Het "antwoord" is daar een commando of een oordeel, en dat kan de AI in de chat geven zonder een bestand te schrijven. De tekorten zitten vooral bij medior en senior; het aanbod van junior hbo- en wo-afgestudeerden sluit volgens hetzelfde rapport aan op de vraag, behalve bij specialistische profielen. Van 856 securityprofessionals die AI gebruiken, zei 56% dat AI de behoefte aan instapfuncties al heeft verminderd (ISC2, 2026; C, brancheorganisatie). Het idee achter de hintladder werkt wel in securityonderwijs: op pwn.college vroegen 309 studenten een socratische tutor, die de oplossingen niet kende, in maar 3,5% van hun vragen direct om de oplossing (Tompkins et al., 2026; C).

**Het plan, als hypothese.** Hoek A wordt de eerste niche, als verdieping van `junior-dotnet` en niet als een nieuw product. Het sluit aan op wat het onderzoek het vaakst vindt: mensen merken niet dat AI-code onveilig is. De harnas laat al in eigen woorden uitleggen waarom iets werkt. Voor security wordt dat: wat heeft een aanvaller in handen, welke maatregel houdt dat tegen, en hoe controleer je dat? Op 13 november 2026 is gebouwd (§10.9):

- `security.basics` opsplitsen in vier vaardigheden: uitvoer coderen en invoer valideren, geparametriseerde queries, geheimen en configuratie, en AI-code reviewen op security;
- naast `dotnet test` een statische analyser waarvan de leerling de waarschuwingen zelf uitlegt, met de kanttekening dat een schone run niet betekent dat de code veilig is;
- een regel dat voorbeelden op trede 4 en 5 nooit een onveilig patroon bevatten, in elke kaart, ook `ood`, omdat Claude die voorbeelden zelf maakt;
- securitybevindingen uit de dashboardexport filteren, zodat er geen kwetsbaarheden van een werkgever online komen.

**Hoe sterk is dit?** Het bewijs dat AI-code vaak onveilig is, is breed, maar komt vooral uit benchmarks, en de cijfers per taal komen van een leverancier. Dat juniors extra kwetsbaar zijn, is niet aangetoond, en geen trainingsmethode is gerandomiseerd getest met juniors op het werk. Of de harnas juniors veiliger laat programmeren, is een hypothese voor het experiment van §6.1. Daar ligt ook een kans: geen studie meet met een agentische tool tegelijk of code veilig is en of de maker dat terecht denkt. De bronnen staan in de [notities over veilige code voor juniors](/notes/secure_coding_juniors/){ hreflang="en" } (Engels).
