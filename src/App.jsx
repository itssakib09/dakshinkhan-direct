// src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LocationProvider } from './context/LocationContext'
import { SearchProvider } from './context/SearchContext'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import ProtectedRoute from './components/PrivateRoute'
import PageTransition from './components/PageTransition'
import AdminRoute from './components/admin/AdminRoute'
import AdminLayout from './layouts/AdminLayout'

// Lazy load pages
import { lazy, Suspense } from 'react'
import SkeletonCard from './components/SkeletonCard'

const Home = lazy(() => import('./pages/Home'))
const Categories = lazy(() => import('./pages/Categories'))
const CategorySingle = lazy(() => import('./pages/CategorySingle'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const BusinessSetupWizard = lazy(() => import('./pages/BusinessSetupWizard'))
const Store = lazy(() => import('./pages/Store'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const ComponentDemo = lazy(() => import('./pages/ComponentDemo'))
const SeedPage = lazy(() => import('./pages/SeedPage'))
const Locations = lazy(() => import('./pages/Locations'))
const Search = lazy(() => import('./pages/Search'))
const ServiceProviderSetupWizard = lazy(() => import('./pages/ServiceProviderSetupWizard'))
const Business = lazy(() => import('./pages/Business'))
const Services = lazy(() => import('./pages/Services'))
const ServiceProvider = lazy(() => import('./pages/ServiceProvider'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminBusinesses = lazy(() => import('./pages/admin/AdminBusinesses'))
const AdminServiceProviders = lazy(() => import('./pages/admin/AdminServiceProviders'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminVerification = lazy(() => import('./pages/admin/AdminVerification'))
const AdminCatalog = lazy(() => import('./pages/admin/AdminCatalog'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminLocations = lazy(() => import('./pages/admin/AdminLocations'))
const AdminSponsoredAds = lazy(() => import('./pages/admin/AdminSponsoredAds'))
const AdminAuditLogs = lazy(() => import('./pages/admin/AdminAuditLogs'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Home /></PageTransition>
            </Suspense>
          } />
          <Route path="categories" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Categories /></PageTransition>
            </Suspense>
          } />
          <Route path="categories/:slug" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><CategorySingle /></PageTransition>
            </Suspense>
          } />
          <Route path="store/:id" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Store /></PageTransition>
            </Suspense>
          } />
          <Route path="search" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Search /></PageTransition>
            </Suspense>
          } />
          <Route path="business" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Business /></PageTransition>
            </Suspense>
          } />
          <Route path="services" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Services /></PageTransition>
            </Suspense>
          } />
          <Route path="service-provider/:id" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><ServiceProvider /></PageTransition>
            </Suspense>
          } />
          <Route path="login" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Login /></PageTransition>
            </Suspense>
          } />
          <Route path="signup" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Signup /></PageTransition>
            </Suspense>
          } />
          <Route path="about" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><About /></PageTransition>
            </Suspense>
          } />
          <Route path="contact" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Contact /></PageTransition>
            </Suspense>
          } />
          <Route path="components" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><ComponentDemo /></PageTransition>
            </Suspense>
          } />
          <Route path="/seed" element={
            <ProtectedRoute requireAdmin={true}>
              <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
                <PageTransition><SeedPage /></PageTransition>
              </Suspense>
            </ProtectedRoute>
          } />
          <Route path="locations" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><Locations /></PageTransition>
            </Suspense>
          } />
          
          {/* Protected Routes */}
          <Route
            path="business-setup"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
                  <PageTransition><BusinessSetupWizard /></PageTransition>
                </Suspense>
              </ProtectedRoute>
            }
          />

          <Route
  path="service-setup"
  element={
    <ProtectedRoute>
      <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
        <PageTransition><ServiceProviderSetupWizard /></PageTransition>
      </Suspense>
    </ProtectedRoute>
  }
/>  

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
                  <PageTransition><Dashboard /></PageTransition>
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><NotFound /></PageTransition>
            </Suspense>
          } />
        </Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route
            index
            element={
              <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route path="businesses" element={<Suspense fallback={<div className="p-6"><SkeletonCard /></div>}><AdminBusinesses /></Suspense>} />
          <Route path="providers" element={<Suspense fallback={<div className="p-6"><SkeletonCard /></div>}><AdminServiceProviders /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<div className="p-6"><SkeletonCard /></div>}><AdminUsers /></Suspense>} />
          <Route path="verification" element={<Suspense fallback={<div className="p-6"><SkeletonCard /></div>}><AdminVerification /></Suspense>} />
          <Route path="catalog" element={<Suspense fallback={<div className="p-6"><SkeletonCard /></div>}><AdminCatalog /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<div className="p-6"><SkeletonCard /></div>}><AdminCategories /></Suspense>} />
          <Route path="locations" element={<Suspense fallback={<div className="p-6"><SkeletonCard /></div>}><AdminLocations /></Suspense>} />
          <Route path="ads" element={<Suspense fallback={<div className="p-6"><SkeletonCard /></div>}><AdminSponsoredAds /></Suspense>} />
          <Route path="logs" element={<Suspense fallback={<div className="p-6"><SkeletonCard /></div>}><AdminAuditLogs /></Suspense>} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LocationProvider>
          <SearchProvider>
            <BrowserRouter>
              <ScrollToTop />
              <AnimatedRoutes />
            </BrowserRouter>
          </SearchProvider>
        </LocationProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App