import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Store, Save, MapPin, Clock, Eye, EyeOff, Phone, Tag, ChevronDown, Search, Globe } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getUserProfile, updateUserProfile } from '../../services/userService'
import { BUSINESS_TYPES } from '../../data/businessTypes'
import { WEEK_DAYS, DAY_LABELS } from '../../data/storeHours'
import { LOCATIONS, ALL_AREAS_VALUE, ALL_AREAS_LABEL } from '../../data/locations'

function StoreSettingsSection() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showCustomHours, setShowCustomHours] = useState(false)
  const [sameHoursEveryday, setSameHoursEveryday] = useState(true)
  const [areaSearch, setAreaSearch] = useState('')

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
      sunday: { open: '09:00', close: '18:00', closed: true },
    },
    defaultHours: { open: '09:00', close: '18:00' },
    storeActive: true,
  })

  useEffect(() => {
    loadStoreSettings()
  }, [currentUser])

  async function loadStoreSettings() {
    if (!currentUser) return

    setLoading(true)
    try {
      const profile = await getUserProfile(currentUser.uid)
      
      if (profile?.storeSettings) {
        setFormData({
          storeName: profile.storeSettings.storeName || '',
          storePhone: profile.storeSettings.storePhone || '',
          businessType: profile.storeSettings.businessType || '',
          serviceAreas: profile.storeSettings.serviceAreas || [],
          openingHours: profile.storeSettings.openingHours || formData.openingHours,
          defaultHours: profile.storeSettings.defaultHours || { open: '09:00', close: '18:00' },
          storeActive: profile.storeSettings.storeActive !== undefined ? profile.storeSettings.storeActive : true,
        })
      }
    } catch (err) {
      setError('Failed to load store settings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  function toggleServiceArea(area) {
    setFormData(prev => {
      if (area === ALL_AREAS_VALUE) {
        if (prev.serviceAreas.includes(ALL_AREAS_VALUE)) {
          return { ...prev, serviceAreas: [] }
        }
        return { ...prev, serviceAreas: [ALL_AREAS_VALUE] }
      }

      const withoutAll = prev.serviceAreas.filter(a => a !== ALL_AREAS_VALUE)
      
      if (withoutAll.includes(area)) {
        return { ...prev, serviceAreas: withoutAll.filter(a => a !== area) }
      } else {
        return { ...prev, serviceAreas: [...withoutAll, area] }
      }
    })
  }

  function updateDefaultHours(field, value) {
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

  function updateDayHours(day, field, value) {
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

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!formData.storeName.trim()) {
      setError('Store name is required')
      return
    }

    if (formData.serviceAreas.length === 0) {
      setError('Please select at least one service area')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await updateUserProfile(currentUser.uid, {
        storeSettings: formData
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('Failed to save settings')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const filteredAreas = LOCATIONS.filter(area =>
    area.toLowerCase().includes(areaSearch.toLowerCase())
  )

  const isAllAreasSelected = formData.serviceAreas.includes(ALL_AREAS_VALUE)

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2">Store Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your business information</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Store Name */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Store className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-900 dark:text-white">Store Name</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your business display name</p>
              </div>
            </div>
            <input
              type="text"
              value={formData.storeName}
              onChange={(e) => setFormData(prev => ({ ...prev, storeName: e.target.value }))}
              placeholder="e.g. Dakshinkhan Grocery Store"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Phone */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Phone className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-900 dark:text-white">Phone Number</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Contact number for customers</p>
              </div>
            </div>
            <input
              type="tel"
              value={formData.storePhone}
              onChange={(e) => setFormData(prev => ({ ...prev, storePhone: e.target.value }))}
              placeholder="01712345678"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Business Type */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Tag className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-900 dark:text-white">Business Type</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Category of your business</p>
              </div>
            </div>
            <select
              value={formData.businessType}
              onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Select business type</option>
              {BUSINESS_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Service Areas */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <MapPin className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-900 dark:text-white">Service Areas</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Where you provide service</p>
              </div>
            </div>

            {/* All Areas Toggle */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleServiceArea(ALL_AREAS_VALUE)}
              className={`w-full mb-4 rounded-xl p-4 border-2 transition-all ${
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
                <div className="mb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={areaSearch}
                      onChange={(e) => setAreaSearch(e.target.value)}
                      placeholder="Search areas..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-xl p-3 bg-gray-50 dark:bg-gray-700">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {filteredAreas.map(area => {
                      const isSelected = formData.serviceAreas.includes(area)
                      return (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleServiceArea(area)}
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

                {formData.serviceAreas.length > 0 && (
                  <p className="mt-3 text-sm text-primary-600 dark:text-primary-400 font-medium">
                    {formData.serviceAreas.length} area{formData.serviceAreas.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </>
            )}
          </div>

          {/* Opening Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Clock className="text-primary-600 dark:text-primary-400" size={20} />
              </div>
              <div>
                <h3 className="font-black text-lg text-gray-900 dark:text-white">Opening Hours</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">When are you open?</p>
              </div>
            </div>

            {/* Same Hours Toggle */}
            <label className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-4 cursor-pointer">
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
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Close</label>
                  <input
                    type="time"
                    value={formData.defaultHours.close}
                    onChange={(e) => updateDefaultHours('close', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {WEEK_DAYS.map(day => (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24 font-semibold text-gray-900 dark:text-white text-sm">{DAY_LABELS[day]}</div>
                    <input
                      type="time"
                      value={formData.openingHours[day].open}
                      onChange={(e) => updateDayHours(day, 'open', e.target.value)}
                      disabled={formData.openingHours[day].closed}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white disabled:opacity-50"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="time"
                      value={formData.openingHours[day].close}
                      onChange={(e) => updateDayHours(day, 'close', e.target.value)}
                      disabled={formData.openingHours[day].closed}
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white disabled:opacity-50"
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
          </div>

          {/* Visibility Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  {formData.storeActive ? <Eye className="text-primary-600 dark:text-primary-400" size={20} /> : <EyeOff className="text-gray-400" size={20} />}
                </div>
                <div>
                  <h3 className="font-black text-lg text-gray-900 dark:text-white">Store Visibility</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formData.storeActive ? 'Your store is visible to customers' : 'Your store is hidden'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, storeActive: !prev.storeActive }))}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  formData.storeActive ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                  formData.storeActive ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl">
              <p className="font-semibold">Settings saved successfully!</p>
            </div>
          )}

          {/* Save Button */}
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default StoreSettingsSection