const db = require("../_helpers/db");

module.exports = {
  addHighestPossibleScore,
};

async function addHighestPossibleScore(params) {
  const teacher = await db.Teacher_Subject_Assignment.findOne({
    where: { id: params.teacher_subject_id },
  });

  if (!teacher) {
    throw "no teacher + subject was found in db men :(";
  }

  // Count existing quizzes for this subject, type, and quarter
  const existingCount = await db.Quiz.count({
    where: {
      teacher_subject_id: params.teacher_subject_id,
      type: params.type,
      quarter: params.quarter,
    },
  });

  // Set max allowed quizzes based on type
  const maxQuizzes = params.type === "Quarterly Assesment" ? 1 : 10;

  if (existingCount >= maxQuizzes) {
    throw `You have already reached the limit for ${params.type} in ${params.quarter}.`;
  }

  const quiz = new db.Quiz(params);
  await quiz.save();
  return basicDetails(quiz);
}

function basicDetails(quiz) {
  const { id, teacher_subject_id, type, quarter, description, hps } = quiz;
  return { id, teacher_subject_id, type, quarter, description, hps };
}
