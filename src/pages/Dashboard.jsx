import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserProfile, createUserProfile } from '../services/userService'
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
  const [error, setError] = useState(null)
  
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function checkAuthAndLoadProfile() {
      console.log('🔒 Dashboard: Starting auth check...')
      
      try {
        // Check 1: Is user logged in?
        if (!currentUser) {
          console.log('❌ No user, redirecting to login')
          navigate('/login')
          return
        }

        console.log('✅ User authenticated:', currentUser.email)
        console.log('UID:', currentUser.uid)

        // Check 2: Load user profile
        console.log('📖 Loading profile from Firestore...')
        
        let profile = null
        try {
          profile = await getUserProfile(currentUser.uid)
          console.log('Profile result:', profile)
        } catch (profileError) {
          console.error('Error loading profile:', profileError)
          
          // If profile doesn't exist, create it now
          if (profileError.code === 'permission-denied' || !profile) {
            console.log('⚠️ Profile missing, creating now...')
            try {
              await createUserProfile(currentUser.uid, {
                email: currentUser.email,
                displayName: currentUser.displayName || '',
                role: 'business', // Default to business for dashboard access
                phone: '',
                photoURL: currentUser.photoURL || ''
              })
              
              profile = await getUserProfile(currentUser.uid)
              console.log('✅ Profile created and loaded')
            } catch (createError) {
              console.error('❌ Failed to create profile:', createError)
            }
          }
        }
        
        if (profile) {
          console.log('✅ Profile loaded:', profile)
          setUserProfile(profile)
          
          // Check role
          if (profile.role === 'customer') {
            console.log('⚠️ Customer role, redirecting home')
            navigate('/')
            return
          }
        } else {
          console.log('⚠️ No profile found, using defaults')
          // Use a default profile from auth data
          setUserProfile({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName || 'User',
            role: 'business',
            phone: '',
            photoURL: currentUser.photoURL || ''
          })
        }
        
      } catch (error) {
        console.error('❌ Dashboard error:', error)
        setError(error.message)
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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error Loading Dashboard</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[250px_1fr] gap-6">
      <DashboardSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        userProfile={userProfile}
      />
      <main>
        {renderSection()}
      </main>
    </div>
  )
}

export default Dashboard