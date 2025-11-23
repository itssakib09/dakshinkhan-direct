import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'
import { deleteListing } from '../../services/listingService'

export default function DeleteConfirmModal({ listing, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    setLoading(true)
    setError(null)

    try {
      await deleteListing(listing.id, listing.images || [])
      
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      console.error('Error deleting listing:', err)
      setError(err.message || 'Failed to delete listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Delete Listing</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}

          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete <strong className="text-gray-900 dark:text-white">"{listing?.title}"</strong>?
          </p>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">
              ⚠️ This action cannot be undone. All listing data and images will be permanently deleted.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-3 rounded-xl font-semibold transition-all"
              disabled={loading}
            >
              Cancel
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-bold shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? 'Deleting...' : '🗑️ Delete Permanently'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}