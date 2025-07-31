import { useMemo } from 'react'
import { Book, FilterOptions } from '../types'

// Custom hook for filtering and sorting books
export function useBookFilters(books: Book[], filters: FilterOptions) {
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books]

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.description.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query)
      )
    }

    // Apply genre filter
    if (filters.selectedGenre !== 'all') {
      result = result.filter(book => book.genre === filters.selectedGenre)
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'author':
          comparison = a.author.localeCompare(b.author)
          break
        case 'rating':
          comparison = b.rating - a.rating // Higher ratings first by default
          break
        case 'year':
          comparison = parseInt(b.year) - parseInt(a.year) // Newer books first by default
          break
        default:
          comparison = 0
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison
    })

    return result
  }, [books, filters])

  // Get unique genres for filter dropdown
  const availableGenres = useMemo(() => {
    return Array.from(new Set(books.map(book => book.genre))).sort()
  }, [books])

  // Get statistics
  const stats = useMemo(() => {
    return {
      totalBooks: books.length,
      filteredBooks: filteredAndSortedBooks.length,
      averageRating: books.reduce((sum, book) => sum + book.rating, 0) / books.length,
      genreCount: availableGenres.length,
    }
  }, [books, filteredAndSortedBooks, availableGenres])

  return {
    filteredBooks: filteredAndSortedBooks,
    availableGenres,
    stats,
  }
}