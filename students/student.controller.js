const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const studentService = require('./student.service')


router.get('/egrades/:id', authorize(), getSubjectAndGrades)
router.post('/', authorize(Role.Registrar), createSchema, create)


module.exports = router


function getSubjectAndGrades(req, res, next){
  studentService
    .getSubjectAndGrades(req.params.id)
    .then((student) => res.json(student))
    .catch(next)
}

function createSchema(req, res, next){
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    sex: Joi.string().valid('M', 'F').required(),
    email: Joi.string().email().required(),
    homeroom_id: Joi.number().required(),
    address: Joi.string().optional()
  })

  validateRequest(req, next, schema)
}

function create(req, res, next){  
  studentService
    .create(req.body)
    .then((student) => res.json(student))
    .catch(next)
} 