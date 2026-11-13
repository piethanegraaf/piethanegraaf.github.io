namespace AuditLogValidation;

public class AuditLogTests
{
    private sealed class FixedClock : TimeProvider
    {
        public override DateTimeOffset GetUtcNow() => new(2026, 11, 13, 9, 30, 0, TimeSpan.Zero);
    }

    private readonly StringWriter _output = new();
    private readonly AccountService _accounts;

    public AuditLogTests() => _accounts = new AccountService(new AuditLog(_output, new FixedClock()));

    private string[] LogLines() =>
        _output.ToString().Split(Environment.NewLine, StringSplitOptions.RemoveEmptyEntries);

    // ---------- What the service and the log must do ----------

    [Fact]
    public void Register_valid_username_writes_one_audit_line()
    {
        _accounts.Register("fatima_92");

        var line = Assert.Single(LogLines());
        Assert.Equal("2026-11-13T09:30:00Z register user=fatima_92", line);
    }

    [Fact]
    public void Login_of_registered_user_succeeds_and_is_logged()
    {
        _accounts.Register("bob");

        Assert.True(_accounts.Login("bob"));
        Assert.Equal("2026-11-13T09:30:00Z login-ok user=bob", LogLines()[^1]);
    }

    [Fact]
    public void Login_of_unknown_user_fails_and_is_logged()
    {
        Assert.False(_accounts.Login("mallory"));
        Assert.Equal("2026-11-13T09:30:00Z login-failed user=mallory", Assert.Single(LogLines()));
    }

    [Theory]
    [InlineData("abc")]
    [InlineData("ABCDEFGHIJ_123456789")]
    public void Register_accepts_usernames_at_the_edges_of_the_rules(string username)
    {
        _accounts.Register(username);

        Assert.True(_accounts.Login(username));
    }

    // ---------- What an attacker must not be able to do: forge log lines ----------

    [Theory]
    [InlineData("mallory\r\n2026-11-13T09:31:00Z login-ok user=admin")]
    [InlineData("mallory\n2026-11-13T09:31:00Z login-ok user=admin")]
    [InlineData("mallory\r2026-11-13T09:31:00Z login-ok user=admin")]
    public void Login_with_newline_in_username_writes_exactly_one_log_line(string username)
    {
        _accounts.Login(username);

        var text = _output.ToString();
        Assert.Equal(Environment.NewLine, text[^Environment.NewLine.Length..]);
        var line = text[..^Environment.NewLine.Length];
        Assert.DoesNotContain('\r', line);
        Assert.DoesNotContain('\n', line);
        Assert.StartsWith("2026-11-13T09:30:00Z login-failed user=mallory", line);
    }

    // ---------- What an attacker must not be able to do: odd usernames ----------

    [Theory]
    [InlineData("")]
    [InlineData("ab")]
    [InlineData("a_very_long_username_1")]
    [InlineData("bob smith")]
    [InlineData("alice\n")]
    [InlineData("admin\r\n2026-11-13T09:31:00Z login-ok user=root")]
    [InlineData("<script>alert(1)</script>")]
    [InlineData("robert'); DROP TABLE users; --")]
    [InlineData("ädmin")]
    public void Register_with_invalid_username_throws_and_creates_nothing(string username)
    {
        Assert.Throws<ArgumentException>(() => _accounts.Register(username));

        Assert.Empty(_output.ToString());
        Assert.False(_accounts.Login(username));
    }
}
