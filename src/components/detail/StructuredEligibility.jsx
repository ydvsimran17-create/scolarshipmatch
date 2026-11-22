import {
  GraduationCap,
  Award,
  IndianRupee,
  Users,
  MapPin,
  FileCheck2,
  ShieldCheck,
  Check,
} from 'lucide-react'
import './StructuredEligibility.css'

export default function StructuredEligibility({ structuredEligibility, fallbackEligibility = [] }) {
  const criteriaBlocks = [
    {
      title: 'Education Level',
      desc: structuredEligibility?.educationLevel || 'Undergraduate / Postgraduate college enrollment.',
      icon: GraduationCap,
      verified: true,
    },
    {
      title: 'Academic Performance',
      desc: structuredEligibility?.academicPerformance || 'Minimum qualifying marks or percentile threshold in prior exams.',
      icon: Award,
      verified: true,
    },
    {
      title: 'Annual Family Income',
      desc: structuredEligibility?.annualIncome || 'Income ceiling criteria as certified by revenue authority.',
      icon: IndianRupee,
      verified: true,
    },
    {
      title: 'Category Requirements',
      desc: structuredEligibility?.categoryRequirements || 'Reservation quotas and community guidelines applicable.',
      icon: Users,
      verified: true,
    },
    {
      title: 'State & Domicile',
      desc: structuredEligibility?.domicileRequirements || 'Domicile rules and educational board accreditation.',
      icon: MapPin,
      verified: true,
    },
    {
      title: 'Other Conditions',
      desc: structuredEligibility?.otherConditions || 'Non-duplication of central/state government assistance.',
      icon: FileCheck2,
      verified: false,
    },
  ]

  return (
    <section className="eligibility-section-card card" aria-labelledby="eligibility-heading">
      <div className="detail-card-header-bar">
        <ShieldCheck size={20} className="detail-section-icon" />
        <h2 id="eligibility-heading" className="detail-section-title">
          Eligibility Criteria
        </h2>
        <span className="badge badge-linen text-xs" style={{ marginLeft: 'auto' }}>
          Structured Norms
        </span>
      </div>

      <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
        Verify that you meet all foundational requirements before initiating your application dossier.
      </p>

      {/* Grid of 6 Structured Blocks */}
      <div className="eligibility-blocks-grid">
        {criteriaBlocks.map((block, index) => {
          const Icon = block.icon
          return (
            <div key={index} className="eligibility-block-item">
              <div className="block-header">
                <div className="block-icon-box">
                  <Icon size={16} />
                </div>
                <h3 className="block-title">{block.title}</h3>
                <span className="block-status-chip">
                  <Check size={11} /> Standard
                </span>
              </div>
              <p className="block-desc text-xs text-secondary">{block.desc}</p>
            </div>
          )
        })}
      </div>

      {/* Fallback Bullet Points if available */}
      {fallbackEligibility.length > 0 && (
        <div className="additional-eligibility-notes">
          <h4 className="additional-notes-title">Additional Conditions Summary</h4>
          <ul className="eligibility-bullet-list">
            {fallbackEligibility.map((item, idx) => (
              <li key={idx} className="bullet-list-item text-xs text-secondary">
                <span className="bullet-dot" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
