import React, { useState } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

// ---------------- Redux Slice ----------------
const taskSlice = createSlice({
  name: "tasks",
  initialState: [],
  reducers: {
    addTask: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
      });
    },
    deleteTask: (state, action) => {
      return state.filter((t) => t.id !== action.payload);
    },
    toggleTask: (state, action) => {
      const t = state.find((x) => x.id === action.payload);
      if (t) t.completed = !t.completed;
    },
  },
});

const { addTask, deleteTask, toggleTask } = taskSlice.actions;

// ---------------- Store ----------------
const store = configureStore({
  reducer: {
    tasks: taskSlice.reducer,
  },
});

// ---------------- UI Component (inside same file) ----------------
function UI() {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const [text, setText] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h1>Redux Task App</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add task..."
        style={{ padding: 8, marginRight: 10 }}
      />
      <button
        onClick={() => {
          if (text.trim()) {
            dispatch(addTask(text));
            setText("");
          }
        }}
      >
        Add
      </button>

      <ul style={{ marginTop: 20 }}>
        {tasks.map((t) => (
          <li
            key={t.id}
            style={{
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span style={{ textDecoration: t.completed ? "line-through" : "none" }}>
              {t.text}
            </span>

            <div>
              <button onClick={() => dispatch(toggleTask(t.id))}>Toggle</button>
              <button
                style={{ marginLeft: 8 }}
                onClick={() => dispatch(deleteTask(t.id))}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------------- Exported App (Provider yahin hoga) ----------------
export default function App() {
  return (
    <Provider store={store}>
      <UI />
    </Provider>
  );
}
