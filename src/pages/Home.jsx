import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { 
  HiLocationMarker, 
  HiShoppingBag, 
  HiUsers, 
  HiStar, 
  HiClock, 
  HiArrowRight,
  HiSparkles
} from 'react-icons/hi'
import { useLocation } from '../context/LocationContext'
import { useEffect, useState } from 'react'

function Home() {
  const navigate = useNavigate()
  const { selectedLocation } = useLocation()
  const [displayLocation, setDisplayLocation] = useState('Select Your Area')
  
  useEffect(() => {
    if (selectedLocation) {
      setDisplayLocation(selectedLocation)
    } else {
      setDisplayLocation('Select Your Area')
    }
  }, [selectedLocation])
  
  const businessCategories = [
    { id: 'food', name: 'Food', icon: '🍽️' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'salon', name: 'Salon', icon: '✂️' },
    { id: 'health', name: 'Health', icon: '❤️' },
  ]

  const serviceCategories = [
    { id: 'plumbing', name: 'Plumbing', icon: '🔧' },
    { id: 'electrical', name: 'Electrical', icon: '⚡' },
    { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
    { id: 'repair', name: 'Repair', icon: '🛠️' },
  ]

  const featuredBusinesses = [
    {
      id: 1,
      name: 'Golden Spoon Restaurant',
      category: 'Traditional & Modern Cuisine',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=400&fit=crop',
      rating: 4.8,
      distance: '2.5 km',
      status: 'Open Now',
      reviews: 234
    },
    {
      id: 2,
      name: 'Fashion Hub Store',
      category: 'Clothing & Accessories',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
      rating: 4.6,
      distance: '1.8 km',
      status: 'Open Now',
      reviews: 189
    }
  ]

  const featuredServices = [
    {
      id: 1,
      name: 'Expert Plumbing Solutions',
      category: 'Residential & Commercial',
      image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=400&fit=crop',
      rating: 4.9,
      distance: '1.2 km',
      status: 'Available',
      reviews: 156
    },
    {
      id: 2,
      name: 'Quick Home Repairs',
      category: 'All Types of Repairs',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=400&fit=crop',
      rating: 4.7,
      distance: '3.1 km',
      status: 'Available',
      reviews: 98
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 lg:pb-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Hero Location Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-4 sm:py-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 space-y-4 sm:space-y-5 border border-gray-100 dark:border-gray-700">
            
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
                Where Are You Located?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Choose your area to discover amazing shops & services
              </p>
            </div>
            
            <button 
              onClick={() => navigate('/locations')}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl py-4 sm:py-5 px-4 flex items-center justify-between shadow-lg transition-all"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <HiLocationMarker className="text-white" size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-primary-100 font-semibold">CURRENT LOCATION</p>
                  <p className="text-sm sm:text-base font-bold">{displayLocation}</p>
                </div>
              </div>
              <HiArrowRight className="text-white flex-shrink-0" size={20} />
            </button>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center space-y-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto">
                  <HiShoppingBag className="text-white" size={24} />
                </div>
                <p className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">1,200+</p>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Businesses</p>
              </div>

              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 text-center space-y-2">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto">
                  <HiUsers className="text-white" size={24} />
                </div>
                <p className="text-xl sm:text-2xl font-black text-gray-800 dark:text-white">50,000+</p>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Active Users</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Premium Ad Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 sm:mb-6"
        >
          <div className="relative bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-2xl shadow-xl p-5 sm:p-6 overflow-hidden">
            <div className="relative z-10 space-y-3">
              <div className="inline-block px-3 py-1.5 bg-white/30 rounded-full">
                <p className="text-xs font-black text-white flex items-center gap-2">
                  <HiSparkles size={14} />
                  PREMIUM
                </p>
              </div>
              
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white mb-1">Sponsored Business</h3>
                <p className="text-xs sm:text-sm text-white/90">Premium Advertisement Space</p>
              </div>
              
              <button className="bg-white text-primary-700 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center space-x-2">
                <span>View Details</span>
                <HiArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Businesses */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 sm:mb-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-800 dark:text-white">Featured Businesses</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Top rated in your area</p>
            </div>
            <button className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1 flex-shrink-0">
              View All
              <HiArrowRight size={14} />
            </button>
          </div>
          
          <div className="w-full overflow-hidden">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
              }}
              className="!pb-12"
            >
              {featuredBusinesses.map((business) => (
                <SwiperSlide key={business.id}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img 
                        src={business.image} 
                        alt={business.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 px-2 py-1.5 rounded-lg">
                        <HiStar className="text-primary-500 fill-primary-500" size={14} />
                        <span className="text-xs font-black text-gray-800 dark:text-white">{business.rating}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({business.reviews})</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div>
                        <h4 className="font-black text-base text-gray-900 dark:text-white truncate">{business.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{business.category}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center space-x-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg flex-shrink-0">
                          <HiLocationMarker size={12} className="text-primary-600 dark:text-primary-400" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{business.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg flex-shrink-0">
                          <HiClock size={12} className="text-primary-600 dark:text-primary-400" />
                          <span className="font-semibold text-primary-700 dark:text-primary-400">{business.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>

        {/* Featured Services */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-4 sm:mb-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-800 dark:text-white">Featured Services</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Trusted service providers</p>
            </div>
            <button className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1 flex-shrink-0">
              View All
              <HiArrowRight size={14} />
            </button>
          </div>
          
          <div className="w-full overflow-hidden">
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 2 },
              }}
              className="!pb-12"
            >
              {featuredServices.map((service) => (
                <SwiperSlide key={service.id}>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/90 dark:bg-gray-800/90 px-2 py-1.5 rounded-lg">
                        <HiStar className="text-primary-500 fill-primary-500" size={14} />
                        <span className="text-xs font-black text-gray-800 dark:text-white">{service.rating}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({service.reviews})</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div>
                        <h4 className="font-black text-base text-gray-900 dark:text-white truncate">{service.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{service.category}</p>
                      </div>
                      <div className="flex items-center justify-between text-xs gap-2">
                        <div className="flex items-center space-x-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg flex-shrink-0">
                          <HiLocationMarker size={12} className="text-primary-600 dark:text-primary-400" />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{service.distance}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded-lg flex-shrink-0">
                          <HiClock size={12} className="text-primary-600 dark:text-primary-400" />
                          <span className="font-semibold text-primary-700 dark:text-primary-400">{service.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </motion.div>

        {/* Popular Business Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 sm:mb-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-800 dark:text-white">Popular Business Categories</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Browse local shops & stores</p>
            </div>
            <Link to="/business" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1 flex-shrink-0">
              See All
              <HiArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {businessCategories.map((category) => (
              <Link key={category.id} to={`/business/${category.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center space-y-2 shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto text-2xl">
                    {category.icon}
                  </div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{category.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Popular Service Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-4 sm:mb-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-gray-800 dark:text-white">Popular Service Categories</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Find skilled professionals</p>
            </div>
            <Link to="/services" className="text-xs sm:text-sm text-primary-600 dark:text-primary-400 font-bold flex items-center gap-1 flex-shrink-0">
              See All
              <HiArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {serviceCategories.map((category) => (
              <Link key={category.id} to={`/services/${category.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center space-y-2 shadow-lg border border-gray-100 dark:border-gray-700 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center mx-auto text-2xl">
                    {category.icon}
                  </div>
                  <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{category.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default Home