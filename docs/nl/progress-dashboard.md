# Dashboard bijwerken

## Wat het dashboard laat zien

Het [dashboard](/dashboard/) laat de voortgang per vaardigheid en microvaardigheid zien:

- je **niveau** en de geschiedenis daarvan;
- hoeveel taken **gelukt** zijn met hooguit trede 2, over de laatste 10 uitgelegde taken, met het doel van 85%;
- per taak: de trede, de bron (test, zelf afgemeld, chat), je **uitleg**, en wanneer die werd **afgewezen** of **gecorrigeerd**;
- de **herhalingen** (alleen L4, Fibonacci), neutraal: wanneer de volgende klaarstaat, en wanneer je de vaardigheid **laatst** in je werk zag. Niets is "te laat": een herhaling wacht tot de vaardigheid langskomt;
- **overgeslagen** taken: de uitleg kwam niet direct, dus ze tellen niet. Ze staan apart van mislukt en van wacht op uitleg, en in de grafiek gearceerd;
- wat de harnas **automatisch** deed: de plaatsing van een nieuwe vaardigheid en automatisch omlaag, gemarkeerd in de niveaugeschiedenis;
- **doorstroom- en terugvalsignalen**, **regressies** en **overrides**;
- een **dagboektijdlijn** met je reflecties en de **kalibratie**: je zelfvertrouwen vooraf en achteraf.

Elke grafiek heeft een tabelweergave. Je kunt wisselen tussen Nederlands en Engels, en tussen de echte data en de [demo met verzonnen data](/dashboard/?data=demo).

## Je eigen data publiceren

1. Maak `.learning/private.json` aan met de namen en termen die niet online mogen (zie [Configuratie en privacy](configuration.md#privacy)).
2. Ging een goedgekeurde uitleg verloren, bijvoorbeeld door een fout van de harnas? Herstel die dan eerst met `replay` (zie de [naslag](reference.md)). Anders staat de taak online als open of overgeslagen.
3. Bekijk wat er gefilterd wordt: `node harness/export.mjs ../mijn-oefenmap --dry-run`
4. Exporteer: `node harness/export.mjs ../mijn-oefenmap`
5. Controleer de diff van `site-src/dashboard/data/progress.json`, en commit en push hem zelf. Het dashboard toont de datum en de tijd van de export, zodat je ziet hoe actueel het is.

Het dashboard is statisch: HTML, CSS en JavaScript zonder afhankelijkheden, met een strikte Content Security Policy. Alle tekst uit de data komt via `textContent` in de pagina.
