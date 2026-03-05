import { motion } from 'framer-motion'
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react'
import { WEEK_DAYS, DAY_LABELS } from '../../data/storeHours'

function ServiceStepAvailability({ formData, updateFormData, onNext, onBack }) {
  const toggleDayAvailability = (day) => {
    updateFormData({
      availability: {
        ...formData.availability,
        [day]: {
          ...formData.availability[day],
          available: !formData.availability[day].available
        }
      }
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Your Availability
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your working days
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          {WEEK_DAYS.map(day => (
            <div key={day} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => toggleDayAvailability(day)}
                  className={`w-6 h-6 rounded-md border-2 transition-all ${
                    formData.availability[day].available
                      ? 'bg-primary-600 border-primary-600'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {formData.availability[day].available && (
                    <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className="font-semibold text-gray-900 dark:text-white capitalize">{DAY_LABELS[day]}</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {formData.availability[day].hours}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            You can customize working hours for each day later from your dashboard settings.
          </p>
        </div>

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
            onClick={onNext}
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

export default ServiceStepAvailability