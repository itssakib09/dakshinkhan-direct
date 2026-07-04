// src/pages/ServiceProvider.jsx
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import {
  HiArrowLeft,
  HiPhone,
  HiLocationMarker,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiHeart,
  HiShare,
  HiStar,
  HiBriefcase,
  HiUser,
  HiCalendar,
  HiChevronDown,
  HiChevronUp,
  HiChevronRight,
  HiClipboardList,
  HiPhotograph,
  HiInformationCircle,
  HiCash,
  HiX
} from 'react-icons/hi'
import { getServiceProviderById } from '../services/serviceProviderService'
import { WEEK_DAYS, DAY_LABELS } from '../data/storeHours'

function toBn(str) {
  const map = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}
  return String(str).split('').map(c => map[c] || c).join('')
}

function formatHour(timeStr, lang) {
  if (!timeStr) return ''
  const [hStr, mm] = timeStr.split(':')
  const h = parseInt(hStr)
  if (lang === 'en') {
    if (h === 0) return `12:${mm} AM`
    if (h < 12) return `${h}:${mm} AM`
    if (h === 12) return `12:${mm} PM`
    return `${h - 12}:${mm} PM`
  }
  if (h < 6) return `রাত ${toBn(String(h))}:${toBn(mm)}`
  if (h < 12) return `সকাল ${toBn(String(h))}:${toBn(mm)}`
  if (h === 12) return `দুপুর ১২:${toBn(mm)}`
  if (h < 17) return `বিকাল ${toBn(String(h - 12))}:${toBn(mm)}`
  if (h < 20) return `সন্ধ্যা ${toBn(String(h - 12))}:${toBn(mm)}`
  return `রাত ${toBn(String(h - 12))}:${toBn(mm)}`
}

function groupHours(schedule, todayKey) {
  if (!schedule) return []
  const groups = []
  let i = 0
  while (i < WEEK_DAYS.length) {
    const day = WEEK_DAYS[i]
    const info = schedule[day] || { closed: true }
    let j = i + 1
    while (j < WEEK_DAYS.length) {
      const next = schedule[WEEK_DAYS[j]] || { closed: true }
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

function ServiceProvider() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { currentUser } = useAuth()

  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showAllAreas, setShowAllAreas] = useState(false)
  const [showFullBio, setShowFullBio] = useState(false)
  const [showAllHours, setShowAllHours] = useState(false)
  const [previewType, setPreviewType] = useState(null)

  const jsToWeekDay = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']
  const todayKey = jsToWeekDay[new Date().getDay()]
  const lang = i18n.language?.startsWith('bn') ? 'bn' : 'en'

  useEffect(() => {
    loadProvider()
  }, [id])

  const loadProvider = async () => {
    try {
      setLoading(true)
      const data = await getServiceProviderById(id)
      if (!data) {
        setError('not_found')
        return
      }
      setProvider(data)
    } catch (err) {
      console.error('Error loading provider:', err)
      setError('failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCall = () => {
    if (phone) window.location.href = `tel:${phone}`
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: name, url: window.location.href }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href).catch(() => {})
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
        <div className="max-w-2xl mx-auto animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 w-full" />
          <div className="mx-4 mt-16 h-44 bg-white dark:bg-gray-800 rounded-2xl" />
          <div className="mx-4 mt-4 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="mx-4 mt-4 h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
          <div className="mx-4 mt-4 h-48 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-sm border border-gray-100 dark:border-gray-700 shadow-sm">
          <HiXCircle size={48} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-2">
            {t('provider.not_found_title')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {t('provider.not_found_sub')}
          </p>
          <button
            onClick={() => navigate('/services')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            {t('provider.browse_services')}
          </button>
        </div>
      </div>
    )
  }

  const sp = provider.serviceProfile || {}
  const name = provider.displayName || 'Provider'
  const phone = sp.phone || provider.phone
  const profession = sp.profession || sp.subcategory || ''
  const bio = sp.bio || ''
  const profilePhoto = sp.profilePhoto
  const coverPhoto = sp.coverPhoto
  const availability = sp.availability || {}
  const isAvailable = availability.availableNow
  const schedule = availability.schedule || {}
  const servicesOffered = sp.servicesOffered || []
  const coverageAreas = sp.coverageAreas || []
  const visitCharge = sp.visitCharge
  const experience = sp.experience
  const completedJobs = sp.completedJobs
  const responseTime = sp.responseTime
  const recentWorkPhotos = sp.recentWorkPhotos || []
  const verified = sp.verified || false

  let joinedYear = ''
  try {
    const raw = provider.createdAt
    if (raw?.toDate) joinedYear = raw.toDate().getFullYear()
    else if (raw) joinedYear = new Date(raw).getFullYear()
  } catch {}

  const hoursGroups = groupHours(schedule, todayKey)
  const displayedHours = showAllHours ? hoursGroups : hoursGroups.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
      <div className="max-w-2xl mx-auto">

        <div className="relative w-full h-48"
  onClick={() => coverPhoto && setPreviewType('cover')}
  style={{ cursor: coverPhoto ? 'pointer' : 'default' }}>
          {coverPhoto ? (
            <>
              <img
                src={coverPhoto}
                alt={name}
                className="w-full h-48 object-cover"
                onError={e => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div
                style={{ display: 'none' }}
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 items-center justify-center"
              >
                <HiBriefcase size={48} className="text-white/30" />
              </div>
            </>
          ) : (
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <HiBriefcase size={48} className="text-white/30" />
            </div>
          )}

          <div className="absolute inset-0 h-48 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-md flex items-center justify-center border border-white/20 dark:border-gray-700"
          >
            <HiArrowLeft size={18} className="text-gray-800 dark:text-gray-200" />
          </motion.button>

          <div className="absolute top-4 right-4 flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFavorited(!isFavorited)}
              className="w-10 h-10 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-md flex items-center justify-center border border-white/20 dark:border-gray-700"
            >
              <HiHeart size={18} className={isFavorited ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="w-10 h-10 bg-white/90 dark:bg-gray-900/90 rounded-xl shadow-md flex items-center justify-center border border-white/20 dark:border-gray-700"
            >
              <HiShare size={16} className="text-gray-800 dark:text-gray-200" />
            </motion.button>
          </div>

          <div
            className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10 ${profilePhoto ? 'cursor-pointer' : ''}`}
            onClick={() => profilePhoto && setPreviewType('profile')}
          >
            <div className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow-xl overflow-hidden relative bg-primary-50 dark:bg-primary-900/30">
              {profilePhoto ? (
                <>
                  <img
                    src={profilePhoto}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div style={{ display: 'none' }} className="absolute inset-0 items-center justify-center">
                    <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                      {name?.[0]?.toUpperCase() || 'P'}
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex' }} className="absolute inset-0 items-center justify-center">
                  <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                    {name?.[0]?.toUpperCase() || 'P'}
                  </span>
                </div>
              )}
            </div>
            {isAvailable === true && (
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-16 mx-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md p-5 text-center"
        >
          <div className="flex justify-center mb-3">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-bold ${
              isAvailable === true
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : isAvailable === false
                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isAvailable === true
                  ? 'bg-green-500 animate-pulse'
                  : isAvailable === false
                    ? 'bg-orange-500'
                    : 'bg-gray-400'
              }`} />
              {isAvailable === true
                ? t('provider.available')
                : isAvailable === false
                  ? t('provider.busy')
                  : t('provider.offline')}
            </span>
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{name}</h1>
            {verified && (
              <HiCheckCircle size={20} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
            )}
          </div>

          {profession && (
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-base font-semibold text-gray-700 dark:text-gray-300">{profession}</span>
              <span className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-bold rounded-full px-2 py-0.5 border border-primary-100 dark:border-primary-800">
                {t('provider.provider_tag', { defaultValue: 'Provider' })}
              </span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 flex-wrap mb-4 text-sm text-gray-500 dark:text-gray-400">
            {responseTime && (
              <span>{t('provider.today_active', { defaultValue: 'Active today' })} &bull; {responseTime}</span>
            )}
            {coverageAreas?.[0] && (
              <span className="flex items-center gap-1">
                <HiLocationMarker size={14} className="text-gray-400 dark:text-gray-500" />
                {coverageAreas[0]}, Dhaka
              </span>
            )}
          </div>

          {(experience || completedJobs) && (
            <div className="flex items-center justify-center gap-6 py-3 mb-4 border-t border-b border-gray-100 dark:border-gray-700">
              {experience && (
                <div className="flex flex-col items-center">
                  <HiStar size={20} className="text-yellow-500 mb-1" />
                  <span className="text-xl font-black text-gray-900 dark:text-white">{experience}+</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('provider.years_exp')}</span>
                </div>
              )}
              {experience && completedJobs && (
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700" />
              )}
              {completedJobs && (
                <div className="flex flex-col items-center">
                  <HiCheckCircle size={20} className="text-primary-600 dark:text-primary-400 mb-1" />
                  <span className="text-xl font-black text-gray-900 dark:text-white">{completedJobs}+</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('provider.jobs_done')}</span>
                </div>
              )}
            </div>
          )}

          {phone && (
            <button
              onClick={handleCall}
              className="w-full bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <HiPhone size={18} />
              {t('provider.call_now')}
            </button>
          )}
        </motion.div>

        {(experience || completedJobs || joinedYear) && (
          <div className="mx-4 mt-4 grid grid-cols-3 gap-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-1">
              <div className="w-9 h-9 rounded-full mb-0.5 bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <HiStar size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-base font-black text-gray-900 dark:text-white">
                {experience ? experience + '+' : '-'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('provider.years_exp')}</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-1">
              <div className="w-9 h-9 rounded-full mb-0.5 bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <HiCheckCircle size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-base font-black text-gray-900 dark:text-white">
                {completedJobs ? completedJobs + '+' : '-'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('provider.jobs_done')}</span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center gap-1">
              <div className="w-9 h-9 rounded-full mb-0.5 bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                <HiCalendar size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <span className="text-base font-black text-gray-900 dark:text-white">
                {joinedYear || '-'}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('provider.member_since')}</span>
            </div>
          </div>
        )}

        {visitCharge && (
          <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HiCash size={18} className="text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-black text-gray-900 dark:text-white">
                  {t('provider.visit_charge')}
                </span>
              </div>
              <span className="text-2xl font-black text-primary-600 dark:text-primary-400">
                ৳{visitCharge}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              {t('provider.price_note')}
            </p>
          </div>
        )}

        {servicesOffered.length > 0 && (
          <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <HiClipboardList size={18} className="text-primary-600 dark:text-primary-400" />
              <span className="text-base font-black text-gray-900 dark:text-white">
                {t('provider.service_prices')}
              </span>
            </div>
            {servicesOffered.slice(0, 5).map((service, i) => (
              <div
                key={i}
                className={`flex justify-between items-center py-2.5 ${
                  i < Math.min(servicesOffered.length, 5) - 1
                    ? 'border-b border-gray-50 dark:border-gray-700/50'
                    : ''
                }`}
              >
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {typeof service === 'string' ? service : service.name}
                </span>
                {typeof service === 'object' && (service.priceFrom || service.priceTo) && (
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {service.priceFrom && service.priceTo
                      ? `৳${service.priceFrom} - ৳${service.priceTo}`
                      : service.priceFrom
                        ? `৳${service.priceFrom}+`
                        : ''}
                  </span>
                )}
              </div>
            ))}
            {servicesOffered.length > 5 && (
              <button className="mt-3 flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold">
                {t('provider.see_all_services', { count: servicesOffered.length })}
                <HiChevronRight size={16} />
              </button>
            )}
            <div className="mt-3 flex items-center gap-1">
              <HiInformationCircle size={14} className="text-gray-400 dark:text-gray-500" />
              <span className="text-xs text-gray-400 dark:text-gray-500">{t('provider.price_note')}</span>
            </div>
          </div>
        )}

        {Object.keys(schedule).length > 0 && (
          <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <HiClock size={18} className="text-primary-600 dark:text-primary-400" />
              <span className="text-base font-black text-gray-900 dark:text-white">
                {t('provider.working_hours')}
              </span>
            </div>
            {displayedHours.map((group, idx) => {
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
                        {t('provider.today_label')}
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
                      ? t('provider.day_closed')
                      : formatHour(group.open, lang) + ' - ' + formatHour(group.close, lang)
                    }
                  </span>
                </div>
              )
            })}
            {hoursGroups.length > 3 && !showAllHours && (
              <button
                onClick={() => setShowAllHours(true)}
                className="mt-2 flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold"
              >
                {t('provider.see_all_hours')}
                <HiChevronDown size={16} />
              </button>
            )}
          </div>
        )}

        {coverageAreas.length > 0 && (
          <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <HiLocationMarker size={18} className="text-primary-600 dark:text-primary-400" />
              <span className="text-base font-black text-gray-900 dark:text-white">
                {t('provider.service_areas')}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(showAllAreas ? coverageAreas : coverageAreas.slice(0, 6)).map((area, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800 rounded-full px-3 py-1.5 text-sm font-semibold"
                >
                  <HiCheckCircle size={13} />
                  {area}
                </span>
              ))}
            </div>
            {coverageAreas.length > 6 && (
              <button
                onClick={() => setShowAllAreas(!showAllAreas)}
                className="mt-3 flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold"
              >
                {showAllAreas ? (
                  <>{t('provider.show_less')}<HiChevronUp size={16} /></>
                ) : (
                  <>{t('provider.show_more_areas', { count: coverageAreas.length - 6 })}<HiChevronDown size={16} /></>
                )}
              </button>
            )}
          </div>
        )}

        {bio && (
          <div className="mx-4 mt-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <HiUser size={18} className="text-primary-600 dark:text-primary-400" />
              <span className="text-base font-black text-gray-900 dark:text-white">
                {t('provider.about')}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {showFullBio || bio.length <= 120 ? bio : bio.slice(0, 120) + '...'}
            </p>
            {bio.length > 120 && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="mt-2 flex items-center gap-0.5 text-primary-600 dark:text-primary-400 text-sm font-semibold"
              >
                {showFullBio ? t('provider.show_less_bio') : t('provider.read_more')}
                {showFullBio ? <HiChevronUp size={16} /> : <HiChevronDown size={16} />}
              </button>
            )}
          </div>
        )}

        {recentWorkPhotos.length > 0 && (
          <div className="mx-4 mt-4 mb-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <HiPhotograph size={18} className="text-primary-600 dark:text-primary-400" />
              <span className="text-base font-black text-gray-900 dark:text-white">
                {t('provider.recent_work')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {recentWorkPhotos.slice(0, 6).map((photo, i) => (
                <div key={i} className="rounded-xl overflow-hidden relative w-full" style={{ paddingBottom: '100%' }}>
                  <img
                    src={photo}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={e => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'block'
                    }}
                  />
                  <div
                    style={{ display: 'none' }}
                    className="absolute inset-0 bg-gray-100 dark:bg-gray-700"
                  />
                </div>
              ))}
            </div>
            {recentWorkPhotos.length > 6 && (
              <button className="mt-3 flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-semibold">
                {t('provider.see_all_photos')}
                <HiChevronRight size={16} />
              </button>
            )}
          </div>
        )}

        <AnimatePresence>
  {(previewType === 'profile' || previewType === 'cover') && (
    <motion.div
      key="preview-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setPreviewType(null)}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    >
      <button
        onClick={e => {
          e.stopPropagation()
          setPreviewType(null)
        }}
        className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"
      >
        <HiX size={20} className="text-white" />
      </button>
      <motion.img
        key="preview-img"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
        src={previewType === 'profile' ? profilePhoto : coverPhoto}
        alt={name}
        onClick={e => e.stopPropagation()}
        className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
      />
    </motion.div>
  )}
</AnimatePresence>

      </div>
    </div>
  )
}

export default ServiceProvider