// Hard eligibility rules. Returns true only if the student could actually apply.
// Used by both the matching endpoint and the deadline reminders.
function isEligible(scholarship, profile) {
  const stateOk = scholarship.state === "All" || scholarship.state === profile.state;
  const categoryOk = scholarship.category === "All" || scholarship.category === profile.category;
  const levelOk =
    scholarship.education_level === "All" || scholarship.education_level === profile.education_level;

  const genderOk =
    scholarship.gender_required === "All" || scholarship.gender_required === profile.gender;

  const disabilityOk = !scholarship.requires_disability || profile.has_disability === true;

  // Income: only enforced if both the scholarship has a limit AND the student gave an income
  const incomeOk =
    scholarship.max_income == null ||
    profile.family_income == null ||
    profile.family_income <= scholarship.max_income;

  return stateOk && categoryOk && levelOk && genderOk && disabilityOk && incomeOk;
}

module.exports = { isEligible };