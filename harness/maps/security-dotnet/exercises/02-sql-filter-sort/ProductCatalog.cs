using Microsoft.Data.Sqlite;

namespace SqlFilterSort;

public sealed record Product(int Id, string Name, string Category, decimal Price);

/// <summary>
/// The product list of the web shop. The page sends the chosen category and the column
/// the customer clicked to sort on, e.g. ?category=books&amp;sort=price.
/// </summary>
public sealed class ProductCatalog
{
    private readonly SqliteConnection _connection;

    public ProductCatalog(SqliteConnection connection) => _connection = connection;

    /// <param name="category">The category to show, as chosen on the page.</param>
    /// <param name="sortBy">The column to sort on: "name" or "price".</param>
    public IReadOnlyList<Product> Filter(string category, string sortBy)
    {
        using var command = _connection.CreateCommand();
        command.CommandText =
            $"SELECT id, name, category, price FROM products WHERE category = '{category}' ORDER BY {sortBy}, id";

        var products = new List<Product>();
        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            products.Add(new Product(reader.GetInt32(0), reader.GetString(1), reader.GetString(2), reader.GetDecimal(3)));
        }
        return products;
    }
}
