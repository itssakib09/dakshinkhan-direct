import { doc, updateDoc, increment, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

// Debounce tracking to prevent spam
const DEBOUNCE_TIME = 5000 // 5 seconds
const trackedEvents = new Map()

/**
 * Track view on listing or store page
 * @param {string} listingId - Listing ID
 * @param {string} ownerId - Owner user ID
 */
export async function trackView(listingId, ownerId) {
  const key = `view-${listingId}`
  
  // Check if already tracked recently
  if (trackedEvents.has(key)) {
    const lastTime = trackedEvents.get(key)
    if (Date.now() - lastTime < DEBOUNCE_TIME) {
      return // Skip if tracked within last 5 seconds
    }
  }

  try {
    // Update listing view count
    const listingRef = doc(db, 'listings', listingId)
    await updateDoc(listingRef, {
      views: increment(1),
      updatedAt: serverTimestamp()
    })

    // Update daily analytics
    await incrementDailyAnalytics(ownerId, 'views')

    // Mark as tracked
    trackedEvents.set(key, Date.now())

    console.log('✅ View tracked:', listingId)
  } catch (error) {
    console.error('Error tracking view:', error)
  }
}

/**
 * Track call button click
 * @param {string} listingId - Listing ID
 * @param {string} ownerId - Owner user ID
 */
export async function trackCall(listingId, ownerId) {
  const key = `call-${listingId}`
  
  if (trackedEvents.has(key)) {
    const lastTime = trackedEvents.get(key)
    if (Date.now() - lastTime < DEBOUNCE_TIME) {
      return
    }
  }

  try {
    // Update daily analytics
    await incrementDailyAnalytics(ownerId, 'clicks')

    trackedEvents.set(key, Date.now())
    console.log('✅ Call tracked:', listingId)
  } catch (error) {
    console.error('Error tracking call:', error)
  }
}

/**
 * Track email button click
 * @param {string} listingId - Listing ID
 * @param {string} ownerId - Owner user ID
 */
export async function trackEmail(listingId, ownerId) {
  const key = `email-${listingId}`
  
  if (trackedEvents.has(key)) {
    const lastTime = trackedEvents.get(key)
    if (Date.now() - lastTime < DEBOUNCE_TIME) {
      return
    }
  }

  try {
    await incrementDailyAnalytics(ownerId, 'clicks')
    trackedEvents.set(key, Date.now())
    console.log('✅ Email tracked:', listingId)
  } catch (error) {
    console.error('Error tracking email:', error)
  }
}

/**
 * Track lead (form submission, inquiry, etc.)
 * @param {string} listingId - Listing ID
 * @param {string} ownerId - Owner user ID
 */
export async function trackLead(listingId, ownerId) {
  try {
    await incrementDailyAnalytics(ownerId, 'leads')
    console.log('✅ Lead tracked:', listingId)
  } catch (error) {
    console.error('Error tracking lead:', error)
  }
}

/**
 * Increment daily analytics counter
 * Uses atomic increment to avoid race conditions
 */
async function incrementDailyAnalytics(userId, field) {
  const today = new Date().toISOString().split('T')[0]
  const analyticsRef = doc(db, 'analytics', userId, 'daily', today)

  try {
    // Check if document exists
    const analyticsDoc = await getDoc(analyticsRef)
    
    if (!analyticsDoc.exists()) {
      // Create new document with initial values
      await setDoc(analyticsRef, {
        date: today,
        views: field === 'views' ? 1 : 0,
        clicks: field === 'clicks' ? 1 : 0,
        leads: field === 'leads' ? 1 : 0,
        revenue: 0,
        topListings: [],
        createdAt: serverTimestamp()
      })
    } else {
      // Increment existing counter
      await updateDoc(analyticsRef, {
        [field]: increment(1),
        updatedAt: serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error updating analytics:', error)
    throw error
  }
}

/**
 * Clear debounce cache (for testing)
 */
export function clearTrackingCache() {
  trackedEvents.clear()
}