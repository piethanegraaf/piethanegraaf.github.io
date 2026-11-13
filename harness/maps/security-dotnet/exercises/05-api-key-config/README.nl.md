# 05 · De API-sleutel van de pakketvervoerder

**Vaardigheid:** `security.secrets-config`

## Het verhaal

Je app vraagt bij een pakketvervoerder de status van zendingen op. De vervoerder gaf je bedrijf één API-sleutel;
daarmee kan iedereen ook verzendlabels aanmaken op rekening van je bedrijf. Voor een demo heeft iemand een
"reservesleutel" in de code gezet, zodat de app ook zonder instellingen werkte. De demo is allang voorbij, de
repository wordt binnenkort gedeeld met een extern bureau, en het opstartlog print de client met zijn sleutel,
in elke omgeving.

## De opdracht

Pas `ShippingApiClient` zo aan dat:

- de sleutel alleen uit de meegegeven instellingen komt (sleutel `Shipping:ApiKey`; in een echte app komen die
  uit user secrets op je eigen machine en uit omgevingsvariabelen of een key vault op de server);
- een ontbrekende of lege sleutel bij het opstarten een `InvalidOperationException` gooit: geen reservesleutel;
- `ToString()` de sleutel nooit toont (hooguit de laatste paar tekens);
- er geen string meer in het bronbestand staat die op een sleutel lijkt.

Draai de tests één keer voordat je iets verandert:

```
! node .claude/hooks/check.mjs oefeningen/05-api-key-config
```

Deze tests zijn nu rood en moeten groen worden:

- `Missing_key_throws_InvalidOperationException_instead_of_using_a_fallback`
- `Empty_key_throws_InvalidOperationException` (3 gevallen)
- `Description_does_not_reveal_the_key`
- `Source_file_contains_no_hard_coded_key` (een grove controle die het bronbestand leest)

`Tracking_request_carries_the_key_from_the_settings` en `Description_names_the_client` zijn groen en moeten groen blijven.

**Denk erover na voor je uitleg:** de sleutel stond in de repository. Is hem uit de code halen genoeg?

Verander de tests niet. Claude geeft je hints, niet de code.
