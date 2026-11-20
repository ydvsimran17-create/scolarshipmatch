require("dotenv").config();
const { sequelize, connectDb } = require("./config/db");
const Scholarship = require("./models/Scholarship");
const { getEmbedding } = require("./utils/embeddings");

// NOTE: income limits and deadlines are approximate placeholders.
// Verify every detail on the official portal before a demo.
const scholarships = [
  {
    name: "National Means-cum-Merit Scholarship",
    provider: "Ministry of Education, Govt. of India",
    eligibility_text: "For students from economically weaker sections studying in class 9-12 with strong academic merit.",
    max_income: 350000, category: "All", state: "All", education_level: "School",
    gender_required: "All", requires_disability: false,
    amount: "₹12,000/year", deadline: "2027-01-31", link: "https://scholarships.gov.in",
  },
  {
    name: "Post Matric Scholarship for SC Students",
    provider: "Ministry of Social Justice and Empowerment",
    eligibility_text: "For SC category students pursuing post-matriculation studies, subject to family income limits.",
    max_income: 250000, category: "SC", state: "All", education_level: "All",
    gender_required: "All", requires_disability: false,
    amount: "Varies by course", deadline: "2026-12-20", link: "https://scholarships.gov.in",
  },
  {
    name: "Post Matric Scholarship for ST Students",
    provider: "Ministry of Tribal Affairs",
    eligibility_text: "For ST category students pursuing post-matriculation studies in recognised institutions, subject to family income limits.",
    max_income: 250000, category: "ST", state: "All", education_level: "All",
    gender_required: "All", requires_disability: false,
    amount: "Varies by course", deadline: "2026-12-28", link: "https://scholarships.gov.in",
  },
  {
    name: "Post Matric Scholarship for Minority Students",
    provider: "Ministry of Minority Affairs",
    eligibility_text: "For students from notified minority communities pursuing post-matric or professional courses, who scored well in previous exams and meet family income limits.",
    max_income: 200000, category: "Minority", state: "All", education_level: "All",
    gender_required: "All", requires_disability: false,
    amount: "Varies by course", deadline: "2027-01-20", link: "https://scholarships.gov.in",
  },
  {
    name: "Uttar Pradesh State Scholarship",
    provider: "Government of Uttar Pradesh",
    eligibility_text: "For domiciled students of Uttar Pradesh from OBC/SC/ST/General categories, based on family income.",
    max_income: 200000, category: "All", state: "Uttar Pradesh", education_level: "All",
    gender_required: "All", requires_disability: false,
    amount: "Varies by course", deadline: "2027-01-10", link: "https://scholarship.up.gov.in",
  },
  {
    name: "AICTE Pragati Scholarship for Girls",
    provider: "AICTE",
    eligibility_text: "For girl students pursuing technical education (engineering/diploma) with family income limits.",
    max_income: 800000, category: "All", state: "All", education_level: "Undergraduate",
    gender_required: "Female", requires_disability: false,
    amount: "₹50,000/year", deadline: "2027-02-05", link: "https://www.aicte-pragati-saksham-gov.in",
  },
  {
    name: "AICTE Saksham Scholarship for Specially-Abled Students",
    provider: "AICTE",
    eligibility_text: "For students with disabilities pursuing technical education (engineering/diploma), subject to family income limits.",
    max_income: 800000, category: "All", state: "All", education_level: "Undergraduate",
    gender_required: "All", requires_disability: true,
    amount: "See official website", deadline: "2027-02-10", link: "https://www.aicte-pragati-saksham-gov.in",
  },
  {
    name: "Central Sector Scholarship Scheme",
    provider: "Ministry of Education, Govt. of India",
    eligibility_text: "For students who scored above 80th percentile in class 12 boards, from families with income limits.",
    max_income: 450000, category: "All", state: "All", education_level: "Undergraduate",
    gender_required: "All", requires_disability: false,
    amount: "₹20,000/year", deadline: "2027-03-15", link: "https://scholarships.gov.in",
  },
  {
    name: "INSPIRE Scholarship for Higher Education",
    provider: "Department of Science and Technology",
    eligibility_text: "For high-performing students in class 12 boards who pursue undergraduate or integrated programmes in natural and basic sciences such as physics, chemistry, mathematics and biology.",
    max_income: null, category: "All", state: "All", education_level: "Undergraduate",
    gender_required: "All", requires_disability: false,
    amount: "See official website", deadline: "2027-02-28", link: "https://online-inspire.gov.in",
  },
  {
    name: "Swami Vivekananda Single Girl Child Scholarship",
    provider: "University Grants Commission",
    eligibility_text: "For single girl children pursuing full-time postgraduate studies in recognised universities.",
    max_income: null, category: "All", state: "All", education_level: "Postgraduate",
    gender_required: "Female", requires_disability: false,
    amount: "See official website", deadline: "2027-03-01", link: "https://www.ugc.gov.in",
  },
  {
    name: "Reliance Foundation Undergraduate Scholarship",
    provider: "Reliance Foundation",
    eligibility_text: "For first-year undergraduate students across streams, selected on a mix of academic merit and financial need.",
    max_income: 1500000, category: "All", state: "All", education_level: "Undergraduate",
    gender_required: "All", requires_disability: false,
    amount: "See official website", deadline: "2027-04-10", link: "https://reliancefoundation.org",
  },
  {
    name: "Kotak Kanya Scholarship",
    provider: "Kotak Education Foundation",
    eligibility_text: "For meritorious girl students from low-income families pursuing professional undergraduate courses such as engineering, medicine or design.",
    max_income: 600000, category: "All", state: "All", education_level: "Undergraduate",
    gender_required: "Female", requires_disability: false,
    amount: "See official website", deadline: "2027-03-20", link: "https://www.kotak.com",
  },
];

(async () => {
  await connectDb();
  await sequelize.sync();

  await Scholarship.destroy({ where: {} }); // clear old rows so re-running doesn't duplicate

  console.log("[seed] Computing embeddings for each scholarship (this may take a moment)...");

  for (const s of scholarships) {
    const embedding = await getEmbedding(s.eligibility_text);
    await Scholarship.create({ ...s, embedding });
    console.log(`[seed] Added: ${s.name}`);
  }

  console.log(`[seed] Inserted ${scholarships.length} scholarships with embeddings.`);
  process.exit(0);
})();