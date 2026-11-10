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

## Licence of contributions

Code contributions are licensed under MIT, text contributions under CC BY-NC 4.0, as described in the README.

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

### Beveiligingsproblemen

Open geen openbare issue. Gebruik **Security → Report a vulnerability** (zie [SECURITY.md](SECURITY.md)).
