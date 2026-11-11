---
name: diary
description: Sluit een leersessie af met een dagboekentry in .learning/diary/. Gebruik dit als de student stopt, "klaar" zegt of /diary typt. De feiten logt Claude, de reflectie schrijft de student zelf.
---

# Dagboekentry schrijven

Doel: zelfregulatie (plan → uitvoering → reflectie). De student schrijft de reflectie, zodat het leereffect bij de student ligt. Schrijf de reflectie dus nooit zelf.

## Stappen

1. **Feiten verzamelen** uit deze sessie:
   - Welke vaardigheden en microvaardigheden (id's uit `.learning/skills.json`) en op welk niveau.
   - Wat de student zelf schreef en wat jij schreef: bestanden, ongeveer hoeveel.
   - Wat de student zelf meldde over builds en tests, en de uitvoer van `check.mjs` als die er is.
   - Draai `node .claude/hooks/skill.mjs status` (mag): herhalingen, open uitleg, zelfstandige successen en doorstroom-signalen.
   - Events van deze sessie in `.learning/state/events.jsonl`. Lees het bestand met Read, niet via de shell.
     - `hint-unlock`: trede en reden. `hint-hold`: geweigerde trede omdat er geen poging was. `rung-mark`: hulp die jij met `[trede N]` markeerde.
     - `review-help`: hulp in een review na een taak, met `[review-trede N #id]`, en `reviewOf` (de taak waar de review bij hoorde). Die telt alleen voor de volgende taak over hetzelfde concept; een taak met `reviewRung` kreeg zijn trede daardoor. Noem hem apart van de gewone hulp.
     - `task-start`: er begon nieuw werk (de reden: `code-elsewhere`, `check-elsewhere`, `prompt-exercise` of `prompt-id`). `help-dropped`: gewone hulp van vóór dat begin, die niet voor de nieuwe taak telt. Noem die apart, met de trede.
     - `paths`: de student koppelde een opdrachtmap aan een vaardigheid, of haalde hem weg.
     - `task` (met `tid`, `source`: chat, check of done): afgeronde taak, met succes en de hoogste trede. `test-green`: welke tests groen werden.
     - `task-explained`: uitleg goedgekeurd (telt); met `source: replay` achteraf hersteld. `explain-rejected`: uitleg afgewezen, door jou (`claude`) of door de check (`hook`).
     - `task-lapsed`: de uitleg kwam niet direct, dus de taak is vervallen (`other-exercise` of `session-end`). Noem die taken als **overgeslagen**, los van mislukt.
     - `task-void`: door de student geschrapt. Noem dit expliciet. `task-correct`: trede achteraf verhoogd door de student, met reden. Noem dit ook.
     - `regression`: tests die groen waren en rood werden. `regression-fixed`: weer groen na een terugval (geen nieuwe taak). Veel van beide in korte tijd kan op gokken wijzen.
     - `deny`, `override`, `override-used`: wat de guard deed.
     - `review`, `level`, `micro-add`, `setting`: herhalingen, niveauwijzigingen, nieuwe microvaardigheden, instellingen.
     - Doorstromen: `promotion-offered` (de harnas deed een voorstel, met `from` en `to`), `promotion-confirmed` en een `level` met `by: learner` en `via: voorstel` (de student zei "ja, doorzetten"), `promotion-declined` (de student zei nee). Noem een doorgezette vaardigheid concreet, met het bewijs.
     - De transfertaak (`/mastery-check`): `transfer-start`, `transfer-passed`, of `transfer-failed` (met `why`: `help` als er een hint was, `claude` als Claude hem niet gehaald vond).
     - Automatisch gedaan door de harnas, noem het apart: `placement` (niveau van een nieuwe vaardigheid na de eerste taak), `level` met `auto: true` (automatisch omlaag; `by` zegt door wie: harnas, demotie-analist of achtervang), `micro-add` met `auto: true` en `task-retag` (de analist koppelde taken aan een microvaardigheid), `demotion-verdict` (het oordeel van de analist, met reden). Staat daar `doubt: true`, noteer dan "twijfel van de analist".
     - `review` met `auto: true`: de uitkomst van een L4-herhaling, uit gewoon werk. `review-due`: de herhaling kwam langs.
   - Het plan en zelfvertrouwen van het begin, als die er zijn.

2. **Vraag de reflectie in één bericht** en wacht dan:
   > 1. Wat heb je geleerd? Leg het uit alsof je het aan een klasgenoot vertelt.
   > 2. Wat was verwarrend, of wat zou je de volgende keer anders doen?
   > 3. Hoe zeker ben je nu (1–5), en wat is je volgende stap?

   Staan er nog taken open voor uitleg? Vraag die uitleg dan ook in dit bericht: het is de laatste kans. Per taak: waarom werkt het nu?
   - Beoordeel die uitleg zoals in CLAUDE.md: zet `[uitleg-ok <tid>]` of `[uitleg-nee <tid>]`.
   - Wat na het dagboek nog open staat, **vervalt**: het telt niet en staat op het dashboard als overgeslagen. Er gaat geen open uitleg mee naar de volgende sessie.

   Neem de antwoorden **letterlijk** over: niet verbeteren en niet aanvullen. Wil de student niet reflecteren, noteer dan "overgeslagen".

3. **Toevoegen aan** `.learning/diary/JJJJ-MM-DD.md` (datum van vandaag). Bestaat het bestand al, zet de entry eronder als nieuwe sessie. Gebruik dit format:

   Zet de marker `<!-- sessie: <sessie-id> -->` direct onder de kop. Het sessie-id staat in de context van de leerharnas. Zonder die marker laat de Stop-hook je niet afsluiten.

```markdown
## Sessie <n> · <begintijd>–<eindtijd> · <vaardigheid-id> (<niveau>), ...
<!-- sessie: <sessie-id> -->

**Plan (student):** <doel> · zelfvertrouwen vooraf: <1-5 of onbekend>

**Feiten (gelogd):**
- Hinttredes: <bv. 1, 2> · gemarkeerde hulp: <[trede N] ...> · geweigerd zonder poging: <n> · uitwerking gegeven: <ja/nee>
- Review-hulp: <[review-trede N #id] bij taak [tid], of "geen"> · vervallen hulp (help-dropped): <trede, of "geen">
- Taken: <id [tid]: gelukt/niet, hoogste trede, bron (check/done/chat), uitleg goedgekeurd/afgewezen/overgeslagen>
- Zelf geschreven: <...> · AI schreef: <...>
- Tests (door student, check.mjs): <groen/rood, nieuw groen>
- Guard-weigeringen: <n> · overrides: <n, met reden> · geschrapte taken: <n>
- Herhalingen (L4, uit gewoon werk): <id: pass/shaky/fail → volgende datum, of "geen">
- Automatisch: <plaatsingen, automatische verlagingen, microvaardigheden van de analist, twijfel van de analist, of "niets">

**Wat ging goed (zelfstandig):** <(micro)vaardigheden die op trede 0–2 lukten, concreet>
**Doorstroom-signalen:** <uit `status`, met commando, of "geen">
**Voorgestelde microvaardigheden:** <add-micro-voorstellen van deze sessie, of "geen">

**Reflectie (eigen woorden):**
1. *Geleerd:* <letterlijk>
2. *Verwarrend / anders:* <letterlijk>
3. *Zelfvertrouwen nu:* <1-5> · *Volgende stap:* <letterlijk>

**Kalibratie:** vooraf <x> → <wat er werkelijk gebeurde, bv. "lukte met trede ≤1"> → <onderschat / klopt / overschat>
```

4. **Omhoog: voorstel doen, niet uitvoeren.** Lijkt een doorstroomcriterium uit CLAUDE.md gehaald, noem dan het commando dat de student zelf kan draaien. Omlaag doet de harnas zelf als `autoDemote` aan staat: noem dan wat er gebeurde en hoe het terug kan. Staat het uit, noem dan ook bij een terugval het commando. Bijvoorbeeld:
   `! node .claude/hooks/skill.mjs set ood.encapsulatie L3 "5/5 gelukt, meestal trede 0-1"`.
   De beslissing ligt bij de student. Omhoog zetten kan pas als er geen taken van die vaardigheid meer op uitleg wachten.
