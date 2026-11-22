/**
 * Scholarship Match - AI Essay Assistant Sample Templates & Data
 *
 * NOTE: All draft templates, mock generator responses, and writing guidance
 * below are educational illustrative examples.
 * The system operates in DEMO MODE until actual backend AI integration is completed.
 */

export const ESSAY_TYPES = [
  'Statement of Purpose',
  'Scholarship Essay',
  'Personal Statement',
  'Why I Deserve This Scholarship',
  'Career Goals',
]

export const WRITING_TONES = [
  'Professional',
  'Personal',
  'Motivational',
  'Formal',
]

export const WORD_LIMITS = [
  { label: '250 words (Concise Summary)', value: 250 },
  { label: '500 words (Standard Essay)', value: 500 },
  { label: '750 words (Detailed Statement)', value: 750 },
  { label: '1000 words (Comprehensive SOP)', value: 1000 },
]

export const ESSAY_PROMPTS = {
  'Statement of Purpose':
    'Describe your academic background, areas of research interest, and how this scholarship will enable you to achieve your future professional aspirations.',
  'Scholarship Essay':
    'Discuss an academic challenge you encountered in your undergraduate studies, how you addressed it, and what you learned from the experience.',
  'Personal Statement':
    'Share your personal background, what inspired your journey into technology, and how your community experiences shape your worldview.',
  'Why I Deserve This Scholarship':
    'Explain your academic dedication, family financial context, and why you are an ideal candidate to receive this scholarship grant.',
  'Career Goals':
    'Outline your 5-year and 10-year professional objectives in engineering and how this scholarship accelerates your career milestones.',
}

export const initialSavedDrafts = [
  {
    id: 'draft-adobe-sop',
    title: 'Statement of Purpose - Adobe Women in Technology',
    essayType: 'Statement of Purpose',
    scholarshipName: 'Adobe Women in Technology Scholarship',
    wordLimit: 500,
    tone: 'Motivational',
    useProfileContext: true,
    lastUpdated: 'Nov 12, 2026',
    lastUpdatedIso: '2026-11-12',
    content: `From my earliest experiences with computer programming, I have been captivated by the potential of software to solve systemic challenges and empower underserved communities. As a second-year Computer Science and Engineering student at Delhi Technological University, my academic journey has centered on developing robust, scalable solutions in machine learning and distributed computing.

Growing up with a deep appreciation for the transformative power of education, I have maintained rigorous academic dedication, securing top percentiles in my coursework. However, access to specialized compute hardware, research publications, and developer conferences has often presented financial constraints for my household. The Adobe Women in Technology Scholarship represents not merely financial assistance, but a vital catalyst that will bridge the gap between theoretical knowledge and impactful research.

Through this opportunity, I aspire to lead projects that improve computational accessibility and mentor younger women entering STEM disciplines. I am deeply committed to leveraging my technical training to build inclusive systems, and this fellowship will provide the mentorship and financial stability necessary to dedicate myself fully to technological innovation and academic leadership.`,
  },
  {
    id: 'draft-csss-merit',
    title: 'Why I Deserve the Central Sector Scheme Award',
    essayType: 'Why I Deserve This Scholarship',
    scholarshipName: 'Central Sector Scheme of Scholarships (CSSS)',
    wordLimit: 500,
    tone: 'Formal',
    useProfileContext: true,
    lastUpdated: 'Oct 28, 2026',
    lastUpdatedIso: '2026-10-28',
    content: `I am writing to formally submit my candidature for the Central Sector Scheme of Scholarship for College and University Students for the 2026–2027 academic cycle. Having secured an aggregate above the 80th percentile in my senior secondary board examinations, I have consistently prioritized scholastic excellence and disciplined inquiry throughout my degree in Computer Science and Engineering at Delhi Technological University.

Pursuing a rigorous engineering curriculum requires continuous investment in academic textbooks, digital software tools, and institutional fees. While my family has steadfastly supported my educational pursuits within our modest annual income ceiling, this scholarship will significantly alleviate semester expenses, enabling me to focus undistracted on technical coursework and laboratory experiments.

Awarding this financial assistance will affirm the meritocratic values upheld by the Department of Higher Education. I pledge to maintain the required academic benchmarks, uphold institutional integrity, and utilize this government assistance as a foundation for contributing meaningfully to India's technological and research capabilities.`,
  },
]

export const ESSAY_TIPS = [
  {
    title: 'Open with a Captivating Hook',
    description:
      'Avoid cliché introductions like "My name is...". Instead, start with an engaging problem, a pivotal moment of curiosity, or a clear personal conviction.',
  },
  {
    title: 'Quantify Impact & Evidence',
    description:
      'Support claims with concrete specifics: mention your academic percentile, specific coursework, research tools, or leadership milestones.',
  },
  {
    title: 'Connect Need with Ambition',
    description:
      'Frame financial assistance not solely as a hardship relief, but as an investment in your ability to innovate, research, and give back.',
  },
  {
    title: 'Tailor to Awarding Organization',
    description:
      'Reference the awarding body’s mission (e.g. scientific advancement, women in STEM, community upliftment) directly in your narrative.',
  },
]

export const ESSAY_STRUCTURE = [
  { stage: '1. Compelling Introduction', desc: 'Hook the reader and introduce your core academic passion and target objective.' },
  { stage: '2. Academic Journey & Projects', desc: 'Highlight technical milestones, university projects, and disciplined work ethic.' },
  { stage: '3. Financial Context & Need', desc: 'Respectfully outline why this grant removes barriers to your education.' },
  { stage: '4. Future Vision & Career Goals', desc: 'Articulate 3–5 year aspirations and how you plan to contribute to society.' },
  { stage: '5. Conclusion & Forward Outlook', desc: 'Reiterate commitment and express genuine appreciation to the committee.' },
]

export const WRITING_CHECKLIST = [
  { id: 'chk-prompt', text: 'Directly addresses the scholarship essay prompt' },
  { id: 'chk-voice', text: 'Written in an authentic, personal, and active voice' },
  { id: 'chk-evidence', text: 'Includes specific academic and project examples' },
  { id: 'chk-limits', text: 'Adheres strictly to the requested word limit' },
  { id: 'chk-proofread', text: 'Proofread for clarity, tone, and grammar' },
]

/**
 * Generates a mock draft based on configuration parameters and student profile.
 */
export function generateMockDraft({
  essayType,
  scholarshipName,
  topic,
  tone,
  wordLimit,
  useProfileContext,
  studentProfile,
}) {
  const name = useProfileContext && studentProfile?.fullName ? studentProfile.fullName : '[Your Name]';
  const college = useProfileContext && studentProfile?.institution ? studentProfile.institution : '[Your Institution]';
  const course = useProfileContext && studentProfile?.course ? studentProfile.course : '[Your Course of Study]';
  const year = useProfileContext && studentProfile?.yearOfStudy ? studentProfile.yearOfStudy : '[Current Year]';
  const goals = useProfileContext && studentProfile?.careerGoals ? studentProfile.careerGoals : '[Your Target Career Goals]';
  const interests = useProfileContext && studentProfile?.areasOfInterest ? studentProfile.areasOfInterest : '[Key Technical & Research Interests]';

  const isShort = wordLimit <= 300;

  if (isShort) {
    return `Subject: ${essayType} — ${scholarshipName || 'Scholarship Application'}

As a dedicated ${year} student pursuing ${course} at ${college}, I, ${name}, am honored to address the inquiry: "${topic || 'Academic and Career Goals'}". My academic journey is driven by a deep aspiration to contribute to ${goals}, an ambition that demands disciplined scholarship and access to advanced research tools in ${interests}.

Securing the ${scholarshipName || 'scholarship award'} will provide vital financial relief for my academic expenses, allowing me to focus undistracted on technical innovation. In maintaining a ${tone.toLowerCase()} standard of scholastic excellence, I am prepared to maximize this award to achieve impactful milestones.`;
  }

  return `Introduction & Academic Foundation:
I am writing this ${essayType} to address the scholarship theme: "${topic || 'Academic Background and Aspirations'}". My name is ${name}, currently pursuing my ${year} of ${course} at ${college}. My academic pursuit centers on ${interests}, areas where I believe structured inquiry and practical innovation can generate lasting societal benefit.

Academic Milestones & Dedication:
Throughout my studies, I have upheld rigorous academic standards, actively engaging in laboratory projects, peer mentorship, and collaborative problem-solving. [Insert specific project title or research initiative undertaken during your college tenure]. Navigating these demanding subjects has reinforced my ability to persevere through complex challenges and adapt swiftly to modern technological paradigms.

Financial Context & Need:
While my family has offered unwavering moral encouragement, the financial commitments of higher engineering education—including specialized laboratory software, technical reference texts, and semester tuition fees—place significant demands on our household resources. The ${scholarshipName || 'scholarship program'} represents a transformative opportunity that will alleviate these financial pressures, allowing me to dedicate my time to in-depth research and community mentorship without financial distraction.

Future Vision & Long-Term Impact:
Looking ahead, my primary career objective is to become a ${goals}, focusing on scalable and ethical solutions. I am committed to paying forward the opportunities I receive by mentoring future students from diverse backgrounds and participating in open technical initiatives. Receiving this grant will not only support my academic journey at ${college}, but also empower me to translate this education into meaningful societal contributions.

Conclusion:
In closing, I express my sincere appreciation to the selection committee for considering my ${essayType.toLowerCase()} for the ${scholarshipName || 'scholarship'}. Approaching this journey with a ${tone.toLowerCase()} and dedicated mindset, I look forward to upholding your values of excellence and integrity as I advance toward my professional aspirations.`;
}

/**
 * Text improvement and modifier functions.
 */
export function improveDraftText(text) {
  if (!text) return text;
  return text
    .replace(/I want to/g, 'I aspire to')
    .replace(/good at/g, 'proficient in')
    .replace(/hard/g, 'rigorous and challenging')
    .replace(/help me/g, 'significantly empower my academic trajectory')
    .replace(/big problem/g, 'critical societal and technological challenge');
}

export function shortenDraftText(text) {
  if (!text) return text;
  const paragraphs = text.split('\n\n');
  if (paragraphs.length <= 2) return text;
  // Keep first, middle summary, and conclusion
  return [paragraphs[0], paragraphs[Math.floor(paragraphs.length / 2)], paragraphs[paragraphs.length - 1]].join('\n\n');
}

export function expandDraftText(text) {
  if (!text) return text;
  return `${text}\n\nFurthermore, this scholarship will enable me to participate in specialized student research symposia, acquire certified technical credentials, and collaborate with faculty mentors on computational benchmarking studies. By removing financial hurdles, the award ensures that every academic milestone is pursued with undivided focus and uncompromising dedication.`;
}
