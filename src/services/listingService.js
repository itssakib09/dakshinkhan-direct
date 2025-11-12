import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDocs,
  getDoc,
  doc
} from 'firebase/firestore'
import { db } from '../firebase/config'

const LISTINGS_PER_PAGE = 10

export async function getMyListings(userId, lastDocument = null) {
  try {
    const listingsRef = collection(db, 'listings')
    
    let q = query(
      listingsRef,
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(LISTINGS_PER_PAGE)
    )

    if (lastDocument) {
      q = query(
        listingsRef,
        where('ownerId', '==', userId),
        orderBy('createdAt', 'desc'),
        startAfter(lastDocument),
        limit(LISTINGS_PER_PAGE)
      )
    }

    const snapshot = await getDocs(q)
    
    const listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null
    const hasMore = snapshot.docs.length === LISTINGS_PER_PAGE

    return { listings, lastDoc, hasMore }
  } catch (error) {
    console.error('Error fetching listings:', error)
    throw error
  }
}

// NEW: Get store listings (public)
export async function getStoreListings(userId) {
  try {
    const listingsRef = collection(db, 'listings')
    
    const q = query(
      listingsRef,
      where('ownerId', '==', userId),
      where('status', '==', 'active'), // Only show active listings
      orderBy('createdAt', 'desc')
    )

    const snapshot = await getDocs(q)
    
    const listings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return listings
  } catch (error) {
    console.error('Error fetching store listings:', error)
    throw error
  }
}

// NEW: Get store owner info
export async function getStoreOwner(userId) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() }
    }
    return null
  } catch (error) {
    console.error('Error fetching store owner:', error)
    throw error
  }
}