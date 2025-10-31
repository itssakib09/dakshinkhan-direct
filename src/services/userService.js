import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Create user profile in Firestore
 */
export async function createUserProfile(uid, userData) {
  try {
    const userRef = doc(db, 'users', uid)
    
    const userProfile = {
      uid,
      email: userData.email,
      displayName: userData.displayName || '',
      phone: userData.phone || '',
      role: userData.role || 'customer',
      photoURL: userData.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    }

    await setDoc(userRef, userProfile)
    
    console.log('✅ User profile created in Firestore:', uid)
    return userProfile
  } catch (error) {
    console.error('❌ Error creating user profile:', error)
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
      return userSnap.data()
    } else {
      console.log('No user profile found')
      return null
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfile(uid, updates) {
  try {
    const userRef = doc(db, 'users', uid)
    
    const updatedData = {
      ...updates,
      updatedAt: serverTimestamp()
    }

    await setDoc(userRef, updatedData, { merge: true })
    
    console.log('✅ User profile updated:', uid)
    return updatedData
  } catch (error) {
    console.error('❌ Error updating user profile:', error)
    throw error
  }
}