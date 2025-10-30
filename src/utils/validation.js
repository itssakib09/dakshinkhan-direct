import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js'

/**
 * Normalize phone number to Bangladesh format
 * Accepts: 01712345678, +8801712345678, 8801712345678
 * Returns: +8801712345678
 */
export function normalizePhoneBD(phone) {
  if (!phone) return ''
  
  // Remove all spaces and dashes
  let cleaned = phone.replace(/[\s-]/g, '')
  
  // If starts with 0, add +880
  if (cleaned.startsWith('0')) {
    cleaned = '+880' + cleaned.slice(1)
  }
  // If starts with 880, add +
  else if (cleaned.startsWith('880')) {
    cleaned = '+' + cleaned
  }
  // If doesn't start with +, add +880
  else if (!cleaned.startsWith('+')) {
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
 * +8801712345678 -> +880 1712-345678
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
 * Validate email address
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Check password strength
 * Returns: { score: 0-4, feedback: string }
 */
export function checkPasswordStrength(password) {
  // Handle empty or null password
  if (!password || password.length === 0) {
    return null // Return null instead of an object with score 0
  }

  let score = 0
  const feedback = []

  // Length check
  if (password.length >= 8) {
    score++
  } else {
    feedback.push('at least 8 characters')
  }

  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score++
  } else {
    feedback.push('one uppercase letter')
  }

  // Lowercase check
  if (/[a-z]/.test(password)) {
    score++
  } else {
    feedback.push('one lowercase letter')
  }

  // Number check
  if (/\d/.test(password)) {
    score++
  } else {
    feedback.push('one number')
  }

  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score++
  } else {
    feedback.push('one special character')
  }

  const strengthLevels = [
    { label: 'Very Weak', color: 'red' },
    { label: 'Weak', color: 'orange' },
    { label: 'Fair', color: 'yellow' },
    { label: 'Good', color: 'blue' },
    { label: 'Strong', color: 'green' },
  ]

  // FIX: Clamp score between 0 and 4 (array has only 5 items, indices 0-4)
  const clampedScore = Math.min(score, 4)
  const strength = strengthLevels[clampedScore]
  
  const feedbackText = feedback.length > 0 
    ? `Add ${feedback.join(', ')}` 
    : 'Strong password!'

  return {
    score: clampedScore,
    label: strength.label,
    color: strength.color,
    feedback: feedbackText
  }
}