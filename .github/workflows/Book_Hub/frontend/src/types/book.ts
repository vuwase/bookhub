// TypeScript interfaces for type safety
export interface Book {
  id: string
  title: string
  author: string
  genre: string
  publicationDate: string
  rating: number
  description: string
  coverImage: string
  isbn: string
  pages: number
  publisher: string
}

export interface FilterOptions {
  searchQuery: string
  selectedGenre: string
  sortBy: "title" | "author" | "publicationDate" | "rating"
  sortOrder: "asc" | "desc"
}

export interface BookContextType {
  books: Book[]
  filteredBooks: Book[]
  filters: FilterOptions
  loading: boolean
  updateFilters: (filters: Partial<FilterOptions>) => void
  resetFilters: () => void
}