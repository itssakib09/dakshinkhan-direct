import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/config'

const USE_API = import.meta.env.VITE_USE_API === 'false'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

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

  const collections = ['businesses', 'services', 'stores']
  
  for (const collectionName of collections) {
    const collectionRef = collection(db, collectionName)
    let q = collectionRef

    if (location && location !== 'ALL') {
      q = query(collectionRef, where('location', '==', location))
    }

    const snapshot = await getDocs(q)
    
    snapshot.forEach(doc => {
      const data = doc.data()
      const searchableText = `${data.name || ''} ${data.title || ''} ${data.description || ''} ${data.category || ''} ${data.tags?.join(' ') || ''}`.toLowerCase()
      
      const matchScore = searchTerms.reduce((score, term) => {
        return score + (searchableText.includes(term) ? 1 : 0)
      }, 0)

      if (matchScore > 0) {
        results.push({
          id: doc.id,
          type: collectionName.slice(0, -1),
          ...data,
          matchScore
        })
      }
    })
  }

  results.sort((a, b) => b.matchScore - a.matchScore)
  return results
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

  const response = await fetch(`${API_BASE_URL}/search?${params}`, {
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