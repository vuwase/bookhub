import React from 'react'
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Button, 
  Grid 
} from '@mui/material'
import { Refresh } from '@mui/icons-material'
import { FilterControlsProps } from '../types'

const FilterControls: React.FC<FilterControlsProps> = ({ 
  filters, 
  genres, 
  onFiltersChange, 
  onResetFilters 
}) => {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel>Genre</InputLabel>
          <Select 
            label="Genre" 
            value={filters.selectedGenre}
            onChange={(e) => onFiltersChange({ selectedGenre: e.target.value })}
          >
            <MenuItem value="all">All Genres</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>{genre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select 
            label="Sort By" 
            value={filters.sortBy}
            onChange={(e) => onFiltersChange({ sortBy: e.target.value as any })}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="author">Author</MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <FormControl fullWidth>
          <InputLabel>Order</InputLabel>
          <Select 
            label="Order" 
            value={filters.sortOrder}
            onChange={(e) => onFiltersChange({ sortOrder: e.target.value as any })}
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onResetFilters}
          sx={{ height: 56 }}
        >
          Reset
        </Button>
      </Grid>
    </Grid>
  )
}

export default FilterControls