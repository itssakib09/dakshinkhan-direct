import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { uploadMultipleImages } from '../../utils/uploadImage'
import { getCategories, getCatalogProducts } from '../../services/catalogService'
import { createListing } from '../../services/listingService'
import { Package, Image as ImageIcon, Upload, X, CheckCircle } from 'lucide-react'

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
      const categoriesData = await getCategories()
      setCategories(categoriesData)
      
      const productsData = await getCatalogProducts()
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
  
  function validateFile(file) {
    const maxSize = 5 * 1024 * 1024
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
  
  function processFiles(files) {
    const fileArray = Array.from(files)
    
    const remainingSlots = 5 - imageFiles.length
    const filesToAdd = fileArray.slice(0, remainingSlots)
    
    if (fileArray.length > remainingSlots) {
      setError(`Maximum 5 images allowed. Only adding first ${remainingSlots}.`)
    }
    
    const allErrors = []
    filesToAdd.forEach(file => {
      const errors = validateFile(file)
      allErrors.push(...errors)
    })
    
    if (allErrors.length > 0) {
      setError(allErrors.join('\n'))
      return
    }
    
    const newFiles = [...imageFiles, ...filesToAdd]
    setImageFiles(newFiles)
    setUploadProgress([...uploadProgress, ...new Array(filesToAdd.length).fill(0)])
    
    const newPreviews = filesToAdd.map(file => ({
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }))
    setImagePreviews([...imagePreviews, ...newPreviews])
    setError(null)
  }
  
  function handleImageChange(e) {
    if (e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }
  
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
  
  function removeImage(index) {
    URL.revokeObjectURL(imagePreviews[index].url)
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
    setUploadProgress(prev => prev.filter((_, i) => i !== index))
  }
  
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }
  
  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (!formData.title.trim()) throw new Error('Title is required')
      if (!formData.category) throw new Error('Category is required')
      if (!formData.price || parseFloat(formData.price) < 0) throw new Error('Valid price is required')
      if (imageFiles.length === 0) throw new Error('Please upload at least one image')
      
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
        featured: false
      }
      
      await createListing(listingData)
      
      if (onSuccess) onSuccess()
      
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
  
  if (catalogLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary-600 dark:border-primary-400 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading catalog...</p>
          </div>
        </div>
      </motion.div>
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Package className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Add New Listing</h2>
            <p className="text-primary-100 text-sm">Create your product listing</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Mode Toggle */}
        <div className="flex gap-3 mb-6">
          {['catalog', 'custom'].map((m) => (
            <motion.button
              key={m}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMode(m)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                mode === m
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {m === 'catalog' ? '📦 Add from Catalog' : '✏️ Custom Listing'}
            </motion.button>
          ))}
        </div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-400 whitespace-pre-line"
          >
            <strong>Error:</strong> {error}
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Catalog Mode */}
          {mode === 'catalog' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                  Category * ({categories.length} available)
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value, catalogProductId: '' }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
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
                  <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                    Select Product * ({filteredProducts.length} found)
                  </label>
                  <select
                    value={formData.catalogProductId}
                    onChange={(e) => handleProductSelect(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
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
          
          {/* Custom Mode */}
          {mode === 'custom' && (
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
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
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Title * (পণ্য/সেবার নাম)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Fresh Vegetables or Electronic Product"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              required
              maxLength={100}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Description (বিবরণ)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your product..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Price * (দাম)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="৳ 0"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Unit (একক)</label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              >
                <option value="piece">Piece (পিস)</option>
                <option value="kg">Kilogram (কেজি)</option>
                <option value="liter">Liter (লিটার)</option>
                <option value="dozen">Dozen (ডজন)</option>
                <option value="service">Service (সেবা)</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Phone * (ফোন)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+8801XXXXXXXXX"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Email (ইমেইল)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="electronics, gadget, popular"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all"
            />
          </div>
          
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
              Images * (Max 5, JPG/PNG/WebP, max 5MB each)
            </label>
            
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                isDragging
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
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
              
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isDragging ? 1.05 : 1 }}
                className="flex flex-col items-center"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                  isDragging ? 'bg-primary-100 dark:bg-primary-900/30' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {isDragging ? <Upload className="text-primary-600 dark:text-primary-400" size={32} /> : <ImageIcon className="text-gray-400" size={32} />}
                </div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {imageFiles.length >= 5
                    ? 'Maximum 5 images reached'
                    : isDragging ? 'Drop images here' : 'Drag & drop images here or click to browse'}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {5 - imageFiles.length} slot{5 - imageFiles.length !== 1 ? 's' : ''} remaining
                </p>
              </motion.div>
            </div>
            
            {imagePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
                      <img
                        src={preview.url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeImage(index)}
                      disabled={loading}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all z-10"
                      title="Remove image"
                    >
                      <X size={16} />
                    </motion.button>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="truncate font-medium">{preview.name}</p>
                      <p className="text-gray-300">{formatFileSize(preview.size)}</p>
                    </div>
                    
                    {loading && (
                      <>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${uploadProgress[index] || 0}%` }}
                            className="h-full bg-gradient-to-r from-green-500 to-green-600"
                          />
                        </div>
                        {uploadProgress[index] === 100 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl"
                          >
                            <CheckCircle size={20} />
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
            
            {loading && imageFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-blue-800 dark:text-blue-400">
                    Uploading images...
                  </span>
                  <span className="text-sm text-blue-600 dark:text-blue-400">
                    {uploadProgress.filter(p => p === 100).length}/{imageFiles.length} complete
                  </span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-900/50 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${uploadProgress.reduce((sum, p) => sum + p, 0) / imageFiles.length}%`
                    }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 h-2 rounded-full transition-all"
                  />
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: loading || imageFiles.length === 0 ? 1 : 1.02 }}
            whileTap={{ scale: loading || imageFiles.length === 0 ? 1 : 0.98 }}
            disabled={loading || imageFiles.length === 0}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Listing...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                ✅ Create Listing
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}

export default AddListingForm