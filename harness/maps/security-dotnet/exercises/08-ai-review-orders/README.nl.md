# 08 · AI-code reviewen: de orderrepository

**Vaardigheid:** `security.ai-review` (moeilijker)

## Het verhaal

De webwinkel zet zijn bestellingen over naar een nieuwe datalaag. Een AI-assistent schreef `OrderRepository`
op basis van de prompt "Gebruik overal geparametriseerde queries", met tests die allemaal groen zijn. Je ziet
parameters `$id` en `$email` in de eerste methoden, en je komt in de verleiding de rest vluchtig te lezen. Het
ordernummer staat in de bevestigingsmail en in een trackinglink die werkt zonder in te loggen.

## De opdracht

**Er zitten twee securityproblemen in deze code.** Zoek ze zelf; de README zegt niet waar.

1. Lees `OrderRepository.cs`, methode voor methode. Vraag bij elke methode: wat bepaalt een aanvaller hier, en
   wat zou hij ermee winnen?
2. Schrijf voor elk probleem een test in `ReviewTests.cs` die het laat zien. Elke test moet **rood** zijn op de
   huidige code. Je hebt een database nodig: `OrderRepositoryTests` laat zien hoe je er een in het geheugen
   maakt. Draai:

   ```
   ! node .claude/hooks/check.mjs oefeningen/08-ai-review-orders
   ```

3. Repareer `OrderRepository.cs` tot alle tests groen zijn, en draai hetzelfde commando opnieuw.

Dat jouw tests van rood naar groen gaan, is de taak. Verander `OrderRepositoryTests.cs` niet: die tests zijn nu
groen, en ze moeten groen blijven.

**Denk erover na voor je uitleg:** een van de twee problemen is lastig te bewijzen met een test. Wat liet jouw
test zien, en wat kan hij niet laten zien?

Claude geeft je hints, niet de code, en wijst de problemen niet voor je aan.
