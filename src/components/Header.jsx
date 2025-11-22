import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiBell, HiLogout, HiUser, HiSun, HiMoon, HiMenu } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function Header({ onMenuClick }) {
  const { currentUser, userProfile, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  async function handleLogout() {
    try {
      await logout()
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
      alert('Failed to logout. Please try again.')
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-900 backdrop-blur-xl shadow-lg sticky top-0 z-[100] border-b border-gray-200 dark:border-gray-800 transition-colors duration-300"
    >
      <div className="w-full max-w-full mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left Side - Menu Button (Tablet only) + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Menu Button - Show ONLY on tablet (768px-1023px) - ALL PAGES */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuClick}
              className="hidden md:flex lg:hidden w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 items-center justify-center transition-colors"
            >
              <HiMenu size={20} className="text-gray-700 dark:text-gray-300" />
            </motion.button>

            {/* Logo */}
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
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  Dakshinkhan
                </h1>
                <p className="text-[10px] sm:text-xs font-medium text-primary-600/70 tracking-wider">DIRECT</p>
              </div>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Desktop Auth */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-2 md:gap-3">
                <Link to="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 hover:from-primary-100 hover:to-primary-200 dark:hover:from-gray-700 dark:hover:to-gray-600 rounded-xl transition-all duration-300 border border-primary-200/50 dark:border-gray-600"
                  >
                    {userProfile?.photoURL ? (
                      <img 
                        src={userProfile.photoURL} 
                        alt={userProfile.displayName}
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full ring-2 ring-primary-400/30 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <HiUser size={16} className="text-white" />
                      </div>
                    )}
                    <span className="text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 truncate max-w-[80px] md:max-w-[120px]">
                      {userProfile?.displayName || 'Profile'}
                    </span>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 md:p-2.5 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition-colors duration-300 group"
                  title="Logout"
                >
                  <HiLogout size={18} className="text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform" />
                </motion.button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-700 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-800 rounded-xl transition-all duration-300"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(34, 197, 94, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    className="px-3 md:px-4 py-2 md:py-2.5 text-xs md:text-sm font-bold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-300"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 shadow-md group"
              >
                <AnimatePresence mode="wait">
                  {theme === 'dark' ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HiMoon size={18} className="text-primary-500 group-hover:scale-110 transition-transform" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <HiSun size={18} className="text-amber-500 group-hover:scale-110 transition-transform" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Notification Bell */}
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
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header