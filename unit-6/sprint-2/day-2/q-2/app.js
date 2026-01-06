const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONFIG (config/db.js logic) =================
mongoose
  .connect("mongodb://127.0.0.1:27017/TaskDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// ================= MODEL (models/task.model.js logic) =================
const taskSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    description: String,
    priority: String, // low | medium | high
    isCompleted: { type: Boolean, default: false },
    completionDate: Date,
    dueDate: Date,
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

// ================= MIDDLEWARE (middleware/task.middleware.js logic) =================
const taskValidation = (req, res, next) => {
  const { title, description, priority } = req.body;

  if (!title || !description || !priority) {
    return res.status(400).json({
      message: "Incomplete Data Received",
    });
  }

  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({
      message: "Priority must be low, medium or high",
    });
  }

  next();
};

// ================= CONTROLLERS (controllers/task.controller.js logic) =================

// CREATE TASK
const createTask = async (req, res) => {
  try {
    const existingTask = await Task.findOne({ title: req.body.title });
    if (existingTask) {
      return res.status(400).json({ message: "Title must be unique" });
    }

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET TASKS
const getTasks = async (req, res) => {
  try {
    const { priority, status } = req.query;
    let filter = {};

    if (priority) filter.priority = priority;
    if (status === "completed") filter.isCompleted = true;
    if (status === "pending") filter.isCompleted = false;

    const tasks = await Task.find(filter);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.priority) {
      const validPriorities = ["low", "medium", "high"];
      if (!validPriorities.includes(updates.priority)) {
        return res.status(400).json({
          message: "Priority must be low, medium or high",
        });
      }
    }

    if (updates.isCompleted === true) {
      updates.completionDate = new Date();
    }

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE TASKS (Bulk delete by priority)
const deleteTasks = async (req, res) => {
  try {
    const { priority } = req.query;

    if (!priority) {
      return res.status(400).json({
        message: "Priority query is required for deletion",
      });
    }

    const result = await Task.deleteMany({ priority });
    res.json({
      message: "Tasks deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= ROUTES (routes/task.routes.js logic) =================
app.post("/tasks", taskValidation, createTask);
app.get("/tasks", getTasks);
app.patch("/tasks/:id", updateTask);
app.delete("/tasks", deleteTasks);

// ================= SERVER =================
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
