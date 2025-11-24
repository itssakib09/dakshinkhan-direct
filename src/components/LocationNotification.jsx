import { motion, AnimatePresence } from 'framer-motion'
import { HiCheckCircle, HiX } from 'react-icons/hi'
import { useLocation } from '../context/LocationContext'

function LocationNotification() {
  const { showNotification, notificationMessage, hideNotification } = useLocation()

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-4 sm:top-6 md:top-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-[100] w-auto sm:max-w-md mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl border-2 border-primary-500 dark:border-primary-600 overflow-hidden">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-3 sm:px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                  <HiCheckCircle className="text-white" size={20} />
                </motion.div>
                <span className="text-white font-bold text-xs sm:text-sm">Success</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={hideNotification}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <HiX size={16} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-800 dark:text-white font-semibold text-center text-sm sm:text-base"
              >
                {notificationMessage}
              </motion.p>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3, ease: 'linear' }}
              className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LocationNotification