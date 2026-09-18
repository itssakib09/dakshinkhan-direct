// src/services/adminVerificationService.js
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { db } from '../firebase/config'

async function writeAuditLog(action, targetId, reason) {
  try {
    const auth = getAuth()
    const adminId = auth.currentUser?.uid || null
    const logEntry = {
      action,
      target: targetId,
      adminId,
      timestamp: serverTimestamp()
    }
    if (reason) {
      logEntry.reason = reason
    }
    await addDoc(collection(db, 'auditLogs'), logEntry)
  } catch {
  }
}

export async function getVerificationQueue({ pageSize = 20 }) {
  try {
    const usersRef = collection(db, 'users')

    const businessQuery = query(
      usersRef,
      where('role', '==', 'business'),
      where('storeSettings.verificationRequested', '==', true),
      where('storeSettings.verified', '==', false),
      orderBy('storeSettings.verificationRequestedAt', 'asc'),
      limit(pageSize)
    )

    const providerQuery = query(
      usersRef,
      where('role', '==', 'service'),
      where('serviceProfile.verificationRequested', '==', true),
      where('serviceProfile.verified', '==', false),
      orderBy('serviceProfile.verificationRequestedAt', 'asc'),
      limit(pageSize)
    )

    const [businessSnap, providerSnap] = await Promise.all([
      getDocs(businessQuery),
      getDocs(providerQuery)
    ])

    const businesses = businessSnap.docs.map(d => ({ id: d.id, type: 'business', ...d.data() }))
    const providers = providerSnap.docs.map(d => ({ id: d.id, type: 'provider', ...d.data() }))

    let items = [...businesses, ...providers].filter(item => {
      const rejected = item.type === 'business'
        ? item.storeSettings?.verificationRejected
        : item.serviceProfile?.verificationRejected
      return rejected !== true
    })

    items.sort((a, b) => {
      const aTimestamp = a.type === 'business'
        ? a.storeSettings?.verificationRequestedAt
        : a.serviceProfile?.verificationRequestedAt
      const bTimestamp = b.type === 'business'
        ? b.storeSettings?.verificationRequestedAt
        : b.serviceProfile?.verificationRequestedAt
      const aTime = aTimestamp?.toMillis ? aTimestamp.toMillis() : 0
      const bTime = bTimestamp?.toMillis ? bTimestamp.toMillis() : 0
      return aTime - bTime
    })

    return { items }
  } catch (error) {
    console.error('GET_VERIFICATION_QUEUE_ERROR:', error.code, error.message)
    return { items: [] }
  }
}

export async function approveVerification(userId, type) {
  try {
    if (type === 'business') {
      await updateDoc(doc(db, 'users', userId), {
        'storeSettings.verified': true,
        'storeSettings.verificationRequested': false
      })
      await writeAuditLog('business_verified', userId)
    } else {
      await updateDoc(doc(db, 'users', userId), {
        'serviceProfile.verified': true,
        'serviceProfile.verificationRequested': false
      })
      await writeAuditLog('provider_verified', userId)
    }
    return true
  } catch {
    return false
  }
}

export async function rejectVerification(userId, type, reason) {
  try {
    if (type === 'business') {
      await updateDoc(doc(db, 'users', userId), {
        'storeSettings.verificationRejected': true,
        'storeSettings.verificationRejectedReason': reason,
        'storeSettings.verificationRejectedAt': serverTimestamp(),
        'storeSettings.verificationRequested': false
      })
      await writeAuditLog('business_rejected', userId, reason)
    } else {
      await updateDoc(doc(db, 'users', userId), {
        'serviceProfile.verificationRejected': true,
        'serviceProfile.verificationRejectedReason': reason,
        'serviceProfile.verificationRejectedAt': serverTimestamp(),
        'serviceProfile.verificationRequested': false
      })
      await writeAuditLog('provider_rejected', userId, reason)
    }
    return true
  } catch {
    return false
  }
}