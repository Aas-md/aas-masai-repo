import { useState } from "react";

function ThemedBox({ theme, text }) {
  const boxStyle = {
    padding: "20px",
    margin: "10px 0",
    borderRadius: "10px",
    textAlign: "center",
    backgroundColor: theme === "light" ? "#ffffff" : "#333333",
    color: theme === "light" ? "#000000" : "#ffffff",
    border: "1px solid",
  };

  return <div style={boxStyle}>{text}</div>;
}

export default function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const appStyle = {
    backgroundColor: theme === "light" ? "#f2f2f2" : "#1a1a1a",
    minHeight: "100vh",
    padding: "20px",
    color: theme === "light" ? "#000" : "#fff",
    transition: "0.3s",
  };

  return (
    <div style={appStyle}>
      <h1>Theme Toggle App</h1>

      <button
        onClick={toggleTheme}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        Toggle Theme
      </button>

      {/* Reusable Boxes */}
      <ThemedBox theme={theme} text="Box 1 - Themed" />
      <ThemedBox theme={theme} text="Box 2 - Themed" />
      <ThemedBox theme={theme} text="Box 3 - Themed" />
    </div>
  );
}
