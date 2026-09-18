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
    return [where('isActive', '==', true)]
  } else if (statusFilter === 'inactive') {
    return [where('isActive', '==', false)]
  }
  return []
}

export async function getCustomers({ pageSize = 20, lastDoc = null, searchTerm = '', statusFilter = 'all' }) {
  try {
    const usersRef = collection(db, 'users')
    const trimmedSearch = searchTerm.trim()

    if (trimmedSearch) {
      const nameSearch = trimmedSearch.toLowerCase()
      const phoneSearch = trimmedSearch.replace(/^\+880/, '0')
      const extraConstraints = statusConstraints(statusFilter)

      const nameQuery = query(
        usersRef,
        where('role', '==', 'customer'),
        ...extraConstraints,
        orderBy('displayNameLower'),
        startAt(nameSearch),
        endAt(nameSearch + '\uf8ff'),
        limit(pageSize)
      )

      const phoneQuery = query(
        usersRef,
        where('role', '==', 'customer'),
        ...extraConstraints,
        orderBy('phoneSearch'),
        startAt(phoneSearch),
        endAt(phoneSearch + '\uf8ff'),
        limit(pageSize)
      )

      const [nameSnap, phoneSnap] = await Promise.all([getDocs(nameQuery), getDocs(phoneQuery)])

      const merged = new Map()
      nameSnap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data() }))
      phoneSnap.docs.forEach(d => merged.set(d.id, { id: d.id, ...d.data() }))

      const combined = Array.from(merged.values()).sort((a, b) => {
        const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
        const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
        return bTime - aTime
      })

      const customers = combined.slice(0, pageSize)

      const hasMore = nameSnap.docs.length === pageSize && phoneSnap.docs.length === pageSize

      return { customers, lastVisibleDoc: null, hasMore }
    }

    let constraints = [where('role', '==', 'customer')]

    if (statusFilter === 'active') {
      constraints.push(where('isActive', '==', true))
    } else if (statusFilter === 'inactive') {
      constraints.push(where('isActive', '==', false))
    }

    constraints.push(orderBy('createdAt', 'desc'))
    constraints.push(limit(pageSize))

    if (lastDoc) {
      constraints.push(startAfter(lastDoc))
    }

    const customersQuery = query(usersRef, ...constraints)
    const snap = await getDocs(customersQuery)

    const customers = snap.docs.map(d => ({ id: d.id, ...d.data() }))
    const lastVisibleDoc = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1] : null
    const hasMore = snap.docs.length === pageSize

    return { customers, lastVisibleDoc, hasMore }
  } catch (error) {
    console.error('GET_CUSTOMERS_ERROR:', error.code, error.message)
    return { customers: [], lastVisibleDoc: null, hasMore: false }
  }
}

export async function toggleCustomerActive(userId, currentStatus) {
  try {
    const newStatus = !currentStatus
    await updateDoc(doc(db, 'users', userId), { isActive: newStatus })
    await writeAuditLog(newStatus ? 'customer_activated' : 'customer_deactivated', userId)
    return newStatus
  } catch {
    return currentStatus
  }
}

export async function deleteCustomerPermanently(userId) {
  try {
    await deleteDoc(doc(db, 'users', userId))
    await writeAuditLog('customer_deleted', userId)
    return true
  } catch {
    return false
  }
}