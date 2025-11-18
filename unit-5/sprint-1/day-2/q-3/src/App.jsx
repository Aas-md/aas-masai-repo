import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [memes, setMemes] = useState([]);
  const [filteredMemes, setFilteredMemes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [filterBy, setFilterBy] = useState("");
  const [theme, setTheme] = useState("light");

  const loadMemes = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("https://api.imgflip.com/get_memes");
      if (!res.data.success) throw new Error("Failed to fetch memes");

      setMemes(res.data.data.memes);
      setFilteredMemes(res.data.data.memes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // RUNS AUTOMATICALLY WHEN search/sort/filter CHANGES
  useEffect(() => {
    let list = [...memes];

    // Search
    if (search.trim() !== "") {
      list = list.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter
    if (filterBy === "width") {
      list = list.filter((m) => m.width > 500);
    } else if (filterBy === "height") {
      list = list.filter((m) => m.height > 500);
    }

    // Sort
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "width") {
      list.sort((a, b) => a.width - b.width);
    }

    setFilteredMemes(list);
  }, [search, sortBy, filterBy, memes]); 
  // 👆 jitni bhi state yaha depend kar rahi hai, unke change par auto run hoga

  return (
    <div className={`app ${theme}`} style={{ padding: "20px" }}>
      <h1>Meme Explorer</h1>

      {/* Theme Toggle */}
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme ({theme === "light" ? "Dark" : "Light"})
      </button>

      {/* Load Button */}
      <button onClick={loadMemes} style={{ marginLeft: "10px" }}>
        Load Memes
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Controls */}
      {!loading && memes.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="text"
            placeholder="Search memes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "5px", marginRight: "10px" }}
          />

          <select onChange={(e) => setSortBy(e.target.value)} style={{ padding: "5px", marginRight: "10px" }}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="width">Width</option>
          </select>

          <select onChange={(e) => setFilterBy(e.target.value)} style={{ padding: "5px" }}>
            <option value="">Filter</option>
            <option value="width">Width  500</option>
            <option value="height">Height  500</option>
          </select>
        </div>
      )}

      {/* No Memes Found */}
      {!loading && filteredMemes.length === 0 && memes.length > 0 && (
        <p style={{ marginTop: "20px" }}>No memes found.</p>
      )}

      {/* Meme Grid */}
      <div
        style={{
          marginTop: "25px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredMemes.map((meme) => (
          <div
            key={meme.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "10px",
              background: theme === "light" ? "#fff" : "#333",
              color: theme === "light" ? "#000" : "#fff",
            }}
          >
            <img
              src={meme.url}
              alt={meme.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h3 style={{ fontSize: "16px", marginTop: "10px" }}>{meme.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
