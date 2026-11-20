/**
 * Scholarship Match - Sample Dashboard Data
 *
 * NOTE: The scholarship programs, deadlines, and requirements listed below
 * are realistic illustrative examples relevant to Indian college students.
 * They are provided strictly for demonstration and development purposes.
 * Deadlines and criteria do not represent verified or official figures.
 */

export const studentProfile = {
  name: 'Anvaya Sharma',
  firstName: 'Anvaya',
  role: 'Student',
  avatarInitials: 'AS',
  field: 'Computer Science & Engineering',
  degree: 'B.Tech (2nd Year)',
  institution: 'Delhi Technological University',
  profileCompletion: 80,
}

export const dashboardStats = [
  {
    id: 'matches',
    title: 'Total Matches',
    value: '24',
    subtitle: '12 new this week',
    iconName: 'Sparkles',
    accentColor: 'var(--color-brass)',
    accentBg: 'var(--color-brass-subtle)',
    badgeText: '+4 high match',
    badgeType: 'brass',
  },
  {
    id: 'applied',
    title: 'Applications Submitted',
    value: '5',
    subtitle: '2 currently under review',
    iconName: 'ClipboardCheck',
    accentColor: 'var(--color-midnight)',
    accentBg: 'var(--color-midnight-subtle)',
    badgeText: 'Active',
    badgeType: 'indigo',
  },
  {
    id: 'documents',
    title: 'Documents Pending',
    value: '3',
    subtitle: 'Required for verification',
    iconName: 'FolderClock',
    accentColor: 'var(--color-currant)',
    accentBg: 'var(--color-currant-subtle)',
    badgeText: 'Action needed',
    badgeType: 'currant',
  },
  {
    id: 'deadlines',
    title: 'Upcoming Deadlines',
    value: '4',
    subtitle: 'Within the next 30 days',
    iconName: 'CalendarClock',
    accentColor: '#9e631b',
    accentBg: 'rgba(158, 99, 27, 0.12)',
    badgeText: 'Closest: 5d',
    badgeType: 'currant',
  },
]

export const recommendedScholarships = [
  {
    id: 'csss-scholarship',
    name: 'Central Sector Scheme of Scholarships (CSSS)',
    provider: 'Department of Higher Education, Govt. of India',
    amount: '₹20,000 / year',
    eligibilityMatch: 96,
    deadline: 'December 15, 2026',
    category: 'Government • Merit-Cum-Means',
    shortDescription:
      'Provides financial support to meritorious students from economically weaker sections pursuing full-time college and graduate degree programs.',
    details: {
      overview:
        'Awarded by the Ministry of Education to top percentile scorers in Class 12 board examinations to assist with annual tuition and hostel expenses.',
      eligibility: [
        'Above 80th percentile in the relevant stream in Class 12 / Higher Secondary Exam.',
        'Enrolled in a recognized regular degree/diploma college course.',
        'Annual family income less than ₹4.5 Lakh per annum.',
        'Not receiving any other Central or State government scholarship.',
      ],
      benefits:
        '₹12,000 per annum for the first three undergraduate years, increasing to ₹20,000 per annum at the postgraduate level.',
      documentsRequired: [
        'Class 12 Marksheet & Passing Certificate',
        'Income Certificate issued by competent Revenue Authority',
        'College Bonafide Student Certificate',
        'Aadhaar-linked Bank Account Passbook',
      ],
    },
    isSampleData: true,
  },
  {
    id: 'reliance-foundation-ug',
    name: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation',
    amount: 'Up to ₹2,00,000',
    eligibilityMatch: 92,
    deadline: 'January 10, 2027',
    category: 'Foundation • All Disciplines',
    shortDescription:
      'Enables high-potential undergraduate students across engineering, sciences, and commerce to pursue their degree with mentorship and leadership opportunities.',
    details: {
      overview:
        'One of India’s premier private scholarship programs, selecting scholars through an aptitude test and academic merit review.',
      eligibility: [
        'Resident Indian citizen currently enrolled in 1st or 2nd year of undergraduate study.',
        'Minimum 60% aggregate marks in standard 12th board examination.',
        'Household income preferably below ₹15 Lakhs (priority given to below ₹2.5 Lakhs).',
        'Open to students across all major academic disciplines.',
      ],
      benefits:
        'Grant of up to ₹2,00,000 over the duration of the degree course, coupled with leadership workshops and alumni network access.',
      documentsRequired: [
        'Current College Enrollment / Admission Letter',
        'Class 10 & 12 Academic Transcripts',
        'Family Income Proof (ITR / Income Certificate)',
        'Statement of Purpose & Personal Essay',
      ],
    },
    isSampleData: true,
  },
  {
    id: 'hdfc-parivartan-ecss',
    name: "HDFC Bank Parivartan's ECSS Programme",
    provider: 'HDFC Bank Parivartan',
    amount: 'Up to ₹75,000',
    eligibilityMatch: 88,
    deadline: 'December 22, 2026',
    category: 'Corporate CSR • Need-Based Support',
    shortDescription:
      'Educational Crisis Scholarship Support targeting students undergoing personal or financial hardship to ensure uninterrupted continuation of their college education.',
    details: {
      overview:
        'HDFC Bank’s social initiative designed to assist students whose families are undergoing unexpected crisis or financial strain.',
      eligibility: [
        'Open to Indian students studying in general or professional undergraduate programs.',
        'Must have passed the previous qualifying examination with at least 55% marks.',
        'Annual family income must be equal to or less than ₹2.5 Lakhs.',
        'Preference given to students facing family or medical crises in the past 3 years.',
      ],
      benefits:
        'Direct bank transfer covering tuition fees and study-related expenses up to ₹75,000 for the academic session.',
      documentsRequired: [
        'Previous Year Academic Marksheet',
        'College Fee Receipt for Current Academic Year',
        'Proof of Family Crisis or Low-Income Certificate',
        'Applicant Student ID Card & Bank Account Proof',
      ],
    },
    isSampleData: true,
  },
]

export const upcomingDeadlines = [
  {
    id: 'dl-1',
    name: 'Central Sector Scheme of Scholarships (CSSS)',
    deadlineDate: 'Dec 15, 2026',
    daysRemaining: 5,
    urgencyLevel: 'high',
    status: 'Draft Saved',
    isSampleData: true,
  },
  {
    id: 'dl-2',
    name: "HDFC Bank Parivartan's ECSS Programme",
    deadlineDate: 'Dec 22, 2026',
    daysRemaining: 12,
    urgencyLevel: 'medium',
    status: 'Documents Pending',
    isSampleData: true,
  },
  {
    id: 'dl-3',
    name: 'Reliance Foundation Undergraduate Scholarship',
    deadlineDate: 'Jan 10, 2027',
    daysRemaining: 31,
    urgencyLevel: 'normal',
    status: 'Not Started',
    isSampleData: true,
  },
  {
    id: 'dl-4',
    name: 'Inspire Scholarship for Higher Education (SHE)',
    deadlineDate: 'Jan 25, 2027',
    daysRemaining: 46,
    urgencyLevel: 'normal',
    status: 'Eligible',
    isSampleData: true,
  },
]

export const quickActions = [
  {
    id: 'complete-profile',
    title: 'Complete Your Profile',
    description: 'Add family income & entrance score details to unlock 12 more matches.',
    iconName: 'UserCheck',
    route: '/settings',
    badgeText: '80% complete',
    btnLabel: 'Update Profile',
  },
  {
    id: 'find-scholarships',
    title: 'Find Scholarships',
    description: 'Explore 24+ curated merit, government, and corporate scholarship programs.',
    iconName: 'Compass',
    route: '/find-scholarships',
    badgeText: '24 Available',
    btnLabel: 'Browse All',
  },
  {
    id: 'upload-documents',
    title: 'Upload Documents',
    description: 'Upload your verified income certificate and marksheet for fast application.',
    iconName: 'UploadCloud',
    route: '/documents',
    badgeText: '3 pending',
    btnLabel: 'Upload Files',
  },
]

export const sampleNotifications = [
  {
    id: 'notif-1',
    title: 'New High Match Found (96%)',
    message: 'Central Sector Scheme matches your engineering profile criteria.',
    time: '2 hours ago',
    unread: true,
    type: 'match',
  },
  {
    id: 'notif-2',
    title: 'Upcoming Deadline Alert',
    message: 'Central Sector Scheme application closes in 5 days (Dec 15).',
    time: '1 day ago',
    unread: true,
    type: 'deadline',
  },
  {
    id: 'notif-3',
    title: 'Document Verification Reminder',
    message: 'Please upload your 2nd year bonafide certificate before submitting.',
    time: '3 days ago',
    unread: false,
    type: 'document',
  },
]
