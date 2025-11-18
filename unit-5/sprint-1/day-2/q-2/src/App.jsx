import { useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      setProducts([]); // Clear old data

      const res = await fetch("https://fakestoreapi.com/products");
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Product Store</h1>

      <button 
        onClick={loadProducts} 
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Load Products
      </button>

      {/* Loading */}
      {loading && <p style={{ marginTop: "20px" }}>Loading...</p>}

      {/* Error */}
      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {/* No Data */}
      {!loading && !error && products.length === 0 && (
        <p style={{ marginTop: "20px" }}>No products loaded.</p>
      )}

      {/* Product Grid */}
      <div
        style={{
          marginTop: "30px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {products.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              textAlign: "center",
            }}
          >
            <img
              src={item.image}
              alt={item.title}
              style={{
                height: "150px",
                objectFit: "contain",
                marginBottom: "10px",
              }}
            />
            <h3 style={{ fontSize: "16px", minHeight: "50px" }}>
              {item.title}
            </h3>
            <p style={{ fontWeight: "bold", fontSize: "18px" }}>
              ${item.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
