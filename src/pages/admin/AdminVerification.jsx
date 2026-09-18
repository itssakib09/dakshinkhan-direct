// src/pages/admin/AdminVerification.jsx
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiBadgeCheck,
  HiOfficeBuilding,
  HiUserGroup,
  HiPhone,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiX,
  HiExclamationCircle,
  HiTag,
  HiExternalLink
} from 'react-icons/hi'
import {
  getVerificationQueue,
  approveVerification,
  rejectVerification
} from '../../services/adminVerificationService'

function formatRelativeTime(timestamp) {
  const date = timestamp?.toDate ? timestamp.toDate() : null
  if (!date) return 'Unknown time'

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  const years = Math.floor(months / 12)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

function TypeBadge({ type }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
      type === 'business'
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
        : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
    }`}>
      {type === 'business' ? <HiOfficeBuilding size={14} /> : <HiUserGroup size={14} />}
      {type === 'business' ? 'Business' : 'Service Provider'}
    </span>
  )
}

function RejectModal({ item, onCancel, onConfirm, rejecting }) {
  const [reason, setReason] = useState('')
  const canReject = reason.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiExclamationCircle size={22} className="text-red-500 flex-shrink-0" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Reject Verification
            </h3>
          </div>
          <button onClick={onCancel}>
            <HiX size={20} className="text-gray-400 dark:text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Explain why this verification request is being declined. This reason will be shown to the applicant.
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Reason for rejection"
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 mb-4 resize-none"
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason.trim())}
            disabled={!canReject || rejecting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
          >
            {rejecting ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 animate-pulse">
      <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

function AdminVerification() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejecting, setRejecting] = useState(false)

  useEffect(() => {
    loadQueue()
  }, [])

  async function loadQueue() {
    setLoading(true)
    const result = await getVerificationQueue({ pageSize: 20 })
    setItems(result.items)
    setLoading(false)
  }

  async function handleApprove(item) {
    setApprovingId(item.id)
    const success = await approveVerification(item.id, item.type)
    if (success) {
      setItems(prev => prev.filter(i => i.id !== item.id))
    }
    setApprovingId(null)
  }

  async function handleRejectConfirm(reason) {
    if (!rejectTarget) return
    setRejecting(true)
    const success = await rejectVerification(rejectTarget.id, rejectTarget.type, reason)
    if (success) {
      setItems(prev => prev.filter(i => i.id !== rejectTarget.id))
    }
    setRejecting(false)
    setRejectTarget(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Verification Center
      </h1>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center">
          <HiBadgeCheck size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            No pending verification requests
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {items.map(item => {
              const isBusiness = item.type === 'business'
              const name = isBusiness
                ? item.storeSettings?.storeName || 'Unnamed Store'
                : item.displayName || 'Unnamed Provider'
              const category = isBusiness
                ? item.storeSettings?.businessType || '-'
                : item.serviceProfile?.profession || '-'
              const phone = isBusiness
                ? item.storeSettings?.phone || item.phone || '-'
                : item.phone || item.serviceProfile?.phone || '-'
              const requestedAt = isBusiness
                ? item.storeSettings?.verificationRequestedAt
                : item.serviceProfile?.verificationRequestedAt
              const viewHref = isBusiness ? `/store/${item.id}` : `/service-provider/${item.id}`

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-black text-gray-900 dark:text-white">{name}</span>
                        <TypeBadge type={item.type} />
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <HiTag size={13} />
                          {category}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiPhone size={13} />
                          {phone}
                        </span>
                        <span className="flex items-center gap-1">
                          <HiClock size={13} />
                          {formatRelativeTime(requestedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={viewHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                      >
                        <HiExternalLink size={16} />
                        {isBusiness ? 'View Store' : 'View Profile'}
                      </a>
                      <button
                        onClick={() => handleApprove(item)}
                        disabled={approvingId === item.id}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                      >
                        <HiCheckCircle size={16} />
                        {approvingId === item.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button
                        onClick={() => setRejectTarget(item)}
                        className="flex items-center gap-1 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 px-4 py-2 rounded-xl text-sm font-bold transition-colors"
                      >
                        <HiXCircle size={16} />
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {rejectTarget && (
        <RejectModal
          item={rejectTarget}
          onCancel={() => setRejectTarget(null)}
          onConfirm={handleRejectConfirm}
          rejecting={rejecting}
        />
      )}
    </div>
  )
}

export default AdminVerification