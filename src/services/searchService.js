// searchService.js
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'
import { USE_API, API_URL } from '../config'

export async function searchAll(searchQuery, location) {
  if (USE_API) {
    return searchAllAPI(searchQuery, location)
  } else {
    return searchAllFirebase(searchQuery, location)
  }
}

async function searchAllFirebase(searchQuery, location) {
  const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/).filter(t => t.length > 0)
  
  if (searchTerms.length === 0) {
    return []
  }

  const results = []

  try {
    const usersRef = collection(db, 'users')
    
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

    businessSnapshot.forEach(doc => {
      const data = doc.data()
      
      const text = [
        data.storeSettings?.storeName,
        data.storeSettings?.businessType,
        data.storeSettings?.serviceAreas?.join(' ')
      ].filter(Boolean).join(' ').toLowerCase()
      
      if (location && location !== 'ALL Areas' && location !== 'ALL') {
        const areas = data.storeSettings?.serviceAreas || []
        if (!areas.includes(location)) return
      }
      
      const matchScore = searchTerms.reduce((score, term) => {
        return score + (text.includes(term) ? 1 : 0)
      }, 0)
      
      if (matchScore > 0 && data.storeSettings?.storeActive === true) {
        results.push({
          id: doc.id,
          type: 'business',
          displayName: data.storeSettings?.storeName || data.displayName,
          category: data.storeSettings?.businessType || '',
          location: data.storeSettings?.serviceAreas?.[0] || '',
          photoURL: data.photoURL || '',
          storeActive: data.storeSettings?.storeActive,
          openingHours: data.storeSettings?.openingHours,
          matchScore,
          ...data
        })
      }
    })

    serviceSnapshot.forEach(doc => {
      const data = doc.data()
      
      const text = [
        data.displayName,
        data.serviceProfile?.profession,
        data.serviceProfile?.servicesOffered?.join(' '),
        data.serviceProfile?.coverageAreas?.join(' ')
      ].filter(Boolean).join(' ').toLowerCase()
      
      const areas = data.serviceProfile?.coverageAreas || []
      if (location && location !== 'ALL Areas' && location !== 'ALL') {
        if (!areas.includes('ALL') && !areas.includes(location)) return
      }
      
      const matchScore = searchTerms.reduce((score, term) => {
        return score + (text.includes(term) ? 1 : 0)
      }, 0)
      
      if (matchScore > 0 && (data.serviceProfile?.servicesOffered?.length || 0) > 0) {
        results.push({
          id: doc.id,
          type: 'service',
          displayName: data.displayName || '',
          category: data.serviceProfile?.profession || '',
          location: data.serviceProfile?.coverageAreas?.[0] || '',
          photoURL: data.serviceProfile?.profilePhoto || data.photoURL || '',
          servicesOffered: data.serviceProfile?.servicesOffered || [],
          availableNow: data.serviceProfile?.availability?.availableNow || false,
          matchScore,
          ...data
        })
      }
    })

    results.sort((a, b) => b.matchScore - a.matchScore)
    return results

  } catch (error) {
    console.error('Error searching Firebase:', error)
    throw error
  }
}

async function searchAllAPI(searchQuery, location) {
  const token = localStorage.getItem('token')
  
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