import { useNavigate, useLocation as useRouterLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiLocationMarker } from 'react-icons/hi'
import { useLocation } from '../context/LocationContext'

function ChangeLocationButton() {
  const navigate = useNavigate()
  const routerLocation = useRouterLocation()
  const { selectedLocation, savePreviousPage } = useLocation()

  const handleChangeLocation = () => {
    savePreviousPage(routerLocation.pathname)
    navigate('/locations')
  }

  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleChangeLocation}
      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-gray-700 border-2 border-primary-500 dark:border-primary-600 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
    >
      <motion.div
        whileHover={{ rotate: 20 }}
        className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
      >
        <HiLocationMarker className="text-white" size={16} />
      </motion.div>
      <div className="text-left">
        <p className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold uppercase leading-none">
          Current
        </p>
        <p className="text-sm font-bold text-gray-800 dark:text-white group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors leading-tight">
          {selectedLocation || 'Select Location'}
        </p>
      </div>
    </motion.button>
  )
}

export default ChangeLocationButton