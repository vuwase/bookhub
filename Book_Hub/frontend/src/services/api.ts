const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Types for API responses
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: any[]
}

interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalBooks: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

interface BooksResponse {
  books: Book[]
  pagination: PaginationInfo
}

interface Book {
  id: string
  title: string
  author: string
  genre: string
  rating: number
  pages: number
  year: string
  description: string
  cover_image: string
  isbn: string
  publisher: string
  created_at: string
  updated_at: string
}

interface BookFilters {
  searchQuery?: any
  selectedGenre?: string
  search?: string
  genre?: string
  sortBy?: "title" | "author" | "rating" | "year"
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
  minRating?: number
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Books API methods
  async getBooks(filters: BookFilters = {}): Promise<BooksResponse> {
    const queryParams = new URLSearchParams()

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString())
      }
    })

    const queryString = queryParams.toString()
    const endpoint = `/books${queryString ? `?${queryString}` : ""}`

    const response = await this.request<BooksResponse>(endpoint)
    return response.data!
  }

  async getBookById(id: string): Promise<Book> {
    const response = await this.request<Book>(`/books/${id}`)
    return response.data!
  }

  async createBook(bookData: Omit<Book, "id" | "created_at" | "updated_at">): Promise<Book> {
    const response = await this.request<Book>("/books", {
      method: "POST",
      body: JSON.stringify(bookData),
    })
    return response.data!
  }

  async updateBook(id: string, bookData: Partial<Book>): Promise<Book> {
    const response = await this.request<Book>(`/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(bookData),
    })
    return response.data!
  }

  async deleteBook(id: string): Promise<void> {
    await this.request(`/books/${id}`, {
      method: "DELETE",
    })
  }

  async getGenres(): Promise<string[]> {
    const response = await this.request<string[]>("/books/genres")
    return response.data!
  }

  // Health check
  async healthCheck(): Promise<{ message: string; timestamp: string }> {
    const response = await this.request<{ message: string; timestamp: string }>("/health")
    return response.data!
  }
}

export const apiService = new ApiService()
export type { Book, BookFilters, BooksResponse, PaginationInfo }
