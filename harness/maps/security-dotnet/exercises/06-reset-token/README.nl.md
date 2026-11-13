# 06 · Het token voor een nieuw wachtwoord

**Vaardigheid:** `security.secrets-config` (moeilijker)

## Het verhaal

"Wachtwoord vergeten?" stuurt een e-mail met een link als `https://shop.example/reset?token=...`. Wie het token
heeft, kan een nieuw wachtwoord kiezen voor dat account. Een securityonderzoeker mailt je team: "Ik vroeg binnen
dezelfde seconde een reset aan voor mijn eigen account en voor dat van jullie. Uit mijn token kon ik het jouwe
afleiden." Je kijkt in `ResetTokenGenerator` en ziet waar de tokens vandaan komen.

## De opdracht

Maak het token onraadbaar: minstens 32 bytes (256 bits) uit een cryptografisch veilige randomgenerator,
geschreven als base64url (letters, cijfers, `-` en `_`, zonder `=`), zodat het zo in een URL past.

Draai de tests één keer voordat je iets verandert:

```
! node .claude/hooks/check.mjs oefeningen/06-reset-token
```

Deze tests zijn nu rood en moeten groen worden:

- `Token_carries_at_least_256_bits`
- `Generators_created_at_the_same_moment_give_different_tokens`
- `Source_does_not_use_System_Random` (een grove controle die het bronbestand leest)

`Token_contains_only_url_safe_characters` en `Ten_thousand_tokens_are_all_different` zijn groen en moeten groen
blijven. Let op: de tweede is groen terwijl de generator onveilig is. Uniek is niet hetzelfde als onraadbaar.

**Wat deze tests niet zien:** hoe het token later gecontroleerd wordt. Vergelijken met `==` kan via de
tijdsduur iets verraden; `CryptographicOperations.FixedTimeEquals` vergelijkt in constante tijd. Een goed token
wordt ook als hash opgeslagen, verloopt, en werkt maar één keer. Daar zijn hier geen tests voor, en een test op
tijdsduur zou niet betrouwbaar zijn, maar het hoort in je uitleg bij wat er nog openstaat.

Verander de tests niet. Claude geeft je hints, niet de code.
