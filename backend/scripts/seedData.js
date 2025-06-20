const pool = require("../config/database")

const sampleBooks = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Literature",
    rating: 4.2,
    pages: 180,
    year: 1925,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway.",
    cover_image: "/placeholder.svg?height=250&width=150",
    isbn: "978-0-7432-7356-5",
    publisher: "Scribner",
  },
  {
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    rating: 4.3,
    pages: 688,
    year: 1965,
    description: "An epic science fiction novel set on the desert planet Arrakis, following Paul Atreides in his quest for revenge and power.",
    cover_image: "/placeholder.svg?height=250&width=150",
    isbn: "978-0-441-17271-9",
    publisher: "Chilton Books",
  },
  {
    title: "Divergent",
    author: "Veronica Roth",
    genre: "dystopian",
    rating: 4.1,
    pages: 487,
    year: 2011,
    description: "A dystopian social science fiction novel about the Divergent series tackles themes of identity and belonging.",
    cover_image: "/placeholder.svg?height=250&width=150",
    isbn: "978-0-452-28423-4",
    publisher: "HarperCollins Children's Books",
  },
]

async function seedBooks() {
  try {
    console.log("Starting to seed books...")

    for (const book of sampleBooks) {
      const query = `
        INSERT INTO books (
          title, author, genre, rating, pages, year, 
          description, cover_image, isbn, publisher
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT DO NOTHING
      `

      const values = [
        book.title,
        book.author,
        book.genre,
        book.rating,
        book.pages,
        book.year,
        book.description,
        book.cover_image,
        book.isbn,
        book.publisher,
      ]

      await pool.query(query, values)
      console.log(`✓ Added: ${book.title}`)
    }

    console.log("✅ Books seeded successfully!")
  } catch (error) {
    console.error("❌ Error seeding books:", error)
  } finally {
    await pool.end()
  }
}

// Run the seed function
seedBooks()
