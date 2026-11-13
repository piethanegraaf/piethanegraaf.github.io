using Microsoft.Data.Sqlite;

namespace SqlFilterSort;

public sealed class ProductCatalogTests : IDisposable
{
    // One in-memory database per test. It lives as long as this open connection.
    private readonly SqliteConnection _connection = new("Data Source=:memory:");
    private readonly ProductCatalog _catalog;

    public ProductCatalogTests()
    {
        _connection.Open();
        using var setup = _connection.CreateCommand();
        setup.CommandText = """
            CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, price NUMERIC NOT NULL);
            INSERT INTO products (id, name, category, price) VALUES
                (1, 'Refactoring', 'books', 45.00),
                (2, 'Clean Code', 'books', 35.50),
                (3, 'Domain-Driven Design', 'books', 55.00),
                (4, 'Mechanical keyboard', 'hardware', 129.00),
                (5, 'USB-C cable', 'hardware', 9.95);
            CREATE TABLE staff_accounts (username TEXT NOT NULL, password_hash TEXT NOT NULL);
            INSERT INTO staff_accounts VALUES ('admin', 'pbkdf2$600000$c2FsdA$aGFzaA');
            """;
        setup.ExecuteNonQuery();
        _catalog = new ProductCatalog(_connection);
    }

    public void Dispose() => _connection.Dispose();

    private long CountProducts()
    {
        using var command = _connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM products";
        return (long)command.ExecuteScalar()!;
    }

    // ---------- What the filter must do ----------

    [Fact]
    public void Filter_by_category_sorted_by_price_returns_cheapest_first()
    {
        var names = _catalog.Filter("books", "price").Select(p => p.Name);

        Assert.Equal(["Clean Code", "Refactoring", "Domain-Driven Design"], names);
    }

    [Fact]
    public void Filter_by_category_sorted_by_name_returns_alphabetical_order()
    {
        var names = _catalog.Filter("hardware", "name").Select(p => p.Name);

        Assert.Equal(["Mechanical keyboard", "USB-C cable"], names);
    }

    [Fact]
    public void Filter_for_unknown_category_returns_no_rows()
    {
        Assert.Empty(_catalog.Filter("garden", "name"));
    }

    // ---------- What an attacker must not be able to do: the value ----------

    [Fact]
    public void Filter_with_injection_in_category_returns_no_rows()
    {
        Assert.Empty(_catalog.Filter("' OR '1'='1", "name"));
    }

    [Fact]
    public void Filter_with_drop_table_in_category_keeps_the_products_table()
    {
        Assert.Empty(_catalog.Filter("'; DROP TABLE products; --", "name"));
        Assert.Equal(5, CountProducts());
    }

    // ---------- What an attacker must not be able to do: the sort column ----------
    // Decision for this exercise: a sort column that is not on the list throws ArgumentException.

    [Theory]
    [InlineData("password_hash")]
    [InlineData("price; DROP TABLE products; --")]
    [InlineData("(SELECT CASE WHEN substr(password_hash, 1, 1) = 'p' THEN name ELSE price END FROM staff_accounts)")]
    [InlineData("")]
    public void Filter_with_sort_column_not_on_the_list_throws_ArgumentException(string sortBy)
    {
        Assert.Throws<ArgumentException>(() => _catalog.Filter("books", sortBy));
    }

    [Fact]
    public void Filter_with_injection_in_sort_column_keeps_the_products_table()
    {
        try { _catalog.Filter("books", "price; DROP TABLE products; --"); }
        catch (ArgumentException) { /* rejected: that is fine */ }

        Assert.Equal(5, CountProducts());
    }
}
