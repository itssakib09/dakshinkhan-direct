import { useState } from 'react'
import { motion } from 'framer-motion'
import { Store, Tag, Search, ArrowRight } from 'lucide-react'
import { BUSINESS_TYPES } from '../../data/businessTypes'

function StepStoreInfo({ formData, updateFormData, onNext }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  const filteredTypes = BUSINESS_TYPES.filter(type =>
    type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleNext = () => {
    if (!formData.storeName.trim()) {
      setError('Please enter your store name')
      return
    }
    if (!formData.businessType) {
      setError('Please select your business type')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Tell us about your business
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          This helps customers find you easily
        </p>
      </div>

      <div className="space-y-6">
        {/* Store Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            <Store size={18} className="text-primary-600 dark:text-primary-400" />
            Store Name
          </label>
          <input
            type="text"
            value={formData.storeName}
            onChange={(e) => updateFormData({ storeName: e.target.value })}
            placeholder="e.g. Dakshinkhan Grocery Store"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>

        {/* Business Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            <Tag size={18} className="text-primary-600 dark:text-primary-400" />
            Business Type
          </label>

          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business types..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredTypes.map((type) => {
                const isSelected = formData.businessType === type
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => updateFormData({ businessType: type })}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-500'
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </div>

          {formData.businessType && (
            <p className="mt-2 text-sm text-primary-600 dark:text-primary-400 font-medium">
              Selected: {formData.businessType}
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          Continue
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  )
}

export default StepStoreInfo