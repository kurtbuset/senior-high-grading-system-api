require('dotenv').config();
const { Sequelize } = require('sequelize');
const enrollmentModel = require('../_models/enrollment.model');
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

const Enrollment = enrollmentModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await Enrollment.sync(); // Ensure table exists

    await Enrollment.bulkCreate([
      {
        student_id: 1,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 2,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 3,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 4,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 5,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 6,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 7,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 8,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 9,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 10,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 11,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 12,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 13,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 14,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 15,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 16,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 17,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 18,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 19,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 20,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 21,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 22,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 23,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 24,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 25,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 26,
        teacher_subject_id: 20,
        is_enrolled: true,
      },
      {
        student_id: 27, 
        teacher_subject_id: 20,
        is_enrolled: true,
      },
    ]);

    console.log('✅ enrollments seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
