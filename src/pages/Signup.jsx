import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input, Button } from '../components/ui'
import RoleCard from '../components/RoleCard'
import PasswordStrength from '../components/PasswordStrength'
import { Store, Wrench, User } from 'lucide-react'
import {
  validateEmail,
  validatePhoneBD,
  normalizePhoneBD,
  formatPhoneBD,
  checkPasswordStrength
} from '../utils/validation'

function Signup() {
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const roles = [
    {
      id: 'business',
      icon: Store,
      title: 'Business Owner',
      description: 'I want to list my business or store'
    },
    {
      id: 'service',
      icon: Wrench,
      title: 'Service Provider',
      description: 'I offer services in the area'
    },
    {
      id: 'customer',
      icon: User,
      title: 'Customer',
      description: 'I want to discover local businesses'
    }
  ]

  function validateField(field, value) {
    let error = ''
    switch (field) {
      case 'role':
        if (!value) error = 'Please select a role'
        break
      case 'name':
        if (!value.trim()) error = 'Name is required'
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters'
        break
      case 'email':
        if (!value) error = 'Email is required'
        else if (!validateEmail(value)) error = 'Invalid email address'
        break
      case 'phone':
        if (!value) error = 'Phone number is required'
        else if (!validatePhoneBD(value)) error = 'Invalid Bangladesh phone number'
        break
      case 'password':
        if (!value) error = 'Password is required'
        else if (value.length < 6) error = 'Password must be at least 6 characters'
        break
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password'
        else if (value !== password) error = 'Passwords do not match'
        break
    }
    return error
  }

  function handleBlur(field) {
    setTouched(prev => ({ ...prev, [field]: true }))
    const value = { role, name, email, phone, password, confirmPassword }[field]
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  function handleChange(field, value) {
    switch (field) {
      case 'role': setRole(value); break
      case 'name': setName(value); break
      case 'email': setEmail(value); break
      case 'phone': setPhone(value); break
      case 'password': setPassword(value); break
      case 'confirmPassword': setConfirmPassword(value); break
    }
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  function validateAll() {
    const newErrors = {}
    newErrors.role = validateField('role', role)
    newErrors.name = validateField('name', name)
    newErrors.email = validateField('email', email)
    newErrors.phone = validateField('phone', phone)
    newErrors.password = validateField('password', password)
    newErrors.confirmPassword = validateField('confirmPassword', confirmPassword)

    setErrors(newErrors)
    setTouched({
      role: true,
      name: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true
    })

    return !Object.values(newErrors).some(error => error)
  }

  async function handleSubmit(e) {
  e.preventDefault()

  if (!validateAll()) {
    setError('Please fix the errors before submitting')
    return
  }

  setError('')
  setLoading(true)

  try {
    console.log('=== [SIGNUP FORM] Starting submission ===')
    
    const normalizedPhone = normalizePhoneBD(phone)
    
    console.log('[SIGNUP FORM] Calling signUp...')

    // Call signup function
    const result = await signUp(email, password, name, {
      phone: normalizedPhone,
      role: role
    })

    console.log('✅ [SIGNUP FORM] Signup successful!')
    console.log('Profile created:', result.profile)

    // Small delay to ensure everything is ready
    await new Promise(resolve => setTimeout(resolve, 500))

    // Redirect based on role
    if (role === 'business' || role === 'service') {
      navigate('/dashboard')
    } else {
      navigate('/')
    }

  } catch (error) {
    console.error('❌ [SIGNUP FORM] Error:', error)
    
    let errorMessage = 'Failed to create account. '
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'This email is already registered. Please login instead.'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak.'
    } else if (error.code === 'permission-denied' || error.message?.includes('Missing or insufficient permissions')) {
      errorMessage = 'Database error: Please make sure you updated Firestore rules and clicked Publish. Wait 60 seconds and try again.'
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
    console.log('🔵 GOOGLE SIGNUP')
    console.log('═══════════════════════════════════')
    
    await signInWithGoogle()
    
    console.log('✅ Google signup complete - redirecting...')
    
    // Navigate to home page for Google users
    navigate('/')
    
  } catch (error) {
    console.error('═══════════════════════════════════')
    console.error('❌ GOOGLE SIGNUP FAILED')
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

  const passwordStrength = checkPasswordStrength(password)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Create Account</h1>
        <p className="text-gray-600">Join Dakshinkhan Direct community</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I am a... <span className="text-red-500">*</span>
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {roles.map(r => (
                <RoleCard
                  key={r.id}
                  icon={r.icon}
                  title={r.title}
                  description={r.description}
                  selected={role === r.id}
                  onClick={() => handleChange('role', r.id)}
                />
              ))}
            </div>
            {touched.role && errors.role && (
              <p className="mt-2 text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          <Input
            label="Full Name"
            value={name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            error={touched.name ? errors.name : ''}
            placeholder="Enter your full name"
            required
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            error={touched.email ? errors.email : ''}
            placeholder="your@email.com"
            required
          />

          <div>
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              error={touched.phone ? errors.phone : ''}
              placeholder="01712345678"
              helperText="Bangladesh phone number (e.g., 01712345678)"
              required
            />
            {phone && validatePhoneBD(phone) && (
              <p className="mt-1 text-sm text-green-600">
                ✓ Formatted: {formatPhoneBD(phone)}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={() => handleBlur('password')}
              error={touched.password ? errors.password : ''}
              placeholder="••••••••"
              required
            />
            <PasswordStrength strength={passwordStrength} />
            <label className="flex items-center gap-2 mt-2 text-sm">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="rounded"
              />
              Show password
            </label>
          </div>

          <Input
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            onBlur={() => handleBlur('confirmPassword')}
            error={touched.confirmPassword ? errors.confirmPassword : ''}
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
            {loading ? 'Creating Account...' : 'Sign Up'}
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
  {loading ? 'Signing in...' : 'Sign up with Google'}
</Button>

        <p className="mt-6 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup