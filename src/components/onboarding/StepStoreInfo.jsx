// src/components/onboarding/StepStoreInfo.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Store, Tag, Search, ArrowRight, ChevronLeft } from 'lucide-react'
import { BUSINESS_TYPES } from '../../data/businessTypes'

function StepStoreInfo({ formData, updateFormData, onNext }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [error, setError] = useState('')

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat)
    setSearchQuery('')
    updateFormData({ businessCategory: cat.label, businessType: '' })
  }

  const handleSubcategorySelect = (sub) => {
    updateFormData({ businessType: sub })
  }

  const handleBack = () => {
    setSelectedCategory(null)
    updateFormData({ businessCategory: '', businessType: '' })
  }

  const handleNext = () => {
    if (!formData.storeName.trim()) {
      setError('Please enter your store name')
      return
    }
    if (!formData.businessCategory) {
      setError('Please select a business category')
      return
    }
    if (!formData.businessType) {
      setError('Please select a business type')
      return
    }
    setError('')
    onNext()
  }

  const isSearching = searchQuery.trim().length > 0

  const searchResults = isSearching
    ? BUSINESS_TYPES.flatMap((cat) =>
        cat.subcategories
          .filter((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((sub) => ({ sub, catLabel: cat.label, cat }))
      )
    : []

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

        {/* Business Type Picker */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            <Tag size={18} className="text-primary-600 dark:text-primary-400" />
            Business Type
          </label>

          {/* Search Bar */}
          <div className="mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search business types..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
          </div>

          {/* Selected Summary */}
          {formData.businessCategory && formData.businessType && !isSearching && (
            <p className="mb-2 text-sm text-primary-600 dark:text-primary-400 font-medium">
              Selected: {formData.businessCategory} &gt; {formData.businessType}
            </p>
          )}

          <div className="max-h-72 overflow-y-auto border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700">

            {/* Search Results View */}
            {isSearching && (
              <div className="p-3">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No results found</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(
                      searchResults.reduce((acc, { sub, catLabel, cat }) => {
                        if (!acc[catLabel]) acc[catLabel] = { cat, subs: [] }
                        acc[catLabel].subs.push(sub)
                        return acc
                      }, {})
                    ).map(([catLabel, { cat, subs }]) => (
                      <div key={catLabel}>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 px-1">
                          {catLabel}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {subs.map((sub) => {
                            const isSelected = formData.businessType === sub
                            return (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => {
                                  handleCategorySelect(cat)
                                  handleSubcategorySelect(sub)
                                  updateFormData({ businessCategory: cat.label, businessType: sub })
                                  setSearchQuery('')
                                }}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold text-left transition-all min-h-[44px] ${
                                  isSelected
                                    ? 'bg-primary-600 dark:bg-primary-600 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-500'
                                }`}
                              >
                                {sub}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Category View */}
            {!isSearching && !selectedCategory && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {BUSINESS_TYPES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold text-left transition-all min-h-[44px] ${
                      formData.businessCategory === cat.label
                        ? 'bg-primary-600 dark:bg-primary-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-500'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* Subcategory View */}
            {!isSearching && selectedCategory && (
              <div className="p-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3 min-h-[44px]"
                >
                  <ChevronLeft size={16} />
                  Back to categories
                </button>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-1">
                  {selectedCategory.label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCategory.subcategories.map((sub) => {
                    const isSelected = formData.businessType === sub
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubcategorySelect(sub)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold text-left transition-all min-h-[44px] ${
                          isSelected
                            ? 'bg-primary-600 dark:bg-primary-600 text-white shadow-md'
                            : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-500'
                        }`}
                      >
                        {sub}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
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