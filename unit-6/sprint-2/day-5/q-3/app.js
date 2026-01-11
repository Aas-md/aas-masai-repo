const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// ================= DATABASE =================
mongoose
  .connect("mongodb://127.0.0.1:27017/blogAggDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= USER SCHEMA =================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
});

const User = mongoose.model("User", userSchema);

// ================= BLOG SCHEMA =================
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Blog = mongoose.model("Blog", blogSchema);

// ================= AUTH MIDDLEWARE =================
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, "SECRET_KEY");
    req.user = decoded; // userId, email
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= CREATE BLOG =================
app.post("/blogs", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const blog = new Blog({
      title,
      content,
      tags,
      createdBy: req.user.userId,
    });

    await blog.save();

    res.status(201).json({ message: "Blog created", blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET OWN BLOGS =================
app.get("/blogs", authMiddleware, async (req, res) => {
  try {
    const blogs = await Blog.find({ createdBy: req.user.userId });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE BLOG =================
app.put("/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.tags = req.body.tags || blog.tags;

    await blog.save();

    res.json({ message: "Blog updated", blog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE BLOG =================
app.delete("/blogs/:id", authMiddleware, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= AGGREGATION STATS =================
app.get("/blogs/stats", authMiddleware, async (req, res) => {
  try {
    const stats = await Blog.aggregate([
      {
        $facet: {
          totalBlogs: [{ $count: "count" }],

          blogsPerUser: [
            {
              $group: {
                _id: "$createdBy",
                count: { $sum: 1 },
              },
            },
          ],

          commonTags: [
            { $unwind: "$tags" },
            {
              $group: {
                _id: "$tags",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
          ],
        },
      },
    ]);

    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
