import React, { useState } from 'react'
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Grid,
  Chip,
  Rating,
  Divider,
  IconButton
} from '@mui/material'
import { 
  Close, 
  Person, 
  CalendarToday, 
  MenuBook, 
  Business, 
  Tag,
  Favorite,
  FavoriteBorder,
  Star
} from '@mui/icons-material'
import { BookDetailProps } from '../types'

const BookDetail: React.FC<BookDetailProps> = ({ 
  book, 
  open, 
  onClose, 
  onAddToReadingList, 
  onRateBook 
}) => {
  const [userRating, setUserRating] = useState<number | null>(book.userRating || null)

  const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
    if (newValue !== null) {
      setUserRating(newValue)
      onRateBook(book.id, newValue)
    }
  }

  const handleFavoriteToggle = () => {
    onAddToReadingList(book.id)
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h2">
          {book.title}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={book.coverImage || "/placeholder.svg"}
                alt={book.title}
                style={{
                  width: '100%',
                  maxWidth: 250,
                  height: 'auto',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Person />
              <Typography variant="h6">by {book.author}</Typography>
            </Box>
            
            <Chip label={book.genre} color="primary" sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Average Rating
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Rating value={book.rating} precision={0.1} readOnly />
                <Typography variant="h6">{book.rating}/5</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Your Rating
              </Typography>
              <Rating
                value={userRating}
                onChange={handleRatingChange}
                emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
              />
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Published</Typography>
                    <Typography variant="body1">{book.year}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MenuBook color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Pages</Typography>
                    <Typography variant="body1">{book.pages}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Business color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Publisher</Typography>
                    <Typography variant="body1">{book.publisher}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Tag color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">ISBN</Typography>
                    <Typography variant="body1">{book.isbn}</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>Description</Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          {book.description}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ p: 3 }}>
        <Button 
          variant={book.isFavorite ? "outlined" : "contained"}
          startIcon={book.isFavorite ? <Favorite /> : <FavoriteBorder />}
          onClick={handleFavoriteToggle}
          size="large"
        >
          {book.isFavorite ? "Remove from Reading List" : "Add to Reading List"}
        </Button>
        <Button variant="outlined" size="large">
          Share Book
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default BookDetail