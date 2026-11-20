import {
  ListOrdered,
  UserCheck,
  FileSpreadsheet,
  Send,
  Building,
  CheckCircle2,
} from 'lucide-react'
import './ApplicationProcessTimeline.css'

export default function ApplicationProcessTimeline({ applicationSteps = [] }) {
  const defaultSteps = [
    {
      step: 1,
      title: 'One-Time Registration & Profile Setup',
      description:
        'Register on the designated scholarship portal with your Aadhaar number and academic registration ID.',
      icon: UserCheck,
    },
    {
      step: 2,
      title: 'Assemble Certified Documentation',
      description:
        'Prepare verified income certificates, marks sheets, caste/domicile credentials, and college bonafide letters.',
      icon: FileSpreadsheet,
    },
    {
      step: 3,
      title: 'Complete Online Application Form',
      description:
        'Fill in detailed academic particulars, fee structures, and bank IFSC details before the cycle deadline.',
      icon: Send,
    },
    {
      step: 4,
      title: 'Institute & Authority Verification',
      description:
        'Your enrolled college or university nodal officer audits the submission and submits digital attestation.',
      icon: Building,
    },
    {
      step: 5,
      title: 'Merit List Publication & DBT Disbursal',
      description:
        'Awardees are notified and scholarship aid is transferred directly into Aadhaar-seeded bank accounts.',
      icon: CheckCircle2,
    },
  ]

  const stepsToRender = applicationSteps && applicationSteps.length > 0
    ? applicationSteps.map((s, idx) => ({
        ...s,
        icon: [UserCheck, FileSpreadsheet, Send, Building, CheckCircle2][idx % 5],
      }))
    : defaultSteps

  return (
    <section className="application-process-card card" aria-labelledby="process-heading">
      <div className="detail-card-header-bar">
        <ListOrdered size={20} className="detail-section-icon" />
        <h2 id="process-heading" className="detail-section-title">
          Step-by-Step Application Process
        </h2>
        <span className="badge badge-linen" style={{ fontSize: '0.75rem' }}>
          5-Stage Flow
        </span>
      </div>

      <p className="text-secondary text-sm">
        Follow these standardized stages to complete your scholarship submission seamlessly and prevent administrative delays.
      </p>

      {/* Step Sequence Timeline */}
      <div className="timeline-steps-container">
        {stepsToRender.map((stepItem, index) => {
          const StepIcon = stepItem.icon || CheckCircle2
          const isLast = index === stepsToRender.length - 1

          return (
            <div key={stepItem.step || index} className="timeline-step-row">
              {/* Left Column: Number Node and Vertical Spine */}
              <div className="timeline-node-column">
                <div className="timeline-step-bubble">
                  <span className="step-num-text">{stepItem.step || index + 1}</span>
                </div>
                {!isLast && <div className="timeline-connecting-spine" />}
              </div>

              {/* Right Column: Step Content Card */}
              <div className="timeline-step-body">
                <div className="timeline-step-header">
                  <div className="step-icon-badge">
                    <StepIcon size={16} />
                  </div>
                  <h3 className="timeline-step-name">{stepItem.title}</h3>
                </div>
                <p className="timeline-step-desc text-secondary text-sm">
                  {stepItem.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
