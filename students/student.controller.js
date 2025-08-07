const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const studentService = require('./student.service')


router.get('/egrades/:id', authorize(), getStudentInfo)
router.get('/:id', authorize(), getSubjectGrades)
router.post('/', authorize(Role.Admin), createSchema, create)


module.exports = router


function getSubjectGrades(req, res, next){
  studentService
    .getSubjectGrades(req.params.id)
    .then((student) => res.json(student))
    .catch(next)
}

function getStudentInfo(req, res, next){
  studentService
    .getStudentInfo(req.params.id)
    .then((student) => res.json(student))
    .catch(next)
}

function createSchema(req, res, next){
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    sex: Joi.string().valid('M', 'F').required(),
    email: Joi.string().email().required(),
    grade_level: Joi.string().valid('11', '12').required(),
    strand: Joi.string().valid('STEM', 'ABM', 'HUMMS', 'GAS').required(),
    address: Joi.string().optional(),
    guardian_name: Joi.string().optional(),
    guardian_contact: Joi.string().optional(),
  })

  validateRequest(req, next, schema)
}

function create(req, res, next){
  studentService
    .create(req.body)
    .then((student) => res.json(student))
    .catch(next)
}