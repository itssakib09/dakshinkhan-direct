import { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext()

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider')
  }
  return context
}

export function LocationProvider({ children }) {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [previousPage, setPreviousPage] = useState('/')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Load location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('dakshinkhan_location')
    if (savedLocation) {
      try {
        setSelectedLocation(JSON.parse(savedLocation))
      } catch (error) {
        console.error('Failed to parse saved location:', error)
        localStorage.removeItem('dakshinkhan_location')
      }
    }
  }, [])

  // Save location to localStorage whenever it changes
  const saveLocation = (location) => {
    setSelectedLocation(location)
    localStorage.setItem('dakshinkhan_location', JSON.stringify(location))
    
    // Show notification
    setNotificationMessage(`Location Changed To ${location}`)
    setShowNotification(true)
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const clearLocation = () => {
    setSelectedLocation(null)
    localStorage.removeItem('dakshinkhan_location')
  }

  const savePreviousPage = (page) => {
    setPreviousPage(page)
  }

  const hideNotification = () => {
    setShowNotification(false)
  }

  const value = {
    selectedLocation,
    saveLocation,
    clearLocation,
    previousPage,
    savePreviousPage,
    showNotification,
    notificationMessage,
    hideNotification
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}