function Book(title, author) {
  return {
    title,
    author,
    details() {
      console.log(`Title: ${this.title}, Author: ${this.author}`)
    }
  }
}

function createLibrary() {
  const books = []

  return {
    addBook(book) {
      books.push(book)
    },
    removeBook(title) {
      const index = books.findIndex(b => b.title === title)
      if (index !== -1) books.splice(index, 1)
    },
    listBooks() {
      books.forEach(b => b.details())
    }
  }
}

const library = createLibrary()

const book1 = Book("To Kill a Mockingbird", "Harper Lee")
const book2 = Book("1984", "George Orwell")

library.addBook(book1)
library.addBook(book2)

library.listBooks()

library.removeBook("1984")
library.listBooks()
