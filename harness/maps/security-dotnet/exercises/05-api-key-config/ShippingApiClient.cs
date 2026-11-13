namespace ApiKeyConfig;

/// <summary>
/// Builds requests for the parcel carrier's tracking API. The carrier gives each customer one API key;
/// with it, anyone can create shipping labels on our account.
/// </summary>
public sealed class ShippingApiClient
{
    public const string ApiKeySetting = "Shipping:ApiKey";

    // Added during the demo so the app also works without settings. TODO: remove?
    private const string FallbackApiKey = "shpk_live_7Qm2Xv9Lr4Tz8Wc1Nb6Hd3Jf5Kp0Ys";

    private readonly string _apiKey;

    public ShippingApiClient(IReadOnlyDictionary<string, string?> settings)
    {
        _apiKey = settings.TryGetValue(ApiKeySetting, out var key) && !string.IsNullOrWhiteSpace(key)
            ? key
            : FallbackApiKey;
    }

    public HttpRequestMessage CreateTrackingRequest(string trackingNumber)
    {
        var request = new HttpRequestMessage(
            HttpMethod.Get,
            "https://api.parcel-carrier.example/v2/track/" + Uri.EscapeDataString(trackingNumber));
        request.Headers.Add("X-Api-Key", _apiKey);
        return request;
    }

    /// <summary>Shown on the health page and written to the log at startup.</summary>
    public override string ToString() => $"ShippingApiClient (key {_apiKey})";
}
