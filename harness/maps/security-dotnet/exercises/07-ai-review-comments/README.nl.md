# 07 · AI-code reviewen: reacties op een blog

**Vaardigheid:** `security.ai-review`

## Het verhaal

De blog van je team krijgt een reactiesectie. Een collega vroeg een AI-assistent om de renderer, met de
opdracht "Hij moet veilig zijn tegen XSS." De assistent leverde `CommentRenderer.cs` en een set tests, allemaal
groen, en de pull request staat op jouw naam voor review. Je collega zegt: "Hij encodeert, de tests slagen,
keur hem maar goed."

## De opdracht

**Er zit één securityprobleem in deze code.** Zoek het zelf; de README zegt niet waar.

1. Lees `CommentRenderer.cs`. Vraag bij elk stukje data dat in de HTML terechtkomt: wat bepaalt een aanvaller
   hier?
2. Schrijf in `ReviewTests.cs` een test die het probleem laat zien. Hij moet **rood** zijn op de huidige code.
   Draai:

   ```
   ! node .claude/hooks/check.mjs oefeningen/07-ai-review-comments
   ```

3. Repareer `CommentRenderer.cs` tot alle tests groen zijn, en draai hetzelfde commando opnieuw.

Dat jouw test van rood naar groen gaat, is de taak. Verander `CommentRendererTests.cs` niet: die tests zijn nu
groen, en ze moeten groen blijven.

**Denk erover na voor je uitleg:** waarom waren de tests van de assistent groen?

Claude geeft je hints, niet de code, en wijst het probleem niet voor je aan.
