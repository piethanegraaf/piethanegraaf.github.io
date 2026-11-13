# 01 · Gebruikers zoeken op naam

**Vaardigheid:** `security.sql-params`

## Het verhaal

Je team onderhoudt het beheerportaal van een webwinkel. Op de pagina "Gebruikers" typen medewerkers een naam
en zien ze de accounts die erbij horen. Een collega van support meldt dat zoeken op `O'Brien` een foutpagina
geeft. Terwijl je dat uitzoekt, stuurt een tester van het securityteam een bericht: "Typ eens `' OR '1'='1` in
het zoekvak."

## De opdracht

`UserSearch.FindByName` bouwt de SQL door de naam in de querytekst te plakken. Pas het aan zodat de naam nooit
een deel van de SQL zelf kan worden, wat de gebruiker ook typt.

Draai de tests één keer voordat je iets verandert, zodat het harnas ziet welke tests rood zijn:

```
! node .claude/hooks/check.mjs oefeningen/01-sql-search
```

Deze tests zijn nu rood en moeten groen worden:

- `Search_for_name_with_apostrophe_returns_that_user` (dezelfde oorzaak als de aanval)
- `Search_with_injection_string_returns_no_rows`
- `Search_with_union_injection_does_not_leak_other_columns`
- `Search_with_drop_table_string_keeps_the_users_table`

Deze zijn groen en moeten groen blijven: `Search_by_exact_name_returns_that_user`, `Search_for_unknown_name_returns_no_rows`.

Verander de tests niet. Claude geeft je hints, niet de code.
