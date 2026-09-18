// src/components/admin/AdminRoute.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { HiShieldExclamation } from 'react-icons/hi'

function AdminRoute({ children }) {
  const { isAdmin, loading } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAdmin) {
      const timer = setTimeout(() => {
        navigate('/')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [loading, isAdmin, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-200 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm shadow-sm border border-gray-100 dark:border-gray-700">
          <HiShieldExclamation size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You do not have permission to view this page
          </p>
        </div>
      </div>
    )
  }

  return children
}

export default AdminRoute