import React from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

// -----------------------------
// REDUX SLICE
// -----------------------------
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.total += action.payload.price;
    },
    removeItem: (state, action) => {
      const id = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        state.items = state.items.filter((i) => i.id !== id);
        state.total -= item.price;
      }
    },
  },
});

const { addItem, removeItem } = cartSlice.actions;

// -----------------------------
// STORE
// -----------------------------
const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});

// -----------------------------
// PRODUCTS UI
// -----------------------------
const products = [
  { id: 1, name: "Shoes", price: 1200 },
  { id: 2, name: "T-shirt", price: 500 },
  { id: 3, name: "Watch", price: 1500 },
];

function Products() {
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Products</h2>
      {products.map((p) => (
        <div
          key={p.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <span>
            {p.name} — ₹{p.price}
          </span>

          <button onClick={() => dispatch(addItem(p))}>
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

// -----------------------------
// CART UI
// -----------------------------
function Cart() {
  const items = useSelector((state) => state.cart.items);
  const total = useSelector((state) => state.cart.total);
  const dispatch = useDispatch();

  return (
    <div style={{ marginTop: "25px" }}>
      <h2>Your Cart</h2>

      {items.length === 0 && <p>No items in cart.</p>}

      {items.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <span>
            {item.name} — ₹{item.price}
          </span>

          <button onClick={() => dispatch(removeItem(item.id))}>
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>
    </div>
  );
}

// -----------------------------
// MAIN APP COMPONENT
// -----------------------------
export default function App() {
  return (
    <Provider store={store}>
      <div style={{ padding: "20px" }}>
        <h1>Shopping Cart (Redux Toolkit - Single File)</h1>
        <Products />
        <Cart />
      </div>
    </Provider>
  );
}
