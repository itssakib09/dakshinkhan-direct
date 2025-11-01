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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sign up with email and password
  async function signUp(email, password, displayName, additionalData = {}) {
    console.log('🔵 Starting signup process...')
    console.log('Email:', email)
    console.log('Display Name:', displayName)
    console.log('Additional Data:', additionalData)
    
    try {
      // Step 1: Create Auth User
      console.log('Step 1: Creating Firebase Auth user...')
      const result = await createUserWithEmailAndPassword(auth, email, password)
      console.log('✅ Auth user created with UID:', result.user.uid)
      
      // Step 2: Update Display Name
      if (displayName) {
        console.log('Step 2: Updating display name...')
        await updateProfile(result.user, { displayName })
        console.log('✅ Display name updated')
      }
      
      // Step 3: Create Firestore Document
      console.log('Step 3: Creating Firestore document...')
      const firestoreData = {
        email: result.user.email,
        displayName: displayName || '',
        phone: additionalData.phone || '',
        role: additionalData.role || 'customer',
        photoURL: ''
      }
      console.log('Firestore data to save:', firestoreData)
      
      await createUserProfile(result.user.uid, firestoreData)
      console.log('✅ Firestore document created')
      
      console.log('🎉 SIGNUP COMPLETE!')
      return result
      
    } catch (error) {
      console.error('❌ SIGNUP FAILED!')
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      console.error('Full error:', error)
      throw error
    }
  }

  // Sign in with email and password
  async function signIn(email, password) {
    console.log('🔵 SignIn attempt:', email)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ SignIn successful:', result.user.email)
      return result
    } catch (error) {
      console.error('❌ SignIn error:', error.message)
      throw error
    }
  }

  // Sign in with Google
  async function signInWithGoogle() {
    console.log('🔵 Starting Google sign-in...')
    
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('✅ Google auth successful, UID:', result.user.uid)
      
      // Check if user profile exists
      console.log('Checking if Firestore profile exists...')
      const existingProfile = await getUserProfile(result.user.uid)
      
      if (!existingProfile) {
        console.log('No profile found, creating new one...')
        await createUserProfile(result.user.uid, {
          email: result.user.email,
          displayName: result.user.displayName || '',
          photoURL: result.user.photoURL || '',
          role: 'customer'
        })
        console.log('✅ New profile created')
      } else {
        console.log('✅ Existing profile found')
      }
      
      console.log('🎉 GOOGLE SIGNIN COMPLETE!')
      return result
      
    } catch (error) {
      console.error('❌ GOOGLE SIGNIN FAILED!')
      console.error('Error code:', error.code)
      console.error('Error message:', error.message)
      throw error
    }
  }

  // Sign out
  async function logout() {
    console.log('🔵 Logout attempt')
    try {
      await signOut(auth)
      console.log('✅ Logout successful')
    } catch (error) {
      console.error('❌ Logout error:', error.message)
      throw error
    }
  }

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setLoading(false)
      
      if (user) {
        console.log('👤 User logged in:', user.email)
      } else {
        console.log('👤 No user logged in')
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
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