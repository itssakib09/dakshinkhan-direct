import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { updateListing } from '../../services/listingService'

export default function EditListingModal({ listing, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    unit: 'piece',
    phone: '',
    email: '',
    address: '',
    tags: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        price: listing.price || '',
        unit: listing.unit || 'piece',
        phone: listing.phone || '',
        email: listing.email || '',
        address: listing.address || '',
        tags: listing.tags?.join(', ') || ''
      })
    }
  }, [listing])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        unit: formData.unit,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      }

      await updateListing(listing.id, updateData)
      
      if (onSuccess) onSuccess()
      onClose()
    } catch (err) {
      console.error('Error updating listing:', err)
      setError(err.message || 'Failed to update listing')
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
        className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-gray-700"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Edit Listing</h2>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-400"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Price * (৳)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="৳ 0"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Unit</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="piece">Piece (পিস)</option>
                <option value="kg">Kilogram (কেজি)</option>
                <option value="liter">Liter (লিটার)</option>
                <option value="dozen">Dozen (ডজন)</option>
                <option value="service">Service (সেবা)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Address *</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="House/Shop no., Road, Dakshinkhan, Dhaka"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+8801XXXXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="medicine, health, emergency"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
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
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl font-bold shadow-lg transition-all"
              disabled={loading}
            >
              {loading ? 'Saving...' : '✅ Save Changes'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}