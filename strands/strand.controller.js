const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Role = require("../_helpers/role");
const Joi = require("joi");
const strandService = require("./strand.service");
const validateRequest = require("../_middleware/validate-request");

router.post("/", authorize(Role.Registrar), createSchema, create);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    code: Joi.string().trim().max(10).required(), // e.g. "STEM"
    name: Joi.string().trim().max(100).required(), // e.g. "Science, Technology, Engineering, and Mathematics"
  });

  validateRequest(req, next, schema);
}

function create(req, res, next) {
  strandService
    .create(req.body)
    .then((result) => res.json(result))
    .catch(next);
}
