import { useState, useEffect } from 'react'
import { TrendingUp, Users, Eye, DollarSign, Calendar } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import { getLast7Days, getLast30Days, getChartData, getTopListings } from '../../services/analyticsService'
import { getMyListings } from '../../services/listingService'

function AnalyticsSection() {
  const { currentUser } = useAuth()
  const [period, setPeriod] = useState(7) // 7, 30, or 90 days
  const [analytics, setAnalytics] = useState(null)
  const [chartData, setChartData] = useState([])
  const [topListings, setTopListings] = useState([])
  const [listingsCount, setListingsCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAnalytics()
  }, [currentUser, period])

  async function loadAnalytics() {
    if (!currentUser) return

    setLoading(true)
    setError(null)

    try {
      // Fetch analytics based on period
      const analyticsData = period === 7 
        ? await getLast7Days(currentUser.uid)
        : await getLast30Days(currentUser.uid)

      setAnalytics(analyticsData)
      setChartData(getChartData(analyticsData))

      // Fetch top listings
      const top = await getTopListings(currentUser.uid, 5)
      setTopListings(top)

      // Get active listings count
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="font-bold text-yellow-900 mb-2">No Analytics Data</h3>
        <p className="text-yellow-800 mb-4">{error}</p>
        {import.meta.env.DEV && (
          <a
            href="/analytics-test"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Generate Sample Data (Dev Tool)
          </a>
        )}
      </div>
    )
  }

  const stats = [
    { 
      label: 'Total Views', 
      value: analytics?.totalViews || 0, 
      change: `${analytics?.avgViewsPerDay || 0}/day`, 
      icon: Eye, 
      color: 'blue' 
    },
    { 
      label: 'Total Clicks', 
      value: analytics?.totalClicks || 0, 
      change: `${analytics?.clickThroughRate || 0}% CTR`, 
      icon: Users, 
      color: 'green' 
    },
    { 
      label: 'Active Listings', 
      value: listingsCount, 
      change: `${analytics?.totalLeads || 0} leads`, 
      icon: TrendingUp, 
      color: 'purple' 
    },
    { 
      label: 'Revenue', 
      value: `৳${(analytics?.totalRevenue || 0).toLocaleString()}`, 
      change: `${analytics?.conversionRate || 0}% conv.`, 
      icon: DollarSign, 
      color: 'yellow' 
    },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">
            {analytics?.startDate && analytics?.endDate 
              ? `${analytics.startDate} to ${analytics.endDate}`
              : 'Overview of your business performance'
            }
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod(7)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 7 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 30 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`text-${stat.color}-600`} size={24} />
                </div>
                <span className="text-gray-600 text-sm font-medium">
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Performance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Views" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="Clicks" stroke="#10B981" strokeWidth={2} />
              <Line type="monotone" dataKey="Leads" stroke="#8B5CF6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Key Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Avg. Views/Day</span>
              <span className="font-bold text-blue-600">{analytics?.avgViewsPerDay || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Avg. Clicks/Day</span>
              <span className="font-bold text-green-600">{analytics?.avgClicksPerDay || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-600">Click-Through Rate</span>
              <span className="font-bold text-purple-600">{analytics?.clickThroughRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversion Rate</span>
              <span className="font-bold text-yellow-600">{analytics?.conversionRate || 0}%</span>
            </div>
          </div>
        </div>

        {/* Top Listings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Top Performing Listings</h3>
          {topListings.length > 0 ? (
            <div className="space-y-3">
              {topListings.map((listing, i) => (
                <div key={listing.listingId} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-400">#{i + 1}</span>
                    <div>
                      <p className="font-medium">Listing {listing.listingId.slice(-6)}</p>
                      <p className="text-sm text-gray-500">Popular this week</p>
                    </div>
                  </div>
                  <span className="font-bold text-blue-600">{listing.views} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsSection