const express = require("express");
const router = express.Router();
const validateRequest = require("../_middleware/validate-request");
const authorize = require("../_middleware/authorize");
const Status = require('../_helpers/status')
const Joi = require("joi");
const requestService = require('../requests/requests.services')

router.post('/', authorize(), createSchema, create)

module.exports = router

function createSchema(req, res, next){
  const schema = Joi.object({
    employeeId: Joi.number().required(),
    type: Joi.string().required(),
    items: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required()
      })
    ).required(),
    // status: Joi.string().valid(Status.Pending, Status.Approved, Status.Rejected).required()
  })
  validateRequest(req, next, schema)
}

function create(req, res, next){
  requestService 
    .create(req.body)
    .then(request => res.json(request))
    .catch(next)
}