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
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { ref, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase/config'

const USE_API = import.meta.env.VITE_USE_API === 'true'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const LISTINGS_PER_PAGE = 10

export async function createListing(listingData) {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/listings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(listingData)
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  try {
    const listingsRef = collection(db, 'listings')
    const docRef = await addDoc(listingsRef, {
      ...listingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { id: docRef.id, ...listingData }
  } catch (error) {
    console.error('Error creating listing:', error)
    throw error
  }
}

export async function getMyListings(userId, lastDocument = null) {
  if (USE_API) {
    try {
      const page = lastDocument?.page || 0
      const params = new URLSearchParams({ 
        userId, 
        page,
        limit: LISTINGS_PER_PAGE 
      })
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/listings/my?${params}`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

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

    const lastDoc = snapshot.docs.length > 0 
      ? { page: lastDocument?.page ? lastDocument.page + 1 : 1 }
      : null
    const hasMore = snapshot.docs.length === LISTINGS_PER_PAGE

    return { listings, lastDoc, hasMore }
  } catch (error) {
    console.error('Error fetching listings:', error)
    throw error
  }
}

export async function getStoreListings(userId) {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/listings/store/${userId}`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

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
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/users/${userId}`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

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
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/listings/${listingId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

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
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/listings/${listingId}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ imageUrls })
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

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
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/listings/${listingId}`, {
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

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