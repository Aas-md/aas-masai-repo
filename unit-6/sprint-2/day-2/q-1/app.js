const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= MongoDB Connection =================
mongoose
  .connect("mongodb://127.0.0.1:27017/TaskDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// ================= Task Schema & Model =================
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      default: "pending",
    },
    dueDate: Date,
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

// ================= CRUD APIs =================

// ✅ CREATE Task
app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ READ All Tasks / Filter
app.get("/tasks", async (req, res) => {
  try {
    const { status, dueDate } = req.query;
    let filter = {};

    if (status) filter.status = status;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ UPDATE Task
app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ DELETE Task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= Server =================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
