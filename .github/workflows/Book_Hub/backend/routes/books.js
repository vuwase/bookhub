const express = require("express")
const { body, validationResult, query } = require("express-validator")

const router = express.Router()

// Sample books data (for testing without database)
const sampleBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Literature",
    rating: 4.2,
    pages: 180,
    published_date: "1925-04-10",
    description:
      "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway.",
    cover_image: "/great-gatsby.jpg",
    isbn: "978-0-7432-7356-5",
    publisher: "Scribner",
    price: 12.99,
    review_count: 1250,
    availability: "Available",
    tags: ["classic", "american literature", "jazz age"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic Literature",
    rating: 4.5,
    pages: 324,
    published_date: "1960-07-11",
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.",
    cover_image: "/mockingbird.jpg",
    isbn: "978-0-06-112008-4",
    publisher: "J.B. Lippincott & Co.",
    price: 13.99,
    review_count: 2100,
    availability: "Available",
    tags: ["classic", "social justice", "coming of age"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    rating: 4.3,
    pages: 688,
    published_date: "1965-08-01",
    description:
      "An epic science fiction novel set on the desert planet Arrakis, following Paul Atreides in his quest for revenge and power.",
    cover_image: "/dune.jpg",
    isbn: "978-0-441-17271-9",
    publisher: "Chilton Books",
    price: 16.99,
    review_count: 1800,
    availability: "Available",
    tags: ["sci-fi", "epic", "space opera"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    rating: 4.6,
    pages: 310,
    published_date: "1937-09-21",
    description:
      "A fantasy adventure following Bilbo Baggins on his unexpected journey to help a group of dwarves reclaim their homeland.",
    cover_image: "/hobbit.jpg",
    isbn: "978-0-547-92822-7",
    publisher: "George Allen & Unwin",
    price: 14.99,
    review_count: 3200,
    availability: "Available",
    tags: ["fantasy", "adventure", "tolkien"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 5,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    rating: 4.4,
    pages: 432,
    published_date: "1813-01-28",
    description:
      "A romantic novel exploring themes of love, reputation, and class in Georgian England through Elizabeth Bennet and Mr. Darcy.",
    cover_image: "/pride-prejudice.jpg",
    isbn: "978-0-14-143951-8",
    publisher: "T. Egerton",
    price: 11.99,
    review_count: 1900,
    availability: "Available",
    tags: ["romance", "classic", "regency"],
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  
]

// Helper function to add year field to books
const addYearToBooks = (books) => {
  return books.map((book) => ({
    ...book,
    year: book.published_date ? new Date(book.published_date).getFullYear().toString() : null,
  }))
}

// Validation middleware
const validateBook = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("author")
    .trim()
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ max: 100 })
    .withMessage("Author name cannot exceed 100 characters"),

  body("genre").notEmpty().withMessage("Genre is required"),

  body("isbn")
    .optional()
    .matches(/^(?:\d{9}[\dX]|\d{13})$/)
    .withMessage("Invalid ISBN format"),

  body("published_date").optional().isISO8601().withMessage("Invalid date format"),

  body("pages").optional().isInt({ min: 1, max: 10000 }).withMessage("Pages must be between 1 and 10000"),

  body("price").optional().isFloat({ min: 0 }).withMessage("Price cannot be negative"),

  body("rating").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating must be between 0 and 5"),
]

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    })
  }
  next()
}

// GET /api/books - Fetch all books with filtering and pagination
router.get("/", async (req, res) => {
  try {
    console.log("📚 GET /api/books - Fetching books...")

    const {
      page = 1,
      limit = 10,
      genre,
      author,
      search,
      sortBy = "title",
      sortOrder = "asc",
      minRating,
      maxPrice,
      availability,
    } = req.query

    let books = [...sampleBooks]

    // Apply filters
    if (genre && genre !== "all") {
      books = books.filter((book) => book.genre === genre)
    }

    if (author) {
      books = books.filter((book) => book.author.toLowerCase().includes(author.toLowerCase()))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          book.description.toLowerCase().includes(searchLower),
      )
    }

    if (minRating) {
      books = books.filter((book) => book.rating >= Number.parseFloat(minRating))
    }

    if (maxPrice) {
      books = books.filter((book) => book.price <= Number.parseFloat(maxPrice))
    }

    if (availability) {
      books = books.filter((book) => book.availability === availability)
    }

    // Apply sorting
    books.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "author":
          comparison = a.author.localeCompare(b.author)
          break
        case "rating":
          comparison = b.rating - a.rating
          break
        case "published_date":
          comparison = new Date(b.published_date) - new Date(a.published_date)
          break
        case "pages":
          comparison = b.pages - a.pages
          break
        case "price":
          comparison = b.price - a.price
          break
        default:
          comparison = a.title.localeCompare(b.title)
      }

      return sortOrder === "desc" ? -comparison : comparison
    })

    // Apply pagination
    const totalBooks = books.length
    const totalPages = Math.ceil(totalBooks / Number.parseInt(limit))
    const offset = (Number.parseInt(page) - 1) * Number.parseInt(limit)
    const paginatedBooks = books.slice(offset, offset + Number.parseInt(limit))

    // Add year field to books
    const booksWithYear = addYearToBooks(paginatedBooks)

    console.log(`✅ Found ${booksWithYear.length} books (${totalBooks} total)`)

    res.json({
      success: true,
      data: booksWithYear,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalBooks,
        hasNextPage: Number.parseInt(page) < totalPages,
        hasPrevPage: Number.parseInt(page) > 1,
      },
    })
  } catch (error) {
    console.error("❌ Error fetching books:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch books",
      message: error.message,
    })
  }
})

// GET /api/books/:id - Fetch a single book
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    console.log(`📖 GET /api/books/${id} - Fetching single book...`)

    if (!id || isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        success: false,
        error: "Invalid book ID format",
      })
    }

    const book = sampleBooks.find((b) => b.id === Number.parseInt(id))

    if (!book) {
      return res.status(404).json({
        success: false,
        error: "Book not found",
      })
    }

    // Add year field
    const bookWithYear = addYearToBooks([book])[0]

    console.log(`✅ Found book: ${book.title}`)

    res.json({
      success: true,
      data: bookWithYear,
    })
  } catch (error) {
    console.error("❌ Error fetching book:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch book",
      message: error.message,
    })
  }
})

// GET /api/books/stats/summary - Get book statistics
router.get("/stats/summary", async (req, res) => {
  try {
    console.log("📊 GET /api/books/stats/summary - Fetching statistics...")

    const totalBooks = sampleBooks.length
    const averageRating = sampleBooks.reduce((sum, book) => sum + book.rating, 0) / totalBooks
    const totalGenres = new Set(sampleBooks.map((book) => book.genre)).size
    const averagePrice = sampleBooks.reduce((sum, book) => sum + (book.price || 0), 0) / totalBooks
    const totalAuthors = new Set(sampleBooks.map((book) => book.author)).size

    const stats = {
      totalBooks,
      averageRating: Math.round(averageRating * 100) / 100,
      totalGenres,
      averagePrice: Math.round(averagePrice * 100) / 100,
      totalAuthors,
    }

    console.log("✅ Statistics calculated:", stats)

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("❌ Error fetching book stats:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch book statistics",
      message: error.message,
    })
  }
})

// Note: POST, PUT, DELETE routes would require authentication
// For now, we'll add simple versions that work without auth for testing

// POST /api/books - Create a new book (simplified for testing)
router.post("/", validateBook, handleValidationErrors, async (req, res) => {
  try {
    console.log("📝 POST /api/books - Creating new book...")

    const newBook = {
      id: Math.max(...sampleBooks.map((b) => b.id)) + 1,
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Add year field
    const bookWithYear = addYearToBooks([newBook])[0]

    console.log(`✅ Book created: ${newBook.title}`)

    res.status(201).json({
      success: true,
      data: bookWithYear,
      message: "Book created successfully",
    })
  } catch (error) {
    console.error("❌ Error creating book:", error)
    res.status(500).json({
      success: false,
      error: "Failed to create book",
      message: error.message,
    })
  }
})

module.exports = router
