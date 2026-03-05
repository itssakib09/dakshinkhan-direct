import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Phone, Briefcase, ArrowRight } from 'lucide-react'

function ServiceStepBasicInfo({ formData, updateFormData, onNext }) {
  const [error, setError] = useState('')

  const handleNext = () => {
    if (!formData.fullName.trim()) {
      setError('Please enter your full name')
      return
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number')
      return
    }
    if (!formData.profession.trim()) {
      setError('Please enter your profession')
      return
    }
    setError('')
    onNext()
  }

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

      <div className="space-y-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
            <User size={18} className="text-primary-600 dark:text-primary-400" />
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
            <Phone size={18} className="text-primary-600 dark:text-primary-400" />
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
            <Briefcase size={18} className="text-primary-600 dark:text-primary-400" />
            Profession
          </label>
          <input
            type="text"
            value={formData.profession}
            onChange={(e) => updateFormData({ profession: e.target.value })}
            placeholder="e.g. AC Technician, Electrician, Plumber"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            This will be shown as your title on your profile
          </p>
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
          <ArrowRight size={20} />
        </motion.button>
      </div>
    </div>
  )
}

export default ServiceStepBasicInfo