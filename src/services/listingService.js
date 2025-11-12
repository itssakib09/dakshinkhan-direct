import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  getDocs 
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