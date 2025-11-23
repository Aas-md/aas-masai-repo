import { useEffect, useState } from "react";

export default function App() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuote = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("Fetching quote...");

      const res = await fetch("https://dummyjson.com/quotes/random");

      if (!res.ok) throw new Error("API not reachable");

      const data = await res.json();
      console.log("Fetched data:", data);

      setQuote(data);
    } catch (err) {
      console.log("Error:", err.message);
      setError("Failed to fetch quote");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();

    const interval = setInterval(fetchQuote, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        textAlign: "center",
        maxWidth: "600px",
        margin: "auto",
        minHeight: "100vh",
      }}
    >
      <h1>Daily Quote Viewer</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* SAFETY: Quote tabhi show hoga jab data aayega */}
      {quote && (
        <div
          style={{
            padding: "20px",
            marginTop: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            background: "#fafafa",
          }}
        >
          <p style={{ fontSize: "20px", fontStyle: "italic" }}>
            “{quote.quote}”
          </p>
          <h4>- {quote.author}</h4>
        </div>
      )}

      <button
        onClick={fetchQuote}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Get New Quote
      </button>
    </div>
  );
}
