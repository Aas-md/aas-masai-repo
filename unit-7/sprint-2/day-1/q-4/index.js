const Book = require("./Book");

// Original book
const book1 = new Book(
  "Clean Code",
  "Robert C. Martin",
  ["Excellent book", "Very helpful"]
);

// Clone book
const book2 = book1.clone();

// Modify cloned book reviews
book2.reviews.push("Must read for developers");

// Print both
console.log("Original Book Reviews:");
console.log(book1.reviews);

console.log("\nCloned Book Reviews:");
console.log(book2.reviews);