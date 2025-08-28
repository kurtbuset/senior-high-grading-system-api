const express = require("express");
const router = express.Router();
const Joi = require("joi");
const authorize = require("../_middleware/authorize");
const subjectService = require("./subject.service");
const validateRequest = require("../_middleware/validate-request");
const Type = require('./type')
const Role = require('../_helpers/role')


router.post('/', authorize(Role.SuperAdmin), createSchema, create)

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    type: Joi.string().valid(Type.Core, Type.Applied, Type.Specialized_GAS, Type.Specialized_ABM, Type.Specialized_HUMMS, Type.Specialized_STEM).required()
  })

  validateRequest(req, next, schema)
}


function create(req, res, next){  
  subjectService
    .create(req.body)
    .then((subject) => res.json(subject))
    .catch(next)
}
