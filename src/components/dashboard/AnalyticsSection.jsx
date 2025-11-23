import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Eye, DollarSign, BarChart3 } from 'lucide-react'
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { getLast7Days, getLast30Days, getLast90Days, getChartData, getTopListings } from '../../services/analyticsService'
import { getMyListings } from '../../services/listingService'

function AnalyticsSection() {
  const { currentUser } = useAuth()
  const [period, setPeriod] = useState(30)
  const [analytics, setAnalytics] = useState(null)
  const [chartData, setChartData] = useState([])
  const [topListings, setTopListings] = useState([])
  const [topListingsChart, setTopListingsChart] = useState([])
  const [listingsCount, setListingsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) return

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        let analyticsData
        if (period === 7) analyticsData = await getLast7Days(currentUser.uid)
        else if (period === 30) analyticsData = await getLast30Days(currentUser.uid)
        else if (period === 90) analyticsData = await getLast90Days(currentUser.uid)

        setAnalytics(analyticsData)
        setChartData(getChartData(analyticsData))

        const top = await getTopListings(currentUser.uid, 5)
        setTopListings(top)

        const chartFormatted = top.map((listing, i) => ({
          name: `#${i + 1}`,
          views: listing.views,
          id: listing.listingId.slice(-6)
        }))
        setTopListingsChart(chartFormatted)

        const listingsResult = await getMyListings(currentUser.uid, null)
        const activeCount = listingsResult.listings.filter(l => l.status === 'active').length
        setListingsCount(activeCount)

      } catch (err) {
        console.error('Error loading analytics:', err)
        setError('Failed to load analytics. Make sure you have data.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [currentUser, period])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary-600 dark:border-primary-400 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading analytics...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6 shadow-lg"
      >
        <h3 className="font-bold text-yellow-900 dark:text-yellow-400 text-xl mb-2">No Analytics Data</h3>
        <p className="text-yellow-800 dark:text-yellow-300 mb-4">{error}</p>
        {import.meta.env.DEV && (
          <a
            href="/analytics-test"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
          >
            Generate Sample Data (Dev Tool)
          </a>
        )}
      </motion.div>
    )
  }

  const stats = [
    { 
      label: 'Total Views', 
      value: analytics?.totalViews || 0, 
      change: `${analytics?.avgViewsPerDay || 0}/day`, 
      icon: Eye, 
      bgColor: 'from-blue-500 to-blue-600',
      lightBg: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      label: 'Total Clicks', 
      value: analytics?.totalClicks || 0, 
      change: `${analytics?.clickThroughRate || 0}% CTR`, 
      icon: Users, 
      bgColor: 'from-green-500 to-green-600',
      lightBg: 'bg-green-50 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    { 
      label: 'Active Listings', 
      value: listingsCount, 
      change: `${analytics?.totalLeads || 0} leads`, 
      icon: TrendingUp, 
      bgColor: 'from-purple-500 to-purple-600',
      lightBg: 'bg-purple-50 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      label: 'Revenue', 
      value: `৳${(analytics?.totalRevenue || 0).toLocaleString()}`, 
      change: `${analytics?.conversionRate || 0}% conv.`, 
      icon: DollarSign, 
      bgColor: 'from-yellow-500 to-yellow-600',
      lightBg: 'bg-yellow-50 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Analytics Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {analytics?.startDate && analytics?.endDate 
              ? `${analytics.startDate} to ${analytics.endDate}`
              : 'Overview of your business performance'
            }
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-2"
        >
          {[7, 30, 90].map((days) => (
            <motion.button
              key={days}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPeriod(days)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all text-sm ${
                period === days 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {days} Days
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.lightBg}`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.lightBg} ${stat.textColor}`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">{stat.value}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Line Chart */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-6 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-primary-600 dark:text-primary-400" size={24} />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Views & Engagement Trends</h3>
          </div>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={350} minWidth={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  className="dark:stroke-gray-400"
                />
                <YAxis 
                  stroke="#6b7280"
                  style={{ fontSize: '12px' }}
                  className="dark:stroke-gray-400"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="Views" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Clicks" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Leads" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-purple-600 dark:text-purple-400" size={24} />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Top Performing Listings</h3>
          </div>
          
          {topListingsChart.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto">
                <ResponsiveContainer width="100%" height={250} minWidth={250}>
                  <BarChart data={topListingsChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      className="dark:stroke-gray-400"
                    />
                    <YAxis 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                      className="dark:stroke-gray-400"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px'
                      }}
                      cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                    />
                    <Bar 
                      dataKey="views" 
                      fill="#3B82F6" 
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 space-y-2">
                {topListings.map((listing, i) => (
                  <motion.div
                    key={listing.listingId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 font-bold text-sm">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-sm text-gray-900 dark:text-white">Listing {listing.listingId.slice(-6)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Popular this period</p>
                      </div>
                    </div>
                    <span className="font-black text-primary-600 dark:text-primary-400">{listing.views}</span>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-12">No data available</p>
          )}
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-6"
        >
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">Key Performance Indicators</h3>
          <div className="space-y-4">
            {[
              { label: 'Avg. Views/Day', subtitle: 'Daily average impressions', value: analytics?.avgViewsPerDay || 0, color: 'text-blue-600 dark:text-blue-400' },
              { label: 'Avg. Clicks/Day', subtitle: 'Daily click interactions', value: analytics?.avgClicksPerDay || 0, color: 'text-green-600 dark:text-green-400' },
              { label: 'Click-Through Rate', subtitle: 'Views to clicks conversion', value: `${analytics?.clickThroughRate || 0}%`, color: 'text-purple-600 dark:text-purple-400' },
              { label: 'Conversion Rate', subtitle: 'Clicks to leads conversion', value: `${analytics?.conversionRate || 0}%`, color: 'text-yellow-600 dark:text-yellow-400' },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`flex justify-between items-center pb-4 ${index !== 3 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{metric.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{metric.subtitle}</p>
                </div>
                <span className={`font-black text-2xl ${metric.color}`}>{metric.value}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AnalyticsSection