# Dashboard bijwerken

## Wat het dashboard laat zien

Het [dashboard](/dashboard/) laat de voortgang per vaardigheid en microvaardigheid zien:

- je **niveau** en de geschiedenis daarvan;
- wat elk **niveau betekent**: wijs een niveau aan in de legenda of de balk (of ga er met Tab naartoe) voor wat het inhoudt en de stap naar het volgende niveau. Esc sluit de uitleg. Het waarom, het bewijs en de route van de start (plaatsing open) naar L4 staan onder *Wat betekenen de niveaus?*: de criteria per stap, en hoe je omhoog en omlaag gaat;
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
4. Exporteer: `node harness/export.mjs ../mijn-oefenmap`. Zijn er teksten zonder vertaling (zie [Vertalingen](#vertalingen))? Dan schrijft de export geen data. Hij stopt met exitcode 2 en zet die teksten in `site-src/dashboard/data/translations.todo.json`.
5. Laat Claude de vertalingen invullen ("vul translations.todo.json in") en exporteer opnieuw. De export neemt de vertalingen over, verwijdert het todo-bestand en schrijft `progress.json`.
6. Controleer de diff van `site-src/dashboard/data/progress.json`, ook de vertalingen, en commit en push hem zelf. Het dashboard toont de datum en de tijd van de export, zodat je ziet hoe actueel het is.

In Claude Code, in deze repo, doet `/update-dashboard ../mijn-oefenmap` stap 3 tot en met 5 voor je. Het stopt vóór de commit.

## Vertalingen

Je logboek staat in één taal (`settings.language`), en het dashboard is Nederlands en Engels. Daarom krijgt elke vrije tekst een vertaling in de andere taal: de uitleg, het dagboek (de feiten en je reflectie), je eigen notities en microvaardigheden, en de redenen bij correcties en overrides. Titels uit de vaardighedenkaart, de vaste notities van de harnas en de signalen bestaan al in beide talen.

- **Claude vertaalt, niet de export.** De export heeft geen netwerktoegang. Claude vertaalt getrouw: dezelfde betekenis en toon, niets verbeterd of toegevoegd. Code, testnamen en vaardigheids-id's blijven zoals ze zijn.
- **Alleen nieuwe teksten.** De export hergebruikt de vertalingen van de vorige export. Verandert een tekst, dan wordt hij opnieuw gevraagd. Verdwijnt een tekst, dan verdwijnt zijn vertaling ook.
- **Eén knop voor het origineel.** Bovenaan staat dat de teksten vertaald zijn. Met de knop *Toon origineel* zie je alle teksten van de student in de taal waarin ze geschreven zijn, en met *Toon vertaling* weer andersom.
- **Dezelfde privacyfilters.** De vertalingen gaan door dezelfde filters als de originelen, ook `.learning/private.json`.
- **Gecontroleerd in de build.** De build van de site draait `node harness/export.mjs --check site-src/dashboard/data/progress.json`. Ontbreekt er een vertaling, dan stopt de build. Zo toont het dashboard nooit de helft in de andere taal. Met `--allow-untranslated` schrijft de export de data toch, bijvoorbeeld om lokaal te kijken, maar de build weigert hem dan nog steeds.

Het dashboard is statisch: HTML, CSS en JavaScript zonder afhankelijkheden, met een strikte Content Security Policy. Alle tekst uit de data komt via `textContent` in de pagina.
