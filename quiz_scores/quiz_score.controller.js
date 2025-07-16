const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const quizScoreService = require('./quiz_score.service')

router.get('/:id', authorize(Role.Teacher), getStudentsWithScores)
router.get('/', authorize(Role.Teacher), getStudentsWithoutScores)
router.put('/update', authorize(Role.Teacher), updateRawScoreSchema, updateRawScore)
router.post('/', authorize(Role.Teacher), addRawScoreSchema, addRawScore)

module.exports = router

function updateRawScoreSchema(req, res, next){
   const schema = Joi.array().items(
    Joi.object({
      quiz_id: Joi.number().required(),
      enrollment_id: Joi.number().required(),
      raw_score: Joi.number().min(0).required()
    })
  )
  validateRequest(req, next, schema)
}

function updateRawScore(req, res, next){
  quizScoreService
    .updateRawScore(req.body)
    .then(result => {
      res.json(result)
    })
    .catch(next)
}

function getStudentsWithScores(req, res, next){
  quizScoreService
    .getStudentsWithScores(req.params.id)
    .then(studentsWithScores => {
      res.json(studentsWithScores)
    })
    .catch(next)
}

function getStudentsWithoutScores(req, res, next){
  const { teacher_subject_id, quiz_id } = req.query;
  quizScoreService
    .getStudentsWithoutScores({ teacher_subject_id, quiz_id })
    .then(studentsWithoutScores => {
      res.json(studentsWithoutScores)
    })
    .catch(next)
}

function addRawScoreSchema(req, res, next){
  const schema = Joi.array().items(
    Joi.object({
      quiz_id: Joi.number().required(),
      enrollment_id: Joi.number().required(),
      raw_score: Joi.number().min(0).required()
    })
  )
  validateRequest(req, next, schema)
}

function addRawScore(req, res, next){
  quizScoreService
    .addRawScore(req.body)
    .then(quizScore => {
      // console.log(quizScore)
      res.json(quizScore) 
    })
    .catch(next)
}