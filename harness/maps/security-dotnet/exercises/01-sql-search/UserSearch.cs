using Microsoft.Data.Sqlite;

namespace SqlSearch;

public sealed record User(int Id, string Name, string Email);

/// <summary>
/// The search box on the admin page "Users": staff type a name and get the matching accounts.
/// </summary>
public sealed class UserSearch
{
    private readonly SqliteConnection _connection;

    public UserSearch(SqliteConnection connection) => _connection = connection;

    public IReadOnlyList<User> FindByName(string name)
    {
        using var command = _connection.CreateCommand();
        command.CommandText = "SELECT id, name, email FROM users WHERE name = '" + name + "' ORDER BY id";

        var users = new List<User>();
        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            users.Add(new User(reader.GetInt32(0), reader.GetString(1), reader.GetString(2)));
        }
        return users;
    }
}
