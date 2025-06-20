"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode, useMemo } from "react"
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Grid,
  Button,
  Chip,
  Rating,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Avatar,
  CardMedia,
} from "@mui/material"
import {
  Search,
  CalendarToday,
  MenuBook,
  Close,
  Business,
  Tag,
  Refresh,
  Favorite,
  FavoriteBorder,
  Star,
  Share,
  TrendingUp,
  AutoStories,
} from "@mui/icons-material"

const theme = createTheme({
  palette: {
    primary: {
      main: "#2563eb",
      light: "#60a5fa",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#dc2626",
      light: "#f87171",
      dark: "#b91c1c",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b",
      secondary: "#64748b",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: "3.5rem",
      background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    h2: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          "&:hover": {
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
        },
      },
    },
  },
})

// Complete TypeScript interfaces
interface Book {
  id: string
  title: string
  author: string
  genre: string
  rating: number
  pages: number
  year: string
  description: string
  coverImage: string
  isbn: string
  publisher: string
  userRating?: number
  isFavorite?: boolean
  color?: string
}

interface FilterOptions {
  searchQuery: string
  selectedGenre: string
  sortBy: "title" | "author" | "rating" | "year"
  sortOrder: "asc" | "desc"
}

interface User {
  id: string
  name: string
  email: string
  readingList: string[]
  ratings: Record<string, number>
}

interface BookContextType {
  books: Book[]
  filteredBooks: Book[]
  filters: FilterOptions
  selectedBook: Book | null
  user: User | null
  updateFilters: (filters: Partial<FilterOptions>) => void
  resetFilters: () => void
  setSelectedBook: (book: Book | null) => void
  addToReadingList: (bookId: string) => void
  rateBook: (bookId: string, rating: number) => void
}

// Enhanced mock data with beautiful book covers
const mockBooks: Book[] = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Literature",
    rating: 4.2,
    pages: 180,
    year: "1925",
    description:
      "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway.",
    coverImage: "/great-gatsby.jpg",
    isbn: "978-0-7432-7356-5",
    publisher: "Scribner",
    color: "#f59e0b",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic Literature",
    rating: 4.5,
    pages: 324,
    year: "1960",
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.",
    coverImage: "/mockingbird.jpg",
    isbn: "978-0-06-112008-4",
    publisher: "J.B. Lippincott & Co.",
    color: "#dc2626",
  },
  {
    id: "3",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    rating: 4.3,
    pages: 688,
    year: "1965",
    description:
      "An epic science fiction novel set on the desert planet Arrakis, following Paul Atreides in his quest for revenge and power.",
    coverImage: "/dune.jpg",
    isbn: "978-0-441-17271-9",
    publisher: "Chilton Books",
    color: "#f97316",
  },
  {
    id: "4",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    rating: 4.6,
    pages: 310,
    year: "1937",
    description:
      "A fantasy adventure following Bilbo Baggins on his unexpected journey to help a group of dwarves reclaim their homeland.",
    coverImage: "/hobbit.jpg",
    isbn: "978-0-547-92822-7",
    publisher: "George Allen & Unwin",
    color: "#059669",
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    rating: 4.4,
    pages: 432,
    year: "1813",
    description:
      "A romantic novel exploring themes of love, reputation, and class in Georgian England through Elizabeth Bennet and Mr. Darcy.",
    coverImage: "/pride-prejudice.jpg",
    isbn: "978-0-14-143951-8",
    publisher: "T. Egerton",
    color: "#ec4899",
  },
  {
    id: "6",
    title: "Divergent",
    author: "Veronica Roth",
    genre: "dystopian",
    rating: 4.1,
    pages: 487,
    year: "2011",
    description:
      "A dystopian social science fiction novel about the Divergent series tackles themes of identity and belonging.",
    coverImage: "/Divergent.jpg",
    isbn: "978-0-452-28423-4",
    publisher: "HarperCollins Children's Books",
    color: "#7c3aed",
  },
  {
    id: "7",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    rating: 4.7,
    pages: 223,
    year: "1997",
    description:
      "The first book in the beloved Harry Potter series about a young wizard discovering his magical heritage.",
    coverImage: "/Harry Potter.jpg",
    isbn: "978-0-7475-3269-9",
    publisher: "Bloomsbury",
    color: "#dc2626",
  },
  {
    id: "8",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Coming of Age",
    rating: 3.8,
    pages: 277,
    year: "1951",
    description:
      "A controversial novel about teenage rebellion and alienation, narrated by the iconic Holden Caulfield.",
    coverImage: "/The catcher in the Rye.jpg",
    isbn: "978-0-316-76948-0",
    publisher: "Little, Brown and Company",
    color: "#0891b2",
  },
]

// Mock user for future functionality
const mockUser: User = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  readingList: [],
  ratings: {},
}

const defaultFilters: FilterOptions = {
  searchQuery: "",
  selectedGenre: "all",
  sortBy: "title",
  sortOrder: "asc",
}

// Context API for state management
const BookContext = createContext<BookContextType | undefined>(undefined)

const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(mockBooks)
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [user, setUser] = useState<User | null>(mockUser)

  // Filter and sort books based on current filters
  const filteredBooks = useMemo(() => {
    let result = [...books]

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query),
      )
    }

    // Apply genre filter
    if (filters.selectedGenre !== "all") {
      result = result.filter((book) => book.genre === filters.selectedGenre)
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (filters.sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "author":
          comparison = a.author.localeCompare(b.author)
          break
        case "rating":
          comparison = b.rating - a.rating // Higher ratings first by default
          break
        case "year":
          comparison = Number.parseInt(b.year) - Number.parseInt(a.year) // Newer books first by default
          break
      }

      return filters.sortOrder === "desc" ? -comparison : comparison
    })

    // Add user-specific data
    if (user) {
      result = result.map((book) => ({
        ...book,
        isFavorite: user.readingList.includes(book.id),
        userRating: user.ratings[book.id],
      }))
    }

    return result
  }, [books, filters, user])

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
  }

  const addToReadingList = (bookId: string) => {
    if (user) {
      const isInList = user.readingList.includes(bookId)
      const updatedUser = {
        ...user,
        readingList: isInList ? user.readingList.filter((id) => id !== bookId) : [...user.readingList, bookId],
      }
      setUser(updatedUser)

      // Update the selected book if it's currently open
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook({
          ...selectedBook,
          isFavorite: !isInList,
        })
      }
    }
  }

  const rateBook = (bookId: string, rating: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        ratings: { ...user.ratings, [bookId]: rating },
      }
      setUser(updatedUser)

      // Update the selected book if it's currently open
      if (selectedBook && selectedBook.id === bookId) {
        setSelectedBook({
          ...selectedBook,
          userRating: rating,
        })
      }
    }
  }

  const value: BookContextType = {
    books,
    filteredBooks,
    filters,
    selectedBook,
    user,
    updateFilters,
    resetFilters,
    setSelectedBook,
    addToReadingList,
    rateBook,
  }

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>
}

const useBooks = (): BookContextType => {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error("useBooks must be used within a BookProvider")
  }
  return context
}

// Component 1: Enhanced Search Bar Component
const SearchBar: React.FC = () => {
  const { filters, updateFilters } = useBooks()

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search for books, authors, or descriptions..."
      value={filters.searchQuery}
      onChange={(e) => updateFilters({ searchQuery: e.target.value })}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: "primary.main" }} />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          backgroundColor: "background.paper",
          "& fieldset": {
            borderColor: "divider",
          },
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            borderWidth: 2,
          },
        },
      }}
    />
  )
}

// Component 2: Enhanced Filter Controls Component
const FilterControls: React.FC = () => {
  const { filters, updateFilters, resetFilters, books } = useBooks()

  // Get unique genres
  const genres = useMemo(() => {
    return Array.from(new Set(books.map((book) => book.genre))).sort()
  }, [books])

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel>Genre</InputLabel>
          <Select
            label="Genre"
            value={filters.selectedGenre}
            onChange={(e) => updateFilters({ selectedGenre: e.target.value })}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">All Genres</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            label="Sort By"
            value={filters.sortBy}
            onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel>Order</InputLabel>
          <Select
            label="Order"
            value={filters.sortOrder}
            onChange={(e) => updateFilters({ sortOrder: e.target.value as any })}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Refresh />}
          onClick={resetFilters}
          sx={{ height: 56, borderRadius: 2 }}
        >
          Reset Filters
        </Button>
      </Grid>
    </Grid>
  )
}

// Component 3: Enhanced Horizontal Book Card Component
const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const { setSelectedBook, addToReadingList, rateBook } = useBooks()
  const [userRating, setUserRating] = useState<number | null>(book.userRating || null)

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setUserRating(newValue)
      rateBook(book.id, newValue)
    }
  }

  const handleViewDetails = () => {
    setSelectedBook(book)
  }

  const handleFavoriteToggle = () => {
    addToReadingList(book.id)
  }

  return (
    <Card
      sx={{
        display: "flex",
        height: 280,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
        },
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        mb: 3,
      }}
    >
      {/* Book Cover - Left Side */}
      <Box sx={{ position: "relative", width: 150, flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{
            width: 150,
            height: 250,
            objectFit: "cover",
          }}
          image={book.coverImage || "/placeholder.svg?height=250&width=150"}
          alt={book.title}
        />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(135deg, ${book.color}15 0%, transparent 50%)`,
          }}
        />
        {book.rating >= 4.5 && (
          <Chip
            icon={<TrendingUp />}
            label="Bestseller"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "rgba(34, 197, 94, 0.9)",
              color: "white",
              fontWeight: 600,
              fontSize: "0.7rem",
            }}
          />
        )}
      </Box>

      {/* Book Content - Right Side */}
      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, position: "relative" }}>
        <Tooltip title={book.isFavorite ? "Remove from Reading List" : "Add to Reading List"}>
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              zIndex: 1,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                transform: "scale(1.1)",
              },
            }}
            onClick={handleFavoriteToggle}
            color={book.isFavorite ? "error" : "default"}
          >
            {book.isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>

        <CardContent sx={{ flex: 1, p: 2.5, pb: 0 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 1.5,
              fontSize: "1.1rem",
              minHeight: "2.4em",
            }}
          >
            {book.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Avatar sx={{ width: 26, height: 26, bgcolor: book.color, fontSize: "0.85rem" }}>
              {book.author.charAt(0)}
            </Avatar>
            <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: "0.95rem" }}>
              {book.author}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                {book.year}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <MenuBook sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
                {book.pages}p
              </Typography>
            </Box>
          </Box>

          <Chip
            label={book.genre}
            size="small"
            sx={{
              backgroundColor: `${book.color}15`,
              color: book.color,
              fontWeight: 600,
              mb: 1.5,
              fontSize: "0.75rem",
              height: 28,
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating value={book.rating} precision={0.1} readOnly size="medium" />
            <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.85rem">
              {book.rating}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
              Community
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Rating
              value={userRating}
              onChange={handleRatingChange}
              size="medium"
              emptyIcon={<Star style={{ opacity: 0.3 }} fontSize="inherit" />}
            />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.75rem" }}>
              Your Rating
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2.5, pt: 0.5 }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<AutoStories />}
            onClick={handleViewDetails}
            sx={{
              background: `linear-gradient(135deg, ${book.color} 0%, ${book.color}CC 100%)`,
              fontWeight: 600,
              py: 1,
              fontSize: "0.9rem",
              "&:hover": {
                background: `linear-gradient(135deg, ${book.color}DD 0%, ${book.color}AA 100%)`,
                transform: "translateY(-1px)",
              },
            }}
          >
            View Details
          </Button>
        </CardActions>
      </Box>
    </Card>
  )
}

// Component 4: Enhanced Book List Component
const BookList: React.FC = () => {
  const { filteredBooks } = useBooks()

  if (filteredBooks.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 12 }}>
        <MenuBook sx={{ fontSize: 80, color: "text.disabled", mb: 3 }} />
        <Typography variant="h4" gutterBottom color="text.secondary" fontWeight={600}>
          No books found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: "auto" }}>
          Try adjusting your search criteria or filters to discover more amazing books.
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={0}>
      {filteredBooks.map((book) => (
        <Grid item xs={12} key={book.id}>
          <BookCard book={book} />
        </Grid>
      ))}
    </Grid>
  )
}

// Component 5: Enhanced Book Details Component
const BookDetail: React.FC = () => {
  const { selectedBook, setSelectedBook, addToReadingList, rateBook } = useBooks()
  const [userRating, setUserRating] = useState<number | null>(selectedBook?.userRating || null)

  if (!selectedBook) return null

  const handleClose = () => {
    setSelectedBook(null)
  }

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setUserRating(newValue)
      rateBook(selectedBook.id, newValue)
    }
  }

  const handleFavoriteToggle = () => {
    addToReadingList(selectedBook.id)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: selectedBook.title,
          text: `Check out "${selectedBook.title}" by ${selectedBook.author} - ${selectedBook.description.substring(0, 100)}...`,
          url: window.location.href,
        })
        .catch(console.error)
    } else {
      const shareText = `Check out "${selectedBook.title}" by ${selectedBook.author}!\n\n${selectedBook.description}\n\nRating: ${selectedBook.rating}/5 stars`
      navigator.clipboard
        .writeText(shareText)
        .then(() => {
          alert("Book details copied to clipboard!")
        })
        .catch(() => {
          const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just discovered "${selectedBook.title}" by ${selectedBook.author}! Great book with ${selectedBook.rating}/5 stars. 📚`)}`
          window.open(shareUrl, "_blank")
        })
    }
  }

  return (
    <Dialog open={!!selectedBook} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 0 }}>
        <Typography variant="h4" component="h2" fontWeight={700}>
          Book Details
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: "relative" }}>
              <img
                src={selectedBook.coverImage || "/placeholder.svg"}
                alt={selectedBook.title}
                style={{
                  width: "100%",
                  maxWidth: 300,
                  height: "auto",
                  borderRadius: 16,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${selectedBook.color}20 0%, transparent 50%)`,
                  borderRadius: 2,
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant="h3" gutterBottom fontWeight={800} sx={{ mb: 2 }}>
              {selectedBook.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: selectedBook.color }}>
                {selectedBook.author.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  {selectedBook.author}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Author
                </Typography>
              </Box>
            </Box>

            <Chip
              label={selectedBook.genre}
              sx={{
                backgroundColor: `${selectedBook.color}15`,
                color: selectedBook.color,
                fontWeight: 600,
                mb: 3,
                px: 2,
                py: 1,
              }}
            />

            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Community Rating
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Rating value={selectedBook.rating} precision={0.1} readOnly size="large" />
                <Typography variant="h5" fontWeight={700}>
                  {selectedBook.rating}/5
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your Rating
              </Typography>
              <Rating
                value={userRating}
                onChange={handleRatingChange}
                size="large"
                emptyIcon={<Star style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <CalendarToday sx={{ color: selectedBook.color, mb: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    {selectedBook.year}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Published
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <MenuBook sx={{ color: selectedBook.color, mb: 1 }} />
                  <Typography variant="h6" fontWeight={600}>
                    {selectedBook.pages}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pages
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Business sx={{ color: selectedBook.color, mb: 1 }} />
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {selectedBook.publisher}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Publisher
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center", p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Tag sx={{ color: selectedBook.color, mb: 1 }} />
                  <Typography variant="body2" fontWeight={600} noWrap>
                    {selectedBook.isbn}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ISBN
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom fontWeight={700}>
          About This Book
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: "1.1rem" }}>
          {selectedBook.description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 4, gap: 2 }}>
        <Button
          variant={selectedBook.isFavorite ? "outlined" : "contained"}
          startIcon={selectedBook.isFavorite ? <Favorite /> : <FavoriteBorder />}
          onClick={handleFavoriteToggle}
          size="large"
          color={selectedBook.isFavorite ? "error" : "primary"}
          sx={{ px: 4 }}
        >
          {selectedBook.isFavorite ? "Remove from Reading List" : "Add to Reading List"}
        </Button>
        <Button variant="outlined" size="large" startIcon={<Share />} onClick={handleShare} sx={{ px: 4 }}>
          Share Book
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Main Content Component
const BookHubContent: React.FC = () => {
  const { books, filteredBooks } = useBooks()

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          color: "white",
          py: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
            <Typography variant="h2" gutterBottom sx={{ color: "white", mb: 1, fontSize: "2.5rem" }}>
              📚 Book Hub
            </Typography>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 400, opacity: 0.95 }}>
              Discover your next favorite book
            </Typography>
          </Box>
        </Container>
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'url(\'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="1" fill="white" opacity="0.05"/></svg>\') repeat',
            backgroundSize: "30px 30px",
          }}
        />
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
          }}
        >
          <SearchBar />
        </Paper>

        {/* Filter Section */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
          }}
        >
          <FilterControls />
        </Paper>

        {/* Results Count */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" color="text.secondary" fontWeight={600}>
            Showing {filteredBooks.length} of {books.length} books
          </Typography>
        </Box>

        {/* Book List */}
        <BookList />

        {/* Footer */}
        <Box sx={{ textAlign: "center", mt: 12, py: 6 }}>
          <Divider sx={{ mb: 6 }} />
          <Typography variant="h6" gutterBottom fontWeight={600} color="text.secondary">
            Book Hub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            © 2024 Book Hub - Discover Amazing Books Every Day
          </Typography>
        </Box>
      </Container>

      {/* Book Detail Dialog */}
      <BookDetail />
    </Box>
  )
}

// Main App
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BookProvider>
        <BookHubContent />
      </BookProvider>
    </ThemeProvider>
  )
}

export default App
