const express = require("express");
const router = express.Router();
const Joi = require("joi");
const authorize = require("../_middleware/authorize");
const subjectService = require("./subject.service");
const validateRequest = require("../_middleware/validate-request");
const Type = require('./type')
const Role = require('../_helpers/role')

// CREATE
router.post('/', authorize(Role.Admin), createSchema, create);

// READ ALL
router.get('/', authorize(), getAll);

// READ ONE
router.get('/:id', authorize(), getById);

// UPDATE
router.put('/:id', authorize(Role.Admin), updateSchema, update);

// DELETE
router.delete('/:id', authorize(Role.Admin), _delete);

module.exports = router;

function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().valid(Type.Core, Type.Applied_1, Type.Applied_2, Type.Specialized).required(),
    default_ww_percent: Joi.number().max(100).required(),
    default_pt_percent: Joi.number().max(100).required(),
    default_qa_percent: Joi.number().max(100).required()
  }).custom((value, helpers) => {
    const total = value.default_ww_percent + value.default_pt_percent + value.default_qa_percent
    if (total > 100) {
      return helpers.message('The sum of WW, PT, and QA percentages must not exceed 100')
    }
    return value
  });

  validateRequest(req, next, schema);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string(),
    type: Joi.string().valid(Type.Core, Type.Applied_1, Type.Applied_2, Type.Specialized),
    default_ww_percent: Joi.number().max(100),
    default_pt_percent: Joi.number().max(100),
    default_qa_percent: Joi.number().max(100)
  }).custom((value, helpers) => {
    const total = (value.default_ww_percent || 0) + (value.default_pt_percent || 0) + (value.default_qa_percent || 0)
    if (total > 100) {
      return helpers.message('The sum of WW, PT, and QA percentages must not exceed 100')
    }
    return value
  });

  validateRequest(req, next, schema);
}

function create(req, res, next){  
  subjectService
    .create(req.body)
    .then((subject) => res.json(subject))
    .catch(next)
}

function getAll(req, res, next) {
  subjectService
    .getAll()
    .then(subjects => res.json(subjects))
    .catch(next);
}

function getById(req, res, next) {
  subjectService
    .getById(req.params.id)
    .then(subject => subject ? res.json(subject) : res.sendStatus(404))
    .catch(next);
}

function update(req, res, next) {
  subjectService
    .update(req.params.id, req.body)
    .then(subject => res.json(subject))
    .catch(next);
}

function _delete(req, res, next) {
  subjectService
    .delete(req.params.id)
    .then(() => res.json({ message: 'Subject deleted' }))
    .catch(next);
}
