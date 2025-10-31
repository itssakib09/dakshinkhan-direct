import { createUserProfile, getUserProfile } from '../services/userService'
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
// Sign up with email and password
async function signUp(email, password, displayName, additionalData = {}) {
  console.log('🔵 SignUp attempt:', { email, displayName, additionalData })
  try {
    // Step 1: Create Firebase Auth user
    const result = await createUserWithEmailAndPassword(auth, email, password)
    console.log('✅ Auth user created:', result.user.uid)
    
    // Step 2: Update display name
    if (displayName) {
      await updateProfile(result.user, { displayName })
      console.log('✅ Display name updated')
    }
    
    // Step 3: Create Firestore document
    await createUserProfile(result.user.uid, {
      email: result.user.email,
      displayName: displayName || '',
      phone: additionalData.phone || '',
      role: additionalData.role || 'customer',
      photoURL: ''
    })
    
    console.log('✅ SignUp complete!')
    return result
  } catch (error) {
    console.error('❌ SignUp error:', error.message)
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
// Sign in with Google
async function signInWithGoogle() {
  console.log('🔵 Google SignIn attempt')
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    console.log('✅ Google auth successful:', result.user.uid)
    
    // Check if user document exists
    const existingProfile = await getUserProfile(result.user.uid)
    
    if (!existingProfile) {
      console.log('📝 Creating new Firestore profile for Google user')
      await createUserProfile(result.user.uid, {
        email: result.user.email,
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || '',
        role: 'customer'
      })
    } else {
      console.log('✅ Existing profile found, skipping creation')
    }
    
    return result
  } catch (error) {
    console.error('❌ Google SignIn error:', error.message)
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