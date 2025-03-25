const express = require('express')
const router = express.Router()
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const path = require('path')
// const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'))
const yamlPath = path.join(__dirname, '../swagger.yaml')
console.log("Loading Swagger file from:", yamlPath)
const swaggerDocument = YAML.load(yamlPath)

router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

module.exports = router 