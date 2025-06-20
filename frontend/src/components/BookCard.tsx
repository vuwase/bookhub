import React, { useState } from 'react'
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Rating,
  IconButton,
  Tooltip
} from '@mui/material'
import { 
  Person, 
  CalendarToday, 
  MenuBook, 
  Favorite, 
  FavoriteBorder,
  Star
} from '@mui/icons-material'
import { BookCardProps } from '../types'

const BookCard: React.FC<BookCardProps> = ({ 
  book, 
  onViewDetails, 
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
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: 6,
        },
        borderRadius: 2,
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center', position: 'relative' }}>
        <Tooltip title={book.isFavorite ? "Remove from Reading List" : "Add to Reading List"}>
          <IconButton
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={handleFavoriteToggle}
            color={book.isFavorite ? "error" : "default"}
          >
            {book.isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Tooltip>
        
        <img
          src={book.coverImage || "/placeholder.svg"}
          alt={book.title}
          style={{
            width: '100%',
            maxWidth: 120,
            height: 160,
            objectFit: 'cover',
            borderRadius: 8,
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }}
        />
      </Box>
      
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '3.2em',
            lineHeight: 1.6,
          }}
        >
          {book.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
          <Person fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {book.author}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <CalendarToday fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {book.year}
          </Typography>
          <MenuBook fontSize="small" color="action" sx={{ ml: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {book.pages}p
          </Typography>
        </Box>

        <Chip 
          label={book.genre} 
          size="small" 
          color="primary" 
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Average Rating
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating 
              value={book.rating} 
              precision={0.1} 
              readOnly 
              size="small" 
            />
            <Typography variant="body2" color="text.secondary">
              ({book.rating})
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Your Rating
          </Typography>
          <Rating
            value={userRating}
            onChange={handleRatingChange}
            size="small"
            emptyIcon={<Star style={{ opacity: 0.55 }} fontSize="inherit" />}
          />
        </Box>

        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.4,
          }}
        >
          {book.description}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          fullWidth 
          variant="contained" 
          onClick={() => onViewDetails(book)}
          sx={{ 
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  )
}

export default BookCard