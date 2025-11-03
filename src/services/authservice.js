import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Find user email by phone number
 * Returns email if found, null if not found
 */
export async function getUserEmailByPhone(phone) {
  try {
    console.log('[authService] Looking up email for phone:', phone)
    
    const usersRef = collection(db, 'users')
    const q = query(
      usersRef,
      where('phone', '==', phone),
      limit(1)
    )
    
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      console.log('[authService] No user found with phone:', phone)
      return null
    }
    
    const userDoc = querySnapshot.docs[0]
    const email = userDoc.data().email
    
    console.log('[authService] Found email:', email)
    return email
    
  } catch (error) {
    console.error('[authService] Phone lookup error:', error)
    throw new Error('Failed to lookup phone number')
  }
}

/**
 * Detect if input is email or phone
 */
export function detectInputType(input) {
  // Remove spaces and dashes
  const cleaned = input.trim().replace(/[\s-]/g, '')
  
  // Check if it's an email (contains @)
  if (cleaned.includes('@')) {
    return 'email'
  }
  
  // Check if it's a phone number (starts with + or digits)
  if (/^[\d+]/.test(cleaned)) {
    return 'phone'
  }
  
  return 'unknown'
}