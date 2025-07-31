// Application constants

export const SORT_OPTIONS = [
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
  { value: 'rating', label: 'Rating' },
  { value: 'year', label: 'Year' },
] as const

export const SORT_ORDER_OPTIONS = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
] as const

export const ITEMS_PER_PAGE = 12

export const SEARCH_DEBOUNCE_DELAY = 300

export const LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: 'bookHub_userPreferences',
  READING_LIST: 'bookHub_readingList',
  USER_RATINGS: 'bookHub_userRatings',
  FILTERS: 'bookHub_filters',
} as const

export const API_ENDPOINTS = {
  BOOKS: '/api/books',
  BOOK_DETAIL: '/api/books/:id',
  SEARCH: '/api/books/search',
  GENRES: '/api/genres',
  USER_RATINGS: '/api/user/ratings',
  READING_LIST: '/api/user/reading-list',
} as const

export const BOOK_GENRES = [
  'Classic Literature',
  'Science Fiction',
  'Fantasy',
  'Romance',
  'Mystery',
  'Thriller',
  'Horror',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Technology',
  'Health',
  'Travel',
  'Cooking',
  'Art',
  'Poetry',
  'Drama',
  'Comedy',
  'Adventure',
] as const

export const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
} as const