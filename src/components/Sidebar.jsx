import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiHome, HiViewGrid, HiChartSquareBar, HiShieldCheck, HiX } from 'react-icons/hi'

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: HiHome, label: 'Home' },
    { path: '/categories', icon: HiViewGrid, label: 'Categories' },
    { path: '/dashboard', icon: HiChartSquareBar, label: 'Dashboard' },
    { path: '/admin', icon: HiShieldCheck, label: 'Admin' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Desktop Sidebar - No overlay needed */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full z-50 w-64 sm:w-72
          bg-white dark:bg-gray-900 shadow-2xl
          transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <HiViewGrid className="text-white" size={18} />
            </div>
            <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
              Menu
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <HiX size={20} className="text-gray-600 dark:text-gray-400" />
          </motion.button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 sm:p-4 space-y-1.5 sm:space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const active = isActive(item.path)

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className="block"
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 cursor-pointer
                    ${
                      active
                        ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <div
                    className={`
                      w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200
                      ${
                        active
                          ? 'bg-white/20 backdrop-blur-sm'
                          : 'bg-primary-50 dark:bg-gray-800'
                      }
                    `}
                  >
                    <Icon
                      size={18}
                      className={active ? 'text-white' : 'text-primary-600 dark:text-primary-400'}
                    />
                  </div>

                  <span className="font-semibold text-sm sm:text-base">
                    {item.label}
                  </span>

                  {active && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-3 sm:right-4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full shadow-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">DD</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white">Dakshinkhan Direct</p>
              <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">Version 1.0.0</p>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs text-center text-gray-400 dark:text-gray-500">
            © 2025 All Rights Reserved
          </p>
        </div>
      </aside>

      {/* Mobile Overlay - Only on mobile when sidebar is open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar