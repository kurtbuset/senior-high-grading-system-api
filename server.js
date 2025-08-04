require('rootpath')()
const express = require('express')
const app = express() 
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const errorHandler = require('_middleware/error-handler')
const { superAdminSeed } = require('./_seeders/super-admin-seeder')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(cookieParser())

// ilisda ang origin if production na
// e.g. origin: 'https://your-frontend-domain.com',
// app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }))

// prod mode
app.use(cors({ origin: 'https://senior-high-grading-system-ui.vercel.app', credentials: true }))

// api routes
app.use('/accounts', require('./accounts/accounts.controller'))

app.use('/subjects', require('./subjects/subject.controller'))

app.use('/teacher-subject-assignment', require('./teacher_subject_assignment/teacher_subject.controller')) 

app.use('/students', require('./students/student.controller'))

app.use('/enrollments', require('./enrollments/enrollment.controller'))

app.use('/quizzes', require('./quizzes/quiz.controller'))

app.use('/quiz-scores', require('./quiz_scores/quiz_score.controller'))

app.use('/api-docs', require('./_helpers/swagger'))

// global error handler
app.use(errorHandler) 

superAdminSeed()

const port = process.env.NODE_ENV === 'production' ? (process.env.DB_PORT || 80) : 4000
app.listen(port, _ => { console.log(`LISTENING ON PORT ${port}`)})  

  