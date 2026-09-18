// src/pages/admin/AdminServiceProviders.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiSearch,
  HiUserGroup,
  HiPhone,
  HiBriefcase,
  HiCheckCircle,
  HiXCircle,
  HiTrash,
  HiBadgeCheck,
  HiX,
  HiExclamationCircle,
  HiExternalLink
} from 'react-icons/hi'
import {
  getServiceProviders,
  toggleProviderActive,
  toggleProviderVerified,
  deleteProviderPermanently
} from '../../services/adminServiceProviderService'

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'verified', label: 'Verified' },
  { value: 'unverified', label: 'Unverified' }
]

function ToggleSwitch({ checked, onChange, activeColor }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
        checked ? activeColor : 'bg-gray-200 dark:bg-gray-600'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

function StatusBadge({ active }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
      active
        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
    }`}>
      {active ? <HiCheckCircle size={14} /> : <HiXCircle size={14} />}
      {active ? 'Active' : 'Inactive'}
    </span>
  )
}

function VerifiedBadge({ verified }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
      verified
        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
        : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
    }`}>
      <HiBadgeCheck size={14} />
      {verified ? 'Verified' : 'Unverified'}
    </span>
  )
}

function DeleteConfirmModal({ provider, onCancel, onConfirm, deleting }) {
  const [inputValue, setInputValue] = useState('')
  const providerName = provider.displayName || ''
  const matches = inputValue.trim() === providerName.trim() && providerName.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl w-full max-w-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <HiExclamationCircle size={22} className="text-red-500 flex-shrink-0" />
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              Delete Provider
            </h3>
          </div>
          <button onClick={onCancel}>
            <HiX size={20} className="text-gray-400 dark:text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          This permanently deletes the account for
          <span className="font-bold text-gray-700 dark:text-gray-300"> {providerName} </span>
          and cannot be undone. Type the provider name below to confirm.
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={providerName}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={!matches || deleting}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 animate-pulse">
      <div className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

function AdminServiceProviders() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [lastVisibleDoc, setLastVisibleDoc] = useState(null)
  const [hasMore, setHasMore] = useState(false)

  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const debounceRef = useRef(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setSearchTerm(searchInput)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [searchInput])

  useEffect(() => {
    loadProviders()
  }, [searchTerm, statusFilter])

  async function loadProviders() {
    setLoading(true)
    const result = await getServiceProviders({ pageSize: 20, lastDoc: null, searchTerm, statusFilter })
    setProviders(result.providers)
    setLastVisibleDoc(result.lastVisibleDoc)
    setHasMore(result.hasMore)
    setLoading(false)
  }

  async function loadMore() {
    setLoadingMore(true)
    const result = await getServiceProviders({ pageSize: 20, lastDoc: lastVisibleDoc, searchTerm, statusFilter })
    setProviders(prev => [...prev, ...result.providers])
    setLastVisibleDoc(result.lastVisibleDoc)
    setHasMore(result.hasMore)
    setLoadingMore(false)
  }

  async function handleToggleActive(provider) {
    const currentStatus = provider.isActive || false
    const newStatus = await toggleProviderActive(provider.id, currentStatus)
    setProviders(prev =>
      prev.map(p => (p.id === provider.id ? { ...p, isActive: newStatus } : p))
    )
  }

  async function handleToggleVerified(provider) {
    const currentStatus = provider.serviceProfile?.verified || false
    const newStatus = await toggleProviderVerified(provider.id, currentStatus)
    setProviders(prev =>
      prev.map(p =>
        p.id === provider.id
          ? { ...p, serviceProfile: { ...p.serviceProfile, verified: newStatus } }
          : p
      )
    )
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    setDeleting(true)
    const success = await deleteProviderPermanently(deleteTarget.id)
    if (success) {
      setProviders(prev => prev.filter(p => p.id !== deleteTarget.id))
    }
    setDeleting(false)
    setDeleteTarget(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Service Providers
      </h1>

      <div className="flex flex-col md:flex-row gap-3 mb-2">
        <div className="flex-1">
          <div className="relative">
            <HiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or profession"
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
            Search matches from the start of the provider's name, profession, or phone number
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-start">
          {FILTERS.map(f => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6" />

      {loading ? (
        <div className="space-y-3">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : providers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-10 text-center">
          <HiUserGroup size={40} className="text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            No service providers match your filters
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-left">
                  <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400">Profession</th>
                  <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400">Phone</th>
                  <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400">Verified</th>
                  <th className="px-4 py-3 font-bold text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {providers.map(provider => {
                    const name = provider.displayName || 'Unnamed Provider'
                    const profession = provider.serviceProfile?.profession || '-'
                    const phone = provider.phone || provider.serviceProfile?.phone || '-'
                    const isActive = provider.isActive || false
                    const isVerified = provider.serviceProfile?.verified || false
                    return (
                      <motion.tr
                        key={provider.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-gray-50 dark:border-gray-700/50 last:border-b-0"
                      >
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{name}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{profession}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{phone}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ToggleSwitch checked={isActive} onChange={() => handleToggleActive(provider)} activeColor="bg-green-500" />
                            <StatusBadge active={isActive} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <ToggleSwitch checked={isVerified} onChange={() => handleToggleVerified(provider)} activeColor="bg-primary-600" />
                            <VerifiedBadge verified={isVerified} />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <a
                              href={`/service-provider/${provider.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-xs"
                            >
                              <HiExternalLink size={14} />
                              View Profile
                            </a>
                            <button
                              onClick={() => setDeleteTarget(provider)}
                              className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-semibold text-xs"
                            >
                              <HiTrash size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            <AnimatePresence>
              {providers.map(provider => {
                const name = provider.displayName || 'Unnamed Provider'
                const profession = provider.serviceProfile?.profession || '-'
                const phone = provider.phone || provider.serviceProfile?.phone || '-'
                const isActive = provider.isActive || false
                const isVerified = provider.serviceProfile?.verified || false
                return (
                  <motion.div
                    key={provider.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-gray-900 dark:text-white">{name}</span>
                      <div className="flex items-center gap-3">
                        <a
                          href={`/service-provider/${provider.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 dark:text-primary-400"
                        >
                          <HiExternalLink size={18} />
                        </a>
                        <button
                          onClick={() => setDeleteTarget(provider)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <HiTrash size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <HiBriefcase size={13} />
                      {profession}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <HiPhone size={13} />
                      {phone}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ToggleSwitch checked={isActive} onChange={() => handleToggleActive(provider)} activeColor="bg-green-500" />
                        <StatusBadge active={isActive} />
                      </div>
                      <div className="flex items-center gap-2">
                        <ToggleSwitch checked={isVerified} onChange={() => handleToggleVerified(provider)} activeColor="bg-primary-600" />
                        <VerifiedBadge verified={isVerified} />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:border-primary-300 dark:hover:border-primary-700 disabled:opacity-50"
              >
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          provider={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}
    </div>
  )
}

export default AdminServiceProviders