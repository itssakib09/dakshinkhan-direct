// Performance monitoring utilities

export function logPageLoad() {
  if (typeof window === 'undefined') return

  window.addEventListener('load', () => {
    const perfData = window.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    
    if (import.meta.env.DEV) {
      console.log('📊 Page Load Time:', pageLoadTime + 'ms')
    }

    // Send to analytics service in production
    if (import.meta.env.PROD && pageLoadTime > 1500) {
      console.warn('⚠️ Slow page load detected:', pageLoadTime + 'ms')
    }
  })
}

export function logComponentRender(componentName, duration) {
  if (import.meta.env.DEV && duration > 100) {
    console.warn(`⚠️ Slow render: ${componentName} took ${duration}ms`)
  }
}

// Track errors
export function logError(error, errorInfo) {
  if (import.meta.env.PROD) {
    // Send to error tracking service (Sentry, LogRocket, etc.)
    console.error('Error:', error, errorInfo)
  }
}

// Track user actions
export function trackEvent(eventName, data = {}) {
  if (import.meta.env.DEV) {
    console.log('📈 Event:', eventName, data)
  }

  // Send to analytics service in production
  // Example: Google Analytics, Mixpanel, etc.
}