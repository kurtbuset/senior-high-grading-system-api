const db = require("../_helpers/db");

module.exports = {
  create,
  getFilteredSubjects
}

async function getFilteredSubjects({ grade_level, strand, semester, school_year }) {
  // If no filters, return ALL subjects
  if (!grade_level && !strand && !semester && !school_year) {
    return db.Subject.findAll();  // plain list of all subjects
  }

  const where = {};

  if (semester) {
    where.semester = semester;
  }

  const include = [
    { model: db.Subject, as: "subject" }, 
    { model: db.Grade_Level, as: "grade_level" },
    { model: db.Strand, as: "strand" },
    { model: db.School_Year, as : "school_year" }
  ];

  // Apply grade_level filter (match by level)
  if (grade_level) {
    include[1].where = { level: grade_level };
  }

  // Apply strand filter (match by code)
  if (strand) {
    include[2].where = { code: strand };
  }

  // Apply school_year filter (match by school_year string)
  if (school_year) {
    include[3].where = { school_year };
  }

  const results = await db.Curriculum_Subject.findAll({
    where,
    include
  });

  console.log(JSON.stringify(results, null, 2))
  // Map only to subject info
  return results.map(cs => cs.subject);
}


async function create(params){
   // check subject
  const subject = await db.Subject.findByPk(params.subject_id);
  if (!subject) {
    throw `Subject with id ${params.subject_id} not found`;
  }

  // check grade level
  const gradeLevel = await db.Grade_Level.findByPk(params.grade_level_id);
  if (!gradeLevel) {
    throw `Grade level with id ${params.grade_level_id} not found`;
  }

  // check strand
  const strand = await db.Strand.findByPk(params.strand_id);
  if (!strand) {
    throw `Strand with id ${params.strand_id} not found`;
  }

  const school_year = await db.School_Year.findByPk(params.strand_id);
  if (!school_year) {
    throw `school year with id ${params.strand_id} not found`;
  }

  return await db.Curriculum_Subject.create(params)
}