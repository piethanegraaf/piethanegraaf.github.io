---
title: "Hoe het werkt: niveaus L0–L4 en hints in stappen"
description: "Vijf niveaus per vaardigheid, van L0 (voordoen) tot L4 (geautomatiseerd). Op L1–L3 blokkeert een hook AI-code; op L2 komt hulp als vraag, wijzer en schets."
---
# Hoe het werkt

De harnas bestaat uit vier hooks van Claude Code, een vaardighedenregister en een paar commando's die alleen jij draait.

```mermaid
flowchart LR
  P[Jouw prompt] --> G1[prompt-gate<br/>vaardigheid, trede, open uitleg]
  G1 --> C[Claude]
  C -->|wil code schrijven of testen| G2{guard}
  G2 -->|L1-L3: geblokkeerd| C
  G2 -->|L0, L4 of geen code| T[tool]
  C --> S[reflect-gate<br/>markers, dagboek]
  S --> R[(.learning/)]
  G1 --> R
  C -.->|omlaag voor een hoofdvaardigheid| A[demotie-analist<br/>alleen lezen]
  A -.->|rapport met het oordeel| S
  S -.->|controleert opnieuw op het bewijs van nu| R
  S -.->|uitleg goedgekeurd:<br/>plaatsing van een nieuwe vaardigheid| R
  S -.->|uitleg haalt criterium:<br/>voorstel om door te zetten| J[Jij]
  J -.->|ja, doorzetten| G1
```

In de harnas gaat elke prompt door de prompt-gate, en bij L1–L3 blokkeert de guard dat Claude code schrijft of test. Een niveau gaat nooit vanzelf omhoog: je bevestigt het voorstel van de reflect-gate met "ja, doorzetten", of je zet het zelf.

## Niveaus per vaardigheid

| Niveau | Claude | Jij |
|---|---|---|
| **L0 Voordoen** | maakt een uitgewerkt voorbeeld met een ander onderwerp; bij een nieuwe vaardigheid pas na jouw poging | legt het uit en voorspelt de uitvoer |
| **L1 Aanvullen** | schrijft een skelet, de kern blijft `TODO(human)`; bij een nieuwe vaardigheid pas na jouw poging | vult de gaten, bouwt en test |
| **L2 Begeleid** | geeft geen oplossingscode, alleen hints uit de ladder | schrijft alles zelf |
| **L3 Zelfstandig** | niets vooraf; review pas na jouw poging | maakt en verdedigt het |
| **L4 Geautomatiseerd** | mag het direct doen | superviseert; is de herhaling aan de beurt, dan doe je het zelf |

Een vaardigheid kan **microvaardigheden** hebben: deelpatronen met een eigen niveau. Lijsten filteren kan al op L3 staan, terwijl void-methoden chainen nog op L2 staat.

**Een nieuwe vaardigheid** (zonder taken en zonder geschiedenis) heeft nog geen vaste plaats. Je probeert het eerst zelf, met de hintladder van L2. De hoogste trede van je eerste taak bepaalt het niveau: trede 0 → L3, 1–2 → L2, 3–4 → L1, 5 → L0. Dat gebeurt als je uitleg van die taak is goedgekeurd; vervalt de uitleg, dan blijft de plaatsing open. Hulp over een ander concept telt hier niet mee. Een plaatsing omhoog naar L3 krijgt een eigen melding met het bewijs. Plaatst de harnas je te laag, dan zet je het zelf hoger.

## De hintladder (L2)

1. Een Socratische vraag.
2. Waar het staat, of welk concept het is.
3. Pseudocode of een schets van de structuur.
4. Een klein voorbeeld van hooguit 5 regels, met een ander onderwerp.
5. Een uitwerking, alleen na bevestiging. De taak telt dan als **niet gelukt**.

De eerste hint mag meteen. Een volgende trede komt pas na een **zichtbare poging**: gewijzigde code, een foutmelding of testuitkomst, of een hypothese. Of na 12 minuten vastzitten. Dat zijn minuten **actieve tijd**: een pauze van meer dan 20 minuten (`idleMinutes`) telt niet mee. Na het eten krijg je dus niet vanzelf een hogere trede.

Bij een **nieuwe vaardigheid** telt de tijd niet. Een trede gaat pas omhoog als je zegt dat je vastzit, twee keer dezelfde foutmelding of testuitkomst deelt, of het concept niet kent. Vraag je na een eigen poging zelf om meer uitleg, dan mag Claude meteen naar een hogere trede, en die trede wordt eerlijk gelogd.

## De guard

Bij L1–L3 blokkeert `guard.mjs` dat Claude code schrijft, verwijdert, bouwt of test. Welke bestanden code zijn en welke commando's bouwen, staat in de [instellingen](configuration.md). De guard beschermt ook:

- het register en de state in `.learning/`;
- de harnas zelf: de hooks, `.claude/settings.json`, de skills diary, mastery-check en update-dashboard, en de regels.

Een shell-commando splitst de guard eerst in losse commando's. Hij kijkt naar het programma dat draait, niet naar woorden in de argumenten: `grep "msbuild"` is geen build, maar `bash -c "dotnet test"` wel.

Eén programma laat de guard bewust toe, ook al schrijft het in `.learning/state/`: de dashboardexport `node <repo>/harness/export.mjs <oefenmap>`, om het dashboard na `/diary` bij te werken. Die schrijft in je oefenmap alleen `last-export.json` (een moment en drie totalen), en nooit met `--out` in je oefenmap.

Wil je toch dat Claude iets doet, dan zet je zelf een override: `! node .claude/hooks/skill.mjs override ood.overerving 30 "reden"`. Die wordt gelogd en staat in het dagboek.

## Taken en uitleg in eigen woorden

**Een taak begint** als je aan nieuw werk begint. De harnas gaat alleen af op vaste signalen, nooit op een trefwoord: code gewijzigd in een andere opdrachtmap, `check.mjs` in een andere map, of de volledige naam van een andere opdrachtmap (zoals `10-artsen-en-patienten`) of een `#id` van een andere vaardigheidsfamilie in je bericht. Dan beginnen de hintladder en de tijd van de taak opnieuw. Gewone hulp sinds de vorige taak hoorde bij werk dat je niet afmaakte: die telt niet voor de nieuwe taak, maar wordt gelogd als `help-dropped`, zodat je hem nog ziet.

**Draai eerst `check.mjs`.** Kies je een opdracht, dan geeft Claude je `! node .claude/hooks/check.mjs <map>`. Draai hem vóór je code schrijft: die eerste run is het begin. Schreef je de code toch eerst, en is de eerste run meteen helemaal groen? Dan telt het toch als taak, zolang je de code in deze sessie hebt gewijzigd.

Een taak wordt gelogd als een test van rood naar groen gaat (`check.mjs`), als je hem zelf afmeldt (`done`), of als je in de chat zegt dat de tests groen zijn. Hij telt pas mee na een uitleg **in je eigen woorden**, met twee sleutels:

1. Claude beoordeelt de inhoud en zet `[uitleg-ok <tid>]` of `[uitleg-nee <tid>]`. Bij `uitleg-nee` noemt Claude eerst wat al klopt, en stelt dan één vervolgvraag die naar het gat wijst: een vervolgvraag, geen afwijzing. De eis blijft even streng. De vraag hangt af van wat er gebeurde. Na hulp (trede 1 of hoger): over het concept van de hoogste hint, want daar zat je vast. Na een mislukte poging zonder hint (rood of een compileerfout): waarom werkt het nu, en waarom de eerste poging niet? Meteen groen: één vraag naar het principe van de opdracht. Claude vraagt door tot het principe klopt.
2. De Stop-hook controleert je eigen woorden: **al je berichten sinds de taak is gelogd, samen**. Een antwoord in drie korte berichten telt als één. Samen moeten ze minstens 12 woorden buiten code hebben, een *waarom* (omdat, doordat, zodat …, of een redenering "als …, dan/zou …" in één zin), en ze mogen niet uit Claude's tekst zijn overgenomen. Een bericht van vóór het loggen telt niet mee.

De uitleg hoort **direct** na het groen worden. Een volgende taak in dezelfde map mag eerst, en één bericht mag meer taken uitleggen. Begin je aan een andere opdracht, of eindigt de sessie, dan **vervalt** de taak: hij telt niet mee en staat op het dashboard als overgeslagen. Ging een goedgekeurde uitleg verloren door een fout van de harnas, dan herstel je hem met `replay`.

Een test die al eens groen was, rood werd en weer groen is, is **herstel van een regressie** en telt niet als nieuwe taak.

**Eerst lof, in eerlijke woorden.** Na een groen zegt `check.mjs` eerst wat lukte en welke vaardigheid, en nodigt daarna uit tot de uitleg. "Zelfstandig" betekent alleen trede 0. Op trede 1–4 zegt de harnas "gelukt met hulp tot trede N", en waar het leren zat: het concept van de hoogste hint. Moeite is hier het doel, geen falen; dat zegt de harnas één keer, bij je eerste sessiestart. Een uitwerking (trede 5) telt als niet gelukt: dan leg je de uitwerking terug uit.

**Hulp over een ander concept** wordt ook bij dat concept gelogd. Stel dat Claude je helpt met de syntax van een lus, tijdens een opdracht over overerving. Dan zet Claude `[trede N #id]`, met het id van de vaardigheid van de lus. De taak houdt die trede, want je maakte hem met die hulp. Het concept krijgt een eigen event, `concept-help`. Dat is geen taak van dat concept: `status` laat het zien, en het telt als bewijs voor een voorstel voor een microvaardigheid. De statusregel die Claude bij elke prompt ziet, toont de gegeven hulp voor deze taak, ook op L3 (`gegeven hulp: trede N`); op L2 ook de ontgrendelde trede.

**Een review na een taak** is een keuze, en gaat alleen over je eigen code. Claude biedt hem aan met een onderwerp en een tijdsinschatting, en jij kiest. Een vraag over een alternatief wordt een experiment: je bouwt het om, draait `check.mjs` en zet het terug, zodat de uitkomst echte feedback is. Er komt geen review na de melding van een uur actieve tijd, of als de taak al trede 2 of hoger kostte. Na één fout antwoord, of als je zegt dat je het niet snapt, geeft Claude direct het concept in plaats van nog een vraag. Hulp in een review wordt gemarkeerd met `[review-trede N #id]`, met het id van het concept. Die telt niet voor je volgende taak over iets anders, maar wel voor de volgende taak over hetzelfde concept: hetzelfde id, de hoofdvaardigheid of een microvaardigheid ervan. Zonder geldig id, of als je intussen aan nieuw werk begon, telt hij als een gewone trede.

**Een voorstel voor een microvaardigheid** komt van de harnas zelf, net als een voorstel om door te zetten. Daarvoor is bewijs uit deze sessie nodig dat je bij dat deel echte hulp nodig had: hulp op trede 2 of hoger in een review of over een ander concept, of een taak die trede 2 of hoger kostte. Claude noemt het deel en de trefwoorden; de harnas controleert ze en laat je zien:

```
[leerharnas] Microvaardigheid toevoegen? ood.associaties.<deel> (titel) onder ood.associaties, op L2 Begeleid
  waarom: taak <tid> van ood.associaties kostte trede 2
  trefwoorden: …
  wat verandert: dit deel krijgt een eigen niveau en een eigen hintladder; ood.associaties blijft op L3
  ja: typ "ja, toevoegen" · nee: typ "nee"
```

Alleen jouw eigen "ja, toevoegen" (of "yes, add") voegt hem toe, op het niveau van de hoofdvaardigheid min 1. Er gaat niets automatisch omlaag: één moeilijk moment is zwak bewijs, dus jij beslist.

## Doorstromen en herhalingen

- **Omhoog** beslis jij, op bewijs. Het bewijs is de laatste 10 uitgelegde taken **sinds de vorige niveauwijziging**, plus de taak die de vaardigheid plaatste, zodat dezelfde taken nooit twee promoties dragen.
  - **L0 → L1:** twee voorbeelden goed uitgelegd en voorspeld.
  - **L1 → L2:** drie taken met hooguit trede 1 (gaten gevuld).
  - **L2 → L3:** ongeveer 85% gelukt (hooguit trede 2) over minstens 5 taken, en minstens de helft met hint 0–1.
  - **L3 → L4:** drie keer trede 0 op minstens 2 dagen, en een **transfertaak** is daar één van: met `/mastery-check <id>` maak je een nieuwe opdracht in een ander domein, zonder enige hint, en verdedig je daarna het ontwerp. Haar dag telt als een dag. Na twee taken zonder hint kan de transfertaak dus de derde zijn; lagen die twee op één dag, doe hem dan op een andere dag. Een hint tijdens de transfertaak laat hem niet tellen.
  - **Het ontwerpdoel:** wie dagelijks oefent en de stof beheerst, haalt L4 in ongeveer 3 sessies op 2 dagen. Een test bewaakt dat.
  - **Zijn de opdrachtmappen van een vaardigheid op L3 op,** dan wijst Claude een bestaande volgende oefening aan: een andere opdracht van het vak, of een vraag uit een oefentoets. Een oefentoetsvraag telt mee als je hem zonder hulp maakt, nakijkt met het antwoordmodel, uitlegt en afmeldt met `done`. Claude verzint nooit zelf een opdracht.
  - **Sprong:** vanaf L2 mag het bewijs een sprong dragen als ook het volgende criterium klopt, bijvoorbeeld L2 → L4 met de transfertaak. Vanaf L0 en L1 gaat het per stap, omdat een voorbeeld of skelet hulp vooraf was.
- **Het voorstel** komt direct na de uitleg die het criterium haalt. De harnas laat het zelf zien, met het bewijs en wat er verandert:

  ```
  [leerharnas] Doorzetten? ood.klassen-properties L2 → L3
    bewijs: 5 van 5 gelukt (trede 1, 1, 2, 1, 1), op 1 dag(en), in 05-de-auto, 06-studenten
    wat verandert: geen hintladder meer: Claude geeft niets vooraf en reviewt pas na je poging
    ja: typ "ja, doorzetten" · nee: typ "nee" · terugdraaien kan altijd met set
  ```

  Typ je "ja, doorzetten", dan zet de harnas het niveau en meldt het met ↑ en het bewijs. Dat werkt alleen op jouw eigen prompt, nooit op tekst van Claude. Zeg je "nee" of "later", dan komt het voorstel pas terug na een nieuwe taak die het criterium opnieuw haalt. `set` werkt ook nog.
- **Hoe ver is het volgende niveau?** Na elke taak, bij `status` en bij de sessiestart toont de harnas dat in stappen, nooit als percentage:

  ```
  ↗ ood.encapsulatie L3 → L4: zonder hint 3/3 ✓ · dagen 1/2 · transfertaak ○
  ```

- **Omlaag** volgt het bewijs, als `autoDemote` aan staat: bij minstens 4 uitgelegde taken met minder dan 70% gelukt, of de laatste 2 niet gelukt. "Gelukt" telt de hulp binnen de eigen familie: hulp over een ander concept (`[trede N #id]`) is geen mislukking van deze vaardigheid. Omlaag wacht tot er geen uitleg van die familie meer openstaat, en wordt opnieuw gecontroleerd op het bewijs van dat moment. Een microvaardigheid zakt meteen één niveau. Bij een hoofdvaardigheid beslist eerst de **demotie-analist**: een agent die alleen leest, de testuitvoer, je code en het transcript bekijkt, en bepaalt of het probleem in één deelpatroon zit (dan zakt of ontstaat alleen die microvaardigheid) of breed is (dan zakt de hoofdvaardigheid). Ging de hulp eigenlijk over een bestaande microvaardigheid van een andere familie, dan mag de analist die kiezen. De harnas leest het oordeel zelf uit het rapport van de analist: geen JSON in de chat. Zakken er binnen 14 dagen twee microvaardigheden van dezelfde ouder, dan zakt de ouder ook. Je krijgt één rustige regel, "extra steun voor …", en kunt het terugdraaien met `set`.
- **Herhalingen** krijg je alleen op L4, met Fibonacci-intervallen: 1, 2, 3, 5, 8, 13 … dagen. Er zijn geen losse herhaaloefeningen. Komt zo'n vaardigheid langs in je werk als de herhaling klaarstaat, dan doe je dat deel zelf, zonder AI. Je eerstvolgende taak bepaalt de uitkomst: trede 0 is geslaagd (een stap verder), trede 1–2 wankel (gelijk), meer hulp is mislukt (twee stappen terug). Komt hij niet langs, dan gebeurt er niets; de oefentoetsen zijn het vangnet.

## Het dagboek

Als je stopt, schrijft `/diary` de feiten van de sessie op, en jij de reflectie: wat je leerde, wat verwarrend was, en hoe zeker je bent. Zonder dagboekentry laat de Stop-hook de sessie niet sluiten (hooguit twee keer per stopverzoek).

Boven de drie reflectievragen staat een waarschuwing: *"Let op: je antwoorden komen letterlijk, met een vertaling, op het openbare dashboard."* Een privé-optie is er niet. Wat niet online mag, zet je in `.learning/private.json`.

Daarna vraagt Claude: **Dashboard nu bijwerken?** Bij ja werkt Claude het dashboard in dezelfde sessie bij, tot en met een pull request, en die merge je zelf. Bij later gebeurt er niets. Zie [Na het dagboek](progress-dashboard.md#na-het-dagboek), ook als je geen dashboard gebruikt.

Waarom het zo werkt, staat in het [onderzoek](research.md), vooral §2 en §5.
