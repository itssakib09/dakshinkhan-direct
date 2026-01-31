import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiSearch, HiX, HiLocationMarker, HiFilter } from 'react-icons/hi'
import { useSearch } from '../context/SearchContext'
import { useLocation } from '../context/LocationContext'
import { searchAll } from '../services/searchService'

function Search() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { searchQuery, setSearchQuery, searchResults, setSearchResults, searchLoading, setSearchLoading } = useSearch()
  const { selectedLocation } = useLocation()
  const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setLocalQuery(q)
      setSearchQuery(q)
      performSearch(q)
    }
  }, [searchParams])

  const performSearch = async (query) => {
    if (!query.trim()) return

    setSearchLoading(true)
    try {
      const results = await searchAll(query, selectedLocation)
      setSearchResults(results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (localQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(localQuery)}`)
    }
  }

  const clearSearch = () => {
    setLocalQuery('')
    setSearchQuery('')
    setSearchResults([])
  }

  const filteredResults = filterType === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === filterType)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 dark:text-white mb-2">
            Search Results
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Searching in {selectedLocation || 'All Areas'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative flex items-center ring-2 ring-primary-500 dark:ring-primary-400 rounded-xl bg-white dark:bg-gray-800">
              <HiSearch size={20} className="absolute left-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder={`Search in ${selectedLocation || 'All Areas'}...`}
                className="w-full pl-12 pr-24 py-4 bg-transparent text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none"
                autoFocus
              />
              {localQuery && (
                <>
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-20 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <HiX size={18} className="text-gray-400" />
                  </button>
                  <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 text-sm font-semibold bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
                  >
                    Search
                  </button>
                </>
              )}
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {['all', 'business', 'service', 'store'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                  filterType === type
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
                {type === 'all' && searchResults.length > 0 && ` (${searchResults.length})`}
              </button>
            ))}
          </div>
        </motion.div>

        {searchLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredResults.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/store/${result.id}`)}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      {result.name || result.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {result.category}
                    </p>
                  </div>
                  <span className="px-2 py-1 text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg">
                    {result.type}
                  </span>
                </div>
                {result.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {result.description}
                  </p>
                )}
                {result.location && (
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <HiLocationMarker size={14} className="mr-1" />
                    {result.location}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : searchQuery ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <HiSearch className="text-gray-400 dark:text-gray-600" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              No Results Found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              We couldn't find anything matching "{searchQuery}" in {selectedLocation || 'All Areas'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <HiSearch className="text-gray-400 dark:text-gray-600" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Start Searching
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              Enter keywords to find businesses, services, and stores
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Search