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
import { USE_API, API_URL } from '../config'

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
    
    // Build query constraints - SIMPLIFIED to avoid composite index requirements
    let constraints = [
      where('role', '==', 'business'),
      where('onboardingComplete', '==', true),
      orderBy('createdAt', 'desc'),
      limit(BUSINESSES_PER_PAGE * 2) // Fetch more to account for client-side filtering
    ]

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

    // CLIENT-SIDE FILTERING (avoids Firestore composite index issues)
    
    // Filter 1: Store must be active
    businesses = businesses.filter(business => {
      return business.storeSettings?.storeActive === true
    })

    // Filter 2: Category filter
    if (category) {
      businesses = businesses.filter(business => {
        return business.storeSettings?.businessType === category
      })
    }

    // Filter 3: Location filter (if not "ALL Areas")
    if (location && location !== 'ALL Areas') {
      businesses = businesses.filter(business => {
        const serviceAreas = business.storeSettings?.serviceAreas || []
        return serviceAreas.includes(location)
      })
    }

    // Filter 4: Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      businesses = businesses.filter(business => {
        const storeName = business.storeSettings?.storeName?.toLowerCase() || ''
        const businessType = business.storeSettings?.businessType?.toLowerCase() || ''
        return storeName.includes(searchLower) || businessType.includes(searchLower)
      })
    }

    // Limit to actual page size after filtering
    const paginatedBusinesses = businesses.slice(0, BUSINESSES_PER_PAGE)
    const hasMore = businesses.length > BUSINESSES_PER_PAGE

    const lastDocument = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1]
      : null

    return { 
      businesses: paginatedBusinesses, 
      lastDoc: lastDocument, 
      hasMore 
    }
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
      where('onboardingComplete', '==', true)
    )

    const snapshot = await getDocs(q)
    const categoriesSet = new Set()
    
    snapshot.docs.forEach(doc => {
      const data = doc.data()
      // Only include categories from active stores
      if (data.storeSettings?.storeActive === true) {
        const businessType = data.storeSettings?.businessType
        if (businessType) {
          categoriesSet.add(businessType)
        }
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