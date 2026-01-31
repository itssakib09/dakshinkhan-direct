import { createContext, useContext, useState } from 'react'

const SearchContext = createContext()

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}

export function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchLocation, setSearchLocation] = useState('All Areas')

  const updateSearch = (query, location = 'All Areas') => {
    setSearchQuery(query)
    setSearchLocation(location)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setSearchLocation('All Areas')
  }

  const value = {
    searchQuery,
    searchResults,
    searchLoading,
    searchLocation,
    setSearchQuery,
    setSearchResults,
    setSearchLoading,
    setSearchLocation,
    updateSearch,
    clearSearch
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}