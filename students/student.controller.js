const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const studentService = require('./student.service')

router.post('/', authorize(Role.Admin), createSchema, create)

module.exports = router

function createSchema(req, res, next){
  const schema = Joi.object({
    firstname: Joi.string().required(),
    lastname: Joi.string().required()
  })

  validateRequest(req, next, schema)
}

function create(req, res, next){
  studentService
    .create(req.body)
    .then((student) => res.json(student))
    .catch(next)
}