const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Role = require('../_helpers/role')
const Joi = require("joi");
const curriculumSubjectService = require('../curriculum_subjects/curriculum_subject.service')
const validateRequest = require("../_middleware/validate-request");

router.get('/filtered', authorize(Role.Principal), getFilteredSubjects)
router.post('/', authorize(Role.Principal), createSchema, create)
router.post('/set-subject', authorize(Role.Principal), setSubjects)


module.exports = router;

function setSubjects(req, res, next) {
  curriculumSubjectService
    .setSubjects(req.body)
    .then(() => res.json({ message: 'Subjects set successfully' }))
    .catch(next);
}

function getFilteredSubjects(req, res, next){
  const { grade_level, strand, semester, school_year } = req.query
  console.log(req.query)
  curriculumSubjectService
    .getFilteredSubjects({ grade_level, strand, semester, school_year })
    .then((filteredSubjects) => res.json(filteredSubjects))
    .catch(next)  
} 


function createSchema(req, res, next){
  const schema = Joi.object({
    subject_id: Joi.number().required(),
    grade_level_id: Joi.number().required(),
    strand_id: Joi.number().required(),
    semester: Joi.string().valid('FIRST SEMESTER', 'SECOND SEMESTER').required(),
    school_year_id: Joi.number().required()
  })

  validateRequest(req, next, schema)
}

function create(req, res, next){
  curriculumSubjectService
    .create(req.body)
    .then((curriculumSubject) => res.json(curriculumSubject))
    .catch(next)
}