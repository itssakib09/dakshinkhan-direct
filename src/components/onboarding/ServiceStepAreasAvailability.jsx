import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  HiLocationMarker, HiClock,
  HiArrowLeft, HiArrowRight
} from 'react-icons/hi'
import { LOCATIONS, ALL_AREAS_VALUE, ALL_AREAS_LABEL } from '../../data/locations'
import { WEEK_DAYS, DAY_LABELS } from '../../data/storeHours'

function ServiceStepAreasAvailability({ formData, updateFormData, onNext, onBack }) {
  const [searchArea, setSearchArea] = useState('')
  const [sameHoursEveryday, setSameHoursEveryday] = useState(true)
  const [error, setError] = useState('')
  const [defaultHours, setDefaultHours] = useState({ open: '09:00', close: '18:00' })

  const filteredAreas = LOCATIONS.filter(area =>
    area.toLowerCase().includes(searchArea.toLowerCase())
  )

  const toggleArea = (area) => {
    if (area === ALL_AREAS_VALUE) {
      updateFormData({
        coverageAreas: formData.coverageAreas.includes(ALL_AREAS_VALUE) ? [] : [ALL_AREAS_VALUE]
      })
    } else if (formData.coverageAreas.includes(ALL_AREAS_VALUE)) {
      updateFormData({ coverageAreas: [area] })
    } else if (formData.coverageAreas.includes(area)) {
      updateFormData({
        coverageAreas: formData.coverageAreas.filter(a => a !== area)
      })
    } else {
      updateFormData({
        coverageAreas: [...formData.coverageAreas, area]
      })
    }
  }

  const updateDefaultHours = (field, value) => {
    setDefaultHours(prev => ({ ...prev, [field]: value }))
    const newSchedule = {}
    WEEK_DAYS.forEach(day => {
      newSchedule[day] = {
        ...formData.availability.schedule[day],
        [field]: value
      }
    })
    updateFormData({
      availability: {
        ...formData.availability,
        schedule: newSchedule
      }
    })
  }

  const updateDayHours = (day, field, value) => {
    updateFormData({
      availability: {
        ...formData.availability,
        schedule: {
          ...formData.availability.schedule,
          [day]: {
            ...formData.availability.schedule[day],
            [field]: value
          }
        }
      }
    })
  }

  const toggleAvailableNow = () => {
    updateFormData({
      availability: {
        ...formData.availability,
        availableNow: !formData.availability.availableNow
      }
    })
  }

  const handleNext = () => {
    if (!formData.coverageAreas?.length) {
      setError('Please select at least one area')
      return
    }
    setError('')
    onNext()
  }

  const isAllAreasSelected = formData.coverageAreas?.includes(ALL_AREAS_VALUE)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
        Areas & Availability
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Where do you work and when are you available?
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <HiLocationMarker size={18} className="text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-black text-gray-900 dark:text-white">Coverage Areas</span>
        </div>

        <button
          type="button"
          onClick={() => toggleArea(ALL_AREAS_VALUE)}
          className={`w-full px-4 py-3 rounded-xl font-bold mb-3 transition-all ${
            isAllAreasSelected
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          {ALL_AREAS_LABEL}
        </button>

        <input
          type="text"
          value={searchArea}
          onChange={(e) => setSearchArea(e.target.value)}
          placeholder="Search areas..."
          className="w-full px-4 py-2.5 mb-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white"
        />

        <div className="max-h-52 overflow-y-auto scrollbar-hide grid grid-cols-2 gap-2">
          {filteredAreas.map((area) => {
            const isSelected = formData.coverageAreas?.includes(area)
            const isDisabled = isAllAreasSelected
            return (
              <button
                key={area}
                type="button"
                onClick={() => toggleArea(area)}
                disabled={isDisabled}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {area}
              </button>
            )
          })}
        </div>

        {formData.coverageAreas && formData.coverageAreas.length > 0 && !isAllAreasSelected && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            {formData.coverageAreas.length} areas selected
          </p>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <HiClock size={18} className="text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-black text-gray-900 dark:text-white">Availability</span>
        </div>

        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-xl mb-4">
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">Available Now</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Accept new service requests</p>
          </div>
          <button
            type="button"
            onClick={toggleAvailableNow}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              formData.availability.availableNow ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
              formData.availability.availableNow ? 'translate-x-7' : 'translate-x-0'
            }`} />
          </button>
        </div>

        <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={sameHoursEveryday}
            onChange={(e) => setSameHoursEveryday(e.target.checked)}
            className="w-5 h-5 text-primary-600 rounded"
          />
          <span className="font-semibold text-sm text-gray-900 dark:text-white">Same hours everyday</span>
        </label>

        {sameHoursEveryday ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Open</label>
              <input
                type="time"
                value={defaultHours.open}
                onChange={(e) => updateDefaultHours('open', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Close</label>
              <input
                type="time"
                value={defaultHours.close}
                onChange={(e) => updateDefaultHours('close', e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-2 p-2.5 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div className="w-full sm:w-20 font-semibold text-xs text-gray-900 dark:text-white">
                  {DAY_LABELS[day]}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={formData.availability.schedule[day].open}
                    onChange={(e) => updateDayHours(day, 'open', e.target.value)}
                    disabled={formData.availability.schedule[day].closed}
                    className="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white disabled:opacity-50"
                  />
                  <span className="text-gray-400 dark:text-gray-500">-</span>
                  <input
                    type="time"
                    value={formData.availability.schedule[day].close}
                    onChange={(e) => updateDayHours(day, 'close', e.target.value)}
                    disabled={formData.availability.schedule[day].closed}
                    className="flex-1 px-2 py-1.5 text-xs bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white disabled:opacity-50"
                  />
                </div>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={formData.availability.schedule[day].closed}
                    onChange={(e) => updateDayHours(day, 'closed', e.target.checked)}
                    className="w-4 h-4 text-primary-600 rounded"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Closed</span>
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-semibold">
          {error}
        </p>
      )}

      <div className="flex gap-3 mt-6">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-xl shadow flex items-center justify-center gap-2"
        >
          <HiArrowLeft size={20} />
          Back
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="flex-1 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2"
        >
          Continue
          <HiArrowRight size={20} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ServiceStepAreasAvailability