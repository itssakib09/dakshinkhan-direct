// src/layouts/AdminLayout.jsx
import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  HiViewGrid, HiOfficeBuilding, HiUserGroup,
  HiUsers, HiBadgeCheck, HiCube, HiTag,
  HiLocationMarker, HiSpeakerphone,
  HiClipboardList, HiMenu, HiX, HiLogout,
  HiChevronLeft, HiChevronRight
} from 'react-icons/hi'

const navItems = [
  { label: 'Dashboard', icon: HiViewGrid, path: '/admin' },
  { label: 'Businesses', icon: HiOfficeBuilding, path: '/admin/businesses' },
  { label: 'Service Providers', icon: HiUserGroup, path: '/admin/providers' },
  { label: 'Users', icon: HiUsers, path: '/admin/users' },
  { label: 'Verification', icon: HiBadgeCheck, path: '/admin/verification' },
  { label: 'Catalog', icon: HiCube, path: '/admin/catalog' },
  { label: 'Categories', icon: HiTag, path: '/admin/categories' },
  { label: 'Locations', icon: HiLocationMarker, path: '/admin/locations' },
  { label: 'Sponsored Ads', icon: HiSpeakerphone, path: '/admin/ads' },
  { label: 'Audit Logs', icon: HiClipboardList, path: '/admin/logs' },
]

function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">

      <aside className={`hidden md:flex md:flex-col
        bg-white dark:bg-gray-800
        border-r border-gray-100 dark:border-gray-700
        transition-all duration-200 flex-shrink-0
        ${sidebarCollapsed ? 'md:w-20' : 'md:w-64'}`}>

        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          {!sidebarCollapsed && (
            <span className="font-black text-lg text-gray-900 dark:text-white">
              Admin Panel
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center flex-shrink-0"
          >
            {sidebarCollapsed ? <HiChevronRight size={18} className="text-gray-500 dark:text-gray-400" /> : <HiChevronLeft size={18} className="text-gray-500 dark:text-gray-400" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <HiLogout size={18} className="flex-shrink-0" />
            {!sidebarCollapsed && <span>Back to Site</span>}
          </Link>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <span className="font-black text-gray-900 dark:text-white">
          Admin Panel
        </span>
        <button onClick={() => setMobileMenuOpen(true)}>
          <HiMenu size={24} className="text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <span className="font-black text-gray-900 dark:text-white">
                Admin Panel
              </span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <HiX size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.path
                const Icon = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
            <div className="p-3 border-t border-gray-100 dark:border-gray-700">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <HiLogout size={18} className="flex-shrink-0" />
                <span>Back to Site</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 pt-16 md:pt-0 overflow-x-hidden min-w-0">
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  )
}

export default AdminLayout