"use client"

import React from "react"

import type { ReactNode } from "react"
import { createContext, useContext, useState, useMemo } from "react"
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
  Avatar,
  CardMedia,
  useMediaQuery,
  useTheme,
  Collapse,
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Fab,
  Slide,
  Stack,
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
  FilterList,
  ExpandMore,
  ExpandLess,
  Menu as MenuIcon,
  ArrowUpward,
  GridView,
  ViewList,
} from "@mui/icons-material"

// Enhanced responsive theme
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
      default: "#fbf8fcff",
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
      fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
      background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 700,
      fontSize: "clamp(1.25rem, 3vw, 2rem)",
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: "clamp(1.125rem, 2.5vw, 1.75rem)",
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: "clamp(1rem, 2vw, 1.5rem)",
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: "clamp(0.875rem, 1.5vw, 1.25rem)",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "clamp(0.875rem, 1.2vw, 1rem)",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "clamp(0.75rem, 1vw, 0.875rem)",
      lineHeight: 1.5,
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
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
          padding: "8px 16px",
          "@media (max-width: 600px)": {
            padding: "6px 12px",
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: "clamp(16px, 4vw, 24px)",
          paddingRight: "clamp(16px, 4vw, 24px)",
          "@media (max-width: 600px)": {
            paddingLeft: "16px",
            paddingRight: "16px",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "@media (max-width: 600px)": {
              fontSize: "16px", // Prevents zoom on iOS
            },
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
})

// Books data
const originalBooks = [
  {
    id: "1",
    title: "Divergent",
    author: "Veronica Roth",
    year: 2011,
    pages: 487,
    genre: "dystopian",
    rating: 4.1,
    cover: "/Divergent.jpg",
    authorInitial: "V",
    description:
      "A dystopian social science fiction novel about the Divergent series tackles themes of identity and belonging.",
    isbn: "978-0-452-28423-4",
    publisher: "HarperCollins Children's Books",
  },
  {
    id: "2",
    title: "Dune",
    author: "Frank Herbert",
    year: 1965,
    pages: 688,
    genre: "Science Fiction",
    rating: 4.3,
    cover: "/dune.jpg",
    authorInitial: "F",
    description:
      "An epic science fiction novel set on the desert planet Arrakis, following Paul Atreides in his quest for revenge and power.",
    isbn: "978-0-441-17271-9",
    publisher: "Chilton Books",
  },
  {
    id: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    year: 1925,
    pages: 180,
    genre: "Classic Literature",
    rating: 4.2,
    cover: "/great-gatsby.jpg",
    authorInitial: "F",
    description:
      "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway.",
    isbn: "978-0-7432-7356-5",
    publisher: "Scribner",
  },
  {
    id: "4",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    pages: 324,
    genre: "Classic Literature",
    rating: 4.5,
    cover: "/mockingbird.jpg",
    authorInitial: "H",
    description:
      "A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.",
    isbn: "978-0-06-112008-4",
    publisher: "J.B. Lippincott & Co.",
  },
  {
    id: "5",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: 1937,
    pages: 310,
    genre: "Fantasy",
    rating: 4.6,
    cover: "/hobbit.jpg",
    authorInitial: "J",
    description:
      "A fantasy adventure following Bilbo Baggins on his unexpected journey to help a group of dwarves reclaim their homeland.",
    isbn: "978-0-547-92822-7",
    publisher: "George Allen & Unwin",
  },
  {
    id: "6",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    year: 1813,
    pages: 432,
    genre: "Romance",
    rating: 4.4,
    cover: "/pride-prejudice.jpg",
    authorInitial: "J",
    description:
      "A romantic novel exploring themes of love, reputation, and class in Georgian England through Elizabeth Bennet and Mr. Darcy.",
    isbn: "978-0-14-143951-8",
    publisher: "T. Egerton",
  },
  {
    id: "7",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    year: 1997,
    pages: 223,
    genre: "Fantasy",
    rating: 4.7,
    cover: "/Harry Potter.jpg",
    authorInitial: "J",
    description:
      "The first book in the beloved Harry Potter series about a young wizard discovering his magical heritage.",
    isbn: "978-0-7475-3269-9",
    publisher: "Bloomsbury",
  },
  {
    id: "8",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    year: 1951,
    pages: 277,
    genre: "Coming of Age",
    rating: 3.8,
    cover: "/The catcher in the Rye.jpg",
    authorInitial: "J",
    description:
      "A controversial novel about teenage rebellion and alienation, narrated by the iconic Holden Caulfield.",
    isbn: "978-0-316-76948-0",
    publisher: "Little, Brown and Company",
  },
]

// TypeScript interfaces
interface Book {
  id: string
  title: string
  author: string
  genre: string
  rating: number
  pages: number
  year: number
  description: string
  cover: string
  isbn: string
  publisher: string
  authorInitial: string
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
  viewMode: "grid" | "list"
  connectionStatus: "checking" | "connected" | "disconnected"
  apiError: string | null
  updateFilters: (filters: Partial<FilterOptions>) => void
  resetFilters: () => void
  setSelectedBook: (book: Book | null) => void
  addToReadingList: (bookId: string) => void
  rateBook: (bookId: string, rating: number) => void
  setViewMode: (mode: "grid" | "list") => void
  testConnection: () => void
}

// Mock user
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

// Context API
const BookContext = createContext<BookContextType | undefined>(undefined)

// Helper function to get API URL with proper fallbacks for Vite
const getApiUrl = (): string => {
  // For Vite, environment variables are accessed via import.meta.env
  // and must be prefixed with VITE_
  const viteApiUrl = import.meta.env?.VITE_API_URL

  // Get current hostname and try to construct API URL for Codespaces
  const currentHost = window.location.hostname
  const currentProtocol = window.location.protocol

  // Try different API URL patterns
  if (viteApiUrl) {
    console.log("Using VITE_API_URL:", viteApiUrl)
    return viteApiUrl
  }

  // For GitHub Codespaces, construct the API URL
  if (currentHost.includes("app.github.dev")) {
    // Replace the port in the current URL with 5000 for the backend
    const apiUrl = `${currentProtocol}//${currentHost.replace("-5173", "-5000")}`
    console.log("Detected Codespaces, using constructed API URL:", apiUrl)
    return apiUrl
  }

  // Default fallback
  const fallbackUrl = "http://localhost:5000"
  console.log("Using fallback API URL:", fallbackUrl)
  return fallbackUrl
}

// BookProvider component
const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [user, setUser] = useState<User | null>(mockUser)
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters)
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [connectionStatus, setConnectionStatus] = useState<"checking" | "connected" | "disconnected">("checking")
  const [apiError, setApiError] = useState<string | null>(null)

  // Test backend connection
  const testConnection = async () => {
    try {
      setConnectionStatus("checking")
      setApiError(null)

      const apiUrl = getApiUrl()
      console.log("Testing connection to:", `${apiUrl}/api/test/connection`)

      const response = await fetch(`${apiUrl}/api/test/connection`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      const data = await response.json()
      console.log("Connection test result:", data)

      if (data.success) {
        setConnectionStatus("connected")
        console.log("✅ Frontend successfully connected to backend!")
        console.log("📊 Database books:", data.database?.total_books)
      } else {
        throw new Error(data.message || "Connection test failed")
      }
    } catch (error) {
      console.error("❌ Connection test failed:", error)
      setConnectionStatus("disconnected")

      let errorMessage = "Unknown connection error"
      if (error instanceof Error) {
        if (error.name === "TimeoutError") {
          errorMessage = "Connection timeout - backend server may not be running"
        } else if (error.message.includes("fetch")) {
          errorMessage = "Cannot reach backend server - check if it's running on the correct port"
        } else {
          errorMessage = error.message
        }
      }

      setApiError(errorMessage)
    }
  }

  // Test connection on component mount
  React.useEffect(() => {
    testConnection()
  }, [])

  // Function to assign colors based on genre
  const getBookColor = (genre: string): string => {
    const genreColors: Record<string, string> = {
      "Classic Literature": "#f59e0b",
      "Science Fiction": "#f97316",
      Fantasy: "#059669",
      Romance: "#ec4899",
      dystopian: "#7c3aed",
      "Coming of Age": "#0891b2",
      Fiction: "#dc2626",
      "Non-Fiction": "#059669",
      Mystery: "#7c2d12",
      Thriller: "#991b1b",
      Biography: "#0369a1",
      History: "#92400e",
    }
    return genreColors[genre] || "#6b7280"
  }

  // Convert original books to the expected format
  const books: Book[] = originalBooks.map((book) => ({
    ...book,
    cover: book.cover,
    isFavorite: user?.readingList.includes(book.id),
    userRating: user?.ratings[book.id],
    color: getBookColor(book.genre),
  }))

  // Filter books based on current filters
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
          comparison = b.rating - a.rating
          break
        case "year":
          comparison = b.year - a.year
          break
      }

      return filters.sortOrder === "desc" ? -comparison : comparison
    })

    return result
  }, [books, filters])

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
    viewMode,
    connectionStatus,
    apiError,
    updateFilters,
    resetFilters,
    setSelectedBook,
    addToReadingList,
    rateBook,
    setViewMode,
    testConnection,
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

// Mobile Navigation Header
const MobileHeader: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { books, filteredBooks, resetFilters } = useBooks()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  if (!isMobile) return null

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", minHeight: "64px !important" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)} sx={{ mr: 1 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
              📚 Book Hub
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {filteredBooks.length} books
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, bgcolor: "background.default" },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={700}>
            📚 Book Hub
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Discover your next favorite book
          </Typography>
        </Box>
        <Divider />
        <List>
          <ListItem>
            <ListItemText primary="Total Books" secondary={books.length} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Filtered Results"
              secondary={filteredBooks.length}
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItem>
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Refresh />}
            onClick={() => {
              resetFilters()
              setDrawerOpen(false)
            }}
          >
            Reset All Filters
          </Button>
        </Box>
      </Drawer>
    </>
  )
}

// Connection Status Alert Component
const ConnectionStatusAlert: React.FC = () => {
  const { connectionStatus, apiError, testConnection } = useBooks()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

 

 
  return null
}

// Enhanced Search Bar Component
const SearchBar: React.FC = () => {
  const { filters, updateFilters } = useBooks()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder={isMobile ? "Search books..." : "Search for books, authors, or descriptions..."}
      value={filters.searchQuery}
      onChange={(e) => updateFilters({ searchQuery: e.target.value })}
      size={isMobile ? "small" : "medium"}
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
          fontSize: isMobile ? "16px" : "inherit", // Prevents zoom on iOS
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

// Enhanced Filter Controls Component
const FilterControls: React.FC = () => {
  const { filters, updateFilters, resetFilters, books, viewMode, setViewMode } = useBooks()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // Get unique genres from books
  const genres = Array.from(new Set(books.map((book) => book.genre))).sort()

  const FilterContent = () => (
    <Grid container spacing={isMobile ? 2 : 3} alignItems="center">
      <Grid item xs={12} sm={6} md={2.4}>
        <FormControl fullWidth size={isMobile ? "small" : "medium"}>
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

      <Grid item xs={12} sm={6} md={2.4}>
        <FormControl fullWidth size={isMobile ? "small" : "medium"}>
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

      <Grid item xs={12} sm={6} md={2.4}>
        <FormControl fullWidth size={isMobile ? "small" : "medium"}>
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

      <Grid item xs={6} sm={3} md={2.4}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Refresh />}
          onClick={resetFilters}
          size={isMobile ? "small" : "medium"}
          sx={{ height: isMobile ? 40 : 56, borderRadius: 2 }}
        >
          Reset
        </Button>
      </Grid>

      <Grid item xs={6} sm={3} md={2.4}>
        <Button
          fullWidth
          variant={viewMode === "list" ? "contained" : "outlined"}
          startIcon={viewMode === "list" ? <ViewList /> : <GridView />}
          onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
          size={isMobile ? "small" : "medium"}
          sx={{ height: isMobile ? 40 : 56, borderRadius: 2 }}
        >
          {viewMode === "list" ? "List" : "Grid"}
        </Button>
      </Grid>
    </Grid>
  )

  if (isMobile) {
    return (
      <>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<FilterList />}
          endIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setFiltersOpen(!filtersOpen)}
          sx={{ mb: 2 }}
        >
          Filters & Sorting
        </Button>
        <Collapse in={filtersOpen}>
          <Box sx={{ mb: 2 }}>
            <FilterContent />
          </Box>
        </Collapse>
      </>
    )
  }

  return <FilterContent />
}

// Enhanced Book Card Component
const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const { setSelectedBook, addToReadingList, rateBook, viewMode } = useBooks()
  const [userRating, setUserRating] = useState<number | null>(book.userRating || null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

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

  // Grid view for mobile/tablet
  if (viewMode === "grid" || isMobile) {
    return (
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
          },
          borderRadius: 3,
          overflow: "hidden",
          position: "relative",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Book Cover */}
        <Box sx={{ position: "relative", paddingTop: "150%" }}>
          <CardMedia
            component="img"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            image={book.cover}
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
          <IconButton
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
                transform: "scale(1.1)",
              },
            }}
            onClick={handleFavoriteToggle}
            color={book.isFavorite ? "error" : "default"}
            size="small"
          >
            {book.isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>

        {/* Card Content */}
        <CardContent sx={{ flex: 1, p: 2, display: "flex", flexDirection: "column" }}>
          <Typography
            variant="subtitle1"
            gutterBottom
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontWeight: 700,
              lineHeight: 1.2,
              mb: 1,
              minHeight: "2.4em",
            }}
          >
            {book.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {book.author}
          </Typography>

          <Chip
            label={book.genre}
            size="small"
            sx={{
              backgroundColor: `${book.color}15`,
              color: book.color,
              fontWeight: 600,
              mb: 1,
              fontSize: "0.7rem",
              height: 24,
              alignSelf: "flex-start",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating value={book.rating} precision={0.1} readOnly size="small" />
            <Typography variant="caption" color="text.secondary">
              {book.rating}
            </Typography>
          </Box>

          <Box sx={{ mt: "auto" }}>
            <Button
              fullWidth
              variant="contained"
              size="small"
              onClick={handleViewDetails}
              sx={{
                background: `linear-gradient(135deg, ${book.color} 0%, ${book.color}CC 100%)`,
                fontWeight: 600,
                fontSize: "0.8rem",
                "&:hover": {
                  background: `linear-gradient(135deg, ${book.color}DD 0%, ${book.color}AA 100%)`,
                },
              }}
            >
              View Details
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  }

  // List view for desktop
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        height: 280,
        width: "100%",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15)",
        },
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        mb: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Book Cover Section */}
      <Box
        sx={{
          position: "relative",
          width: 150,
          height: "100%",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="img"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          image={book.cover}
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

      {/* Book Content Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          position: "relative",
          minWidth: 0,
          height: "100%",
        }}
      >
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
          size="small"
        >
          {book.isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>

        <CardContent sx={{ flex: 1, p: 2.5, pb: 1, display: "flex", flexDirection: "column" }}>
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
              minHeight: "2.4em",
            }}
          >
            {book.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <Avatar sx={{ width: 26, height: 26, bgcolor: book.color, fontSize: "0.85rem" }}>
              {book.authorInitial}
            </Avatar>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {book.author}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
                {book.year}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <MenuBook sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="caption" color="text.secondary">
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
              alignSelf: "flex-start",
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating value={book.rating} precision={0.1} readOnly size="small" />
            <Typography variant="body2" color="text.secondary" fontWeight={600} fontSize="0.85rem">
              {book.rating}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Community
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Rating
              value={userRating}
              onChange={handleRatingChange}
              size="small"
              emptyIcon={<Star style={{ opacity: 0.3 }} fontSize="inherit" />}
            />
            <Typography variant="caption" color="text.secondary">
              Your Rating
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2.5, pt: 0, mt: "auto" }}>
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

// Enhanced Book List Component
const BookList: React.FC = () => {
  const { filteredBooks, viewMode } = useBooks()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  if (filteredBooks.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: isMobile ? 8 : 12 }}>
        <MenuBook sx={{ fontSize: isMobile ? 60 : 80, color: "text.disabled", mb: 3 }} />
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom color="text.secondary" fontWeight={600}>
          No books found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: "auto", px: 2 }}>
          Try adjusting your search criteria or filters to discover more amazing books.
        </Typography>
      </Box>
    )
  }

  // Grid view for mobile/tablet or when grid mode is selected
  if (viewMode === "grid" || isMobile) {
    return (
      <Box sx={{ width: "100%" }}>
        <Grid container spacing={isMobile ? 2 : 3}>
          {filteredBooks.map((book) => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.id}>
              <BookCard book={book} />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  // List view for desktop
  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </Stack>
    </Box>
  )
}

// Scroll to Top Button
const ScrollToTop: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Slide direction="up" in={showScrollTop} mountOnEnter unmountOnExit>
      <Fab
        color="primary"
        size="medium"
        onClick={scrollToTop}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <ArrowUpward />
      </Fab>
    </Slide>
  )
}

// Enhanced Book Details Component
const BookDetail: React.FC = () => {
  const { selectedBook, setSelectedBook, addToReadingList, rateBook } = useBooks()
  const [userRating, setUserRating] = useState<number | null>(selectedBook?.userRating || null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

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
    <Dialog
      open={!!selectedBook}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: isMobile ? "100vh" : "90vh",
          m: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 0,
          px: isMobile ? 2 : 3,
          pt: isMobile ? 2 : 3,
        }}
      >
        <Typography variant={isMobile ? "h5" : "h4"} component="h2" fontWeight={700}>
          Book Details
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "text.secondary" }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: isMobile ? 2 : 4, overflow: "auto" }}>
        <Grid container spacing={isMobile ? 3 : 4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: "relative", textAlign: "center" }}>
              <img
                src={selectedBook.cover || "/placeholder.svg"}
                alt={selectedBook.title}
                style={{
                  width: "100%",
                  maxWidth: isMobile ? 200 : 300,
                  height: "auto",
                  borderRadius: 16,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography variant={isMobile ? "h4" : "h3"} gutterBottom fontWeight={800} sx={{ mb: 2 }}>
              {selectedBook.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar sx={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40, bgcolor: selectedBook.color }}>
                {selectedBook.authorInitial}
              </Avatar>
              <Box>
                <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight={600}>
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
                <Rating value={selectedBook.rating} precision={0.1} readOnly size={isMobile ? "medium" : "large"} />
                <Typography variant={isMobile ? "h6" : "h5"} fontWeight={700}>
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
                size={isMobile ? "medium" : "large"}
                emptyIcon={<Star style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
            </Box>

            <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center", p: isMobile ? 1.5 : 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <CalendarToday sx={{ color: selectedBook.color, mb: 1, fontSize: isMobile ? 20 : 24 }} />
                  <Typography variant={isMobile ? "subtitle2" : "h6"} fontWeight={600}>
                    {selectedBook.year}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Published
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center", p: isMobile ? 1.5 : 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <MenuBook sx={{ color: selectedBook.color, mb: 1, fontSize: isMobile ? 20 : 24 }} />
                  <Typography variant={isMobile ? "subtitle2" : "h6"} fontWeight={600}>
                    {selectedBook.pages}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pages
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center", p: isMobile ? 1.5 : 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Business sx={{ color: selectedBook.color, mb: 1, fontSize: isMobile ? 20 : 24 }} />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      fontSize: isMobile ? "0.8rem" : "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {selectedBook.publisher}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Publisher
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box sx={{ textAlign: "center", p: isMobile ? 1.5 : 2, bgcolor: "grey.50", borderRadius: 2 }}>
                  <Tag sx={{ color: selectedBook.color, mb: 1, fontSize: isMobile ? 20 : 24 }} />
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      fontSize: isMobile ? "0.8rem" : "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
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

        <Typography variant={isMobile ? "h6" : "h5"} gutterBottom fontWeight={700}>
          About This Book
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8, fontSize: isMobile ? "1rem" : "1.1rem" }}>
          {selectedBook.description}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          p: isMobile ? 2 : 4,
          gap: isMobile ? 1 : 2,
          flexDirection: isMobile ? "column" : "row",
          position: isMobile ? "sticky" : "relative",
          bottom: 0,
          bgcolor: "background.paper",
          borderTop: isMobile ? "1px solid" : "none",
          borderColor: "divider",
        }}
      >
        <Button
          variant={selectedBook.isFavorite ? "outlined" : "contained"}
          startIcon={selectedBook.isFavorite ? <Favorite /> : <FavoriteBorder />}
          onClick={handleFavoriteToggle}
          size={isMobile ? "medium" : "large"}
          color={selectedBook.isFavorite ? "error" : "primary"}
          fullWidth={isMobile}
          sx={{ px: isMobile ? 2 : 4 }}
        >
          {selectedBook.isFavorite ? "Remove from Reading List" : "Add to Reading List"}
        </Button>
        <Button
          variant="outlined"
          size={isMobile ? "medium" : "large"}
          startIcon={<Share />}
          onClick={handleShare}
          fullWidth={isMobile}
          sx={{ px: isMobile ? 2 : 4 }}
        >
          Share Book
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// Main Content Component
const BookHubContent: React.FC = () => {
  const { books, filteredBooks } = useBooks()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Mobile Header */}
      <MobileHeader />

      {/* Connection Status Alert */}
      <ConnectionStatusAlert />

      {/* Hero Section */}
      {!isMobile && (
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(126, 102, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%), url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            color: "white",
            py: 6,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Container maxWidth="xl">
            <Box sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
              <Typography variant="h1" gutterBottom sx={{ color: "white", mb: 1 }}>
                📚 Book Hub
              </Typography>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 400, opacity: 0.95 }}>
                Discover your next favorite book
              </Typography>
            </Box>
          </Container>
        </Box>
      )}

      <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 6 }}>
        {/* Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 3.5,
            mb: isMobile ? 2 : 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        >
          <SearchBar />
        </Paper>

        {/* Filter Section */}
        <Paper
          elevation={0}
          sx={{
            p: isMobile ? 2 : 3.5,
            mb: isMobile ? 2 : 4,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        >
          <FilterControls />
        </Paper>

        {/* Results Count */}
        <Box sx={{ mb: isMobile ? 2 : 4, px: isMobile ? 0 : 2 }}>
          <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary" fontWeight={600}>
            Showing {filteredBooks.length} of {books.length} books
          </Typography>
        </Box>

        {/* Book List */}
        <BookList />

        {/* Footer */}
        <Box sx={{ textAlign: "center", mt: isMobile ? 8 : 16, py: isMobile ? 4 : 8 }}>
          <Divider sx={{ mb: isMobile ? 4 : 8 }} />
          <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom fontWeight={600} color="text.secondary">
            Book Hub
          </Typography>
          <Typography variant="body2" color="text.secondary">
            © 2025 Book Hub - Discover Amazing Books Every Day
          </Typography>
        </Box>
      </Container>

      {/* Book Detail Dialog */}
      <BookDetail />

      {/* Scroll to Top Button */}
      <ScrollToTop />
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
