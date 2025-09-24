const express = require("express");
const authorize = require("../_middleware/authorize");
const router = express.Router();
const Joi = require("joi");
const Role = require('../_helpers/role')
const validateRequest = require("../_middleware/validate-request");
const notificationService = require('./notification.service')

router.get('/:id', authorize(), getNotifications)
router.put('/:id', authorize(), updateIsRead)

module.exports = router

function updateIsRead(req, res, next){
    notificationService
        .updateIsRead(req.params.id)
        .then((notification) => res.json(notification))
        .catch(next)
}

function getNotifications(req, res, next){
    notificationService
        .getNotifications(req.params.id)
        .then((notification) => res.json(notification))
        .catch(next)
}   

       