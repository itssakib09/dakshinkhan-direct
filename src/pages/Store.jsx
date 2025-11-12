import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Eye, Star } from 'lucide-react'
import { getStoreListings, getStoreOwner } from '../services/listingService'

function Store() {
  const { userId } = useParams()
  const [owner, setOwner] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadStoreData()
  }, [userId])

  async function loadStoreData() {
    setLoading(true)
    setError(null)

    try {
      const [ownerData, listingsData] = await Promise.all([
        getStoreOwner(userId),
        getStoreListings(userId)
      ])

      if (!ownerData) {
        setError('Store not found')
        return
      }

      setOwner(ownerData)
      setListings(listingsData)
    } catch (err) {
      console.error('Error loading store:', err)
      setError('Failed to load store')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">Go Home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Store Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {owner.photoURL ? (
              <img 
                src={owner.photoURL} 
                alt={owner.displayName}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {owner.displayName?.charAt(0) || 'S'}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {owner.displayName}'s Store
            </h1>
            <p className="text-gray-600 mb-4 capitalize">
              {owner.role} • Member since {new Date(owner.createdAt?.toDate?.() || Date.now()).getFullYear()}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              {owner.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-600" />
                  <a href={`tel:${owner.phone}`} className="hover:text-blue-600">
                    {owner.phone}
                  </a>
                </div>
              )}
              {owner.email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-600" />
                  <a href={`mailto:${owner.email}`} className="hover:text-blue-600">
                    {owner.email}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Available Listings ({listings.length})
        </h2>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No active listings yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map(listing => (
            <div 
              key={listing.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="h-48 bg-gray-200">
                {listing.images?.[0] ? (
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {listing.title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {listing.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      ৳{listing.price}
                    </span>
                    <span className="text-sm text-gray-500">/{listing.unit}</span>
                  </div>
                  
                  {listing.rating > 0 && (
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <Star size={16} fill="currentColor" />
                      <span className="font-medium">{listing.rating}</span>
                      <span className="text-gray-500">({listing.reviewCount})</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span>{listing.views || 0} views</span>
                  </div>
                  <span className="capitalize">{listing.category}</span>
                </div>

                {listing.address && (
                  <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{listing.address}</span>
                  </div>
                )}

                {/* Contact Buttons */}
                <div className="flex gap-2">
                  <a
                    href={`tel:${listing.phone}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-lg font-medium transition"
                  >
                    Call Now
                  </a>
                  {listing.email && (
                    <a
                      href={`mailto:${listing.email}`}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-center py-2 rounded-lg font-medium transition"
                    >
                      Email
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Store