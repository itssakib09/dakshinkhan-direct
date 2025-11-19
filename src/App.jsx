import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import ProtectedRoute from './components/PrivateRoute'
import PageTransition from './components/PageTransition'

// Lazy load pages
import { lazy, Suspense } from 'react'
import SkeletonCard from './components/SkeletonCard'

const Home = lazy(() => import('./pages/Home'))
const Categories = lazy(() => import('./pages/Categories'))
const CategorySingle = lazy(() => import('./pages/CategorySingle'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Store = lazy(() => import('./pages/Store'))
const Admin = lazy(() => import('./pages/Admin'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const ComponentDemo = lazy(() => import('./pages/ComponentDemo'))
const SeedPage = lazy(() => import('./pages/SeedPage'))

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
            <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
              <PageTransition><SeedPage /></PageTransition>
            </Suspense>
          } />
          
          {/* Protected Routes */}
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
          <Route
            path="admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Suspense fallback={<div className="p-6"><SkeletonCard /></div>}>
                  <PageTransition><Admin /></PageTransition>
                </Suspense>
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App