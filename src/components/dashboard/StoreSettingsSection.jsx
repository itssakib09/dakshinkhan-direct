import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Store, MapPin, Clock, Eye, EyeOff, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { updateUserProfile } from '../../services/userService'
import { LOCATIONS, ALL_AREAS_VALUE, ALL_AREAS_LABEL } from '../../data/locations'
import { BUSINESS_TYPES } from '../../data/businessTypes'
import { WEEK_DAYS, DAY_LABELS } from '../../data/storeHours'

function StoreSettingsSection() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [sameHoursEveryday, setSameHoursEveryday] = useState(true)

  const [formData, setFormData] = useState({
    storeName: '',
    storePhone: '',
    businessType: '',
    serviceAreas: [],
    openingHours: {
      monday: { open: '09:00', close: '18:00', closed: false },
      tuesday: { open: '09:00', close: '18:00', closed: false },
      wednesday: { open: '09:00', close: '18:00', closed: false },
      thursday: { open: '09:00', close: '18:00', closed: false },
      friday: { open: '09:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '18:00', closed: false },
      sunday: { open: '09:00', close: '18:00', closed: false },
    },
    defaultHours: { open: '09:00', close: '18:00' },
    storeActive: true,
  })

  useEffect(() => {
    if (userProfile?.storeSettings) {
      setFormData({
        storeName: userProfile.storeSettings.storeName || '',
        storePhone: userProfile.storeSettings.storePhone || '',
        businessType: userProfile.storeSettings.businessType || '',
        serviceAreas: userProfile.storeSettings.serviceAreas || [],
        openingHours: userProfile.storeSettings.openingHours || formData.openingHours,
        defaultHours: userProfile.storeSettings.defaultHours || { open: '09:00', close: '18:00' },
        storeActive: userProfile.storeSettings.storeActive !== undefined ? userProfile.storeSettings.storeActive : true,
      })
    }
  }, [userProfile])

  const updateDefaultHours = (field, value) => {
    const updated = { ...formData.defaultHours, [field]: value }
    setFormData(prev => ({ ...prev, defaultHours: updated }))

    if (sameHoursEveryday) {
      const newHours = {}
      WEEK_DAYS.forEach(day => {
        newHours[day] = { open: updated.open, close: updated.close, closed: false }
      })
      setFormData(prev => ({ ...prev, openingHours: newHours }))
    }
  }

  const updateDayHours = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }))
  }

  const toggleArea = (area) => {
    if (area === ALL_AREAS_VALUE) {
      setFormData(prev => ({
        ...prev,
        serviceAreas: prev.serviceAreas.includes(ALL_AREAS_VALUE) ? [] : [ALL_AREAS_VALUE]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        serviceAreas: prev.serviceAreas.includes(ALL_AREAS_VALUE)
          ? [area]
          : prev.serviceAreas.includes(area)
            ? prev.serviceAreas.filter(a => a !== area)
            : [...prev.serviceAreas, area]
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.storeName.trim()) {
      setError('Store name is required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await updateUserProfile(currentUser.uid, {
        storeSettings: formData
      })

      await refreshUserProfile()
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving store settings:', err)
      setError('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getAreaDisplay = () => {
    if (formData.serviceAreas?.includes(ALL_AREAS_VALUE)) {
      return ALL_AREAS_LABEL
    }
    if (formData.serviceAreas?.length > 3) {
      return `${formData.serviceAreas.slice(0, 3).join(', ')} +${formData.serviceAreas.length - 3} more`
    }
    return formData.serviceAreas?.join(', ') || 'None selected'
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Store Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your business information</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl mb-6"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl mb-6"
        >
          Settings saved successfully!
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Store className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Basic Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                Store Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
                placeholder="Your business name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                Business Type
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="">Select business type</option>
                {BUSINESS_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                Store Phone
              </label>
              <input
                type="tel"
                value={formData.storePhone}
                onChange={(e) => setFormData(prev => ({ ...prev, storePhone: e.target.value }))}
                placeholder="+880 XXX-XXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Service Areas</h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Currently serving: <span className="font-bold text-primary-600 dark:text-primary-400">{getAreaDisplay()}</span>
          </p>

          <motion.button
            type="button"
            onClick={() => toggleArea(ALL_AREAS_VALUE)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full px-6 py-4 rounded-xl font-bold mb-4 transition-all ${
              formData.serviceAreas.includes(ALL_AREAS_VALUE)
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {ALL_AREAS_LABEL}
          </motion.button>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {LOCATIONS.map(area => (
              <motion.button
                key={area}
                type="button"
                onClick={() => toggleArea(area)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={formData.serviceAreas.includes(ALL_AREAS_VALUE)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  formData.serviceAreas.includes(area)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                } ${formData.serviceAreas.includes(ALL_AREAS_VALUE) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {area}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Opening Hours</h3>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">When are you open?</p>

          <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={sameHoursEveryday}
              onChange={(e) => setSameHoursEveryday(e.target.checked)}
              className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <span className="font-semibold text-gray-900 dark:text-white">Same hours everyday</span>
          </label>

          {sameHoursEveryday ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="space-y-3">
              {WEEK_DAYS.map(day => (
                <div key={day} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="w-full sm:w-24 font-semibold text-gray-900 dark:text-white text-sm">
                    {DAY_LABELS[day]}
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="time"
                      value={formData.openingHours[day].open}
                      onChange={(e) => updateDayHours(day, 'open', e.target.value)}
                      disabled={formData.openingHours[day].closed}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                    <input
                      type="time"
                      value={formData.openingHours[day].close}
                      onChange={(e) => updateDayHours(day, 'close', e.target.value)}
                      disabled={formData.openingHours[day].closed}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={formData.openingHours[day].closed}
                      onChange={(e) => updateDayHours(day, 'closed', e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Closed</span>
                  </label>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Eye className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Store Visibility</h3>
          </div>
          
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                {formData.storeActive ? 'Store is Visible' : 'Store is Hidden'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formData.storeActive ? 'Customers can see your store' : 'Your store is hidden from customers'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, storeActive: !prev.storeActive }))}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                formData.storeActive ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                formData.storeActive ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </button>
          </div>
        </motion.div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={saving}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {saving ? 'Saving Changes...' : 'Save Changes'}
        </motion.button>
      </form>
    </div>
  )
}

export default StoreSettingsSection