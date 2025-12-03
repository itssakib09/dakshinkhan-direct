import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase/config'

const USE_API = import.meta.env.VITE_USE_API === 'true'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Get analytics data for a date range
 * @param {string} userId - User ID
 * @param {number} days - Number of days (7, 30, or 90)
 * @returns {Promise<Object>} Aggregated analytics data
 */
export async function getAnalytics(userId, days = 7) {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/analytics/${userId}?days=${days}`, {
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
    const startDate = getDateString(new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000))
    const endDate = getDateString(new Date())

    const analyticsRef = collection(db, 'analytics', userId, 'daily')
    const q = query(
      analyticsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc'),
      limit(days)
    )

    const snapshot = await getDocs(q)
    const dailyData = snapshot.docs.map(doc => ({
      date: doc.id,
      ...doc.data()
    }))

    return aggregateAnalytics(dailyData, days)
  } catch (error) {
    console.error('Error fetching analytics:', error)
    throw error
  }
}

/**
 * Get analytics for last 7 days
 */
export async function getLast7Days(userId) {
  return getAnalytics(userId, 7)
}

/**
 * Get analytics for last 30 days
 */
export async function getLast30Days(userId) {
  return getAnalytics(userId, 30)
}

/**
 * Get analytics for last 90 days
 */
export async function getLast90Days(userId) {
  return getAnalytics(userId, 90)
}

/**
 * Aggregate daily analytics into summary
 */
function aggregateAnalytics(dailyData, totalDays) {
  if (dailyData.length === 0) {
    return {
      totalViews: 0,
      totalClicks: 0,
      totalLeads: 0,
      totalRevenue: 0,
      avgViewsPerDay: 0,
      avgClicksPerDay: 0,
      avgLeadsPerDay: 0,
      avgRevenuePerDay: 0,
      dailyData: [],
      period: totalDays,
      startDate: null,
      endDate: null
    }
  }

  const totals = dailyData.reduce((acc, day) => ({
    views: acc.views + (day.views || 0),
    clicks: acc.clicks + (day.clicks || 0),
    leads: acc.leads + (day.leads || 0),
    revenue: acc.revenue + (day.revenue || 0)
  }), { views: 0, clicks: 0, leads: 0, revenue: 0 })

  const actualDays = dailyData.length

  return {
    totalViews: totals.views,
    totalClicks: totals.clicks,
    totalLeads: totals.leads,
    totalRevenue: totals.revenue,
    avgViewsPerDay: Math.round(totals.views / actualDays),
    avgClicksPerDay: Math.round(totals.clicks / actualDays),
    avgLeadsPerDay: Math.round(totals.leads / actualDays),
    avgRevenuePerDay: Math.round(totals.revenue / actualDays),
    clickThroughRate: totals.views > 0 ? ((totals.clicks / totals.views) * 100).toFixed(2) : 0,
    conversionRate: totals.clicks > 0 ? ((totals.leads / totals.clicks) * 100).toFixed(2) : 0,
    dailyData: dailyData.map(d => ({
      date: d.date,
      views: d.views || 0,
      clicks: d.clicks || 0,
      leads: d.leads || 0,
      revenue: d.revenue || 0
    })),
    period: totalDays,
    startDate: dailyData[0]?.date || null,
    endDate: dailyData[dailyData.length - 1]?.date || null
  }
}

/**
 * Get date string in YYYY-MM-DD format
 */
function getDateString(date) {
  return date.toISOString().split('T')[0]
}

/**
 * Get chart data formatted for Recharts
 */
export function getChartData(analyticsData) {
  if (!analyticsData.dailyData || analyticsData.dailyData.length === 0) {
    return []
  }

  return analyticsData.dailyData.map(day => ({
    date: formatDateShort(day.date),
    Views: day.views,
    Clicks: day.clicks,
    Leads: day.leads
  }))
}

/**
 * Format date for display (e.g., "Jan 15")
 */
function formatDateShort(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Get top performing listings
 */
export async function getTopListings(userId, limitCount = 5) {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/analytics/${userId}/top-listings?limit=${limitCount}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      return []
    }
  }

  try {
    const analyticsRef = collection(db, 'analytics', userId, 'daily')
    const last7Days = getDateString(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000))
    
    const q = query(
      analyticsRef,
      where('date', '>=', last7Days),
      orderBy('date', 'desc')
    )

    const snapshot = await getDocs(q)
    const listingStats = new Map()

    snapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.topListings && Array.isArray(data.topListings)) {
        data.topListings.forEach(listingId => {
          const current = listingStats.get(listingId) || 0
          listingStats.set(listingId, current + 1)
        })
      }
    })

    return Array.from(listingStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limitCount)
      .map(([listingId, count]) => ({ listingId, views: count }))
  } catch (error) {
    console.error('Error fetching top listings:', error)
    return []
  }
}