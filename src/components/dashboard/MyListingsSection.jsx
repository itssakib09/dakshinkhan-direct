import { useState, useEffect } from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '../ui'
import { useAuth } from '../../context/AuthContext'
import { getMyListings } from '../../services/listingService'
import { formatDistanceToNow } from 'date-fns'

function MyListingsSection() {
  const { currentUser } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastDoc, setLastDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!currentUser) return

    let isMounted = true

    ;(async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getMyListings(currentUser.uid, null)

        if (!isMounted) return

        setListings(result.listings)
        setLastDoc(result.lastDoc)
        setHasMore(result.hasMore)
      } catch (err) {
        console.error('Failed to load listings:', err)
        if (!isMounted) return
        setError('Failed to load listings. Please refresh.')
      } finally {
        if (isMounted) setLoading(false)
      }
    })()

    return () => {
      isMounted = false
    }
  }, [currentUser])

  async function loadListings(loadMore = false) {
    if (!currentUser) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await getMyListings(currentUser.uid, loadMore ? lastDoc : null)
      
      if (loadMore) {
        setListings(prev => [...prev, ...result.listings])
      } else {
        setListings(result.listings)
      }
      
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (err) {
      console.error('Failed to load listings:', err)
      setError('Failed to load listings. Please refresh.')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(timestamp) {
    if (!timestamp) return 'N/A'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return formatDistanceToNow(date, { addSuffix: true })
  }

  function getStatusBadge(status) {
    const styles = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    )
  }

  if (loading && listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading listings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800">{error}</p>
        <button onClick={() => loadListings()} className="mt-2 text-blue-600 hover:underline">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">My Listings</h2>
          <p className="text-gray-600 mt-1">Manage your business listings</p>
        </div>
        <div className="flex gap-3">
          <a
            href={`/store/${currentUser.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            🏪 View My Store
          </a>
          <Button variant="primary">Add New Listing</Button>
        </div>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">You don't have any listings yet</p>
          <Button variant="primary">Create Your First Listing</Button>
        </div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 mb-6">
            {listings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                    <p className="text-sm text-gray-600">{listing.category}</p>
                  </div>
                  {getStatusBadge(listing.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Price:</span>
                    <p className="font-medium">৳{listing.price || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Views:</span>
                    <p className="font-medium flex items-center gap-1">
                      <Eye size={14} />
                      {listing.views || 0}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500">Created {formatDate(listing.createdAt)}</p>

                <div className="flex gap-2 pt-2">
                  <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                    <Edit size={16} /> Edit
                  </button>
                  <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{listing.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {listing.description?.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{listing.category}</td>
                    <td className="px-6 py-4">{getStatusBadge(listing.status)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        {listing.views || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(listing.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit size={18} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={() => loadListings(true)}
                disabled={loading}
                className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-medium"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MyListingsSection