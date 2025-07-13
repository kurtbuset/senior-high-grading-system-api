const db = require("../_helpers/db");

module.exports = {
  addQuiz,
  getQuizzes,
  updateQuiz
};

async function addQuiz(params) {
  if (params.type === 'Quarterly Assesment') {
    const existing = await db.Quiz.findOne({
      where: {
        teacher_subject_id: params.teacher_subject_id,
        quarter: params.quarter,
        type: 'Quarterly Assesment'
      }
    });

    if (existing) {
      throw 'Only one Quarterly Assessment is allowed per subject and quarter.';
    }
  }
  
  const quiz = new db.Quiz(params)
  await quiz.save()
}

async function updateQuiz(id, params) {

  const quiz = await db.Quiz.findByPk(id)
  Object.assign(quiz, params)

  await quiz.save()

}

async function getQuizzes(teacher_subject_id, param){

  const quizzes = await db.Quiz.findAll({
    where: {
      teacher_subject_id,
      quarter: param.quarter,
      type: param.type
    },
    attributes: ["id", "description", "hps"]
  })
  
  // console.log(JSON.stringify(quizzes, null, 2))
  return quizzes
}



function basicDetails(quiz) {
  const { id, teacher_subject_id, type, quarter, description, hps } = quiz;
  return { id, teacher_subject_id, type, quarter, description, hps };
}
