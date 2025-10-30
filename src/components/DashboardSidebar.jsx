import { BarChart3, Store, Plus, User, CreditCard } from 'lucide-react'
import clsx from 'clsx'

function DashboardSidebar({ activeSection, onSectionChange }) {
  const sections = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'my-listings', label: 'My Listings', icon: Store },
    { id: 'add-listing', label: 'Add Listing', icon: Plus },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ]

  return (
    <aside className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Dashboard</h2>
      <nav className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left',
                isActive
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon size={20} />
              <span>{section.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default DashboardSidebar