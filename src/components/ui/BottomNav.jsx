// src/components/layout/BottomNav.jsx
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  House,
  Storefront,
  ChartBarHorizontal,
  Wrench,
  UserCircle,
  MagnifyingGlass
} from '@phosphor-icons/react'
import { useAuth } from '../../context/AuthContext'

function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { currentUser, userProfile } = useAuth()
  const userRole = userProfile?.role || 'customer'
  const isLoggedIn = !!currentUser
  const isBusiness = userRole === 'business'
  const isService = userRole === 'service'

  const navItems = [
    {
      id: 'home',
      labelKey: 'nav.home',
      Icon: House,
      path: '/',
      isCenter: false,
    },
    {
      id: 'business',
      labelKey: 'nav.business',
      Icon: Storefront,
      path: '/business',
      isCenter: false,
    },
    {
      id: 'center',
      labelKey: isBusiness || isService ? 'nav.dashboard' : 'nav.search',
      Icon: isBusiness || isService ? ChartBarHorizontal : MagnifyingGlass,
      path: isBusiness || isService ? '/dashboard' : '/search',
      isCenter: true,
    },
    {
      id: 'services',
      labelKey: 'nav.services',
      Icon: Wrench,
      path: '/services',
      isCenter: false,
    },
    {
      id: 'account',
      labelKey: isLoggedIn ? 'nav.account' : 'nav.account',
      Icon: UserCircle,
      path: isLoggedIn ? '/dashboard' : '/login',
      isCenter: false,
    },
  ]

  const checkActive = (item) => {
    if (item.isCenter) {
      return item.path === '/dashboard'
        ? location.pathname.startsWith('/dashboard')
        : location.pathname === item.path
    }
    if (item.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(item.path)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-gray-100/80 dark:border-gray-800/80"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="dark:bg-gray-900/92">
        <div className="flex items-center h-16 px-2">
          {navItems.map((item) => {
            const active = checkActive(item)

            if (item.isCenter) {
              return (
                <button
                  key={item.id}
                  onClick={(e) => {
                    e.preventDefault()
                    navigate(item.path, { state: { ts: Date.now() } })
                  }}
                  className="flex flex-col items-center justify-center flex-1 h-full gap-1 relative"
                >
                  <motion.div
                    whileTap={{ scale: 0.92 }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-colors ${
                      active
                        ? 'bg-primary-600 shadow-primary-200 dark:shadow-primary-900'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <item.Icon
                      size={22}
                      weight="duotone"
                      className={active ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                    />
                  </motion.div>
                  <span className={`text-[10px] font-medium transition-colors ${
                    active
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {t(item.labelKey)}
                  </span>
                </button>
              )
            }

            return (
              <button
                key={item.id}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(item.path, { state: { ts: Date.now() } })
                }}
                className="relative flex flex-col items-center justify-center flex-1 h-full gap-1 active:opacity-70 transition-opacity"
              >
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 dark:bg-primary-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <item.Icon
                  size={22}
                  weight={active ? 'fill' : 'regular'}
                  className={active
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500'
                  }
                />
                <span className={`text-[10px] font-medium transition-colors ${
                  active
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {t(item.labelKey)}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default BottomNav