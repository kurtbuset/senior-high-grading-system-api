const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const quizService = require('./quiz.service')

router.post('/', authorize(Role.Teacher), addRawScoreSchema, addRawScore)
router.put('/:id', authorize(Role.Teacher), updateRawScoreSchema, updateRawScore)

module.exports = router

function addRawScoreSchema(req, res, next){
  const schema = Joi.object({
    teacher_subject_id: Joi.number().required(),
    type: Joi.string().valid('Written Work', 'Performance Tasks', 'Quarterly Assesment').required(),
    quarter: Joi.string().valid('First Quarter', 'Second Quarter').required(),
    description: Joi.string(),
    hps: Joi.number().min(1).required()
  })
  validateRequest(req, next, schema)
}

function addRawScore(req, res, next){
  quizService
    .addRawScore(req.body)
    .then((quiz => {
      // console.log(JSON.stringify(quiz, null, 2))
      res.json(quiz)
    }))
    .catch(next)
}


function updateRawScoreSchema(){

}

function updateRawScore(){

}