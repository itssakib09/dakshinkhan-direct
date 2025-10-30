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
  async function signUp(email, password, displayName) {
    console.log('🔵 SignUp attempt:', { email, displayName })
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update profile with display name
      if (displayName) {
        await updateProfile(result.user, { displayName })
      }
      
      console.log('✅ SignUp successful:', result.user.email)
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
  async function signInWithGoogle() {
    console.log('🔵 Google SignIn attempt')
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      console.log('✅ Google SignIn successful:', result.user.email)
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