import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { USE_API, API_URL } from '../config'

export async function getSponsoredAd() {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const response = await fetch(`${API_URL}/ads/sponsored`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) return await response.json()
      return null
    } catch (error) {
      console.error('Failed to fetch sponsored ad:', error)
      return null
    }
  }

  try {
    const snap = await getDoc(doc(db, 'settings', 'sponsoredAd'))
    if (snap.exists() && snap.data().isActive === true) {
      return { id: snap.id, ...snap.data() }
    }
    return null
  } catch (error) {
    console.error('Failed to fetch sponsored ad:', error)
    return null
  }
}