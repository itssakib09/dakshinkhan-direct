import { motion } from 'framer-motion'
import { CheckCircle, Eye, EyeOff, ArrowLeft, Store, MapPin, Clock } from 'lucide-react'
import { ALL_AREAS_LABEL, ALL_AREAS_VALUE } from '../../data/locations'

function StepFinish({ formData, updateFormData, onFinish, onBack, saving }) {
  const getAreaDisplay = () => {
    if (formData.serviceAreas?.includes(ALL_AREAS_VALUE)) {
      return ALL_AREAS_LABEL
    }
    if (formData.serviceAreas?.length > 3) {
      return `${formData.serviceAreas.slice(0, 3).join(', ')} +${formData.serviceAreas.length - 3} more`
    }
    return formData.serviceAreas?.join(', ') || 'None'
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-primary-600 dark:text-primary-400" size={32} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Review & Finish
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Confirm your business details
        </p>
      </div>

      <div className="space-y-4 mb-6">
        {/* Store Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Store className="text-primary-600 dark:text-primary-400 mt-1" size={20} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Store Name</p>
              <p className="text-base font-bold text-gray-900 dark:text-white">{formData.storeName}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{formData.businessType}</p>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <MapPin className="text-primary-600 dark:text-primary-400 mt-1" size={20} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Service Areas</p>
              <p className="text-sm text-gray-900 dark:text-white">{getAreaDisplay()}</p>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Clock className="text-primary-600 dark:text-primary-400 mt-1" size={20} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Opening Hours</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formData.defaultHours.open} - {formData.defaultHours.close}
              </p>
            </div>
          </div>
        </div>

        {/* Visibility Toggle */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {formData.storeActive ? (
                <Eye className="text-primary-600 dark:text-primary-400" size={20} />
              ) : (
                <EyeOff className="text-gray-400" size={20} />
              )}
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Store Visibility</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {formData.storeActive ? 'Visible to customers' : 'Hidden from customers'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateFormData({ storeActive: !formData.storeActive })}
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
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onBack}
          disabled={saving}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 text-gray-800 dark:text-white font-bold py-4 px-6 rounded-xl shadow flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onFinish}
          disabled={saving}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Finishing...
            </>
          ) : (
            <>
              <CheckCircle size={20} />
              Finish Setup
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

export default StepFinish