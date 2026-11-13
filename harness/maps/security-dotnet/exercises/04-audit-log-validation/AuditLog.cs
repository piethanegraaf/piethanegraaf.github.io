namespace AuditLogValidation;

/// <summary>
/// The audit log: one line per event. The security team reads it, and a script counts the
/// failed logins per user to find password guessing.
/// </summary>
public sealed class AuditLog
{
    private readonly TextWriter _writer;
    private readonly TimeProvider _clock;

    public AuditLog(TextWriter writer, TimeProvider clock)
    {
        _writer = writer;
        _clock = clock;
    }

    public void Write(string action, string username)
    {
        _writer.WriteLine($"{_clock.GetUtcNow():yyyy-MM-ddTHH:mm:ssZ} {action} user={username}");
    }
}
