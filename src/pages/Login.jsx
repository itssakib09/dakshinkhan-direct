import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input, Button } from '../components/ui'
import { getUserEmailByPhone, detectInputType } from '../services/authService'
import { normalizePhoneBD } from '../utils/validation'

function Login() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [inputType, setInputType] = useState('email')
  
  const { signIn, signInWithGoogle, userProfile } = useAuth()
  const navigate = useNavigate()

  // Detect input type as user types
  function handleEmailOrPhoneChange(value) {
    setEmailOrPhone(value)
    const type = detectInputType(value)
    setInputType(type)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!emailOrPhone || !password) {
      setError('Please enter both email/phone and password')
      return
    }

    setError('')
    setLoading(true)

    try {
      console.log('═══════════════════════════════════')
      console.log('🔵 LOGIN')
      console.log('Input:', emailOrPhone)
      console.log('Detected type:', inputType)
      console.log('═══════════════════════════════════')
      
      let emailToUse = emailOrPhone

      // If phone number, look up the email first
      if (inputType === 'phone') {
        console.log('📱 Phone detected - looking up email...')
        
        // Normalize phone to +880 format
        const normalizedPhone = normalizePhoneBD(emailOrPhone)
        console.log('Normalized phone:', normalizedPhone)
        
        // Query Firestore for user with this phone
        const foundEmail = await getUserEmailByPhone(normalizedPhone)
        
        if (!foundEmail) {
          throw new Error('No account found with this phone number')
        }
        
        console.log('✅ Found email:', foundEmail)
        emailToUse = foundEmail
      }

      // Sign in with email and password
      console.log('🔐 Authenticating with email:', emailToUse)
      await signIn(emailToUse, password)
      
      console.log('✅ Login successful')
      
      // Wait a moment for userProfile to load
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('═══════════════════════════════════')
      console.log('✅ LOGIN COMPLETE - Redirecting...')
      console.log('═══════════════════════════════════')
      
      // Redirect to dashboard for all authenticated users
      navigate('/dashboard')
      
    } catch (error) {
      console.error('═══════════════════════════════════')
      console.error('❌ LOGIN FAILED')
      console.error('Error:', error)
      console.error('═══════════════════════════════════')
      
      let errorMessage = 'Failed to sign in. '
      
      if (error.message?.includes('No account found with this phone')) {
        errorMessage = 'No account found with this phone number. Please check your number or sign up.'
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = inputType === 'email' 
          ? 'No account found with this email.' 
          : 'No account found.'
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.'
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email/phone or password.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.'
      } else if (error.message?.includes('lookup')) {
        errorMessage = 'Error looking up phone number. Please try again.'
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

  // Get helper text based on input type
  const getHelperText = () => {
    if (!emailOrPhone) return 'Enter your email or phone number'
    if (inputType === 'phone') return '📱 Phone number detected'
    if (inputType === 'email') return '📧 Email detected'
    return 'Please enter a valid email or phone'
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Login</h1>
        <p className="text-gray-600">Welcome back to Dakshinkhan Direct</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              label="Email or Phone Number"
              type="text"
              value={emailOrPhone}
              onChange={(e) => handleEmailOrPhoneChange(e.target.value)}
              placeholder="your@email.com or 01712345678"
              helperText={getHelperText()}
              required
            />
          </div>
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            loading={loading}
          >
            {loading ? 'Signing in...' : 'Login'}
          </Button>
        </form>

        <div className="my-6 text-center text-gray-500 relative">
          <span className="bg-white px-4 relative z-10">OR</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -z-0"></div>
        </div>

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

        <p className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login