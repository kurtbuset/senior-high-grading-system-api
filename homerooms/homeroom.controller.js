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
router.post('/', authorize(Role.Registrar), createSchema, create)

module.exports = router

function create(req, res, next){
  homeroomService
    .create(req.body)
    .then((result) => res.json(result))
    .catch(next)
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    grade_level_id: Joi.number().integer().required(),
    section: Joi.string().required(),
    strand_id: Joi.number().integer().required(),
    school_year_id: Joi.number().integer().required(),
    teacher_id: Joi.number().integer().required(),
  });

  validateRequest(req, next, schema);
}



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
  const { role, accountId } = req.query;
  homeroomService
    .getHomerooms(role, accountId)
    .then((homerooms) => res.json(homerooms))
    .catch(next)
}