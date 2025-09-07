const db = require("../_helpers/db");

module.exports = {
  addRawScore,
  getStudentsWithoutScores,
  getStudentsWithScores,
  updateRawScore,
};

async function getStudentsWithScores(quiz_id) {
  const results = await db.Quiz_Score.findAll({
    where: { quiz_id },
    attributes: ["enrollment_id", "raw_score"],
    include: [
      {
        model: db.Enrollment,
        include: [
          {
            model: db.Student,
            include: [
              {
                model: db.Account,
                attributes: ["firstName", "lastName"],
              },
            ],
          },
        ],
      },
    ],
  });

  // Format and sort the data
  const students = results
    .map((score) => ({
      enrollment_id: score.enrollment_id,
      raw_score: score.raw_score,
      firstName: score.enrollment.student.account.firstName,
      lastName: score.enrollment.student.account.lastName,
    }))
    .sort((a, b) => a.lastName.localeCompare(b.lastName)); // Sort by lastName A-Z

  console.log(JSON.stringify(students, null, 2));
  return students;
}



async function getStudentsWithoutScores({ teacher_subject_id, quiz_id }) {
  console.log({ teacher_subject_id, quiz_id }); // For debugging

  const enrollments = await db.Enrollment.findAll({
    where: {
      teacher_subject_id,
      is_enrolled: true,
    },
    include: [
      {
        model: db.Student,
        include: [
          {
            model: db.Account,
            attributes: ["firstName", "lastName"],
          },
        ],
      },
      {
        model: db.Quiz_Score,
        required: false, // left join so we still get enrollments even if no matching quiz score exists
        where: { quiz_id },
        attributes: ["raw_score"],
      },
    ],
  });

  // Filter out students that already have a quiz score and sort by lastName
  const studentsWithoutScores = enrollments
    .filter((enrollment) => enrollment.quiz_scores.length === 0)
    .map((enrollment) => ({
      enrollment_id: enrollment.id,
      firstName: enrollment.student.account.firstName,
      lastName: enrollment.student.account.lastName,
    }))
    .sort((a, b) => a.lastName.localeCompare(b.lastName)); // A-Z sort

  return studentsWithoutScores;
}


async function addRawScore(params) {
  console.log(params);

  const result = await db.Quiz_Score.bulkCreate(params, {
    ignoreDuplicates: true, // Will silently skip duplicates
    validate: true, // Validate each object
  });

  return result;
}

async function updateRawScore(params) {
  console.log(params);

  const result = await db.Quiz_Score.bulkCreate(params, {
    updateOnDuplicate: ["raw_score"],
    validate: true,
  });

  return result;
}
// function basicDetails(quiz) {
//   const { quiz_id, enrollment_id, raw_score } = quiz;
//   return { quiz_id, enrollment_id, raw_score };
// }
