const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const quizService = require('./quiz.service')

router.post('/', authorize(Role.Teacher), addHighestPossibleScoreSchema, addHighestPossibleScore)
router.put('/:id', authorize(Role.Teacher), updateHighestPossibleScoreSchema, updateHighestPossibleScore)

module.exports = router

function addHighestPossibleScoreSchema(req, res, next){
  const schema = Joi.object({
    teacher_subject_id: Joi.number().required(),
    type: Joi.string().valid('Written Work', 'Performance Tasks', 'Quarterly Assesment').required(),
    quarter: Joi.string().valid('First Quarter', 'Second Quarter').required(),
    description: Joi.string(),
    hps: Joi.number().min(1).required()
  })
  validateRequest(req, next, schema)
}

function addHighestPossibleScore(req, res, next){
  quizService
    .addHighestPossibleScore(req.body)
    .then((quiz => {
      // console.log(JSON.stringify(quiz, null, 2))
      res.json(quiz)
    }))
    .catch(next)
}


function updateHighestPossibleScoreSchema(){

}

function updateHighestPossibleScore(){

}