# 02 · Producten filteren en sorteren

**Vaardigheid:** `security.sql-params` (moeilijker)

## Het verhaal

De productlijst van de webwinkel heeft een filter op categorie en kolomkoppen waarop je kunt klikken. De pagina
stuurt beide naar de server: `?category=books&sort=price`. Vorige sprint heeft iemand een vergelijkbare bug
elders opgelost met parameters, en nu staat er in het ticket: "Doe hetzelfde in `ProductCatalog`." Je merkt al
snel dat een van de twee invoerwaarden niet zomaar een parameter kan worden.

## De opdracht

Maak `ProductCatalog.Filter` veilig voor beide invoerwaarden:

- de **categorie** is een waarde in de query;
- de **sorteerkolom** is een deel van de SQL-tekst zelf (een kolomnaam, een identifier). Een database accepteert
  op die plek geen parameter, dus je hebt een andere maatregel nodig.

**Besluit voor deze oefening:** de toegestane sorteerkolommen zijn `name` en `price`. Elke andere waarde gooit
een `ArgumentException` (de weblaag maakt daar een 400 Bad Request van). We kiezen voor een fout in plaats van
een stille standaardwaarde, zodat een kapotte link of een aanval zichtbaar wordt in plaats van verstopt.

Draai de tests één keer voordat je iets verandert:

```
! node .claude/hooks/check.mjs oefeningen/02-sql-filter-sort
```

Deze tests zijn nu rood en moeten groen worden:

- `Filter_with_injection_in_category_returns_no_rows`
- `Filter_with_drop_table_in_category_keeps_the_products_table`
- `Filter_with_sort_column_not_on_the_list_throws_ArgumentException` (4 gevallen, waarvan één een wachtwoordhash uitleest via de sorteervolgorde)
- `Filter_with_injection_in_sort_column_keeps_the_products_table`

De drie functionele tests (`Filter_by_category_...`, `Filter_for_unknown_category_returns_no_rows`) zijn groen en moeten groen blijven.

Verander de tests niet. Claude geeft je hints, niet de code.
