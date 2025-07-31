// Utility functions for formatting data

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatYear = (dateString: string): string => {
  return new Date(dateString).getFullYear().toString()
}

export const formatRating = (rating: number): string => {
  return rating.toFixed(1)
}

export const formatPageCount = (pages: number): string => {
  if (pages < 1000) {
    return `${pages} pages`
  }
  return `${(pages / 1000).toFixed(1)}k pages`
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}