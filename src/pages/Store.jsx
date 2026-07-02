// src/pages/Store.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import {
  HiArrowLeft,
  HiPhone,
  HiLocationMarker,
  HiClock,
  HiShoppingBag,
  HiCheckCircle,
  HiXCircle,
  HiHeart,
  HiCalendar,
  HiShare,
  HiChevronDown,
  HiChevronUp
} from 'react-icons/hi'
import { getBusinessById, isBusinessOpen } from '../services/businessService'
import { getStoreListings } from '../services/listingService'
import { WEEK_DAYS, DAY_LABELS } from '../data/storeHours'

function toBn(str) {
  const map = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}
  return String(str).split('').map(c => map[c] || c).join('')
}

function formatHour(timeStr, lang) {
  if (!timeStr) return ''
  const [hStr, mm] = timeStr.split(':')
  const h = parseInt(hStr)
  const isBn = lang?.startsWith('bn')
  if (!isBn) {
    if (h === 0) return `12:${mm} AM`
    if (h < 12) return `${h}:${mm} AM`
    if (h === 12) return `12:${mm} PM`
    return `${h - 12}:${mm} PM`
  }
  if (h < 6) return `রাত ${toBn(h)}:${toBn(mm)}`
  if (h < 12) return `সকাল ${toBn(h)}:${toBn(mm)}`
  if (h === 12) return `দুপুর ১২:${toBn(mm)}`
  if (h < 17) return `বিকাল ${toBn(h - 12)}:${toBn(mm)}`
  if (h < 20) return `সন্ধ্যা ${toBn(h - 12)}:${toBn(mm)}`
  return `রাত ${toBn(h - 12)}:${toBn(mm)}`
}

function groupHours(openingHours, todayKey) {
  if (!openingHours) return []
  const groups = []
  let i = 0
  while (i < WEEK_DAYS.length) {
    const day = WEEK_DAYS[i]
    const info = openingHours[day] || { closed: true }
    let j = i + 1
    while (j < WEEK_DAYS.length) {
      const next = openingHours[WEEK_DAYS[j]] || { closed: true }
      const same = info.closed === next.closed && info.open === next.open && info.close === next.close
      if (!same) break
      j++
    }
    groups.push({
      days: WEEK_DAYS.slice(i, j),
      open: info.open,
      close: info.close,
      isClosed: !!info.closed
    })
    i = j
  }
  return groups
}

function Store() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { currentUser } = useAuth()

  const [business, setBusiness] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [isFavorited, setIsFavorited] = useState(false)
  const [showAllAreas, setShowAllAreas] = useState(false)
  const [selectedTab, setSelectedTab] = useState('all')

  const jsToWeekDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
  const todayKey = jsToWeekDay[new Date().getDay()]

  useEffect(() => {
    loadStoreData()
  }, [id])

  const loadStoreData = async () => {
    try {
      setLoading(true)
      const businessData = await getBusinessById(id)
      if (!businessData) {
        setError('not_found')
        return
      }
      setBusiness(businessData)
      const listingsData = await getStoreListings(id)
      setListings(listingsData)
      const uniqueCats = [...new Set(listingsData.map(l => l.category).filter(Boolean))]
      setCategories(uniqueCats)
    } catch (err) {
      console.error('Error loading store:', err)
      setError('failed')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
        <div className="max-w-2xl mx-auto animate-pulse">
          <div className="flex justify-between px-4 pt-4 mb-3">
            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-xl" />
            <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          </div>
          <div className="h-52 bg-gray-200 dark:bg-gray-700 w-full" />
          <div className="mx-4 -mt-6 h-44 bg-gray-100 dark:bg-gray-800 rounded-2xl" />
          <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 dark:bg-gray-800 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <HiXCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">
            {t('store.not_found_title')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t('store.not_found_sub')}
          </p>
          <button
            onClick={() => navigate('/business')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            {t('store.browse_businesses')}
          </button>
        </div>
      </div>
    )
  }

  const storeSettings = business.storeSettings || {}
  const isOpen = isBusinessOpen(storeSettings.openingHours)
  const isOwner = currentUser?.uid === business?.id
  const productCount = listings.length
  const serviceAreas = storeSettings.serviceAreas || []

  const filteredListings = selectedTab === 'all'
    ? listings
    : listings.filter(l => l.category === selectedTab)

  let joinedYear = ''
  try {
    const raw = business.createdAt
    if (raw?.toDate) joinedYear = raw.toDate().getFullYear()
    else if (raw) joinedYear = new Date(raw).getFullYear()
  } catch {}

  const lang = i18n.language?.startsWith('bn') ? 'bn' : 'en'

  const formatCloseTime = () => {
    const hours = storeSettings.openingHours?.[todayKey]
    if (!hours || hours.closed) return ''
    return formatHour(hours.close, lang)
  }

  const closeTime = formatCloseTime()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: storeSettings.storeName || '', url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center px-4 pt-4 pb-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center"
          >
            <HiArrowLeft size={18} className="text-gray-700 dark:text-gray-300" />
          </motion.button>
        </div>

        <div className="relative w-full h-52 overflow-hidden">
          {storeSettings.photoURL ? (
            <>
              <img
                src={storeSettings.photoURL}
                alt={storeSettings.storeName}
                className="w-full h-full object-cover"
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div
                style={{ display: 'none' }}
                className="w-full h-52 absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800 items-center justify-center overflow-hidden"
              >
                <span className="absolute text-9xl font-black text-white/10 select-none">
                  {storeSettings.storeName?.[0]?.toUpperCase() || 'S'}
                </span>
                <div className="relative z-10 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                  <HiShoppingBag size={28} className="text-white/60" />
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-52 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center relative overflow-hidden">
              <span className="absolute text-9xl font-black text-white/10 select-none">
                {storeSettings.storeName?.[0]?.toUpperCase() || 'S'}
              </span>
              <div className="relative z-10 w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <HiShoppingBag size={28} className="text-white/60" />
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl px-3 py-2 shadow-md flex flex-col gap-0.5">
              {isOpen ? (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-black text-green-600 dark:text-green-400">
                      {t('store.open_now')}
                    </span>
                  </div>
                  {closeTime && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {lang === 'bn'
                        ? `${closeTime} ${t('store.open_until')}`
                        : `${t('store.open_until')} ${closeTime}`}
                    </span>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-xs font-black text-red-600 dark:text-red-400">
                    {t('store.closed')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            aria-label="Add to favourites"
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-md flex items-center justify-center border border-white/50 dark:border-gray-700"
          >
            <HiHeart size={18} className={isFavorited ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mx-4 -mt-6 relative z-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md p-4 mb-0"
        >
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 flex-shrink-0 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
              {storeSettings.logoURL ? (
                <>
                  <img
                    src={storeSettings.logoURL}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                    <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                      {storeSettings.storeName?.[0]?.toUpperCase() || 'S'}
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-xl font-black text-primary-600 dark:text-primary-400">
                  {storeSettings.storeName?.[0]?.toUpperCase() || 'S'}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                  {storeSettings.storeName || business.displayName || 'Store'}
                </h1>
                {storeSettings.verified && (
                  <HiCheckCircle size={16} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                )}
              </div>

              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                {storeSettings.businessType}
              </p>

              <div className="flex items-center gap-3 flex-wrap mt-2">
                {productCount > 0 && (
                  <div className="flex items-center gap-1">
                    <HiShoppingBag size={13} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                      {productCount}+ {t('store.products')}
                    </span>
                  </div>
                )}
                {serviceAreas[0] && (
                  <div className="flex items-center gap-1">
                    <HiLocationMarker size={13} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {serviceAreas[0]}
                    </span>
                  </div>
                )}
              </div>

              {storeSettings.storePhone && (
                <div className="flex items-center gap-1 mt-1">
                  <HiPhone size={13} className="text-gray-400 dark:text-gray-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {storeSettings.storePhone}
                  </span>
                </div>
              )}
            </div>
          </div>

          {storeSettings.storePhone && (
            <div className="mt-4 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => { window.location.href = `tel:${storeSettings.storePhone}` }}
                className={`${storeSettings.whatsappNumber ? 'flex-1' : 'w-full'} bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-xl py-3 font-bold text-sm shadow-sm flex items-center justify-center gap-2 transition-colors`}
              >
                <HiPhone size={18} />
                {t('store.call_store')}
              </motion.button>
              {storeSettings.whatsappNumber && (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => window.open('https://wa.me/' + storeSettings.whatsappNumber.replace(/[^0-9]/g, ''), '_blank')}
                  className="flex-1 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <HiPhone size={18} />
                  {t('store.whatsapp')}
                </motion.button>
              )}
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 grid grid-cols-3 gap-2">
            <button
              onClick={storeSettings.mapLink ? () => window.open(storeSettings.mapLink, '_blank') : undefined}
              className={`bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex flex-col items-center text-center gap-1 ${storeSettings.mapLink ? 'cursor-pointer' : ''}`}
            >
              <div className="w-9 h-9 rounded-full mb-0.5 bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <HiLocationMarker size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-xs font-black text-gray-800 dark:text-gray-200">
                {t('store.address')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">
                {serviceAreas[0] || '-'}
              </span>
              {storeSettings.mapLink && (
                <span className="text-xs font-bold mt-1 text-primary-600 dark:text-primary-400">
                  {t('store.map_view')}
                </span>
              )}
            </button>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex flex-col items-center text-center gap-1">
              <div className="w-9 h-9 rounded-full mb-0.5 bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <HiCalendar size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-xs font-black text-gray-800 dark:text-gray-200">
                {t('store.joined')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {joinedYear || '-'}
              </span>
            </div>

            <button
              onClick={handleShare}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex flex-col items-center text-center gap-1 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full mb-0.5 bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <HiShare size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-xs font-black text-gray-800 dark:text-gray-200">
                {t('store.share_store')}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {t('store.share_sub')}
              </span>
            </button>
          </div>
        </motion.div>

        {categories.length > 0 && (
          <div className="sticky top-0 z-20 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 mt-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 transition-all border ${
                  selectedTab === 'all'
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                }`}
              >
                {t('store.all_products')}
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedTab(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex-shrink-0 transition-all border capitalize ${
                    selectedTab === cat
                      ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
          <div className="mb-3">
            <span className="text-base font-black text-gray-900 dark:text-white">
              {t('store.all_products_label')} ({filteredListings.length})
            </span>
          </div>

          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden cursor-pointer"
                >
                  <div className="w-full h-36 relative bg-gray-100 dark:bg-gray-700">
                    {listing.images?.[0] ? (
                      <>
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          className="w-full h-full object-cover"
                          onError={e => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div
                          style={{ display: 'none' }}
                          className="w-full h-full absolute inset-0 items-center justify-center bg-gray-100 dark:bg-gray-700"
                        >
                          <HiShoppingBag size={32} className="text-gray-300 dark:text-gray-500" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <HiShoppingBag size={32} className="text-gray-300 dark:text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 mb-1">
                      {listing.title}
                    </p>
                    {listing.unit && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                        {listing.unit}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-base font-black text-primary-600 dark:text-primary-400">
                        ৳{listing.price}
                      </span>
                      <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
                        listing.status === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {listing.status === 'active' ? t('store.in_stock') : t('store.out_of_stock')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center">
                <HiShoppingBag size={32} className="text-gray-300 dark:text-gray-500" />
              </div>
              {isOwner ? (
                <>
                  <p className="text-base font-black text-gray-900 dark:text-white mb-1">
                    {t('store.empty_owner_title')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {t('store.empty_owner_sub')}
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    {t('store.add_products_cta')}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-base font-black text-gray-900 dark:text-white mb-1">
                    {t('store.empty_title')}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('store.empty_sub')}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-400 dark:text-gray-500">
                {t('store.no_filter_results')}
              </p>
            </div>
          )}
        </div>

        {storeSettings.openingHours && (
          <div className="mx-4 mt-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <HiClock size={18} className="text-primary-600 dark:text-primary-400" />
                <span className="text-base font-black text-gray-900 dark:text-white">
                  {t('store.opening_hours')}
                </span>
              </div>
              {groupHours(storeSettings.openingHours, todayKey).map((group, idx) => {
                const isToday = group.days.includes(todayKey)
                const dayLabel = group.days.length === 1
                  ? DAY_LABELS[group.days[0]]
                  : DAY_LABELS[group.days[0]] + ' - ' + DAY_LABELS[group.days[group.days.length - 1]]
                return (
                  <div
                    key={idx}
                    className={`flex justify-between items-center py-2.5 px-3 rounded-xl mb-1 ${
                      isToday ? 'bg-primary-50 dark:bg-primary-900/20' : 'bg-gray-50 dark:bg-gray-700/40'
                    }`}
                  >
                    <div className="flex items-center flex-wrap gap-1">
                      <span className={`text-sm ${isToday ? 'font-black text-primary-700 dark:text-primary-300' : 'font-semibold text-gray-700 dark:text-gray-300'}`}>
                        {dayLabel}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200 rounded-full px-2 py-0.5 font-bold">
                          {t('store.today_label')}
                        </span>
                      )}
                    </div>
                    <span className={`text-sm font-semibold ${
                      group.isClosed
                        ? 'text-red-500 dark:text-red-400'
                        : isToday
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-green-600 dark:text-green-400'
                    }`}>
                      {group.isClosed
                        ? t('store.day_closed')
                        : formatHour(group.open, lang) + ' - ' + formatHour(group.close, lang)
                      }
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {serviceAreas.length > 0 && (
          <div className="mx-4 mt-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-3">
                <HiLocationMarker size={18} className="text-primary-600 dark:text-primary-400" />
                <span className="text-base font-black text-gray-900 dark:text-white">
                  {t('store.service_areas')}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(showAllAreas ? serviceAreas : serviceAreas.slice(0, 4)).map((area, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800 rounded-full px-3 py-1.5 text-sm font-semibold"
                  >
                    <HiCheckCircle size={13} />
                    {area}
                  </span>
                ))}
              </div>
              {serviceAreas.length > 4 && (
                <button
                  onClick={() => setShowAllAreas(!showAllAreas)}
                  className="mt-3 flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold"
                >
                  {showAllAreas ? (
                    <>{t('store.show_less')}<HiChevronUp size={16} /></>
                  ) : (
                    <>{t('store.show_more_areas', { count: serviceAreas.length - 4 })}<HiChevronDown size={16} /></>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default Store