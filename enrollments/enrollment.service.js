const db = require("../_helpers/db");

module.exports = {
  create,
};

async function create(params) {
  const enrollment = new db.Enrollment(params)
  
  enrollment.is_enrolled = false

  await enrollment.save()

  return basicDetails(enrollment)
}

function basicDetails(enrollment) {
  const { id, student_id, teacher_subject_id, is_enrolled } = enrollment
  return { id, student_id, teacher_subject_id, is_enrolled }
}