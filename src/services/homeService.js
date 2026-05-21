// src/services/homeService.js
import { USE_API, API_URL } from '../config'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

const token = localStorage.getItem("token") || "";

export async function getFeaturedBusinesses() {
  if (!USE_API) {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'business'),
        where('onboardingComplete', '==', true),
        orderBy('createdAt', 'desc'),
        limit(20)
      )
      const snapshot = await getDocs(q)
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      const filtered = docs
        .filter((b) => b.storeSettings?.storeActive === true)
        .filter((b) => b.storeSettings?.storeName && b.storeSettings.storeName !== '')
      return filtered.slice(0, 6)
    } catch (err) {
      console.error("[homeService] getFeaturedBusinesses error:", err)
      return []
    }
  }

  try {
    const res = await fetch(`${API_URL}/home/featured-businesses`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("[homeService] getFeaturedBusinesses error:", err);
    return [];
  }
}

export async function getFeaturedServices() {
  if (!USE_API) {
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'service'),
        where('onboardingComplete', '==', true),
        orderBy('createdAt', 'desc'),
        limit(20)
      )
      const snapshot = await getDocs(q)
      const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      const filtered = docs.filter(
        (p) => p.serviceProfile && Array.isArray(p.serviceProfile.servicesOffered) && p.serviceProfile.servicesOffered.length > 0
      )
      return filtered.slice(0, 6)
    } catch (err) {
      console.error("[homeService] getFeaturedServices error:", err)
      return []
    }
  }

  try {
    const res = await fetch(`${API_URL}/home/featured-services`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (err) {
    console.error("[homeService] getFeaturedServices error:", err);
    return [];
  }
}