import { Link, useLocation } from 'react-router-dom'
import { 
  HiHome,
  HiViewGrid,
  HiUser,
  HiShoppingBag,
  HiCog,
  HiChartSquareBar
} from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'

function BottomNav() {
  const location = useLocation()
  const { userProfile } = useAuth()
  const userRole = userProfile?.role || 'customer'

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 shadow-2xl z-50 md:hidden">
      <div className="flex items-center justify-around py-2.5 px-2 safe-area-inset-bottom">
        {userRole === 'business' ? (
          <>
            <Link to="/" className={`flex flex-col items-center space-y-1 ${isActive('/') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiHome size={20} className={isActive('/') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/') ? 'font-bold' : ''}`}>Home</span>
            </Link>
            <Link to="/dashboard" className={`flex flex-col items-center space-y-1 ${isActive('/dashboard') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/dashboard') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiChartSquareBar size={20} className={isActive('/dashboard') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/dashboard') ? 'font-bold' : ''}`}>Dashboard</span>
            </Link>
            <Link to="/store" className={`flex flex-col items-center space-y-1 ${isActive('/store') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/store') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiShoppingBag size={20} className={isActive('/store') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/store') ? 'font-bold' : ''}`}>Store</span>
            </Link>
            <Link to="/settings" className={`flex flex-col items-center space-y-1 ${isActive('/settings') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/settings') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiCog size={20} className={isActive('/settings') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/settings') ? 'font-bold' : ''}`}>Settings</span>
            </Link>
          </>
        ) : userRole === 'service' ? (
          <>
            <Link to="/" className={`flex flex-col items-center space-y-1 ${isActive('/') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiHome size={20} className={isActive('/') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/') ? 'font-bold' : ''}`}>Home</span>
            </Link>
            <Link to="/dashboard" className={`flex flex-col items-center space-y-1 ${isActive('/dashboard') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/dashboard') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiChartSquareBar size={20} className={isActive('/dashboard') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/dashboard') ? 'font-bold' : ''}`}>Dashboard</span>
            </Link>
            <Link to="/profile" className={`flex flex-col items-center space-y-1 ${isActive('/profile') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/profile') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiUser size={20} className={isActive('/profile') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/profile') ? 'font-bold' : ''}`}>Profile</span>
            </Link>
            <Link to="/settings" className={`flex flex-col items-center space-y-1 ${isActive('/settings') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/settings') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiCog size={20} className={isActive('/settings') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/settings') ? 'font-bold' : ''}`}>Settings</span>
            </Link>
          </>
        ) : (
          <>
            <Link to="/" className={`flex flex-col items-center space-y-1 ${isActive('/') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiHome size={20} className={isActive('/') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/') ? 'font-bold' : ''}`}>Home</span>
            </Link>
            <Link to="/categories" className={`flex flex-col items-center space-y-1 ${isActive('/categories') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/categories') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiViewGrid size={20} className={isActive('/categories') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/categories') ? 'font-bold' : ''}`}>Categories</span>
            </Link>
            <Link to="/store" className={`flex flex-col items-center space-y-1 ${isActive('/store') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/store') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiShoppingBag size={20} className={isActive('/store') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/store') ? 'font-bold' : ''}`}>Stores</span>
            </Link>
            <Link to="/profile" className={`flex flex-col items-center space-y-1 ${isActive('/profile') ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'} transition-colors`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isActive('/profile') ? 'bg-gradient-to-br from-primary-500 to-primary-700' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <HiUser size={20} className={isActive('/profile') ? 'text-white' : ''} />
              </div>
              <span className={`text-xs ${isActive('/profile') ? 'font-bold' : ''}`}>Profile</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default BottomNav