const db = require("../_helpers/db");

module.exports = {
  create
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

  return await db.Curriculum_Subject.create(params)
}