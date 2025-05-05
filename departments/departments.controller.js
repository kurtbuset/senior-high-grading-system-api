const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validateRequest = require("../_middleware/validate-request");
const authorize = require("../_middleware/authorize");
const Role = require("../_helpers/role");
const departmentService = require('../departments/departments.service')

router.get("/", authorize(Role.Admin), getAll)
router.get("/:id", authorize(), getById)
router.post("/", authorize(Role.Admin), createSchema, create)
router.put("/:id", authorize(), updateSchema, update)
router.delete("/:id", authorize(), _delete)

module.exports = router

function _delete(req, res, next){
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  departmentService.delete(req.params.id)
    .then(() => res.json({ msg: 'Department deleted successfully'}))
    .catch(next)
}

function getById(req, res, next){
  if(req.user.role !== Role.Admin){
    return res.status(401).json({ msg: 'Unauthorized' })
  }

  departmentService
    .getById(req.params.id)
    .then((department) => (department ? res.json(department) : res.sendStatus(404)))
    .catch(next)
}

function updateSchema(req, res, next){
  const schema = Joi.object({
    name: Joi.string().empty(""),
    description: Joi.string().empty("")
  })
  validateRequest(req, next, schema)
}

function update(req, res, next){
  if(req.user.role !== Role.Admin){
    return res.status(401).json({ msg: 'Unauthorized' })
  }

  departmentService
    .update(req.params.id, req.body)
    .then((department) => res.json(department))
    .catch(next)
}

function getAll(req, res, next){
  departmentService
    .getAll()
    .then((departments) => res.json(departments))
    .catch(next)
}

function createSchema(req, res, next){
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required()
  })
  validateRequest(req, next, schema)
}

function create(req, res, next){
  

  departmentService
    .create(req.body)
    .then((department) => res.json(department))
    .catch(next)
}