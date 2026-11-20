import { useState } from 'react'
import { studentProfile } from '../data/dashboardData'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import WelcomeBanner from '../components/dashboard/WelcomeBanner'
import StatsGrid from '../components/dashboard/StatsGrid'
import RecommendedScholarships from '../components/dashboard/RecommendedScholarships'
import UpcomingDeadlines from '../components/dashboard/UpcomingDeadlines'
import AiEssayAssistantCard from '../components/dashboard/AiEssayAssistantCard'
import QuickActions from '../components/dashboard/QuickActions'
import './Dashboard.css'

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="dashboard-page-wrapper">
      {/* 1. Header with Search, Notifications, Profile */}
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Welcome Section */}
      <WelcomeBanner studentName={studentProfile.firstName} />

      {/* 3. Statistics Cards */}
      <StatsGrid />

      {/* 4 & 5 & 6 & 7. Split Layout for Content */}
      <div className="dashboard-content-split">
        {/* Left Column: Recommended Scholarships */}
        <div className="dashboard-primary-col">
          <RecommendedScholarships searchQuery={searchQuery} />
        </div>

        {/* Right Column: AI Assistant, Deadlines & Quick Actions */}
        <div className="dashboard-secondary-col">
          <AiEssayAssistantCard />
          <UpcomingDeadlines />
          <QuickActions />
        </div>
      </div>

      {/* Project Academic Disclaimer */}
      <footer className="dashboard-demo-footer">
        <p className="text-xs text-muted">
          <strong>Scholarship Match &bull; College Mini Project</strong> &bull; All scholarship
          names, amounts, and dates are realistic illustrative sample data provided for
          application development and demonstration purposes.
        </p>
      </footer>
    </div>
  )
}
