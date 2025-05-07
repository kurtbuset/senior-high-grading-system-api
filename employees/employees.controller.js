const express = require("express");
const router = express.Router();
const validateRequest = require("../_middleware/validate-request");
const authorize = require("../_middleware/authorize");
const Role = require("../_helpers/role");
const Joi = require("joi");
const employeeService = require('../employees/employees.service')

router.get("/", authorize(Role.Admin), getAll)
router.get("/:id", authorize(), getById)
router.post("/", authorize(Role.Admin), createSchema, create)
router.put('/:id', authorize(), updateSchema, update)
router.delete('/:id', authorize(), _delete)

module.exports = router

function _delete(req, res, next){
  if (req.user.role !== Role.Admin) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  employeeService
    .delete(req.params.id)
    .then(() => res.json({ msg: 'Employee deleted successfully'}))
    .catch(next)
}

function updateSchema(req, res, next){
  const schema = Joi.object({
    position: Joi.string().empty(""),
    userId: Joi.number().empty(""),
    departmentId: Joi.number().empty(""),
    isActive: Joi.boolean()
  })
  validateRequest(req, next, schema)
}

function update(req, res, next){
  if(req.user.role !== Role.Admin){
    return res.status(401).json({ msg: 'Unauthorized' })
  }

  employeeService
    .update(req.params.id, req.body)
    .then((employee) => {
      res.json(employee)
      // console.log(employee)
    })
    .catch(next)
    
}

function getById(req, res, next){
  if(req.user.role !== Role.Admin){
    return res.status(401).json({ msg: 'Unauthorized' })
  }

  employeeService
    .getById(req.params.id)
    .then(employee => (employee ? res.json(employee) : res.sendStatus(404)))
    .catch(next)
}

function getAll(req, res, next){
  employeeService
    .getAll()
    .then(employees => res.json(employees))
    .catch(next)
}

function createSchema(req, res, next){
  const schema = Joi.object({
    position: Joi.string().required(),
    userId: Joi.number().required(),
    departmentId: Joi.number().required(),
    isActive: Joi.boolean().required()
  })
  validateRequest(req, next, schema)
}

function create(req, res, next){
  employeeService
    .create(req.body)
    .then((employee) => res.json(employee))
    .catch(next)
}