import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HiHome,
  HiShoppingBag,
  HiBriefcase,
  HiUser,
  HiSearch,
  HiChartSquareBar
} from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

function BottomNav() {
  const location = useLocation()
  const { currentUser, userProfile } = useAuth()
  const userRole = userProfile?.role || 'customer'
  const isLoggedIn = !!currentUser

  const getNavItems = (role, loggedIn) => {
    if (role === 'business') {
      return [
        { path: '/', icon: HiHome, label: 'Home', isCenter: false },
        { path: '/business', icon: HiShoppingBag, label: 'Business', isCenter: false },
        { path: '/dashboard', icon: HiChartSquareBar, label: 'Dashboard', isCenter: true },
        { path: '/services', icon: HiBriefcase, label: 'Services', isCenter: false },
        { path: '/dashboard', icon: HiUser, label: 'Account', isCenter: false }
      ]
    }

    if (role === 'service') {
      return [
        { path: '/', icon: HiHome, label: 'Home', isCenter: false },
        { path: '/business', icon: HiShoppingBag, label: 'Business', isCenter: false },
        { path: '/dashboard', icon: HiChartSquareBar, label: 'Dashboard', isCenter: true },
        { path: '/services', icon: HiBriefcase, label: 'Services', isCenter: false },
        { path: '/dashboard', icon: HiUser, label: 'Account', isCenter: false }
      ]
    }

    return [
      { path: '/', icon: HiHome, label: 'Home', isCenter: false },
      { path: '/business', icon: HiShoppingBag, label: 'Business', isCenter: false },
      { path: '/search', icon: HiSearch, label: 'Search', isCenter: true },
      { path: '/services', icon: HiBriefcase, label: 'Services', isCenter: false },
      loggedIn 
        ? { path: '/dashboard', icon: HiUser, label: 'Account', isCenter: false }
        : { path: '/login', icon: HiUser, label: 'Login', isCenter: false }
    ]
  }

  const navItems = getNavItems(userRole, isLoggedIn)

  const isActive = (item, index) => {
    if (item.path === '/dashboard') {
      if (item.isCenter) {
        return location.pathname.startsWith('/dashboard')
      }
      return false
    }
    return location.pathname === item.path
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-gray-900 border-t-2 border-gray-100 dark:border-gray-800 shadow-[0_-8px_24px_rgba(0,0,0,0.10)]">
      <div className="flex items-center justify-around px-3 pt-2 pb-[env(safe-area-inset-bottom,10px)]">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const active = isActive(item, index)

          if (item.isCenter) {
            return (
              <Link key={index} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="relative -mt-6 flex flex-col items-center min-w-[64px]"
                >
                  <div className={`w-[56px] h-[56px] rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center border-[3px] border-white dark:border-gray-900 transition-all duration-200 ${
                    active ? 'shadow-lg shadow-primary-500/50 ring-2 ring-primary-300 dark:ring-primary-600' : 'shadow-md shadow-primary-500/30'
                  }`}>
                    <Icon size={26} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400 mt-1">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            )
          }

          return (
            <Link key={index} to={item.path}>
              <motion.div
                whileTap={{ scale: 0.92 }}
                className="flex flex-col items-center gap-0.5 px-2 min-w-[56px]"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  active 
                    ? 'bg-primary-50 dark:bg-primary-900/30' 
                    : 'bg-transparent'
                }`}>
                  <Icon 
                    size={20} 
                    className={
                      active 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }
                  />
                </div>
                <span className={`text-[10px] ${
                  active 
                    ? 'font-bold text-primary-600 dark:text-primary-400' 
                    : 'font-medium text-gray-400 dark:text-gray-500'
                }`}>
                  {item.label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav