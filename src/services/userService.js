
import { doc, setDoc, getDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore'
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

import { collection, query, where, getDocs } from 'firebase/firestore'

// Add this function after getUserProfile
export async function getUserByPhone(phone) {
  try {
    console.log('🔍 Searching for user with phone:', phone)
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('phone', '==', phone))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]
      console.log('✅ User found:', userDoc.data())
      return userDoc.data()
    } else {
      console.log('⚠️ No user found with this phone')
      return null
    }
  } catch (error) {
    console.error('❌ Error searching by phone:', error)
    throw error
  }
}