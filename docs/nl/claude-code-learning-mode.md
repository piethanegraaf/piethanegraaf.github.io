---
title: "Leermodus van Claude Code vs. een leerharnas: wat wordt afgedwongen"
description: "De Learning-outputstijl van Claude Code vraagt Claude wat code aan jou over te laten, maar niets dwingt dat af. Een vergelijking met regels in CLAUDE.md en een leerharnas met hooks."
---
# Leermodus van Claude Code vs. een leerharnas

**Kort antwoord:** de ingebouwde *Learning*-outputstijl van Claude Code vraagt Claude om een paar regels code voor jou over te laten, maar niets dwingt dat af. De documentatie van Claude Code zegt dat een outputstijl "doesn't guarantee that something always happens or never happens", en verwijst daarvoor naar hooks. Wil je zeker weten dat Claude de code die jij leert niet schrijft, dan heb je een hook nodig. De leerharnas is een set van zulke hooks, met een niveau per vaardigheid.

## Drie manieren om te leren met Claude Code

1. **De Learning-outputstijl.** Typ `/output-style learning`. Claude legt zijn keuzes uit in `Insight`-blokken. Bij een echte ontwerpkeuze, zoals foutafhandeling of een datastructuur, laat hij een `TODO(human)`-commentaar staan en wacht hij op jou. Het routinewerk doet Claude zelf.
2. **Een regel in `CLAUDE.md`**, zoals "schrijf mijn code niet, geef alleen hints". Claude leest die in elke sessie en volgt hem meestal. Het is ook een instructie: voor wat elke keer moet gebeuren, noemt de documentatie hooks, niet `CLAUDE.md`.
3. **Hooks.** Een hook is een script dat Claude Code zelf op een vast moment uitvoert, bijvoorbeeld vóór elke wijziging van een bestand. Het kan de wijziging weigeren. In de woorden van de documentatie: "Claude Code runs a hook itself at a lifecycle event, so it doesn't depend on Claude following an instruction."

## De vergelijking

| | Standaard | Learning-outputstijl | Regel in `CLAUDE.md` | Leerharnas |
|---|---|---|---|---|
| **Wie schrijft de code** | Claude | Claude, op een paar regels bij ontwerpkeuzes na | Jij, zolang Claude de regel volgt | Jij, voor de vaardigheden die je leert (L1–L3); Claude voor de rest (L4) |
| **Afgedwongen** | — | Nee: een instructie | Nee: een instructie | Ja: een hook blokkeert schrijven, verwijderen, bouwen en testen van jouw code |
| **Per vaardigheid** | Nee | Nee | Alleen als je het uitschrijft | Een niveau van L0 tot L4 per vaardigheid en microvaardigheid |
| **Als je vastzit** | De oplossing | Uitleg | Wat de regel zegt | Een hintladder van vijf treden: een vraag, een vindplaats, een schets, een klein voorbeeld, en een uitgewerkte oplossing alleen na jouw bevestiging; de volgende trede pas na een zichtbare poging |
| **Controleert of je het snapt** | Nee | Nee | Nee | Je uitleg in je eigen woorden, beoordeeld door Claude en gecontroleerd door een hook (minstens 12 woorden, een reden, niet overgenomen) |
| **Houdt een beheerste vaardigheid bij** | Nee | Nee | Nee | Korte herhalingen met groeiende tussenpozen, in je eigen werk |
| **Beoordeeld werk** | Nee | Nee | Nee | In de paden die je noemt, schrijft Claude geen inhoud, en elk antwoord gaat in een AI-logboek |
| **Instellen** | Niets | `/output-style learning` | Eén regel | `node harness/install.mjs` ([installeren](install.md)) |

## Wat past bij jou

- **De Learning-stijl** past als je de taak af wilt hebben en er wat praktijk naast wilt, bijvoorbeeld als je een codebase leert kennen.
- **De leerharnas** past als je een vaardigheid leert die je later zonder AI moet kunnen: voor een tentamen, of voor de stap van junior naar medior op je werk. Je bouwt de vaardigheid eerst zelf op, besteedt die daarna uit aan Claude, en houdt hem bij met korte herhalingen. Zie [Hoe het werkt](how-it-works.md).

Waarom het afdwingen? In een gerandomiseerd experiment van Anthropic scoorden ontwikkelaars die een nieuwe library leerden met een AI-assistent 50% op een toets achteraf, tegen 67% voor wie met de hand codeerde. Het grootste verschil zat bij debuggen (Shen & Tamkin, 2026; zie [wat het onderzoek vond en wat je ermee doet](ai-coding-skills-study.md)). En instructies alleen hielden geen stand: een tutor in zijn systeemprompt vragen om stap voor stap te helpen, veranderde niets in een experiment met 1.059 studenten, terwijl poortjes in de werkwijze zelf beter werkten (Barth et al., 2026). Een hook is zo'n poortje.

## Zelf wijzigingen blokkeren met één hook

De kleinste versie: een hook die elke wijziging in een map `practice/` weigert. Registreer hem in `.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit|NotebookEdit",
        "hooks": [{ "type": "command", "command": "node .claude/hooks/no-edits.mjs" }]
      }
    ]
  }
}
```

En het script, `.claude/hooks/no-edits.mjs`:

```js
// Weigert wijzigingen in bestanden onder practice/. Exitcode 2 blokkeert de tool-aanroep;
// Claude Code laat Claude de melding op stderr zien.
let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const file = JSON.parse(input).tool_input?.file_path ?? "";
  if (/[\\/]practice[\\/]/.test(file)) {
    console.error("Dit bestand is oefenwerk: geef een hint in plaats van code.");
    process.exit(2);
  }
});
```

Dit blokkeert alleen de tools die bestanden wijzigen. Claude kan een bestand nog via de shell schrijven, en je code nog bouwen en testen. De guard van de leerharnas leest ook shellopdrachten, blokkeert bouwen en testen op L1–L3, en werkt per vaardigheid in plaats van per map. Zie [de guard](how-it-works.md#de-guard).

## Veelgestelde vragen

### Houdt de Learning-outputstijl Claude tegen om mijn code te schrijven?

Nee. Hij vraagt Claude om bij ontwerpkeuzes een paar regels voor jou over te laten, en Claude doet het routinewerk zelf. Het is een instructie, geen blokkade.

### Kan Claude Code hints geven in plaats van code?

Ja. Met de leerharnas geeft Claude voor elke vaardigheid die je leert hints van een ladder: eerst een vraag, dan waar je moet kijken, dan een schets, dan een klein voorbeeld over een ander onderwerp. Een uitgewerkte oplossing (trede 5) komt pas na jouw bevestiging, en dan telt de taak als niet gelukt. In beoordeeld werk stopt de ladder bij trede 4.

### Werkt het ook voor andere talen dan C#?

De hooks werken voor elke taal. Welke bestanden code zijn en welke opdrachten bouwen of testen, zijn [instellingen](configuration.md). De vaardigheidskaarten die erbij zitten, zijn voor C# en .NET.

### Is het gratis?

Ja. De harnas is open source (AGPL-3.0) en heeft geen account nodig. Je hebt wel Claude Code zelf nodig, en Node.js 18 of nieuwer.
