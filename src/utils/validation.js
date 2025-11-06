import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

/**
 * Normalize phone number to Bangladesh format
 */
export function normalizePhoneBD(phone) {
  if (!phone) return ''
  let cleaned = phone.replace(/[\s-]/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '+880' + cleaned.slice(1)
  } else if (cleaned.startsWith('880')) {
    cleaned = '+' + cleaned
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+880' + cleaned
  }
  return cleaned
}

/**
 * Validate Bangladesh phone number
 */
export function validatePhoneBD(phone) {
  try {
    const normalized = normalizePhoneBD(phone)
    return isValidPhoneNumber(normalized, 'BD')
  } catch {
    return false
  }
}

/**
 * Format phone for display
 */
export function formatPhoneBD(phone) {
  try {
    const normalized = normalizePhoneBD(phone)
    const phoneNumber = parsePhoneNumber(normalized, 'BD')
    return phoneNumber.formatInternational()
  } catch {
    return phone
  }
}

/**
 * Validate email with detailed feedback
 */
export function validateEmail(email) {
  if (!email) return { valid: false, message: 'Email is required' }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!emailRegex.test(email)) {
    if (!email.includes('@')) {
      return { valid: false, message: 'Email must contain @' }
    }
    if (!email.includes('.')) {
      return { valid: false, message: 'Email must contain a domain (e.g., .com)' }
    }
    return { valid: false, message: 'Invalid email format' }
  }
  
  return { valid: true }
}

/**
 * Enhanced password strength checker
 */
export function checkPasswordStrength(password) {
  if (!password || password.length === 0) {
    return null
  }

  let score = 0
  const feedback = []
  const requirements = {
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  }

  // Length check (minimum 8, bonus for 12+)
  if (password.length >= 8) {
    score++
    requirements.length = true
  } else {
    feedback.push(`${8 - password.length} more characters`)
  }

  if (password.length >= 12) {
    score += 0.5
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score++
    requirements.uppercase = true
  } else {
    feedback.push('one uppercase letter (A-Z)')
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score++
    requirements.lowercase = true
  } else {
    feedback.push('one lowercase letter (a-z)')
  }

  // Number check
  if (/\d/.test(password)) {
    score++
    requirements.number = true
  } else {
    feedback.push('one number (0-9)')
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/~`]/.test(password)) {
    score++
    requirements.special = true
  } else {
    feedback.push('one special character (!@#$...)')
  }

  // Calculate final score (0-5 scale)
  const finalScore = Math.min(Math.floor(score), 5)

  const strengthLevels = [
    { label: 'Very Weak', color: 'red', textColor: 'text-red-600', bgColor: 'bg-red-500' },
    { label: 'Weak', color: 'orange', textColor: 'text-orange-600', bgColor: 'bg-orange-500' },
    { label: 'Fair', color: 'yellow', textColor: 'text-yellow-600', bgColor: 'bg-yellow-500' },
    { label: 'Good', color: 'blue', textColor: 'text-blue-600', bgColor: 'bg-blue-500' },
    { label: 'Strong', color: 'green', textColor: 'text-green-600', bgColor: 'bg-green-500' },
    { label: 'Very Strong', color: 'green', textColor: 'text-green-700', bgColor: 'bg-green-600' }
  ]

  const strength = strengthLevels[finalScore]
  
  return {
    score: finalScore,
    label: strength.label,
    color: strength.color,
    textColor: strength.textColor,
    bgColor: strength.bgColor,
    feedback: feedback.length > 0 ? `Add ${feedback.join(', ')}` : '✓ Excellent password!',
    requirements,
    percentage: (finalScore / 5) * 100
  }
}

/**
 * Get friendly Firebase auth error message
 */
export function getFriendlyAuthError(error) {
  const errorCode = error.code || error.message

  const errorMessages = {
    // Auth errors
    'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
    'auth/weak-password': 'Password is too weak. Please use a stronger password.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/user-not-found': 'No account found with this email. Please sign up first.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password. Please check and try again.',
    'auth/too-many-requests': 'Too many failed attempts. Please wait a few minutes and try again.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/popup-blocked': 'Pop-up was blocked by your browser. Please allow pop-ups and try again.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
    'auth/cancelled-popup-request': 'Only one sign-in at a time. Please try again.',
    'auth/account-exists-with-different-credential': 'An account with this email already exists using a different sign-in method.',
    
    // Firestore errors
    'permission-denied': 'You don\'t have permission to perform this action.',
    'not-found': 'The requested data was not found.',
    'already-exists': 'This data already exists.',
    'resource-exhausted': 'Too many requests. Please try again later.',
    'unauthenticated': 'Please log in to continue.',
  }

  // Check if error code matches
  for (const [code, message] of Object.entries(errorMessages)) {
    if (errorCode.includes(code)) {
      return message
    }
  }

  // Default message
  return error.message || 'An unexpected error occurred. Please try again.'
}