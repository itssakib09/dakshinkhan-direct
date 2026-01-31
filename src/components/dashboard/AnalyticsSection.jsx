import { motion } from 'framer-motion'
import { TrendingUp, Eye, ShoppingBag, Users } from 'lucide-react'

function AnalyticsSection({ onNavigateToAddListing }) {
  const stats = [
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

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Overview</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your business performance</p>
      </motion.div>

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
            Welcome to Your Business Dashboard!
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Start by adding your first listing to reach customers in Dakshinkhan. Your journey to growing your local business begins here!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNavigateToAddListing}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
            >
              Add Your First Listing
            </motion.button>
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
      </motion.div>
    </div>
  )
}

export default AnalyticsSection