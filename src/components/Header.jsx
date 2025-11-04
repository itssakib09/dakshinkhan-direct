import { Link } from 'react-router-dom'
import { Menu, MapPin, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Header({ onMenuClick }) {
  const { currentUser, userProfile, logout } = useAuth()

  async function handleLogout() {
    try {
      console.log('🔵 [Header] Logout clicked')
      await logout()
      console.log('✅ [Header] Logout successful')
      window.location.href = '/login'
    } catch (error) {
      console.error('❌ [Header] Logout failed:', error)
      alert('Failed to logout. Please try again.')
    }
  }

  return (
    <header className="bg-blue-600 text-white shadow-md sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left: Hamburger + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 hover:bg-blue-700 rounded"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex items-center gap-2">
              <MapPin size={28} />
              <div>
                <h1 className="text-xl font-bold leading-tight">
                  Dakshinkhan Direct
                </h1>
                <p className="text-xs text-blue-200">Local Business Directory</p>
              </div>
            </Link>
          </div>

          {/* Right: User Info or Auth Links */}
          <nav className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                {/* User Avatar/Name */}
                <Link to="/dashboard" className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded transition">
                  {userProfile?.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt={userProfile.displayName}
                      className="w-8 h-8 rounded-full border-2 border-white"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center">
                      <User size={18} />
                    </div>
                  )}
                  <span className="text-sm font-medium">
                    {userProfile?.displayName || currentUser.email}
                  </span>
                </Link>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-700 rounded transition"
                  title="Logout"
                >
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 hover:bg-blue-700 rounded transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded font-semibold transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile User Menu */}
          <div className="flex md:hidden gap-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 hover:bg-blue-700 rounded flex items-center gap-1"
              >
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="text-sm px-3 py-1 hover:bg-blue-700 rounded"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header