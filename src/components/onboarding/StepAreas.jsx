import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Globe, Search, ArrowRight, ArrowLeft } from 'lucide-react'
import { LOCATIONS, ALL_AREAS_VALUE, ALL_AREAS_LABEL } from '../../data/locations'

function StepAreas({ formData, updateFormData, onNext, onBack }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  const filteredAreas = LOCATIONS.filter(area =>
    area.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleArea = (area) => {
    const serviceAreas = formData.serviceAreas || []

    if (area === ALL_AREAS_VALUE) {
      if (serviceAreas.includes(ALL_AREAS_VALUE)) {
        updateFormData({ serviceAreas: [] })
      } else {
        updateFormData({ serviceAreas: [ALL_AREAS_VALUE] })
      }
      return
    }

    const withoutAll = serviceAreas.filter(a => a !== ALL_AREAS_VALUE)

    if (withoutAll.includes(area)) {
      updateFormData({ serviceAreas: withoutAll.filter(a => a !== area) })
    } else {
      updateFormData({ serviceAreas: [...withoutAll, area] })
    }
  }

  const handleNext = () => {
    if (!formData.serviceAreas || formData.serviceAreas.length === 0) {
      setError('Please select at least one service area')
      return
    }
    setError('')
    onNext()
  }

  const isAllAreasSelected = formData.serviceAreas?.includes(ALL_AREAS_VALUE)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Where do you operate?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select the areas you serve
        </p>
      </div>

      <div className="space-y-6">
        {/* All Areas Option */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => toggleArea(ALL_AREAS_VALUE)}
          className={`w-full rounded-xl p-4 border-2 transition-all ${
            isAllAreasSelected
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 border-primary-700 text-white shadow-lg'
              : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-primary-500'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isAllAreasSelected ? 'bg-white/20' : 'bg-primary-100 dark:bg-primary-900'
              }`}>
                <Globe className={isAllAreasSelected ? 'text-white' : 'text-primary-600 dark:text-primary-400'} size={20} />
              </div>
              <div className="text-left">
                <p className={`text-xs font-semibold uppercase ${
                  isAllAreasSelected ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Serve Everywhere
                </p>
                <p className={`text-base font-bold ${
                  isAllAreasSelected ? 'text-white' : 'text-gray-900 dark:text-white'
                }`}>
                  {ALL_AREAS_LABEL}
                </p>
              </div>
            </div>
          </div>
        </motion.button>

        {/* Specific Areas */}
        {!isAllAreasSelected && (
          <>
            <div>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search areas..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>

              <div className="max-h-64 overflow-y-auto border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {filteredAreas.map((area) => {
                    const isSelected = formData.serviceAreas?.includes(area)
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleArea(area)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          isSelected
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-500'
                        }`}
                      >
                        {area}
                      </button>
                    )
                  })}
                </div>
              </div>

              {formData.serviceAreas && formData.serviceAreas.length > 0 && (
                <p className="mt-3 text-sm text-primary-600 dark:text-primary-400 font-medium">
                  {formData.serviceAreas.length} area{formData.serviceAreas.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-xl shadow flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft size={20} />
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            Continue
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default StepAreas