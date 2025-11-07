import { useState } from 'react'
import { seedFirestore } from '../utils/seedData'

function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  async function handleSeed() {
    if (!window.confirm('This will add sample data to Firestore. Continue?')) {
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      await seedFirestore()
      setResult({
        success: true,
        message: 'Sample data seeded successfully!',
        collections: ['users (3)', 'listings (5)', 'analytics (14)', 'catalog (6)']
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-3xl font-bold mb-2">Seed Firestore Data</h1>
          <p className="text-gray-600 mb-6">
            This will populate your Firestore database with sample data for testing.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Warning:</strong> Only run this once in development. This creates sample users, listings, and analytics data.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <h3 className="font-semibold text-lg">What will be created:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>3 sample users</strong> - Business owner, service provider, customer</li>
              <li><strong>5 sample listings</strong> - Various categories (restaurant, pharmacy, services, etc.)</li>
              <li><strong>14 analytics records</strong> - 7 days of data for 2 users</li>
              <li><strong>6 categories</strong> - Restaurant, Grocery, Pharmacy, Electronics, Services, Clothing</li>
            </ul>
          </div>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? 'Seeding Data...' : 'Seed Firestore'}
          </button>

          {result && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="text-green-800 font-semibold mb-2">✅ {result.message}</h4>
              <ul className="text-sm text-green-700 space-y-1">
                {result.collections.map((col, idx) => (
                  <li key={idx}>• {col}</li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="text-red-800 font-semibold mb-2">❌ Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 rounded-lg p-6">
          <h3 className="font-semibold mb-2">After Seeding:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Go to Firebase Console → Firestore Database</li>
            <li>Verify collections exist: users, listings, analytics, catalog</li>
            <li>Test queries in your app (listings page, analytics dashboard)</li>
            <li>Delete this page in production!</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default SeedPage