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

const USE_API = import.meta.env.VITE_USE_API === 'false'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const BUSINESSES_PER_PAGE = 20

/**
 * Get businesses with filters
 * @param {Object} filters - { search, category, location, lastDoc }
 * @returns {Promise<{businesses: Array, lastDoc: any, hasMore: boolean}>}
 */
export async function getBusinesses(filters = {}) {
  const { search = '', category = '', location = '', lastDoc = null } = filters

  if (USE_API) {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category) params.append('category', category)
      if (location && location !== 'ALL Areas') params.append('location', location)
      if (lastDoc?.page) params.append('page', lastDoc.page)
      params.append('limit', BUSINESSES_PER_PAGE)

      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/businesses?${params}`, {
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
    const usersRef = collection(db, 'users')
    
    // Build query constraints
    let constraints = [
      where('role', '==', 'business'),
      where('onboardingComplete', '==', true)
    ]

    // Add category filter
    if (category) {
      constraints.push(where('storeSettings.businessType', '==', category))
    }

    // Add location filter (if not "ALL Areas")
    if (location && location !== 'ALL Areas') {
      constraints.push(where('storeSettings.serviceAreas', 'array-contains', location))
    }

    // Add store active filter
    constraints.push(where('storeSettings.storeActive', '==', true))

    // Add ordering
    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(BUSINESSES_PER_PAGE))

    // Add pagination
    if (lastDoc) {
      constraints.push(startAfter(lastDoc))
    }

    const q = query(usersRef, ...constraints)
    const snapshot = await getDocs(q)
    
    let businesses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Client-side search filter (if search term provided)
    if (search) {
      const searchLower = search.toLowerCase()
      businesses = businesses.filter(business => {
        const storeName = business.storeSettings?.storeName?.toLowerCase() || ''
        const businessType = business.storeSettings?.businessType?.toLowerCase() || ''
        return storeName.includes(searchLower) || businessType.includes(searchLower)
      })
    }

    const lastDocument = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1]
      : null
    const hasMore = snapshot.docs.length === BUSINESSES_PER_PAGE

    return { businesses, lastDoc: lastDocument, hasMore }
  } catch (error) {
    console.error('Error fetching businesses:', error)
    throw error
  }
}

/**
 * Get a single business by user ID
 * @param {string} userId - Business owner user ID
 * @returns {Promise<Object|null>}
 */
export async function getBusinessById(userId) {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/businesses/${userId}`, {
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
      const data = userDoc.data()
      if (data.role === 'business' && data.onboardingComplete) {
        return { id: userDoc.id, ...data }
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching business:', error)
    throw error
  }
}

/**
 * Get business categories (unique business types from active businesses)
 * @returns {Promise<Array<string>>}
 */
export async function getBusinessCategories() {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/businesses/categories`, {
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
    const usersRef = collection(db, 'users')
    const q = query(
      usersRef,
      where('role', '==', 'business'),
      where('onboardingComplete', '==', true),
      where('storeSettings.storeActive', '==', true)
    )

    const snapshot = await getDocs(q)
    const categoriesSet = new Set()
    
    snapshot.docs.forEach(doc => {
      const businessType = doc.data().storeSettings?.businessType
      if (businessType) {
        categoriesSet.add(businessType)
      }
    })

    return Array.from(categoriesSet).sort()
  } catch (error) {
    console.error('Error fetching business categories:', error)
    return []
  }
}

/**
 * Check if business is currently open based on opening hours
 * @param {Object} openingHours - Business opening hours object
 * @returns {boolean}
 */
export function isBusinessOpen(openingHours) {
  if (!openingHours) return false

  const now = new Date()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const currentDay = dayNames[now.getDay()]
  
  const todayHours = openingHours[currentDay]
  if (!todayHours || todayHours.closed) return false

  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  // Parse open time
  const [openHour, openMin] = todayHours.open.split(':').map(Number)
  const openTime = openHour * 60 + openMin
  
  // Parse close time
  const [closeHour, closeMin] = todayHours.close.split(':').map(Number)
  const closeTime = closeHour * 60 + closeMin

  return currentTime >= openTime && currentTime <= closeTime
}