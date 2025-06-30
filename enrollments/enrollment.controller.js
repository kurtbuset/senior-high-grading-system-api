const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const enrollmentService = require('./enrollment.service')

router.get('/:id', authorize(), getStudentsByTeacherSubjectId)
router.post('/', authorize(Role.Admin), createSchema, create)

module.exports = router

function getStudentsByTeacherSubjectId(req, res, next){
  enrollmentService
    .getStudentsByTeacherSubjectId(req.params.id)
    .then((student) => {
      console.log(JSON.stringify(student, null, 2))
      res.json(student)
    })
    .catch(next)
}
  
function createSchema(req, res, next){
  const schema = Joi.object({
    student_id: Joi.number().required(),
    teacher_subject_id: Joi.number().required()
  })
  validateRequest(req, next, schema)
}

function create(req, res, next){
  enrollmentService
    .create(req.body)
    .then((enrollment) => res.json(enrollment))
    .catch(next)
}