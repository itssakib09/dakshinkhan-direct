// searchService.js
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { USE_API, API_URL } from '../config'

/**
 * Search across all collections (businesses, services, stores)
 * @param {string} searchQuery - Search keywords
 * @param {string} location - Selected location or 'ALL'
 * @returns {Promise<Array>} Array of search results with type and matchScore
 */
export async function searchAll(searchQuery, location) {
  if (USE_API) {
    return searchAllAPI(searchQuery, location)
  } else {
    return searchAllFirebase(searchQuery, location)
  }
}

/**
 * Firebase implementation
 */
async function searchAllFirebase(searchQuery, location) {
  const searchTerms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0)
  const results = []

  try {
    const usersRef = collection(db, 'users')
    
    // Parallel queries for businesses and services
    const [businessSnapshot, serviceSnapshot] = await Promise.all([
      getDocs(query(
        usersRef,
        where('role', '==', 'business'),
        where('onboardingComplete', '==', true)
      )),
      getDocs(query(
        usersRef,
        where('role', '==', 'service'),
        where('onboardingComplete', '==', true)
      ))
    ])

    // Process business users
    businessSnapshot.forEach(doc => {
      const data = doc.data()
      
      // Apply location filter
      if (location && location !== 'ALL') {
        const serviceAreas = data.storeSettings?.serviceAreas || []
        if (!serviceAreas.includes(location)) return
      }

      // Build searchable text
      const storeName = data.storeSettings?.storeName?.toLowerCase() || ''
      const businessType = data.storeSettings?.businessType?.toLowerCase() || ''
      const searchableText = `${storeName} ${businessType}`
      
      // Calculate match score
      const matchScore = searchTerms.reduce((score, term) => {
        return score + (searchableText.includes(term) ? 1 : 0)
      }, 0)

      if (matchScore > 0) {
        results.push({
          id: doc.id,
          type: 'business',
          ...data,
          matchScore
        })
      }
    })

    // Process service users
    serviceSnapshot.forEach(doc => {
      const data = doc.data()
      
      // Apply location filter
      if (location && location !== 'ALL') {
        const coverageAreas = data.serviceProfile?.coverageAreas || []
        if (!coverageAreas.includes(location)) return
      }

      // Build searchable text
      const displayName = data.displayName?.toLowerCase() || ''
      const profession = data.serviceProfile?.profession?.toLowerCase() || ''
      const services = data.serviceProfile?.servicesOffered?.join(' ').toLowerCase() || ''
      const searchableText = `${displayName} ${profession} ${services}`
      
      // Calculate match score
      const matchScore = searchTerms.reduce((score, term) => {
        return score + (searchableText.includes(term) ? 1 : 0)
      }, 0)

      if (matchScore > 0) {
        results.push({
          id: doc.id,
          type: 'service',
          ...data,
          matchScore
        })
      }
    })

    // Sort by match score descending
    results.sort((a, b) => b.matchScore - a.matchScore)
    return results

  } catch (error) {
    console.error('Error searching Firebase:', error)
    throw error
  }
}

/**
 * REST API implementation
 */
async function searchAllAPI(searchQuery, location) {
  const token = localStorage.getItem('authToken')
  
  const params = new URLSearchParams({
    q: searchQuery,
    location: location || 'ALL'
  })

  const response = await fetch(`${API_URL}/search?${params}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  })

  if (!response.ok) {
    throw new Error('Search failed')
  }

  const data = await response.json()
  return data.results || []
}