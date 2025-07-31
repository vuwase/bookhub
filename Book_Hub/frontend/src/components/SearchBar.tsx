import React from 'react'
import { TextField, InputAdornment, IconButton } from '@mui/material'
import { Search, Clear } from '@mui/icons-material'
import { SearchBarProps } from '../types'

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  const handleClear = () => {
    onSearchChange('')
  }

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search books, authors, or descriptions..."
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search color="action" />
          </InputAdornment>
        ),
        endAdornment: searchQuery && (
          <InputAdornment position="end">
            <IconButton onClick={handleClear} size="small">
              <Clear />
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        }
      }}
    />
  )
}

export default SearchBar