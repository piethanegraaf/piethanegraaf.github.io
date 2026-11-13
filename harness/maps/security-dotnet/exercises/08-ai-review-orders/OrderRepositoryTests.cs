// Written by the AI coding assistant together with OrderRepository.cs.

using Microsoft.Data.Sqlite;

namespace AiReviewOrders;

public sealed class OrderRepositoryTests : IDisposable
{
    // One in-memory database per test. It lives as long as this open connection.
    private readonly SqliteConnection _connection = new("Data Source=:memory:");
    private readonly OrderRepository _orders;

    public OrderRepositoryTests()
    {
        _connection.Open();
        using var setup = _connection.CreateCommand();
        setup.CommandText = """
            CREATE TABLE orders (
                id INTEGER PRIMARY KEY,
                order_number TEXT NOT NULL UNIQUE,
                customer_email TEXT NOT NULL,
                status TEXT NOT NULL);
            """;
        setup.ExecuteNonQuery();
        _orders = new OrderRepository(_connection);
    }

    public void Dispose() => _connection.Dispose();

    private void SetStatus(int id, string status)
    {
        using var command = _connection.CreateCommand();
        command.CommandText = "UPDATE orders SET status = $status WHERE id = $id";
        command.Parameters.AddWithValue("$status", status);
        command.Parameters.AddWithValue("$id", id);
        command.ExecuteNonQuery();
    }

    [Fact]
    public void Create_returns_a_new_order_with_an_order_number()
    {
        var order = _orders.Create("fatima@example.com");

        Assert.StartsWith("ORD-", order.OrderNumber);
        Assert.Equal("new", order.Status);
        Assert.Equal(order, _orders.GetById(order.Id));
    }

    [Fact]
    public void GetById_of_unknown_id_returns_null()
    {
        Assert.Null(_orders.GetById(42));
    }

    [Fact]
    public void FindByCustomer_returns_only_that_customers_orders()
    {
        var first = _orders.Create("fatima@example.com");
        _orders.Create("bob@example.com");
        var second = _orders.Create("fatima@example.com");

        Assert.Equal([first, second], _orders.FindByCustomer("fatima@example.com"));
    }

    [Fact]
    public void FindByStatus_returns_only_orders_with_that_status()
    {
        var paid = _orders.Create("fatima@example.com");
        _orders.Create("bob@example.com");
        SetStatus(paid.Id, "paid");

        var found = Assert.Single(_orders.FindByStatus("paid"));
        Assert.Equal(paid.Id, found.Id);
    }

    [Fact]
    public void Two_orders_get_different_order_numbers()
    {
        var a = _orders.Create("fatima@example.com");
        var b = _orders.Create("fatima@example.com");

        Assert.NotEqual(a.OrderNumber, b.OrderNumber);
    }
}
