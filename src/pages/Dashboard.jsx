import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserProfile } from '../services/userService'
import DashboardSidebar from '../components/DashboardSidebar'
import AnalyticsSection from '../components/dashboard/AnalyticsSection'
import MyListingsSection from '../components/dashboard/MyListingsSection'
import AddListingSection from '../components/dashboard/AddListingSection'
import ProfileSection from '../components/dashboard/ProfileSection'
import PaymentsSection from '../components/dashboard/PaymentsSection'

function Dashboard() {
  const [activeSection, setActiveSection] = useState('analytics')
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  // Protect route and load user profile
  useEffect(() => {
    async function checkAuthAndLoadProfile() {
      console.log('🔒 Dashboard: Checking authentication...')
      
      // If no user, redirect to login
      if (!currentUser) {
        console.log('❌ No user found, redirecting to login')
        navigate('/login')
        return
      }

      console.log('✅ User authenticated:', currentUser.email)

      // Load user profile from Firestore
      try {
        console.log('📖 Loading user profile from Firestore...')
        const profile = await getUserProfile(currentUser.uid)
        
        if (profile) {
          console.log('✅ Profile loaded:', profile)
          setUserProfile(profile)
          
          // Check if user has permission to access dashboard
          if (profile.role !== 'business' && profile.role !== 'service') {
            console.log('⚠️ User role is customer, redirecting to home')
            navigate('/')
            return
          }
        } else {
          console.log('⚠️ No profile found in Firestore')
        }
      } catch (error) {
        console.error('❌ Error loading profile:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadProfile()
  }, [currentUser, navigate])

  const renderSection = () => {
    switch (activeSection) {
      case 'analytics':
        return <AnalyticsSection userProfile={userProfile} />
      case 'my-listings':
        return <MyListingsSection userProfile={userProfile} />
      case 'add-listing':
        return <AddListingSection userProfile={userProfile} />
      case 'profile':
        return <ProfileSection userProfile={userProfile} />
      case 'payments':
        return <PaymentsSection userProfile={userProfile} />
      default:
        return <AnalyticsSection userProfile={userProfile} />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[250px_1fr] gap-6">
      {/* Dashboard Sidebar */}
      <DashboardSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        userProfile={userProfile}
      />

      {/* Main Content */}
      <main>
        {renderSection()}
      </main>
    </div>
  )
}

export default Dashboard