import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ClipboardList,
  ShieldAlert,
  Sparkles,
  ArrowLeft,
} from 'lucide-react'
import { sampleApplications } from '../data/applicationsData'
import { APPLICATION_STATUSES } from '../data/applicationsData'
import { apiClient } from '../services/api'
import ApplicationOverviewCards from '../components/applications/ApplicationOverviewCards'
import ApplicationFilters from '../components/applications/ApplicationFilters'
import ApplicationTable from '../components/applications/ApplicationTable'
import ApplicationDetailView from '../components/applications/ApplicationDetailView'
import ApplicationEmptyState from '../components/applications/ApplicationEmptyState'
import './MyApplications.css'

// Turns one backend essay draft into the shape this page's components expect.
// The first sample record is used as a template so no expected field is missing.
function toApplication(item) {
  const template = sampleApplications[0] || {}
  const isSubmitted = item.status === 'submitted'
  const updatedIso = item.updatedAt || new Date().toISOString()
  const createdIso = item.createdAt || updatedIso
  const niceDate = (iso) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    })

  return {
    ...template,
    id: item.id,
    referenceId: `SM-${String(item.id).slice(0, 8).toUpperCase()}`,
    applicationNumber: `SM-${String(item.id).slice(0, 8).toUpperCase()}`,
    scholarshipName: item.Scholarship?.name || 'Scholarship',
    provider: 'AI Essay Draft',
    amountValue: 0,
    status: isSubmitted ? APPLICATION_STATUSES.SUBMITTED : APPLICATION_STATUSES.ACTION_REQUIRED,
    statusLabel: isSubmitted ? 'Submitted' : 'Draft - finish your essay',
    submissionDate: niceDate(createdIso),
    submissionDateIso: createdIso,
    lastUpdated: niceDate(updatedIso),
    lastUpdatedIso: updatedIso,
    essayDraft: item.essay_draft,
    progressTimeline: [
      {
        stage: 'Essay Draft Generated',
        date: niceDate(createdIso),
        state: 'completed',
        description: 'First draft written by the AI Essay Assistant.',
      },
      {
        stage: isSubmitted ? 'Application Submitted' : 'Review and Submit',
        date: isSubmitted ? niceDate(updatedIso) : 'Pending',
        state: isSubmitted ? 'completed' : 'in-progress',
        description: isSubmitted
          ? 'Application marked as submitted.'
          : 'Edit the draft, add your personal story, then submit.',
      },
    ],
  }
}

export default function MyApplications() {
  const { applicationId } = useParams()
  const navigate = useNavigate()

  // Applications come from the backend (saved essay drafts)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false
    apiClient
      .get('/essays')
      .then((data) => {
        if (cancelled) return
        const list = Array.isArray(data?.applications) ? data.applications : []
        setApplications(list.map(toApplication))
      })
      .catch((err) => {
        if (cancelled) return
        setLoadError(
          err?.status === 401
            ? 'Please log in to see your applications.'
            : err?.message || 'Could not load your applications.'
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

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
    const set = new Set(applications.map((app) => app.provider))
    return Array.from(set).sort()
  }, [applications])

  // Filter & Sort Logic
  const filteredAndSortedApplications = useMemo(() => {
    return applications
      .filter((app) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim()
          const nameMatches = app.scholarshipName.toLowerCase().includes(q)
          const providerMatches = app.provider.toLowerCase().includes(q)
          const refMatches = app.referenceId.toLowerCase().includes(q)
          if (!nameMatches && !providerMatches && !refMatches) return false
        }
        if (statusFilter !== 'All' && app.status !== statusFilter) return false
        if (providerFilter !== 'All' && app.provider !== providerFilter) return false
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
  }, [applications, searchQuery, statusFilter, providerFilter, sortOption])

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

  if (loading) {
    return (
      <div className="my-applications-page">
        <div className="application-not-found-card card">
          <p className="text-sm text-secondary">Loading your applications&hellip;</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="my-applications-page">
        <div className="application-not-found-card card">
          <ShieldAlert size={44} color="var(--color-currant)" />
          <h2>Could not load applications</h2>
          <p className="text-secondary text-sm">{loadError}</p>
        </div>
      </div>
    )
  }

  // If URL has applicationId, find and render detail view
  if (applicationId) {
    const selectedApp = applications.find((app) => app.id === applicationId)

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
          </div>

          <h1 className="applications-heading">My Applications</h1>

          <p className="applications-subtitle text-secondary">
            Your saved essay drafts and applications. Generate a draft in the Essay Assistant and it appears here.
          </p>
        </div>

        <div className="header-quick-stats badge badge-brass">
          <Sparkles size={14} className="brass-sparkle-icon" />
          <span>Active Academic Dossier (2026–2027)</span>
        </div>
      </header>

      {/* 2. Overview Metrics Cards */}
      <ApplicationOverviewCards
        applications={applications}
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