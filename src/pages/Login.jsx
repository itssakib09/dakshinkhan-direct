import { getUserProfile } from '../services/userService'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui'
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
  setError('')
  setLoading(true)

  try {
    console.log('═══════════════════════════════════')
    console.log('🔵 GOOGLE LOGIN')
    console.log('═══════════════════════════════════')
    
    await signInWithGoogle()
    
    console.log('✅ Google login complete - redirecting...')
    navigate('/dashboard')
    
  } catch (error) {
    console.error('═══════════════════════════════════')
    console.error('❌ GOOGLE LOGIN FAILED')
    console.error('Error:', error)
    console.error('═══════════════════════════════════')

    let errorMessage = 'Failed to sign in with Google. '
    
    if (error.message?.includes('cancelled') || error.message?.includes('closed')) {
      errorMessage = 'Sign-in was cancelled. Please try again.'
    } else if (error.message?.includes('blocked')) {
      errorMessage = 'Pop-up was blocked by your browser. Please allow pop-ups and try again.'
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      errorMessage = 'An account already exists with this email using a different sign-in method.'
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

        <Button
  onClick={handleGoogleSignIn}
  disabled={loading}
  variant="outline"
  fullWidth
  className="flex items-center justify-center gap-3"
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
  {loading ? 'Signing in...' : 'Sign in with Google'}
</Button>

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