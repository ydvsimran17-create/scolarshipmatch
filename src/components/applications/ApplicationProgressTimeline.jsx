import { CheckCircle2, Clock, CircleDot, AlertCircle } from 'lucide-react'
import './ApplicationProgressTimeline.css'

export default function ApplicationProgressTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) return null

  return (
    <div className="app-timeline-block" aria-label="Application progress milestones">
      <div className="app-timeline-list">
        {timeline.map((stageItem, index) => {
          const isCompleted = stageItem.state === 'completed'
          const isCurrent = stageItem.state === 'current'
          const isLast = index === timeline.length - 1

          return (
            <div
              key={stageItem.stage || index}
              className={`timeline-stage-item ${
                isCompleted ? 'state-completed' : isCurrent ? 'state-current' : 'state-upcoming'
              }`}
            >
              {/* Spine Node */}
              <div className="stage-node-column">
                <div className="stage-indicator-bubble">
                  {isCompleted ? (
                    <CheckCircle2 size={16} className="node-icon icon-completed" />
                  ) : isCurrent ? (
                    <CircleDot size={18} className="node-icon icon-current" />
                  ) : (
                    <Clock size={15} className="node-icon icon-upcoming" />
                  )}
                </div>
                {!isLast && <div className="stage-connector-spine" />}
              </div>

              {/* Stage Content */}
              <div className="stage-content-wrap">
                <div className="stage-header-line">
                  <h4 className="stage-title-text">{stageItem.stage}</h4>
                  <span className="stage-status-pill text-xs">
                    {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                  </span>
                </div>

                <div className="stage-date-row text-xs">
                  <span className="stage-date-val">{stageItem.date}</span>
                </div>

                {stageItem.description && (
                  <p className="stage-desc-text text-xs text-secondary">
                    {stageItem.description}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="timeline-footer-disclaimer">
        <AlertCircle size={14} className="timeline-disclaimer-icon" />
        <span className="text-xs text-muted">
          Stages are updated based on institutional verification reports and central agency portal feeds.
        </span>
      </div>
    </div>
  )
}
