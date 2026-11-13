using System.Text.RegularExpressions;

namespace ApiKeyConfig;

public class ShippingApiClientTests
{
    // A made-up key for the tests: it only exists here.
    private const string TestKey = "test_key_4f9a1c7e2b8d6035";

    private static ShippingApiClient ClientWith(string? key) =>
        new(new Dictionary<string, string?> { [ShippingApiClient.ApiKeySetting] = key });

    // ---------- What the client must do ----------

    [Fact]
    public void Tracking_request_carries_the_key_from_the_settings()
    {
        using var request = ClientWith(TestKey).CreateTrackingRequest("3SABC1234567");

        Assert.Equal(TestKey, Assert.Single(request.Headers.GetValues("X-Api-Key")));
        Assert.Equal("https://api.parcel-carrier.example/v2/track/3SABC1234567", request.RequestUri!.ToString());
    }

    [Fact]
    public void Description_names_the_client()
    {
        Assert.Contains("ShippingApiClient", ClientWith(TestKey).ToString());
    }

    // ---------- What must not happen to the secret ----------

    [Fact]
    public void Missing_key_throws_InvalidOperationException_instead_of_using_a_fallback()
    {
        Assert.Throws<InvalidOperationException>(() => new ShippingApiClient(new Dictionary<string, string?>()));
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void Empty_key_throws_InvalidOperationException(string? key)
    {
        Assert.Throws<InvalidOperationException>(() => ClientWith(key));
    }

    [Fact]
    public void Description_does_not_reveal_the_key()
    {
        var description = ClientWith(TestKey).ToString();

        Assert.DoesNotContain(TestKey, description);
        Assert.DoesNotContain(TestKey[..8], description);
    }

    [Fact]
    public void Source_file_contains_no_hard_coded_key()
    {
        var source = File.ReadAllText(Path.Combine(ProjectFolder(), "ShippingApiClient.cs"));

        // A string literal of 20 or more letters, digits, _ or - looks like a key or token.
        var keyLike = Regex.Matches(source, "\"[A-Za-z0-9_-]{20,}\"").Select(m => m.Value);
        Assert.Empty(keyLike);
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
