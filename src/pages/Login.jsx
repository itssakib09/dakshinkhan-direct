import { getUserProfile } from '../services/userService'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
  e.preventDefault()
  
  try {
    setError('')
    setLoading(true)
    
    console.log('=== STARTING LOGIN ===')
    const result = await signIn(email, password)
    console.log('=== LOGIN SUCCESS ===')
    
    // Get user profile to check role
    const profile = await getUserProfile(result.user.uid)
    console.log('User profile:', profile)
    
    // Redirect based on role
    if (profile && (profile.role === 'business' || profile.role === 'service')) {
      console.log('Redirecting to dashboard')
      navigate('/dashboard')
    } else {
      console.log('Redirecting to home')
      navigate('/')
    }
    
  } catch (error) {
    console.error('=== LOGIN ERROR ===')
    
    let errorMessage = 'Failed to sign in. '
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.'
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password.'
    } else {
      errorMessage += error.message
    }
    
    setError(errorMessage)
  } finally {
    setLoading(false)
  }
}

  async function handleGoogleSignIn() {
  try {
    setError('')
    setLoading(true)
    
    console.log('=== STARTING GOOGLE SIGNIN ===')
    const result = await signInWithGoogle()
    console.log('=== GOOGLE SIGNIN SUCCESS ===')
    
    // Get user profile to check role
    const profile = await getUserProfile(result.user.uid)
    console.log('User profile:', profile)
    
    // Redirect based on role
    if (profile && (profile.role === 'business' || profile.role === 'service')) {
      console.log('Redirecting to dashboard')
      navigate('/dashboard')
    } else {
      console.log('Redirecting to home')
      navigate('/')
    }
    
  } catch (error) {
    console.error('=== GOOGLE SIGNIN ERROR ===')
    
    let errorMessage = 'Failed to sign in with Google. '
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign-in cancelled.'
    } else {
      errorMessage += error.message
    }
    
    setError(errorMessage)
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-4">Login – Dakshinkhan Direct</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="your@email.com"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">OR</div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 p-2 rounded hover:bg-gray-50 disabled:bg-gray-100"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login