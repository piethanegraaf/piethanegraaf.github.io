# 02 · Filtering and sorting products

**Skill:** `security.sql-params` (harder)

## The story

The product list of the web shop has a category filter and clickable column headers. The page sends both to
the server: `?category=books&sort=price`. Last sprint someone fixed a similar bug elsewhere with parameters,
and now the ticket says: "Do the same in `ProductCatalog`." You soon find out that one of the two inputs
cannot simply become a parameter.

## The task

Make `ProductCatalog.Filter` safe for both inputs:

- the **category** is a value in the query;
- the **sort column** is part of the SQL text itself (a column name, an identifier). A database does not
  accept a parameter in that place, so you need another measure.

**Decision for this exercise:** the allowed sort columns are `name` and `price`. Any other value throws an
`ArgumentException` (the web layer turns that into a 400 Bad Request). We chose an error over a silent default,
so that a broken link or an attack shows up instead of being hidden.

Run the tests once before you change anything:

```
! node .claude/hooks/check.mjs oefeningen/02-sql-filter-sort
```

These tests are red now and must turn green:

- `Filter_with_injection_in_category_returns_no_rows`
- `Filter_with_drop_table_in_category_keeps_the_products_table`
- `Filter_with_sort_column_not_on_the_list_throws_ArgumentException` (4 cases, one of them reads a password hash through the sort order)
- `Filter_with_injection_in_sort_column_keeps_the_products_table`

The three functional tests (`Filter_by_category_...`, `Filter_for_unknown_category_returns_no_rows`) are green and must stay green.

Do not change the tests. Claude gives you hints, not the code.
