import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ErrorBoundary from './components/ErrorBoundary'
import RouteLoader from './components/RouteLoader'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Store = lazy(() => import('./pages/Store'))
const Categories = lazy(() => import('./pages/Categories'))
const CategorySingle = lazy(() => import('./pages/CategorySingle'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const SeedPage = lazy(() => import('./pages/SeedPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AnalyticsTest = lazy(() => import('./pages/AnalyticsTest'))

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* All routes with layout (including login/signup) */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="categories" element={<Categories />} />
                <Route path="category/:id" element={<CategorySingle />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="store/:userId" element={<Store />} />
                
                {/* Protected route */}
                <Route
                  path="dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
              </Route>

              {/* Dev only - no layout */}
              {import.meta.env.DEV && <Route path="seed" element={<SeedPage />} />}
              {import.meta.env.DEV && <Route path="analytics-test" element={<AnalyticsTest />} />}
              
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App