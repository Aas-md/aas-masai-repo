const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ================= DB CONNECT =================
mongoose.connect("mongodb://127.0.0.1:27017/libraryDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ================= SCHEMAS =================
const bookSchema = new mongoose.Schema({
  _id: String,
  title: String,
  author: String,
  genre: String,
  publishedYear: Number
});

const borrowerSchema = new mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  membershipDate: Date
});

const loanSchema = new mongoose.Schema({
  _id: String,
  bookId: String,
  borrowerId: String,
  loanDate: Date,
  returnDate: Date,
  status: String
});

const Book = mongoose.model("Book", bookSchema);
const Borrower = mongoose.model("Borrower", borrowerSchema);
const Loan = mongoose.model("Loan", loanSchema);

// ================= INSERT DATA (ONE TIME) =================
app.post("/insert-data", async (req, res) => {
  await Book.deleteMany({});
  await Borrower.deleteMany({});
  await Loan.deleteMany({});

  await Book.insertMany([
    { _id: "Book1", title: "The Alchemist", author: "Paulo Coelho", genre: "Fiction", publishedYear: 1988 },
    { _id: "Book2", title: "Clean Code", author: "Robert C. Martin", genre: "Programming", publishedYear: 2008 },
    { _id: "Book3", title: "1984", author: "George Orwell", genre: "Dystopian", publishedYear: 1949 },
    { _id: "Book4", title: "Atomic Habits", author: "James Clear", genre: "Self-help", publishedYear: 2018 },
    { _id: "Book5", title: "The Pragmatic Programmer", author: "Andy Hunt", genre: "Programming", publishedYear: 1999 }
  ]);

  await Borrower.insertMany([
    { _id: "User1", name: "Alice", email: "alice@example.com", membershipDate: "2023-01-15" },
    { _id: "User2", name: "Bob", email: "bob@example.com", membershipDate: "2023-02-10" },
    { _id: "User3", name: "Charlie", email: "charlie@example.com", membershipDate: "2023-03-05" },
    { _id: "User4", name: "David", email: "david@example.com", membershipDate: "2023-04-12" }
  ]);

  await Loan.insertMany([
    { _id: "Loan1", bookId: "Book1", borrowerId: "User1", loanDate: "2023-05-01", returnDate: "2023-05-15", status: "Returned" },
    { _id: "Loan2", bookId: "Book2", borrowerId: "User1", loanDate: "2023-05-20", returnDate: null, status: "Borrowed" },
    { _id: "Loan3", bookId: "Book3", borrowerId: "User2", loanDate: "2023-04-10", returnDate: "2023-04-25", status: "Returned" },
    { _id: "Loan4", bookId: "Book2", borrowerId: "User3", loanDate: "2023-05-05", returnDate: null, status: "Borrowed" },
    { _id: "Loan5", bookId: "Book4", borrowerId: "User1", loanDate: "2023-03-01", returnDate: "2023-03-10", status: "Returned" },
    { _id: "Loan6", bookId: "Book1", borrowerId: "User4", loanDate: "2023-05-01", returnDate: "2023-05-15", status: "Returned" },
    { _id: "Loan7", bookId: "Book5", borrowerId: "User3", loanDate: "2023-06-01", returnDate: null, status: "Borrowed" },
    { _id: "Loan8", bookId: "Book2", borrowerId: "User1", loanDate: "2023-06-15", returnDate: null, status: "Borrowed" },
    { _id: "Loan9", bookId: "Book2", borrowerId: "User1", loanDate: "2023-07-01", returnDate: null, status: "Borrowed" }
  ]);

  res.json({ message: "Library data inserted successfully" });
});

// ================= AGGREGATIONS =================

// 1. Books borrowed by each borrower
app.get("/task1", async (req, res) => {
  const data = await Loan.aggregate([
    { $group: { _id: "$borrowerId", books: { $push: "$bookId" } } }
  ]);
  res.json(data);
});

// 2. Top 3 most borrowed books
app.get("/task2", async (req, res) => {
  const data = await Loan.aggregate([
    { $group: { _id: "$bookId", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);
  res.json(data);
});

// 3. Loan history of User1 with book details
app.get("/task3", async (req, res) => {
  const data = await Loan.aggregate([
    { $match: { borrowerId: "User1" } },
    {
      $lookup: {
        from: "books",
        localField: "bookId",
        foreignField: "_id",
        as: "book"
      }
    },
    { $unwind: "$book" }
  ]);
  res.json(data);
});

// 4. Borrowers borrowed more than 2 books
app.get("/task4", async (req, res) => {
  const data = await Loan.aggregate([
    { $group: { _id: "$borrowerId", count: { $sum: 1 } } },
    { $match: { count: { $gt: 2 } } }
  ]);
  res.json(data);
});

// 5. Full loan report
app.get("/task5", async (req, res) => {
  const data = await Loan.aggregate([
    { $lookup: { from: "borrowers", localField: "borrowerId", foreignField: "_id", as: "borrower" } },
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $unwind: "$borrower" },
    { $unwind: "$book" },
    { $project: { borrower: "$borrower.name", book: "$book.title", status: 1 } }
  ]);
  res.json(data);
});

// 6. Genre-wise borrowed count
app.get("/task6", async (req, res) => {
  const data = await Loan.aggregate([
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $unwind: "$book" },
    { $group: { _id: "$book.genre", count: { $sum: 1 } } }
  ]);
  res.json(data);
});

// 7. Currently borrowed books
app.get("/task7", async (req, res) => {
  const data = await Loan.aggregate([
    { $match: { status: "Borrowed" } },
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $lookup: { from: "borrowers", localField: "borrowerId", foreignField: "_id", as: "borrower" } },
    { $unwind: "$book" },
    { $unwind: "$borrower" },
    { $project: { book: "$book.title", borrower: "$borrower.name" } }
  ]);
  res.json(data);
});

// 8. Returned books per borrower
app.get("/task8", async (req, res) => {
  const data = await Loan.aggregate([
    { $match: { status: "Returned" } },
    { $group: { _id: "$borrowerId", count: { $sum: 1 } } }
  ]);
  res.json(data);
});

// 9. Borrowers with multiple genres
app.get("/task9", async (req, res) => {
  const data = await Loan.aggregate([
    { $lookup: { from: "books", localField: "bookId", foreignField: "_id", as: "book" } },
    { $unwind: "$book" },
    { $group: { _id: "$borrowerId", genres: { $addToSet: "$book.genre" } } },
    { $match: { "genres.1": { $exists: true } } }
  ]);
  res.json(data);
});

// 10. Borrowers with total borrow count
app.get("/task10", async (req, res) => {
  const data = await Loan.aggregate([
    { $group: { _id: "$borrowerId", totalBorrowed: { $sum: 1 } } },
    { $lookup: { from: "borrowers", localField: "_id", foreignField: "_id", as: "borrower" } },
    { $unwind: "$borrower" },
    { $project: { name: "$borrower.name", totalBorrowed: 1 } }
  ]);
  res.json(data);
});

// ================= SERVER =================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
