// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  HiOfficeBuilding,
  HiUserGroup,
  HiUsers,
  HiUserAdd,
  HiBadgeCheck,
  HiSpeakerphone
} from 'react-icons/hi'
import { getDashboardStats } from '../../services/adminDashboardService'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 }
}

function StatCard({ icon: Icon, label, value, accent, highlight }) {
  return (
    <motion.div
      variants={cardVariants}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl border p-5 flex items-center gap-4 ${
        highlight
          ? 'border-amber-200 dark:border-amber-800 ring-1 ring-amber-100 dark:ring-amber-900/40'
          : 'border-gray-100 dark:border-gray-700'
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${accent}`}>
        <Icon size={22} />
      </div>
      <div>
        <div className="text-2xl font-black text-gray-900 dark:text-white">
          {value}
        </div>
        <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          {label}
        </div>
      </div>
    </motion.div>
  )
}

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      const data = await getDashboardStats()
      setStats(data)
      setLoading(false)
    }
    loadStats()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Dashboard
      </h1>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <StatCard
            icon={HiOfficeBuilding}
            label="Total Businesses"
            value={stats.totalBusinesses}
            accent="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={HiUserGroup}
            label="Total Service Providers"
            value={stats.totalProviders}
            accent="bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          />
          <StatCard
            icon={HiUsers}
            label="Total Customers"
            value={stats.totalCustomers}
            accent="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          />
          <StatCard
            icon={HiUserAdd}
            label="Today's New Signups"
            value={stats.todaySignups}
            accent="bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400"
          />
          <StatCard
            icon={HiBadgeCheck}
            label="Pending Verifications"
            value={stats.pendingVerifications}
            accent="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            highlight
          />
          <StatCard
            icon={HiSpeakerphone}
            label="Active Sponsored Ads"
            value={stats.activeSponsoredAds}
            accent="bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
          />
        </motion.div>
      )}
    </div>
  )
}

export default AdminDashboard