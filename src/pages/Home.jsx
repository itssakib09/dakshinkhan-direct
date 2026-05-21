// src/pages/Home.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import {
  HiLocationMarker,
  HiShoppingBag,
  HiUsers,
  HiArrowRight,
  HiSparkles,
  HiBriefcase,
  HiSearch,
  HiHeart,
  HiOutlineHeart,
  HiOfficeBuilding,
  HiSpeakerphone
} from 'react-icons/hi'
import { useEffect, useState } from 'react'
import { getFeaturedBusinesses, getFeaturedServices } from '../services/homeService'
import { getSponsoredAd } from '../services/adService'
import { BUSINESS_TYPES } from '../data/businessTypes'
import { SERVICE_CATEGORIES } from '../data/serviceTypes'
import { useTranslation } from 'react-i18next'
import { isBusinessOpen } from '../services/businessService'
import { isProviderAvailable } from '../services/serviceProviderService'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [featuredBusinesses, setFeaturedBusinesses] = useState([])
  const [featuredServices, setFeaturedServices] = useState([])
  const [sponsoredAd, setSponsoredAd] = useState(null)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [cycleIndex, setCycleIndex] = useState(0)
  const [favourites, setFavourites] = useState({})
  const { currentUser, userProfile } = useAuth()
  const userRole = userProfile?.role || null

  const toggleFavourite = (id) => {
    setFavourites((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    const fetchFeaturedData = async () => {
      setLoading(true)
      try {
        const [businesses, services, adData] = await Promise.all([
          getFeaturedBusinesses(),
          getFeaturedServices(),
          getSponsoredAd()
        ])
        if (businesses?.length > 0) setFeaturedBusinesses(businesses)
        if (services?.length > 0) setFeaturedServices(services)
        if (adData) setSponsoredAd(adData)
      } catch (error) {
        console.error('Failed to fetch featured data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedData()
  }, [])

  useEffect(() => {
    if (searchQuery !== '') return
    const interval = setInterval(() => {
      setCycleIndex((prev) => (prev + 1) % 6)
    }, 2500)
    return () => clearInterval(interval)
  }, [searchQuery])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const heroSlides = [
    {
      image: '/images/hero/hero-slide-1.webp',
      line1Key: 'hero_slides.slide1_line1',
      line2Key: 'hero_slides.slide1_line2',
      line3Key: 'hero_slides.slide1_line3',
      sublineKey: 'hero_slides.slide1_subline',
      ctaKey: 'hero_slides.slide1_cta',
      ctaPath: '/business',
    },
    {
      image: '/images/hero/hero-slide-2.webp',
      line1Key: 'hero_slides.slide2_line1',
      line2Key: 'hero_slides.slide2_line2',
      line3Key: 'hero_slides.slide2_line3',
      sublineKey: 'hero_slides.slide2_subline',
      ctaKey: 'hero_slides.slide2_cta',
      ctaPath: '/services',
    },
    {
      image: '/images/hero/hero-slide-3.webp',
      line1Key: 'hero_slides.slide3_line1',
      line2Key: 'hero_slides.slide3_line2',
      line3Key: 'hero_slides.slide3_line3',
      sublineKey: 'hero_slides.slide3_subline',
      ctaKey: 'hero_slides.slide3_cta',
      ctaPath: '/signup',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-4 sm:pt-6 pb-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            <Swiper
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 4500, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              loop={true}
              className="w-full [&_.swiper-pagination-bullet]:bg-white/60 [&_.swiper-pagination-bullet-active]:bg-primary-600"
            >
              {heroSlides.map((slide, index) => (
                <SwiperSlide key={index}>
                  <div className="relative w-full h-48 sm:h-64 lg:h-72 overflow-hidden">
                    <img
                      src={slide.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/40 to-transparent dark:from-gray-800/95 dark:via-gray-800/40 dark:to-transparent" />
                    <div className="absolute left-5 sm:left-7 lg:left-8 top-0 bottom-0 max-w-[52%] sm:max-w-[50%] flex flex-col justify-center gap-1">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-900 dark:text-white leading-tight text-lg sm:text-xl lg:text-2xl">
                          {t(slide.line1Key)}
                        </span>
                        <span className="font-black text-primary-600 dark:text-primary-400 leading-tight text-lg sm:text-xl lg:text-2xl">
                          {t(slide.line2Key)}
                        </span>
                        <span className="font-black text-gray-900 dark:text-white leading-tight text-lg sm:text-xl lg:text-2xl">
                          {t(slide.line3Key)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-snug mt-1.5 line-clamp-2">
                        {t(slide.sublineKey)}
                      </p>
                      <Link to={slide.ctaPath}>
                        <button className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white font-bold rounded-xl transition-colors shadow-md shadow-primary-600/20 mt-2 text-xs px-3 py-2 sm:text-sm sm:px-4 sm:py-2.5">
                          {t(slide.ctaKey)}
                          <HiArrowRight size={14} />
                        </button>
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-3 sm:mb-4"
        >
          <form onSubmit={handleSearch}>
            <div className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:border-primary-400 dark:focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-400/20 dark:focus-within:ring-primary-500/20">
              <div className="pl-4 flex items-center flex-shrink-0 pointer-events-none">
                <HiSearch size={20} className="text-gray-400 dark:text-gray-500" />
              </div>
              {searchQuery.length === 0 && (
                <div className="absolute left-0 right-12 top-0 bottom-0 flex items-center pointer-events-none pl-12 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={cycleIndex}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap block"
                    >
                      {(t('search_cycle', { returnObjects: true }) || [])[cycleIndex] || ''}
                    </motion.span>
                  </AnimatePresence>
                </div>
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-1 bg-transparent py-3.5 pl-3 pr-4 text-sm focus:outline-none ${searchQuery.length === 0 ? 'text-transparent' : 'text-gray-900 dark:text-white'}`}
              />
              <button
                type="submit"
                className="mr-2 flex-shrink-0 w-9 h-9 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 flex items-center justify-center transition-colors shadow-sm"
              >
                <HiSearch size={16} className="text-white" />
              </button>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-6"
        >
          {sponsoredAd && sponsoredAd.isActive ? (
            <div className="rounded-2xl overflow-hidden shadow-md relative">
              {sponsoredAd.bannerImage ? (
                <>
                  <div className="relative h-32 sm:h-36">
                    <img
                      src={sponsoredAd.bannerImage}
                      alt=""
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-center gap-1.5 max-w-[60%]">
                      <div className="inline-flex items-center gap-1 bg-primary-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full w-fit">
                        <HiSparkles size={10} />
                        {t('ad.sponsored')}
                      </div>
                      <p className="font-black text-base text-white leading-tight">{sponsoredAd.businessName}</p>
                      <p className="text-xs text-white/80 line-clamp-1">{sponsoredAd.tagline}</p>
                      {sponsoredAd.ctaLink?.startsWith('http') ? (
                        <a
                          href={sponsoredAd.ctaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-white text-primary-700 text-xs font-bold px-3 py-1.5 rounded-xl mt-1 transition-colors hover:bg-primary-50 w-fit"
                        >
                          {sponsoredAd.ctaText}
                          <HiArrowRight size={12} />
                        </a>
                      ) : (
                        <Link
                          to={sponsoredAd.ctaLink}
                          className="inline-flex items-center gap-1.5 bg-white text-primary-700 text-xs font-bold px-3 py-1.5 rounded-xl mt-1 transition-colors hover:bg-primary-50 w-fit"
                        >
                          {sponsoredAd.ctaText}
                          <HiArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 p-5 h-32 sm:h-36 flex flex-col justify-center">
                  <div className="flex flex-col gap-1.5 max-w-[60%]">
                    <div className="inline-flex items-center gap-1 bg-primary-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-full w-fit">
                      <HiSparkles size={10} />
                      {t('ad.sponsored')}
                    </div>
                    <p className="font-black text-base text-white leading-tight">{sponsoredAd.businessName}</p>
                    <p className="text-xs text-white/80 line-clamp-1">{sponsoredAd.tagline}</p>
                    {sponsoredAd.ctaLink?.startsWith('http') ? (
                      <a
                        href={sponsoredAd.ctaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-white text-primary-700 text-xs font-bold px-3 py-1.5 rounded-xl mt-1 transition-colors hover:bg-primary-50 w-fit"
                      >
                        {sponsoredAd.ctaText}
                        <HiArrowRight size={12} />
                      </a>
                    ) : (
                      <Link
                        to={sponsoredAd.ctaLink}
                        className="inline-flex items-center gap-1.5 bg-white text-primary-700 text-xs font-bold px-3 py-1.5 rounded-xl mt-1 transition-colors hover:bg-primary-50 w-fit"
                      >
                        {sponsoredAd.ctaText}
                        <HiArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-dashed border-primary-200 dark:border-primary-800 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <HiSpeakerphone size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 dark:text-white">{t('ad.placeholder_title')}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('ad.placeholder_subtitle')}</p>
              </div>
              <Link
                to="/contact"
                className="flex-shrink-0 inline-flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors whitespace-nowrap"
              >
                {t('ad.placeholder_cta')}
                <HiArrowRight size={12} />
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-4 sm:mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-base font-black text-gray-900 dark:text-white">{t('sections.businesses_title')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Browse local shops &amp; stores</p>
            </div>
            <Link to="/business" className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-0.5 flex-shrink-0">
              {t('sections.see_all')}
              <HiArrowRight size={13} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {BUSINESS_TYPES.slice(0, 5).map((category) => (
              <Link key={category.id} to={`/business?main=${category.id}`} className="flex-shrink-0">
                <div className="flex flex-col items-center gap-2 w-20 sm:w-24">
                  <div className="w-[72px] h-[72px] bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform">
                    <img
                      src={`/images/categories/${category.id}.webp`}
                      alt=""
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                      <HiShoppingBag size={24} className="text-primary-500 dark:text-primary-400" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight line-clamp-2 w-full">{category.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 sm:mb-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-base font-black text-gray-900 dark:text-white">{t('sections.services_title')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Find skilled professionals</p>
            </div>
            <Link to="/services" className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-0.5 flex-shrink-0">
              {t('sections.see_all')}
              <HiArrowRight size={13} />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {SERVICE_CATEGORIES.slice(0, 5).map((category) => (
              <Link key={category.id} to={`/services?main=${category.id}`} className="flex-shrink-0">
                <div className="flex flex-col items-center gap-2 w-20 sm:w-24">
                  <div className="w-[72px] h-[72px] bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform">
                    <img
                      src={`/images/categories/${category.id}.webp`}
                      alt=""
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                    <div style={{ display: 'none' }} className="w-full h-full items-center justify-center">
                      <HiBriefcase size={24} className="text-primary-500 dark:text-primary-400" />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center leading-tight line-clamp-2 w-full">{category.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-base font-black text-gray-900 dark:text-white">{t('sections.featured_businesses')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('sections.new_businesses_subtitle')}</p>
            </div>
            <Link to="/business?view=all" className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-0.5 flex-shrink-0">
              {t('sections.see_all')}
              <HiArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-shrink-0 w-40 h-52 bg-white dark:bg-gray-800 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />
              ))}
            </div>
          ) : featuredBusinesses.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {featuredBusinesses.map((business) => {
                const open = isBusinessOpen(business.storeSettings?.openingHours)
                return (
                  <div
                    key={business.id}
                    className="flex-shrink-0 w-40 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer active:scale-95 transition-transform"
                    onClick={() => navigate(`/store/${business.id}`)}
                  >
                    <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30">
                      {business.storeSettings?.photoURL ? (
                        <img src={business.storeSettings.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <HiOfficeBuilding size={32} className="text-primary-300 dark:text-primary-700" />
                        </div>
                      )}
                      <button
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-sm"
                        onClick={(e) => { e.stopPropagation(); toggleFavourite(business.id) }}
                      >
                        {favourites[business.id] ? (
                          <HiHeart size={14} className="text-red-500" />
                        ) : (
                          <HiOutlineHeart size={14} className="text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                      <span className={`absolute top-2 left-2 text-xs font-bold px-1.5 py-0.5 rounded-lg ${open ? 'bg-green-500 text-white' : 'bg-gray-500/80 text-white'}`}>
                        {open ? t('cards.open') : t('cards.closed')}
                      </span>
                    </div>
                    <div className="p-2.5 space-y-1">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{business.storeSettings?.storeName || 'Business'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{business.storeSettings?.businessType || ''}</p>
                      <div className="flex items-center gap-1">
                        <HiLocationMarker size={11} className="text-primary-500 dark:text-primary-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {business.storeSettings?.serviceAreas?.[0] || 'Dakshinkhan'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3 py-4 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <HiOfficeBuilding size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No businesses yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Check back soon</p>
              </div>
              <Link to="/business?view=all" className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-0.5 flex-shrink-0">
                {t('sections.see_all')}
                <HiArrowRight size={13} />
              </Link>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-base font-black text-gray-900 dark:text-white">{t('sections.featured_services')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('sections.new_services_subtitle')}</p>
            </div>
            <Link to="/services?view=all" className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-0.5 flex-shrink-0">
              {t('sections.see_all')}
              <HiArrowRight size={13} />
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex-shrink-0 w-40 h-52 bg-white dark:bg-gray-800 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700" />
              ))}
            </div>
          ) : featuredServices.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
              {featuredServices.map((provider) => {
                const available = isProviderAvailable(provider.serviceProfile?.availability)
                return (
                  <div
                    key={provider.id}
                    className="flex-shrink-0 w-40 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer active:scale-95 transition-transform"
                    onClick={() => navigate(`/service-provider/${provider.id}`)}
                  >
                    <div className="relative h-28 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/30">
                      {(provider.serviceProfile?.profilePhoto || provider.photoURL) ? (
                        <img src={provider.serviceProfile?.profilePhoto || provider.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <HiUsers size={32} className="text-primary-300 dark:text-primary-700" />
                        </div>
                      )}
                      <button
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center shadow-sm"
                        onClick={(e) => { e.stopPropagation(); toggleFavourite(provider.id) }}
                      >
                        {favourites[provider.id] ? (
                          <HiHeart size={14} className="text-red-500" />
                        ) : (
                          <HiOutlineHeart size={14} className="text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                      <span className={`absolute top-2 left-2 text-xs font-bold px-1.5 py-0.5 rounded-lg ${available ? 'bg-green-500 text-white' : 'bg-gray-500/80 text-white'}`}>
                        {available ? t('cards.available') : t('cards.unavailable')}
                      </span>
                    </div>
                    <div className="p-2.5 space-y-1">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">{provider.displayName || 'Service Provider'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{provider.serviceProfile?.profession || ''}</p>
                      <div className="flex items-center gap-1">
                        <HiLocationMarker size={11} className="text-primary-500 dark:text-primary-400 flex-shrink-0" />
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {provider.serviceProfile?.coverageAreas?.[0] || 'Dakshinkhan'}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center gap-3 py-4 px-4 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                <HiUsers size={18} className="text-gray-400 dark:text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No service providers yet</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Check back soon</p>
              </div>
              <Link to="/services?view=all" className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-0.5 flex-shrink-0">
                {t('sections.see_all')}
                <HiArrowRight size={13} />
              </Link>
            </div>
          )}
        </motion.div>

        {userRole !== 'business' && userRole !== 'service' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-4 sm:mb-6"
          >
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm">
              <div className="flex items-center gap-3 p-4">
                <div className="flex-shrink-0 w-16 h-16">
                  <img
                    src="/images/cta-shop.webp"
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                  <div style={{ display: 'none' }} className="w-full h-full items-center justify-center rounded-2xl bg-primary-50 dark:bg-primary-900/30">
                    <HiShoppingBag size={28} className="text-primary-500 dark:text-primary-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 dark:text-white leading-tight">
                    {t('hero_slides.slide3_line1')} {t('hero_slides.slide3_line2')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {t('hero_slides.slide3_subline')}
                  </p>
                </div>
                <Link to="/signup" className="flex-shrink-0">
                  <div className="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors text-center whitespace-nowrap flex items-center gap-1">
                    {t('hero_slides.slide3_cta')}
                    <HiArrowRight size={12} />
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  )
}

export default Home