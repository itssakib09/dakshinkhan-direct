import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiSearch, HiFilter, HiX, HiShoppingBag, HiLocationMarker, HiStar, HiClock } from 'react-icons/hi'
import { getBusinesses, isBusinessOpen } from '../services/businessService'
import { useLocation } from '../context/LocationContext'
import { BUSINESS_TYPES } from '../data/businessTypes'
import { LOCATIONS, ALL_AREAS_LABEL } from '../data/locations'

function Business() {
  const navigate = useNavigate()
  const { selectedLocation } = useLocation()
  
  const [businesses, setBusinesses] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocationFilter, setSelectedLocationFilter] = useState(selectedLocation)
  const [showFilters, setShowFilters] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [lastDoc, setLastDoc] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    loadBusinesses()
  }, [selectedCategory, selectedLocationFilter])

  useEffect(() => {
    setSelectedLocationFilter(selectedLocation)
  }, [selectedLocation])

  const loadBusinesses = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setBusinesses([])
        setLastDoc(null)
      }

      const filters = {
        search: searchTerm,
        category: selectedCategory,
        location: selectedLocationFilter,
        lastDoc: loadMore ? lastDoc : null
      }

      const result = await getBusinesses(filters)
      
      if (loadMore) {
        setBusinesses(prev => [...prev, ...result.businesses])
      } else {
        setBusinesses(result.businesses)
      }
      
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Error loading businesses:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadBusinesses()
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedLocationFilter('ALL Areas')
  }

  const handleBusinessClick = (businessId) => {
    navigate(`/store/${businessId}`)
  }

  const getBusinessRating = (business) => {
    // Placeholder - implement when reviews are added
    return 0
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Discover Businesses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find local businesses in Dakshinkhan
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search businesses..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <HiFilter size={20} />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg transition-all"
            >
              Search
            </motion.button>
          </form>
        </motion.div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                Clear All
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
                >
                  <option value="">All Categories</option>
                  {BUSINESS_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <select
                  value={selectedLocationFilter}
                  onChange={(e) => setSelectedLocationFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
                >
                  <option value="ALL Areas">{ALL_AREAS_LABEL}</option>
                  {LOCATIONS.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => loadBusinesses()}
                className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 rounded-xl font-bold shadow-lg transition-all"
              >
                Apply Filters
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Active Filters Display */}
        {(selectedCategory || selectedLocationFilter !== 'ALL Areas' || searchTerm) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {searchTerm && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-semibold">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')}>
                  <HiX size={16} />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-semibold">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')}>
                  <HiX size={16} />
                </button>
              </span>
            )}
            {selectedLocationFilter !== 'ALL Areas' && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-semibold">
                {selectedLocationFilter}
                <button onClick={() => setSelectedLocationFilter('ALL Areas')}>
                  <HiX size={16} />
                </button>
              </span>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 animate-pulse">
                <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : businesses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiShoppingBag size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No businesses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters or search terms
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClearFilters}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all"
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Business Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {businesses.map((business, index) => {
                const storeSettings = business.storeSettings || {}
                const isOpen = isBusinessOpen(storeSettings.openingHours)
                const rating = getBusinessRating(business)
                const serviceArea = storeSettings.serviceAreas?.includes('ALL') 
                  ? 'All Areas' 
                  : storeSettings.serviceAreas?.[0] || 'Dakshinkhan'

                return (
                  <motion.div
                    key={business.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => handleBusinessClick(business.id)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer group"
                  >
                    {/* Business Logo/Image */}
                    <div className="relative w-full h-32 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      {business.photoURL ? (
                        <img 
                          src={business.photoURL} 
                          alt={storeSettings.storeName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <HiShoppingBag size={40} className="text-white opacity-50" />
                      )}
                      
                      {/* Open/Closed Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${
                          isOpen 
                            ? 'bg-green-500/90 text-white' 
                            : 'bg-gray-500/90 text-white'
                        }`}>
                          {isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>

                    {/* Business Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {storeSettings.storeName || 'Business'}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        {storeSettings.businessType || 'Store'}
                      </p>

                      <div className="flex items-center gap-1 mb-2">
                        <HiLocationMarker size={14} className="text-gray-400" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {serviceArea}
                        </span>
                      </div>

                      {rating > 0 && (
                        <div className="flex items-center gap-1">
                          <HiStar size={14} className="text-yellow-500" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadBusinesses(true)}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-xl font-bold hover:bg-primary-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Business