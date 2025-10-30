import { useState } from 'react'
import DashboardSidebar from '../components/DashboardSidebar'
import AnalyticsSection from '../components/dashboard/AnalyticsSection'
import MyListingsSection from '../components/dashboard/MyListingsSection'
import AddListingSection from '../components/dashboard/AddListingSection'
import ProfileSection from '../components/dashboard/ProfileSection'
import PaymentsSection from '../components/dashboard/PaymentsSection'

function Dashboard() {
  const [activeSection, setActiveSection] = useState('analytics')

  const renderSection = () => {
    switch (activeSection) {
      case 'analytics':
        return <AnalyticsSection />
      case 'my-listings':
        return <MyListingsSection />
      case 'add-listing':
        return <AddListingSection />
      case 'profile':
        return <ProfileSection />
      case 'payments':
        return <PaymentsSection />
      default:
        return <AnalyticsSection />
    }
  }

  return (
    <div className="grid lg:grid-cols-[250px_1fr] gap-6">
      {/* Dashboard Sidebar */}
      <DashboardSidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
      />

      {/* Main Content */}
      <main>
        {renderSection()}
      </main>
    </div>
  )
}

export default Dashboard