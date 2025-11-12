import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { uploadMultipleImages } from '../../utils/uploadImage'

function AddListingForm({ onSuccess }) {
  const { currentUser } = useAuth()
  
  // Form mode
  const [mode, setMode] = useState('catalog')
  
  // Catalog data
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    unit: 'piece',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: '',
    tags: '',
    catalogProductId: ''
  })
  
  // Images
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploadProgress, setUploadProgress] = useState([])
  
  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [catalogLoading, setCatalogLoading] = useState(true)
  
  // Load categories and products on mount
  useEffect(() => {
    loadCatalogData()
  }, [])
  
  async function loadCatalogData() {
    console.log('📦 Loading catalog data...')
    setCatalogLoading(true)
    
    try {
      // Load categories
      const categoriesSnap = await getDocs(collection(db, 'catalog'))
      const categoriesData = categoriesSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))
      
      console.log('✅ Categories loaded:', categoriesData.length)
      setCategories(categoriesData)
      
      // Load products
      const productsSnap = await getDocs(collection(db, 'catalogProducts'))
      const productsData = productsSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }))
      
      console.log('✅ Products loaded:', productsData.length)
      setProducts(productsData)
      
      if (categoriesData.length === 0) {
        setError('No categories found. Please run seed first.')
      }
      
    } catch (err) {
      console.error('❌ Error loading catalog:', err)
      setError(`Failed to load catalog: ${err.message}`)
    } finally {
      setCatalogLoading(false)
    }
  }
  
  // Filter products by selected category
  useEffect(() => {
    if (formData.category && products.length > 0) {
      const filtered = products.filter(p => p.category === formData.category)
      console.log(`🔍 Filtered products for ${formData.category}:`, filtered.length)
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [formData.category, products])
  
  // Auto-fill from catalog product
  function handleProductSelect(productId) {
    console.log('📋 Product selected:', productId)
    
    const product = products.find(p => p.id === productId)
    
    if (product) {
      console.log('✅ Auto-filling form with:', product.name)
      
      setFormData(prev => ({
        ...prev,
        catalogProductId: productId,
        title: product.name,
        description: product.description || '',
        category: product.category,
        subcategory: product.subcategory || '',
        price: product.defaultPrice.toString(),
        unit: product.unit || 'piece',
        tags: product.tags?.join(', ') || ''
      }))
    }
  }
  
  // Handle image selection
  function handleImageChange(e) {
    const files = Array.from(e.target.files).slice(0, 5)
    
    if (files.length === 0) return
    
    // Validation
    const invalidFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
      const isValidSize = file.size <= 5 * 1024 * 1024
      return !isValidType || !isValidSize
    })
    
    if (invalidFiles.length > 0) {
      setError('Some images are invalid (only JPG/PNG/WebP, max 5MB each)')
      return
    }
    
    setImageFiles(files)
    setUploadProgress(new Array(files.length).fill(0))
    
    // Generate previews
    const previews = files.map(file => URL.createObjectURL(file))
    setImagePreviews(previews)
    setError(null)
  }
  
  function removeImage(index) {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setUploadProgress(prev => prev.filter((_, i) => i !== index))
  }
  
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    console.log('🚀 Submitting listing...')
    
    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Title is required')
      }
      
      if (!formData.category) {
        throw new Error('Category is required')
      }
      
      if (!formData.price || parseFloat(formData.price) < 0) {
        throw new Error('Valid price is required')
      }
      
      if (imageFiles.length === 0) {
        throw new Error('Please upload at least one image')
      }
      
      console.log('📤 Uploading images...')
      
      // Upload images
      const imageURLs = await uploadMultipleImages(
        imageFiles,
        `listings/${currentUser.uid}/`,
        (index, progress) => {
          setUploadProgress(prev => {
            const newProgress = [...prev]
            newProgress[index] = progress
            return newProgress
          })
        }
      )
      
      console.log('✅ Images uploaded:', imageURLs.length)
      
      // Create listing document
      const listingData = {
        ownerId: currentUser.uid,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        subcategory: formData.subcategory || '',
        price: parseFloat(formData.price),
        unit: formData.unit,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        images: imageURLs,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        catalogProductId: formData.catalogProductId || null,
        status: 'pending',
        views: 0,
        rating: 0,
        reviewCount: 0,
        verified: false,
        featured: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      console.log('💾 Saving to Firestore...')
      
      await addDoc(collection(db, 'listings'), listingData)
      
      console.log('✅ Listing created successfully!')
      
      // Success callback
      if (onSuccess) onSuccess()
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        subcategory: '',
        price: '',
        unit: 'piece',
        phone: currentUser?.phone || '',
        email: currentUser?.email || '',
        address: '',
        tags: '',
        catalogProductId: ''
      })
      setImageFiles([])
      setImagePreviews([])
      setUploadProgress([])
      
      alert('✅ Listing created successfully! Pending admin approval.')
      
    } catch (err) {
      console.error('❌ Error creating listing:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Render loading state
  if (catalogLoading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading catalog...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Add New Listing</h2>
      
      {/* Mode Toggle */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => {
            console.log('🔄 Switching to catalog mode')
            setMode('catalog')
          }}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
            mode === 'catalog'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📦 Add from Catalog
        </button>
        <button
          type="button"
          onClick={() => {
            console.log('🔄 Switching to custom mode')
            setMode('custom')
          }}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
            mode === 'custom'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          ✏️ Custom Listing
        </button>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Catalog Mode: Product Selection */}
        {mode === 'catalog' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category * ({categories.length} available)
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  console.log('📂 Category selected:', e.target.value)
                  setFormData(prev => ({ 
                    ...prev, 
                    category: e.target.value, 
                    catalogProductId: '' 
                  }))
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name} ({cat.name_bn})
                  </option>
                ))}
              </select>
            </div>
            
            {filteredProducts.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Product * ({filteredProducts.length} found)
                </label>
                <select
                  value={formData.catalogProductId}
                  onChange={(e) => handleProductSelect(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Choose a product</option>
                  {filteredProducts.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} ({product.name_bn}) - ৳{product.defaultPrice}/{product.unit}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {formData.category && filteredProducts.length === 0 && (
              <p className="text-sm text-amber-600">
                No products found for this category. Switch to "Custom Listing" mode.
              </p>
            )}
          </div>
        )}
        
        {/* Custom Mode: Category Selection */}
        {mode === 'custom' && (
          <div>
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Common Fields */}
        <div>
          <label className="block text-sm font-medium mb-2">Title * (পণ্য/সেবার নাম)</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Napa 500mg or Fresh Vegetables"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
            maxLength={100}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description (বিবরণ)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your product or service..."
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price * (দাম)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              placeholder="৳ 0"
              min="0"
              step="0.01"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Unit (একক)</label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="piece">Piece (পিস)</option>
              <option value="kg">Kilogram (কেজি)</option>
              <option value="liter">Liter (লিটার)</option>
              <option value="dozen">Dozen (ডজন)</option>
              <option value="service">Service (সেবা)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Address * (ঠিকানা)</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="House/Shop no., Road, Dakshinkhan, Dhaka"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phone * (ফোন)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+8801XXXXXXXXX"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Email (ইমেইল)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="your@email.com"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="medicine, health, emergency"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Images * (Max 5, JPG/PNG/WebP, max 5MB each)
          </label>
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          
          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  >
                    ×
                  </button>
                  {loading && uploadProgress[index] > 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-500 h-1">
                      <div
                        className="bg-green-500 h-full transition-all"
                        style={{ width: `${uploadProgress[index]}%` }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? 'Creating Listing...' : '✅ Create Listing'}
        </button>
      </form>
    </div>
  )
}

export default AddListingForm