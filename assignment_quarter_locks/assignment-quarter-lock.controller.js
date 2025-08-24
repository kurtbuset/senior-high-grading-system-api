const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require("../_helpers/role");
const validateRequest = require("../_middleware/validate-request");
const finalGradeService = require("./final-grade.service");

router.post("/", authorize(), createSchema, create);

module.exports = router;

function createSchema(req, res, next){
  const schema = Joi.object({
    teacher_subject_id: Joi.number().required(),
    quarter: Joi.string().valid('First Quarter', 'Second Quarter').required(),
    is_locked: ,
  });

  validateRequest(req, next, schema);
}

function create(req, res, next) {
  finalGradeService
    .create(req.body)
     .then((result => {
      res.json(result)
    }))
    .catch(next)
}