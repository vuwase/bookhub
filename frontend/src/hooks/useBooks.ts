"use client"

import { useState, useEffect, useCallback } from "react"
import { apiService, type Book, type BookFilters, type BooksResponse } from "../services/api"

interface UseBooksReturn {
  books: Book[]
  loading: boolean
  error: string | null
  pagination: BooksResponse["pagination"] | null
  filters: BookFilters
  updateFilters: (newFilters: Partial<BookFilters>) => void
  resetFilters: () => void
  refetch: () => Promise<void>
}

const defaultFilters: BookFilters = {
  search: "",
  searchQuery: "",
  genre: "all",
  selectedGenre: "all",
  sortBy: "title",
  sortOrder: "asc",
  page: 1,
  limit: 10,
}

export function useBooks(initialFilters: Partial<BookFilters> = {}): UseBooksReturn {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<BooksResponse["pagination"] | null>(null)
  const [filters, setFilters] = useState<BookFilters>({
    ...defaultFilters,
    ...initialFilters,
  })

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Clean filters - remove 'all' genre and empty values
      const cleanFilters = { ...filters }
      if (cleanFilters.genre === "all") {
        delete cleanFilters.genre
      }

      const response = await apiService.getBooks(cleanFilters)
      setBooks(response.books)
      setPagination(response.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch books")
      setBooks([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const updateFilters = useCallback((newFilters: Partial<BookFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      // Reset to page 1 when filters change (except when changing page)
      page: newFilters.page !== undefined ? newFilters.page : 1,
    }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const refetch = useCallback(async () => {
    await fetchBooks()
  }, [fetchBooks])

  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  return {
    books,
    loading,
    error,
    pagination,
    filters,
    updateFilters,
    resetFilters,
    refetch,
  }
}
