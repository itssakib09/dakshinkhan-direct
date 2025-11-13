import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

/**
 * Generate sample analytics data for testing
 * ONLY FOR DEVELOPMENT/TESTING
 */
export async function generateSampleAnalytics(userId, days = 30) {
  console.log(`🔧 Generating ${days} days of sample analytics for user ${userId}...`)

  try {
    const promises = []

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateString = date.toISOString().split('T')[0]

      // Generate random but realistic data
      const baseViews = 50 + Math.floor(Math.random() * 100)
      const views = baseViews + Math.floor(Math.random() * 50 * (1 + Math.sin(i / 7))) // Weekly pattern
      const clicks = Math.floor(views * (0.05 + Math.random() * 0.15)) // 5-20% CTR
      const leads = Math.floor(clicks * (0.1 + Math.random() * 0.2)) // 10-30% conversion
      const revenue = leads * (100 + Math.floor(Math.random() * 400)) // 100-500 per lead

      const analyticsData = {
        date: dateString,
        views,
        clicks,
        leads,
        revenue,
        topListings: ['listing_1', 'listing_2', 'listing_3'],
        createdAt: serverTimestamp()
      }

      const analyticsRef = doc(db, 'analytics', userId, 'daily', dateString)
      promises.push(setDoc(analyticsRef, analyticsData))
    }

    await Promise.all(promises)
    console.log(`✅ Generated ${days} days of analytics data`)
    return { success: true, days }
  } catch (error) {
    console.error('❌ Error generating analytics:', error)
    throw error
  }
}

/**
 * Clear analytics data (use with caution)
 */
export async function clearAnalytics(userId) {
  console.warn('⚠️ Clearing analytics data is not implemented for safety')
  // Implement only if needed - requires listing all docs first
}