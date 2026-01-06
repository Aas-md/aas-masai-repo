const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONFIG =================
mongoose
  .connect("mongodb://127.0.0.1:27017/LibraryDB")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// ================= MODEL =================
const librarySchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    status: { type: String, default: "available" }, // available | borrowed | reserved
    borrowerName: String,
    borrowDate: Date,
    dueDate: Date,
    returnDate: Date,
    overdueFees: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Library = mongoose.model("Library", librarySchema);

// ================= MIDDLEWARE =================

// Validation middleware for book creation/borrow
const validateBookData = (req, res, next) => {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Incomplete Data" });
  }
  next();
};

// Borrowing limit middleware
const borrowingLimit = async (req, res, next) => {
  const { borrowerName } = req.body;
  if (!borrowerName) return res.status(400).json({ message: "Borrower Name is required" });

  const borrowedCount = await Library.countDocuments({
    borrowerName,
    status: "borrowed",
  });

  if (borrowedCount >= 3) {
    return res.status(409).json({ message: "Borrowing limit exceeded (3 books max)" });
  }
  next();
};

// ================= CONTROLLERS =================

// Add a Book
const addBook = async (req, res) => {
  try {
    const book = await Library.create({ ...req.body, status: "available" });
    res.status(201).json({ message: "Book added successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Borrow a Book
const borrowBook = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.status === "borrowed") return res.status(409).json({ message: "Book already borrowed" });

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(borrowDate.getDate() + 14);

    book.status = "borrowed";
    book.borrowerName = req.body.borrowerName;
    book.borrowDate = borrowDate;
    book.dueDate = dueDate;

    await book.save();
    res.json({ message: "Book borrowed successfully", book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Return a Book
const returnBook = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.status !== "borrowed") return res.status(400).json({ message: "Book is not borrowed" });

    const returnDate = new Date();
    let overdueFees = 0;
    if (returnDate > book.dueDate) {
      const diffTime = returnDate - book.dueDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      overdueFees = diffDays * 10; // Rs 10 per day
    }

    book.status = "available";
    book.returnDate = returnDate;
    book.overdueFees = overdueFees;
    book.borrowerName = null;
    book.borrowDate = null;
    book.dueDate = null;

    await book.save();
    res.json({ message: "Book returned successfully", overdueFees, book });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Books
const getBooks = async (req, res) => {
  try {
    const { status, title } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (title) filter.title = { $regex: title, $options: "i" };
    const books = await Library.find(filter);
    res.json({ books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a Book
const deleteBook = async (req, res) => {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    if (book.status === "borrowed") return res.status(409).json({ message: "Cannot delete borrowed book" });

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= ROUTES =================
app.post("/library/books", validateBookData, addBook);
app.get("/library/books", getBooks);
app.patch("/library/borrow/:id", borrowingLimit, borrowBook);
app.patch("/library/return/:id", returnBook);
app.delete("/library/books/:id", deleteBook);

// ================= SERVER =================
app.listen(5000, () => console.log("Library Management Server running on port 5000"));
