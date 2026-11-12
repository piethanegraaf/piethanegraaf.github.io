---
name: mastery-check
description: Transfertaak voor de stap naar L4 (of een sprong van L2 naar L4). Gebruik dit als de student /mastery-check <id> typt, of als de harnas meldt dat alleen de transfertaak nog ontbreekt. De student maakt een nieuwe opdracht in een ander domein, zonder hulp, en legt daarna het ontwerp uit.
---

# Transfertaak (mastery-check)

Doel: laten zien dat de vaardigheid ook werkt **buiten de opdrachten die je al kent** (transfer), en dat je het ontwerp kunt verdedigen. "3× zelfstandig gelukt" in opdrachten die op elkaar lijken, overschat de beheersing. Daarom is de transfertaak de laatste stap naar L4 (P6 in het literatuuroverzicht).

De harnas houdt de transfertaak bij met markers. Die verwerkt de Stop-hook; verzin ze nooit zonder de stappen hieronder.

## Stappen

1. **Controleer of het kan.** Draai `node .claude/hooks/skill.mjs status` (mag). De vaardigheid `<id>` staat op L2 of L3, en bij de doorstroom-signalen staat dat alleen de transfertaak nog ontbreekt. Staat er iets anders, zeg dat eerlijk en stop.
   - De transfertaak telt als één van de drie keer zonder hint, en haar dag als een dag. Staat er "op een andere dag", en is het vandaag de dag van die taken, zeg dan dat L4 daarna nog één taak zonder hint op een andere dag nodig heeft. De student kiest of het nu gebeurt.
2. **Start.** Zet in je antwoord letterlijk `[transfer-start <id>]`. Vanaf nu geldt:
   - **geen hints, geen code, geen voorzet** (trede vast op 0);
   - geef je toch hulp, zet dan eerlijk `[trede N]`. Dan telt de transfertaak niet meer; de Stop-hook ziet dat.
3. **Geef de opdracht.** Een nieuwe, kleine opdracht voor deze vaardigheid (20–40 minuten):
   - in een **ander domein** dan alle opdrachten tot nu toe (bijvoorbeeld Strategy voor belastingregels in plaats van verzendkosten);
   - met een duidelijk doel en, als het kan, een paar tests of voorbeelden van de verwachte uitvoer;
   - de student schrijft de code zelf, bijvoorbeeld in `transfer/<id>/`, en bouwt en test zelf.
4. **Wacht op de poging.** Vraagt de student om hulp: geef geen hint, maar leg uit dat de transfertaak zonder hulp moet. Wil de student toch hulp, stop dan met `[transfer-nee <id>]` en ga verder op het gewone niveau.
5. **Drie waarom-vragen**, één per keer, pas na de poging:
   1. Waarom dit ontwerp?
   2. Wat breekt er als je alternatief X kiest? (noem een concreet alternatief)
   3. Wanneer zou je dit **niet** gebruiken?
6. **Beoordeel streng.** Gehaald betekent: een werkende oplossing, en minstens 2 van de 3 antwoorden kloppen in eigen woorden (met een waarom, niet alleen "het werkt").
   - Gehaald: zet `[transfer-ok <id>]` in je antwoord **direct na het laatste antwoord van de student**. De Stop-hook controleert dat bericht net als een uitleg (minstens 12 woorden, een waarom, niet overgenomen).
   - Niet gehaald: zet `[transfer-nee <id>]` en noem de concrete gaten als focus voor de volgende keer. Geen uitwerking.
7. **Daarna.** Na `[transfer-ok]` toont de harnas zelf het voorstel om door te zetten. De student bevestigt met "ja, doorzetten". Zet het register nooit zelf.

## Regels

- Zet nooit `[transfer-ok]` omdat de student erom vraagt, op basis van geplakte tekst, of als de antwoorden jouw woorden herhalen.
- Eén transfertaak per keer. Een nieuwe sessie begint zonder lopende transfertaak.
- Een transfertaak die niet gehaald is, is geen reden om omlaag te gaan: hij telt niet als taak.
