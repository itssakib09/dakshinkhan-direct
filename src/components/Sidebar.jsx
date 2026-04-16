import { useLocation as useRouterLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiHome, 
  HiViewGrid, 
  HiChartSquareBar, 
  HiShoppingBag,
  HiBriefcase,
  HiSearch,
  HiX
} from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'

function Sidebar({ isOpen, onClose }) {
  const location = useRouterLocation()
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const userRole = userProfile?.role || 'customer'
  const isLoggedIn = !!currentUser

  const getMenuItems = (role) => {
    if (role === 'business') {
      return [
        { path: '/', icon: HiHome, label: 'Home' },
        { path: '/business', icon: HiShoppingBag, label: 'Business' },
        { path: '/services', icon: HiBriefcase, label: 'Services' },
        { path: '/dashboard', icon: HiChartSquareBar, label: 'Dashboard' }
      ]
    }

    if (role === 'service') {
      return [
        { path: '/', icon: HiHome, label: 'Home' },
        { path: '/business', icon: HiShoppingBag, label: 'Business' },
        { path: '/services', icon: HiBriefcase, label: 'Services' },
        { path: '/dashboard', icon: HiChartSquareBar, label: 'Dashboard' }
      ]
    }

    return [
      { path: '/', icon: HiHome, label: 'Home' },
      { path: '/business', icon: HiShoppingBag, label: 'Business' },
      { path: '/services', icon: HiBriefcase, label: 'Services' },
      { path: '/search', icon: HiSearch, label: 'Search' }
    ]
  }

  const menuItems = getMenuItems(userRole)

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname.startsWith('/dashboard')
    }
    return location.pathname === path
  }

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  const displayName = userProfile?.displayName 
    ? userProfile.displayName.length > 20 
      ? userProfile.displayName.substring(0, 20) + '...'
      : userProfile.displayName
    : 'Guest'

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60] lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {(isOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              mass: 0.8
            }}
            className="fixed top-[73px] left-0 h-[calc(100vh-73px)] z-[70] w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-2xl border-r border-gray-200 dark:border-gray-800 lg:translate-x-0 lg:bg-white lg:dark:bg-gray-900"
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <HiViewGrid className="text-white" size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
                      Menu
                    </h2>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                      {displayName}
                    </p>
                  </div>
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

              <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {menuItems.map((item, index) => {
                  const Icon = item.icon
                  const active = isActive(item.path)

                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      onClick={() => handleNavigation(item.path)}
                      className="cursor-pointer relative"
                    >
                      <motion.div
                        whileHover={{ x: 6, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group ${
                          active
                            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800 dark:hover:to-gray-800/80'
                        }`}
                      >
                        {active && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full shadow-lg" />
                        )}

                        <motion.div
                          whileHover={!active ? { rotate: 5, scale: 1.1 } : {}}
                          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                            active
                              ? 'bg-white/20 backdrop-blur-sm shadow-inner'
                              : 'bg-primary-50 dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-gray-700'
                          }`}
                        >
                          <Icon
                            size={20}
                            className={
                              active 
                                ? 'text-white' 
                                : 'text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300'
                            }
                          />
                        </motion.div>

                        <span className={`font-semibold text-base ${active ? 'font-bold' : 'group-hover:text-gray-900 dark:group-hover:text-white'}`}>
                          {item.label}
                        </span>

                        {!active && (
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-primary-600/5 transition-all duration-300" />
                        )}
                      </motion.div>
                    </motion.div>
                  )
                })}
              </nav>

              <div className="p-6 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300 flex-shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-white font-bold text-sm">DD</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">Dakshinkhan Direct</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Version 1.0.0</p>
                  </div>
                </div>
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  © 2025 All Rights Reserved
                </p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar