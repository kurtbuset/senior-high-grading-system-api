const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require("../_helpers/role");
const validateRequest = require("../_middleware/validate-request");
const subjectQuarterLockService = require("./subject_quarter_lock.service");

router.post("/", authorize(), lockSubjectSchema, lockSubject);

module.exports = router;

function lockSubjectSchema(req, res, next) {
const schema = Joi.object({
    teacher_subject_id: Joi.number().required(),
    quarter: Joi.string().valid("First Quarter", "Second Quarter").required(),
  })
  validateRequest(req, next, schema)
}

function lockSubject(req, res, next){
  subjectQuarterLockService
    .lockSubject(req.body)
    .then(_ => res.json({ msg: "record added successfully"}))
    .catch(next)
}