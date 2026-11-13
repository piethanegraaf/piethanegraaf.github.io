# 06 · The password-reset token

**Skill:** `security.secrets-config` (harder)

## The story

"Forgot your password?" sends an e-mail with a link like `https://shop.example/reset?token=...`. Whoever has
the token can choose a new password for that account. A security researcher writes to your team: "I requested
a reset for my own account and for yours within the same second. From my token I could work out yours." You
look at `ResetTokenGenerator` and see where the tokens come from.

## The task

Make the token unguessable: at least 32 bytes (256 bits) from a cryptographically secure random generator,
written as base64url (letters, digits, `-` and `_`, without `=`), so it fits in a URL as it is.

Run the tests once before you change anything:

```
! node .claude/hooks/check.mjs oefeningen/06-reset-token
```

These tests are red now and must turn green:

- `Token_carries_at_least_256_bits`
- `Generators_created_at_the_same_moment_give_different_tokens`
- `Source_does_not_use_System_Random` (a rough check that reads the source file)

`Token_contains_only_url_safe_characters` and `Ten_thousand_tokens_are_all_different` are green and must stay
green. Notice that the second one is green while the generator is unsafe: unique is not the same as unguessable.

**What these tests do not see:** how the token is checked later. Comparing it with `==` can leak through timing;
`CryptographicOperations.FixedTimeEquals` compares in constant time. A good token is also stored as a hash,
expires, and works only once. There are no tests for this here, and a timing test would not be reliable, but it
belongs in your explanation of what is still open.

Do not change the tests. Claude gives you hints, not the code.
