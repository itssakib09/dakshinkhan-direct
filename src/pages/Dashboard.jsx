import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import DashboardSidebar from '../components/DashboardSidebar'
import AnalyticsSection from '../components/dashboard/AnalyticsSection'
import MyListingsSection from '../components/dashboard/MyListingsSection'
import AddListingSection from '../components/dashboard/AddListingSection'
import ProfileSection from '../components/dashboard/ProfileSection'
import PaymentsSection from '../components/dashboard/PaymentsSection'

function Dashboard() {
  const [activeSection, setActiveSection] = useState('analytics')
  const { currentUser, userProfile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('🔍 [DASHBOARD] Checking auth state')
    console.log('Current User:', currentUser?.uid)
    console.log('User Profile:', userProfile)
    console.log('Loading:', loading)

    // Redirect if not authenticated
    if (!loading && !currentUser) {
      console.log('⚠️ [DASHBOARD] No user, redirecting to login')
      navigate('/login')
    }
  }, [currentUser, loading, navigate])

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show loading if user profile not loaded yet
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'analytics':
        return <AnalyticsSection />
      case 'my-listings':
        return <MyListingsSection />
      case 'add-listing':
        return <AddListingSection />
      case 'profile':
        return <ProfileSection />
      case 'payments':
        return <PaymentsSection />
      default:
        return <AnalyticsSection />
    }
  }

  return (
    <div>
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {userProfile.displayName || 'User'}!
        </h1>
        <p className="text-gray-600">
          Role: <span className="capitalize font-semibold">{userProfile.role}</span>
        </p>
      </div>

      {/* Dashboard Layout */}
      <div className="grid lg:grid-cols-[250px_1fr] gap-6">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
        />
        <main>{renderSection()}</main>
      </div>
    </div>
  )
}

export default Dashboard