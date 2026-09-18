// src/components/dashboard/ServicePublicProfileSection.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HiCamera, HiUpload, HiSave, HiX, HiPlus,
  HiTrash, HiLocationMarker, HiClock,
  HiBriefcase, HiUser, HiPhotograph, HiClipboardList,
  HiBadgeCheck
} from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'
import { updateUserProfile } from '../../services/userService'
import { uploadImage } from '../../utils/uploadImage'
import { serverTimestamp } from 'firebase/firestore'
import { LOCATIONS, ALL_AREAS_VALUE, ALL_AREAS_LABEL } from '../../data/locations'
import { WEEK_DAYS, DAY_LABELS } from '../../data/storeHours'

function ServicePublicProfileSection() {
  const { currentUser, userProfile, refreshUserProfile } = useAuth()
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingProfile, setUploadingProfile] = useState(false)
  const [uploadingRecentWork, setUploadingRecentWork] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [searchArea, setSearchArea] = useState('')
  const [sameHoursEveryday, setSameHoursEveryday] = useState(true)
  const [requestingVerification, setRequestingVerification] = useState(false)

  const [formData, setFormData] = useState({
    coverPhoto: '',
    profilePhoto: '',
    profession: '',
    bio: '',
    servicesOffered: [],
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
    defaultHours: { open: '09:00', close: '18:00' },
    visitCharge: '',
    experience: '',
    completedJobs: '',
    responseTime: '',
    recentWorkPhotos: [],
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
        servicesOffered: (profile.servicesOffered || []).map(s =>
          typeof s === 'string'
            ? { name: s, priceFrom: '', priceTo: '' }
            : s
        ),
        coverageAreas: profile.coverageAreas || [],
        availability: availability,
        defaultHours: profile.defaultHours || { open: '09:00', close: '18:00' },
        visitCharge: profile.visitCharge || '',
        experience: profile.experience || '',
        completedJobs: profile.completedJobs || '',
        responseTime: profile.responseTime || '',
        recentWorkPhotos: profile.recentWorkPhotos || [],
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

  const handleCoverPhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        setUploadingCover(true)
        setError(null)
        const url = await uploadImage(file, `service-profiles/${currentUser.uid}/cover/`, () => {})
        setFormData(prev => ({ ...prev, coverPhoto: url }))
      } catch (error) {
        console.error('Error uploading cover photo:', error)
        setError('Failed to upload cover photo. Please try again.')
      } finally {
        setUploadingCover(false)
      }
    }
  }

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        setUploadingProfile(true)
        setError(null)
        const url = await uploadImage(file, `service-profiles/${currentUser.uid}/profile/`, () => {})
        setFormData(prev => ({ ...prev, profilePhoto: url }))
      } catch (error) {
        console.error('Error uploading profile photo:', error)
        setError('Failed to upload profile photo. Please try again.')
      } finally {
        setUploadingProfile(false)
      }
    }
  }

  const handleRecentWorkUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploadingRecentWork(true)
    setError(null)
    try {
      const urls = await Promise.all(
        files.map(file => uploadImage(
          file,
          `service-profiles/${currentUser.uid}/work/`,
          () => {}
        ))
      )
      setFormData(prev => ({
        ...prev,
        recentWorkPhotos: [...prev.recentWorkPhotos, ...urls].slice(0, 12)
      }))
    } catch (error) {
      console.error('Error uploading work photos:', error)
      setError('Failed to upload photos')
    } finally {
      setUploadingRecentWork(false)
    }
  }

  const removeRecentWorkPhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      recentWorkPhotos: prev.recentWorkPhotos.filter((_, i) => i !== index)
    }))
  }

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: [
        ...prev.servicesOffered,
        { name: '', priceFrom: '', priceTo: '' }
      ]
    }))
  }

  const updateService = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      )
    }))
  }

  const removeService = (index) => {
    setFormData(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.filter((_, i) => i !== index)
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
    setFormData(prev => {
      const newDefaultHours = { ...prev.defaultHours, [field]: value }
      const newSchedule = {}
      WEEK_DAYS.forEach(day => {
        newSchedule[day] = {
          ...prev.availability.schedule[day],
          [field]: value
        }
      })
      return {
        ...prev,
        defaultHours: newDefaultHours,
        availability: {
          ...prev.availability,
          schedule: newSchedule
        }
      }
    })
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
    setError(null)
    setSuccess(false)
    setSaving(true)

    try {
      await updateUserProfile(currentUser.uid, {
        serviceProfile: {
          coverPhoto: formData.coverPhoto,
          profilePhoto: formData.profilePhoto,
          profession: formData.profession,
          professionLower: formData.profession.trim().toLowerCase(),
          bio: formData.bio,
          servicesOffered: formData.servicesOffered,
          coverageAreas: formData.coverageAreas,
          availability: formData.availability,
          visitCharge: formData.visitCharge,
          experience: formData.experience,
          completedJobs: formData.completedJobs,
          responseTime: formData.responseTime,
          recentWorkPhotos: formData.recentWorkPhotos,
        }
      })

      await refreshUserProfile()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleRequestVerification = async () => {
    setRequestingVerification(true)
    setError(null)

    try {
      await updateUserProfile(currentUser.uid, {
        'serviceProfile.verificationRequested': true,
        'serviceProfile.verificationRequestedAt': serverTimestamp(),
        'serviceProfile.verificationRejected': false
      })

      await refreshUserProfile()
    } catch (error) {
      console.error('Error requesting verification:', error)
      setError('Failed to submit verification request. Please try again.')
    } finally {
      setRequestingVerification(false)
    }
  }

  const filteredAreas = LOCATIONS.filter(area =>
    area.toLowerCase().includes(searchArea.toLowerCase())
  )

  const isVerified = userProfile?.serviceProfile?.verified === true
  const isVerificationRequested = userProfile?.serviceProfile?.verificationRequested === true
  const isVerificationRejected = userProfile?.serviceProfile?.verificationRejected === true
  const verificationRejectedReason = userProfile?.serviceProfile?.verificationRejectedReason || ''

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 px-4 py-3 rounded-xl">
            Profile updated successfully!
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiBadgeCheck className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Verification</h3>
          </div>

          {isVerified ? (
            <span className="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full px-4 py-2 text-sm font-bold">
              <HiBadgeCheck size={16} />
              Verified
            </span>
          ) : isVerificationRequested ? (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full px-4 py-2 text-sm font-bold">
              <HiClock size={16} />
              Verification Pending
            </span>
          ) : isVerificationRejected ? (
            <div>
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl px-4 py-3 mb-3">
                <p className="font-bold text-sm mb-1">Verification request declined</p>
                <p className="text-sm">{verificationRejectedReason || 'No reason provided'}</p>
              </div>
              <button
                type="button"
                onClick={handleRequestVerification}
                disabled={requestingVerification}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                {requestingVerification ? 'Submitting...' : 'Request Verification Again'}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Get a verified badge to build customer trust
              </p>
              <button
                type="button"
                onClick={handleRequestVerification}
                disabled={requestingVerification}
                className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-bold transition-colors"
              >
                {requestingVerification ? 'Submitting...' : 'Request Verification'}
              </button>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiCamera className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Photos</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Cover Photo
              </label>
              <div className="relative h-48 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                {formData.coverPhoto ? (
                  <img src={formData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <HiUpload size={48} />
                  </div>
                )}
                {uploadingCover ? (
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-2"></div>
                    <p className="text-white font-semibold">Uploading...</p>
                  </div>
                ) : (
                  <label className="absolute bottom-4 right-4 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-xl cursor-pointer shadow-lg transition-all">
                    <HiCamera size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverPhotoUpload}
                      disabled={uploadingCover}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  {formData.profilePhoto ? (
                    <img src={formData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-500">
                      <HiUser size={32} />
                    </div>
                  )}
                  {uploadingProfile && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                {!uploadingProfile && (
                  <label className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl cursor-pointer shadow-lg transition-all flex items-center gap-2">
                    <HiCamera size={18} />
                    Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      disabled={uploadingProfile}
                      className="hidden"
                    />
                  </label>
                )}
                {uploadingProfile && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Uploading...</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiBriefcase className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Basic Info</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Profession
              </label>
              <input
                type="text"
                value={formData.profession}
                onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                placeholder="e.g., Electrician, Plumber, Tutor"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell customers about yourself and your services..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all resize-none"
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
            <HiBriefcase className="text-primary-600 dark:text-primary-400" size={20} />
            <h3 className="font-black text-lg text-gray-900 dark:text-white">Professional Info</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Visit Charge (৳)
              </label>
              <input
                type="number"
                value={formData.visitCharge}
                onChange={(e) => setFormData(prev => ({ ...prev, visitCharge: e.target.value }))}
                placeholder="e.g. 300"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Years of Experience
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="e.g. 5"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Completed Jobs
              </label>
              <input
                type="number"
                value={formData.completedJobs}
                onChange={(e) => setFormData(prev => ({ ...prev, completedJobs: e.target.value }))}
                placeholder="e.g. 150"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-sm transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Typical Response Time
              </label>
              <input
                type="text"
                value={formData.responseTime}
                onChange={(e) => setFormData(prev => ({ ...prev, responseTime: e.target.value }))}
                placeholder="e.g. Usually responds within 30 minutes"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-sm transition-all"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiClipboardList className="text-primary-600 dark:text-primary-400" size={20} />
              <h3 className="font-black text-lg text-gray-900 dark:text-white">Services & Prices</h3>
            </div>
            <button
              type="button"
              onClick={addService}
              className="flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold"
            >
              <HiPlus size={16} />
              Add Service
            </button>
          </div>

          {formData.servicesOffered.length > 0 ? (
            <div className="space-y-2">
              {formData.servicesOffered.map((service, index) => (
                <div key={index} className="flex gap-2 items-center mb-2">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => updateService(index, 'name', e.target.value)}
                    placeholder="Service name e.g. Leak Repair"
                    className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    value={service.priceFrom}
                    onChange={(e) => updateService(index, 'priceFrom', e.target.value)}
                    placeholder="৳ Min"
                    className="w-24 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    value={service.priceTo}
                    onChange={(e) => updateService(index, 'priceTo', e.target.value)}
                    placeholder="৳ Max"
                    className="w-24 px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeService(index)}
                    className="p-2"
                  >
                    <HiTrash size={16} className="text-red-500 dark:text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No services added yet. Click "Add Service" to list what you offer.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HiPhotograph className="text-primary-600 dark:text-primary-400" size={20} />
              <h3 className="font-black text-lg text-gray-900 dark:text-white">Recent Work Photos</h3>
            </div>
            <label className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold cursor-pointer">
              <HiCamera size={16} />
              {uploadingRecentWork ? 'Uploading...' : 'Add Photos'}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleRecentWorkUpload}
                disabled={uploadingRecentWork || formData.recentWorkPhotos.length >= 12}
                className="hidden"
              />
            </label>
          </div>

          {formData.recentWorkPhotos.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {formData.recentWorkPhotos.map((photo, index) => (
                <div key={index} className="relative rounded-xl overflow-hidden aspect-square">
                  <img src={photo} alt={`Work ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeRecentWorkPhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center"
                  >
                    <HiX size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No work photos added yet. Add up to 12 photos to showcase your work.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiLocationMarker className="text-primary-600 dark:text-primary-400" size={20} />
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
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <HiClock className="text-primary-600 dark:text-primary-400" size={20} />
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
          disabled={saving || uploadingCover || uploadingProfile || uploadingRecentWork}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <HiSave size={20} />
          {uploadingCover || uploadingProfile || uploadingRecentWork ? 'Uploading Photos...' : saving ? 'Saving Profile...' : 'Save Public Profile'}
        </motion.button>
      </form>
    </div>
  )
}

export default ServicePublicProfileSection