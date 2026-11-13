# 04 · Het auditlog en de gebruikersnaam

**Vaardigheid:** `security.output-encoding` (moeilijker)

## Het verhaal

Elke registratie en elke login komt in het auditlog, één regel per gebeurtenis. Het securityteam leest dat log,
en een script telt de mislukte logins per gebruiker om wachtwoorden raden op te sporen. Bij de evaluatie van een
incident valt iemand een regel `login-ok user=admin` op, op een moment dat de beheerder op vakantie was. De regel
is niet echt: een aanvaller typte een gebruikersnaam met een regeleinde erin, gevolgd door een nep-logregel.

## De opdracht

Twee maatregelen, aan elke kant één:

1. **Aan de grens:** `AccountService.Register` accepteert alleen een geldige gebruikersnaam: 3 tot 20 tekens,
   alleen de letters a–z en A–Z, cijfers en `_`. Al het andere gooit een `ArgumentException`, en er wordt
   niets geregistreerd of gelogd.
2. **In de uitvoer:** `Login` weigert geen vreemde namen (een tikfout moet gewoon mislukken), dus het log moet
   zichzelf beschermen: wat de gebruikersnaam ook bevat, `AuditLog.Write` schrijft precies één regel.

Draai de tests één keer voordat je iets verandert:

```
! node .claude/hooks/check.mjs oefeningen/04-audit-log-validation
```

Deze tests zijn nu rood en moeten groen worden:

- `Login_with_newline_in_username_writes_exactly_one_log_line` (3 gevallen)
- `Register_with_invalid_username_throws_and_creates_nothing` (9 gevallen; bekijk ze allemaal goed)

De andere tests zijn groen en moeten groen blijven, ook `Register_accepts_usernames_at_the_edges_of_the_rules`.

Verander de tests niet. Claude geeft je hints, niet de code.
