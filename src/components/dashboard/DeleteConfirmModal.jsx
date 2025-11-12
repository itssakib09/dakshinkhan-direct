import { useState } from 'react'
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Listing</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <p className="text-gray-700 mb-4">
            Are you sure you want to delete <strong>"{listing?.title}"</strong>?
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              ⚠️ This action cannot be undone. All listing data and images will be permanently deleted.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-medium transition"
              disabled={loading}
            >
              {loading ? 'Deleting...' : '🗑️ Delete Permanently'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}