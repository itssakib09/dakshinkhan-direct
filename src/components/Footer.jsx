import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi'

function Footer() {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  ]

  const quickLinks = [
    { name: 'Browse Categories', path: '/categories' },
    { name: 'Featured Businesses', path: '/featured' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ]

  return (
    <footer className="hidden lg:block relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-300">
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 mb-6 sm:mb-8">
          
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-primary-500 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-5 h-5 sm:w-7 sm:h-7 text-primary-600 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">Dakshinkhan</h3>
                <p className="text-xs font-medium text-primary-300 tracking-wider">DIRECT</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-primary-100/80 leading-relaxed">
              Your trusted local business directory connecting residents with 
              shops, services, and opportunities in Dakshinkhan.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-2 sm:gap-3 pt-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="text-white" size={16} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-primary-400 rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-2.5">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-xs sm:text-sm text-primary-100/80 hover:text-white hover:translate-x-1 inline-block transition-all duration-300"
                  >
                    → {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-primary-400 rounded-full"></span>
              Contact Us
            </h4>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-primary-100/80 hover:text-white transition-colors group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <HiPhone size={16} className="text-primary-300" />
                </div>
                <span className="break-all">+880 123-456-7890</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-primary-100/80 hover:text-white transition-colors group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <HiMail size={16} className="text-primary-300" />
                </div>
                <span className="break-all">info@dakshinkhan.direct</span>
              </div>
              <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-primary-100/80 hover:text-white transition-colors group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors flex-shrink-0">
                  <HiLocationMarker size={16} className="text-primary-300" />
                </div>
                <span>Dakshinkhan, Dhaka<br />Bangladesh</span>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-5 sm:h-6 bg-primary-400 rounded-full"></span>
              Newsletter
            </h4>
            <p className="text-xs sm:text-sm text-primary-100/80 mb-3 sm:mb-4">
              Subscribe to get updates on new businesses and offers.
            </p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg sm:rounded-xl text-white placeholder-primary-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all text-xs sm:text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 sm:px-5 py-2 sm:py-2.5 bg-white hover:bg-primary-50 text-primary-700 font-semibold rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 text-xs sm:text-sm"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-primary-100/60 text-center sm:text-left">
              © {currentYear} Dakshinkhan Direct. All rights reserved.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-primary-100/60">
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer