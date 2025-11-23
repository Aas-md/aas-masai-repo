import { useEffect, useState } from "react";

function UserCard({ name, email, city }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 0 6px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ margin: "0 0 6px 0" }}>{name}</h3>
      <p style={{ margin: "4px 0" }}>
        <strong>Email:</strong> {email}
      </p>
      <p style={{ margin: "4px 0" }}>
        <strong>City:</strong> {city}
      </p>
    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://jsonplaceholder.typicode.com/users");

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "600px",
        margin: "auto",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ marginBottom: "20px", textAlign: "center" }}>
        User Profiles
      </h1>

      {loading && <p style={{ textAlign: "center" }}>Loading users...</p>}
      {error && (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      )}

      {!loading &&
        users.map((user) => (
          <UserCard
            key={user.id}
            name={user.name}
            email={user.email}
            city={user.address.city}
          />
        ))}
    </div>
  );
}
