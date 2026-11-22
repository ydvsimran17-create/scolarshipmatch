import { useState, useEffect } from 'react'
import {
  UserCheck,
  BookOpen,
  IndianRupee,
  ShieldAlert,
  Compass,
  Save,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from 'lucide-react'
import {
  initialStudentProfile,
  INDIAN_STATES,
  EDUCATION_LEVELS,
  YEARS_OF_STUDY,
  INCOME_SLABS,
  CATEGORIES,
  SCHOLARSHIP_PREFERENCES,
  calculateProfileCompletion,
} from '../data/profileData'
import ProfileCompletionCard from '../components/profile/ProfileCompletionCard'
import './StudentProfile.css'

export default function StudentProfile() {
  const storageKey = 'scholarship_student_profile'

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Load from localStorage or initialize with demo default
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved ? JSON.parse(saved) : initialStudentProfile
    } catch {
      return initialStudentProfile
    }
  })

  const [savedSuccessMsg, setSavedSuccessMsg] = useState('')
  const [validationError, setValidationError] = useState('')

  // Handle generic field change
  const handleChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
    if (validationError) setValidationError('')
  }

  // Calculate live completion percentage
  const completionPercentage = calculateProfileCompletion(profile)

  // Save handler
  const handleSave = (e) => {
    e.preventDefault()

    // Basic validation
    if (!profile.fullName.trim() || !profile.email.trim() || !profile.phone.trim()) {
      setValidationError('Please complete all mandatory personal contact fields.')
      return
    }
    if (!profile.institution.trim() || !profile.course.trim()) {
      setValidationError('Please provide your current institution and course details.')
      return
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(profile))
      setSavedSuccessMsg('Profile updated and saved successfully! Match recommendations refreshed.')
      setValidationError('')

      const timer = setTimeout(() => {
        setSavedSuccessMsg('')
      }, 4000)
      return () => clearTimeout(timer)
    } catch {
      setValidationError('Unable to access localStorage to save profile.')
    }
  }

  // Reset to default sample profile
  const handleReset = () => {
    if (window.confirm('Reset student profile to default verified demo credentials?')) {
      setProfile(initialStudentProfile)
      try {
        localStorage.setItem(storageKey, JSON.stringify(initialStudentProfile))
      } catch {
        // fallback
      }
      setSavedSuccessMsg('Profile reset to initial demo defaults.')
      setTimeout(() => setSavedSuccessMsg(''), 3000)
    }
  }

  return (
    <div className="student-profile-page-container">
      {/* 1. Header Banner */}
      <header className="profile-page-header card">
        <div className="header-info-wrap">
          <div className="header-badge-row">
            <span className="badge badge-indigo">
              <UserCheck size={13} /> Student Profile Builder
            </span>
            <span className="badge badge-currant">
              <ShieldAlert size={12} /> Demo Data
            </span>
            <span className="badge badge-brass">
              <Sparkles size={12} /> Live Matching Engine
            </span>
          </div>

          <h1 className="profile-page-heading">My Student Profile</h1>

          <p className="profile-page-subtitle text-secondary">
            Build your profile to discover scholarships that match your eligibility, verify reservation criteria, and power personalized application drafting.
          </p>
        </div>

        <div className="header-quick-save-cluster">
          <button
            type="button"
            className="btn btn-outline btn-sm reset-btn"
            onClick={handleReset}
          >
            <RotateCcw size={14} /> Reset Defaults
          </button>
          <button
            type="submit"
            form="profile-form"
            className="btn btn-primary btn-save-prominent"
          >
            <Save size={16} /> Save Profile
          </button>
        </div>
      </header>

      {/* Success Notification Banner */}
      {savedSuccessMsg && (
        <div className="profile-save-alert-banner alert-success" role="status">
          <CheckCircle2 size={18} className="alert-success-icon" />
          <span className="text-sm font-semibold">{savedSuccessMsg}</span>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="profile-save-alert-banner alert-error" role="alert">
          <AlertCircle size={18} className="alert-error-icon" />
          <span className="text-sm font-semibold">{validationError}</span>
        </div>
      )}

      {/* 2. Responsive 2-Column Main Layout */}
      <div className="profile-layout-grid">
        {/* Left Column: Structured Form Sections */}
        <form id="profile-form" onSubmit={handleSave} className="profile-sections-flow">
          {/* Section 1: Personal Information */}
          <section className="profile-section-card card" aria-labelledby="personal-info-heading">
            <div className="section-header-row">
              <div className="section-title-wrap">
                <UserCheck size={20} className="section-crest-icon" />
                <div>
                  <h2 id="personal-info-heading" className="section-heading-text">
                    1. Personal Information
                  </h2>
                  <span className="text-xs text-muted">Basic identity and contact particulars</span>
                </div>
              </div>
            </div>

            <div className="fields-grid grid-2-col">
              {/* Full Name */}
              <div className="form-field-group">
                <label htmlFor="field-fullName" className="field-label text-xs">
                  Full Name <span className="req-star">*</span>
                </label>
                <input
                  id="field-fullName"
                  type="text"
                  className="field-input"
                  value={profile.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="e.g. Anvaya Sharma"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="form-field-group">
                <label htmlFor="field-email" className="field-label text-xs">
                  Email Address <span className="req-star">*</span>
                </label>
                <input
                  id="field-email"
                  type="email"
                  className="field-input"
                  value={profile.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="name@university.ac.in"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="form-field-group">
                <label htmlFor="field-phone" className="field-label text-xs">
                  Phone Number <span className="req-star">*</span>
                </label>
                <input
                  id="field-phone"
                  type="tel"
                  className="field-input"
                  value={profile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="form-field-group">
                <label htmlFor="field-dob" className="field-label text-xs">
                  Date of Birth <span className="req-star">*</span>
                </label>
                <input
                  id="field-dob"
                  type="date"
                  className="field-input"
                  value={profile.dob}
                  onChange={(e) => handleChange('dob', e.target.value)}
                  required
                />
              </div>

              {/* Gender (Optional) */}
              <div className="form-field-group">
                <label htmlFor="field-gender" className="field-label text-xs">
                  Gender <span className="opt-tag">(Optional)</span>
                </label>
                <select
                  id="field-gender"
                  className="field-select"
                  value={profile.gender}
                  onChange={(e) => handleChange('gender', e.target.value)}
                >
                  <option value="">Select gender...</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* State */}
              <div className="form-field-group">
                <label htmlFor="field-state" className="field-label text-xs">
                  Current State / UT <span className="req-star">*</span>
                </label>
                <select
                  id="field-state"
                  className="field-select"
                  value={profile.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  required
                >
                  <option value="">Select state...</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="form-field-group">
                <label htmlFor="field-city" className="field-label text-xs">
                  City / District <span className="req-star">*</span>
                </label>
                <input
                  id="field-city"
                  type="text"
                  className="field-input"
                  value={profile.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. New Delhi"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 2: Academic Information */}
          <section className="profile-section-card card" aria-labelledby="academic-info-heading">
            <div className="section-header-row">
              <div className="section-title-wrap">
                <BookOpen size={20} className="section-crest-icon" />
                <div>
                  <h2 id="academic-info-heading" className="section-heading-text">
                    2. Academic Information
                  </h2>
                  <span className="text-xs text-muted">Course enrollment and previous examination metrics</span>
                </div>
              </div>
            </div>

            <div className="fields-grid grid-2-col">
              {/* Current Education Level */}
              <div className="form-field-group span-full">
                <label htmlFor="field-educationLevel" className="field-label text-xs">
                  Current Education Level <span className="req-star">*</span>
                </label>
                <select
                  id="field-educationLevel"
                  className="field-select"
                  value={profile.educationLevel}
                  onChange={(e) => handleChange('educationLevel', e.target.value)}
                  required
                >
                  {EDUCATION_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              {/* Institution Name */}
              <div className="form-field-group span-full">
                <label htmlFor="field-institution" className="field-label text-xs">
                  Institution / College / University Name <span className="req-star">*</span>
                </label>
                <input
                  id="field-institution"
                  type="text"
                  className="field-input"
                  value={profile.institution}
                  onChange={(e) => handleChange('institution', e.target.value)}
                  placeholder="e.g. Delhi Technological University (DTU)"
                  required
                />
              </div>

              {/* Course / Stream */}
              <div className="form-field-group">
                <label htmlFor="field-course" className="field-label text-xs">
                  Course / Stream / Discipline <span className="req-star">*</span>
                </label>
                <input
                  id="field-course"
                  type="text"
                  className="field-input"
                  value={profile.course}
                  onChange={(e) => handleChange('course', e.target.value)}
                  placeholder="e.g. Computer Science & Engineering"
                  required
                />
              </div>

              {/* Current Year of Study */}
              <div className="form-field-group">
                <label htmlFor="field-yearOfStudy" className="field-label text-xs">
                  Current Year of Study <span className="req-star">*</span>
                </label>
                <select
                  id="field-yearOfStudy"
                  className="field-select"
                  value={profile.yearOfStudy}
                  onChange={(e) => handleChange('yearOfStudy', e.target.value)}
                  required
                >
                  {YEARS_OF_STUDY.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Previous Academic Marks / Percentage */}
              <div className="form-field-group">
                <label htmlFor="field-marksPercentage" className="field-label text-xs">
                  Previous Academic Marks / Percentage <span className="req-star">*</span>
                </label>
                <input
                  id="field-marksPercentage"
                  type="text"
                  className="field-input"
                  value={profile.marksPercentage}
                  onChange={(e) => handleChange('marksPercentage', e.target.value)}
                  placeholder="e.g. 91.4% or 9.2 CGPA"
                  required
                />
              </div>

              {/* Academic Year */}
              <div className="form-field-group">
                <label htmlFor="field-academicYear" className="field-label text-xs">
                  Current Academic Year <span className="req-star">*</span>
                </label>
                <input
                  id="field-academicYear"
                  type="text"
                  className="field-input"
                  value={profile.academicYear}
                  onChange={(e) => handleChange('academicYear', e.target.value)}
                  placeholder="2026–2027"
                  required
                />
              </div>
            </div>
          </section>

          {/* Section 3: Financial Information */}
          <section className="profile-section-card card" aria-labelledby="financial-info-heading">
            <div className="section-header-row">
              <div className="section-title-wrap">
                <IndianRupee size={20} className="section-crest-icon" />
                <div>
                  <h2 id="financial-info-heading" className="section-heading-text">
                    3. Financial Information
                  </h2>
                  <span className="text-xs text-muted">Income slabs for need-based government &amp; private aid</span>
                </div>
              </div>
            </div>

            <div className="fields-grid grid-2-col">
              {/* Annual Family Income */}
              <div className="form-field-group span-full">
                <label htmlFor="field-annualIncome" className="field-label text-xs">
                  Gross Annual Family Income <span className="req-star">*</span>
                </label>
                <select
                  id="field-annualIncome"
                  className="field-select"
                  value={profile.annualIncome}
                  onChange={(e) => handleChange('annualIncome', e.target.value)}
                  required
                >
                  {INCOME_SLABS.map((slab) => (
                    <option key={slab} value={slab}>
                      {slab}
                    </option>
                  ))}
                </select>
              </div>

              {/* Income Certificate Availability */}
              <div className="form-field-group span-full">
                <label htmlFor="field-incomeCert" className="field-label text-xs">
                  Income Certificate Availability <span className="req-star">*</span>
                </label>
                <select
                  id="field-incomeCert"
                  className="field-select"
                  value={profile.incomeCertificateStatus}
                  onChange={(e) => handleChange('incomeCertificateStatus', e.target.value)}
                  required
                >
                  <option value="Yes - Revenue Authority Certificate Available">
                    Yes &mdash; Revenue Authority / Tehsildar Certificate Available
                  </option>
                  <option value="Applied / In Progress with Taluk Office">
                    Applied &mdash; In Progress with Taluk Office
                  </option>
                  <option value="No / Income Above Maximum Quota Threshold">
                    No &mdash; Income Above Maximum Quota Threshold
                  </option>
                </select>
              </div>

              {/* Family Occupation (Optional) */}
              <div className="form-field-group span-full">
                <label htmlFor="field-familyOccupation" className="field-label text-xs">
                  Primary Family Occupation <span className="opt-tag">(Optional)</span>
                </label>
                <input
                  id="field-familyOccupation"
                  type="text"
                  className="field-input"
                  value={profile.familyOccupation}
                  onChange={(e) => handleChange('familyOccupation', e.target.value)}
                  placeholder="e.g. Agriculture, Public Sector Employee, Private Service"
                />
              </div>
            </div>
          </section>

          {/* Section 4: Eligibility & Reservation Criteria */}
          <section className="profile-section-card card" aria-labelledby="eligibility-info-heading">
            <div className="section-header-row">
              <div className="section-title-wrap">
                <ShieldAlert size={20} className="section-crest-icon" />
                <div>
                  <h2 id="eligibility-info-heading" className="section-heading-text">
                    4. Eligibility &amp; Reservation Criteria
                  </h2>
                  <span className="text-xs text-muted">Category quotas, regional domicile, and special allowances</span>
                </div>
              </div>
            </div>

            <div className="fields-grid grid-2-col">
              {/* Category */}
              <div className="form-field-group">
                <label htmlFor="field-category" className="field-label text-xs">
                  Social / Caste Category <span className="req-star">*</span>
                </label>
                <select
                  id="field-category"
                  className="field-select"
                  value={profile.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Domicile State */}
              <div className="form-field-group">
                <label htmlFor="field-domicileState" className="field-label text-xs">
                  Permanent Domicile State <span className="req-star">*</span>
                </label>
                <select
                  id="field-domicileState"
                  className="field-select"
                  value={profile.domicileState}
                  onChange={(e) => handleChange('domicileState', e.target.value)}
                  required
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Disability Status (Optional) */}
              <div className="form-field-group">
                <label htmlFor="field-disability" className="field-label text-xs">
                  Persons with Benchmark Disabilities (PwD) <span className="opt-tag">(Optional)</span>
                </label>
                <select
                  id="field-disability"
                  className="field-select"
                  value={profile.disabilityStatus}
                  onChange={(e) => handleChange('disabilityStatus', e.target.value)}
                >
                  <option value="None">None</option>
                  <option value="Visual Impairment (40%+)">Visual Impairment (40%+)</option>
                  <option value="Locomotor Disability (40%+)">Locomotor Disability (40%+)</option>
                  <option value="Hearing Impairment">Hearing Impairment</option>
                  <option value="Other Disability Quota">Other Disability Quota</option>
                </select>
              </div>

              {/* Minority Status (Optional) */}
              <div className="form-field-group">
                <label htmlFor="field-minority" className="field-label text-xs">
                  Religious / Linguistic Minority <span className="opt-tag">(Optional)</span>
                </label>
                <select
                  id="field-minority"
                  className="field-select"
                  value={profile.minorityStatus}
                  onChange={(e) => handleChange('minorityStatus', e.target.value)}
                >
                  <option value="Not Applicable">Not Applicable</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Jain">Jain</option>
                  <option value="Parsi (Zoroastrian)">Parsi (Zoroastrian)</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section 5: Interests and Goals */}
          <section className="profile-section-card card" aria-labelledby="goals-info-heading">
            <div className="section-header-row">
              <div className="section-title-wrap">
                <Compass size={20} className="section-crest-icon" />
                <div>
                  <h2 id="goals-info-heading" className="section-heading-text">
                    5. Academic Goals &amp; Career Aspirations
                  </h2>
                  <span className="text-xs text-muted">Used by the AI Assistant to personalize essay drafts</span>
                </div>
              </div>
            </div>

            <div className="fields-grid grid-1-col">
              {/* Preferred Scholarship Type */}
              <div className="form-field-group">
                <label htmlFor="field-prefScholarship" className="field-label text-xs">
                  Preferred Scholarship Focus <span className="req-star">*</span>
                </label>
                <select
                  id="field-prefScholarship"
                  className="field-select"
                  value={profile.preferredScholarshipType}
                  onChange={(e) => handleChange('preferredScholarshipType', e.target.value)}
                  required
                >
                  {SCHOLARSHIP_PREFERENCES.map((pref) => (
                    <option key={pref} value={pref}>
                      {pref}
                    </option>
                  ))}
                </select>
              </div>

              {/* Career Goals */}
              <div className="form-field-group">
                <label htmlFor="field-careerGoals" className="field-label text-xs">
                  Target Career Goals <span className="req-star">*</span>
                </label>
                <input
                  id="field-careerGoals"
                  type="text"
                  className="field-input"
                  value={profile.careerGoals}
                  onChange={(e) => handleChange('careerGoals', e.target.value)}
                  placeholder="e.g. AI Research Scientist & Systems Software Engineer"
                  required
                />
              </div>

              {/* Areas of Interest */}
              <div className="form-field-group">
                <label htmlFor="field-areasOfInterest" className="field-label text-xs">
                  Areas of Academic Interest <span className="req-star">*</span>
                </label>
                <input
                  id="field-areasOfInterest"
                  type="text"
                  className="field-input"
                  value={profile.areasOfInterest}
                  onChange={(e) => handleChange('areasOfInterest', e.target.value)}
                  placeholder="e.g. Machine Learning, Cloud Architecture, Open Source Tools"
                  required
                />
              </div>

              {/* Short Description */}
              <div className="form-field-group">
                <label htmlFor="field-aspirations" className="field-label text-xs">
                  Summary of Academic Aspirations &amp; Need <span className="req-star">*</span>
                </label>
                <textarea
                  id="field-aspirations"
                  rows={4}
                  className="field-textarea"
                  value={profile.aspirationsDescription}
                  onChange={(e) => handleChange('aspirationsDescription', e.target.value)}
                  placeholder="Describe your academic passion, what drives your studies, and how scholarship funding will empower your goals..."
                  required
                />
                <span className="field-helper-hint text-xs text-muted">
                  This narrative will automatically seed your Statement of Purpose in the AI Essay Assistant.
                </span>
              </div>
            </div>
          </section>

          {/* Bottom Form Actions */}
          <div className="form-bottom-actions-strip">
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleReset}
            >
              <RotateCcw size={15} /> Reset to Demo Defaults
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
            >
              <Save size={16} /> Save Student Profile
            </button>
          </div>
        </form>

        {/* Right Column: Sticky Profile Strength & Metrics Card */}
        <div className="profile-sidebar-column">
          <div className="sticky-profile-card-wrapper">
            <ProfileCompletionCard
              profile={profile}
              completionPercentage={completionPercentage}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
