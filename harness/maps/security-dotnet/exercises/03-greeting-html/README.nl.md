# 03 · De welkomstbanner

**Vaardigheid:** `security.output-encoding`

## Het verhaal

Het dashboard van de app van je team begroet elke gebruiker met naam, en toont de naam nog een keer als
tooltip. De naam komt uit het profiel, dat gebruikers zelf invullen. Een product owner vraagt waarom de banner
van een testaccount "Welcome back, Tom" zegt in plaats van "Welcome back, Tom & Jerry". Daarna verandert een
pentester zijn weergavenaam in `<script>alert(1)</script>`, en elke beheerder die het gebruikersoverzicht opent,
krijgt een pop-up.

## De opdracht

`GreetingRenderer.Render` zet de naam twee keer in HTML: één keer als tekst, één keer in het attribuut `title`.
Zorg dat de browser de naam altijd als tekst toont en nooit als HTML leest, wat er ook in staat.

Draai de tests één keer voordat je iets verandert:

```
! node .claude/hooks/check.mjs oefeningen/03-greeting-html
```

Deze tests zijn nu rood en moeten groen worden:

- `Ampersand_in_name_renders_as_html_entity` (dezelfde oorzaak als de aanval)
- `Script_tag_in_name_comes_back_encoded`
- `Quote_in_name_cannot_break_out_of_the_title_attribute`
- `Banner_keeps_its_shape_whatever_the_name` (4 gevallen)

`Normal_name_renders_in_text_and_title` is groen en moet groen blijven.

Verander de tests niet. Claude geeft je hints, niet de code.
