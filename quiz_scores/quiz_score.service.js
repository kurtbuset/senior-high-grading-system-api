const db = require("../_helpers/db");

module.exports = {
  addRawScore,
};

async function addRawScore(params) {
  // ✅ 1. Check if quiz exists
  const quiz = await db.Quiz.findByPk(params.quiz_id);
  // console.log(quiz)
  if (!quiz) {
    throw "Quiz not found";
  }

  // ✅ 2. Check if enrollment exists
  const enrollment = await db.Enrollment.findByPk(params.enrollment_id);
  if (!enrollment) {
    throw "Enrollment not found";
  }

  if (!enrollment.is_enrolled) {
    throw("This student is not enrolled in the selected subject.");
  }

  const existing = await db.Quiz_Score.findOne({
    where: { quiz_id: params.quiz_id, enrollment_id: params.enrollment_id },
  });
  if (existing) {
    throw new Error("Score for this student and quiz already exists");
  }

  if (params.raw_score > quiz.hps) {
    throw new Error(
      `Raw score (${params.raw_score}) cannot be higher than HPS (${quiz.hps})`
    );
  }

  const quizScore = new db.Quiz_Score(params);
  await quizScore.save();

  return quizScore;
}

function basicDetails(quiz) {
  const { quiz_id, enrollment_id, raw_score } = quiz;
  return { quiz_id, enrollment_id, raw_score };
}
