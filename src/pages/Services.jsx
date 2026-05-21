// src/pages/Services.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HiSearch, HiX, HiBriefcase, HiLocationMarker,
  HiArrowLeft, HiHeart, HiOutlineHeart,
  HiUserCircle, HiAdjustments, HiArrowRight
} from 'react-icons/hi'
import { getServiceProviders, isProviderAvailable } from '../services/serviceProviderService'
import { useAppLocation } from '../context/LocationContext'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { SERVICE_CATEGORIES } from '../data/serviceTypes'
import { LOCATIONS } from '../data/locations'

function toSubcatKey(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function Services() {
  const navigate = useNavigate()
  const location = useLocation()
  const { selectedLocation } = useAppLocation()
  const { userProfile } = useAuth()
  const { t } = useTranslation()
  const userRole = userProfile?.role || null
  const [searchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const mainParam = searchParams.get('main')
  const viewParam = searchParams.get('view')

  const [providers, setProviders] = useState([])
  const [filteredProviders, setFilteredProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLocationFilter, setSelectedLocationFilter] = useState(selectedLocation)
  const [showFilters, setShowFilters] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [lastDoc, setLastDoc] = useState(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showCategories, setShowCategories] = useState(!categoryParam)
  const [showSubcategories, setShowSubcategories] = useState(false)
  const [selectedMainCategory, setSelectedMainCategory] = useState(null)
  const [activeChip, setActiveChip] = useState('all')
  const [favourites, setFavourites] = useState({})

  const toggleFavourite = (id, e) => {
    e.stopPropagation()
    setFavourites(prev => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    if (activeChip === 'available') {
      setFilteredProviders(
        providers.filter(p => isProviderAvailable(p.serviceProfile?.availability))
      )
    } else {
      setFilteredProviders(providers)
    }
  }, [providers, activeChip])

  useEffect(() => {
    if (viewParam === 'all') {
      setShowCategories(false)
      setShowSubcategories(false)
      setSelectedMainCategory(null)
      setSelectedCategory('')
      return
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam)
      setShowCategories(false)
      setShowSubcategories(false)
      const parent = SERVICE_CATEGORIES.find(c => c.subcategories.includes(categoryParam))
      if (parent) setSelectedMainCategory(parent)
    } else if (mainParam) {
      const found = SERVICE_CATEGORIES.find(c => c.id === mainParam)
      if (found) {
        setSelectedMainCategory(found)
        setShowCategories(false)
        setShowSubcategories(true)
      }
    }
  }, [categoryParam, mainParam, viewParam])

  useEffect(() => {
    if (!showCategories) {
      loadProviders()
    }
  }, [selectedCategory, selectedLocationFilter, showCategories])

  useEffect(() => {
    setSelectedLocationFilter(selectedLocation)
  }, [selectedLocation])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hasCategory = params.get('category')
    const hasMain = params.get('main')
    if (!hasCategory && !hasMain) {
      setShowCategories(true)
      setShowSubcategories(false)
      setSelectedMainCategory(null)
      setSelectedCategory('')
    }
  }, [location.state?.ts, location.pathname])

  const loadProviders = async (loadMore = false) => {
    try {
      setError(null)
      if (loadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
        setProviders([])
        setLastDoc(null)
      }
      const filters = {
        search: searchTerm,
        category: selectedCategory,
        location: selectedLocationFilter,
        lastDoc: loadMore ? lastDoc : null
      }
      const result = await getServiceProviders(filters)
      if (loadMore) {
        setProviders(prev => [...prev, ...result.providers])
      } else {
        setProviders(result.providers)
      }
      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (error) {
      console.error('Error loading service providers:', error)
      setError('Failed to load service providers. Please check your connection.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedLocationFilter('ALL Areas')
    setTimeout(() => loadProviders(), 0)
  }

  const handleProviderClick = (providerId) => {
    navigate(`/service-provider/${providerId}`)
  }

  const handleMainCategorySelect = (category) => {
    setSelectedMainCategory(category)
    setShowSubcategories(true)
    setShowCategories(false)
  }

  const handleSubcategorySelect = (subcategory) => {
    setSelectedCategory(subcategory)
    setShowSubcategories(false)
  }

  const handleBackToCategories = () => {
    setShowSubcategories(false)
    setShowCategories(true)
    setSelectedMainCategory(null)
    setSelectedCategory('')
  }

  const handleBackToSubcategories = () => {
    setShowSubcategories(true)
    setShowCategories(false)
  }

  const CtaBanner = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-6"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-3 p-4">
        <div className="w-12 h-12 flex-shrink-0">
          <img
            src="/images/cta-shop.webp"
            alt=""
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
            <HiBriefcase size={24} className="text-primary-400 dark:text-primary-500" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white">{t('services.cta_title')}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{t('services.cta_subtitle')}</p>
        </div>
        <Link to="/signup" className="flex-shrink-0">
          <div className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1">
            {t('services.cta_button')}
            <HiArrowRight size={12} />
          </div>
        </Link>
      </div>
    </motion.div>
  )

  if (showCategories) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >

            <div className="mb-5">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                {t('services.page_title')}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('services.page_subtitle')}
              </p>
            </div>

            <div className="flex items-center justify-between mt-5 mb-3">
              <span className="text-base font-black text-gray-900 dark:text-white">
                {t('services.all_categories')}
              </span>
              <button
                onClick={() => setShowCategories(false)}
                className="text-sm font-semibold text-primary-600 dark:text-primary-400"
              >
                {t('services.see_all_services')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SERVICE_CATEGORIES.map((category, index) => (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleMainCategorySelect(category)}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all overflow-hidden text-left"
                >
                  <div className="flex items-center justify-between p-3 gap-2 min-h-[80px]">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-primary-600 dark:text-primary-400 leading-normal line-clamp-2">
                        {t('categories_service.' + category.id) || category.label}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {category.subcategories.length}+ {t('services.subcategory_count')}
                      </p>
                    </div>
                    <div className="flex-shrink-0 w-16 h-16">
                      <img
                        src={`/images/categories/${category.id}.webp`}
                        alt=""
                        className="w-full h-full object-contain drop-shadow-sm"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                        <HiBriefcase size={28} className="text-primary-300 dark:text-primary-700" />
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {userRole !== 'business' && userRole !== 'service' && <CtaBanner />}

          </motion.div>
        </div>
      </div>
    )
  }

  if (showSubcategories && selectedMainCategory) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBackToCategories}
              className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold text-sm mb-4"
            >
              <HiArrowLeft size={16} />
              {t('services.back_to_categories')}
            </motion.button>

            <div className="mb-4">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">
                {t('categories_service.' + selectedMainCategory.id) || selectedMainCategory.label}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {selectedMainCategory.subcategories.length}+ {t('services.subcategory_count')}
              </p>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {t('services.all_subcategories')}
              </span>
              <button
                onClick={() => { setShowSubcategories(false); setShowCategories(false); setSelectedCategory('') }}
                className="text-sm font-semibold text-primary-600 dark:text-primary-400"
              >
                {t('services.see_all_services')}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {selectedMainCategory.subcategories.map((subcategory, index) => (
                <motion.button
                  key={subcategory}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSubcategorySelect(subcategory)}
                  className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all overflow-hidden text-left"
                >
                  <div className="flex items-center gap-3 p-3 min-h-[72px]">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 flex items-center justify-center">
                      <img
                        src={`/images/subcategories/${toSubcatKey(subcategory)}.webp`}
                        alt=""
                        className="w-12 h-12 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                      <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                        <HiBriefcase size={20} className="text-primary-400 dark:text-primary-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white leading-normal line-clamp-2">
                        {subcategory}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {userRole !== 'business' && userRole !== 'service' && <CtaBanner />}

          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >

          {selectedCategory && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={handleBackToSubcategories}
              className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400 font-semibold text-sm mb-3"
            >
              <HiArrowLeft size={16} />
              {t('services.back_to_subcategories')}
            </motion.button>
          )}

          <div className="mb-4">
            <h1 className="text-xl font-black text-gray-900 dark:text-white mb-0.5">
              {selectedCategory || t('services.discover_title')}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('services.discover_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1 relative">
              <HiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                size={18}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') loadProviders() }}
                placeholder={t('services.search_placeholder')}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-md active:scale-95"
            >
              <HiAdjustments size={22} className="text-white" />
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4 -mx-4 px-4">
            {[
              { key: 'all', label: t('services.chip_all') },
              { key: 'available', label: t('services.chip_available') },
              { key: 'top', label: t('services.chip_top') },
              { key: 'popular', label: t('services.chip_popular') },
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => setActiveChip(chip.key)}
                className={`px-4 py-2 rounded-full text-sm font-bold flex-shrink-0 transition-all whitespace-nowrap border ${
                  activeChip === chip.key
                    ? 'bg-primary-600 text-white border-primary-600 shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-black text-gray-900 dark:text-white">
                    {t('services.filter_title')}
                  </span>
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-primary-600 dark:text-primary-400 font-semibold"
                  >
                    {t('services.filter_clear')}
                  </button>
                </div>

                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {t('services.filter_category')}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {SERVICE_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(selectedCategory === category.label ? '' : category.label)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        selectedCategory === category.label
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {t('categories_service.' + category.id) || category.label}
                    </button>
                  ))}
                </div>

                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  {t('services.filter_location')}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => setSelectedLocationFilter('ALL Areas')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      selectedLocationFilter === 'ALL Areas'
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    {t('services.all_areas')}
                  </button>
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocationFilter(loc)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        selectedLocationFilter === loc
                          ? 'bg-primary-600 text-white border-primary-600'
                          : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      {t('locations.' + loc) || loc}
                    </button>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setShowFilters(false); loadProviders() }}
                  className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl transition-colors"
                >
                  {t('services.filter_apply')}
                </motion.button>
              </div>
            </motion.div>
          )}

          {(selectedCategory || selectedLocationFilter !== 'ALL Areas' || searchTerm) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex flex-wrap gap-2"
            >
              {searchTerm && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold">
                  {searchTerm}
                  <button onClick={() => setSearchTerm('')}>
                    <HiX size={14} />
                  </button>
                </span>
              )}
              {selectedCategory && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('')}>
                    <HiX size={14} />
                  </button>
                </span>
              )}
              {selectedLocationFilter !== 'ALL Areas' && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-bold">
                  {t('locations.' + selectedLocationFilter) || selectedLocationFilter}
                  <button onClick={() => setSelectedLocationFilter('ALL Areas')}>
                    <HiX size={14} />
                  </button>
                </span>
              )}
            </motion.div>
          )}

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-3 animate-pulse"
                >
                  <div className="w-32 h-28 bg-gray-200 dark:bg-gray-700 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 dark:text-red-400 font-semibold mb-4">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loadProviders()}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all"
              >
                {t('services.try_again')}
              </motion.button>
            </div>
          ) : filteredProviders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <HiBriefcase size={40} className="text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {t('services.no_providers')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('services.no_providers_sub')}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearFilters}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold transition-all"
              >
                {t('services.clear_filters')}
              </motion.button>
            </motion.div>
          ) : (
            <>
              <div className="space-y-3">
                {filteredProviders.map((provider, index) => {
                  const serviceProfile = provider.serviceProfile || {}
                  const isAvailable = isProviderAvailable(serviceProfile.availability)
                  const rawArea = serviceProfile.coverageAreas?.includes('ALL')
                    ? 'All Areas'
                    : serviceProfile.coverageAreas?.[0] || 'Dakshinkhan'
                  const serviceArea = t('locations.' + rawArea) || rawArea

                  return (
                    <motion.div
                      key={provider.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04, duration: 0.3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProviderClick(provider.id)}
                      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                    >
                      <div className="flex">
                        <div className="flex-shrink-0 w-32 relative min-h-[120px]">
                          {(serviceProfile.profilePhoto || provider.photoURL) ? (
                            <img
                              src={serviceProfile.profilePhoto || provider.photoURL}
                              alt=""
                              className="w-full h-full object-cover absolute inset-0"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 absolute inset-0 flex items-center justify-center">
                              <HiUserCircle size={40} className="text-primary-400 dark:text-primary-600" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 p-3 flex flex-col justify-between min-h-[120px]">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 flex-1">
                              {provider.displayName || 'Service Provider'}
                            </h3>
                            <button
                              className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center"
                              onClick={(e) => toggleFavourite(provider.id, e)}
                            >
                              {favourites[provider.id] ? (
                                <HiHeart size={14} className="text-red-500" />
                              ) : (
                                <HiOutlineHeart size={14} className="text-gray-400 dark:text-gray-500" />
                              )}
                            </button>
                          </div>

                          <div className="space-y-0.5 mt-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {serviceProfile.profession || serviceProfile.servicesOffered?.[0] || ''}
                            </p>
                            <div className="flex items-center gap-1">
                              <HiLocationMarker size={11} className="text-primary-500 dark:text-primary-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {serviceArea}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                              isAvailable
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                                : 'bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                            }`}>
                              {isAvailable ? t('services.available') : t('services.unavailable')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {hasMore && (
                <div className="mt-8 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => loadProviders(true)}
                    disabled={loadingMore}
                    className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-primary-600 text-primary-600 dark:text-primary-400 rounded-xl font-bold hover:bg-primary-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loadingMore ? t('services.loading') : t('services.load_more')}
                  </motion.button>
                </div>
              )}
            </>
          )}

        </motion.div>
      </div>
    </div>
  )
}

export default Services