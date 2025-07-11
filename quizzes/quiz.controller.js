const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const quizService = require('./quiz.service')

router.get('/:id', authorize(), getHighestPossibleScores)
router.post('/', authorize(Role.Teacher), addHighestPossibleScoreSchema, addHighestPossibleScore)
router.put('/:id', authorize(Role.Teacher), updateHighestPossibleScoreSchema, updateHighestPossibleScore)

module.exports = router


function getHighestPossibleScores(req, res, next){
  const { quarter, type } = req.query
    quizService
      .getHighestPossibleScore(req.params.id, { quarter, type })
      .then(quizzes => {
        // console.log(JSON.stringify(quizzes, null, 2))
        res.json(quizzes)
      })
      .catch(next)
}



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
      res.json(quiz)
    }))
    .catch(next)
}



function updateHighestPossibleScoreSchema(){

}

function updateHighestPossibleScore(){

}