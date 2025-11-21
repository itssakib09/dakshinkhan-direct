import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { getUserProfile, createUserProfile } from '../services/userService'
import AnalyticsSection from '../components/dashboard/AnalyticsSection'
import MyListingsSection from '../components/dashboard/MyListingsSection'
import AddListingForm from '../components/dashboard/AddListingForm'
import ProfileSection from '../components/dashboard/ProfileSection'
import PaymentsSection from '../components/dashboard/PaymentsSection'
import { HiChartBar, HiViewGrid, HiPlus, HiUser, HiCreditCard } from 'react-icons/hi'

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-4">
            <p className="font-bold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors"
            >
              Refresh Page
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const sections = [
    { id: 'analytics', label: 'Analytics', icon: HiChartBar },
    { id: 'my-listings', label: 'My Listings', icon: HiViewGrid },
    { id: 'add-listing', label: 'Add Listing', icon: HiPlus },
    { id: 'profile', label: 'Profile', icon: HiUser },
    { id: 'payments', label: 'Payments', icon: HiCreditCard },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'analytics':
        return <AnalyticsSection />
      case 'my-listings':
        return <MyListingsSection />
      case 'add-listing':
        return <AddListingForm onSuccess={() => setActiveSection('my-listings')} />
      case 'profile':
        return <ProfileSection />
      case 'payments':
        return <PaymentsSection />
      default:
        return <AnalyticsSection />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 py-6">
        {/* Welcome Header */}
        {localProfile && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">
              Welcome back, {localProfile.displayName || 'User'}!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Role: <span className="capitalize font-semibold text-primary-600 dark:text-primary-400">{localProfile.role}</span>
            </p>
          </div>
        )}

        {/* Section Tabs - Mobile/Tablet */}
        <div className="mb-6 lg:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-100 dark:border-gray-700 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap
                      ${isActive
                        ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-semibold">{section.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Desktop Layout with Sidebar */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sticky top-24">
              <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white px-2">Dashboard Menu</h2>
              <nav className="space-y-2">
                {sections.map((section) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id

                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left
                        ${isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span className="font-semibold">{section.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-h-[60vh]">{renderSection()}</main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard