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
    
    // Build query constraints - SIMPLIFIED to avoid composite index requirements
    let constraints = [
      where('role', '==', 'service'),
      where('onboardingComplete', '==', true),
      orderBy('createdAt', 'desc'),
      limit(PROVIDERS_PER_PAGE * 2) // Fetch more to account for client-side filtering
    ]

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

    // CLIENT-SIDE FILTERING (avoids Firestore composite index issues)
    
    // Filter 1: Provider must have service profile
    providers = providers.filter(provider => {
      return provider.serviceProfile && 
             provider.serviceProfile.servicesOffered && 
             provider.serviceProfile.servicesOffered.length > 0
    })

    // Filter 2: Category filter
    if (category) {
      providers = providers.filter(provider => {
        const services = provider.serviceProfile?.servicesOffered || []
        const serviceCategory = provider.serviceProfile?.serviceCategory || ''
        const subcategory = provider.serviceProfile?.subcategory || ''
        return services.includes(category) || 
               serviceCategory === category || 
               subcategory === category
      })
    }

    // Filter 3: Location filter (if not "ALL Areas")
    if (location && location !== 'ALL Areas') {
      providers = providers.filter(provider => {
        const coverageAreas = provider.serviceProfile?.coverageAreas || []
        return coverageAreas.includes(location)
      })
    }

    // Filter 4: Search filter
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

    // Limit to actual page size after filtering
    const paginatedProviders = providers.slice(0, PROVIDERS_PER_PAGE)
    const hasMore = providers.length > PROVIDERS_PER_PAGE

    const lastDocument = snapshot.docs.length > 0 
      ? snapshot.docs[snapshot.docs.length - 1]
      : null

    return { 
      providers: paginatedProviders, 
      lastDoc: lastDocument, 
      hasMore 
    }
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
  // Return availableNow flag (your Firebase data doesn't have open/close times)
  if (!availability) return false
  return availability.availableNow || false
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
      const data = doc.data()
      // Only include categories from providers with complete profiles
      if (data.serviceProfile?.servicesOffered) {
        const services = data.serviceProfile.servicesOffered
        if (Array.isArray(services)) {
          services.forEach(service => categoriesSet.add(service))
        }
      }
    })

    return Array.from(categoriesSet).sort()
  } catch (error) {
    console.error('Error fetching service categories:', error)
    return []
  }
}