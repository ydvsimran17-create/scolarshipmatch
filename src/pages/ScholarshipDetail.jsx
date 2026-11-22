import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { discoveryScholarships } from '../data/scholarshipsDiscoveryData'
import ScholarshipHeader from '../components/detail/ScholarshipHeader'
import AiEligibilityMatchCard from '../components/detail/AiEligibilityMatchCard'
import AboutScholarship from '../components/detail/AboutScholarship'
import StructuredEligibility from '../components/detail/StructuredEligibility'
import ScholarshipBenefits from '../components/detail/ScholarshipBenefits'
import RequiredDocumentsChecklist from '../components/detail/RequiredDocumentsChecklist'
import ImportantDatesTimeline from '../components/detail/ImportantDatesTimeline'
import ApplicationProcessTimeline from '../components/detail/ApplicationProcessTimeline'
import RightSideActionCard from '../components/detail/RightSideActionCard'
import ApplyDemoModal from '../components/detail/ApplyDemoModal'
import './ScholarshipDetail.css'

export default function ScholarshipDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  // Scroll to top upon navigation to scholarship
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  // Locate matching scholarship data
  const scholarship = useMemo(() => {
    return discoveryScholarships.find((item) => item.id === id)
  }, [id])

  // Bookmarking state synchronized with localStorage
  const [isBookmarked, setIsBookmarked] = useState(() => {
    try {
      const saved = localStorage.getItem('scholarship_bookmarks')
      const parsed = saved ? JSON.parse(saved) : ['csss-scholarship']
      return parsed.includes(id)
    } catch {
      return false
    }
  })

  // Modal & Application state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)

  const toggleBookmark = () => {
    setIsBookmarked((prev) => {
      const next = !prev
      try {
        const saved = localStorage.getItem('scholarship_bookmarks')
        let parsed = saved ? JSON.parse(saved) : ['csss-scholarship']
        if (next) {
          if (!parsed.includes(id)) parsed.push(id)
        } else {
          parsed = parsed.filter((item) => item !== id)
        }
        localStorage.setItem('scholarship_bookmarks', JSON.stringify(parsed))
      } catch {
        // storage fallback
      }
      return next
    })
  }

  // Handle scholarship not found
  if (!scholarship) {
    return (
      <div className="scholarship-detail-page">
        <div className="not-found-card card">
          <ShieldAlert size={44} color="var(--color-currant)" />
          <h2>Opportunity Not Found</h2>
          <p className="text-secondary text-sm">
            We couldn&rsquo;t find a scholarship matching identifier &ldquo;{id}&rdquo;. It may have been archived or updated.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate('/find-scholarships')}
          >
            <ArrowLeft size={16} /> Return to Scholarships Directory
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="scholarship-detail-page">
      {/* 1. Full Scholarship Header (Breadcrumbs, Title, Quick Badges & Metrics) */}
      <ScholarshipHeader scholarship={scholarship} />

      {/* 2. Responsive 2-Column Main Layout */}
      <div className="detail-layout-grid">
        {/* Left Column: Comprehensive Detail Sections */}
        <div className="detail-main-flow">
          {/* Section 2: AI Eligibility Match Assessment */}
          <AiEligibilityMatchCard matchData={scholarship.matchExplanation} />

          {/* Section 3: About the Scholarship */}
          <AboutScholarship
            detailedAbout={scholarship.detailedAbout}
            overview={scholarship.details?.overview}
          />

          {/* Section 4: Structured Eligibility Criteria */}
          <StructuredEligibility
            structuredEligibility={scholarship.structuredEligibility}
            fallbackEligibility={scholarship.details?.eligibility}
          />

          {/* Section 5: Scholarship Benefits & Coverage */}
          <ScholarshipBenefits
            benefitsData={scholarship.structuredBenefits}
            amount={scholarship.amount}
          />

          {/* Section 6: Required Document Checklist (Interactive) */}
          <RequiredDocumentsChecklist scholarshipId={scholarship.id} />

          {/* Section 7: Important Dates Timeline */}
          <ImportantDatesTimeline
            openingDate={scholarship.openingDate}
            deadline={scholarship.deadline}
            expectedResultDate={scholarship.expectedResultDate}
          />

          {/* Section 8: Step-by-Step Application Process */}
          <ApplicationProcessTimeline
            applicationSteps={scholarship.applicationSteps}
          />
        </div>

        {/* Right Column: Sticky Action & Digest Panel */}
        <div className="detail-sidebar-wrap">
          <RightSideActionCard
            scholarship={scholarship}
            isBookmarked={isBookmarked}
            onToggleBookmark={toggleBookmark}
            onOpenApplyModal={() => setIsApplyModalOpen(true)}
            hasApplied={hasApplied}
          />
        </div>
      </div>

      {/* Demo Application Modal */}
      <ApplyDemoModal
        scholarship={scholarship}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onApplicationComplete={() => setHasApplied(true)}
      />
    </div>
  )
}
