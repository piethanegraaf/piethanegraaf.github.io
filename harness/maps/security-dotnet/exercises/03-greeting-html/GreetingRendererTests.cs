using System.Text.RegularExpressions;

namespace GreetingHtml;

public class GreetingRendererTests
{
    // The shape of a safe banner: one h1 with exactly two attributes, and no other tags.
    // Text inside an attribute may not contain " < or >, and the text inside the h1 may not contain < or >.
    private static readonly Regex SafeBanner = new(
        "^<h1 class=\"greeting\" title=\"[^\"<>]*\">[^<>]*</h1>$");

    // ---------- What the banner must show ----------

    [Fact]
    public void Normal_name_renders_in_text_and_title()
    {
        Assert.Equal(
            "<h1 class=\"greeting\" title=\"Logged in as Fatima\">Welcome back, Fatima!</h1>",
            GreetingRenderer.Render("Fatima"));
    }

    [Fact]
    public void Ampersand_in_name_renders_as_html_entity()
    {
        Assert.Equal(
            "<h1 class=\"greeting\" title=\"Logged in as Tom &amp; Jerry\">Welcome back, Tom &amp; Jerry!</h1>",
            GreetingRenderer.Render("Tom & Jerry"));
    }

    // ---------- What an attacker must not be able to do ----------

    [Fact]
    public void Script_tag_in_name_comes_back_encoded()
    {
        var html = GreetingRenderer.Render("<script>alert(1)</script>");

        Assert.DoesNotContain("<script>", html);
        Assert.Contains("&lt;script&gt;", html);
    }

    [Fact]
    public void Quote_in_name_cannot_break_out_of_the_title_attribute()
    {
        var html = GreetingRenderer.Render("\" onmouseover=\"alert(1)");

        Assert.DoesNotContain("\" onmouseover=\"", html);
        Assert.Contains("&quot;", html);
    }

    [Theory]
    [InlineData("<script>alert(1)</script>")]
    [InlineData("\" onmouseover=\"alert(1)")]
    [InlineData("\"><img src=x onerror=alert(1)>")]
    [InlineData("</h1><a href=\"https://evil.example\">Log in again</a>")]
    public void Banner_keeps_its_shape_whatever_the_name(string displayName)
    {
        Assert.Matches(SafeBanner, GreetingRenderer.Render(displayName));
    }
}
