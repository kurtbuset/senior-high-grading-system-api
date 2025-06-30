const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const quizScoreService = require('./quiz_score.service')

router.post('/', authorize(Role.Teacher), addRawScoreSchema, addRawScore)

module.exports = router

function addRawScoreSchema(req, res, next){
  const schema = Joi.object({
    quiz_id: Joi.number().required(),
    enrollment_id: Joi.number().required(),
    raw_score: Joi.number().min(0).required()
  })
  validateRequest(req, next, schema)
}

function addRawScore(req, res, next){
  quizScoreService
    .addRawScore(req.body)
    .then(quizScore => {
      res.json(quizScore)
    })
    .catch(next)
}