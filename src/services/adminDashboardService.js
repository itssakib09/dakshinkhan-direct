// src/services/adminDashboardService.js
import { collection, query, where, getCountFromServer, doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

export async function getDashboardStats() {
  const zeroed = {
    totalBusinesses: 0,
    totalProviders: 0,
    totalCustomers: 0,
    todaySignups: 0,
    pendingVerifications: 0,
    activeSponsoredAds: 0
  }

  try {
    const usersRef = collection(db, 'users')

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const startOfDayTimestamp = Timestamp.fromDate(startOfDay)

    const businessQuery = query(usersRef, where('role', '==', 'business'))
    const providerQuery = query(usersRef, where('role', '==', 'service'))
    const customerQuery = query(usersRef, where('role', '==', 'customer'))
    const todaySignupsQuery = query(usersRef, where('createdAt', '>=', startOfDayTimestamp))
    const pendingBusinessQuery = query(
      usersRef,
      where('role', '==', 'business'),
      where('storeSettings.verified', '==', false)
    )
    const pendingProviderQuery = query(
      usersRef,
      where('role', '==', 'service'),
      where('serviceProfile.verified', '==', false)
    )

    async function getBusinessCount() {
      try {
        const snap = await getCountFromServer(businessQuery)
        return snap.data().count
      } catch {
        return 0
      }
    }

    async function getProviderCount() {
      try {
        const snap = await getCountFromServer(providerQuery)
        return snap.data().count
      } catch {
        return 0
      }
    }

    async function getCustomerCount() {
      try {
        const snap = await getCountFromServer(customerQuery)
        return snap.data().count
      } catch {
        return 0
      }
    }

    async function getTodaySignupsCount() {
      try {
        const snap = await getCountFromServer(todaySignupsQuery)
        return snap.data().count
      } catch {
        return 0
      }
    }

    async function getPendingVerificationsCount() {
      try {
        const [pendingBusinessSnap, pendingProviderSnap] = await Promise.all([
          getCountFromServer(pendingBusinessQuery),
          getCountFromServer(pendingProviderQuery)
        ])
        return pendingBusinessSnap.data().count + pendingProviderSnap.data().count
      } catch {
        return 0
      }
    }

    async function getActiveSponsoredAds() {
      try {
        const sponsoredAdSnap = await getDoc(doc(db, 'settings', 'sponsoredAd'))
        const isActive = sponsoredAdSnap.exists() && sponsoredAdSnap.data().isActive === true
        return isActive ? 1 : 0
      } catch {
        return 0
      }
    }

    const [
      totalBusinesses,
      totalProviders,
      totalCustomers,
      todaySignups,
      pendingVerifications,
      activeSponsoredAds
    ] = await Promise.all([
      getBusinessCount(),
      getProviderCount(),
      getCustomerCount(),
      getTodaySignupsCount(),
      getPendingVerificationsCount(),
      getActiveSponsoredAds()
    ])

    return {
      totalBusinesses,
      totalProviders,
      totalCustomers,
      todaySignups,
      pendingVerifications,
      activeSponsoredAds
    }
  } catch {
    return zeroed
  }
}