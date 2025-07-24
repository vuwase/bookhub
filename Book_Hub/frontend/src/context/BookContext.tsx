import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Book } from '../types'

interface BookContextType {
  books: Book[]
  message: string
}

const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Classic Literature',
    rating: 4.2,
    pages: 180,
    year: '1925',
    description: 'A classic American novel set in the Jazz Age.',
    coverImage: 'https://via.placeholder.com/150x200?text=Gatsby',
    isbn: '978-0-7432-7356-5',
    publisher: 'Scribner',
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Classic Literature',
    rating: 4.5,
    pages: 324,
    year: '1960',
    description: 'A gripping tale of racial injustice and childhood innocence.',
    coverImage: 'https://via.placeholder.com/150x200?text=Mockingbird',
    isbn: '978-0-06-112008-4',
    publisher: 'J.B. Lippincott & Co.',
  },
]

const BookContext = createContext<BookContextType | undefined>(undefined)

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books] = useState<Book[]>(mockBooks)

  const value: BookContextType = {
    books,
    message: 'Context is working!',
  }

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>
}

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext)
  if (!context) {
    throw new Error('useBooks must be used within a BookProvider')
  }
  return context
}