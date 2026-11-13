# 05 · The API key of the parcel carrier

**Skill:** `security.secrets-config`

## The story

Your app asks a parcel carrier for the status of shipments. The carrier gave your company one API key; with it,
anyone can also create shipping labels on your company's account. Before a demo, someone put a "fallback key"
in the code so the app would work without settings. The demo is long over, the repository is about to be shared
with an outside agency, and the startup log prints the client with its key for every environment.

## The task

Change `ShippingApiClient` so that:

- the key only comes from the settings passed in (key `Shipping:ApiKey`; in a real app those come from user
  secrets on your machine and from environment variables or a key vault on the server);
- a missing or empty key throws an `InvalidOperationException` at startup: no fallback;
- `ToString()` never shows the key (showing at most its last few characters is fine);
- no key-like string is left in the source file.

Run the tests once before you change anything:

```
! node .claude/hooks/check.mjs oefeningen/05-api-key-config
```

These tests are red now and must turn green:

- `Missing_key_throws_InvalidOperationException_instead_of_using_a_fallback`
- `Empty_key_throws_InvalidOperationException` (3 cases)
- `Description_does_not_reveal_the_key`
- `Source_file_contains_no_hard_coded_key` (a rough check that reads the source file)

`Tracking_request_carries_the_key_from_the_settings` and `Description_names_the_client` are green and must stay green.

**Think about it for your explanation:** the key was in the repository. Is removing it from the code enough?

Do not change the tests. Claude gives you hints, not the code.
