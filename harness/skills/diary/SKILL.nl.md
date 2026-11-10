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
     - `task` (met `tid`, `source`: chat, check of done): afgeronde taak, met succes en de hoogste trede. `test-green`: welke tests groen werden.
     - `task-explained`: uitleg goedgekeurd (telt). `explain-rejected`: uitleg afgewezen, door jou (`claude`) of door de check (`hook`).
     - `task-void`: door de student geschrapt. Noem dit expliciet. `task-correct`: trede achteraf verhoogd door de student, met reden. Noem dit ook.
     - `regression`: tests die groen waren en rood werden. `regression-fixed`: weer groen na een terugval (geen nieuwe taak). Veel van beide in korte tijd kan op gokken wijzen.
     - `deny`, `override`, `override-used`: wat de guard deed.
     - `review`, `level`, `micro-add`, `setting`: herhalingen, niveauwijzigingen, nieuwe microvaardigheden, instellingen.
   - Het plan en zelfvertrouwen van het begin, als die er zijn.

2. **Vraag de reflectie in één bericht** en wacht dan:
   > 1. Wat heb je geleerd? Leg het uit alsof je het aan een klasgenoot vertelt.
   > 2. Wat was verwarrend, of wat zou je de volgende keer anders doen?
   > 3. Hoe zeker ben je nu (1–5), en wat is je volgende stap?

   Staan er nog taken open voor uitleg? Vraag die uitleg dan ook in dit bericht. Per taak: waarom werkt het nu?
   - Beoordeel die uitleg zoals in CLAUDE.md: zet `[uitleg-ok <tid>]` of `[uitleg-nee <tid>]`.
   - Een open taak wordt **niet** gesloten omdat de sessie stopt. Hij blijft staan tot de volgende sessie.

   Neem de antwoorden **letterlijk** over: niet verbeteren en niet aanvullen. Wil de student niet reflecteren, noteer dan "overgeslagen".

3. **Toevoegen aan** `.learning/diary/JJJJ-MM-DD.md` (datum van vandaag). Bestaat het bestand al, zet de entry eronder als nieuwe sessie. Gebruik dit format:

   Zet de marker `<!-- sessie: <sessie-id> -->` direct onder de kop. Het sessie-id staat in de context van de leerharnas. Zonder die marker laat de Stop-hook je niet afsluiten.

```markdown
## Sessie <n> · <begintijd>–<eindtijd> · <vaardigheid-id> (<niveau>), ...
<!-- sessie: <sessie-id> -->

**Plan (student):** <doel> · zelfvertrouwen vooraf: <1-5 of onbekend>

**Feiten (gelogd):**
- Hinttredes: <bv. 1, 2> · gemarkeerde hulp: <[trede N] ...> · geweigerd zonder poging: <n> · uitwerking gegeven: <ja/nee>
- Taken: <id [tid]: gelukt/niet, hoogste trede, bron (check/done/chat), uitleg goedgekeurd/afgewezen/open>
- Zelf geschreven: <...> · AI schreef: <...>
- Tests (door student, check.mjs): <groen/rood, nieuw groen>
- Guard-weigeringen: <n> · overrides: <n, met reden> · geschrapte taken: <n>
- Herhalingen: <id: pass/shaky/fail → volgende datum>

**Wat ging goed (zelfstandig):** <(micro)vaardigheden die op trede 0–2 lukten, concreet>
**Doorstroom-signalen:** <uit `status`, met commando, of "geen">
**Voorgestelde microvaardigheden:** <add-micro-voorstellen van deze sessie, of "geen">

**Reflectie (eigen woorden):**
1. *Geleerd:* <letterlijk>
2. *Verwarrend / anders:* <letterlijk>
3. *Zelfvertrouwen nu:* <1-5> · *Volgende stap:* <letterlijk>

**Kalibratie:** vooraf <x> → <wat er werkelijk gebeurde, bv. "lukte met trede ≤1"> → <onderschat / klopt / overschat>
```

4. **Voorstel doen, niet uitvoeren:** lijkt een doorstroomcriterium uit CLAUDE.md gehaald, of juist een terugval, noem dan het commando dat de student zelf kan draaien. Bijvoorbeeld:
   `! node .claude/hooks/skill.mjs set ood.encapsulatie L3 "5/5 gelukt, meestal trede 0-1"`.
   De beslissing ligt bij de student. Omhoog zetten kan pas als er geen taken van die vaardigheid meer op uitleg wachten.
