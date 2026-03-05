import { motion } from 'framer-motion'
import { Camera, Upload, X, ArrowRight, ArrowLeft } from 'lucide-react'

function ServiceStepCoverPhoto({ formData, updateFormData, onNext, onBack }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateFormData({ coverPhoto: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          Cover Photo
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Add a cover photo to stand out (optional)
        </p>
      </div>

      <div className="space-y-6">
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
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateFormData({ coverPhoto: '' })}
                className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2"
              >
                <X size={18} />
                Remove
              </motion.button>
            </div>
          </div>
        ) : (
          <label className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-all group">
            <Camera size={48} className="text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">Click to upload cover photo</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Recommended: 1200x400px</p>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            You can skip this step and add a cover photo later from your dashboard settings.
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
            {formData.coverPhoto ? 'Continue' : 'Skip for Now'}
            <ArrowRight size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default ServiceStepCoverPhoto