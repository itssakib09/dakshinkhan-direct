import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Create user profile in Firestore
 */
export async function createUserProfile(uid, userData) {
  try {
    console.log('📝 Creating Firestore profile for:', uid)
    
    const userRef = doc(db, 'users', uid)
    
    const userProfile = {
      uid: uid,
      email: userData.email || '',
      displayName: userData.displayName || '',
      phone: userData.phone || '',
      role: userData.role || 'customer',
      photoURL: userData.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    }

    await setDoc(userRef, userProfile)
    
    console.log('✅ Firestore profile created successfully!')
    console.log('Profile data:', userProfile)
    
    return userProfile
  } catch (error) {
    console.error('❌ Error creating Firestore profile:', error)
    throw error
  }
}

/**
 * Get user profile from Firestore
 */
export async function getUserProfile(uid) {
  try {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      console.log('✅ User profile found:', userSnap.data())
      return userSnap.data()
    } else {
      console.log('⚠️ No user profile found for:', uid)
      return null
    }
  } catch (error) {
    console.error('❌ Error getting user profile:', error)
    throw error
  }
}