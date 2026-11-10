# Contributing

*Nederlands: zie [hieronder](#nederlands).*

Thank you for helping. Issues and pull requests are welcome, in English or Dutch.

## Before you open a pull request

1. **Run the tests:** `cd harness && node --test "test/*.test.mjs"` (Node 22 or 24).
2. **Run the security check:** `node harness/security-check.mjs`. It must show no BLOKKEER. A TWIJFEL needs a decision with a reason in `.security-allowlist.json`.
3. **Build the docs** if you changed them: `pip install -r requirements.txt` and `mkdocs build --strict`.
4. **Never commit learning data**: no `.learning/`, transcripts, `events.jsonl` or session files. Use made-up data in tests (see `harness/test/helpers.mjs`).

## Rules for the harness code

- No dependencies, no network, no `eval`, no shell. Start programs with an argument list (`spawnSync("dotnet", [...])`).
- Every message goes through `t()` with a key in **both** `harness/i18n/nl.json` and `en.json`. The tests check that the keys and placeholders match.
- Recognition patterns go in `harness/hooks/patterns.mjs`, with Dutch and English both active.
- A change in behaviour comes with a test.

## Licence of contributions (CLA)

The code is licensed under AGPL-3.0-only, and the maintainer also offers it under a commercial licence (dual licensing). Texts are licensed under CC BY-NC 4.0. To keep both possible, every contribution falls under this contributor licence agreement (CLA). By opening a pull request you agree to it:

1. **Your own work.** You wrote the contribution yourself, or you have the right to submit it under these terms (for example with permission from your employer or school).
2. **Public licence.** Your contribution is published under the licence of the part you change: AGPL-3.0-only for code, CC BY-NC 4.0 for texts.
3. **Extra licence for the maintainer.** You also give Piet Hanegraaf a perpetual, worldwide, non-exclusive, royalty-free and irrevocable licence to use, change, distribute and sublicense your contribution under other terms, including commercial licences. This includes a licence under any patent rights you hold that your contribution needs.
4. **Your copyright stays yours.** You may keep using your own contribution in any way you like.
5. **No warranty.** You provide the contribution "as is".

Write in your pull request: *I agree to the CLA in CONTRIBUTING.md.* (or the Dutch sentence below). A pull request without that sentence is not merged.

## Security issues

Do not open a public issue. Use **Security → Report a vulnerability** (see [SECURITY.md](SECURITY.md)).

---

## Nederlands

Bedankt voor je hulp. Issues en pull requests zijn welkom, in het Nederlands of het Engels.

### Voordat je een pull request opent

1. **Draai de tests:** `cd harness && node --test "test/*.test.mjs"` (Node 22 of 24).
2. **Draai de security check:** `node harness/security-check.mjs`. Er mag geen BLOKKEER zijn. Een TWIJFEL vraagt een besluit met reden in `.security-allowlist.json`.
3. **Bouw de docs** als je ze hebt gewijzigd: `pip install -r requirements.txt` en `mkdocs build --strict`.
4. **Commit nooit leerdata**: geen `.learning/`, transcripts, `events.jsonl` of sessiebestanden. Gebruik verzonnen data in tests (zie `harness/test/helpers.mjs`).

### Regels voor de code van de harnas

- Geen afhankelijkheden, geen netwerk, geen `eval`, geen shell. Start programma's met een lijst van argumenten.
- Elke melding gaat via `t()`, met een sleutel in **beide** bestanden: `harness/i18n/nl.json` en `en.json`.
- Herkenningspatronen staan in `harness/hooks/patterns.mjs`, met Nederlands en Engels allebei actief.
- Een wijziging in gedrag komt met een test.

### Licentie van bijdragen (CLA)

De code valt onder AGPL-3.0-only, en de beheerder biedt hem ook aan onder een commerciële licentie (dual licensing). Teksten vallen onder CC BY-NC 4.0. Om allebei mogelijk te houden, valt elke bijdrage onder deze bijdragersovereenkomst (CLA). Met een pull request ga je ermee akkoord:

1. **Eigen werk.** Je hebt de bijdrage zelf geschreven, of je mag hem onder deze voorwaarden indienen (bijvoorbeeld met toestemming van je werkgever of school).
2. **Openbare licentie.** Je bijdrage verschijnt onder de licentie van het deel dat je wijzigt: AGPL-3.0-only voor code, CC BY-NC 4.0 voor teksten.
3. **Extra licentie voor de beheerder.** Je geeft Piet Hanegraaf daarnaast een eeuwigdurende, wereldwijde, niet-exclusieve, kosteloze en onherroepelijke licentie om je bijdrage onder andere voorwaarden te gebruiken, te wijzigen, te verspreiden en in sublicentie te geven, ook onder commerciële licenties. Dat geldt ook voor patentrechten van jou die je bijdrage nodig heeft.
4. **Je auteursrecht blijft van jou.** Je mag je eigen bijdrage zelf blijven gebruiken zoals je wilt.
5. **Geen garantie.** Je levert de bijdrage "zoals hij is".

Schrijf in je pull request: *I agree to the CLA in CONTRIBUTING.md.* (of: *Ik ga akkoord met de CLA in CONTRIBUTING.md.*). Een pull request zonder die zin wordt niet gemerged.

### Beveiligingsproblemen

Open geen openbare issue. Gebruik **Security → Report a vulnerability** (zie [SECURITY.md](SECURITY.md)).
