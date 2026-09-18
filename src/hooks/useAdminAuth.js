// src/hooks/useAdminAuth.js
import { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export function useAdminAuth() {
  const { currentUser, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminRole, setAdminRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      if (authLoading) return
      if (!currentUser) {
        setIsAdmin(false)
        setLoading(false)
        return
      }
      try {
        const adminDoc = await getDoc(doc(db, 'admins', currentUser.uid))
        if (adminDoc.exists()) {
          setIsAdmin(true)
          setAdminRole(adminDoc.data().role || 'admin')
        } else {
          setIsAdmin(false)
        }
      } catch (err) {
        console.error('Admin check failed:', err)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }
    checkAdmin()
  }, [currentUser, authLoading])

  return { isAdmin, adminRole, loading }
}