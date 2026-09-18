// src/components/onboarding/ServiceStepProfessionalInfo.jsx
import { motion } from 'framer-motion'
import { HiArrowLeft, HiArrowRight, HiBriefcase } from 'react-icons/hi'

const RESPONSE_TIME_OPTIONS = [
  { value: 'within_15_min', label: '15 minutes' },
  { value: 'within_30_min', label: '30 minutes' },
  { value: 'within_1_hour', label: '1 hour' },
  { value: 'within_2_3_hours', label: '2-3 hours' },
  { value: 'same_day', label: 'Same day' },
]

function ServiceStepProfessionalInfo({ formData, updateFormData, onNext, onBack }) {
  const inputClass =
    'w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-6">
        <HiBriefcase size={24} className="text-primary-600 dark:text-primary-400 mb-3" />
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
          Professional Details
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Help customers trust you more
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Visit / Consultation Charge (৳)
          </label>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
            Amount you charge just to visit the customer
          </p>
          <input
            type="number"
            value={formData.visitCharge || ''}
            onChange={(e) => updateFormData({ visitCharge: e.target.value })}
            placeholder="e.g. 300"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Years of Experience
          </label>
          <input
            type="number"
            value={formData.experience || ''}
            onChange={(e) => updateFormData({ experience: e.target.value })}
            placeholder="e.g. 5"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Completed Jobs (approximate)
          </label>
          <input
            type="number"
            value={formData.completedJobs || ''}
            onChange={(e) => updateFormData({ completedJobs: e.target.value })}
            placeholder="e.g. 150"
            className={inputClass}
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
            Typical Response Time
          </label>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
            How quickly do you usually respond to customers?
          </p>
          <div className="flex flex-wrap gap-2">
            {RESPONSE_TIME_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateFormData({ responseTime: opt.value })}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  formData.responseTime === opt.value
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500">
          All fields are optional. You can fill these later from your dashboard.
        </p>

        <div className="flex gap-3 mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-xl shadow flex items-center justify-center gap-2 transition-all"
          >
            <HiArrowLeft size={20} />
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            Continue
            <HiArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ServiceStepProfessionalInfo