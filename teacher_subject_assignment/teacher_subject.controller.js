const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Role = require('../_helpers/role')
const Joi = require("joi");
const teacherSubjectService = require('../teacher_subject_assignment/teacher_subject.service')
const validateRequest = require("../_middleware/validate-request");

router.get('/:id', authorize(), getOneSubject);
router.get('/list/:id', authorize(), getSubjectsByTeacherId);
router.post('/', authorize(Role.Registrar), createSchema, create)
router.put('/:id', authorize(), updatePercentagesSchema, updatePercentages)

module.exports = router;

function updatePercentagesSchema(req, res, next){
  const schema = Joi.object({
    custom_ww_percent: Joi.number().required().min(0).max(100),
    custom_pt_percent: Joi.number().required().min(0).max(100),
    custom_qa_percent: Joi.number().required().min(0).max(100),
  })

  validateRequest(req, next, schema)
}

function updatePercentages(req, res, next){
  teacherSubjectService
    .updatePercentages(req.params.id, req.body)
    .then(_ => {
      res.json( { msg: 'successfully updated boii' })
    })
    .catch(next)
}

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
      res.json(assignments)
    })
    .catch(next);
}

function createSchema(req, res, next){
  const schema = Joi.object({
    teacher_id: Joi.number().required(),
    curriculum_subject_id: Joi.number().required(),
    school_year: Joi.string().valid('2024-2025', '2025-2026').required(),
    homeroom_id: Joi.number().required(),
    custom_ww_percent: Joi.number().max(99).required(),
    custom_pt_percent: Joi.number().max(99).required(),
    custom_qa_percent: Joi.number().max(99).required()
  })

  validateRequest(req, next, schema)
}

function create(req, res, next){  
  teacherSubjectService
    .create(req.body)
    .then((teacherSubject) => res.json(teacherSubject))
    .catch(next)
} 