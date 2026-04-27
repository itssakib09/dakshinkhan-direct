import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiArrowLeft,
  HiPhone,
  HiMail,
  HiLocationMarker,
  HiClock,
  HiBriefcase,
  HiCheckCircle,
  HiXCircle,
  HiUser
} from 'react-icons/hi'
import { getServiceProviderById, isProviderAvailable } from '../services/serviceProviderService'
import { WEEK_DAYS, DAY_LABELS } from '../data/storeHours'

function ServiceProvider() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Today's day index for schedule highlighting
  const todayIndex = new Date().getDay()
  const todayKey = WEEK_DAYS[todayIndex]

  useEffect(() => {
    loadProvider()
  }, [id])

  const loadProvider = async () => {
    try {
      setLoading(true)
      const data = await getServiceProviderById(id)

      if (!data) {
        setError('Service provider not found')
        return
      }

      setProvider(data)
    } catch (err) {
      console.error('Error loading provider:', err)
      setError('Failed to load service provider')
    } finally {
      setLoading(false)
    }
  }

  const handleContactClick = () => {
    if (provider?.phone) {
      window.location.href = `tel:${provider.phone}`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 md:pb-8">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 md:pb-8">
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiXCircle size={40} className="text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {error || 'Provider Not Found'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The service provider you're looking for doesn't exist or has been removed.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/services')}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all"
            >
              Browse Service Providers
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  const serviceProfile = provider.serviceProfile || {}
  const isAvailable = isProviderAvailable(serviceProfile.availability)
  const coverageDisplay = serviceProfile.coverageAreas?.includes('ALL') || serviceProfile.coverageAreas?.length === 0
    ? 'All Areas in Dakshinkhan'
    : serviceProfile.coverageAreas?.join(', ') || 'Dakshinkhan'

  const handleBack = () => {
    const subcategory = provider?.serviceProfile?.subcategory 
      || provider?.serviceProfile?.servicesOffered?.[0]
    if (subcategory) {
      navigate(`/services?category=${encodeURIComponent(subcategory)}`)
    } else {
      navigate('/services')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-8 md:pb-8">
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold mb-6 transition-colors"
        >
          <HiArrowLeft size={20} />
          Back
        </motion.button>

        {/* Cover Photo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden mb-4"
        >
          {serviceProfile.coverPhoto ? (
            <div className="h-64">
              <img
                src={serviceProfile.coverPhoto}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="h-64 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center relative overflow-hidden">
              <span className="text-9xl font-black text-white/10 select-none absolute">
                {provider.displayName?.[0]?.toUpperCase() || 'S'}
              </span>
            </div>
          )}
        </motion.div>

        {/* Profile Card — normal flow, not absolutely positioned */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          {/* Mobile: stacked centered. Desktop: horizontal */}
          <div className="flex flex-col items-center lg:flex-row lg:items-center lg:gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-4 lg:mb-0 flex-shrink-0">
              {serviceProfile.profilePhoto || provider.photoURL ? (
                <img
                  src={serviceProfile.profilePhoto || provider.photoURL}
                  alt={provider.displayName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                  <span className="text-4xl font-black text-white">
                    {provider.displayName?.[0]?.toUpperCase() || 'S'}
                  </span>
                </div>
              )}
              {/* Availability Badge */}
              <span className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-md ${
                isAvailable
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-800/80 text-gray-300'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isAvailable ? 'bg-white animate-pulse' : 'bg-gray-400'
                }`}></span>
                {isAvailable ? 'Available Now' : 'Currently Busy'}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mb-1">
                {provider.displayName || 'Service Provider'}
              </h1>
              <p className="text-base text-primary-600 dark:text-primary-400 font-bold mb-3">
                {serviceProfile.profession || 'Professional Service Provider'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <HiLocationMarker size={16} className="flex-shrink-0" />
                  <span>{coverageDisplay}</span>
                </div>
              </div>
            </div>

            {/* Contact Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleContactClick}
              className="mt-4 lg:mt-0 w-full lg:w-auto px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <HiPhone size={20} />
              Contact Now
            </motion.button>
          </div>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {serviceProfile.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiUser size={24} className="text-primary-600 dark:text-primary-400" />
                  About
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {serviceProfile.bio}
                </p>
              </motion.div>
            )}

            {/* Services Offered */}
            {serviceProfile.servicesOffered && serviceProfile.servicesOffered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiBriefcase size={24} className="text-primary-600 dark:text-primary-400" />
                  Services Offered
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {serviceProfile.servicesOffered.map((service, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl"
                    >
                      <HiCheckCircle size={16} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                      <span className="text-sm font-semibold text-gray-800 dark:text-white">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pricing */}
            {serviceProfile.pricing && serviceProfile.pricing.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                  Pricing
                </h2>
                <div className="space-y-3">
                  {serviceProfile.pricing.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl"
                    >
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </span>
                      <span className="text-lg font-black text-primary-600 dark:text-primary-400">
                        ৳{item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Availability Schedule */}
            {serviceProfile.availability?.schedule && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiClock size={24} className="text-primary-600 dark:text-primary-400" />
                  Availability Schedule
                </h2>
                <div className="space-y-1.5">
                  {WEEK_DAYS.map(day => {
                    const schedule = serviceProfile.availability.schedule[day]
                    const isClosed = schedule?.closed || !schedule?.available
                    const isToday = day === todayKey

                    return (
                      <div
                        key={day}
                        className={`flex justify-between items-center p-3 rounded-xl ${
                          isToday
                            ? 'bg-primary-50 dark:bg-primary-900/20'
                            : 'bg-gray-50 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`capitalize ${
                          isToday
                            ? 'font-black text-primary-700 dark:text-primary-300'
                            : 'font-semibold text-gray-900 dark:text-white'
                        }`}>
                          {DAY_LABELS[day]}
                          {isToday && (
                            <span className="text-xs text-primary-600 dark:text-primary-400 font-bold ml-2">
                              Today
                            </span>
                          )}
                        </span>
                        {isClosed ? (
                          <span className="text-red-600 dark:text-red-400 font-semibold">
                            Closed
                          </span>
                        ) : (
                          <span className={`font-semibold ${
                            isToday
                              ? 'text-primary-600 dark:text-primary-400'
                              : 'text-green-600 dark:text-green-400'
                          }`}>
                            {schedule.open} - {schedule.close}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Contact & Coverage */}
          <div className="space-y-6">
            {/* Contact Information — order-first on mobile so it appears before schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 order-first lg:order-none sticky top-6"
            >
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                Contact Information
              </h2>

              <div className="space-y-4">
                {provider.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HiPhone size={20} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                      <a
                        href={`tel:${provider.phone}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {provider.phone}
                      </a>
                    </div>
                  </div>
                )}

                {provider.email && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <HiMail size={20} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <a
                        href={`mailto:${provider.email}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all"
                      >
                        {provider.email}
                      </a>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleContactClick}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <HiPhone size={20} />
                  Call Now
                </motion.button>
              </div>
            </motion.div>

            {/* Service Coverage Areas */}
            {serviceProfile.coverageAreas && serviceProfile.coverageAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              >
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <HiLocationMarker size={24} className="text-primary-600 dark:text-primary-400" />
                  Service Areas
                </h2>

                {serviceProfile.coverageAreas.includes('ALL') || serviceProfile.coverageAreas.length === 0 ? (
                  <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                    <p className="font-semibold text-primary-700 dark:text-primary-300 text-center">
                      Serves All Areas in Dakshinkhan
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {serviceProfile.coverageAreas.map((area, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-semibold"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceProvider