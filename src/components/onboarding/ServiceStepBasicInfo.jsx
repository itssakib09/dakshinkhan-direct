// src/components/onboarding/ServiceStepBasicInfo.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  HiUser, HiPhone, HiTag, HiSearch, HiArrowRight, HiChevronLeft,
  HiCamera, HiPhotograph
} from 'react-icons/hi'
import { useAuth } from '../../context/AuthContext'
import { uploadImage } from '../../utils/uploadImage'
import { SERVICE_CATEGORIES } from '../../data/serviceTypes'

function ServiceStepBasicInfo({ formData, updateFormData, onNext }) {
  const { currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [error, setError] = useState('')
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingProfile, setUploadingProfile] = useState(false)

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat)
    setSearchQuery('')
    updateFormData({ serviceCategory: cat.label, subcategory: '' })
  }

  const handleSubcategorySelect = (sub) => {
    updateFormData({ subcategory: sub, profession: sub })
  }

  const handleBack = () => {
    setSelectedCategory(null)
    updateFormData({ serviceCategory: '', subcategory: '' })
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const url = await uploadImage(
        file,
        `service-profiles/${currentUser.uid}/cover/`,
        () => {}
      )
      updateFormData({ coverPhoto: url })
    } catch (err) {
      console.error('Cover upload error:', err)
    } finally {
      setUploadingCover(false)
    }
  }

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingProfile(true)
    try {
      const url = await uploadImage(
        file,
        `service-profiles/${currentUser.uid}/profile/`,
        () => {}
      )
      updateFormData({ profilePhoto: url })
    } catch (err) {
      console.error('Profile upload error:', err)
    } finally {
      setUploadingProfile(false)
    }
  }

  const handleNext = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number')
      return
    }
    if (!formData.serviceCategory) {
      setError('Please select your profession category')
      return
    }
    if (!formData.subcategory) {
      setError('Please select your profession')
      return
    }
    setError('')
    onNext()
  }

  const isSearching = searchQuery.trim().length > 0

  const searchResults = isSearching
    ? SERVICE_CATEGORIES.flatMap((cat) =>
        cat.subcategories
          .filter((sub) => sub.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((sub) => ({ sub, catLabel: cat.label, cat }))
      )
    : []

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Basic Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell customers who you are
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <HiPhotograph size={18} className="text-primary-600 dark:text-primary-400" />
          <span className="text-sm font-black text-gray-900 dark:text-white">Photos</span>
        </div>

        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">
          Cover Photo (optional)
        </label>
        <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 mb-4">
          {formData.coverPhoto ? (
            <img
              src={formData.coverPhoto}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <HiPhotograph size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
          )}
          <label className="absolute bottom-2 right-2 bg-primary-600 hover:bg-primary-700 text-white p-2 rounded-lg cursor-pointer shadow-md">
            {uploadingCover ? (
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <HiCamera size={16} />
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          </label>
        </div>

        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 block">
          Profile Photo (optional)
        </label>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            {formData.profilePhoto ? (
              <img
                src={formData.profilePhoto}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            ) : (
              <HiUser size={28} className="text-gray-300 dark:text-gray-600" />
            )}
          </div>
          <label className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold cursor-pointer shadow-sm">
            {uploadingProfile ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Uploading...
              </>
            ) : (
              <>
                <HiCamera size={16} />
                Upload Photo
              </>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
          </label>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            <HiUser size={18} className="text-primary-600 dark:text-primary-400" />
            Full Name
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => updateFormData({ fullName: e.target.value })}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            <HiPhone size={18} className="text-primary-600 dark:text-primary-400" />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
            placeholder="01712345678"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            <HiTag size={18} className="text-primary-600 dark:text-primary-400" />
            Your Profession
          </label>

          <div className="mb-3">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search service types..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
              />
            </div>
          </div>

          {formData.serviceCategory && formData.subcategory && !isSearching && (
            <p className="mb-2 text-sm text-primary-600 dark:text-primary-400 font-medium">
              Selected: {formData.subcategory}
            </p>
          )}

          <div className="max-h-72 overflow-y-auto border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700">
            {isSearching && (
              <div className="p-3">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">No results found</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(
                      searchResults.reduce((acc, { sub, catLabel, cat }) => {
                        if (!acc[catLabel]) acc[catLabel] = { cat, subs: [] }
                        acc[catLabel].subs.push(sub)
                        return acc
                      }, {})
                    ).map(([catLabel, { cat, subs }]) => (
                      <div key={catLabel}>
                        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 px-1">
                          {catLabel}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {subs.map((sub) => {
                            const isSelected = formData.subcategory === sub
                            return (
                              <button
                                key={sub}
                                type="button"
                                onClick={() => {
                                  updateFormData({ serviceCategory: cat.label, subcategory: sub, profession: sub })
                                  setSelectedCategory(cat)
                                  setSearchQuery('')
                                }}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold text-left transition-all min-h-[44px] ${
                                  isSelected
                                    ? 'bg-primary-600 dark:bg-primary-600 text-white shadow-md'
                                    : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-500'
                                }`}
                              >
                                {sub}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!isSearching && !selectedCategory && (
              <div className="p-3 grid grid-cols-2 gap-2">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold text-left transition-all min-h-[44px] ${
                      formData.serviceCategory === cat.label
                        ? 'bg-primary-600 dark:bg-primary-600 text-white shadow-md'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-500'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {!isSearching && selectedCategory && (
              <div className="p-3">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 mb-3 min-h-[44px]"
                >
                  <HiChevronLeft size={16} />
                  Back to categories
                </button>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 px-1">
                  {selectedCategory.label}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCategory.subcategories.map((sub) => {
                    const isSelected = formData.subcategory === sub
                    return (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => handleSubcategorySelect(sub)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold text-left transition-all min-h-[44px] ${
                          isSelected
                            ? 'bg-primary-600 dark:bg-primary-600 text-white shadow-md'
                            : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-500'
                        }`}
                      >
                        {sub}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl">
            <p className="text-sm font-semibold">{error}</p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          Continue
          <HiArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  )
}

export default ServiceStepBasicInfo