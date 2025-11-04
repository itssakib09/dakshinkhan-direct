import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser, userProfile, loading, profileLoading } = useAuth()
  const location = useLocation()

  console.log('🔒 [ProtectedRoute] Checking access to:', location.pathname)
  console.log('   - Loading:', loading)
  console.log('   - Profile Loading:', profileLoading)
  console.log('   - User:', currentUser?.uid)
  console.log('   - Profile:', userProfile?.role)

  // Show loading while checking auth
  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    console.log('❌ [ProtectedRoute] Access denied - no user')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Check admin requirement
  if (requireAdmin && userProfile?.role !== 'admin') {
    console.log('❌ [ProtectedRoute] Access denied - not admin')
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-red-600 mb-4 text-5xl">🚫</div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  console.log('✅ [ProtectedRoute] Access granted')
  return children
}

export default ProtectedRoute