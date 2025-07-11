const config = require("../../config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

const defineAssociations = require('./associations')

module.exports = db = {};

// const db = {};

async function initialize() {
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
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

// db.initialize = initialize;

// module.exports = db;
