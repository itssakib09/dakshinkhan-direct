import { useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Search, ArrowRight, ArrowLeft } from 'lucide-react'
import { SERVICE_CATEGORIES } from '../../data/serviceTypes'

function ServiceStepServices({ formData, updateFormData, onNext, onBack }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState('')

  const filteredServices = SERVICE_CATEGORIES.filter(service =>
    service.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleService = (service) => {
    const current = formData.servicesOffered || []
    if (current.includes(service)) {
      updateFormData({ servicesOffered: current.filter(s => s !== service) })
    } else {
      updateFormData({ servicesOffered: [...current, service] })
    }
  }

  const handleNext = () => {
    if (!formData.servicesOffered || formData.servicesOffered.length === 0) {
      setError('Please select at least one service')
      return
    }
    setError('')
    onNext()
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Services You Offer
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select all services you provide
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>

          <div className="max-h-64 overflow-y-auto border-2 border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredServices.map((service) => {
                const isSelected = formData.servicesOffered?.includes(service)
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleService(service)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-500'
                    }`}
                  >
                    {service}
                  </button>
                )
              })}
            </div>
          </div>

          {formData.servicesOffered && formData.servicesOffered.length > 0 && (
            <p className="mt-3 text-sm text-primary-600 dark:text-primary-400 font-medium">
              {formData.servicesOffered.length} service{formData.servicesOffered.length !== 1 ? 's' : ''} selected
            </p>
          )}
        </div>

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

export default ServiceStepServices