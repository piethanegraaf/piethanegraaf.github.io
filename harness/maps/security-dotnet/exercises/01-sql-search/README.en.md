# 01 · Searching users by name

**Skill:** `security.sql-params`

## The story

Your team maintains the admin portal of a web shop. On the page "Users", staff type a name and see the
matching accounts. A colleague from support reports that searching for `O'Brien` gives an error page. While
you look into it, a tester from the security team sends a message: "Try typing `' OR '1'='1` in the search box."

## The task

`UserSearch.FindByName` builds its SQL by gluing the name into the query text. Change it so that the name can
never become part of the SQL itself, whatever the user types.

Run the tests once before you change anything, so the harness sees which tests are red:

```
! node .claude/hooks/check.mjs oefeningen/01-sql-search
```

These tests are red now and must turn green:

- `Search_for_name_with_apostrophe_returns_that_user` (same cause as the attack)
- `Search_with_injection_string_returns_no_rows`
- `Search_with_union_injection_does_not_leak_other_columns`
- `Search_with_drop_table_string_keeps_the_users_table`

These are green and must stay green: `Search_by_exact_name_returns_that_user`, `Search_for_unknown_name_returns_no_rows`.

Do not change the tests. Claude gives you hints, not the code.
