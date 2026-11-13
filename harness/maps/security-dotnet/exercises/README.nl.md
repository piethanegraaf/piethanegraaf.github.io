# Security-oefeningen (C#/.NET)

Acht kleine oefeningen in veilige code. Elke map is één xUnit-testproject: de code en de tests zitten in
hetzelfde project, en elke oefening begint bij een korte situatie op het werk.

| Map | Vaardigheid | Wat je oefent |
|---|---|---|
| `01-sql-search` | `security.sql-params` | Een zoekquery gebouwd uit invoer van de gebruiker: parameters in plaats van strings aan elkaar plakken |
| `02-sql-filter-sort` | `security.sql-params` (moeilijker) | Een waarde en een sorteerkolom: een parameter voor de waarde, een allow-list voor de kolomnaam |
| `03-greeting-html` | `security.output-encoding` | Een naam in HTML-tekst en in een attribuut: HTML-encoding |
| `04-audit-log-validation` | `security.output-encoding` (moeilijker) | Log-injectie met regeleinden, en een gebruikersnaam valideren aan de grens |
| `05-api-key-config` | `security.secrets-config` | Een hardgecodeerde API-sleutel: uit de configuratie, geen reservesleutel, gemaskeerd in uitvoer |
| `06-reset-token` | `security.secrets-config` (moeilijker) | Een token voor een nieuw wachtwoord: een cryptografisch veilige randomgenerator |
| `07-ai-review-comments` | `security.ai-review` | AI-code reviewen: één probleem, jij schrijft de test die het blootlegt |
| `08-ai-review-orders` | `security.ai-review` (moeilijker) | AI-code reviewen: twee problemen, jij schrijft de tests die ze blootleggen |

## Hoe het werkt

In oefening 01–06 is de code kwetsbaar. De functionele tests zijn groen en de aanvalstests zijn rood. In oefening
07 en 08 zijn alle tests groen, en toch zit er een probleem in de code: de rode test schrijf je zelf.

1. Lees de README van de oefening.
2. Draai de tests **voordat** je iets verandert, zodat het harnas de rode tests ziet (in Claude Code wordt een
   regel die met `!` begint als commando uitgevoerd):

   ```
   ! node .claude/hooks/check.mjs oefeningen/01-sql-search
   ```

3. Repareer de code. Vraag Claude om hulp als je vastzit: Claude geeft hints, niet de code.
4. Draai hetzelfde commando opnieuw. Een test die van rood naar groen gaat, telt als taak, maar pas nadat je
   hem in je eigen woorden hebt uitgelegd.

Verander de tests die bij de oefening horen niet (behalve `ReviewTests.cs` in 07 en 08, die is van jou).

## Je uitleg na een groene test

Het harnas vraagt vier dingen:

1. **Wat bepaalt de aanvaller?** Welke invoer, en waar komt die vandaan?
2. **Welke maatregel houdt het tegen?** En waarom werkt die: wat verandert hij aan hoe de invoer behandeld wordt?
3. **Hoe controleer je dat?** Welke test met welke aanvalsstring, of welke regel van de analyser.
4. **Hoe zeker ben je dat dit veilig is, van 1 tot 5?** En wat ziet je controle niet?

Een groene test laat zien dat de aanvallen uit de test worden tegengehouden, niet dat de code veilig is. Een
schone run van de analyser (`securityAnalyzer`) is ook geen bewijs: hij ziet niet elke fout, en toegangscontrole
of logica ziet hij nooit. Benoem wat er nog openstaat.
