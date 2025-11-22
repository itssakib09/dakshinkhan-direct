import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import BottomNav from './ui/BottomNav'
import OfflineIndicator from './OfflineIndicator'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const closeSidebar = () => setSidebarOpen(false)

  // Close sidebar on route change (tablet only)
  useEffect(() => {
    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
      closeSidebar()
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen">
      <OfflineIndicator />
      <Header onMenuClick={toggleSidebar} />
      
      <div className="flex flex-1 relative">
        {/* Sidebar Spacer for Desktop ONLY */}
        <div className="hidden lg:block w-72 flex-shrink-0" />

        {/* Sidebar Component - Tablet & Desktop */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        {/* Main Content - stays fixed, no shifting */}
        <main className="flex-1 w-full min-w-0 overflow-x-hidden relative z-10 pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>

      <Footer />
      
      {/* Bottom Navigation - Mobile only (<768px) - ALL PAGES */}
      <BottomNav />
    </div>
  )
}

export default Layout