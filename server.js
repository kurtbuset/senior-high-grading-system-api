require('rootpath')()
const express = require('express')
const app = express() 
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const errorHandler = require('_middleware/error-handler')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cookieParser())

// ilisda ang origin if production na
// e.g. origin: 'https://your-frontend-domain.com',
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }))

// api routes
app.use('/accounts', require('./accounts/accounts.controller'))

app.use('/departments', require('./departments/departments.controller'))

app.use('/employees', require('./employees/employees.controller'))

app.use('/requests', require('./requests/request.controller'))

app.use('/api-docs', require('./_helpers/swagger'))

// global error handler
app.use(errorHandler)

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000
app.listen(port, _ => { console.log(`LISTENING ON PORT ${port}`)})  

