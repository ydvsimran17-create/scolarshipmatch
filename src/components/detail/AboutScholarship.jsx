import { BookOpen } from 'lucide-react'
import './AboutScholarship.css'

export default function AboutScholarship({ detailedAbout, overview }) {
  return (
    <section className="about-scholarship-card card" aria-labelledby="about-heading">
      <div className="detail-card-header-bar">
        <BookOpen size={20} className="detail-section-icon" />
        <h2 id="about-heading" className="detail-section-title">
          About the Scholarship
        </h2>
      </div>

      <div className="about-content-body">
        <p className="about-text-lead text-secondary">
          {detailedAbout || overview}
        </p>

        {detailedAbout && overview && detailedAbout !== overview && (
          <p className="about-text-secondary text-secondary">
            {overview}
          </p>
        )}
      </div>
    </section>
  )
}
