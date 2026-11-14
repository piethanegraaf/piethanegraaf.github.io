---
title: "Gratis oefeningen veilig programmeren in C# en .NET (OWASP Top 10:2025)"
description: "Acht gratis oefeningen veilig programmeren in C#/.NET voor junior developers: SQL-injectie, XSS, log-injectie, geheimen en tokens, en AI-code reviewen. De aanvalstests beginnen rood."
---
# Oefeningen veilig programmeren in C# en .NET

**Kort antwoord:** acht gratis oefeningen voor junior developers die veilig leren programmeren terwijl een AI steeds meer van de code schrijft. Elke oefening is een klein xUnit-project met een verhaal uit de praktijk. In zes ervan heeft de code een kwetsbaarheid en beginnen de aanvalstests rood. In de laatste twee schreef een AI de code, zijn alle tests groen, en vind je de fout zelf. Met de leerharnas geeft Claude Code hints, maar schrijft hij de oplossing niet.

## De oefeningen

| Oefening | Wat je oefent | OWASP Top 10:2025 |
|---|---|---|
| `01-sql-search` | Een zoekopdracht uit invoer van de gebruiker: parameters in plaats van strings aan elkaar plakken | A05 Injection (CWE-89) |
| `02-sql-filter-sort` | Een waarde en een sorteerkolom: een parameter voor de waarde, een allow-list voor de kolomnaam (moeilijker) | A05 Injection (CWE-89) |
| `03-greeting-html` | Een naam in HTML-tekst en in een attribuut: HTML-encoding | A05 Injection (CWE-79, cross-site scripting) |
| `04-audit-log-validation` | Log-injectie met regeleinden, en een gebruikersnaam valideren aan de rand (moeilijker) | A09 Security Logging and Alerting Failures (CWE-117), A05 Injection (CWE-20) |
| `05-api-key-config` | Een hard-coded API-sleutel: uit de configuratie, geen terugvalwaarde, gemaskeerd in uitvoer | A07 Authentication Failures (CWE-798) |
| `06-reset-token` | Een token om een wachtwoord te resetten: een cryptografisch veilige randomgenerator (moeilijker) | A04 Cryptographic Failures (CWE-330, CWE-338) |
| `07-ai-review-comments` | Code van een AI: je vindt één probleem en schrijft de test die het laat zien | Zoek je zelf uit |
| `08-ai-review-orders` | Code van een AI: twee problemen, twee tests (moeilijker) | Zoek je zelf uit |

De categorieën van 07 en 08 staan er met opzet niet bij: dan zou de oefening verklapt zijn.

## Hoe een oefening werkt

1. Lees de `README.md` van de oefening: een korte situatie op het werk, en de opdracht.
2. Draai de tests **voordat** je iets verandert, zodat de harnas de rode aanvalstests ziet:
   `! node .claude/hooks/check.mjs oefeningen/01-sql-search`
3. Verbeter de code. Zit je vast, dan geeft Claude hints, geen code. De eerste hint is altijd dezelfde vraag: *wat heeft een aanvaller hier in handen?*
4. Draai de tests opnieuw. Een test die van rood naar groen gaat, telt als taak, maar pas nadat je hem hebt uitgelegd.

In 07 en 08 zijn alle tests groen aan het begin. Je schrijft eerst een test die faalt, en daarna verbeter je de code.

## Je uitleg: vier vragen

1. **Wat heeft de aanvaller in handen?** Welke invoer, en waar komt die vandaan?
2. **Welke maatregel houdt het tegen?** En waarom werkt die?
3. **Hoe controleer je dat?** Welke test, met welke aanvalsstring, of welke regel van de analyser.
4. **Hoe zeker ben je dat dit veilig is, van 1 tot 5?** En wat ziet je controle niet?

Er is met opzet geen checklist. In een studie met 150 reviewers hadden wie de opdracht kregen op security te letten ongeveer acht keer zo hoge odds om de kwetsbaarheid te vinden. Een checklist voegde niets significants toe (Braz et al., 2022).

## De analyser

Vóór de tests bouwt `check.mjs` je code opnieuw met de securityregels van de .NET SDK, zonder netwerk en zonder je projectbestanden te veranderen. Jij legt de waarschuwingen uit; Claude lost ze niet voor je op. De analyser vangt vier van de acht kwetsbaarheden: de SQL die uit strings wordt gebouwd en het gebruik van `System.Random`. De andere ziet hij niet, en toegangscontrole of logica ziet hij nooit. Dat hoort bij de les: een schone run is geen bewijs.

## Waarom veilig programmeren, nu

- **AI-code is vaak onveilig als een agent een hele feature bouwt.** Op echte featureverzoeken was de beste agent functioneel correct op 57% van de taken, maar ook veilig op 11,8% (Zhao et al., 2026).
- **De zwakke plekken zijn voorspelbaar.** In de meting van Veracode van oktober 2026 ging cross-site scripting in AI-code in 18% van de gevallen goed en log-injectie in 13%, tegen 84% voor SQL-injectie. Daarom bestaan oefening 03 en 04.
- **Het risico is vertrouwen.** In een gerandomiseerde studie schreven mensen met een AI-assistent minder veilige code en dachten ze vaker dat die veilig was (Perry et al., 2023).
- **Fouten komen uit onbegrip, niet uit slordigheid.** In een wedstrijd waarin teams software bouwden, aanvielen en repareerden, kwamen de fouten in 78% van de projecten uit verkeerd begrepen securityconcepten (Votipka et al., 2020). Daarom vraagt de harnas om uitleg, niet alleen om een groene test.

De studies, hun bewijsgraden en hun grenzen staan in [§2.13 van het literatuuronderzoek](research.md#213-veilige-code-als-eerste-niche-voor-juniors). Of deze oefeningen juniors veiliger laten programmeren, is niet getest.

## Installeren

Je hebt Claude Code nodig, Node.js 18 of nieuwer en de .NET 10 SDK. Installeer de harnas met de oefenkaart in een eigen map:

```bash
git clone https://github.com/piethanegraaf/piethanegraaf.github.io.git
cd piethanegraaf.github.io
node harness/install.mjs ../security-oefenen --map security-dotnet --lang nl --yes
```

De installer zet de acht oefeningen in `oefeningen/`. Begin bij `oefeningen/README.md`. Zie [Installeren](install.md) voor de details, en [Voor junior developers](for-juniors.md#veilige-code-naast-een-ai-agent) voor de vier securityvaardigheden in een teamrepository.

## Veelgestelde vragen

### Kan ik de oefeningen zonder Claude Code doen?

Ja. Elke oefening is een gewoon xUnit-project, dus `dotnet test` werkt. De harnas voegt de hints in plaats van code toe, de stap met de analyser en de controle van je uitleg.

### Zijn de aanvalsstrings veilig om te gebruiken?

Ze zijn alleen bedoeld voor deze oefeningen. Ze blijven in de tests, en zijn niet om systemen van anderen mee te testen.

### Schrijft Claude ooit de oplossing?

Nee. Bij deze oefeningen geeft Claude alleen hints, nooit een uitgewerkte oplossing, ook niet in delen. Op niveau L1 tot L3 houdt een hook hem ook tegen om de bestanden van de oefening te wijzigen.

### Is het gratis?

Ja. De oefeningen en de harnas zijn open source. De code valt onder AGPL-3.0, de teksten onder CC BY-NC 4.0.
