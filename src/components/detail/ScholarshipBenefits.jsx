import { Gift, IndianRupee, GraduationCap, Sparkles } from 'lucide-react'
import './ScholarshipBenefits.css'

export default function ScholarshipBenefits({ benefitsData, amount }) {
  return (
    <section className="benefits-section-card card" aria-labelledby="benefits-heading">
      <div className="detail-card-header-bar">
        <Gift size={20} className="detail-section-icon" />
        <h2 id="benefits-heading" className="detail-section-title">
          Scholarship Benefits &amp; Coverage
        </h2>
      </div>

      <div className="benefits-grid">
        {/* Benefit 1: Financial Assistance Amount */}
        <div className="benefit-card">
          <div className="benefit-card-header">
            <div className="benefit-icon-frame">
              <IndianRupee size={18} />
            </div>
            <h3 className="benefit-card-title">Financial Assistance</h3>
          </div>
          <div className="benefit-highlight-amount">
            {benefitsData?.financialAmount || amount || 'Direct Cash Subsidy'}
          </div>
          <p className="benefit-detail-text text-xs text-secondary">
            Disbursed via Direct Benefit Transfer (DBT) directly into the student&rsquo;s verified bank account.
          </p>
        </div>

        {/* Benefit 2: Tuition Support */}
        <div className="benefit-card">
          <div className="benefit-card-header">
            <div className="benefit-icon-frame">
              <GraduationCap size={18} />
            </div>
            <h3 className="benefit-card-title">Tuition Support</h3>
          </div>
          <p className="benefit-lead-text text-sm font-semibold">
            {benefitsData?.tuitionSupport || 'Covers college tuition, exam fees, and library charges.'}
          </p>
          <p className="benefit-detail-text text-xs text-secondary">
            Supports annual registration dues and semester institutional requirements.
          </p>
        </div>

        {/* Benefit 3: Additional Benefits */}
        <div className="benefit-card">
          <div className="benefit-card-header">
            <div className="benefit-icon-frame">
              <Sparkles size={18} />
            </div>
            <h3 className="benefit-card-title">Additional Benefits</h3>
          </div>
          <p className="benefit-lead-text text-sm font-semibold">
            {benefitsData?.additionalBenefits || 'Academic mentorship, book grants, and annual renewal upon satisfactory performance.'}
          </p>
          <p className="benefit-detail-text text-xs text-secondary">
            Encourages continuous scholastic excellence through alumni interaction and skill workshops.
          </p>
        </div>
      </div>
    </section>
  )
}
