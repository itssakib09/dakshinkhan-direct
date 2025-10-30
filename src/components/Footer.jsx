import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'

function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-3">Dakshinkhan Direct</h3>
            <p className="text-sm">
              Your trusted local business directory connecting residents with 
              shops, services, and opportunities in Dakshinkhan.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/categories" className="hover:text-white">
                  Browse Categories
                </Link>
              </li>
              <li>
              <Link to="/About" className="hover:text-white">
              About Us
              </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-3">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+880 123-456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@dakshinkhan.direct</span>
              </div>
              <div className="flex gap-3 mt-4">
                <a href="#" className="hover:text-white">
                  <Facebook size={20} />
                </a>
                <a href="#" className="hover:text-white">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm">
          <p>&copy; 2025 Dakshinkhan Direct. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer