const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const homeroomService = require('./homeroom.service')

router.get('/', authorize(), getHomerooms)
router.get('/:id', authorize(), getOneHomeroom)
router.get('/conso/:id', authorize(), getConsolidatedSheet)

module.exports = router

function getConsolidatedSheet(req, res, next){
  const { semester } = req.query
  homeroomService
    .getConsolidatedSheet(req.params.id, { semester })
    .then((sheet) => res.json(sheet))
    .catch(next)
}

function getOneHomeroom(req, res, next){
  homeroomService
    .getOneHomeroom(req.params.id)
    .then((homeroom) => res.json(homeroom))
    .catch(next)
}

function getHomerooms(req, res, next){
  homeroomService
    .getHomerooms()
    .then((homerooms) => res.json(homerooms))
    .catch(next)
}