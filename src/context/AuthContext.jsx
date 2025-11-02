import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { createUserProfile, getUserProfile } from '../services/userService'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sign up with email and password
  async function signUp(email, password, displayName, additionalData = {}) {
  console.log('🔵 [SIGNUP] Starting signup process')
  console.log('Email:', email)
  console.log('Display Name:', displayName)
  
  try {
    // Step 1: Create Firebase Auth user
    console.log('🔧 [SIGNUP] Creating auth user...')
    const result = await createUserWithEmailAndPassword(auth, email, password)
    console.log('✅ [SIGNUP] Auth user created:', result.user.uid)
    
    // Step 2: Update display name
    if (displayName) {
      console.log('📝 [SIGNUP] Updating display name...')
      await updateProfile(result.user, { displayName })
      console.log('✅ [SIGNUP] Display name updated')
    }
    
    // Step 3: CRITICAL - Force token refresh and wait
    console.log('🔄 [SIGNUP] Forcing token refresh...')
    await result.user.getIdToken(true)
    console.log('✅ [SIGNUP] Token refreshed')
    
    // Step 4: CRITICAL - Wait for token to propagate
    console.log('⏳ [SIGNUP] Waiting for auth propagation...')
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('✅ [SIGNUP] Wait complete')
    
    // Step 5: Create Firestore document
    console.log('💾 [SIGNUP] Creating Firestore document...')
    const profileData = await createUserProfile(result.user.uid, {
      email: result.user.email,
      displayName: displayName || '',
      phone: additionalData.phone || '',
      role: additionalData.role || 'customer',
      photoURL: ''
    })
    
    console.log('✅ [SIGNUP] Firestore document created!')
    console.log('🎉 [SIGNUP] Signup complete!')
    
    // Set profile in state immediately
    setUserProfile(profileData)
    
    return { user: result.user, profile: profileData }
  } catch (error) {
    console.error('❌ [SIGNUP] Failed!')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    throw error
  }
}

  // Sign in with email and password
  async function signIn(email, password) {
    console.log('🔵 [LOGIN] Starting login')
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ [LOGIN] Login successful:', result.user.uid)
      return result
    } catch (error) {
      console.error('❌ [LOGIN] Failed:', error.code, error.message)
      throw error
    }
  }

  /**
 * Sign in with Google
 * Creates Firestore document with proper field mapping on first sign-in
 */
async function signInWithGoogle() {
  console.log('🔵 [Google] Starting Google sign-in...')
  
  try {
    const provider = new GoogleAuthProvider()
    
    // Optional: Request additional scopes
    provider.addScope('profile')
    provider.addScope('email')
    
    // Sign in with popup
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    
    console.log('✅ [Google] Authentication successful')
    console.log('User ID:', user.uid)
    console.log('Email:', user.email)
    console.log('Display Name:', user.displayName)
    console.log('Photo URL:', user.photoURL)

    // Check if Firestore profile exists
    console.log('🔍 [Google] Checking for existing profile...')
    let profile = await getUserProfile(user.uid)

    if (!profile) {
      console.log('💾 [Google] First-time user - creating profile...')
      
      // Map Google user fields to our schema with defaults
      const profileData = {
        email: user.email || '',
        displayName: user.displayName || user.email?.split('@')[0] || 'User',
        photoURL: user.photoURL || '',
        phone: '', // Google doesn't provide phone
        role: 'customer' // Default role for Google sign-ins
      }
      
      console.log('[Google] Profile data:', profileData)
      
      // Create Firestore document
      profile = await createUserProfile(user.uid, profileData)
      console.log('✅ [Google] New profile created')
    } else {
      console.log('✅ [Google] Existing profile found')
      
      // Optional: Update profile with latest Google data
      if (user.photoURL && user.photoURL !== profile.photoURL) {
        console.log('🔄 [Google] Updating photo URL...')
        await updateUserProfile(user.uid, {
          photoURL: user.photoURL
        })
        profile.photoURL = user.photoURL
      }
    }

    // Update local state
    setUserProfile(profile)
    
    console.log('🎉 [Google] Sign-in complete!')
    return result

  } catch (error) {
    console.error('❌ [Google] Sign-in failed')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    // Handle specific errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in cancelled. Please try again.')
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Pop-up blocked. Please enable pop-ups for this site.')
    } else if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Another sign-in is in progress.')
    } else {
      throw error
    }
  }
}

  // Sign out
  async function logout() {
    try {
      await signOut(auth)
      setUserProfile(null)
      console.log('✅ [LOGOUT] Successful')
    } catch (error) {
      console.error('❌ [LOGOUT] Failed:', error)
      throw error
    }
  }

  // Listen to auth state and fetch user profile
  useEffect(() => {
    console.log('👂 [AUTH] Setting up auth listener')
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 [AUTH] Auth state changed:', user?.uid || 'No user')
      
      setCurrentUser(user)
      
      if (user) {
        // Fetch user profile from Firestore
        try {
          const profile = await getUserProfile(user.uid)
          setUserProfile(profile)
          console.log('✅ [AUTH] User profile loaded')
        } catch (error) {
          console.error('❌ [AUTH] Failed to load profile:', error)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}