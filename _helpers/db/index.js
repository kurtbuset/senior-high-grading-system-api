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

  db.Account = require("../../_models/account.model")(sequelize);
  db.refreshToken = require("../../_models/refresh-token.model")(sequelize);
  db.Strand = require('../../_models/strand.model')(sequelize)
  db.School_Year = require('../../_models/school_year.model')(sequelize)
  db.Grade_Level = require('../../_models/grade_level.model')(sequelize)  
  db.HomeRoom = require('../../_models/homeroom.model')(sequelize)
  db.Subject = require("../../_models/subject.model")(sequelize);
  db.Curriculum_Subject = require('../../_models/curriculum_subject.model')(sequelize)
  db.Teacher_Subject_Assignment =
    require("../../_models/teacher_subject.model")(
      sequelize 
    );
  db.Student = require("../../_models/student.model")(sequelize);
  db.Enrollment = require("../../_models/enrollment.model")(sequelize);
  db.Quiz = require("../../_models/quiz.model")(sequelize);
  db.Quiz_Score = require('../../_models/quiz_score.model')(sequelize)
  db.Final_Grade = require('../../_models/final_grade.model')(sequelize)
  db.Subject_Quarter_Lock = require('../../_models/subject_quarter_lock')(sequelize)
  db.Notification = require('../../_models/notification.model')(sequelize)


  defineAssociations(db)
    
  await sequelize.sync({ alter: true });
}

initialize();

