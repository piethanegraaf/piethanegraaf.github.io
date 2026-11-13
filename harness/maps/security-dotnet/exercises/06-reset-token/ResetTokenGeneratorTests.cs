using System.Text.RegularExpressions;

namespace ResetToken;

public class ResetTokenGeneratorTests
{
    // base64url without padding: letters, digits, - and _ (no +, / or =), so it fits in a URL as it is.
    private static readonly Regex UrlSafe = new("^[A-Za-z0-9_-]+$");

    // ---------- What a token must be ----------

    [Fact]
    public void Token_contains_only_url_safe_characters()
    {
        var token = new ResetTokenGenerator().NewToken();

        Assert.Matches(UrlSafe, token);
    }

    [Fact]
    public void Ten_thousand_tokens_are_all_different()
    {
        var generator = new ResetTokenGenerator();

        var tokens = Enumerable.Range(0, 10_000).Select(_ => generator.NewToken()).ToList();

        Assert.Equal(tokens.Count, tokens.Distinct().Count());
    }

    // ---------- What an attacker must not be able to do: guess a token ----------

    [Fact]
    public void Token_carries_at_least_256_bits()
    {
        // 32 random bytes in base64url are 43 characters.
        var token = new ResetTokenGenerator().NewToken();

        Assert.True(token.Length >= 43, $"The token has {token.Length} characters; 32 bytes need at least 43.");
    }

    [Fact]
    public void Generators_created_at_the_same_moment_give_different_tokens()
    {
        // Two requests for a reset link that arrive in the same millisecond, e.g. the attacker's own
        // account and the victim's: the attacker must not be able to predict the victim's token from theirs.
        var generators = Enumerable.Range(0, 10).Select(_ => new ResetTokenGenerator()).ToList();

        var firstTokens = generators.Select(g => g.NewToken()).ToList();

        Assert.Equal(firstTokens.Count, firstTokens.Distinct().Count());
    }

    [Fact]
    public void Source_does_not_use_System_Random()
    {
        // A rough check that reads the code: System.Random is predictable, whatever its seed.
        // The analyser rule CA5394 looks for the same thing, but properly.
        var lines = File.ReadAllLines(Path.Combine(ProjectFolder(), "ResetTokenGenerator.cs"))
            .Select(line => Regex.Replace(line, "//.*$", ""));

        Assert.DoesNotContain(lines, line => Regex.IsMatch(line, @"\bRandom\b"));
    }

    // The tests run from bin/Debug/net10.0: walk up to the folder with the .csproj.
    private static string ProjectFolder()
    {
        for (var dir = new DirectoryInfo(AppContext.BaseDirectory); dir is not null; dir = dir.Parent)
        {
            if (dir.EnumerateFiles("*.csproj").Any()) return dir.FullName;
        }
        throw new InvalidOperationException("No .csproj found above " + AppContext.BaseDirectory);
    }
}
