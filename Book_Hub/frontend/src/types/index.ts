export interface Book {
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
}

export interface FilterOptions {
  searchQuery: string
  selectedGenre: string
  sortBy: "title" | "author" | "rating" | "year"
  sortOrder: "asc" | "desc"
}

export interface User {
  id: string
  name: string
  email: string
  readingList: string[]
  ratings: Record<string, number>
}