const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require("../_helpers/role");
const validateRequest = require("../_middleware/validate-request");
const quizService = require("./quiz.service");

router.get("/semestral-final-grade/:id", authorize(), getSemestralFinalGrade);
router.get("/quarterly-grade-sheet/:id", authorize(), getQuarterlyGradeSheet);
router.get("/:id", authorize(), getQuizzes);
router.post("/", authorize(Role.Teacher), addQuizSchema, addQuiz);
router.put("/:id", authorize(Role.Teacher), updateQuizSchema, updateQuiz);
router.delete("/:id", authorize(Role.Teacher), deleteQuiz);

module.exports = router;

function deleteQuiz(req, res, next) {
  quizService
    .deleteQuiz(req.params.id)
    .then((_) => res.json({ msg: "Quiz deleted successfully" }))
    .catch(next);
}

function getSemestralFinalGrade(req, res, next) {
  quizService
    .getSemestralFinalGrade(req.params.id)
    .then((students) => {
      res.json(students);
    })
    .catch(next);
}

function getQuarterlyGradeSheet(req, res, next) {
  const { quarter } = req.query;
  quizService
    .getQuarterlyGradeSheet(req.params.id, { quarter })
    .then((students) => {
      res.json(students);
    })
    .catch(next);
}

function updateQuizSchema(req, res, next) {
  const schema = Joi.object({
    hps: Joi.number().min(1).required(),
    description: Joi.string().allow("").max(255).optional(),
  });
  validateRequest(req, next, schema);
}

function updateQuiz(req, res, next) {
  quizService
    .updateQuiz(req.params.id, req.body)
    .then((_) => {
      res.json({ msg: "lezgo" });
    })
    .catch(next);
}

function getQuizzes(req, res, next) {
  const { quarter, type } = req.query;
  quizService
    .getQuizzes(req.params.id, { quarter, type })
    .then((result) => res.json(result))
    .catch(next);
}

function addQuizSchema(req, res, next) {
  const schema = Joi.object({
    teacher_subject_id: Joi.number().required(),
    type: Joi.string()
      .valid("Written Work", "Performance Tasks", "Quarterly Assesment")
      .required(),
    quarter: Joi.string().valid("First Quarter", "Second Quarter").required(),
    description: Joi.string().allow("").max(255).optional(),
    hps: Joi.number().min(1).required(),
  });
  validateRequest(req, next, schema);
}

function addQuiz(req, res, next) {
  quizService
    .addQuiz(req.body)
    .then((_) => {
      res.json({ msg: "success boi" });
    })
    .catch(next);
}
