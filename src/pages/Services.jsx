// src/pages/Services.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiSearch, HiFilter, HiX, HiBriefcase, HiLocationMarker,
  HiViewGrid, HiArrowLeft, HiSun, HiCog, HiLightningBolt,
  HiHome, HiSparkles, HiPhone, HiShieldCheck, HiCamera,
  HiDesktopComputer, HiColorSwatch, HiWifi, HiTruck
} from 'react-icons/hi'
import { getServiceProviders, isProviderAvailable } from '../services/serviceProviderService'
import { useAppLocation } from '../context/LocationContext'
import { SERVICE_CATEGORIES } from '../data/serviceTypes'
import { LOCATIONS, ALL_AREAS_LABEL } from '../data/locations'

const CATEGORY_CONFIG = {
  'AC Servicing':          { color: 'from-blue-500 to-blue-700',     icon: HiSun },
  'AC Installation':       { color: 'from-blue-400 to-blue-600',     icon: HiSun },
  'AC Repair':             { color: 'from-cyan-500 to-cyan-700',     icon: HiCog },
  'Gas Refill':            { color: 'from-orange-500 to-orange-700', icon: HiCog },
  'Electrician':           { color: 'from-yellow-500 to-yellow-700', icon: HiLightningBolt },
  'Plumbing':              { color: 'from-cyan-600 to-cyan-800',     icon: HiHome },
  'Painting':              { color: 'from-orange-400 to-orange-600', icon: HiColorSwatch },
  'Carpentry':             { color: 'from-amber-600 to-amber-800',   icon: HiCog },
  'Cleaning Services':     { color: 'from-green-500 to-green-700',   icon: HiSparkles },
  'Pest Control':          { color: 'from-red-400 to-red-600',       icon: HiShieldCheck },
  'Home Appliance Repair': { color: 'from-purple-500 to-purple-700', icon: HiCog },
  'Mobile Repair':         { color: 'from-purple-600 to-purple-800', icon: HiPhone },
  'Computer Repair':       { color: 'from-indigo-500 to-indigo-700', icon: HiDesktopComputer },
  'CCTV Installation':     { color: 'from-gray-600 to-gray-800',     icon: HiCamera },
  'Dish/Cable Setup':      { color: 'from-blue-600 to-blue-800',     icon: HiWifi },
  'Generator Repair':      { color: 'from-yellow-600 to-yellow-800', icon: HiLightningBolt },
  'Welding':               { color: 'from-orange-600 to-orange-800', icon: HiCog },
  'Aluminum Work':         { color: 'from-gray-500 to-gray-700',     icon: HiCog },
  'Roofing':               { color: 'from-amber-500 to-amber-700',   icon: HiHome },
  'Tiles Work':            { color: 'from-teal-500 to-teal-700',     icon: HiViewGrid },
  'False Ceiling':         { color: 'from-indigo-400 to-indigo-600', icon: HiHome },
  'Interior Design':       { color: 'from-pink-500 to-pink-700',     icon: HiSparkles },
  'Shifting/Moving':       { color: 'from-green-600 to-green-800',   icon: HiTruck },
  'Driver Services':       { color: 'from-blue-500 to-blue-700',     icon: HiTruck },
  'Security Guard':        { color: 'from-red-600 to-red-800',       icon: HiShieldCheck },
  'Other':                 { color: 'from-gray-400 to-gray-600',     icon: HiCog },
}

function Services() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedLocation } = useAppLocation()
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const mainParam = searchParams.get('main')

  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocationFilter, setSelectedLocationFilter] = useState(selectedLocation)
  const [showFilters, setShowFilters] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [lastDoc, setLastDoc] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showCategories, setShowCategories] = useState(!categoryParam)
  const [showSubcategories, setShowSubcategories] = useState(false)
  const [selectedMainCategory, setSelectedMainCategory] = useState(null)

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
      setShowCategories(false)
      setShowSubcategories(false)

      const parent = SERVICE_CATEGORIES.find(c =>
        c.subcategories.includes(categoryParam)
      )
      if (parent) setSelectedMainCategory(parent)

    } else if (mainParam) {
      const found = SERVICE_CATEGORIES.find(c => c.id === mainParam)
      if (found) {
        setSelectedMainCategory(found)
        setShowCategories(false)
        setShowSubcategories(true)
      }
    }
  }, [categoryParam, mainParam])

  useEffect(() => {
    if (!showCategories) {
      loadProviders()
    }
  }, [selectedCategory, selectedLocationFilter, showCategories])

  useEffect(() => {
    setSelectedLocationFilter(selectedLocation)
  }, [selectedLocation])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hasCategory = params.get('category')
    const hasMain = params.get('main')
    if (!hasCategory && !hasMain) {
      setShowCategories(true)
      setShowSubcategories(false)
      setSelectedMainCategory(null)
      setSelectedCategory('')
    }
  }, [location.state?.ts, location.pathname])

  const loadProviders = async (loadMore = false) => {
    try {
      setError(null)

      if (loadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setProviders([])
        setLastDoc(null)
      }

      const filters = {
        search: searchTerm,
        category: selectedCategory,
        location: selectedLocationFilter,
        lastDoc: loadMore ? lastDoc : null
      }

      const result = await getServiceProviders(filters)

      if (loadMore) {
        setProviders(prev => [...prev, ...result.providers])
      } else {
        setProviders(result.providers)
      }

      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Error loading service providers:', error)
      setError('Failed to load service providers. Please check your connection.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    loadProviders()
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedLocationFilter('ALL Areas')
    setTimeout(() => loadProviders(), 0)
  }

  const handleProviderClick = (providerId) => {
    navigate(`/service-provider/${providerId}`)
  }

  const handleMainCategorySelect = (category) => {
    setSelectedMainCategory(category)
    setShowSubcategories(true)
    setShowCategories(false)
  }

  const handleSubcategorySelect = (subcategory) => {
    setSelectedCategory(subcategory)
    setShowSubcategories(false)
  }

  const handleBackToCategories = () => {
    setShowSubcategories(false)
    setShowCategories(true)
    setSelectedMainCategory(null)
    setSelectedCategory('')
  }

  const handleBackToSubcategories = () => {
    setShowSubcategories(true)
    setShowCategories(false)
  }

  if (showCategories) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 md:pb-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              Find Services
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a category to browse
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowCategories(false)}
            className="w-full mb-6 px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <HiViewGrid size={24} />
            All Services
          </motion.button>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SERVICE_CATEGORIES.map((category, index) => {
              const config = CATEGORY_CONFIG[category.label] || CATEGORY_CONFIG['Other']
              const IconComponent = config.icon
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMainCategorySelect(category)}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-3 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-all group"
                >
                  <div className={`w-11 h-11 bg-gradient-to-br ${config.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md group-hover:scale-110 transition-transform`}>
                    <IconComponent size={20} className="text-white" />
                  </div>
                  <p className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2 leading-tight">
                    {category.label}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // STEP 2: Subcategory grid
  if (showSubcategories && selectedMainCategory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 md:pb-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBackToCategories}
            className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm mb-4 hover:gap-3 transition-all"
          >
            <HiArrowLeft size={18} />
            All Categories
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {selectedMainCategory.label}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a subcategory
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {selectedMainCategory.subcategories.map((subcategory, index) => {
              const config = CATEGORY_CONFIG[subcategory] || CATEGORY_CONFIG['Other']
              const IconComponent = config.icon
              return (
                <motion.button
                  key={subcategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-all group"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center mx-auto mb-2 shadow-md group-hover:scale-105 transition-transform`}>
                    <IconComponent size={18} className="text-white" />
                  </div>
                  <p className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2 leading-tight">
                    {subcategory}
                  </p>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 md:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          {selectedCategory && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBackToSubcategories}
              className="flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold text-sm mb-4 hover:gap-3 transition-all"
            >
              <HiArrowLeft size={18} />
              Sub Categories
            </motion.button>
          )}
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Find Service Providers
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with skilled professionals in Dakshinkhan
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
                placeholder="Search service providers..."
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
              {/* Service Category Filter */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Service Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all"
                >
                  <option value="">All Services</option>
                  {SERVICE_CATEGORIES.map(cat => (
                    <optgroup key={cat.id} label={cat.label}>
                      {cat.subcategories.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </optgroup>
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

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowFilters(false)
                  loadProviders()
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg transition-all"
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
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm('')}>
                  <HiX size={14} />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold">
                {selectedCategory}
                <button onClick={() => setSelectedCategory('')}>
                  <HiX size={14} />
                </button>
              </span>
            )}
            {selectedLocationFilter !== 'ALL Areas' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold">
                {selectedLocationFilter}
                <button onClick={() => setSelectedLocationFilter('ALL Areas')}>
                  <HiX size={14} />
                </button>
              </span>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 dark:text-red-400 font-semibold mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => loadProviders()}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all"
            >
              Try Again
            </motion.button>
          </div>
        ) : providers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiBriefcase size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No service providers found
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
            {/* Service Provider Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {providers.map((provider, index) => {
                const serviceProfile = provider.serviceProfile || {}
                const isAvailable = isProviderAvailable(serviceProfile.availability)
                const serviceArea = serviceProfile.coverageAreas?.includes('ALL')
                  ? 'All Areas'
                  : serviceProfile.coverageAreas?.[0] || 'Dakshinkhan'
                const extraServices = serviceProfile.servicesOffered
                  ? serviceProfile.servicesOffered.length - 1
                  : 0

                return (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    onClick={() => handleProviderClick(provider.id)}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer group transition-shadow"
                  >
                    {/* Profile Photo / Avatar */}
                    <div className="relative w-full h-40">
                      {serviceProfile.profilePhoto || provider.photoURL ? (
                        <img
                          src={serviceProfile.profilePhoto || provider.photoURL}
                          alt={provider.displayName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-4xl font-black text-white">
                              {provider.displayName?.[0]?.toUpperCase() || 'S'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Availability Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg ${
                          isAvailable
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-800/80 text-gray-300'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isAvailable ? 'bg-white animate-pulse' : 'bg-gray-400'
                          }`}></span>
                          {isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </div>

                    {/* Provider Info */}
                    <div className="p-3">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-0.5 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {provider.displayName || 'Service Provider'}
                      </h3>

                      <p className="text-xs text-primary-600 dark:text-primary-400 mb-2 line-clamp-1 font-medium">
                        {serviceProfile.profession || serviceProfile.servicesOffered?.[0] || 'Service Provider'}
                      </p>

                      <div className="flex items-center gap-1 mb-1">
                        <HiLocationMarker size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                          {serviceArea}
                        </span>
                      </div>

                      {extraServices > 0 && (
                        <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mt-1">
                          +{extraServices} more services
                        </p>
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
                  onClick={() => loadProviders(true)}
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

export default Services