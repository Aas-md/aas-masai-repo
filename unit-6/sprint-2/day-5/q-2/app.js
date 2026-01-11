const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// ================= DATABASE =================
mongoose
  .connect("mongodb://127.0.0.1:27017/notesAuthDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= USER SCHEMA =================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // hashed
});

const User = mongoose.model("User", userSchema);

// ================= NOTE SCHEMA =================
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const Note = mongoose.model("Note", noteSchema);

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

// ================= CREATE NOTE =================
app.post("/notes", authMiddleware, async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      createdBy: req.user.userId,
    });

    await note.save();

    res.status(201).json({ message: "Note created", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= GET OWN NOTES =================
app.get("/notes", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user.userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= UPDATE NOTE =================
app.put("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    await note.save();

    res.json({ message: "Note updated", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE NOTE =================
app.delete("/notes/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
