require('dotenv').config();
const { Sequelize } = require('sequelize');
const gradeLevelModel = require('../_models/grade_level.model');
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

const GradeLevel = gradeLevelModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await GradeLevel.sync(); // Ensure table exists

    await GradeLevel.bulkCreate([
      {
        level: 11
      },
      {
        level: 12
      }
    ]);

    console.log('✅ GradeLevels seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
