// src/services/adminServiceProviderService.js
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
    console.error('AUDIT_LOG_ERROR:', error.message)
  }
}

function statusConstraints(statusFilter) {
  if (statusFilter === 'active') {
    return [where('isActive', '==', true)]
  } else if (statusFilter === 'inactive') {
    return [where('isActive', '==', false)]
  } else if (statusFilter === 'verified') {
    return [where('serviceProfile.verified', '==', true)]
  } else if (statusFilter === 'unverified') {
    return [where('serviceProfile.verified', '==', false)]
  }
  return []
}

export async function getServiceProviders({ pageSize = 20, lastDoc = null, searchTerm = '', statusFilter = 'all' }) {
  try {
    const usersRef = collection(db, 'users')
    const trimmedSearch = searchTerm.trim().toLowerCase()

    if (trimmedSearch) {
      const strippedPhone = trimmedSearch.replace(/^\+880/, '0')
      const extraConstraints = statusConstraints(statusFilter)

      const nameQuery = query(
        usersRef,
        where('role', '==', 'service'),
        ...extraConstraints,
        orderBy('displayNameLower'),
        startAt(trimmedSearch),
        endAt(trimmedSearch + '\uf8ff'),
        limit(pageSize)
      )

      const professionQuery = query(
        usersRef,
        where('role', '==', 'service'),
        ...extraConstraints,
        orderBy('serviceProfile.professionLower'),
        startAt(trimmedSearch),
        endAt(trimmedSearch + '\uf8ff'),
        limit(pageSize)
      )

      const phoneQuery = query(
        usersRef,
        where('role', '==', 'service'),
        ...extraConstraints,
        orderBy('phoneSearch'),
        startAt(strippedPhone),
        endAt(strippedPhone + '\uf8ff'),
        limit(pageSize)
      )

      const [nameSnap, professionSnap, phoneSnap] = await Promise.all([
        getDocs(nameQuery),
        getDocs(professionQuery),
        getDocs(phoneQuery)
      ])

      const merged = new Map()
      nameSnap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data() }))
      professionSnap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data() }))
      phoneSnap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data() }))

      let providers = Array.from(merged.values())
      providers.sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
        return bTime - aTime
      })
      providers = providers.slice(0, pageSize)

      const hasMore = nameSnap.docs.length === pageSize && professionSnap.docs.length === pageSize && phoneSnap.docs.length === pageSize

      return { providers, lastVisibleDoc: null, hasMore }
    }

    const constraints = [where('role', '==', 'service')]

    if (statusFilter === 'active') {
      constraints.push(where('isActive', '==', true))
    } else if (statusFilter === 'inactive') {
      constraints.push(where('isActive', '==', false))
    } else if (statusFilter === 'verified') {
      constraints.push(where('serviceProfile.verified', '==', true))
    } else if (statusFilter === 'unverified') {
      constraints.push(where('serviceProfile.verified', '==', false))
    }

    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(pageSize))

    if (lastDoc) {
      constraints.push(startAfter(lastDoc))
    }

    const providersQuery = query(usersRef, ...constraints)
    const snap = await getDocs(providersQuery)

    const providers = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    const lastVisibleDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
    const hasMore = snap.docs.length === pageSize

    return { providers, lastVisibleDoc, hasMore }
  } catch (error) {
    console.error('GET_PROVIDERS_ERROR:', error.code, error.message)
    return { providers: [], lastVisibleDoc: null, hasMore: false }
  }
}

export async function toggleProviderActive(userId, currentStatus) {
  try {
    const newStatus = !currentStatus
    await updateDoc(doc(db, 'users', userId), { isActive: newStatus })
    await writeAuditLog(newStatus ? 'provider_activated' : 'provider_deactivated', userId)
    return newStatus
  } catch {
    return currentStatus
  }
}

export async function toggleProviderVerified(userId, currentStatus) {
  try {
    const newStatus = !currentStatus
    const updates = { 'serviceProfile.verified': newStatus }
    if (newStatus) {
      updates['serviceProfile.verificationRejected'] = false
      updates['serviceProfile.verificationRequested'] = false
    }
    await updateDoc(doc(db, 'users', userId), updates)
    await writeAuditLog(newStatus ? 'provider_verified' : 'provider_unverified', userId)
    return newStatus
  } catch {
    return currentStatus
  }
}

export async function deleteProviderPermanently(userId) {
  try {
    await deleteDoc(doc(db, 'users', userId))
    await writeAuditLog('provider_deleted', userId)
    return true
  } catch {
    return false
  }
}