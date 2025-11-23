import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Edit, Trash2, Eye, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getMyListings } from '../../services/listingService'
import { formatDistanceToNow } from 'date-fns'
import EditListingModal from './EditListingModal'
import DeleteConfirmModal from './DeleteConfirmModal'

function MyListingsSection() {
  const { currentUser } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastDoc, setLastDoc] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState(null)
  
  const [editingListing, setEditingListing] = useState(null)
  const [deletingListing, setDeletingListing] = useState(null)

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
      active: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
      pending: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
      rejected: 'bg-gradient-to-r from-red-500 to-red-600 text-white'
    }
    
    return (
      <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-md ${styles[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
        {status}
      </span>
    )
  }

  function handleEditSuccess() {
    loadListings()
  }

  function handleDeleteSuccess(deletedId) {
    setListings(prev => prev.filter(l => l.id !== deletedId))
  }

  if (loading && listings.length === 0) {
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
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading listings...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center shadow-lg"
      >
        <p className="text-red-800 dark:text-red-400 font-semibold mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => loadListings()}
          className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
        >
          Retry
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">My Listings</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your business listings</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-3"
        >
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`/store/${currentUser.uid}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Eye size={18} />
            View My Store
          </motion.a>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-4 py-2 rounded-xl font-semibold shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Add New
          </motion.button>
        </motion.div>
      </div>

      {listings.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg">You don't have any listings yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
          >
            Create Your First Listing
          </motion.button>
        </motion.div>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="md:hidden space-y-4 mb-6">
            {listings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 space-y-3 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">{listing.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{listing.category}</p>
                  </div>
                  {getStatusBadge(listing.status)}
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <span className="text-gray-600 dark:text-gray-400 text-xs">Price</span>
                    <p className="font-bold text-gray-900 dark:text-white">৳{listing.price || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                    <span className="text-gray-600 dark:text-gray-400 text-xs">Views</span>
                    <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      <Eye size={14} />
                      {listing.views || 0}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">Created {formatDate(listing.createdAt)}</p>

                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setEditingListing(listing)}
                    className="flex-1 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all"
>
<Edit size={16} /> Edit
</motion.button>
<motion.button
whileHover={{ scale: 1.05 }}
whileTap={{ scale: 0.95 }}
onClick={() => setDeletingListing(listing)}
className="flex-1 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 px-3 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 transition-all"
>
<Trash2 size={16} /> Delete
</motion.button>
</div>
</motion.div>
))}
</div>
      {/* Desktop Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {listings.map((listing, index) => (
                <motion.tr
                  key={listing.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className="dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-white">{listing.title}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                      {listing.description?.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-medium">{listing.category}</td>
                  <td className="px-6 py-4">{getStatusBadge(listing.status)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2 font-semibold">
                      <Eye size={16} />
                      {listing.views || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(listing.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingListing(listing)}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeletingListing(listing)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {hasMore && (
        <div className="mt-6 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadListings(true)}
            disabled={loading}
            className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-800 dark:text-gray-200 px-8 py-3 rounded-xl font-semibold shadow-lg transition-all"
          >
            {loading ? 'Loading...' : 'Load More'}
          </motion.button>
        </div>
      )}
    </>
  )}

  {editingListing && (
    <EditListingModal
      listing={editingListing}
      onClose={() => setEditingListing(null)}
      onSuccess={handleEditSuccess}
    />
  )}

  {deletingListing && (
    <DeleteConfirmModal
      listing={deletingListing}
      onClose={() => setDeletingListing(null)}
      onSuccess={() => handleDeleteSuccess(deletingListing.id)}
    />
  )}
</div>
)
}
export default MyListingsSection