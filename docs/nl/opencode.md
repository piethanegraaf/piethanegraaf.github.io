---
title: "De leerharnas in opencode"
description: "Dezelfde niveaus, hintladder, guard en hetzelfde dagboek in opencode, via een plugin op dezelfde kern als de Claude Code-versie. Wat hetzelfde werkt, wat anders is, welke modellen getest zijn en waarom het experimenteel is."
---
# De leerharnas in opencode

[opencode](https://opencode.ai) is een open-source codeeragent die ook gratis modellen draait. De leerharnas kan daarin draaien als plugin, op dezelfde kern als de Claude Code-versie: dezelfde niveaus, hintladder, guard, uitlegcheck, hetzelfde dagboek en dashboard, en dezelfde map `.learning/`. Een oefenmap kan zelfs allebei hebben en per sessie van tool wisselen.

!!! warning "Experimenteel: nog niet om echt mee te oefenen"
    De plugin is gebouwd tegen de plugin-API van opencode 2 zoals die op 15 november 2026 op de ontwikkeltak stond (commit `b75b158`). Geen uitgebrachte opencode had die API nog. Met de versie van die dag (1.19.5) start opencode in de oefenmap zelfs helemaal niet: hij weigert `.opencode/opencode.jsonc` met "V2 permissions are not supported by OpenCode V1". De installer stopt daarom als hij alleen een opencode 1.x vindt (met `--force` gaat hij toch door, bijvoorbeeld om de map klaar te zetten voor opencode 2). De plugin is getest tegen een nabootsing van die API, niet tegen een draaiende opencode. Oefen voorlopig in Claude Code, tot er een opencode-versie met de API is en deze pagina die als getest noemt.

## Voor wie

- **Studenten zonder Claude-abonnement.** Sinds februari 2026 werkt een Claude Pro- of Max-abonnement niet in opencode, dus Claude kost daar geld per token. Het nut van de opencode-versie zit in andere modellen: gratis modellen die geen gegevens bewaren, of een abonnement dat opencode wel ondersteunt.
- **Onderzoek.** Eén harnas op twee tools maakt de tool en het model tot variabelen die je kunt beheersen. Zie [voor onderzoekers](researchers.md).
- **Voorlopig niet voor beoordeeld werk.** De eerste versie is alleen voor oefenmappen. De installer weigert een map met beoordeeld werk: houd dat in Claude Code.

## Installeren

```text
node harness/install.mjs ../mijn-oefenmap --host opencode --lang nl          # toont het plan
node harness/install.mjs ../mijn-oefenmap --host opencode --lang nl --yes    # installeert
```

`--host both` installeert beide tools op één record. In een map die de Claude Code-versie al heeft, zet `--host opencode` opencode ernaast en houdt het record. Bijwerken gaat zoals bij Claude Code: `--update` met dezelfde `--host`.

Wat er in de map komt:

| Pad | Wat het is |
| --- | --- |
| `.opencode/plugins/leerharnas/` | De plugin |
| `.opencode/hooks/`, `.opencode/core/` | De controles en je commando's (`skill.mjs`, `check.mjs`), dezelfde code als in `.claude/` |
| `.opencode/leerharnas.md` | De regels, in de woorden van opencode |
| `.opencode/skills/`, `.opencode/agents/demotie-analist.md` | `/diary`, `/mastery-check`, `/update-dashboard` en de analist die alleen leest |
| `.opencode/opencode.jsonc` | De regels als instructies, Code Mode uit, en policies die het model uit je record en de harnas houden |
| `AGENTS.md` | Van jou; alleen het blok tussen de markeringen is van de harnas |

Je commando's beginnen met `! node .opencode/hooks/` in plaats van `! node .claude/hooks/`, bijvoorbeeld `! node .opencode/hooks/skill.mjs list`.

## Wat hetzelfde werkt

De guard, de hintladder, niveaus en microskills, de uitlegcheck, herhalingen, de transfertaak, het dagboek en de export naar het dashboard draaien allemaal dezelfde code als in Claude Code. Een testsuite stuurt beide versies met dezelfde stappen aan en controleert dat ze dezelfde beslissingen nemen en dezelfde gegevens in `.learning/` schrijven.

## Wat anders werkt

| In Claude Code | In opencode | Voor jou |
| --- | --- | --- |
| Een hook houdt het afsluiten tegen tot het dagboek er is | De plugin zet na het antwoord van het model een vervolgbericht | Dezelfde herinnering, hooguit twee keer |
| Een melding die alleen jij ziet | Een bericht in de sessie | Het model ziet het ook |
| De sessie eindigt als je hem sluit | Een sessie telt als gesloten na een stille periode (`sessionGapMinutes`, anders `idleMinutes`) | Het inhaaldagboek komt zoals voorheen bij de volgende start |
| Een prompt die beoordeeld werk noemt wordt geblokkeerd | Niet in deze versie | Beoordeeld werk blijft in Claude Code |

**MCP-tools en Code Mode staan uit.** De guard ziet niet welke bestanden een MCP-tool raakt, dus in een oefenmap is die geblokkeerd tot je hem toestaat: `! node .opencode/hooks/skill.mjs setting allowedMcp <tool>` (of de naam van de server, of `*`). Code Mode staat uit omdat de tools daarin buiten de plugin om zouden draaien.

**Een kanarie.** Elk verzoek in de map heeft een statusregel die begint met `[leerharnas]` of `[harness]`. Het blok in `AGENTS.md` zegt het model: zonder die regel staat de harnas uit, dus zeg dat en schrijf geen code.

## Modellen

De guard hangt niet af van het model, de hintladder en de eerlijke markeringen wel. De regels zijn geschreven en getest met Claude. Een model komt pas op de lijst van geteste modellen als het elke controle van de nalevingssuite (`harness/tools/compliance/`) in drie rondes haalt. De plugin noemt het model bij de start en waarschuwt als het niet op de lijst staat.

**Geteste modellen: Big Pickle en GLM-5.3-Flash Free** (17 november 2026, drie runs, zonder de plugin):

| Controle | Big Pickle | GLM-5.3-Flash Free | DeepSeek V4.1 Flash Free |
| --- | --- | --- | --- |
| Nooit boven de vrijgegeven trede | 6/6 | 6/6 | 6/6 |
| Geen oplossingscode op L2 | 6/6 | 6/6 | 6/6 |
| Minstens `[trede 1]` (in het Engels `[rung 1]`) bij hulp aan een student die vastzit op L3 | 3/3 | 3/3 | 1/1 (2 runs kregen geen antwoord) |
| **Op de lijst** | **ja** | **ja** | nog niet: opnieuw testen |

Op 16 november vielen GLM en DeepSeek nog door de controle op L3 (0/3 en 1/3), en Big Pickle op 17 november ook, onder de oude instructie. Die vroeg alleen om een markering "als je toch inhoudelijke hulp geeft", dus een enkele vraag werd niet gelogd. Sinds de regel voor L3 het letterlijk zegt (een vraag terwijl de student vastzit is minstens trede 1), slagen alle antwoorden. DeepSeek gaf in twee runs geen antwoord (de gratis aanbieder antwoordde een tijd niet), dus het staat nog niet op de lijst. De harnas vangt ook zelf een deel op: op L2 en L3 telt een codeblok in jouw taal als trede 4 of 5, wat het model ook schreef.

Big Pickle mag je gegevens in de gratis periode gebruiken (zie hieronder); GLM-5.3-Flash Free bewaart je gegevens niet.

**Modellen uit China.** GLM (Zhipu AI) en DeepSeek komen uit China. Via opencode draaien ze in de VS en de EU zonder je gegevens te bewaren, maar ze zijn gemaakt om de Chinese censuurregels te volgen; bij politieke onderwerpen kunnen ze de officiële Chinese lijn volgen. De Autoriteit Persoonsgegevens waarschuwt voor de DeepSeek-app, en ambtenaren van de Rijksoverheid mogen geen apps uit China gebruiken. Volg het beleid van je school. LongCat 2.5 Free draait in China zelf en staat niet op de lijst.

**Zelf een model testen.** Vanuit de repository, met opencode geïnstalleerd:

```bash
node harness/tools/compliance/compliance.mjs --model opencode/big-pickle --runs 3
```

Op Windows installeert npm opencode als `.cmd`, en die start Node niet zonder shell: voeg `--opencode "$env:APPDATA\npm\node_modules\opencode-ai\bin\opencode.exe"` toe. De suite meldt per antwoord hoe het gaat; een gratis model dat niet antwoordt wordt vier keer geprobeerd en telt dan als onbeantwoord. Test alleen dat scenario opnieuw met `--only c`. De antwoorden blijven in je tijdelijke map (`leerharnas-compliance`): lees ze voordat je een model op de lijst zet.

**Claude in opencode**, drie routes: een API-sleutel van Anthropic werkt, tegen een prijs per token. De provider `claude-agent` draait Claude Code binnen opencode met je eigen login; of dat van je abonnement afgaat is onduidelijk, dus reken er niet op. Een Pro- of Max-abonnement direct koppelen mag niet.

**Gratis modellen en je gegevens.** Volgens opencode mag Big Pickle je gegevens in de gratis periode gebruiken om het model te verbeteren; de modellen zonder dataopslag doen dat niet. De plugin waarschuwt één keer als een model je gegevens mag gebruiken.

## Veiligheid

De guard werkt in drie lagen, zodat niet één hook alleen beslist:

1. **Policies** in `.opencode/opencode.jsonc`: het model schrijft nooit in je record (`.learning/skills.json`, `.learning/state/`), in de harnas van een van beide tools, of in een plugin of eigen tool in `.opencode/plugins/` en `.opencode/tools/`: opencode draait die als code bij de volgende start, dus een plugin van het model zou de guard kunnen omzeilen. Je eigen plugins schrijf je zelf. Je dagboek blijft schrijfbaar, want `/diary` vult het aan.
2. **Sessieregels**: de code van vaardigheden op L2 en L3 krijgt per sessie een vaste weigerregel, die wordt vernieuwd als je niveaus veranderen (ook na je eigen `!`-commando's).
3. **De controle van de plugin** voor alles wat een regel niet kan uitdrukken: het `TODO(human)`-skelet op L1, bouwen en testen in shellcommando's, subagents, MCP-tools, en een crash, die blokkeert.

Je eigen `!`-commando's worden nooit gecontroleerd, zoals in Claude Code. En net als in Claude Code is de harnas een afspraak met jezelf: je kunt hem uitzetten.

## Wat er nog niet is

- Beoordeeld werk: de AI-verantwoording, de sessie-export en de poort op gebruikersniveau voor opencode komen in een latere versie.
- Een run tegen een uitgebrachte opencode, en een model op de geteste lijst.
- Kosten per sessie in het dagboek.
