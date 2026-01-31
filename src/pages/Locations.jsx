import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiLocationMarker, HiCheckCircle, HiSearch, HiX, HiGlobe } from 'react-icons/hi'
import { useLocation } from '../context/LocationContext'
import { LOCATIONS } from '../data/locations'

function Locations() {
  const navigate = useNavigate()
  const { saveLocation, previousPage } = useLocation()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredLocations = LOCATIONS.filter(location =>
    location.toLowerCase().includes(searchQuery.toLowerCase().trim())
  )

  const handleLocationSelect = (location) => {
    saveLocation(location)
    navigate(previousPage || '/')
  }

  const handleBrowseAllAreas = () => {
    saveLocation('ALL Areas')
    navigate('/')
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent mb-2">
            Select Your Location
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Choose your area to discover local businesses and services
          </p>
        </motion.div>

        {/* Browse All Areas Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleBrowseAllAreas}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl sm:rounded-2xl py-4 sm:py-5 px-4 sm:px-6 flex items-center justify-between shadow-xl mb-6 sm:mb-8 transition-all"
        >
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <HiGlobe className="text-white" size={24} />
            </div>
            <div className="text-left">
              <p className="text-xs sm:text-sm text-primary-100 font-semibold uppercase">
                Quick Access
              </p>
              <p className="text-sm sm:text-base md:text-lg font-bold">
                Browse All Areas
              </p>
            </div>
          </div>
          <HiCheckCircle className="text-white flex-shrink-0" size={24} />
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
          <span className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase">
            Or Select Area
          </span>
          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 sm:mb-8"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
              <HiSearch className="text-gray-400 dark:text-gray-500" size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for your area..."
              className="w-full pl-12 sm:pl-14 pr-12 sm:pr-14 py-3 sm:py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-primary-500 dark:focus:border-primary-600 rounded-xl sm:rounded-2xl text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all shadow-md"
            />
            {searchQuery && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-4 sm:pr-5 flex items-center"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors">
                  <HiX className="text-gray-600 dark:text-gray-300" size={16} />
                </div>
              </motion.button>
            )}
          </div>
          {searchQuery && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1"
            >
              {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
            </motion.p>
          )}
        </motion.div>

        {/* Location Grid */}
        <AnimatePresence mode="wait">
          {filteredLocations.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
            >
              {filteredLocations.map((location, index) => (
                <motion.button
                  key={location}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleLocationSelect(location)}
                  className="bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 shadow-md hover:shadow-xl group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
                    <HiLocationMarker className="text-white" size={20} />
                  </div>
                  <p className="text-sm sm:text-base font-bold text-gray-800 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                    {location}
                  </p>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-12 sm:py-16"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 sm:mb-6"
              >
                <HiSearch className="text-gray-400 dark:text-gray-600" size={40} />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-2"
              >
                No Locations Found
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-sm sm:text-base text-gray-500 dark:text-gray-400 text-center max-w-md"
              >
                We couldn't find any locations matching "<span className="font-semibold text-primary-600 dark:text-primary-400">{searchQuery}</span>". Try a different search term.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Locations