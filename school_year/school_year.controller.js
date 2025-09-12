const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Role = require('../_helpers/role')
const Joi = require("joi");
const schoolYearService = require('../school_year/school_year.service')
const validateRequest = require("../_middleware/validate-request");

router.post('/', authorize(Role.Registrar), createSchema, create)

module.exports = router;

function createSchema(req, res, next){
  const schema = Joi.object({
    school_year: Joi.string().required(), // e.g. "2025-2026"
    start_date: Joi.date().required(),
    end_date: Joi.date().greater(Joi.ref("start_date")).required(),
    is_active: Joi.boolean().optional()
  })

  validateRequest(req, next, schema)
}

function create(req, res, next){  
  schoolYearService
    .create(req.body)
    .then((result) => res.json(result))
    .catch(next)
} 

