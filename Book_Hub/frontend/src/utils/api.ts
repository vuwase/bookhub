// API utility functions (for future backend integration)

import { Book, User, FilterOptions } from '../types'

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.message || 'An error occurred')
  }
  return response.json()
}

// Book API functions
export const bookApi = {
  // Get all books
  getBooks: async (): Promise<Book[]> => {
    const response = await fetch(`${API_BASE_URL}/books`)
    return handleResponse(response)
  },

  // Get book by ID
  getBook: async (id: string): Promise<Book> => {
    const response = await fetch(`${API_BASE_URL}/books/${id}`)
    return handleResponse(response)
  },

  // Search books
  searchBooks: async (query: string): Promise<Book[]> => {
    const response = await fetch(`${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`)
    return handleResponse(response)
  },

  // Get books with filters
  getFilteredBooks: async (filters: FilterOptions): Promise<Book[]> => {
    const params = new URLSearchParams()
    if (filters.searchQuery) params.append('search', filters.searchQuery)
    if (filters.selectedGenre !== 'all') params.append('genre', filters.selectedGenre)
    params.append('sortBy', filters.sortBy)
    params.append('sortOrder', filters.sortOrder)

    const response = await fetch(`${API_BASE_URL}/books?${params}`)
    return handleResponse(response)
  },

  // Get available genres
  getGenres: async (): Promise<string[]> => {
    const response = await fetch(`${API_BASE_URL}/genres`)
    return handleResponse(response)
  },
}

// User API functions
export const userApi = {
  // Get user profile
  getProfile: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return handleResponse(response)
  },

  // Update reading list
  addToReadingList: async (bookId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/user/reading-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ bookId }),
    })
    return handleResponse(response)
  },

  removeFromReadingList: async (bookId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/user/reading-list/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    return handleResponse(response)
  },

  // Rate book
  rateBook: async (bookId: string, rating: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/user/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ bookId, rating }),
    })
    return handleResponse(response)
  },
}

// Generic API utility
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })
  
  return handleResponse(response)
}