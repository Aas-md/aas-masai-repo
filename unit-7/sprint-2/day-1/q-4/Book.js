class Book {
  constructor(title, author, reviews) {
    this.title = title;
    this.author = author;
    this.reviews = reviews;
  }

  // Fixed clone method (Deep Copy)
  clone() {
    // Create a new array using spread operator
    const reviewsCopy = [...this.reviews];
    return new Book(this.title, this.author, reviewsCopy);
  }
}

module.exports = Book;