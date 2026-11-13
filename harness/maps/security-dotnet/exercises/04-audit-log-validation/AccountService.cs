namespace AuditLogValidation;

/// <summary>
/// Sign-up and login. The username comes straight from the form.
/// </summary>
public sealed class AccountService
{
    private readonly HashSet<string> _accounts = new(StringComparer.Ordinal);
    private readonly AuditLog _log;

    public AccountService(AuditLog log) => _log = log;

    /// <summary>
    /// Creates an account. A valid username has 3 to 20 characters: letters a-z or A-Z, digits and _.
    /// </summary>
    public void Register(string username)
    {
        _accounts.Add(username);
        _log.Write("register", username);
    }

    public bool Login(string username)
    {
        var known = _accounts.Contains(username);
        _log.Write(known ? "login-ok" : "login-failed", username);
        return known;
    }
}
