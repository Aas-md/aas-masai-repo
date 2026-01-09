const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONNECT =================
mongoose.connect("mongodb://127.0.0.1:27017/salesDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ================= SCHEMA =================
const saleSchema = new mongoose.Schema({
  saleId: Number,
  product: String,
  category: String,
  amount: Number,
  date: Date,
  region: String
});

const Sale = mongoose.model("Sale", saleSchema);

// ================= INSERT DATA (ONE TIME) =================
app.post("/insert-data", async (req, res) => {
  await Sale.insertMany([
    { saleId: 1, product: "Laptop", category: "Electronics", amount: 800, date: "2024-01-10", region: "North" },
    { saleId: 2, product: "Mobile", category: "Electronics", amount: 500, date: "2024-02-15", region: "South" },
    { saleId: 3, product: "Shoes", category: "Fashion", amount: 200, date: "2024-01-20", region: "North" },
    { saleId: 4, product: "TV", category: "Electronics", amount: 1000, date: "2024-03-05", region: "West" },
    { saleId: 5, product: "T-shirt", category: "Fashion", amount: 50, date: "2024-02-25", region: "East" },
    { saleId: 6, product: "Headphones", category: "Electronics", amount: 150, date: "2024-04-01", region: "South" },
    { saleId: 7, product: "Watch", category: "Fashion", amount: 300, date: "2024-03-15", region: "North" },
    { saleId: 8, product: "Laptop", category: "Electronics", amount: 850, date: "2024-02-12", region: "West" },
    { saleId: 9, product: "Shoes", category: "Fashion", amount: 250, date: "2024-04-18", region: "South" }
  ]);

  res.json({ message: "Data Inserted" });
});

// ================= AGGREGATION APIs =================

// 1. Total sales per category
app.get("/sales/category-total", async (req, res) => {
  const result = await Sale.aggregate([
    { $group: { _id: "$category", totalSales: { $sum: "$amount" } } }
  ]);
  res.json(result);
});

// 2. Month-wise total sales
app.get("/sales/monthly-total", async (req, res) => {
  const result = await Sale.aggregate([
    { $group: { _id: { $month: "$date" }, totalSales: { $sum: "$amount" } } }
  ]);
  res.json(result);
});

// 3. Highest selling product
app.get("/sales/highest-product", async (req, res) => {
  const result = await Sale.aggregate([
    { $group: { _id: "$product", revenue: { $sum: "$amount" } } },
    { $sort: { revenue: -1 } },
    { $limit: 1 }
  ]);
  res.json(result);
});

// 4. Average sale amount
app.get("/sales/average", async (req, res) => {
  const result = await Sale.aggregate([
    { $group: { _id: null, avgSale: { $avg: "$amount" } } }
  ]);
  res.json(result);
});

// 5. Sales count per month
app.get("/sales/monthly-count", async (req, res) => {
  const result = await Sale.aggregate([
    { $group: { _id: { $month: "$date" }, count: { $count: {} } } }
  ]);
  res.json(result);
});

// 6. Total sales per region
app.get("/sales/region-total", async (req, res) => {
  const result = await Sale.aggregate([
    { $group: { _id: "$region", totalSales: { $sum: "$amount" } } }
  ]);
  res.json(result);
});

// 7. Top 3 revenue products
app.get("/sales/top-products", async (req, res) => {
  const result = await Sale.aggregate([
    { $group: { _id: "$product", revenue: { $sum: "$amount" } } },
    { $sort: { revenue: -1 } },
    { $limit: 3 }
  ]);
  res.json(result);
});

// 8. Sales count per category
app.get("/sales/category-count", async (req, res) => {
  const result = await Sale.aggregate([
    { $group: { _id: "$category", count: { $count: {} } } }
  ]);
  res.json(result);
});

// 9. Average sales per region
app.get("/sales/region-average", async (req, res) => {
  const result = await Sale.aggregate([
    { $group: { _id: "$region", avgSales: { $avg: "$amount" } } }
  ]);
  res.json(result);
});

// 10. Total sales for Electronics & Fashion
app.get("/sales/electronics-fashion", async (req, res) => {
  const result = await Sale.aggregate([
    { $match: { category: { $in: ["Electronics", "Fashion"] } } },
    { $group: { _id: "$category", totalSales: { $sum: "$amount" } } }
  ]);
  res.json(result);
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
