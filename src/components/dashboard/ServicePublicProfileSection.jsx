import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, Save, X, Plus, Trash2, MapPin, Clock, DollarSign, Briefcase, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { updateUserProfile } from '../../services/userService'
import { LOCATIONS, ALL_AREAS_VALUE, ALL_AREAS_LABEL } from '../../data/locations'
import { SERVICE_CATEGORIES } from '../../data/serviceTypes'
import { WEEK_DAYS, DAY_LABELS } from '../../data/storeHours'

function ServicePublicProfileSection() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [searchService, setSearchService] = useState('')
  const [searchArea, setSearchArea] = useState('')
  const [sameHoursEveryday, setSameHoursEveryday] = useState(true)

  const [formData, setFormData] = useState({
    coverPhoto: '',
    profilePhoto: '',
    profession: '',
    bio: '',
    servicesOffered: [],
    pricing: [],
    coverageAreas: [],
    availability: {
      availableNow: true,
      schedule: {
        monday: { open: '09:00', close: '18:00', closed: false },
        tuesday: { open: '09:00', close: '18:00', closed: false },
        wednesday: { open: '09:00', close: '18:00', closed: false },
        thursday: { open: '09:00', close: '18:00', closed: false },
        friday: { open: '09:00', close: '18:00', closed: false },
        saturday: { open: '09:00', close: '18:00', closed: false },
        sunday: { open: '09:00', close: '18:00', closed: false },
      }
    },
    defaultHours: { open: '09:00', close: '18:00' }
  })

  useEffect(() => {
    if (userProfile?.serviceProfile) {
      const profile = userProfile.serviceProfile
      
      // Initialize availability with proper structure
      let availability = {
        availableNow: profile.availability?.availableNow !== undefined 
          ? profile.availability.availableNow 
          : true,
        schedule: {}
      }

      // Convert old format or initialize with defaults
      WEEK_DAYS.forEach(day => {
        if (profile.availability?.schedule?.[day]) {
          const daySchedule = profile.availability.schedule[day]
          
          // Handle both old format (hours string) and new format (open/close)
          if (daySchedule.open && daySchedule.close) {
            availability.schedule[day] = {
              open: daySchedule.open,
              close: daySchedule.close,
              closed: daySchedule.closed || false
            }
          } else if (daySchedule.hours) {
            // Convert old format "9 AM - 6 PM" to new format
            const [openStr, closeStr] = daySchedule.hours.split(' - ')
            availability.schedule[day] = {
              open: convertTo24Hour(openStr) || '09:00',
              close: convertTo24Hour(closeStr) || '18:00',
              closed: !daySchedule.available
            }
          } else {
            // Default values
            availability.schedule[day] = {
              open: '09:00',
              close: '18:00',
              closed: false
            }
          }
        } else {
          // No existing data, use defaults
          availability.schedule[day] = {
            open: '09:00',
            close: '18:00',
            closed: false
          }
        }
      })

      setFormData({
        coverPhoto: profile.coverPhoto || '',
        profilePhoto: profile.profilePhoto || '',
        profession: profile.profession || '',
        bio: profile.bio || '',
        servicesOffered: profile.servicesOffered || [],
        pricing: profile.pricing || [],
        coverageAreas: profile.coverageAreas || [],
        availability: availability,
        defaultHours: profile.defaultHours || { open: '09:00', close: '18:00' }
      })
    }
  }, [userProfile])

  // Helper function to convert 12-hour format to 24-hour
  const convertTo24Hour = (timeStr) => {
    if (!timeStr) return null
    
    const match = timeStr.match(/(\d+):?(\d*)\s*(AM|PM)/i)
    if (!match) return null
    
    let hours = parseInt(match[1])
    const minutes = match[2] || '00'
    const period = match[3].toUpperCase()
    
    if (period === 'PM' && hours !== 12) {
      hours += 12
    } else if (period === 'AM' && hours === 12) {
      hours = 0
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`
  }

  const handleCoverPhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, coverPhoto: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfilePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleService = (service) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(service)
        ? prev.servicesOffered.filter(s => s !== service)
        : [...prev.servicesOffered, service]
    }))
  }

  const addPricing = () => {
    setFormData(prev => ({
      ...prev,
      pricing: [...prev.pricing, { name: '', price: 0 }]
    }))
  }

  const updatePricing = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removePricing = (index) => {
    setFormData(prev => ({
      ...prev,
      pricing: prev.pricing.filter((_, i) => i !== index)
    }))
  }

  const toggleArea = (area) => {
    if (area === ALL_AREAS_VALUE) {
      setFormData(prev => ({
        ...prev,
        coverageAreas: prev.coverageAreas.includes(ALL_AREAS_VALUE) ? [] : [ALL_AREAS_VALUE]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        coverageAreas: prev.coverageAreas.includes(ALL_AREAS_VALUE)
          ? [area]
          : prev.coverageAreas.includes(area)
            ? prev.coverageAreas.filter(a => a !== area)
            : [...prev.coverageAreas, area]
      }))
    }
  }

  const updateDefaultHours = (field, value) => {
    const updated = { ...formData.defaultHours, [field]: value }
    setFormData(prev => ({ ...prev, defaultHours: updated }))

    if (sameHoursEveryday) {
      const newSchedule = {}
      WEEK_DAYS.forEach(day => {
        newSchedule[day] = { open: updated.open, close: updated.close, closed: false }
      })
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          schedule: newSchedule
        }
      }))
    }
  }

  const updateDayHours = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        schedule: {
          ...prev.availability.schedule,
          [day]: {
            ...prev.availability.schedule[day],
            [field]: value
          }
        }
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.profession.trim()) {
      setError('Profession is required')
      return
    }

    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      await updateUserProfile(currentUser.uid, {
        serviceProfile: formData
      })

      await refreshUserProfile()
      
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving public profile:', err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const filteredServices = SERVICE_CATEGORIES.filter(service =>
    service.toLowerCase().includes(searchService.toLowerCase())
  )

  const filteredAreas = LOCATIONS.filter(area =>
    area.toLowerCase().includes(searchArea.toLowerCase())
  )

  const getProfileCompletion = () => {
    let completed = 0
    let total = 7
    
    if (formData.coverPhoto) completed++
    if (formData.profilePhoto) completed++
    if (formData.profession) completed++
    if (formData.bio) completed++
    if (formData.servicesOffered.length > 0) completed++
    if (formData.coverageAreas.length > 0) completed++
    if (formData.availability.availableNow !== undefined) completed++
    
    return Math.round((completed / total) * 100)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Public Profile</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">This is what customers see when they view your profile</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 rounded-2xl p-6 mb-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">Profile Completion</h3>
          <span className="text-white text-2xl font-black">{getProfileCompletion()}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProfileCompletion()}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="bg-white h-full rounded-full"
          />
        </div>
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
          Profile saved successfully!
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
            <Camera className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Cover Photo</h3>
          </div>
          
          {formData.coverPhoto ? (
            <div className="relative rounded-xl overflow-hidden group">
              <img
                src={formData.coverPhoto}
                alt="Cover"
                className="w-full h-48 object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <label className="cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-gray-900 px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                  >
                    <Upload size={18} />
                    Replace
                  </motion.div>
                  <input type="file" accept="image/*" onChange={handleCoverPhotoUpload} className="hidden" />
                </label>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData(prev => ({ ...prev, coverPhoto: '' }))}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
                >
                  <X size={18} />
                  Remove
                </motion.button>
              </div>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-all group">
              <Upload size={48} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">Click to upload cover photo</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Recommended: 1200x400px</p>
              <input type="file" accept="image/*" onChange={handleCoverPhotoUpload} className="hidden" />
            </label>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <User className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Profile Photo</h3>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {formData.profilePhoto ? (
              <div className="relative group">
                <img
                  src={formData.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary-500"
                />
                <label className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                  <Camera size={24} className="text-white" />
                  <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-all group">
                <Camera size={32} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
                <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} className="hidden" />
              </label>
            )}
            <div className="text-center sm:text-left">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Upload your photo</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Square image, at least 400x400px</p>
              {formData.profilePhoto && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFormData(prev => ({ ...prev, profilePhoto: '' }))}
                  className="text-red-600 dark:text-red-400 text-sm font-semibold hover:underline"
                >
                  Remove photo
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Basic Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                Profession / Service Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                placeholder="e.g., AC Technician, Electrician, Plumber"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                About / Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value.slice(0, 300) }))}
                placeholder="Tell customers about your experience and expertise..."
                rows={4}
                maxLength={300}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formData.bio.length}/300 characters</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Services Offered</h3>
          </div>
          
          <input
            type="text"
            value={searchService}
            onChange={(e) => setSearchService(e.target.value)}
            placeholder="Search services..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all mb-4"
          />
          
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredServices.map(service => (
                <motion.button
                  key={service}
                  type="button"
                  onClick={() => toggleService(service)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    formData.servicesOffered.includes(service)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {service}
                </motion.button>
              ))}
            </div>
          </div>
          
          {formData.servicesOffered.length > 0 && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Selected: <span className="font-bold text-primary-600 dark:text-primary-400">{formData.servicesOffered.length}</span> services
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <DollarSign className="text-primary-600 dark:text-primary-400" size={20} />
              <h3 className="font-black text-lg text-gray-900 dark:text-white">Pricing (Optional)</h3>
            </div>
            <motion.button
              type="button"
              onClick={addPricing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </motion.button>
          </div>
          
          <div className="space-y-3">
            {formData.pricing.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updatePricing(index, 'name', e.target.value)}
                  placeholder="Service name"
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={(e) => updatePricing(index, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="Price"
                  className="w-full sm:w-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
                />
                <motion.button
                  type="button"
                  onClick={() => removePricing(index)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                >
                  <Trash2 size={18} />
                </motion.button>
              </div>
            ))}
            
            {formData.pricing.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
                No pricing added yet. Click "Add" to include service prices.
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Coverage Areas</h3>
          </div>
          
          <motion.button
            type="button"
            onClick={() => toggleArea(ALL_AREAS_VALUE)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full px-6 py-4 rounded-xl font-bold mb-4 transition-all ${
              formData.coverageAreas.includes(ALL_AREAS_VALUE)
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {ALL_AREAS_LABEL}
          </motion.button>
          
          <input
            type="text"
            value={searchArea}
            onChange={(e) => setSearchArea(e.target.value)}
            placeholder="Search areas..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all mb-4"
          />
          
          <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredAreas.map(area => (
                <motion.button
                  key={area}
                  type="button"
                  onClick={() => toggleArea(area)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={formData.coverageAreas.includes(ALL_AREAS_VALUE)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    formData.coverageAreas.includes(area)
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } ${formData.coverageAreas.includes(ALL_AREAS_VALUE) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {area}
                </motion.button>
              ))}
            </div>
          </div>
          
          {formData.coverageAreas.length > 0 && !formData.coverageAreas.includes(ALL_AREAS_VALUE) && (
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Selected: <span className="font-bold text-primary-600 dark:text-primary-400">{formData.coverageAreas.length}</span> areas
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Availability</h3>
          </div>
          
          <div className="flex items-center justify-between mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Available Now</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Accept new service requests</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                availability: { ...prev.availability, availableNow: !prev.availability.availableNow }
              }))}
              className={`relative w-14 h-7 rounded-full transition-colors ${
                formData.availability.availableNow ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                formData.availability.availableNow ? 'translate-x-7' : 'translate-x-0'
              }`} />
            </button>
          </div>

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
                      value={formData.availability.schedule[day].open}
                      onChange={(e) => updateDayHours(day, 'open', e.target.value)}
                      disabled={formData.availability.schedule[day].closed}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-gray-500 dark:text-gray-400">-</span>
                    <input
                      type="time"
                      value={formData.availability.schedule[day].close}
                      onChange={(e) => updateDayHours(day, 'close', e.target.value)}
                      disabled={formData.availability.schedule[day].closed}
                      className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-sm text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={formData.availability.schedule[day].closed}
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

        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={saving}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {saving ? 'Saving Profile...' : 'Save Public Profile'}
        </motion.button>
      </form>
    </div>
  )
}

export default ServicePublicProfileSection