const express = require("express");
const router = express.Router();
const Joi = require("joi");
const authorize = require("../_middleware/authorize");
const subjectService = require("./subject.service");
const validateRequest = require("../_middleware/validate-request");
const Type = require('./type')
const Role = require('../_helpers/role')


router.post('/', authorize(Role.Admin), createSchema, create)

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid(Type.Core, Type.Applied_1, Type.Applied_2, Type.Specialized).required(),
    default_ww_percent: Joi.number().max(100).required(),
    default_pt_percent: Joi.number().max(100).required(),
    default_qa_percent: Joi.number().max(100).required()
  }).custom((value, helpers) => {
    const total = value.default_ww_percent + value.default_pt_percent + value.default_qa_percent
    if (total > 100) {
      return helpers.message('The sum of WW, PT, and QA percentages must not exceed 100')
    }
    return value
  })

  validateRequest(req, next, schema)
}


function create(req, res, next){  
  subjectService
    .create(req.body)
    .then((subject) => res.json(subject))
    .catch(next)
}
