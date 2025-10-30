import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, requireAdmin = false }) {
  const { currentUser } = useAuth()

  console.log('🔒 ProtectedRoute check:', { 
    isAuthenticated: !!currentUser, 
    requireAdmin 
  })

  if (!currentUser) {
    console.log('❌ Access denied - redirecting to login')
    return <Navigate to="/login" replace />
  }

  // TODO: Add admin check when we implement roles
  if (requireAdmin) {
    // For now, we'll just log it
    console.log('⚠️ Admin route - role checking not implemented yet')
  }

  console.log('✅ Access granted')
  return children
}

export default ProtectedRoute