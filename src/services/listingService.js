import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase/config'

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

export async function getStoreListings(userId) {
  try {
    const listingsRef = collection(db, 'listings')
    
    const q = query(
      listingsRef,
      where('ownerId', '==', userId),
      where('status', '==', 'active'),
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

export async function updateListing(listingId, data) {
  try {
    const listingRef = doc(db, 'listings', listingId)
    await updateDoc(listingRef, {
      ...data,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating listing:', error)
    throw error
  }
}

export async function deleteListing(listingId, imageUrls = []) {
  try {
    if (imageUrls.length > 0) {
      await Promise.allSettled(
        imageUrls.map(url => {
          try {
            const imageRef = ref(storage, url)
            return deleteObject(imageRef)
          } catch (err) {
            console.warn('Failed to delete image:', url, err)
            return Promise.resolve()
          }
        })
      )
    }

    await deleteDoc(doc(db, 'listings', listingId))
    return { success: true }
  } catch (error) {
    console.error('Error deleting listing:', error)
    throw error
  }
}

export async function getListing(listingId) {
  try {
    const listingDoc = await getDoc(doc(db, 'listings', listingId))
    if (listingDoc.exists()) {
      return { id: listingDoc.id, ...listingDoc.data() }
    }
    return null
  } catch (error) {
    console.error('Error fetching listing:', error)
    throw error
  }
}