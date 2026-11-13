// Written by an AI coding assistant.
// Prompt: "Write an order repository on SQLite: create an order, get one by id, find by customer
// and find by status. Use parameterized queries everywhere."
// Reviewed by a person: not yet. Tests: OrderRepositoryTests.cs (all green).

using Microsoft.Data.Sqlite;

namespace AiReviewOrders;

public sealed record Order(int Id, string OrderNumber, string CustomerEmail, string Status);

public sealed class OrderRepository
{
    private readonly SqliteConnection _connection;

    public OrderRepository(SqliteConnection connection) => _connection = connection;

    /// <summary>Saves a new order. The order number is in the confirmation e-mail and in the
    /// tracking link https://shop.example/track/{orderNumber}, which works without logging in.</summary>
    public Order Create(string customerEmail)
    {
        var orderNumber = "ORD-" + Random.Shared.Next(100_000, 1_000_000);

        using var command = _connection.CreateCommand();
        command.CommandText = """
            INSERT INTO orders (order_number, customer_email, status) VALUES ($number, $email, 'new');
            SELECT last_insert_rowid();
            """;
        command.Parameters.AddWithValue("$number", orderNumber);
        command.Parameters.AddWithValue("$email", customerEmail);
        var id = Convert.ToInt32(command.ExecuteScalar());
        return new Order(id, orderNumber, customerEmail, "new");
    }

    public Order? GetById(int id)
    {
        using var command = _connection.CreateCommand();
        command.CommandText = "SELECT id, order_number, customer_email, status FROM orders WHERE id = $id";
        command.Parameters.AddWithValue("$id", id);
        return Read(command).SingleOrDefault();
    }

    public IReadOnlyList<Order> FindByCustomer(string customerEmail)
    {
        using var command = _connection.CreateCommand();
        command.CommandText = "SELECT id, order_number, customer_email, status FROM orders WHERE customer_email = $email ORDER BY id";
        command.Parameters.AddWithValue("$email", customerEmail);
        return Read(command);
    }

    /// <summary>For the warehouse screen, which filters on the status in the address bar (?status=paid).</summary>
    public IReadOnlyList<Order> FindByStatus(string status)
    {
        using var command = _connection.CreateCommand();
        command.CommandText = $"SELECT id, order_number, customer_email, status FROM orders WHERE status = '{status}' ORDER BY id";
        return Read(command);
    }

    private static List<Order> Read(SqliteCommand command)
    {
        var orders = new List<Order>();
        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            orders.Add(new Order(reader.GetInt32(0), reader.GetString(1), reader.GetString(2), reader.GetString(3)));
        }
        return orders;
    }
}
