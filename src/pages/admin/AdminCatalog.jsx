// src/pages/admin/AdminCatalog.jsx
import { HiCube } from 'react-icons/hi'

function AdminCatalog() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Catalog
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center">
        <HiCube size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          This section is coming soon
        </p>
      </div>
    </div>
  )
}

export default AdminCatalog