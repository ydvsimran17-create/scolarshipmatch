import { Calendar, Clock, Award, AlertCircle } from 'lucide-react'
import './ImportantDatesTimeline.css'

export default function ImportantDatesTimeline({
  openingDate,
  deadline,
  expectedResultDate,
}) {
  const milestones = [
    {
      id: 'open',
      title: 'Applications Open',
      date: openingDate || 'August 15, 2026',
      desc: 'Online registration and document submission portal opens for applicants.',
      status: 'Completed',
      statusColor: 'badge-linen',
      icon: Calendar,
    },
    {
      id: 'deadline',
      title: 'Final Application Deadline',
      date: deadline || 'December 15, 2026',
      desc: 'All candidate details, marksheets, and declarations must be submitted.',
      status: 'Active / Open',
      statusColor: 'badge-brass',
      icon: Clock,
      highlight: true,
    },
    {
      id: 'result',
      title: 'Merit List & Disbursal Notice',
      date: expectedResultDate || 'February 28, 2027',
      desc: 'Verification by nodal institutions concludes, followed by DBT scholarship credit.',
      status: 'Upcoming',
      statusColor: 'badge-indigo',
      icon: Award,
    },
  ]

  return (
    <section className="important-dates-card card" aria-labelledby="dates-heading">
      <div className="detail-card-header-bar">
        <Calendar size={20} className="detail-section-icon" />
        <h2 id="dates-heading" className="detail-section-title">
          Important Dates &amp; Timeline
        </h2>
        <span className="badge badge-currant" style={{ fontSize: '0.75rem' }}>
          2026–2027 Academic Cycle
        </span>
      </div>

      <p className="text-secondary text-sm">
        Track crucial submission milestones. Please ensure all documents and university authentications are processed prior to the closing cutoff.
      </p>

      {/* Milestone Cards Grid */}
      <div className="milestones-grid">
        {milestones.map((m) => {
          const IconComponent = m.icon
          return (
            <div
              key={m.id}
              className={`milestone-card ${m.highlight ? 'milestone-highlight' : ''}`}
            >
              <div className="milestone-top-row">
                <div className="milestone-icon-wrapper">
                  <IconComponent size={18} />
                </div>
                <span className={`badge ${m.statusColor}`}>{m.status}</span>
              </div>

              <div className="milestone-main">
                <span className="milestone-date-display">{m.date}</span>
                <h3 className="milestone-title">{m.title}</h3>
                <p className="milestone-desc text-xs text-secondary">{m.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Demo Advisory Notice */}
      <div className="dates-disclaimer-note">
        <AlertCircle size={15} className="dates-disclaimer-icon" />
        <span className="text-xs text-muted">
          <strong>Calendar Advisory:</strong> Dates displayed above are simulated for demonstration. In real-world cycles, verify extension circulars on the issuing agency&rsquo;s official portal.
        </span>
      </div>
    </section>
  )
}
