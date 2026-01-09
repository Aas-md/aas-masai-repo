const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONNECT =================
mongoose.connect("mongodb://127.0.0.1:27017/ecommerceDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ================= SCHEMA =================
const orderSchema = new mongoose.Schema({
  username: String,
  productName: String,
  category: String,
  quantity: Number,
  totalPrice: Number,
  orderDate: Date,
  status: String
});

const Order = mongoose.model("Order", orderSchema);

// ================= INSERT DATA (ONE TIME) =================
app.post("/insert-data", async (req, res) => {
  await Order.deleteMany({}); // avoid duplicate issue

  await Order.insertMany([
    { username: "alice", productName: "iPhone 14", category: "Electronics", quantity: 2, totalPrice: 2000, orderDate: "2024-11-12T10:30:00Z", status: "Delivered" },
    { username: "bob", productName: "T-shirt", category: "Clothing", quantity: 5, totalPrice: 100, orderDate: "2024-11-15T13:45:00Z", status: "Delivered" },
    { username: "charlie", productName: "iPhone 14", category: "Electronics", quantity: 1, totalPrice: 1000, orderDate: "2024-12-01T09:00:00Z", status: "Cancelled" },
    { username: "daisy", productName: "T-shirt", category: "Clothing", quantity: 2, totalPrice: 40, orderDate: "2024-12-10T14:00:00Z", status: "Pending" },
    { username: "edward", productName: "Coffee Maker", category: "Home Appliances", quantity: 1, totalPrice: 150, orderDate: "2025-01-05T16:30:00Z", status: "Shipped" },
    { username: "fatima", productName: "Blender", category: "Home Appliances", quantity: 1, totalPrice: 120, orderDate: "2025-01-15T12:10:00Z", status: "Delivered" },
    { username: "george", productName: "iPhone 14", category: "Electronics", quantity: 1, totalPrice: 1000, orderDate: "2025-02-01T10:00:00Z", status: "Delivered" },
    { username: "harry", productName: "Shoes", category: "Clothing", quantity: 3, totalPrice: 210, orderDate: "2025-02-10T17:20:00Z", status: "Delivered" },
    { username: "isla", productName: "T-shirt", category: "Clothing", quantity: 4, totalPrice: 80, orderDate: "2025-03-01T09:30:00Z", status: "Shipped" },
    { username: "jake", productName: "AirPods", category: "Electronics", quantity: 2, totalPrice: 300, orderDate: "2025-03-12T14:45:00Z", status: "Delivered" },
    { username: "keira", productName: "Microwave", category: "Home Appliances", quantity: 1, totalPrice: 220, orderDate: "2025-03-25T11:00:00Z", status: "Delivered" },
    { username: "liam", productName: "AirPods", category: "Electronics", quantity: 1, totalPrice: 150, orderDate: "2025-04-01T08:15:00Z", status: "Cancelled" },
    { username: "mona", productName: "Shoes", category: "Clothing", quantity: 2, totalPrice: 140, orderDate: "2025-04-10T15:25:00Z", status: "Delivered" },
    { username: "nathan", productName: "iPhone 14", category: "Electronics", quantity: 1, totalPrice: 1000, orderDate: "2025-04-20T18:10:00Z", status: "Delivered" },
    { username: "olivia", productName: "T-shirt", category: "Clothing", quantity: 3, totalPrice: 60, orderDate: "2025-04-28T20:45:00Z", status: "Delivered" }
  ]);

  res.json({ message: "Orders data inserted successfully" });
});

// ================= AGGREGATION APIs =================

// 1. Top 3 best-selling products by quantity
app.get("/orders/top-products", async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: "$productName", totalQty: { $sum: "$quantity" } } },
    { $sort: { totalQty: -1 } },
    { $limit: 3 }
  ]);
  res.json(result);
});

// 2. Total revenue per category
app.get("/orders/category-revenue", async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: "$category", revenue: { $sum: "$totalPrice" } } }
  ]);
  res.json(result);
});

// 3. Average order price
app.get("/orders/average-price", async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: null, avgPrice: { $avg: "$totalPrice" } } }
  ]);
  res.json(result);
});

// 4. Orders per month
app.get("/orders/monthly-count", async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: { $month: "$orderDate" }, count: { $count: {} } } }
  ]);
  res.json(result);
});

// 5. Percentage of cancelled orders
app.get("/orders/cancelled-percentage", async (req, res) => {
  const total = await Order.countDocuments();
  const cancelled = await Order.countDocuments({ status: "Cancelled" });

  res.json({ percentage: (cancelled / total) * 100 });
});

// 6. Top category by revenue
app.get("/orders/top-category", async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: "$category", revenue: { $sum: "$totalPrice" } } },
    { $sort: { revenue: -1 } },
    { $limit: 1 }
  ]);
  res.json(result);
});

// 7. Most frequently ordered product
app.get("/orders/most-frequent-product", async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: "$productName", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 }
  ]);
  res.json(result);
});

// 8. Monthly revenue trend
app.get("/orders/monthly-revenue", async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: { $month: "$orderDate" }, revenue: { $sum: "$totalPrice" } } },
    { $sort: { _id: 1 } }
  ]);
  res.json(result);
});

// 9. Count of orders by status
app.get("/orders/status-count", async (req, res) => {
  const result = await Order.aggregate([
    { $group: { _id: "$status", count: { $count: {} } } }
  ]);
  res.json(result);
});

// 10. Total orders & quantity sold
app.get("/orders/summary", async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $count: {} },
        totalQuantity: { $sum: "$quantity" }
      }
    }
  ]);
  res.json(result);
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
