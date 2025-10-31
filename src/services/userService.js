import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export async function createUserProfile(uid, userData) {
  try {
    console.log('📝 Creating Firestore document...')
    console.log('UID:', uid)
    console.log('Data:', userData)
    
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

    console.log('Writing to Firestore path: users/' + uid)
    await setDoc(userRef, userProfile)
    
    console.log('✅ Firestore document created successfully!')
    return userProfile
    
  } catch (error) {
    console.error('❌ Firestore creation error!')
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Full error:', error)
    throw error
  }
}

export async function getUserProfile(uid) {
  try {
    console.log('📖 Reading Firestore document for UID:', uid)
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      console.log('✅ Document found:', userSnap.data())
      return userSnap.data()
    } else {
      console.log('⚠️ No document found')
      return null
    }
  } catch (error) {
    console.error('❌ Error reading Firestore:', error)
    throw error
  }
}