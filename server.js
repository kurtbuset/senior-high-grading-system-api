require('rootpath')()
require('dotenv').config();
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
  
// production mode  
app.use(cors({ origin:  process.env.FRONTEND_URL, credentials: true }))

// api routes 
app.use('/accounts', require('./accounts/accounts.controller')) 

app.use('/subjects', require('./subjects/subject.controller'))

app.use('/teacher-subject-assignment', require('./teacher_subject_assignment/teacher_subject.controller')) 

app.use('/students', require('./students/student.controller'))

app.use('/enrollments', require('./enrollments/enrollment.controller'))

app.use('/quizzes', require('./quizzes/quiz.controller'))

app.use('/quiz-scores', require('./quiz_scores/quiz_score.controller'))

app.use('/curriculum-subjects', require('./curriculum_subjects/curriculum_subject.controller'))

app.use('/homerooms', require('./homerooms/homeroom.controller'))

app.use('/grade-level', require('./grade_level/grade_level.controller'))

app.use('/final-grades', require('./final_grades/final-grade.controller'))

app.use('/school-year', require('./school_year/school_year.controller'))

app.use('/strand', require('./strands/strand.controller'))

app.use('/subject-quarter-locks', require('./subject_quarter_locks/subject_quarter_lock.controller'))

app.use('/api-docs', require('./_helpers/swagger'))
  
// global error handler
app.use(errorHandler) 
  
const port = process.env.NODE_ENV === 'production' ? (process.env.DB_PORT || 80) : 4000
app.listen(port, async () => {
  console.log(`LISTENING ON PORT ${port}`);
  await superAdminSeed();
});

    
