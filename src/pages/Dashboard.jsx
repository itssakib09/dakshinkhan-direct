import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getUserProfile, createUserProfile } from '../services/userService'
import AnalyticsSection from '../components/dashboard/AnalyticsSection'
import MyListingsSection from '../components/dashboard/MyListingsSection'
import AddListingForm from '../components/dashboard/AddListingForm'
import ProfileSection from '../components/dashboard/ProfileSection'
import StoreSettingsSection from '../components/dashboard/StoreSettingsSection'
import { HiChartBar, HiViewGrid, HiPlus, HiUser, HiBriefcase, HiShoppingBag, HiCog } from 'react-icons/hi'

function Dashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  const [localProfile, setLocalProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { currentUser, userProfile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProfile() {
      if (!loading && !currentUser) {
        navigate('/login')
        return
      }

      if (loading) {
        return
      }

      if (userProfile) {
        if ((userProfile.role === 'business' || userProfile.role === 'service') && !userProfile.onboardingComplete) {
          navigate('/business-setup')
          return
        }

        setLocalProfile(userProfile)
        setProfileLoading(false)
        return
      }

      if (currentUser) {
        try {
          const profile = await getUserProfile(currentUser.uid)
          
          if (profile) {
            if ((profile.role === 'business' || profile.role === 'service') && !profile.onboardingComplete) {
              navigate('/business-setup')
              return
            }

            setLocalProfile(profile)
          } else {
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
          console.error('Error loading profile:', err)
          setError('Failed to load profile. Please try refreshing.')
        } finally {
          setProfileLoading(false)
        }
      }
    }

    loadProfile()
  }, [currentUser, userProfile, loading, navigate])

  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-600 dark:border-primary-400 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-2xl mb-4">
            <p className="font-bold text-lg mb-2">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-colors"
            >
              Refresh Page
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-colors"
            >
              Go Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  const getSectionsForRole = (role) => {
    switch (role) {
      case 'business':
        return [
          { id: 'overview', label: 'Overview', icon: HiChartBar },
          { id: 'my-listings', label: 'My Listings', icon: HiShoppingBag },
          { id: 'add-listing', label: 'Add Listing', icon: HiPlus },
          { id: 'store-settings', label: 'Store Settings', icon: HiCog },
          { id: 'profile', label: 'Profile', icon: HiUser },
        ]
      case 'service':
        return [
          { id: 'overview', label: 'Overview', icon: HiChartBar },
          { id: 'my-listings', label: 'My Services', icon: HiBriefcase },
          { id: 'add-listing', label: 'Add Service', icon: HiPlus },
          { id: 'store-settings', label: 'Service Settings', icon: HiCog },
          { id: 'profile', label: 'Profile', icon: HiUser },
        ]
      default:
        return [
          { id: 'overview', label: 'Overview', icon: HiChartBar },
          { id: 'my-listings', label: 'My Orders', icon: HiViewGrid },
          { id: 'profile', label: 'Profile', icon: HiUser },
        ]
    }
  }

  const sections = getSectionsForRole(localProfile?.role || 'customer')

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <AnalyticsSection onNavigateToAddListing={() => setActiveSection('add-listing')} />
      case 'my-listings':
        return <MyListingsSection />
      case 'add-listing':
        return <AddListingForm onSuccess={() => setActiveSection('my-listings')} />
      case 'store-settings':
        return <StoreSettingsSection />
      case 'profile':
        return <ProfileSection />
      default:
        return <AnalyticsSection onNavigateToAddListing={() => setActiveSection('add-listing')} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Welcome Header */}
        {localProfile && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 rounded-2xl p-6 sm:p-8 shadow-xl border border-primary-400 dark:border-primary-700 overflow-hidden relative"
          >
            <div className="relative z-10">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2">
                Welcome back, {localProfile.displayName || 'User'}!
              </h1>
              <p className="text-sm sm:text-base text-primary-100">
                Role: <span className="capitalize font-bold text-white">{localProfile.role}</span>
              </p>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          </motion.div>
        )}

        {/* Section Tabs - Mobile/Tablet */}
        <div className="mb-6 lg:hidden">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-lg border border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div className="flex gap-2 min-w-max">
              {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeSection === section.id

                return (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap font-semibold text-sm
                      ${isActive
                        ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{section.label}</span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Desktop Layout with Sidebar */}
        <div className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sticky top-24">
              <h2 className="text-lg font-black mb-4 text-gray-800 dark:text-white px-2 flex items-center gap-2">
                <HiViewGrid className="text-primary-600 dark:text-primary-400" size={20} />
                Dashboard Menu
              </h2>
              <nav className="space-y-2">
                {sections.map((section, index) => {
                  const Icon = section.icon
                  const isActive = activeSection === section.id

                  return (
                    <motion.button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left relative group
                        ${isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                        ${isActive ? 'bg-white/20' : 'bg-primary-50 dark:bg-gray-700'}
                      `}>
                        <Icon size={20} className={isActive ? 'text-white' : 'text-primary-600 dark:text-primary-400'} />
                      </div>
                      <span className="font-semibold">{section.label}</span>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-2 h-2 bg-white rounded-full"
                        />
                      )}
                    </motion.button>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Dashboard