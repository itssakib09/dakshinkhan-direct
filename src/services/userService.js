import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export async function createUserProfile(uid, userData) {
  try {
    console.log('📝 Creating user profile in Firestore')
    console.log('UID:', uid)
    console.log('Data:', userData)
    
    const userRef = doc(db, 'users', uid)
    
    const profileData = {
      uid: uid,
      email: userData.email || '',
      displayName: userData.displayName || '',
      phone: userData.phone || '',
      role: userData.role || 'customer',
      photoURL: userData.photoURL || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true
    }

    await setDoc(userRef, profileData)
    console.log('✅ User profile created successfully')
    
    return profileData
  } catch (error) {
    console.error('❌ Error creating user profile:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    throw error
  }
}

export async function getUserProfile(uid) {
  try {
    console.log('📖 Fetching user profile for UID:', uid)
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      console.log('✅ User profile found')
      return userSnap.data()
    } else {
      console.log('⚠️ No user profile found')
      return null
    }
  } catch (error) {
    console.error('❌ Error fetching user profile:', error)
    throw error
  }
}

export async function updateUserProfile(uid, updates) {
  try {
    const userRef = doc(db, 'users', uid)
    const updateData = {
      ...updates,
      updatedAt: serverTimestamp()
    }
    await setDoc(userRef, updateData, { merge: true })
    console.log('✅ User profile updated')
    return updateData
  } catch (error) {
    console.error('❌ Error updating user profile:', error)
    throw error
  }
}