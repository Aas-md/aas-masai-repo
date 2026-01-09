const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONNECT =================
mongoose.connect("mongodb://127.0.0.1:27017/customerOrderDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error(err));

// ================= SCHEMAS =================

// Customer
const customerSchema = new mongoose.Schema({
  _id: String,
  name: String,
  city: String
});
const Customer = mongoose.model("Customer", customerSchema);

// Order
const orderSchema = new mongoose.Schema({
  customerId: String,
  amount: Number,
  product: String
});
const Order = mongoose.model("Order", orderSchema);

// ================= INSERT DATA (ONE TIME) =================
app.post("/insert-data", async (req, res) => {
  await Customer.insertMany([
    { _id: "C1001", name: "Alice", city: "New York" },
    { _id: "C1002", name: "Bob", city: "Los Angeles" },
    { _id: "C1003", name: "Charlie", city: "Chicago" },
    { _id: "C1004", name: "David", city: "Houston" },
    { _id: "C1005", name: "Eve", city: "Seattle" }
  ]);

  await Order.insertMany([
    { _id: 1, customerId: "C1001", amount: 500, product: "Laptop" },
    { _id: 2, customerId: "C1002", amount: 1200, product: "Phone" },
    { _id: 3, customerId: "C1001", amount: 300, product: "Headphones" },
    { _id: 4, customerId: "C1003", amount: 700, product: "Monitor" },
    { _id: 5, customerId: "C1004", amount: 400, product: "Keyboard" },
    { _id: 6, customerId: "C1002", amount: 800, product: "Tablet" },
    { _id: 7, customerId: "C1005", amount: 900, product: "Smartwatch" }
  ]);

  res.json({ message: "Customers & Orders data inserted" });
});

// ================= AGGREGATION APIs =================

// 1. Total amount spent by each customer
app.get("/customers/total-spent", async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$customerId",
        totalSpent: { $sum: "$amount" }
      }
    }
  ]);
  res.json(result);
});

// 2. Orders with customer details
app.get("/orders/with-customers", async (req, res) => {
  const result = await Order.aggregate([
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customerDetails"
      }
    }
  ]);
  res.json(result);
});

// 3. Orders with amount > 500
app.get("/orders/above-500", async (req, res) => {
  const result = await Order.aggregate([
    { $match: { amount: { $gt: 500 } } }
  ]);
  res.json(result);
});

// 4. Average order amount per customer
app.get("/customers/average-order", async (req, res) => {
  const result = await Order.aggregate([
    {
      $group: {
        _id: "$customerId",
        avgOrderAmount: { $avg: "$amount" }
      }
    }
  ]);
  res.json(result);
});

// 5. All orders with customer details (only matched customers)
app.get("/orders/with-valid-customers", async (req, res) => {
  const result = await Order.aggregate([
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer"
      }
    },
    { $unwind: "$customer" }
  ]);
  res.json(result);
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
