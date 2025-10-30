import { Link } from 'react-router-dom'
import { Menu, MapPin, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Header({ onMenuClick }) {
  const { currentUser, logout } = useAuth()

  async function handleLogout() {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out', error)
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
              <>
                <span className="text-sm">
                  Hello, {currentUser.displayName || currentUser.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-blue-700 rounded transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
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

          {/* Mobile */}
          <div className="flex md:hidden gap-2">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="text-sm px-3 py-1 hover:bg-blue-700 rounded"
              >
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