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
  // Form state
  const [role, setRole] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Validation state
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // UI state
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

  // Validate single field
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

  // Handle field blur
  function handleBlur(field) {
    setTouched(prev => ({ ...prev, [field]: true }))
    const value = { role, name, email, phone, password, confirmPassword }[field]
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  // Handle field change
  function handleChange(field, value) {
    // Update value
    switch (field) {
      case 'role': setRole(value); break
      case 'name': setName(value); break
      case 'email': setEmail(value); break
      case 'phone': setPhone(value); break
      case 'password': setPassword(value); break
      case 'confirmPassword': setConfirmPassword(value); break
    }

    // Clear error if field was touched
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  // Validate all fields
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

    // Validate all fields
    if (!validateAll()) {
      setError('Please fix the errors before submitting')
      return
    }

    try {
      setError('')
      setLoading(true)

      // Normalize phone number
const normalizedPhone = normalizePhoneBD(phone)

// Sign up with Firebase and create Firestore document
await signUp(email, password, name, {
  phone: normalizedPhone,
  role: role
})

console.log('✅ User registered with Firestore profile:', {
  name,
  email,
  phone: normalizedPhone,
  role
})

      navigate('/dashboard')
    } catch (error) {
      console.error('Signup error:', error)
      setError(error.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    try {
      setError('')
      setLoading(true)
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (error) {
      setError('Failed to sign in with Google: ' + error.message)
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
          {/* Role Selection */}
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

          {/* Name */}
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            error={touched.name ? errors.name : ''}
            placeholder="Enter your full name"
            required
          />

          {/* Email */}
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

          {/* Phone */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

          {/* Submit */}
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

        {/* Divider */}
        <div className="my-6 text-center text-gray-500 relative">
          <span className="bg-white px-4 relative z-10">OR</span>
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300 -z-0"></div>
        </div>

        {/* Google Sign In */}
        <Button
          onClick={handleGoogleSignIn}
          disabled={loading}
          variant="outline"
          fullWidth
        >
          Sign up with Google
        </Button>

        {/* Login Link */}
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