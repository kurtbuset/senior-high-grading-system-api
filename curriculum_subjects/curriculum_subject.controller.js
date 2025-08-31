const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Role = require('../_helpers/role')
const Joi = require("joi");
const curriculumSubjectService = require('../curriculum_subjects/curriculum_subject.service')
const validateRequest = require("../_middleware/validate-request");

router.get('/', authorize(Role.Principal), getSubjects)
router.post('/', authorize(Role.Registrar), createSchema, create)

module.exports = router;



function getSubjects(req, res, next){
  curriculumSubjectService
    .getSubjects()
    .then((curriculumSubjects) => res.json(curriculumSubjects))
    .catch(next)
}


function createSchema(req, res, next){
  const schema = Joi.object({
    subject_id: Joi.number().required(),
    grade_level_id: Joi.number().required(),
    strand_id: Joi.number().required(),
    semester: Joi.string().valid('FIRST SEMESTER', 'SECOND SEMESTER').required(),
  })

  validateRequest(req, next, schema)
}

function create(req, res, next){
  curriculumSubjectService
    .create(req.body)
    .then((curriculumSubject) => res.json(curriculumSubject))
    .catch(next)
}