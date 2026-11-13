// Written by an AI coding assistant.
// Prompt: "Write a renderer for the comments under a blog post. It must be safe against XSS."
// Reviewed by a person: not yet. Tests: CommentRendererTests.cs (all green).

using System.Globalization;
using System.Net;

namespace AiReviewComments;

public sealed record Comment(string Author, string Body, DateTimeOffset PostedAt);

public static class CommentRenderer
{
    /// <summary>Renders one comment as an HTML article. The body is HTML-encoded to prevent XSS.</summary>
    public static string Render(Comment comment)
    {
        // Encode first, then turn the line breaks of the body into <br>.
        var body = WebUtility.HtmlEncode(comment.Body).Replace("\n", "<br>");
        var date = comment.PostedAt.UtcDateTime.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

        return "<article class=\"comment\">"
            + $"<header><strong>{comment.Author}</strong> <time datetime=\"{date}\">{date}</time></header>"
            + $"<p>{body}</p>"
            + "</article>";
    }

    /// <summary>Renders all comments, oldest first.</summary>
    public static string RenderAll(IEnumerable<Comment> comments) =>
        string.Join("\n", comments.OrderBy(c => c.PostedAt).Select(Render));
}
