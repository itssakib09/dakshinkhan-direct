import { motion } from 'framer-motion'
import { ClipboardList, Phone, Mail, Calendar, User } from 'lucide-react'

function ServiceLeadsSection() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Leads</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage customer service requests</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8"
      >
        <div className="text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardList size={40} className="text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
            No Leads Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            When customers contact you for services, they will appear here. Complete your public profile to start receiving leads.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <User size={16} className="text-primary-600 dark:text-primary-400" />
                <p className="font-bold text-sm text-gray-900 dark:text-white">Customer Name</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Phone size={16} className="text-primary-600 dark:text-primary-400" />
                <p className="font-bold text-sm text-gray-900 dark:text-white">Contact Info</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Mail size={16} className="text-primary-600 dark:text-primary-400" />
                <p className="font-bold text-sm text-gray-900 dark:text-white">Service Requested</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <Calendar size={16} className="text-primary-600 dark:text-primary-400" />
                <p className="font-bold text-sm text-gray-900 dark:text-white">Request Status</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Coming soon</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ServiceLeadsSection