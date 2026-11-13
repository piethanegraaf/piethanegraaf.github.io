namespace GreetingHtml;

/// <summary>
/// The welcome banner at the top of the dashboard. The name comes from the profile,
/// which the user fills in on the "My account" page.
/// </summary>
public static class GreetingRenderer
{
    public static string Render(string displayName)
    {
        return $"<h1 class=\"greeting\" title=\"Logged in as {displayName}\">Welcome back, {displayName}!</h1>";
    }
}
