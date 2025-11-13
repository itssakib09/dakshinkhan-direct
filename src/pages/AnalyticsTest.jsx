import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getLast7Days, getLast30Days, getLast90Days } from '../services/analyticsService'
import { generateSampleAnalytics } from '../utils/generateAnalytics'

export default function AnalyticsTest() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function testAnalytics(days) {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      let data
      if (days === 7) data = await getLast7Days(currentUser.uid)
      else if (days === 30) data = await getLast30Days(currentUser.uid)
      else if (days === 90) data = await getLast90Days(currentUser.uid)

      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function generateData(days) {
    setLoading(true)
    setError(null)

    try {
      await generateSampleAnalytics(currentUser.uid, days)
      alert(`✅ Generated ${days} days of sample data!`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Please log in to test analytics</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Test Page</h1>
      <p className="text-gray-600 mb-8">
        Testing analytics data fetching for user: <strong>{currentUser.uid}</strong>
      </p>

      {/* Generate Sample Data */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">1. Generate Sample Data</h2>
        <div className="flex gap-3">
          <button
            onClick={() => generateData(7)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Generate 7 Days
          </button>
          <button
            onClick={() => generateData(30)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Generate 30 Days
          </button>
          <button
            onClick={() => generateData(90)}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Generate 90 Days
          </button>
        </div>
      </div>

      {/* Test Queries */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">2. Test Analytics Queries</h2>
        <div className="flex gap-3">
          <button
            onClick={() => testAnalytics(7)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Get Last 7 Days
          </button>
          <button
            onClick={() => testAnalytics(30)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Get Last 30 Days
          </button>
          <button
            onClick={() => testAnalytics(90)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            Get Last 90 Days
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-blue-600">{result.totalViews}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-green-600">{result.totalClicks}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-purple-600">{result.totalLeads}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-yellow-600">৳{result.totalRevenue}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">CTR</p>
              <p className="text-xl font-bold">{result.clickThroughRate}%</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-xl font-bold">{result.conversionRate}%</p>
            </div>
          </div>

          <details className="bg-gray-50 p-4 rounded-lg">
            <summary className="font-semibold cursor-pointer">Full JSON Response</summary>
            <pre className="mt-4 text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  )
}