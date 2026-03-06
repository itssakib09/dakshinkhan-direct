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

const USE_API = import.meta.env.VITE_USE_API === 'true'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const PROVIDERS_PER_PAGE = 20

/**
 * Get service providers with filters
 * @param {Object} filters - { search, category, location, lastDoc }
 * @returns {Promise<{providers: Array, lastDoc: any, hasMore: boolean}>}
 */
export async function getServiceProviders(filters = {}) {
  const { search = '', category = '', location = '', lastDoc = null } = filters

  if (USE_API) {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (category) params.append('category', category)
      if (location && location !== 'ALL Areas') params.append('location', location)
      if (lastDoc?.page) params.append('page', lastDoc.page)
      params.append('limit', PROVIDERS_PER_PAGE)

      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/service-providers?${params}`, {
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
      where('role', '==', 'service'),
      where('onboardingComplete', '==', true)
    ]

    // Add category filter
    if (category) {
      constraints.push(where('serviceProfile.servicesOffered', 'array-contains', category))
    }

    // Add location filter (if not "ALL Areas")
    if (location && location !== 'ALL Areas') {
      constraints.push(where('serviceProfile.coverageAreas', 'array-contains', location))
    }

    // Add ordering
    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(PROVIDERS_PER_PAGE))

    // Add pagination
    if (lastDoc) {
      constraints.push(startAfter(lastDoc))
    }

    const q = query(usersRef, ...constraints)
    const snapshot = await getDocs(q)
    
    let providers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Client-side search filter (if search term provided)
    if (search) {
      const searchLower = search.toLowerCase()
      providers = providers.filter(provider => {
        const displayName = provider.displayName?.toLowerCase() || ''
        const profession = provider.serviceProfile?.profession?.toLowerCase() || ''
        const services = provider.serviceProfile?.servicesOffered?.join(' ').toLowerCase() || ''
        return displayName.includes(searchLower) || 
               profession.includes(searchLower) || 
               services.includes(searchLower)
      })
    }

    const lastDocument = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1]
      : null
    const hasMore = snapshot.docs.length === PROVIDERS_PER_PAGE

    return { providers, lastDoc: lastDocument, hasMore }
  } catch (error) {
    console.error('Error fetching service providers:', error)
    throw error
  }
}

/**
 * Get a single service provider by user ID
 * @param {string} userId - Service provider user ID
 * @returns {Promise<Object|null>}
 */
export async function getServiceProviderById(userId) {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/service-providers/${userId}`, {
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
      if (data.role === 'service' && data.onboardingComplete) {
        return { id: userDoc.id, ...data }
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching service provider:', error)
    throw error
  }
}

/**
 * Check if service provider is currently available based on schedule
 * @param {Object} availability - Provider availability object
 * @returns {boolean}
 */
export function isProviderAvailable(availability) {
  if (!availability || !availability.availableNow) return false
  if (!availability.schedule) return availability.availableNow

  const now = new Date()
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const currentDay = dayNames[now.getDay()]
  
  const todaySchedule = availability.schedule[currentDay]
  if (!todaySchedule || todaySchedule.closed || !todaySchedule.available) return false

  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  // Parse open time
  const [openHour, openMin] = todaySchedule.open.split(':').map(Number)
  const openTime = openHour * 60 + openMin
  
  // Parse close time
  const [closeHour, closeMin] = todaySchedule.close.split(':').map(Number)
  const closeTime = closeHour * 60 + closeMin

  return currentTime >= openTime && currentTime <= closeTime
}

/**
 * Get service categories (unique services from active providers)
 * @returns {Promise<Array<string>>}
 */
export async function getServiceCategories() {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/service-providers/categories`, {
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
      where('role', '==', 'service'),
      where('onboardingComplete', '==', true)
    )

    const snapshot = await getDocs(q)
    const categoriesSet = new Set()
    
    snapshot.docs.forEach(doc => {
      const services = doc.data().serviceProfile?.servicesOffered
      if (services && Array.isArray(services)) {
        services.forEach(service => categoriesSet.add(service))
      }
    })

    return Array.from(categoriesSet).sort()
  } catch (error) {
    console.error('Error fetching service categories:', error)
    return []
  }
}