import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth'
import { auth } from '../firebase/config'
import { createUserProfile, getUserProfile, updateUserProfile } from '../services/userService'

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

  useEffect(() => {
    console.log('🔧 [Session] Setting auth persistence to LOCAL')
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('✅ [Session] Persistence enabled')
      })
      .catch((error) => {
        console.error('❌ [Session] Failed to set persistence:', error)
      })
  }, [])

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

      setUserProfile(profileData)

      console.log('✅ [Session] New user session created')
      return { user, profile: profileData }

    } catch (error) {
      console.error('❌ [AuthContext] signUp error:', error)
      
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

  async function signIn(email, password) {
    console.log('🔵 [AuthContext] Signing in...')
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ [Session] User session restored')
      return userCredential
    } catch (error) {
      console.error('❌ [AuthContext] signIn error:', error)
      throw error
    }
  }

  async function signInWithGoogle() {
    console.log('🔵 [AuthContext] Starting Google sign-in...')
    
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
        if (user.photoURL && user.photoURL !== profile.photoURL) {
          await updateUserProfile(user.uid, { photoURL: user.photoURL })
          profile.photoURL = user.photoURL
        }
      }

      setUserProfile(profile)
      console.log('✅ [Session] Google user session created')
      return result

    } catch (error) {
      console.error('❌ [AuthContext] Google sign-in error:', error)
      throw error
    }
  }

  async function logout() {
    console.log('🔵 [Session] Logging out...')
    try {
      await signOut(auth)
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
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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