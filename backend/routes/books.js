const express = require("express")
const {
  getBooks,
  getBookById,
  getGenres,
} = require("../controllers/bookController")

const router = express.Router()

// Routes
router.get("/", getBooks)
router.get("/genres", getGenres)
router.get("/:id", getBookById)

module.exports = router
