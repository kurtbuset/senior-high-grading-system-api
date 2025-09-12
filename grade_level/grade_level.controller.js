const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Role = require('../_helpers/role')
const Joi = require("joi");
const gradeLevelService = require('../grade_level/grade_level.service')
const validateRequest = require("../_middleware/validate-request");

router.post('/', authorize(Role.Registrar), createSchema, create)

module.exports = router;


function createSchema(req, res, next){
  const schema = Joi.object({
    level: Joi.number().integer().required()
  })

  validateRequest(req, next, schema)
}

function create(req, res, next){  
  gradeLevelService
    .create(req.body)
    .then((result) => res.json(result))
    .catch(next)
} 

