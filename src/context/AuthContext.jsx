import { createContext, useContext, useEffect, useState } from 'react'
import {
  signUp as authSignUp,
  signIn as authSignIn,
  signInWithGoogle as authSignInWithGoogle,
  logout as authLogout,
  onAuthStateChanged
} from '../services/authservice'
import { getUserProfile } from '../services/userService'

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
  const [profileLoading, setProfileLoading] = useState(false)

  /**
   * Refresh user profile from Firestore
   * Call this after updating profile to sync state
   */
  async function refreshUserProfile() {
    if (!currentUser) return null
    
    console.log('🔄 [AuthContext] Refreshing user profile...')
    try {
      const profile = await getUserProfile(currentUser.uid)
      if (profile) {
        setUserProfile(profile)
        console.log('✅ [AuthContext] Profile refreshed')
        console.log('   - onboardingComplete:', profile.onboardingComplete)
      }
      return profile
    } catch (error) {
      console.error('❌ [AuthContext] Failed to refresh profile:', error)
      return null
    }
  }

  async function signUp(email, password, displayName, additionalData = {}) {
    console.log('🔵 [AuthContext] Starting signup...')
    
    try {
      const { user, profile } = await authSignUp(email, password, displayName, additionalData)
      
      setCurrentUser(user)
      setUserProfile(profile)

      console.log('✅ [Session] New user session created')
      return { user, profile }

    } catch (error) {
      console.error('❌ [AuthContext] signUp error:', error)
      throw error
    }
  }

  async function signIn(email, password) {
    console.log('🔵 [AuthContext] Signing in...')
    try {
      const { user } = await authSignIn(email, password)
      setCurrentUser(user)
      console.log('✅ [Session] User session restored')
      return { user }
    } catch (error) {
      console.error('❌ [AuthContext] signIn error:', error)
      throw error
    }
  }

  async function signInWithGoogle(role = null) {
    console.log('🔵 [AuthContext] Starting Google sign-in...')
    if (role) {
      console.log('   - Role provided:', role)
    }
    
    try {
      const { user, profile } = await authSignInWithGoogle(role)
      
      setCurrentUser(user)
      setUserProfile(profile)
      
      console.log('✅ [Session] Google user session created')
      console.log('   - Profile role:', profile.role)
      return { user, profile }

    } catch (error) {
      console.error('❌ [AuthContext] Google sign-in error:', error)
      throw error
    }
  }

  async function logout() {
    console.log('🔵 [Session] Logging out...')
    try {
      await authLogout()
      setCurrentUser(null)
      setUserProfile(null)
      console.log('✅ [Session] Session cleared')
    } catch (error) {
      console.error('❌ [Session] Logout error:', error)
      throw error
    }
  }

  useEffect(() => {
    console.log('👂 [Session] Setting up auth state listener...')
    
    const unsubscribe = onAuthStateChanged(async (user) => {
      console.log('🔄 [Session] Auth state changed')
      
      if (user) {
        console.log('✅ [Session] User detected:', user.uid)
        setCurrentUser(user)

        setProfileLoading(true)
        try {
          const profile = await getUserProfile(user.uid)
          
          if (profile) {
            setUserProfile(profile)
            console.log('✅ [Session] Profile restored from Firestore')
            console.log('   - Role:', profile.role)
            console.log('   - Name:', profile.displayName)
          } else {
            console.warn('⚠️ [Session] User has no Firestore profile')
            setUserProfile(null)
          }
        } catch (error) {
          console.error('❌ [Session] Failed to restore profile:', error)
          setUserProfile(null)
        } finally {
          setProfileLoading(false)
        }
      } else {
        console.log('⚪ [Session] No user - session cleared')
        setCurrentUser(null)
        setUserProfile(null)
        setProfileLoading(false)
      }

      setLoading(false)
    })

    return () => {
      console.log('👋 [Session] Cleaning up auth listener')
      unsubscribe()
    }
  }, [])

  const value = {
    currentUser,
    userProfile,
    loading,
    profileLoading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    refreshUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}