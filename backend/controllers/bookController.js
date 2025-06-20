const Book = require("../models/Book")
const { validationResult } = require("express-validator")

// Get all books with filtering and pagination
const getBooks = async (req, res) => {
  try {
    const { search, genre, sortBy = "title", sortOrder = "asc", page = 1, limit = 10, minRating } = req.query

    const offset = (page - 1) * limit

    const filters = {
      search,
      genre,
      sortBy,
      sortOrder,
      limit: parseInt(limit),
      offset: parseInt(offset),
      minRating: minRating ? parseFloat(minRating) : null,
    }

    const books = await Book.findAll(filters)
    const totalBooks = await Book.getCount(filters)
    const totalPages = Math.ceil(totalBooks / limit)

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalBooks,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get single book by ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params
    const book = await Book.findById(id)

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      })
    }

    res.json({
      success: true,
      data: book,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// Get all genres
const getGenres = async (req, res) => {
  try {
    const genres = await Book.getGenres()

    res.json({
      success: true,
      data: genres,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

module.exports = {
  getBooks,
  getBookById,
  getGenres,
}
