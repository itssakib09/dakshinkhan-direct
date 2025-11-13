import { useState, useEffect } from 'react'
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
  const [period, setPeriod] = useState(30) // 7, 30, or 90 days
  const [analytics, setAnalytics] = useState(null)
  const [chartData, setChartData] = useState([])
  const [topListings, setTopListings] = useState([])
  const [topListingsChart, setTopListingsChart] = useState([])
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
      let analyticsData
      if (period === 7) analyticsData = await getLast7Days(currentUser.uid)
      else if (period === 30) analyticsData = await getLast30Days(currentUser.uid)
      else if (period === 90) analyticsData = await getLast90Days(currentUser.uid)

      setAnalytics(analyticsData)
      setChartData(getChartData(analyticsData))

      // Fetch top listings
      const top = await getTopListings(currentUser.uid, 5)
      setTopListings(top)

      // Format top listings for bar chart
      const chartFormatted = top.map((listing, i) => ({
        name: `#${i + 1}`,
        views: listing.views,
        id: listing.listingId.slice(-6)
      }))
      setTopListingsChart(chartFormatted)

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
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
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
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Total Clicks', 
      value: analytics?.totalClicks || 0, 
      change: `${analytics?.clickThroughRate || 0}% CTR`, 
      icon: Users, 
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    { 
      label: 'Active Listings', 
      value: listingsCount, 
      change: `${analytics?.totalLeads || 0} leads`, 
      icon: TrendingUp, 
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    { 
      label: 'Revenue', 
      value: `৳${(analytics?.totalRevenue || 0).toLocaleString()}`, 
      change: `${analytics?.conversionRate || 0}% conv.`, 
      icon: DollarSign, 
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
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
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod(30)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 30 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setPeriod(90)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              period === 90 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            90 Days
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={stat.textColor} size={24} />
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

      {/* Line Chart - Views & Engagements */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold">Views & Engagement Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
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
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Bar Chart - Top Listings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-purple-600" size={24} />
            <h3 className="text-xl font-bold">Top Performing Listings</h3>
          </div>
          
          {topListingsChart.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topListingsChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
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
              
              {/* Listing Details */}
              <div className="mt-4 space-y-2">
                {topListings.map((listing, i) => (
                  <div 
                    key={listing.listingId} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-bold text-xs">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-medium text-sm">Listing {listing.listingId.slice(-6)}</p>
                        <p className="text-xs text-gray-500">Popular this period</p>
                      </div>
                    </div>
                    <span className="font-bold text-blue-600">{listing.views}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center py-12">No data available</p>
          )}
        </div>

        {/* Key Metrics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Key Performance Indicators</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Avg. Views/Day</p>
                <p className="text-xs text-gray-500 mt-1">Daily average impressions</p>
              </div>
              <span className="font-bold text-2xl text-blue-600">{analytics?.avgViewsPerDay || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Avg. Clicks/Day</p>
                <p className="text-xs text-gray-500 mt-1">Daily click interactions</p>
              </div>
              <span className="font-bold text-2xl text-green-600">{analytics?.avgClicksPerDay || 0}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600">Click-Through Rate</p>
                <p className="text-xs text-gray-500 mt-1">Views to clicks conversion</p>
              </div>
              <span className="font-bold text-2xl text-purple-600">{analytics?.clickThroughRate || 0}%</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-xs text-gray-500 mt-1">Clicks to leads conversion</p>
              </div>
              <span className="font-bold text-2xl text-yellow-600">{analytics?.conversionRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsSection