# 03 · The welcome banner

**Skill:** `security.output-encoding`

## The story

The dashboard of your team's app greets every user by name, and shows the name again as a tooltip. The name
comes from the profile, which users fill in themselves. A product owner asks why the banner of one test account
says "Welcome back, Tom" instead of "Welcome back, Tom & Jerry". Then a pen tester changes their display name
to `<script>alert(1)</script>`, and every admin who opens the user overview sees a pop-up.

## The task

`GreetingRenderer.Render` puts the name into HTML twice: once as text, once inside the `title` attribute.
Make sure that whatever the name contains, the browser shows it as text and never reads it as HTML.

Run the tests once before you change anything:

```
! node .claude/hooks/check.mjs oefeningen/03-greeting-html
```

These tests are red now and must turn green:

- `Ampersand_in_name_renders_as_html_entity` (same cause as the attack)
- `Script_tag_in_name_comes_back_encoded`
- `Quote_in_name_cannot_break_out_of_the_title_attribute`
- `Banner_keeps_its_shape_whatever_the_name` (4 cases)

`Normal_name_renders_in_text_and_title` is green and must stay green.

Do not change the tests. Claude gives you hints, not the code.
