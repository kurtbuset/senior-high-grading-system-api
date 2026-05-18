const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require("../_helpers/role");
const validateRequest = require("../_middleware/validate-request");
const studentService = require("./student.service");

router.get("/", authorize(Role.Registrar), getAllStudents);
router.get("/:id", authorize(), getStudentInfo);
router.get("/egrades/:id", authorize(), getSubjectAndGrades);
router.post("/", authorize(Role.Registrar), createSchema, create);
router.put("/:id", authorize(Role.Registrar), updateSchema, update);
router.delete("/:id", authorize(Role.Registrar), deleteStudent);

module.exports = router;

function getAllStudents(req, res, next) {
  studentService
    .getAllStudents()
    .then((student) => res.json(student))
    .catch(next);
}

function getStudentInfo(req, res, next) {
  studentService
    .getStudentInfo(req.params.id)
    .then((student) => res.json(student))
    .catch(next);
}

function getSubjectAndGrades(req, res, next) {
  studentService
    .getSubjectAndGrades(req.params.id)
    .then((student) => res.json(student))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    sex: Joi.string().valid("M", "F").required(),
    email: Joi.string().email().required(),
    homeroom_id: Joi.number().required(),
    lrn_number: Joi.string().max(12).optional(),
    address: Joi.string().optional(),
  });

  validateRequest(req, next, schema);
}

function create(req, res, next) {
  studentService
    .create(req.body)
    .then((student) => res.json(student))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    sex: Joi.string().valid("M", "F").optional(),
    email: Joi.string().email().optional(),
    homeroom_id: Joi.number().optional(),
    address: Joi.string().optional(),
  });

  validateRequest(req, next, schema);
}

function update(req, res, next) {
  studentService
    .update(req.params.id, req.body)
    .then((student) => res.json(student))
    .catch(next);
}

function deleteStudent(req, res, next) {
  studentService
    .deleteStudent(req.params.id)
    .then(() => res.json({ message: "Student deleted successfully" }))
    .catch(next);
}
