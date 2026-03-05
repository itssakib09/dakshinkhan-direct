import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

function WizardLayout({ children, currentStep, totalSteps, isService = false }) {
  const businessSteps = [
    { number: 1, label: 'Store Info' },
    { number: 2, label: 'Service Areas' },
    { number: 3, label: 'Opening Hours' },
    { number: 4, label: 'Review' },
  ]

  const serviceSteps = [
    { number: 1, label: 'Basic Info' },
    { number: 2, label: 'Cover Photo' },
    { number: 3, label: 'Services' },
    { number: 4, label: 'Areas' },
    { number: 5, label: 'Availability' },
    { number: 6, label: 'Review' },
  ]

  const steps = isService ? serviceSteps : businessSteps

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent mb-2">
            {isService ? 'Setup Your Service Profile' : 'Setup Your Business'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isService ? 'Complete your profile to start receiving service requests' : 'Complete your profile to start reaching customers'}
          </p>
        </motion.div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep > step.number
                        ? 'bg-primary-600 text-white'
                        : currentStep === step.number
                        ? 'bg-primary-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle size={20} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs sm:text-sm font-semibold ${
                      currentStep >= step.number
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      currentStep > step.number
                        ? 'bg-primary-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}

export default WizardLayout