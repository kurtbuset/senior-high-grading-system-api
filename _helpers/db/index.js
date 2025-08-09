const config = require("../../config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");
require('dotenv').config();

const defineAssociations = require('./associations')

module.exports = db = {};



async function initialize() {
  const host = process.env.DB_HOST; 
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASS;
  const database = process.env.DB_NAME; 

  console.log('localhost: ', host)
  console.log('port: ', port)
  console.log('user: ', user)
  console.log('password: ', password)
  console.log('database: ', database)
  

  const connection = await mysql.createConnection({
    host,
    port, 
    user, 
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  const sequelize = new Sequelize(database, user, password, {
    host,
    port,
    dialect: "mysql",
    logging: false,
    dialectOptions: { connectTimeout: 60000 }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize; 

  db.Account = require("../../accounts/account.model")(sequelize);
  db.refreshToken = require("../../accounts/refresh-token.model")(sequelize);
  db.Subject = require("../../subjects/subject.model")(sequelize);
  db.Teacher_Subject_Assignment =
    require("../../teacher_subject_assignment/teacher_subject.model")(
      sequelize
    );
  db.Student = require("../../students/student.model")(sequelize);
  db.Enrollment = require("../../enrollments/enrollment.model")(sequelize);
  db.Quiz = require("../../quizzes/quiz.model")(sequelize);
  db.Quiz_Score = require('../../quiz_scores/quiz_score.model')(sequelize)

  defineAssociations(db)

  await sequelize.sync({ alter: true });
}

initialize();

