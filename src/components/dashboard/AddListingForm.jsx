import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { uploadMultipleImages } from '../../utils/uploadImage'

function AddListingForm({ onSuccess }) {
  const { currentUser } = useAuth()
  
  const [mode, setMode] = useState('catalog')
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  
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
  
  // Enhanced image state
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploadProgress, setUploadProgress] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [catalogLoading, setCatalogLoading] = useState(true)
  
  useEffect(() => {
    loadCatalogData()
  }, [])
  
  async function loadCatalogData() {
    setCatalogLoading(true)
    try {
      const categoriesSnap = await getDocs(collection(db, 'catalog'))
      const categoriesData = categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setCategories(categoriesData)
      
      const productsSnap = await getDocs(collection(db, 'catalogProducts'))
      const productsData = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setProducts(productsData)
      
      if (categoriesData.length === 0) {
        setError('No categories found. Please run seed first.')
      }
    } catch (err) {
      setError(`Failed to load catalog: ${err.message}`)
    } finally {
      setCatalogLoading(false)
    }
  }
  
  useEffect(() => {
    if (formData.category && products.length > 0) {
      const filtered = products.filter(p => p.category === formData.category)
      setFilteredProducts(filtered)
    } else {
      setFilteredProducts([])
    }
  }, [formData.category, products])
  
  function handleProductSelect(productId) {
    const product = products.find(p => p.id === productId)
    if (product) {
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
  
  // ========== ENHANCED IMAGE HANDLING ==========
  
  // Validate single file
  function validateFile(file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    
    const errors = []
    
    if (!allowedTypes.includes(file.type)) {
      errors.push(`${file.name}: Invalid type (only JPG/PNG/WebP allowed)`)
    }
    
    if (file.size > maxSize) {
      errors.push(`${file.name}: Too large (max 5MB, got ${(file.size / 1024 / 1024).toFixed(2)}MB)`)
    }
    
    return errors
  }
  
  // Process files (from input or drag-drop)
  function processFiles(files) {
    const fileArray = Array.from(files)
    
    // Limit to 5 total
    const remainingSlots = 5 - imageFiles.length
    const filesToAdd = fileArray.slice(0, remainingSlots)
    
    if (fileArray.length > remainingSlots) {
      setError(`Maximum 5 images allowed. Only adding first ${remainingSlots}.`)
    }
    
    // Validate all files
    const allErrors = []
    filesToAdd.forEach(file => {
      const errors = validateFile(file)
      allErrors.push(...errors)
    })
    
    if (allErrors.length > 0) {
      setError(allErrors.join('\n'))
      return
    }
    
    // Add files
    const newFiles = [...imageFiles, ...filesToAdd]
    setImageFiles(newFiles)
    setUploadProgress([...uploadProgress, ...new Array(filesToAdd.length).fill(0)])
    
    // Generate previews
    const newPreviews = filesToAdd.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }))
    setImagePreviews([...imagePreviews, ...newPreviews])
    setError(null)
  }
  
  // Handle file input change
  function handleImageChange(e) {
    if (e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }
  
  // Drag & drop handlers
  function handleDragEnter(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  
  function handleDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }
  
  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
  }
  
  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }
  
  // Remove single image
  function removeImage(index) {
    URL.revokeObjectURL(imagePreviews[index].url)
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setUploadProgress(prev => prev.filter((_, i) => i !== index))
  }
  
  // Format file size
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }
  
  // ========== FORM SUBMIT ==========
  
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (!formData.title.trim()) throw new Error('Title is required')
      if (!formData.category) throw new Error('Category is required')
      if (!formData.price || parseFloat(formData.price) < 0) throw new Error('Valid price is required')
      if (imageFiles.length === 0) throw new Error('Please upload at least one image')
      
      // Upload images with progress tracking
      const imageURLs = await uploadMultipleImages(
        imageFiles,
        `listings/${currentUser.uid}/`,
        (index, progress) => {
          setUploadProgress(prev => {
            const newProgress = [...prev]
            newProgress[index] = Math.round(progress)
            return newProgress
          })
        }
      )
      
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
      
      await addDoc(collection(db, 'listings'), listingData)
      
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
      
      // Clear images and revoke URLs
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview.url))
      setImageFiles([])
      setImagePreviews([])
      setUploadProgress([])
      
      alert('✅ Listing created successfully! Pending admin approval.')
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  // ========== RENDER ==========
  
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
          onClick={() => setMode('catalog')}
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
          onClick={() => setMode('custom')}
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
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 whitespace-pre-line">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Catalog/Custom Mode Fields */}
        {mode === 'catalog' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category * ({categories.length} available)
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, catalogProductId: '' }))}
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
          </div>
        )}
        
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
        
        {/* ========== ENHANCED IMAGE UPLOAD ========== */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Images * (Max 5, JPG/PNG/WebP, max 5MB each)
          </label>
          
          {/* Drag & Drop Zone */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            } ${imageFiles.length >= 5 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => imageFiles.length < 5 && document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              className="hidden"
              disabled={imageFiles.length >= 5}
            />
            
            <div className="flex flex-col items-center">
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600 font-medium">
                {imageFiles.length >= 5
                  ? 'Maximum 5 images reached'
                  : 'Drag & drop images here or click to browse'}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {5 - imageFiles.length} slot{5 - imageFiles.length !== 1 ? 's' : ''} remaining
              </p>
            </div>
          </div>
          
          {/* Image Previews with Progress */}
          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                    <img
                      src={preview.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Remove image"
                  >
                    ×
                  </button>
                  
                  {/* File info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1.5 opacity-0 group-hover:opacity-100 transition">
                    <p className="truncate">{preview.name}</p>
                    <p className="text-gray-300">{formatFileSize(preview.size)}</p>
                  </div>
                  
                  {/* Upload progress bar */}
                  {loading && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-green-500 transition-all duration-300"
                        style={{ width: `${uploadProgress[index] || 0}%` }}
                      />
                    </div>
                  )}
                  
                  {/* Upload status indicator */}
                  {loading && uploadProgress[index] === 100 && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Overall upload progress */}
          {loading && imageFiles.length > 0 && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  Uploading images...
                </span>
                <span className="text-sm text-blue-600">
                  {uploadProgress.filter(p => p === 100).length}/{imageFiles.length} complete
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      uploadProgress.reduce((sum, p) => sum + p, 0) / imageFiles.length
                    }%`
                  }}
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || imageFiles.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Listing...
            </>
          ) : (
            '✅ Create Listing'
          )}
        </button>
      </form>
    </div>
  )
}

export default AddListingForm