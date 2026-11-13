namespace ResetToken;

/// <summary>
/// Makes the token for the "Forgot your password?" link:
/// https://shop.example/reset?token=... Whoever has the token can choose a new password.
/// </summary>
public sealed class ResetTokenGenerator
{
    private const string UrlSafeAlphabet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

    private const int TokenLength = 20;

    private readonly Random _random = new(Environment.TickCount);

    public string NewToken()
    {
        var token = new char[TokenLength];
        for (var i = 0; i < token.Length; i++)
        {
            token[i] = UrlSafeAlphabet[_random.Next(UrlSafeAlphabet.Length)];
        }
        return new string(token);
    }
}
