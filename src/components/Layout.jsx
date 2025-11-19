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

  // Determine if sidebar should be shown
  const showSidebar = location.pathname !== '/'

  return (
    <div className="flex flex-col min-h-screen">
      <OfflineIndicator />
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex flex-1">
        {/* Show Sidebar on Desktop (except homepage), Toggle on Mobile */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar isOpen={true} onClose={closeSidebar} />
          </div>
        )}
        
        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div className="lg:hidden">
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
          </div>
        )}
        
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default Layout