import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../firebase/config'

/**
 * Upload single image to Firebase Storage
 * @param {File} file - Image file
 * @param {string} path - Storage path (e.g., 'listings/user123/')
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} Download URL
 */
export async function uploadImage(file, path, onProgress) {
  // Validation
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only JPG, PNG, and WebP images are allowed')
  }
  
  if (file.size > maxSize) {
    throw new Error('Image size must be less than 5MB')
  }
  
  // Create unique filename
  const timestamp = Date.now()
  const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
  const storageRef = ref(storage, `${path}${filename}`)
  
  // Upload with progress tracking
  const uploadTask = uploadBytesResumable(storageRef, file)
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        if (onProgress) onProgress(progress)
      },
      (error) => {
        reject(error)
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(downloadURL)
      }
    )
  })
}

/**
 * Upload multiple images
 * @param {FileList|Array} files - Array of image files
 * @param {string} path - Storage path
 * @param {Function} onProgress - Progress callback for each file
 * @returns {Promise<string[]>} Array of download URLs
 */
export async function uploadMultipleImages(files, path, onProgress) {
  const uploadPromises = Array.from(files).map((file, index) => 
    uploadImage(file, path, (progress) => {
      if (onProgress) onProgress(index, progress)
    })
  )
  
  return Promise.all(uploadPromises)
}

/**
 * Delete image from Storage
 * @param {string} imageUrl - Full download URL
 */
export async function deleteImage(imageUrl) {
  try {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}