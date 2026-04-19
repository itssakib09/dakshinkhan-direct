import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HiArrowLeft, 
  HiPhone, 
  HiLocationMarker, 
  HiClock, 
  HiShoppingBag,
  HiStar,
  HiCheckCircle,
  HiXCircle,
  HiFilter,
  HiX
} from 'react-icons/hi'
import { getBusinessById, isBusinessOpen } from '../services/businessService'
import { getStoreListings } from '../services/listingService'
import { WEEK_DAYS, DAY_LABELS } from '../data/storeHours'

function Store() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [business, setBusiness] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showInStock, setShowInStock] = useState(false)
  
  // Categories (derived from listings)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    loadStoreData()
  }, [id])

  const loadStoreData = async () => {
    try {
      setLoading(true)
      
      // Load business info
      const businessData = await getBusinessById(id)
      if (!businessData) {
        setError('Store not found')
        return
      }
      setBusiness(businessData)

      // Load listings
      const listingsData = await getStoreListings(id)
      setListings(listingsData)

      // Extract unique categories
      const uniqueCategories = [...new Set(
        listingsData
          .map(listing => listing.category)
          .filter(Boolean)
      )]
      setCategories(uniqueCategories)
      
    } catch (err) {
      console.error('Error loading store:', err)
      setError('Failed to load store')
    } finally {
      setLoading(false)
    }
  }

  const handleContactClick = () => {
    if (business?.storeSettings?.storePhone) {
      window.location.href = `tel:${business.storeSettings.storePhone}`
    }
  }

  const handleClearFilters = () => {
    setSelectedCategory('')
    setPriceRange({ min: '', max: '' })
    setShowInStock(false)
  }

  // Filter listings
  const filteredListings = listings.filter(listing => {
    // Category filter
    if (selectedCategory && listing.category !== selectedCategory) {
      return false
    }

    // Price filter
    if (priceRange.min && listing.price < parseFloat(priceRange.min)) {
      return false
    }
    if (priceRange.max && listing.price > parseFloat(priceRange.max)) {
      return false
    }

    // Stock filter
    if (showInStock && listing.status !== 'active') {
      return false
    }

    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 md:pb-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 md:pb-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiXCircle size={40} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || 'Store Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The store you're looking for doesn't exist or is not active.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/business')}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all"
            >
              Browse Businesses
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  const storeSettings = business.storeSettings || {}
  const isOpen = isBusinessOpen(storeSettings.openingHours)
  const serviceAreasDisplay = storeSettings.serviceAreas?.join(', ') || 'Dakshinkhan'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 md:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/business')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold mb-6 transition-colors"
        >
          <HiArrowLeft size={20} />
          Back to Businesses
        </motion.button>

        {/* Store Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden mb-6"
        >
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center relative">
            <HiShoppingBag size={60} className="text-white opacity-30" />
            
            {/* Open/Closed Badge */}
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold shadow-lg ${
                isOpen 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {isOpen ? (
                  <>
                    <HiCheckCircle size={18} />
                    Open Now
                  </>
                ) : (
                  <>
                    <HiXCircle size={18} />
                    Closed
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Store Info */}
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                  {storeSettings.storeName || business.displayName || 'Store'}
                </h1>
                <p className="text-lg text-primary-600 dark:text-primary-400 font-bold mb-3">
                  {storeSettings.businessType || 'Store'}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <HiLocationMarker size={16} />
                    <span>{serviceAreasDisplay}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiStar size={16} className="text-yellow-500" />
                    <span>New Store</span>
                  </div>
                </div>
              </div>

              {/* Contact Button */}
              {storeSettings.storePhone && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContactClick}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <HiPhone size={20} />
                  Call Store
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Store Info Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* Opening Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
          >
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <HiClock size={24} className="text-primary-600 dark:text-primary-400" />
              Opening Hours
            </h2>
            <div className="space-y-2">
              {WEEK_DAYS.map(day => {
                const hours = storeSettings.openingHours?.[day]
                const isClosed = hours?.closed
                
                return (
                  <div
                    key={day}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white capitalize">
                      {DAY_LABELS[day]}
                    </span>
                    {isClosed ? (
                      <span className="text-red-600 dark:text-red-400 font-semibold">
                        Closed
                      </span>
                    ) : (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        {hours?.open} - {hours?.close}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </motion.div>

          {/* Contact & Service Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
          >
            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">
              Contact & Service Areas
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {storeSettings.storePhone && (
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <HiPhone size={18} className="text-primary-600 dark:text-primary-400" />
                      <a href={`tel:${storeSettings.storePhone}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                        {storeSettings.storePhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">We Serve</h3>
                <div className="flex flex-wrap gap-2">
                  {storeSettings.serviceAreas?.map((area, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-lg text-sm font-semibold"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Products Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            Products ({filteredListings.length})
          </h2>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-semibold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            <HiFilter size={18} />
            Filters
          </motion.button>
        </div>

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

            <div className="grid md:grid-cols-3 gap-6">
              {/* Category Filter */}
              {categories.length > 0 && (
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
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    placeholder="Min"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    placeholder="Max"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Availability
                </label>
                <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showInStock}
                    onChange={(e) => setShowInStock(e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  />
                  <span className="font-semibold text-gray-900 dark:text-white">In Stock Only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Filters */}
        {(selectedCategory || priceRange.min || priceRange.max || showInStock) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex flex-wrap gap-2"
          >
            {selectedCategory && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-semibold">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')}>
                  <HiX size={16} />
                </button>
              </span>
            )}
            {(priceRange.min || priceRange.max) && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-semibold">
                ৳{priceRange.min || '0'} - ৳{priceRange.max || '∞'}
                <button onClick={() => setPriceRange({ min: '', max: '' })}>
                  <HiX size={16} />
                </button>
              </span>
            )}
            {showInStock && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-semibold">
                In Stock
                <button onClick={() => setShowInStock(false)}>
                  <HiX size={16} />
                </button>
              </span>
            )}
          </motion.div>
        )}

        {/* Products Grid */}
        {filteredListings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
          >
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiShoppingBag size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {listings.length === 0 
                ? 'This store has no products yet.'
                : 'Try adjusting your filters.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer group"
              >
                {/* Product Image */}
                <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-700">
                  {listing.images && listing.images[0] ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiShoppingBag size={40} className="text-gray-400" />
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${
                      listing.status === 'active'
                        ? 'bg-green-500/90 text-white'
                        : 'bg-gray-500/90 text-white'
                    }`}>
                      {listing.status === 'active' ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Master Catalog Badge */}
                  {listing.catalogProductId && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-blue-500/90 text-white rounded-lg text-xs font-bold backdrop-blur-sm">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {listing.title}
                  </h3>
                  
                  {listing.category && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 capitalize">
                      {listing.category}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                      ৳{listing.price}
                    </span>
                    {listing.unit && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        per {listing.unit}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Store