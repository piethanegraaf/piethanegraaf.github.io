// Written by the AI coding assistant together with CommentRenderer.cs.

namespace AiReviewComments;

public class CommentRendererTests
{
    private static readonly DateTimeOffset Monday = new(2026, 11, 9, 14, 5, 0, TimeSpan.Zero);

    [Fact]
    public void Renders_author_date_and_body()
    {
        var html = CommentRenderer.Render(new Comment("Fatima", "Nice post!", Monday));

        Assert.Equal(
            "<article class=\"comment\"><header><strong>Fatima</strong> <time datetime=\"2026-11-09\">2026-11-09</time></header>"
            + "<p>Nice post!</p></article>",
            html);
    }

    [Fact]
    public void Script_in_body_is_encoded()
    {
        var html = CommentRenderer.Render(new Comment("Fatima", "<script>alert(1)</script>", Monday));

        Assert.DoesNotContain("<script>", html);
        Assert.Contains("&lt;script&gt;alert(1)&lt;/script&gt;", html);
    }

    [Fact]
    public void Line_breaks_in_body_become_br()
    {
        var html = CommentRenderer.Render(new Comment("Fatima", "First line\nSecond line", Monday));

        Assert.Contains("<p>First line<br>Second line</p>", html);
    }

    [Fact]
    public void RenderAll_shows_oldest_comment_first()
    {
        var later = new Comment("Bob", "Agreed.", Monday.AddHours(2));
        var earlier = new Comment("Fatima", "Nice post!", Monday);

        var html = CommentRenderer.RenderAll([later, earlier]);

        Assert.True(html.IndexOf("Fatima", StringComparison.Ordinal) < html.IndexOf("Bob", StringComparison.Ordinal));
    }

    [Fact]
    public void RenderAll_of_no_comments_is_empty()
    {
        Assert.Equal("", CommentRenderer.RenderAll([]));
    }
}
