import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { collection, query, where, getDocs, limit } from 'firebase/firestore'
import { auth, db } from '../firebase/config'
import { createUserProfile, getUserProfile, updateUserProfile } from './userService'

const USE_API = import.meta.env.VITE_USE_API === 'true'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Set persistence on module load for Firebase mode
if (!USE_API) {
  setPersistence(auth, browserLocalPersistence)
    .then(() => console.log('✅ [authService] Firebase persistence enabled'))
    .catch((error) => console.error('❌ [authService] Failed to set persistence:', error))
}

/**
 * Sign up with email and password
 */
export async function signUp(email, password, displayName, additionalData = {}) {
  if (USE_API) {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          displayName: displayName || '',
          phone: additionalData.phone || '',
          role: additionalData.role || 'customer'
        })
      })
      
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }
      
      const data = await res.json()
      
      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      
      return {
        user: data.user,
        profile: data.profile
      }
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Firebase mode
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (displayName) {
      await updateProfile(user, { displayName })
    }

    const profileData = await createUserProfile(user.uid, {
      email: user.email,
      displayName: displayName || '',
      phone: additionalData.phone || '',
      role: additionalData.role || 'customer',
      photoURL: ''
    })

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      profile: profileData
    }
  } catch (error) {
    console.error('Firebase signup error:', error)
    
    // Rollback on profile creation failure
    if (error.message?.includes('profile')) {
      try {
        await auth.currentUser?.delete()
        console.log('✅ Rollback complete')
      } catch (rollbackError) {
        console.error('❌ Rollback failed:', rollbackError)
      }
    }
    
    throw error
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email, password) {
  if (USE_API) {
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }
      
      const data = await res.json()
      
      // Store token
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      
      return {
        user: data.user,
        profile: data.profile
      }
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Firebase mode
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      }
    }
  } catch (error) {
    console.error('Firebase signin error:', error)
    throw error
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle() {
  if (USE_API) {
    try {
      // For API mode, you'll need to implement Google OAuth flow
      // This is a placeholder - actual implementation depends on your backend
      throw new Error('Google sign-in not yet implemented for API mode')
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Firebase mode
  try {
    const provider = new GoogleAuthProvider()
    provider.addScope('profile')
    provider.addScope('email')
    
    const result = await signInWithPopup(auth, provider)
    const user = result.user

    let profile = await getUserProfile(user.uid)

    if (!profile) {
      const profileData = {
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || '',
        phone: '',
        role: 'customer'
      }
      
      profile = await createUserProfile(user.uid, profileData)
    } else {
      // Update photo if changed
      if (user.photoURL && user.photoURL !== profile.photoURL) {
        await updateUserProfile(user.uid, { photoURL: user.photoURL })
        profile.photoURL = user.photoURL
      }
    }

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      },
      profile
    }
  } catch (error) {
    console.error('Firebase Google sign-in error:', error)
    throw error
  }
}

/**
 * Sign out and clear session
 */
export async function logout() {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token')
      
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
      }
      
      // Clear token
      localStorage.removeItem('token')
      
      return { success: true }
    } catch (error) {
      console.error('API logout error:', error)
      // Still clear token even if API call fails
      localStorage.removeItem('token')
      throw error
    }
  }

  // Firebase mode
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Firebase logout error:', error)
    throw error
  }
}

/**
 * Listen to auth state changes
 * Returns unsubscribe function
 */
export function onAuthStateChanged(callback) {
  if (USE_API) {
    // For API mode, check token on mount and return dummy unsubscribe
    const checkSession = async () => {
      const token = localStorage.getItem('token')
      
      if (!token) {
        callback(null)
        return
      }
      
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!res.ok) {
          localStorage.removeItem('token')
          callback(null)
          return
        }
        
        const data = await res.json()
        callback(data.user)
      } catch (error) {
        console.error('Session check error:', error)
        localStorage.removeItem('token')
        callback(null)
      }
    }
    
    checkSession()
    
    // Return unsubscribe function (no-op for API mode)
    return () => {}
  }

  // Firebase mode
  return firebaseOnAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
      })
    } else {
      callback(null)
    }
  })
}

/**
 * Find user email by phone number
 * Returns email if found, null if not found
 */
export async function getUserEmailByPhone(phone) {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/auth/phone-lookup?phone=${encodeURIComponent(phone)}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      return data.email || null
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

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