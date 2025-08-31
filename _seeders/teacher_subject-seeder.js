require('dotenv').config();
const { Sequelize } = require('sequelize');
const teacherSubjectAssignmentModel = require('../_models/teacher_subject.model');
const bcrypt = require('bcryptjs')
const role = require('../_helpers/role')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const TeacherSubjectAssignment = teacherSubjectAssignmentModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await TeacherSubjectAssignment.sync(); // Ensure table exists

    await TeacherSubjectAssignment.bulkCreate([
      {
        teacher_id: 4,
        curriculum_subject_id: 1,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
    ]);

    console.log('✅ TeacherSubjectAssignment seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
