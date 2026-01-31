import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiUser, HiMail, HiPhone, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import { Store, Wrench, User, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  validateEmail,
  validatePhoneBD,
  normalizePhoneBD,
  formatPhoneBD,
  checkPasswordStrength,
  getFriendlyAuthError
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
      description: 'List my shop'
    },
    {
      id: 'service',
      icon: Wrench,
      title: 'Service Provider',
      description: 'Offer services'
    },
    {
      id: 'customer',
      icon: User,
      title: 'Customer',
      description: 'Find businesses'
    }
  ]

  function validateField(field, value) {
    let error = ''
    
    switch (field) {
      case 'role':
        if (!value) error = 'Please select your role to continue'
        break
        
      case 'name':
        if (!value.trim()) {
          error = 'Please enter your full name'
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters'
        } else if (value.trim().length > 50) {
          error = 'Name is too long (max 50 characters)'
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Name can only contain letters and spaces'
        }
        break
        
      case 'email': {
        const emailValidation = validateEmail(value)
        if (!emailValidation.valid) {
          error = emailValidation.message
        }
        break
      }
        
      case 'phone':
        if (!value) {
          error = 'Phone number is required'
        } else if (!validatePhoneBD(value)) {
          error = 'Please enter a valid Bangladesh phone number (e.g., 01712345678)'
        }
        break
        
      case 'password':
        if (!value) {
          error = 'Password is required'
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters long'
        } else {
          const strength = checkPasswordStrength(value)
          if (strength && strength.score < 2) {
            error = 'Password is too weak. Please add more variety.'
          }
        }
        break
        
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password'
        } else if (value !== password) {
          error = 'Passwords do not match'
        }
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

      const result = await signUp(email, password, name, {
        phone: normalizedPhone,
        role: role
      })

      console.log('✅ [SIGNUP FORM] Signup successful!')
      console.log('Profile created:', result.profile)

      await new Promise(resolve => setTimeout(resolve, 500))

      if (role === 'business' || role === 'service') {
        navigate('/business-setup')
      } else {
        navigate('/')
      }

    } catch (error) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('❌ SIGNUP FAILED')
      console.error('Error:', error)
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

      const friendlyMessage = getFriendlyAuthError(error)
      setError(friendlyMessage)
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setError('')
    setLoading(true)

    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.log('🔵 GOOGLE SIGNUP')
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      
      await signInWithGoogle()
      
      console.log('✅ Google signup complete - redirecting...')
      
      navigate('/')
      
    } catch (error) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      console.error('❌ GOOGLE SIGNUP FAILED')
      console.error('Error:', error)
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

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
    <div className="min-h-[90vh] bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 px-8 py-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
              Join Dakshinkhan Direct
            </h1>
            <p className="text-primary-100">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl"
              >
                <p className="text-sm font-semibold">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {roles.map((r) => {
                  const Icon = r.icon
                  const isSelected = role === r.id
                  const hasError = touched.role && errors.role

                  return (
                    <motion.button
                      key={r.id}
                      type="button"
                      onClick={() => handleChange('role', r.id)}
                      onBlur={() => handleBlur('role')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all text-center ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 shadow-lg'
                          : hasError
                          ? 'border-red-300 dark:border-red-700 bg-white dark:bg-gray-700'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary-300'
                      }`}
                    >
                      <Icon 
                        size={20} 
                        className={`${isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'} mb-1 sm:mb-2 mx-auto`} 
                      />
                      <p className={`font-bold text-xs sm:text-sm ${isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-gray-200'}`}>
                        {r.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1 hidden sm:block">
                        {r.description}
                      </p>
                    </motion.button>
                  )
                })}
              </div>
              {touched.role && errors.role && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.role}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiUser className={touched.name && errors.name ? 'text-red-400' : 'text-gray-400'} size={20} />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="Enter your full name"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all ${
                    touched.name && errors.name
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                />
              </div>
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiMail className={touched.email && errors.email ? 'text-red-400' : 'text-gray-400'} size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="your@email.com"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all ${
                    touched.email && errors.email
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
              )}
              {email && !errors.email && touched.email && (
                <p className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <Check size={14} />
                  Valid email address
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiPhone className={touched.phone && errors.phone ? 'text-red-400' : 'text-gray-400'} size={20} />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="01712345678"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all ${
                    touched.phone && errors.phone
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
              )}
              {phone && validatePhoneBD(phone) && !errors.phone && (
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                    <Check size={14} />
                    Valid phone number
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Will be saved as: {formatPhoneBD(phone)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiLockClosed className={touched.password && errors.password ? 'text-red-400' : 'text-gray-400'} size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  placeholder="Create a strong password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all ${
                    touched.password && errors.password
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <HiEyeOff className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" size={20} />
                  ) : (
                    <HiEye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" size={20} />
                  )}
                </button>
              </div>
              {password && passwordStrength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          level <= (passwordStrength.score || 0)
                            ? (passwordStrength.score || 0) === 1
                              ? 'bg-red-500'
                              : (passwordStrength.score || 0) === 2
                              ? 'bg-yellow-500'
                              : (passwordStrength.score || 0) === 3
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.feedback && (
                    <p className={`mt-1 text-xs font-medium ${
                      (passwordStrength.score || 0) === 1
                        ? 'text-red-600 dark:text-red-400'
                        : (passwordStrength.score || 0) === 2
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : (passwordStrength.score || 0) === 3
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-green-600 dark:text-green-400'
                    }`}>
                      {passwordStrength.feedback}
                    </p>
                  )}
                </div>
              )}
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiLockClosed className={touched.confirmPassword && errors.confirmPassword ? 'text-red-400' : 'text-gray-400'} size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl transition-all ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20'
                  } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-semibold">
                  Or continue with
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700 text-gray-700 dark:text-gray-200 font-semibold py-3 rounded-xl shadow transition-all flex items-center justify-center gap-3"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign up with Google'}
            </motion.button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default Signup