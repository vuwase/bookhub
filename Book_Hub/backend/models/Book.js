const pool = require("../config/database")

class Book {
  // Get all books with optional filtering and sorting
  static async findAll(filters = {}) {
    let query = `
      SELECT 
        id, title, author, genre, rating, pages, year, 
        description, cover_image, isbn, publisher, created_at, updated_at
      FROM books 
      WHERE 1=1
    `
    const values = []
    let paramCount = 0

    // Apply filters
    if (filters.search) {
      paramCount++
      query += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount} OR description ILIKE $${paramCount})`
      values.push(`%${filters.search}%`)
    }

    if (filters.genre && filters.genre !== "all") {
      paramCount++
      query += ` AND genre = $${paramCount}`
      values.push(filters.genre)
    }

    if (filters.minRating) {
      paramCount++
      query += ` AND rating >= $${paramCount}`
      values.push(filters.minRating)
    }

    // Apply sorting
    const validSortFields = ["title", "author", "rating", "year", "created_at"]
    const sortBy = validSortFields.includes(filters.sortBy) ? filters.sortBy : "title"
    const sortOrder = filters.sortOrder === "desc" ? "DESC" : "ASC"
    query += ` ORDER BY ${sortBy} ${sortOrder}`

    // Apply pagination
    if (filters.limit) {
      paramCount++
      query += ` LIMIT $${paramCount}`
      values.push(filters.limit)
    }

    if (filters.offset) {
      paramCount++
      query += ` OFFSET $${paramCount}`
      values.push(filters.offset)
    }

    try {
      const result = await pool.query(query, values)
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching books: ${error.message}`)
    }
  }

  // Get book by ID
  static async findById(id) {
    const query = `
      SELECT 
        id, title, author, genre, rating, pages, year, 
        description, cover_image, isbn, publisher, created_at, updated_at
      FROM books 
      WHERE id = $1
    `

    try {
      const result = await pool.query(query, [id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error fetching book: ${error.message}`)
    }
  }

  // Get unique genres
  static async getGenres() {
    const query = "SELECT DISTINCT genre FROM books ORDER BY genre"

    try {
      const result = await pool.query(query)
      return result.rows.map((row) => row.genre)
    } catch (error) {
      throw new Error(`Error fetching genres: ${error.message}`)
    }
  }

  // Get books count
  static async getCount(filters = {}) {
    let query = "SELECT COUNT(*) FROM books WHERE 1=1"
    const values = []
    let paramCount = 0

    if (filters.search) {
      paramCount++
      query += ` AND (title ILIKE $${paramCount} OR author ILIKE $${paramCount} OR description ILIKE $${paramCount})`
      values.push(`%${filters.search}%`)
    }

    if (filters.genre && filters.genre !== "all") {
      paramCount++
      query += ` AND genre = $${paramCount}`
      values.push(filters.genre)
    }

    try {
      const result = await pool.query(query, values)
      return parseInt(result.rows[0].count)
    } catch (error) {
      throw new Error(`Error counting books: ${error.message}`)
    }
  }
}

module.exports = Book
