// src/services/adminBusinessService.js
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  startAt,
  endAt,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase/config'

async function writeAuditLog(action, targetId) {
  try {
    const auth = getAuth()
    const adminId = auth.currentUser?.uid || null
    await addDoc(collection(db, 'auditLogs'), {
      action,
      target: targetId,
      adminId,
      timestamp: serverTimestamp()
    })
  } catch (error) {
    console.error('Failed to write audit log:', error)
  }
}

function statusConstraints(statusFilter) {
  if (statusFilter === 'active') {
    return [where('storeSettings.storeActive', '==', true)]
  } else if (statusFilter === 'inactive') {
    return [where('storeSettings.storeActive', '==', false)]
  } else if (statusFilter === 'verified') {
    return [where('storeSettings.verified', '==', true)]
  } else if (statusFilter === 'unverified') {
    return [where('storeSettings.verified', '==', false)]
  }
  return []
}

export async function getBusinesses({ pageSize = 20, lastDoc = null, searchTerm = '', statusFilter = 'all' }) {
  try {
    const usersRef = collection(db, 'users')
    const trimmedSearch = searchTerm.trim().toLowerCase()

    if (trimmedSearch) {
      const strippedPhone = trimmedSearch.replace(/^\+880/, '0')
      const extraConstraints = statusConstraints(statusFilter)

      const nameQuery = query(
        usersRef,
        where('role', '==', 'business'),
        ...extraConstraints,
        orderBy('storeSettings.storeNameLower'),
        startAt(trimmedSearch),
        endAt(trimmedSearch + '\uf8ff'),
        limit(pageSize)
      )

      const phoneQuery = query(
        usersRef,
        where('role', '==', 'business'),
        ...extraConstraints,
        orderBy('phoneSearch'),
        startAt(strippedPhone),
        endAt(strippedPhone + '\uf8ff'),
        limit(pageSize)
      )

      const [nameSnap, phoneSnap] = await Promise.all([
        getDocs(nameQuery),
        getDocs(phoneQuery)
      ])

      const merged = new Map()
      nameSnap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data() }))
      phoneSnap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data() }))

      let businesses = Array.from(merged.values())
      businesses = businesses.slice(0, pageSize)

      const hasMore = nameSnap.docs.length === pageSize && phoneSnap.docs.length === pageSize

      return { businesses, lastVisibleDoc: null, hasMore }
    }

    const constraints = [where('role', '==', 'business')]

    if (statusFilter === 'active') {
      constraints.push(where('storeSettings.storeActive', '==', true))
    } else if (statusFilter === 'inactive') {
      constraints.push(where('storeSettings.storeActive', '==', false))
    } else if (statusFilter === 'verified') {
      constraints.push(where('storeSettings.verified', '==', true))
    } else if (statusFilter === 'unverified') {
      constraints.push(where('storeSettings.verified', '==', false))
    }

    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(pageSize))

    if (lastDoc) {
      constraints.push(startAfter(lastDoc))
    }

    const businessesQuery = query(usersRef, ...constraints)
    const snap = await getDocs(businessesQuery)

    const businesses = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    const lastVisibleDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
    const hasMore = snap.docs.length === pageSize

    return { businesses, lastVisibleDoc, hasMore }
  } catch (error) {
    console.error('GET_BUSINESSES_ERROR:', error.code, error.message)
    return { businesses: [], lastVisibleDoc: null, hasMore: false }
  }
}

export async function toggleBusinessActive(userId, currentStatus) {
  try {
    const newStatus = !currentStatus
    await updateDoc(doc(db, 'users', userId), { 'storeSettings.storeActive': newStatus })
    await writeAuditLog(newStatus ? 'business_activated' : 'business_deactivated', userId)
    return newStatus
  } catch {
    return currentStatus
  }
}

export async function toggleBusinessVerified(userId, currentStatus) {
  try {
    const newStatus = !currentStatus
    const updates = { 'storeSettings.verified': newStatus }
    if (newStatus) {
      updates['storeSettings.verificationRejected'] = false
      updates['storeSettings.verificationRequested'] = false
    }
    await updateDoc(doc(db, 'users', userId), updates)
    await writeAuditLog(newStatus ? 'business_verified' : 'business_unverified', userId)
    return newStatus
  } catch {
    return currentStatus
  }
}

export async function deleteBusinessPermanently(userId) {
  try {
    await deleteDoc(doc(db, 'users', userId))
    await writeAuditLog('business_deleted', userId)
    return true
  } catch {
    return false
  }
}