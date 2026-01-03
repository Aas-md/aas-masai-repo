const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// MongoDB connect (NO env)
mongoose.connect("mongodb://127.0.0.1:27017/orderdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Schema
const orderSchema = new mongoose.Schema({
  order_id: Number,
  customer_name: String,
  items: [String],
  total_amount: Number,
  order_status: String
});

const Order = mongoose.model("Order", orderSchema);

/* ---------- QUERIES ---------- */

// 1️⃣ shipped orders
app.get("/shipped", async (req, res) => {
  const data = await Order.find({ order_status: "shipped" });
  res.json(data);
});

// 2️⃣ update amount (order_id:1)
app.put("/update-amount", async (req, res) => {
  await Order.updateOne({ order_id: 1 }, { total_amount: 70000 });
  res.json({ message: "Amount updated" });
});

// 3️⃣ delete order_id:4
app.delete("/delete-order", async (req, res) => {
  await Order.deleteOne({ order_id: 4 });
  res.json({ message: "Order deleted" });
});

// 4️⃣ find Alice Johnson
app.get("/alice", async (req, res) => {
  const data = await Order.findOne({ customer_name: "Alice Johnson" });
  res.json(data);
});

// 5️⃣ update status order_id:2
app.put("/deliver-order", async (req, res) => {
  await Order.updateOne({ order_id: 2 }, { order_status: "delivered" });
  res.json({ message: "Order delivered" });
});

// 6️⃣ amount >= 15000
app.get("/high-value", async (req, res) => {
  const data = await Order.find({ total_amount: { $gte: 15000 } });
  res.json(data);
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "404 Not Found" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
