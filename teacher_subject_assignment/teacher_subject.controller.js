const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Role = require('../_helpers/role')
const Joi = require("joi");
const teacherSubjectService = require('../teacher_subject_assignment/teacher_subject.service')
const validateRequest = require("../_middleware/validate-request");

router.get('/:id', authorize(), getOneSubject);
router.get('/list/:id', authorize(), getSubjectsByTeacherId);
router.post('/', authorize(Role.Admin), createSchema, create)

module.exports = router;

function getOneSubject(req, res, next){
  // console.log('ID: ', req.params.id)
  teacherSubjectService
    .getOneSubject(req.params.id)
    .then(subject => {
      res.json(subject)
    })  
    .catch(next)
}

function getSubjectsByTeacherId(req, res, next){
  teacherSubjectService
    .getSubjectsByTeacherId(req.params.id)
    .then(assignments => {
      // console.log(JSON.stringify(assignments, null, 2))
      res.json(assignments)
    })
    .catch(next);
}

function createSchema(req, res, next){
  const schema = Joi.object({
    teacher_id: Joi.number().required(),
    subject_id: Joi.number().required(),
    school_year: Joi.string().valid('2024-2025', '2025-2026').required(),
    grade_level: Joi.string().valid('11', '12').required(),
    section: Joi.string().required(),
    semester: Joi.string().valid('1st sem', '2nd sem').required(),

    custom_ww_percent: Joi.number().min(0).max(100).allow(null),
    custom_pt_percent: Joi.number().min(0).max(100).allow(null),
    custom_qa_percent: Joi.number().min(0).max(100).allow(null)
  }).custom((value, helpers) => {
    const { custom_ww_percent, custom_pt_percent, custom_qa_percent } = value;
    
    // If all 3 are provided, validate that they sum to 100
    if (
      custom_ww_percent != null &&
      custom_pt_percent != null &&
      custom_qa_percent != null
    ) {
      const total = custom_ww_percent + custom_pt_percent + custom_qa_percent;
      if (total !== 100) {
        return helpers.error("any.invalid", {
          message: "The total of WW, PT, and QA must be 100",
        });
      }
    }
    return value;
  });

  validateRequest(req, next, schema)
}

function create(req, res, next){
  teacherSubjectService
    .create(req.body)
    .then((teacherSubject) => res.json(teacherSubject))
    .catch(next)
}