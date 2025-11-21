import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import OfflineIndicator from './OfflineIndicator'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    closeSidebar()
  }, [location.pathname])

  // Determine if sidebar should be shown (not on homepage)
  const showSidebar = location.pathname !== '/'

  return (
    <div className="flex flex-col min-h-screen">
      <OfflineIndicator />
      <Header onMenuClick={toggleSidebar} showMenuButton={showSidebar} />
      
      <div className="flex flex-1">
        {/* Desktop Sidebar - Always visible except homepage */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 w-full">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default Layout