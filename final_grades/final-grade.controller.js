const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require("../_helpers/role");
const validateRequest = require("../_middleware/validate-request");
const finalGradeService = require("./final-grade.service");

router.post("/", authorize(), createSchema, create);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.array().items(
    Joi.object({
      enrollment_id: Joi.number().required(),
      final_grade: Joi.number().required(),
      quarter: Joi.string().valid("First Quarter", "Second Quarter").required(),
    })
  );

  validateRequest(req, next, schema);
}

function create(req, res, next) {
  finalGradeService
    .create(req.body)
    .then((finalGrades) => res.json(finalGrades))
    .catch(next);
}
