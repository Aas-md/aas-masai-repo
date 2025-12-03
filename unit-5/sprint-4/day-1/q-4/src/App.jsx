import React, { useState, useEffect, useCallback, useMemo } from "react";

// ----------------------------------------------------
// 🔥 Post Component (Optimized with React.memo)
// ----------------------------------------------------
const Post = React.memo(function Post({ post, onToggle }) {
  // Background color should NOT change on re-render → useMemo
  const bgColor = useMemo(() => {
    return `hsl(${Math.floor(Math.random() * 360)}, 70%, 80%)`;
  }, []); // empty → run only once

  console.log("Rendering Post:", post.id);

  return (
    <div
      style={{
        padding: "10px",
        margin: "10px 0",
        background: bgColor,
        borderRadius: "8px",
      }}
    >
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <p>Status: {post.verifyPost ? "Verified" : "Not Verified"}</p>

      <button onClick={() => onToggle(post.id)}>
        {post.verifyPost ? "Verified" : "Verify"}
      </button>
    </div>
  );
});

// ----------------------------------------------------
// 🔥 App Component
// ----------------------------------------------------
export default function App() {
  const [timer, setTimer] = useState(0);
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // Timer increases every second
  useEffect(() => {
    const id = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Add post
  const addPost = () => {
    if (!title.trim() || !body.trim()) return;

    setPosts((prev) => [
      ...prev,
      {
        id: Date.now(),
        title,
        body,
        verifyPost: false,
      },
    ]);

    setTitle("");
    setBody("");
  };

  // Toggle verify (memoized using useCallback)
  const toggleVerify = useCallback((id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, verifyPost: !p.verifyPost } : p
      )
    );
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Performance Optimisation Demo</h2>

      <h3>Timer: {timer}</h3>

      <input
        placeholder="Post Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Post Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <br /><br />

      <button onClick={addPost}>Add Post</button>

      <h2>Posts</h2>

      {posts.map((p) => (
        <Post key={p.id} post={p} onToggle={toggleVerify} />
      ))}
    </div>
  );
}
