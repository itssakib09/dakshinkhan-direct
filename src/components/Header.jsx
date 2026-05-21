// src/components/Header.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiBell, HiUser, HiMenu, HiLocationMarker } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useAppLocation } from '../context/LocationContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Header({ onMenuClick }) {
  const { currentUser, userProfile } = useAuth()
  const { selectedLocation } = useAppLocation()
  const navigate = useNavigate()
  const { i18n, t } = useTranslation()
  const currentLang = i18n.language?.startsWith('bn') ? 'bn' : 'en'
  const toggleLang = () => {
    const newLang = currentLang === 'bn' ? 'en' : 'bn'
    i18n.changeLanguage(newLang)
    localStorage.setItem('i18nextLng', newLang)
  }

  const firstInitial = (userProfile?.displayName || 'U')[0].toUpperCase()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-900 backdrop-blur-xl shadow-lg sticky top-0 z-[100] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300"
    >
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="hidden md:flex lg:hidden w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 items-center justify-center transition-colors"
            >
              <HiMenu size={20} className="text-gray-700 dark:text-gray-300" />
            </motion.button>

            <Link to="/" className="flex items-center space-x-2 sm:space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 flex-shrink-0"
              >
                <svg className="w-5 h-5 sm:w-5 sm:h-5 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Dakshinkhan
                </h1>
                <p className="text-[10px] sm:text-xs font-medium text-primary-600/70 tracking-wider">DIRECT</p>
              </div>
            </Link>
          </div>

          <button
            onClick={() => navigate('/locations')}
            className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded-xl transition-colors flex-1 max-w-[180px] mx-2 lg:mx-4"
          >
            <HiLocationMarker size={14} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
              {selectedLocation || t('header.location_label')}
            </span>
          </button>

          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLang}
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 shadow-md"
            >
              <span className="text-xs font-black text-gray-700 dark:text-gray-300">
                {currentLang === 'bn' ? 'EN' : 'বাং'}
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, rotate: 10 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 hover:from-primary-100 hover:to-primary-200 dark:hover:from-gray-700 dark:hover:to-gray-600 flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg group"
            >
              <HiBell size={18} className="text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-red-500 to-rose-500 text-white text-[10px] sm:text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                3
              </span>
            </motion.button>

            <div className="hidden lg:flex items-center gap-2">
              {currentUser ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                  className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-200 dark:ring-primary-900 flex-shrink-0"
                >
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt={userProfile?.displayName || ''}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{firstInitial}</span>
                    </div>
                  )}
                </motion.button>
              ) : (
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-xl transition-colors shadow-md shadow-primary-600/20"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header