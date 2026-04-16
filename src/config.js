// Central app configuration
// All service files must import USE_API and API_URL from here
// Never read import.meta.env directly in service files
export const USE_API = import.meta.env.VITE_USE_API === 'true'
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'