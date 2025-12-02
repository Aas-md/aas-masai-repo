import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";

// ----------------- Slice -----------------
const counterSlice = createSlice({
  name: "counter",
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value++;
    },
    decrement: (state) => {
      state.value--;
    },
  },
});

const { increment, decrement } = counterSlice.actions;

// ----------------- Store -----------------
const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
  },
});

// ----------------- UI Component -----------------
function UI() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.counter.value);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Redux Counter</h1>

      <h2>{count}</h2>

      <button
        onClick={() => dispatch(increment())}
        style={{ padding: "8px 15px", marginRight: 10 }}
      >
        +
      </button>

      <button
        onClick={() => dispatch(decrement())}
        style={{ padding: "8px 15px" }}
      >
        -
      </button>
    </div>
  );
}

// ----------------- App with Provider -----------------
export default function App() {
  return (
    <Provider store={store}>
      <UI />
    </Provider>
  );
}
