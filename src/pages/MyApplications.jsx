import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'
import { sampleApplications } from '../data/applicationsData'
import ApplicationOverviewCards from '../components/applications/ApplicationOverviewCards'
import ApplicationFilters from '../components/applications/ApplicationFilters'
import ApplicationTable from '../components/applications/ApplicationTable'
import ApplicationDetailView from '../components/applications/ApplicationDetailView'
import ApplicationEmptyState from '../components/applications/ApplicationEmptyState'
import './MyApplications.css'

export default function MyApplications() {
  const { applicationId } = useParams()
  const navigate = useNavigate()

  // Scroll to top on page load or ID switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [applicationId])

  // Filter and Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [providerFilter, setProviderFilter] = useState('All')
  const [sortOption, setSortOption] = useState('newest')

  // Extract unique providers for filter dropdown
  const uniqueProviders = useMemo(() => {
    const set = new Set(sampleApplications.map((app) => app.provider))
    return Array.from(set).sort()
  }, [])

  // Filter & Sort Logic
  const filteredAndSortedApplications = useMemo(() => {
    return sampleApplications
      .filter((app) => {
        // Search by scholarship name
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const nameMatches = app.scholarshipName.toLowerCase().includes(q)
          const providerMatches = app.provider.toLowerCase().includes(q)
          const refMatches = app.referenceId.toLowerCase().includes(q)
          if (!nameMatches && !providerMatches && !refMatches) return false
        }

        // Status filter
        if (statusFilter !== 'All' && app.status !== statusFilter) {
          return false
        }

        // Provider filter
        if (providerFilter !== 'All' && app.provider !== providerFilter) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortOption === 'newest') {
          return new Date(b.submissionDateIso) - new Date(a.submissionDateIso)
        }
        if (sortOption === 'oldest') {
          return new Date(a.submissionDateIso) - new Date(b.submissionDateIso)
        }
        if (sortOption === 'updated') {
          return new Date(b.lastUpdatedIso) - new Date(a.lastUpdatedIso)
        }
        if (sortOption === 'amount-high') {
          return b.amountValue - a.amountValue
        }
        return 0
      })
  }, [searchQuery, statusFilter, providerFilter, sortOption])

  // Clear all active filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('All')
    setProviderFilter('All')
    setSortOption('newest')
  }

  // Handle viewing specific application
  const handleViewDetails = (app) => {
    navigate(`/applications/${app.id}`)
  }

  // Handle returning from detail view
  const handleBackToList = () => {
    navigate('/applications')
  }

  // If URL has applicationId, find and render detail view
  if (applicationId) {
    const selectedApp = sampleApplications.find((app) => app.id === applicationId)

    if (!selectedApp) {
      return (
        <div className="my-applications-page">
          <div className="application-not-found-card card">
            <ShieldAlert size={44} color="var(--color-currant)" />
            <h2>Application Record Not Found</h2>
            <p className="text-secondary text-sm">
              We could not find an application dossier with reference ID &ldquo;{applicationId}&rdquo;.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleBackToList}
            >
              <ArrowLeft size={16} /> Return to All Applications
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="my-applications-page">
        <ApplicationDetailView
          application={selectedApp}
          onBack={handleBackToList}
        />
      </div>
    )
  }

  const isFiltered =
    Boolean(searchQuery) ||
    statusFilter !== 'All' ||
    providerFilter !== 'All' ||
    sortOption !== 'newest'

  return (
    <div className="my-applications-page">
      {/* 1. Page Header */}
      <header className="applications-header card">
        <div className="header-text-cluster">
          <div className="header-badge-row">
            <span className="badge badge-indigo">
              <ClipboardList size={13} /> Application Tracker
            </span>
            <span className="badge badge-currant">
              <ShieldAlert size={12} /> Demo Data
            </span>
          </div>

          <h1 className="applications-heading">My Applications</h1>

          <p className="applications-subtitle text-secondary">
            Track and manage all your scholarship applications, review verification milestones, and stay ahead of critical institutional directives.
          </p>
        </div>

        <div className="header-quick-stats badge badge-brass">
          <Sparkles size={14} className="brass-sparkle-icon" />
          <span>Active Academic Dossier (2026–2027)</span>
        </div>
      </header>

      {/* 2. Overview Metrics Cards (4 summary cards) */}
      <ApplicationOverviewCards
        applications={sampleApplications}
        activeFilter={statusFilter}
        onSelectStatusFilter={(st) => setStatusFilter(st)}
      />

      {/* 3. Search and Filter Bar */}
      <ApplicationFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        providerFilter={providerFilter}
        onProviderChange={setProviderFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onClearFilters={handleClearFilters}
        providers={uniqueProviders}
        totalResults={filteredAndSortedApplications.length}
      />

      {/* 4. Applications Table or Empty State */}
      {filteredAndSortedApplications.length > 0 ? (
        <ApplicationTable
          applications={filteredAndSortedApplications}
          onViewDetails={handleViewDetails}
        />
      ) : (
        <ApplicationEmptyState
          isFiltered={isFiltered}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  )
}
