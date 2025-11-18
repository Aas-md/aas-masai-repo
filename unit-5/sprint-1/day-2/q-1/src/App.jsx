import { useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("https://fakestoreapi.com/products");

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      console.log("Products:", data); // console print

      setProducts(data); // <-- YE ADD KIYA: screen par show karega
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Fetch Products Demo</h1>

      <button onClick={fetchProducts}>Fetch Products</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              border: "1px solid gray",
              margin: "10px 0",
              padding: "10px"
            }}
          >
            <h3>{p.title}</h3>
            <p>${p.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
