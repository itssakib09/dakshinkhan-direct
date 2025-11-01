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
    
    try {
      // Step 1: Create Firebase Auth user
      console.log('📧 [SIGNUP] Creating auth user...')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      console.log('✅ [SIGNUP] Auth user created:', result.user.uid)
      
      // Step 2: Update display name
      if (displayName) {
        await updateProfile(result.user, { displayName })
        console.log('✅ [SIGNUP] Display name updated')
      }
      
      // Step 3: Create Firestore document
      console.log('💾 [SIGNUP] Creating Firestore document...')
      const profileData = await createUserProfile(result.user.uid, {
        email: result.user.email,
        displayName: displayName || '',
        phone: additionalData.phone || '',
        role: additionalData.role || 'customer',
        photoURL: ''
      })
      
      console.log('✅ [SIGNUP] Firestore document created')
      console.log('🎉 [SIGNUP] Signup complete!')
      
      return { user: result.user, profile: profileData }
    } catch (error) {
      console.error('❌ [SIGNUP] Failed:', error.code, error.message)
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

  // Sign in with Google
  async function signInWithGoogle() {
    console.log('🔵 [GOOGLE] Starting Google sign-in')
    
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('✅ [GOOGLE] Auth successful:', result.user.uid)
      
      // Check if profile exists
      const existingProfile = await getUserProfile(result.user.uid)
      
      if (!existingProfile) {
        console.log('💾 [GOOGLE] Creating new profile')
        await createUserProfile(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
          role: 'customer'
        })
      }
      
      console.log('✅ [GOOGLE] Sign-in complete')
      return result
    } catch (error) {
      console.error('❌ [GOOGLE] Failed:', error.code, error.message)
      throw error
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