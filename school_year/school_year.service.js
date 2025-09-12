const db = require("../_helpers/db");

module.exports = {
  create
}

async function create(params){
  // 🔎 Check duplicate school year
  const exists = await db.School_Year.findOne({ where: { school_year: params.school_year } });
  if (exists) {
    throw `School year "${params.school_year}" already exists`;
  }

  // 🔎 Ensure only one active school year at a time
  if (params.is_active) {
    await db.School_Year.update(
      { is_active: false },
      { where: { is_active: true } }
    );
  }

  // ✅ Create new school year
  const schoolYear = await db.School_Year.create(params);
  return schoolYear;
}