import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, ArrowLeft } from 'lucide-react'
import { WEEK_DAYS, DAY_LABELS } from '../../data/storeHours'

function StepHours({ formData, updateFormData, onNext, onBack }) {
  const [sameHoursEveryday, setSameHoursEveryday] = useState(true)

  const updateDefaultHours = (field, value) => {
    const updated = { ...formData.defaultHours, [field]: value }
    updateFormData({ defaultHours: updated })

    if (sameHoursEveryday) {
      const newHours = {}
      WEEK_DAYS.forEach(day => {
        newHours[day] = { open: updated.open, close: updated.close, closed: false }
      })
      updateFormData({ openingHours: newHours })
    }
  }

  const updateDayHours = (day, field, value) => {
    updateFormData({
      openingHours: {
        ...formData.openingHours,
        [day]: {
          ...formData.openingHours[day],
          [field]: value
        }
      }
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          When are you open?
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your business hours
        </p>
      </div>

      <div className="space-y-6">
        {/* Same Hours Toggle */}
        <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer">
          <input
            type="checkbox"
            checked={sameHoursEveryday}
            onChange={(e) => setSameHoursEveryday(e.target.checked)}
            className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
          />
          <span className="font-semibold text-gray-900 dark:text-white">Same hours everyday</span>
        </label>

        {sameHoursEveryday ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Open</label>
              <input
                type="time"
                value={formData.defaultHours.open}
                onChange={(e) => updateDefaultHours('open', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Close</label>
              <input
                type="time"
                value={formData.defaultHours.close}
                onChange={(e) => updateDefaultHours('close', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
            {WEEK_DAYS.map(day => (
              <div key={day} className="flex items-center gap-3">
                <div className="w-24 font-semibold text-gray-900 dark:text-white text-sm">{DAY_LABELS[day]}</div>
                <input
                  type="time"
                  value={formData.openingHours[day].open}
                  onChange={(e) => updateDayHours(day, 'open', e.target.value)}
                  disabled={formData.openingHours[day].closed}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white disabled:opacity-50"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="time"
                  value={formData.openingHours[day].close}
                  onChange={(e) => updateDayHours(day, 'close', e.target.value)}
                  disabled={formData.openingHours[day].closed}
                  className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white disabled:opacity-50"
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.openingHours[day].closed}
                    onChange={(e) => updateDayHours(day, 'closed', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Closed</span>
                </label>
              </div>
            ))}
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

export default StepHours