import { useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Save, Lock } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function ProfileSection() {
  const { currentUser } = useAuth()
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1500)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account information</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Picture */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <h3 className="font-black text-lg mb-6 text-gray-900 dark:text-white">Profile Picture</h3>
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
                <span className="text-5xl font-black text-white">
                  {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-2 right-2 w-10 h-10 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Camera size={18} />
              </motion.button>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-xl font-semibold transition-all"
            >
              Change Photo
            </motion.button>
          </div>
        </motion.div>

        {/* Account Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
        >
          <h3 className="font-black text-lg mb-6 text-gray-900 dark:text-white">Account Information</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Full Name</label>
              <input
                type="text"
                defaultValue={currentUser?.displayName || ''}
                placeholder="Enter your name"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                defaultValue={currentUser?.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Phone Number</label>
              <input
                type="tel"
                placeholder="+880 XXX-XXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Location</label>
              <input
                type="text"
                placeholder="Dakshinkhan, Dhaka"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
            
            <div className="pt-4">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSaving}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all inline-flex items-center gap-2"
              >
                <Save size={18} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Security Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mt-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
            <Lock size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <h3 className="font-black text-lg text-gray-900 dark:text-white">Security</h3>
        </div>
        
        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Current Password</label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSaving}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all inline-flex items-center gap-2"
          >
            <Lock size={18} />
            {isSaving ? 'Updating...' : 'Update Password'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

export default ProfileSection