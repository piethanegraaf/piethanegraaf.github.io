# 04 · The audit log and the username

**Skill:** `security.output-encoding` (harder)

## The story

Every sign-up and login ends up in the audit log, one line per event. The security team reads that log, and a
script counts the failed logins per user to spot password guessing. During an incident review someone notices a
`login-ok user=admin` line at a moment when the admin was on holiday. The line is not real: an attacker typed a
username with a line break in it, followed by a fake log line.

## The task

Two measures, one at each end:

1. **At the boundary:** `AccountService.Register` must only accept a valid username: 3 to 20 characters, only
   the letters a–z and A–Z, digits and `_`. Anything else throws an `ArgumentException`, and nothing is
   registered or logged.
2. **In the output:** `Login` does not reject odd names (a typo should simply fail), so the log must protect
   itself: whatever the username contains, `AuditLog.Write` writes exactly one line.

Run the tests once before you change anything:

```
! node .claude/hooks/check.mjs oefeningen/04-audit-log-validation
```

These tests are red now and must turn green:

- `Login_with_newline_in_username_writes_exactly_one_log_line` (3 cases)
- `Register_with_invalid_username_throws_and_creates_nothing` (9 cases; look closely at each one)

The other tests are green and must stay green, including `Register_accepts_usernames_at_the_edges_of_the_rules`.

Do not change the tests. Claude gives you hints, not the code.
