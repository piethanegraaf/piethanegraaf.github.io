---
title: "Risico's van leren programmeren met AI, en hoe je ze verkleint"
description: "Achttien risico's van oefenen met een agentische programmeerassistent, gescoord op kans en impact met een bewijsgraad, en een plan van maatregelen voor studenten en docenten."
---
# Risicoanalyse en maatregelen

!!! warning "Machinevertaling"
    Dit is een machinevertaling door Claude (Anthropic) van het [Engelse origineel](/research/risks/). Een mens heeft de vertaling niet nagekeken. Bij twijfel geldt de Engelse tekst.

<a id="3-risicoanalyse"></a>

## 3. Risicoanalyse {#risks}

Kans (K) en Impact (I) krijgen een score van 1–5. Risico = K × I. De scores gaan uit van **geen maatregelen** voor een student die vóór een toets zonder AI oefent met een agentische codeerassistent, zoals Claude Code.

- **Oordelen, geen metingen:** de scores zijn oordelen. De bewijsgraad tussen haken (A–D, §2.0) laat zien hoe goed elk mechanisme is onderbouwd. Een hoge score met zwak bewijs is een reden om het risico goed in de gaten te houden, geen feit.
- **Horizon:** *Toets* betekent je toets zonder AI; *Loopbaan* betekent de arbeidsmarkt nadat je bent afgestudeerd.
- **Nieuw en gewijzigd:** R14–R18 zijn nieuw in de herziening van 8 november 2026, en R9 en R12 hebben een nieuwe score gekregen.

| ID | Risico | Mechanisme | Bewijs [bewijsgraad] | K | I | Score | Horizon |
|---|---|---|---|---|---|---|---|
| R1 | **Vaardigheden ontstaan nooit** | De AI schrijft de code en het ontwerp, en je bedenkt zelf nooit oplossingen. Agentische tools maken volledig delegeren de standaard. | Bastani 2025 [A]; Liu 2026 [A]; Shen & Tamkin 2026 [A]; Gardella 2026 [A, klein]; Strömberg 2026 [B]; Bergh 2026 [B]; Albadarin 2026 [B, zeven weken] | 5 | 5 | **25** | Beide |
| R2 | **Illusie van bekwaamheid** | Werkende code en vlotte uitleg zorgen ervoor dat je overschat wat je alleen kunt. | Koriat & Bjork 2005 [A]; METR 2025 [A]; Eleftheriou 2026 [B]; Prather 2024 [C]; Đức Minh 2026 [C] | 5 | 4 | **20** | Toets |
| R3 | **Metacognitieve luiheid** | Plannen, bewaken en debuggen worden uitbesteed aan de AI. | Darvishi 2024 [A]; Liu 2026 (0.7% van de verzoeken vroeg om feedback op eigen werk) [A]; Stadler 2024 [B]; Fan 2025 [B, interpretatie] | 4 | 4 | **16** | Beide |
| R4 | **Ontwerpoordeel ontwikkelt zich niet (specifiek voor OOD)** | De AI kiest klassen, verantwoordelijkheden en ontwerppatronen, dus je maakt zelf nooit afwegingen. | OOD-misvattingen: Eckerdal & Thuné 2005, Ragonis & Ben-Ari 2005 [C, van vóór AI]; AI het zwakst in interfaces, abstracte klassen en overerving (Lepp & Kaimre 2026) [C]. Er bestaat nog geen studie naar OOD-vaardigheid met AI | 4 | 5 | **20** | Beide |
| R5 | **Misbruik van hints / vangrails omzeilen** | Je stapt over op een chat zonder beperkingen of je herformuleert de prompt om antwoorden te krijgen, vooral onder tijdsdruk. | Aleven 2003; Baker 2004 [A/B]; CodeAid 2024 [C]; Kapoor 2025: 50% van 885 studenten gebruikte "See Solution", vaker vlak voor deadlines [C] | 4 | 4 | **16** | Toets |
| R6 | **Onproductieve worsteling → frustratie → opgeven** | De frictie staat te hoog en er komt geen hulp. | Kirschner 2006; Kapur 2016; Sinha & Kapur 2021 [A]; D'Mello 2014; Ryan & Deci 2000 | 3 | 4 | **12** | Toets |
| R7 | **Expertise-omkeereffect** | Dezelfde zware scaffolding (ondersteuning) wordt gebruikt voor vaardigheden die je al beheerst. Dat kost tijd en ergert je. | Kalyuga 2003 [A] | 3 | 3 | **9** | Toets |
| R8 | **Beheerste vaardigheden nemen af na automatisering** | Na het overdragen oefen je niet meer, dus je kunt niet meer reviewen of het werk overnemen. | Arthur 1998; Tatel & Ackerman 2025 [A, meta-analyses]; Budzyń 2025 [C]; Bainbridge 1983; Parasuraman & Manzey 2010 | 4 | 4 | **16** | Loopbaan |
| R9 | **Verkeerde dingen leren van foute AI-uitvoer** *(K verhoogd 3 → 4)* | Verzonnen API's, slechte OO-praktijk, onveilige code of subtiel foute uitleg worden overgenomen. | Hellas 2023 [C]; CodeAid 2024 [C]; Veracode 2026: 38% van de taken introduceert een kwetsbaarheid [C]; Lepp & Kaimre 2026 [C] | 4 | 4 | **16** | Beide |
| R10 | **Minder eigenaarschap over en geheugen voor je eigen werk** | Je kunt je project niet uitleggen of verdedigen bij een toets. Uitbestede inhoud wordt minder goed onthouden als de opslag betrouwbaar is. | Schooler & Storm 2021; Grinschgl 2021 [A, lab]; Kosmyna 2025 [C, preprint, bekritiseerd]; Bergh 2026 [B]: studenten rekenden met ChatGPT 45% van hun code aan zichzelf toe, tegen 81% zonder | 4 | 4 | **16** | Toets |
| R11 | **Problemen met toetsing en integriteit** | Beoordeeld werk is niet van jezelf, of AI-gebruik is niet gemeld. Ongeoorloofd AI-gebruik kan als fraude gelden, en werk op AI-niveau 1 kan promptlinks, APA-bronvermelding en een controle van de uitvoer vereisen. De regels van CHE zijn een voorbeeld (OER art. 1.41 en art. 7.11). Detectie is onbetrouwbaar, dus je eigen vastleggingen zijn je bescherming. | CHE OER 2026–27 [beleid]; Npuls 2025 [beleid]; Scarfe 2024 (94% van de AI-antwoorden onopgemerkt) [B]; Lau & Guo 2023 | 3 | 5 | **15** | Toets |
| R12 | **De harnas wordt het doel** *(nieuwe score, was 3 × 2)* | Tijd gaat naar het bijstellen van de opzet, of naar onderzoek erover (zoals het herzien van dit overzicht), in plaats van naar oefenen. Of het systeem wordt opgegeven. | Een diagnostische toets in de pilot (tijd ging naar een spiekbriefje in plaats van naar oefenen); in de pilot ging ook tijd naar het herzien van dit overzicht en het repareren van een hook; SDT | 4 | 3 | **12** | Toets |
| R13 | **Privacy van het dagboek en de vaardigheidsgegevens** | Reflecties, onderzoeksnotities en transcripten worden gesynchroniseerd naar cloudopslag (zoals OneDrive) of gedeeld, of er komt met een openbaar dashboard meer online dan de lerende bedoelde. | — | 2 | 2 | **4** | Beide |
| R14 | **Oefenen past niet bij de toets** *(nieuw)* | Je oefent met AI, zonder tijdsdruk, in de IDE die je gewend bent. De toets is zonder AI, op tijd, en misschien in een andere IDE. Een vaardigheid die je in de ene vorm oefent, geeft weinig transfer naar een andere vorm. | Een diagnostische toets in de pilot; transfer-appropriate processing (Morris 1977); Pan & Rickard 2018 [A, meta]; Hinze & Rapp 2014 [A]; geen IDE-specifieke studie | 5 | 5 | **25** | Toets |
| R15 | **Te veel investeren in productiecode met de hand schrijven** *(nieuw)* | Oefentijd gaat naar routinecode met de hand schrijven, meer dan nodig is om te leren (boilerplate, syntaxisdrills, beheerste code opnieuw schrijven). Ondertussen betaalt de markt voor specificeren, reviewen en verifiëren. | Routinecode is goedkoop te genereren: tool ongeveer 1–2% van de arbeidskosten [C]; claims van Google en Anthropic over het aandeel code [D]; Octoverse 2026 [C]; BLS: programmeurs −7% [C]. Lage kans met de harnas, omdat die beheerste vaardigheden al automatiseert (L4), en een toets zonder AI met de hand schrijven vereist | 2 | 3 | **6** | Loopbaan |
| R16 | **Toezichtvaardigheden blijven ongetraind** *(nieuw)* | De harnas blokkeert AI-code op L1–L3 en automatiseert op L4, maar niets traint het specificeren, testen, reviewen en debuggen van AI-uitvoer. Werkgevers testen deze vaardigheden nu, en delegeren holt ze uit ("paradox van het toezicht"). | Anthropic 2025b [C, leverancier]; pilot van Google met sollicitatiegesprekken 2026 [D]; Stack Overflow 2026 [C]; Veracode 2026 [C]; CS1-LLM [C]; Pădurean 2026 [C] | 4 | 4 | **16** | Loopbaan (testen kan ook meetellen in je eindassessment) |
| R17 | **Onzekerheid over het loopbaanpad** *(nieuw)* | De krimp in juniorvacatures: minder instapplekken en kieskeurigere werkgevers. Het bewijs is beschrijvend en omstreden, dus het effect op een individuele student is onzeker. | Krimp in juniorvacatures: Canaries 2026 [B, beschrijvend, omstreden]; Crane & Soto 2026; Tucker 2026 [B]; Indeed (4.5% instapniveau) [C]; UWV, ROA, Cnossen 2026 [C]; nulresultaten: Humlum & Vestergaard, Fairlie & Wu, NY Fed [B] | 3 | 4 | **12** | Loopbaan |
| R18 | **Beslissingen gestuurd door claims van leveranciers of door hype** *(nieuw)* | Je verandert wat je oefent door cijfers van leveranciers ("80–90% van de code is door AI geschreven"), opgeblazen benchmarks of niet-gecorrigeerde meta-analyses. Of je vertrouwt dit document te veel: het is geschreven door een model van Anthropic en leunt op bronnen van Anthropic. | Door leveranciers gemelde vs. onafhankelijke benchmarkscores (89.9% vs. ongeveer 60%) [C]; ingetrokken meta-analyse van Wang & Fan 2025; Boolzen 2026 (g 0.84 → 0.08) [A]; O'Neill 2026, audit van 14 meta-analyses [preprint]; METR over zelfrapportage [A] | 3 | 3 | **9** | Beide |

<div class="risk-matrix">
<table class="risk-grid">
<caption>Risico's naar kans en impact, vóór maatregelen. Donkerder = hogere score (kans × impact). Ga met de muis over een nummer voor de naam; de tabel hierboven noemt elk risico.</caption>
<thead><tr><td></td><th scope="colgroup" colspan="5" class="axis">Kans →</th></tr>
<tr><th scope="col" class="axis">Impact ↓</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th><th scope="col">4</th><th scope="col">5</th></tr></thead>
<tbody>
<tr><th scope="row">5</th><td class="s2"></td><td class="s3"></td><td class="s4"><span title="R11 Problemen met toetsing en integriteit">R11</span></td><td class="s5"><span title="R4 Ontwerpoordeel ontwikkelt zich niet (specifiek voor OOD)">R4</span></td><td class="s5"><span title="R1 Vaardigheden ontstaan nooit">R1</span> <span title="R14 Oefenen past niet bij de toets">R14</span></td></tr>
<tr><th scope="row">4</th><td class="s1"></td><td class="s2"></td><td class="s3"><span title="R6 Onproductieve worsteling → frustratie → opgeven">R6</span> <span title="R17 Onzekerheid over het loopbaanpad">R17</span></td><td class="s4"><span title="R3 Metacognitieve luiheid">R3</span> <span title="R5 Misbruik van hints / vangrails omzeilen">R5</span> <span title="R8 Beheerste vaardigheden nemen af na automatisering">R8</span> <span title="R9 Verkeerde dingen leren van foute AI-uitvoer">R9</span> <span title="R10 Minder eigenaarschap over en geheugen voor je eigen werk">R10</span> <span title="R16 Toezichtvaardigheden blijven ongetraind">R16</span></td><td class="s5"><span title="R2 Illusie van bekwaamheid">R2</span></td></tr>
<tr><th scope="row">3</th><td class="s1"></td><td class="s2"><span title="R15 Te veel investeren in productiecode met de hand schrijven">R15</span></td><td class="s3"><span title="R7 Expertise-omkeereffect">R7</span> <span title="R18 Beslissingen gestuurd door claims van leveranciers of door hype">R18</span></td><td class="s3"><span title="R12 De harnas wordt het doel">R12</span></td><td class="s4"></td></tr>
<tr><th scope="row">2</th><td class="s1"></td><td class="s1"><span title="R13 Privacy van het dagboek en de vaardigheidsgegevens">R13</span></td><td class="s2"></td><td class="s2"></td><td class="s3"></td></tr>
<tr><th scope="row">1</th><td class="s1"></td><td class="s1"></td><td class="s1"></td><td class="s1"></td><td class="s2"></td></tr>
</tbody>
</table>
<p class="risk-legend">Score: <span class="sw s1"></span>1–4 <span class="sw s2"></span>5–8 <span class="sw s3"></span>9–12 <span class="sw s4"></span>13–16 <span class="sw s5"></span>17–25</p>
</div>

**Wat er in het beeld veranderde.**

- **Grootste risico's:** R1 (vaardigheden ontstaan nooit) en R14 (oefenen past niet bij de toets) delen de hoogste score. R14 is op zich geen AI-risico, maar in de pilot is dit het risico dat echt is gebeurd (zie het voorbeeld hieronder).
- **Ongelijke risico's door de verschuiving in vaardigheden:** te veel met de hand schrijven (R15) is een klein risico als je de harnas gebruikt. De harnas draagt beheerste vaardigheden al over aan de AI, en een toets zonder AI vereist dat je met de hand schrijft. Te weinig oefenen met toezicht (R16) is wel een echt risico. Niets in de harnas traint dat nog; §4.1 stelt voor hoe je het toevoegt.

!!! example "Voorbeeld: de situatie van één student"
    Een tweedejaarsstudent HBO-ICT aan CHE oefende voor een OOD-toets met AI binnen handbereik, zonder tijdsdruk, in Visual Studio. Een diagnostische toets vóór de eigenlijke toets was op tijd, zonder AI en in Rider. De analyse ervan noemde de oefenomstandigheden als een belangrijke oorzaak van het resultaat, en bij debuggen ging het mis. Er was ook tijd naar een spiekbriefje gegaan in plaats van naar oefenen (R12).

---

<a id="4-zo-pas-je-het-toe-plan-van-maatregelen"></a>

## 4. Zo pas je het toe: plan van maatregelen {#mitigation}

Deze sectie maakt van de risico's een plan dat je op je eigen toetsdatum legt. De tabel geeft voor elk risico één maatregel. Het stappenplan daarna zegt wanneer je wat doet, gerekend vanaf je toets.

| Risico | Maatregel | Uitgevoerd met | Restrisico |
|---|---|---|---|
| R1 | Autonomieladder: de AI mag alleen code voor een vaardigheid schrijven op L0 (Voordoen) en L4 (Geautomatiseerd). Op L1–L3 blokkeert een `PreToolUse`-hook bewerkingen door de AI in code die van jou is. | Vaardighedenregister + `PreToolUse`-hook + beleid in CLAUDE.md | Laag |
| R2 | De beheersingspoort vraagt (a) zelfstandig succes op een **nieuwe transfertaak**, (b) een juiste **uitleg** in je eigen woorden, (c) succes verspreid over ≥ 2 verschillende dagen. Het dagboek laat zien hoeveel hints je gebruikte en wat je zelfstandig deed. | `/mastery-check`-skill; dagboekstatistieken | Laag–gemiddeld |
| R3 | `SessionStart` vraagt om een plan ("wat ga je vandaag proberen?"). De `Stop`-hook start een reflectie die *jij* schrijft. Hints zijn eerst socratische vragen. | Hooks + dagboek | Gemiddeld |
| R4 | OOD-vaardigheden beginnen bij **"jij stelt voor, de AI geeft kritiek"**. Jij tekent het klassendiagram of benoemt de verantwoordelijkheden *voordat* de AI reageert. Vragen over afwegingen zijn verplicht ("waarom hier compositie?"). | Protocol van de `/learn`-skill voor de categorie ontwerp | Gemiddeld |
| R5 | Hintladder met tijdslimieten en een verplichte eigen poging. De **nooduitgang** `/override <reason>` is toegestaan, maar wordt gelogd en de vaardigheid krijgt een markering. Elke week een terugblik in het dagboek op de overrides. Zie het systeem als een zelfgekozen verplichting (commitment device). Studenten omzeilen vangrails het vaakst onder deadlinedruk (Kapoor et al., 2025). Plan je oefening dus zo dat de drukte vlak voor een toets niet het moment is waarop je hints het hardst nodig hebt. | `UserPromptSubmit`-hook; dagboek | Gemiddeld (niet uit te sluiten) |
| R6 | Vastlooptimer: na ongeveer 10–15 minuten zonder vooruitgang komt de volgende trede van de hintladder automatisch vrij. Consolidatie (uitgewerkte oplossing plus uitleg) komt na een mislukte poging. Het beoogde slagingspercentage is ongeveer 85%; de vaardigheid krijgt *makkelijkere* taken als je onder 70% zakt. | `UserPromptSubmit`-hook + sessiestatus | Laag |
| R7 | Het hulpniveau wordt *per vaardigheid* ingesteld, niet voor alles tegelijk. Door de criteria voor promotie ga je snel een niveau omhoog als het bewijs sterk is. | Vaardighedenregister | Laag |
| R8 | Gespreide onderhoudschecks met oplopende intervallen (bijv. 3 → 7 → 21 → 60 → 120 dagen). Een mislukte check zet de vaardigheid terug naar L3. Op L4 moet je de aanpak van de AI bij steekproeven voorspellen of reviewen. | `SessionStart`-hook + `/review-due`-skill | Laag |
| R9 | De AI moet documentatie citeren, en jij draait de tests zelf (`check.mjs`). Behandel code en uitleg van de AI als onbetrouwbaar. Wees extra voorzichtig met interfaces, abstracte klassen en overerving, waar AI het zwakst is, en met alles wat met beveiliging te maken heeft: controleer die met het cursusmateriaal of de C#-documentatie. Fouten in uitleg die je vindt, worden gelogd als "AI-fouten". | CLAUDE.md, `check.mjs` | Gemiddeld |
| R10 | Het dagboek legt vast wat *jij* schreef. Voor het inleveren oefen je "verdedig je ontwerp" met `/mastery-check --defend`. | Dagboek + skill | Laag |
| R11 | Beoordeeld werk (§10.8): noem de paden met `setting graded`. Daar gaat de hintladder tot trede 4 voor elke vaardigheid, is een uitwerking nooit beschikbaar, en blokkeert de guard elke schrijfactie van Claude, ook buiten het project. De hooks houden een AI-logboek bij in de repo: een regel per antwoord, een export van elke sessie (Claude Code heeft geen deellink) en een APA-verwijzing. Jij vult in wat je met de hulp deed en hoe je het controleerde (zoals OER art. 7.11 van CHE bijvoorbeeld vraagt). Vraag je docent welke delen van je eindassessment op AI-niveau 0 zijn en welke op AI-niveau 1 (§4.2). Volg altijd de regels van de cursus en de instelling. | Hooks (guard, prompt-gate, Stop) + `ai-verantwoording/` | Laag |
| R12 | Houd de harnas klein (~5 hooks, 1 skill) en bekijk de opzet elke maand. Begrens de tijd voor werk aan de harnas: hooguit één fix per sessie, en alleen onderzoek als dat zou veranderen wat je oefent. Onderzoek naar de harnas telt ook als werk aan de harnas: stop ermee tot na je toets, tenzij een hook niet goed werkt. | Dagboek (noteer de minuten aan de harnas vs. aan oefenen) | Gemiddeld |
| R13 | Houd `.learning/`, `research_notes/` en transcripten buiten gedeelde repo's (`.gitignore`), en sla alleen op wat nodig is. Publiceren is een keuze van de lerende, en dan gaat alleen een gefilterde selectie online: de export voor het dashboard neemt alleen vaste velden mee en filtert de privétermen van de lerende (`.learning/private.json`), vóór elke push draait een securitycheck, en de lerende leest eerst de diff. Het dagboek zegt dat reflecties op het openbare dashboard komen. De pilotstudent koos ervoor zo'n selectie te publiceren. | `.gitignore`, `export.mjs`, `security-check.mjs` | Laag |
| R14 | **Oefen onder toetsomstandigheden.** Doe vanaf ongeveer twee weken voor elke toets sessies op tijd, zonder AI, in de IDE van je toets. Begin kort en doe daarna volledige proeftoetsen (de oefentoetsen van je cursus). Leer eerst zonder druk. Kijk achteraf terug, en gebruik `claude-study` alleen voor wat je zelf hebt gevonden. | Stappenplan hieronder; dagboek | Gemiddeld |
| R15 | Drill niet wat al op L3/L4 staat. De Fibonacci-herhalingen houden het vers, en boilerplate gaat naar de AI (L4). Oefenen met de hand is voor vaardigheden onder L3. | Vaardighedenregister; L4-beleid | Laag |
| R16 | **Voeg een leerlijn voor toezicht toe (§4.1):** vind geplante bugs in code die je niet zelf schreef, schrijf tests die fouten vangen, review AI-code aan de hand van OOD-principes, voorspel en vergelijk daarna. Doe dit alleen bij onderwerpen op L3 of hoger, zodat je de uitvoer kunt beoordelen. Beperk het vóór je toets tot het deel dat overlapt met de toets (debuggen, testen). Breid het na je toets uit: acceptatiecriteria die tests worden, domeinmodellen in UML, en werk dat AI bouwde daaraan toetsen. | Nieuwe microvaardigheden (jij voegt ze toe); oefencode van Claude in `voorbeelden/` of de chat | Gemiddeld |
| R17 | Bouw zichtbaar oordeelsvermogen op dat werkgevers kunnen zien: tests en een testplan, onderbouwing van je ontwerpkeuzes in het verslag, je code hardop uitleggen (mondelinge verdediging). | Eindproject; dagboek | Gemiddeld (buiten jouw invloed) |
| R18 | Gebruik de bewijsgraden (§2.0). Handel op bewijs van graad A/B, zie C als een signaal en D als een bewering. Controleer belangrijke cijfers in de primaire bron, en houd in gedachten wie dit document schreef. Doe dit overzicht alleen opnieuw als dat zou kunnen veranderen wat je oefent. | Dit document | Laag–gemiddeld |

**Stappenplan, gerekend vanaf je toets**

| Fase | Wanneer (ten opzichte van je toets) | Wat |
|---|---|---|
| Opzetten | Bij de start, het liefst ongeveer tien weken voor je toets. Reken op ongeveer negen dagen. | Didactisch beleid in CLAUDE.md en de vaardighedenkaart; vaardighedenregister en sjablonen voor het dagboek; hooks (`SessionStart`, `UserPromptSubmit`, `Stop`); `PreToolUse`-guard die je eigen code beschermt, en `PostToolUse`-tests |
| Leren | Vanaf het einde van het opzetten tot je toets | Leer de OOD-vaardigheden op de ladder. Kijk één keer per week terug in je dagboek (15 minuten). |
| Check na een maand | Ongeveer een maand na de start, zo'n vijf weken voor je toets | Bekijk je slagingspercentage en je overrides (§6). |
| Toetsomstandigheden (R14) | De laatste twee weken voor je toets | Proeftoetsen op tijd, zonder AI, in de IDE van je toets. Begin kort en doe daarna volledige proeftoetsen. |
| Transfertoets | Vlak voor je toets | Een minitoets of transfertoets zonder hulp (§6). |
| Leerlijn voor toezicht (R16) | Vanaf de dag na je toets, ongeveer een maand | De volledige leerlijn voor toezicht (§4.1). |

De tijden komen uit één voorbeeldsemester van ongeveer tien weken. Begin je later, maak dan het opzetten en het leren korter, niet de twee weken onder toetsomstandigheden.

### 4.1 Oefening opnieuw verdelen: voorgestelde wijzigingen in het vaardighedenregister (jij beslist)

De harnas doet al twee van de drie dingen die §2.9 aanbeveelt: oefenen met de hand blijft voor vaardigheden die je nog niet beheerst, en beheerste vaardigheden gaan naar de AI (L4). Wat ontbreekt, is toezicht (R16). De wijzigingen hieronder zijn voorstellen. Jij beslist of je ze doorvoert.

| Wanneer | Wat | Waarom |
|---|---|---|
| Tot je toets | Houd je aan je toetsplan. Dicht de gaten in je OOD-basisvaardigheden met de hand, en doe vanaf ongeveer twee weken voor je toets proeftoetsen op tijd, zonder AI, in de IDE van je toets (R14). Voeg alleen de overlap tussen toezicht en de toets toe: **code debuggen die je niet zelf schreef**, en **tests schrijven die fouten vangen**. | Kijk of je toets die beoordeelt. In het voorbeeld (§3) beoordeelde de toets een testplan, en bij debuggen ging het mis in de diagnostische toets. Sollicitatiegesprekken in het AI-tijdperk testen ook allebei. |
| Na je toets | Voeg een hoofdvaardigheid toe voor toezicht op AI-uitvoer. Die omvat:<br>• een taak of user story zo precies specificeren dat een agent of een team ermee aan de slag kan;<br>• acceptatiecriteria schrijven die tests worden;<br>• werk dat AI bouwde daaraan toetsen, en aan OOD-principes;<br>• voorspellen wat de AI zal maken, en dat daarna vergelijken. | De loopbaanhorizon (§2.9). Dit is geen stof voor een toets zonder AI, dus het hoort niet vóór je toets. |

**Voorbeeldcommando's.** Je voert ze zelf uit, want de guard laat Claude het register niet wijzigen:

```
! node .claude/hooks/skill.mjs add-micro debug.zonder-foutmelding debug.code-van-ander L1 "bug vinden in code die je niet zelf schreef" "geplante bug, code van een ander, ai-code debuggen"
! node .claude/hooks/skill.mjs add-micro test.unit-tests test.fouten-vangen L1 "tests schrijven die fouten in andermans code vangen" "test die fout vangt, ai-code testen, grenswaarde vergeten"
```

Claude schrijft de oefencode, met een geplante bug, in `voorbeelden/` of in de chat. Jij debugt die in je eigen oefenmap, zodat `check.mjs` het resultaat kan loggen. Gebruik alleen onderwerpen die je al op L3 of hoger hebt, zodat je de code kunt beoordelen. Een hoofdvaardigheid zoals `ai.supervisie` kun je niet toevoegen met `add-micro`. Die zou je na je toets zelf aan `skills.json` toevoegen.

### 4.2 Voor docenten en opleidingen

Dit deel is voor docenten, curriculumontwerpers en examencommissies. Elk punt geeft het bewijs en eindigt met wat je kunt doen. Uit het onderzoek bleek dat het een sterkere positie is om toetsing van basisvaardigheden zonder AI te steunen en de gaten eromheen te dichten, dan om ertegen in te gaan.

1. **Toets basisvaardigheden op AI-niveau 0, onder toezicht.** Dat is de consensus, geen uitzondering.
            - **Past bij het tweesporenmodel:** het is "spoor 1" in de Nederlandse landelijke visie (Npuls, 2025) en in het tweesporenmodel van de University of Sydney. De Green Paper van Sydney vereist ook basisvaardigheden vóór taken met AI-ondersteuning en "mogelijkheden om te presteren onafhankelijk van AI" (University of Sydney, 2026).
            - **Waarom toezicht nodig is:** een verbod op AI bij werk zonder toezicht valt niet te controleren. In één blinde test bleef 94% van de door AI geschreven toetsantwoorden onopgemerkt (Scarfe et al., 2024).
            - **Waarom werk met AI-hulp beheersing overschat:** opdrachten met AI-hulp scoorden gemiddeld 7.62. Beheersing die willekeurig en zonder apparaten werd gecontroleerd, scoorde gemiddeld 5.55 (Đức Minh, 2026; bewijsgraad C).
            - *Wat je kunt doen:* geef voor elk deel van het eindassessment aan of het AI-niveau 0 of AI-niveau 1 is, en vertel dat aan studenten voordat ze gaan oefenen.
2. **Werk waarbij AI is toegestaan, is maar zo sterk als de controle erop.** Regels over toegestaan gebruik zijn "discursieve" veranderingen die studenten kunnen negeren (Corbin, Dawson & Liu, 2025). Wat ze laat werken, is structuur: promptlinks en vastleggingen van het AI-gebruik (OER art. 7.11 van CHE vereist die bijvoorbeeld), en een mondelinge check.
            - **De mondelinge verdediging:** die richt zich op een risico uit §3: studenten die hun eigen werk niet kunnen uitleggen of verdedigen (R10). Code tracen en uitleggen voorspelt hoe goed iemand code kan schrijven (Lopez et al., 2008). Uitleggen is dus een eerlijke toets van vaardigheid. Een verplichte uitleg helpt ook tijdens het oefenen: bij een latere taak waarbij AI was uitgeschakeld, faalde 77% na AI zonder beperkingen, tegenover 39% na een "uitlegpoort" (Sankaranarayanan, 2026; bewijsgraad C).
            - **Een gat in het bewijs:** geen van de studies in dit overzicht onderzoekt de mondelinge verdediging zelf als toetsvorm.
            - *Wat je kunt doen:* zet in elke opdracht op AI-niveau 1 hoe die wordt gecontroleerd, bijvoorbeeld met promptlinks, een log van het AI-gebruik en een korte mondelinge verdediging.
3. **Geef spoor 2 een plek in de opleiding, en beoordeel toezicht op AI-uitvoer.** Npuls zegt dat de twee sporen "elkaar aanvullen", en werkgevers testen nu het lezen, debuggen en valideren van AI-uitvoer (de pilot van Google met sollicitatiegesprekken uit 2026). Studenten moeten toezichtvaardigheden *verwerven*, niet alleen behouden ("never-skilling"; Abdulnour, Gin & Boscardin, 2025). Een regel zoals art. 7.11 van CHE maakt studenten nu al verantwoordelijk voor het controleren van AI-uitvoer "op juistheid en relevantie". Dat zou je als vaardigheid kunnen beoordelen, niet alleen als naleving.
            - **Geen nadeel voor toetsresultaten:** CS1-LLM laat zien dat oefenen met AI kan samengaan met toetsen zonder AI, zonder slechtere toetsresultaten.
            - **Oefenvormen met eerste bewijs (bewijsgraad C):** als er realistische bugs in door AI gegenereerde oplossingen waren gezet, repareerden studenten de code zelf. Bij gewone fouten door de prompt herformuleerden ze juist de prompt (Pădurean et al., 2026). "Prompt Problems" trainen precies specificeren (Denny et al., 2024b).
            - **Volgorde telt:** eerst de basis, dan oefenen met toezicht bij onderwerpen die studenten al zelf kunnen schrijven, zodat ze de uitvoer kunnen beoordelen (P13).
            - *Wat je kunt doen:* noem minstens één cursus of opdracht op AI-niveau 2 waarin het controleren van AI-uitvoer wordt beoordeeld, en plaats die nadat de basisvaardigheden er zijn.
4. **Laat studenten oefenen onder toetsomstandigheden.** Oefenen geeft de meeste transfer als het past bij de toets (§2.6). Houd het wel zonder druk: oefentoetsen waar veel van afhing, haalden tijdens het leren het voordeel van ophaaloefening weg (Hinze & Rapp, 2014). Geen studie heeft gemeten wat een onbekende IDE kost. Maar klassen aanmaken, tests draaien en compileruitvoer lezen horen bij wat er wordt getoetst. Het voorbeeld in §3 laat het gat zien: oefenen met AI in de ene IDE, daarna een diagnostische toets zonder AI, op tijd, in een andere.
            - *Wat je kunt doen:* stel oefentoetsen vooraf beschikbaar in de toetsomgeving (dezelfde IDE, dezelfde tijdslimiet, geen AI), en houd ze zonder druk.
5. **Claim niet te veel.**
            - **AI Act:** artikel 4 van de EU AI Act (AI-geletterdheid) gaat over het personeel van aanbieders en gebruiksverantwoordelijken. Sinds 27 juli 2026 vereist het alleen dat organisaties AI-geletterdheid *ondersteunen*. Het vereist geen AI bij het toetsen van studenten.
            - **Arbeidsmarkt:** het bewijs over juniorbanen is omstreden.
            - **Cijfers over het aandeel code:** cijfers van leveranciers over hoeveel code AI schrijft, zijn claims, geen bewijs.
            - **Leerwinst:** na correctie voor publicatiebias laat de strengste meta-analyse uit 2026 g = 0.84 krimpen tot 0.08 (Boolzen et al., 2026).
            - *Wat je kunt doen:* baseer wijzigingen in de opleiding op bewijs van graad A/B (§2.0), en zie cijfers van leveranciers als claims.
6. **Detectie is geen bewijs.** Npuls stelt dat scores van AI-detectie geen waterdicht bewijs zijn en dat vermoedens menselijk onderzoek nodig hebben, bijvoorbeeld mondelinge vragen. CHE is een van de instellingen die Turnitin toestaan bij fraudeonderzoek. De eigen promptlinks en vastleggingen van studenten beschermen hen.
            - *Wat je kunt doen:* zie een detectiescore als aanleiding voor een gesprek, niet als bewijs, en vraag studenten hun promptlinks en vastleggingen te bewaren.
7. **Zie een tool zoals deze harnas als voorbeeld** van transparant AI-gebruik dat de student zelf begrenst. Die logt hints, overrides en uitleg. Dat is het soort AI-verantwoording waar werk op AI-niveau 1 om vraagt. Biedt je cursus een eigen AI-tutor aan, dan pleit het bewijs voor vangrails die in de werkwijze zijn ingebouwd, in plaats van alleen instructies in een prompt.
            - **Alleen prompts:** de tutor sturen via de systeemprompt maakte geen verschil voor 1,059 CS1-studenten (Barth et al., 2026). Een tutor met vangrails hielp alleen binnen een werkwijze van leren tot beheersing (Oreopoulos et al., 2026).
            - **Gelijke kansen:** zwakkere studenten en eerstegeneratiestudenten lijden meer schade en gebruiken vaker nooduitgangen (Liu et al., 2026; Kapoor et al., 2025). Vangrails zijn het belangrijkst voor de studenten die er het minst snel zelf voor kiezen.
            - *Wat je kunt doen:* overweeg logs zoals deze te accepteren als onderdeel van een AI-verantwoording. Vraag bij de keuze van een AI-tutor waar de vangrails worden afgedwongen.
