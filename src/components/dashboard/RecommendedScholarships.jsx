import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, ArrowRight, Info } from 'lucide-react'
import { recommendedScholarships } from '../../data/dashboardData'
import ScholarshipCard from './ScholarshipCard'
import ScholarshipModal from './ScholarshipModal'
import './RecommendedScholarships.css'

export default function RecommendedScholarships({ searchQuery = '' }) {
  const navigate = useNavigate()
  const [selectedScholarship, setSelectedScholarship] = useState(null)

  // Filter scholarships if search query is provided
  const filteredScholarships = recommendedScholarships.filter((sch) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      sch.name.toLowerCase().includes(q) ||
      sch.provider.toLowerCase().includes(q) ||
      sch.category.toLowerCase().includes(q)
    )
  })

  return (
    <section
      className="recommended-section"
      aria-labelledby="recommended-heading"
    >
      <div className="section-title-bar">
        <div>
          <div className="title-with-badge">
            <h2 id="recommended-heading" className="section-main-heading">
              <Award size={22} className="heading-icon-brass" /> Recommended
              Scholarships
            </h2>
            <span className="badge badge-brass text-xs">AI Matched</span>
          </div>
          <p className="text-sm text-secondary">
            Top academic opportunities tailored for Indian students pursuing college degrees.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline btn-sm view-all-btn"
          onClick={() => navigate('/find-scholarships')}
        >
          View All Matches <ArrowRight size={14} />
        </button>
      </div>

      {/* Sample Data Notice Banner */}
      <div className="sample-disclaimer-card">
        <Info size={16} className="disclaimer-icon" />
        <p className="text-xs text-secondary">
          <strong>Notice:</strong> The programs below represent realistic sample data modeled for
          demonstration. Eligibility thresholds and deadlines are illustrative and should be verified on official portals.
        </p>
      </div>

      {/* Cards List */}
      <div className="scholarships-list">
        {filteredScholarships.length > 0 ? (
          filteredScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onViewDetails={(item) => setSelectedScholarship(item)}
            />
          ))
        ) : (
          <div className="empty-search-card card">
            <p className="text-sm text-secondary">
              No matching scholarships found for &ldquo;{searchQuery}&rdquo;.
            </p>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => navigate('/find-scholarships')}
              style={{ marginTop: 'var(--space-2)' }}
            >
              Reset Search &amp; Browse All
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedScholarship && (
        <ScholarshipModal
          scholarship={selectedScholarship}
          onClose={() => setSelectedScholarship(null)}
        />
      )}
    </section>
  )
}
