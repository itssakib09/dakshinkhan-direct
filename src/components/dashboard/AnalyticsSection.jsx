import { motion } from 'framer-motion'
import { TrendingUp, Eye, ShoppingBag, Users, Phone, Star, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function AnalyticsSection({ onNavigateToAddListing }) {
  const { userProfile } = useAuth()
  const isService = userProfile?.role === 'service'
  
  const getProfileCompletion = () => {
    if (!isService || !userProfile?.serviceProfile) return 0
    
    const profile = userProfile.serviceProfile
    let completed = 0
    let total = 7
    
    if (profile.coverPhoto) completed++
    if (profile.profilePhoto) completed++
    if (profile.profession) completed++
    if (profile.bio) completed++
    if (profile.servicesOffered?.length > 0) completed++
    if (profile.coverageAreas?.length > 0) completed++
    if (profile.availability) completed++
    
    return Math.round((completed / total) * 100)
  }

  const businessStats = [
    { 
      label: 'Total Views', 
      value: '0', 
      change: '+0%', 
      icon: Eye,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    { 
      label: 'Active Listings', 
      value: '0', 
      change: '+0%', 
      icon: ShoppingBag,
      color: 'from-primary-500 to-primary-700',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30'
    },
    { 
      label: 'Total Inquiries', 
      value: '0', 
      change: '+0%', 
      icon: Users,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    { 
      label: 'Growth Rate', 
      value: '0%', 
      change: '+0%', 
      icon: TrendingUp,
      color: 'from-green-500 to-green-700',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
  ]

  const serviceStats = [
    { 
      label: 'Profile Views', 
      value: '0', 
      change: '+0%', 
      icon: Eye,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    { 
      label: 'Service Calls', 
      value: '0', 
      change: '+0%', 
      icon: Phone,
      color: 'from-primary-500 to-primary-700',
      bgColor: 'bg-primary-100 dark:bg-primary-900/30'
    },
    { 
      label: 'Booking Requests', 
      value: '0', 
      change: '+0%', 
      icon: Users,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    { 
      label: 'Avg Rating', 
      value: '0.0', 
      change: '+0%', 
      icon: Star,
      color: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30'
    },
  ]

  const stats = isService ? serviceStats : businessStats
  const profileCompletion = getProfileCompletion()

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {isService ? 'Track your service performance' : 'Track your business performance'}
        </p>
      </motion.div>

      {/* Service Provider Profile Completion CTA */}
      {isService && profileCompletion < 100 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-2xl shadow-lg border border-orange-200 dark:border-orange-800 p-6 mb-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertCircle size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                Complete Your Service Profile
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Your profile is {profileCompletion}% complete. Finish your profile to start receiving service requests from customers.
              </p>
              <div className="w-full bg-white dark:bg-gray-800 rounded-full h-3 overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full"
                />
              </div>
              <motion.a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  const event = new CustomEvent('navigate-to-service-settings')
                  window.dispatchEvent(event)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
              >
                <CheckCircle size={20} />
                Complete Profile Now
              </motion.a>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon size={24} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-lg">
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-5 rounded-full -mr-12 -mb-12 group-hover:scale-150 transition-transform duration-500`}></div>
            </motion.div>
          )
        })}
      </div>

      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-2xl shadow-lg border border-primary-200 dark:border-primary-800 p-8 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            {isService ? 'Welcome to Your Service Provider Dashboard!' : 'Welcome to Your Business Dashboard!'}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {isService 
              ? 'Start by completing your service profile to receive requests from customers in Dakshinkhan!' 
              : 'Start by adding your first listing to reach customers in Dakshinkhan. Your journey to growing your local business begins here!'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {!isService && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNavigateToAddListing}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
              >
                Add Your First Listing
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold shadow-lg border border-gray-200 dark:border-gray-700 transition-all"
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 grid md:grid-cols-3 gap-4"
      >
        {isService ? (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Complete Your Profile</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add photos and details to attract more customers</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Set Clear Pricing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Transparent pricing builds customer trust</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Respond Quickly</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fast responses lead to more bookings</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Keep Listings Updated</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Regular updates help attract more customers</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Add Quality Images</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Clear photos increase customer trust</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-4">
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Respond Quickly</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Fast responses lead to more sales</p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default AnalyticsSection