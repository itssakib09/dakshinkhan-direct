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
 const [selectedLocation, setSelectedLocation] = useState('ALL Areas')
  const [previousPage, setPreviousPage] = useState('/')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Load location from localStorage on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('dakshinkhan_location')
if (savedLocation) {
  setSelectedLocation(savedLocation)
}

  }, [])

  // Save location to localStorage whenever it changes
  const saveLocation = (location) => {
  setSelectedLocation(location)
  localStorage.setItem('dakshinkhan_location', location)
  
    // Show notification
    setNotificationMessage(
    location === 'ALL Areas'
      ? 'Showing all areas'
      : `Location Changed To ${location}`
  )
  setShowNotification(true)
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false)
    }, 3000)
  }

  const clearLocation = () => {
  setSelectedLocation('ALL Areas')
  localStorage.setItem('dakshinkhan_location', 'ALL Areas')
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