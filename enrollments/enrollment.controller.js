const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const enrollmentService = require('./enrollment.service')

router.get('/1st-quarter-grade-sheet/:id', authorize(), getFirstQuarterGradeSheet)
router.get('/enrolled/:id', authorize(), getEnrolledStudents)
router.get('/:id', authorize(), getStudentsByTeacherSubjectId)
router.post('/', authorize(Role.Admin), createSchema, create)

// kuwangan pa ug schema for postman testing
router.put('/:id', authorize(), updateStudentEnrollment)

module.exports = router

function getFirstQuarterGradeSheet(req, res, next){
  enrollmentService
    .getFirstQuarterGradeSheet(req.params.id)
    .then(students => {
      res.json(students)
    })
    .catch(next)
}

function getEnrolledStudents(req, res, next){
  enrollmentService
    .getEnrolledStudents(req.params.id)
    .then(students => {
      res.json(students)
    })
    .catch(next)
}

function updateStudentEnrollment(req, res, next){
  enrollmentService
    .updateStudentEnrollment(req.params.id, req.body)
    .then(message => {
      res.json(message)
    })
    .catch(next)
}

function getStudentsByTeacherSubjectId(req, res, next){
  enrollmentService
    .getStudentsByTeacherSubjectId(req.params.id)
    .then((student) => {
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