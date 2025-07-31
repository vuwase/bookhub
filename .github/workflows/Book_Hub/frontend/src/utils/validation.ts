// Validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validateRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5
}

export const validateSearchQuery = (query: string): boolean => {
  return query.trim().length >= 2
}

export const validateBookData = (book: any): string[] => {
  const errors: string[] = []
  
  if (!book.title || book.title.trim().length === 0) {
    errors.push('Title is required')
  }
  
  if (!book.author || book.author.trim().length === 0) {
    errors.push('Author is required')
  }
  
  if (!book.genre || book.genre.trim().length === 0) {
    errors.push('Genre is required')
  }
  
  if (!book.rating || !validateRating(book.rating)) {
    errors.push('Rating must be between 1 and 5')
  }
  
  if (!book.pages || book.pages <= 0) {
    errors.push('Page count must be greater than 0')
  }
  
  return errors
}