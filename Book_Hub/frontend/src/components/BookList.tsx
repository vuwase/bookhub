import React from 'react'
import { Grid, CircularProgress, Box, Typography } from '@mui/material'
import { MenuBook } from '@mui/icons-material'
import BookCard from './BookCard'
import { BookListProps } from '../types'

const BookList: React.FC<BookListProps> = ({ 
  books, 
  loading, 
  onViewDetails, 
  onAddToReadingList, 
  onRateBook 
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading books...
        </Typography>
      </Box>
    )
  }

  if (books.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <MenuBook sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" gutterBottom color="text.secondary">
          No books found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try adjusting your search criteria or filters.
        </Typography>
      </Box>
    )
  }

  return (
    <Grid container spacing={4}>
      {books.map((book) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
          <BookCard 
            book={book}
            onViewDetails={onViewDetails}
            onAddToReadingList={onAddToReadingList}
            onRateBook={onRateBook}
          />
        </Grid>
      ))}
    </Grid>
  )
}

export default BookList