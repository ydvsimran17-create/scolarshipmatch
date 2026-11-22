/**
 * Scholarship Match - Student Profile Initial Data & Form Options
 *
 * NOTE: Initial profile details for Anvaya Sharma are sample demo defaults.
 * Any updates made by the student persist in localStorage.
 */

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Other / Union Territory',
]

export const EDUCATION_LEVELS = [
  'Undergraduate (B.Tech / B.E / B.Sc / B.Com / B.A)',
  'Postgraduate (M.Tech / M.Sc / M.Com / M.A / MBA)',
  'Doctoral / Ph.D.',
  'Diploma / Polytechnic',
  'Higher Secondary (Class 11 - 12)',
]

export const YEARS_OF_STUDY = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Final Year',
]

export const INCOME_SLABS = [
  'Under ₹2,50,000 (Low Income Group)',
  '₹2,50,000 – ₹4,50,000 (Lower Middle Income)',
  '₹4,50,000 – ₹8,00,000 (Middle Income Group)',
  'Above ₹8,00,000 per annum',
]

export const CATEGORIES = [
  'General',
  'OBC (Other Backward Classes)',
  'SC (Scheduled Castes)',
  'ST (Scheduled Tribes)',
  'EWS (Economically Weaker Section)',
  'Minority Community',
  'Other',
]

export const SCHOLARSHIP_PREFERENCES = [
  'Merit-Based Scholarships',
  'Need-Based / Financial Aid',
  'Women in STEM / Technical Grants',
  'Government / State Sponsored Schemes',
  'Corporate CSR & Foundation Grants',
  'Research & Fellowship Programs',
]

export const initialStudentProfile = {
  // 1. Personal Information
  fullName: 'Anvaya Sharma',
  email: 'anvaya.sharma@dtu.ac.in',
  phone: '+91 98765 43210',
  dob: '2005-04-14',
  gender: 'Female',
  state: 'Delhi (NCT)',
  city: 'New Delhi',

  // 2. Academic Information
  educationLevel: 'Undergraduate (B.Tech / B.E / B.Sc / B.Com / B.A)',
  institution: 'Delhi Technological University (DTU)',
  course: 'Computer Science & Engineering',
  yearOfStudy: '2nd Year',
  marksPercentage: '91.4%',
  academicYear: '2026–2027',

  // 3. Financial Information
  annualIncome: '₹2,50,000 – ₹4,50,000 (Lower Middle Income)',
  incomeCertificateStatus: 'Yes - Revenue Authority Certificate Available',
  familyOccupation: 'Salaried (Private / Service)',

  // 4. Eligibility Information
  category: 'General',
  domicileState: 'Delhi (NCT)',
  disabilityStatus: 'None',
  minorityStatus: 'Not Applicable',

  // 5. Interests and Goals
  preferredScholarshipType: 'Merit-Based Scholarships',
  careerGoals: 'AI Research Scientist & Systems Software Engineer',
  areasOfInterest: 'Machine Learning, Distributed Systems, Cloud Architecture, Open Source Tools',
  aspirationsDescription:
    'Aspiring to advance research in ethical artificial intelligence and computational efficiency. Seeking scholarship opportunities to fund specialized hardware labs, research conference attendance, and higher degree tuition.',
}

/**
 * Calculates profile completion percentage based on filled fields.
 */
export function calculateProfileCompletion(profile) {
  if (!profile) return 0

  const trackedFields = [
    // Personal (7)
    'fullName',
    'email',
    'phone',
    'dob',
    'gender',
    'state',
    'city',
    // Academic (6)
    'educationLevel',
    'institution',
    'course',
    'yearOfStudy',
    'marksPercentage',
    'academicYear',
    // Financial (3)
    'annualIncome',
    'incomeCertificateStatus',
    'familyOccupation',
    // Eligibility (4)
    'category',
    'domicileState',
    'disabilityStatus',
    'minorityStatus',
    // Interests & Goals (4)
    'preferredScholarshipType',
    'careerGoals',
    'areasOfInterest',
    'aspirationsDescription',
  ]

  let filledCount = 0
  trackedFields.forEach((key) => {
    const val = profile[key]
    if (val && typeof val === 'string' && val.trim().length > 0) {
      filledCount++
    }
  })

  return Math.round((filledCount / trackedFields.length) * 100)
}
