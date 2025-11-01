import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, createUserProfile } from '../services/userService'
import DashboardSidebar from '../components/DashboardSidebar'
import AnalyticsSection from '../components/dashboard/AnalyticsSection'
import MyListingsSection from '../components/dashboard/MyListingsSection'
import AddListingSection from '../components/dashboard/AddListingSection'
import ProfileSection from '../components/dashboard/ProfileSection'
import PaymentsSection from '../components/dashboard/PaymentsSection'

function Dashboard() {
  const [activeSection, setActiveSection] = useState('analytics')
  const [localProfile, setLocalProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { currentUser, userProfile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProfile() {
      console.log('🔍 [DASHBOARD] Loading profile...')
      console.log('Current User:', currentUser?.uid)
      console.log('Context Profile:', userProfile)
      console.log('Auth Loading:', loading)

      // If not authenticated, redirect to login
      if (!loading && !currentUser) {
        console.log('⚠️ [DASHBOARD] No user, redirecting to login')
        navigate('/login')
        return
      }

      // If still loading auth, wait
      if (loading) {
        return
      }

      // Try to get profile from context first
      if (userProfile) {
        console.log('✅ [DASHBOARD] Using profile from context')
        setLocalProfile(userProfile)
        setProfileLoading(false)
        return
      }

      // If no profile in context, fetch it directly
      if (currentUser) {
        try {
          console.log('📖 [DASHBOARD] Fetching profile from Firestore...')
          const profile = await getUserProfile(currentUser.uid)
          
          if (profile) {
            console.log('✅ [DASHBOARD] Profile loaded')
            setLocalProfile(profile)
          } else {
            console.log('⚠️ [DASHBOARD] No profile found, creating default...')
            // Profile doesn't exist, create it
            const newProfile = {
              email: currentUser.email,
              displayName: currentUser.displayName || 'User',
              role: 'business',
              phone: '',
              photoURL: currentUser.photoURL || ''
            }
            
            await createUserProfile(currentUser.uid, newProfile)
            setLocalProfile(newProfile)
          }
        } catch (err) {
          console.error('❌ [DASHBOARD] Error loading profile:', err)
          setError('Failed to load profile. Please try refreshing.')
        } finally {
          setProfileLoading(false)
        }
      }
    }

    loadProfile()
  }, [currentUser, userProfile, loading, navigate])

  // Show loading state
  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
          >
            Refresh Page
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Go Home
          </button>
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
      {localProfile && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {localProfile.displayName || 'User'}!
          </h1>
          <p className="text-gray-600">
            Role: <span className="capitalize font-semibold">{localProfile.role}</span>
          </p>
        </div>
      )}

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