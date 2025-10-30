import { Link, useLocation } from 'react-router-dom'
import { Home, Grid, Store, LayoutDashboard, ShieldCheck, X, Package } from 'lucide-react'

function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  const menuItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/categories', icon: Grid, label: 'Categories' },
  { path: '/components', icon: Package, label: 'Components' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin', icon: ShieldCheck, label: 'Admin' },
]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-white shadow-lg z-50
          w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-blue-600">Menu</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded"
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-colors
                  ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Dakshinkhan Direct v1.0
          </p>
        </div>
      </aside>
    </>
  )
}

export default Sidebar