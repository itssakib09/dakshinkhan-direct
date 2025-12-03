import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

const USE_API = import.meta.env.VITE_USE_API === 'true'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/**
 * Get all categories from catalog
 */
export async function getCategories() {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/catalog/categories`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  try {
    const categoriesSnap = await getDocs(collection(db, 'catalog'))
    return categoriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw error
  }
}

/**
 * Get all catalog products
 */
export async function getCatalogProducts() {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/catalog/products`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  try {
    const productsSnap = await getDocs(collection(db, 'catalogProducts'))
    return productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching catalog products:', error)
    throw error
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(categoryId) {
  if (USE_API) {
    try {
      const token = localStorage.getItem('token') || ''
      const res = await fetch(`${API_URL}/catalog/products?category=${categoryId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error(await res.text())
      return await res.json()
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  try {
    const productsSnap = await getDocs(collection(db, 'catalogProducts'))
    const allProducts = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return allProducts.filter(p => p.category === categoryId)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    throw error
  }
}