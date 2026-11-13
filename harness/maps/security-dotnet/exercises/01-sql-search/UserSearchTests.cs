using Microsoft.Data.Sqlite;

namespace SqlSearch;

public sealed class UserSearchTests : IDisposable
{
    // One in-memory database per test. It lives as long as this open connection.
    private readonly SqliteConnection _connection = new("Data Source=:memory:");
    private readonly UserSearch _search;

    public UserSearchTests()
    {
        _connection.Open();
        using var setup = _connection.CreateCommand();
        setup.CommandText = """
            CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL);
            INSERT INTO users (id, name, email) VALUES
                (1, 'Alice', 'alice@example.com'),
                (2, 'Bob', 'bob@example.com'),
                (3, 'O''Brien', 'obrien@example.com');
            """;
        setup.ExecuteNonQuery();
        _search = new UserSearch(_connection);
    }

    public void Dispose() => _connection.Dispose();

    private long CountUsers()
    {
        using var command = _connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM users";
        return (long)command.ExecuteScalar()!;
    }

    // ---------- What the search must do ----------

    [Fact]
    public void Search_by_exact_name_returns_that_user()
    {
        var users = _search.FindByName("Bob");

        var bob = Assert.Single(users);
        Assert.Equal(new User(2, "Bob", "bob@example.com"), bob);
    }

    [Fact]
    public void Search_for_unknown_name_returns_no_rows()
    {
        Assert.Empty(_search.FindByName("Mallory"));
    }

    [Fact]
    public void Search_for_name_with_apostrophe_returns_that_user()
    {
        var user = Assert.Single(_search.FindByName("O'Brien"));
        Assert.Equal(3, user.Id);
    }

    // ---------- What an attacker must not be able to do ----------

    [Fact]
    public void Search_with_injection_string_returns_no_rows()
    {
        Assert.Empty(_search.FindByName("' OR '1'='1"));
    }

    [Fact]
    public void Search_with_union_injection_does_not_leak_other_columns()
    {
        var users = _search.FindByName("' UNION SELECT id, email, email FROM users --");

        Assert.Empty(users);
    }

    [Fact]
    public void Search_with_drop_table_string_keeps_the_users_table()
    {
        var users = _search.FindByName("'; DROP TABLE users; --");

        Assert.Empty(users);
        Assert.Equal(3, CountUsers());
    }
}
