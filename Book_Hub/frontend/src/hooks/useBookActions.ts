import { useCallback } from 'react'
import { User } from '../types'

// Custom hook for book-related actions
export function useBookActions(
  user: User | null,
  setUser: (user: User | null) => void
) {
  const addToReadingList = useCallback((bookId: string) => {
    if (user && !user.readingList.includes(bookId)) {
      const updatedUser = {
        ...user,
        readingList: [...user.readingList, bookId],
      }
      setUser(updatedUser)
      
      // Show success message (you could use a toast library here)
      console.log(`✅ Added book to reading list`)
      
      // In a real app, this would make an API call
      // await api.addToReadingList(bookId)
    }
  }, [user, setUser])

  const removeFromReadingList = useCallback((bookId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        readingList: user.readingList.filter(id => id !== bookId),
      }
      setUser(updatedUser)
      
      console.log(`❌ Removed book from reading list`)
      
      // In a real app, this would make an API call
      // await api.removeFromReadingList(bookId)
    }
  }, [user, setUser])

  const rateBook = useCallback((bookId: string, rating: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        ratings: { ...user.ratings, [bookId]: rating },
      }
      setUser(updatedUser)
      
      console.log(`⭐ Rated book ${rating} stars`)
      
      // In a real app, this would make an API call
      // await api.rateBook(bookId, rating)
    }
  }, [user, setUser])

  const toggleFavorite = useCallback((bookId: string) => {
    if (user) {
      const isInReadingList = user.readingList.includes(bookId)
      if (isInReadingList) {
        removeFromReadingList(bookId)
      } else {
        addToReadingList(bookId)
      }
    }
  }, [user, addToReadingList, removeFromReadingList])

  return {
    addToReadingList,
    removeFromReadingList,
    rateBook,
    toggleFavorite,
  }
}