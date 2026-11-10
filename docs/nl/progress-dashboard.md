# Dashboard bijwerken

## Wat het dashboard laat zien

Het [dashboard](/dashboard/) laat de voortgang per vaardigheid en microvaardigheid zien:

- je **niveau** en de geschiedenis daarvan;
- hoeveel taken **gelukt** zijn met hooguit trede 2, over de laatste 10 uitgelegde taken, met het doel van 85%;
- per taak: de trede, de bron (test, zelf afgemeld, chat), je **uitleg**, en wanneer die werd **afgewezen** of **gecorrigeerd**;
- de **herhalingen** (Fibonacci) en welke te laat zijn;
- **doorstroom- en terugvalsignalen**, **regressies** en **overrides**;
- een **dagboektijdlijn** met je reflecties en de **kalibratie**: je zelfvertrouwen vooraf en achteraf.

Elke grafiek heeft een tabelweergave. Je kunt wisselen tussen Nederlands en Engels, en tussen de echte data en de [demo met verzonnen data](/dashboard/?data=demo).

## Je eigen data publiceren

1. Maak `.learning/private.json` aan met de namen en termen die niet online mogen (zie [Configuratie en privacy](configuration.md#privacy)).
2. Bekijk eerst wat er gefilterd wordt: `node harness/export.mjs ../mijn-oefenmap --dry-run`
3. Exporteer: `node harness/export.mjs ../mijn-oefenmap`
4. Controleer de diff van `site-src/dashboard/data/progress.json`, en commit en push hem zelf.

Het dashboard is statisch: HTML, CSS en JavaScript zonder afhankelijkheden, met een strikte Content Security Policy. Alle tekst uit de data komt via `textContent` in de pagina.
