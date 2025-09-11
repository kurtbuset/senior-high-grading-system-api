require('dotenv').config();
const { Sequelize } = require('sequelize');
const homeroomModel = require('../_models/homeroom.model');
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

const Homeroom = homeroomModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await Homeroom.sync(); // Ensure table exists

    await Homeroom.bulkCreate([
      {
        grade_level_id: 1,
        section: "HUMMS A",
        strand_id: 2,
        school_year_id: 2,
        teacher_id: 4
      },
      {
        grade_level_id: 1,
        section: "HUMMS B",
        strand_id: 2,
        school_year_id: 2,
        teacher_id: 5
      },
      {
        grade_level_id: 2,
        section: "HUMMS C",
        strand_id: 2,
        school_year_id: 2,
        teacher_id: 6
      },
      {
        grade_level_id: 2,
        section: "HUMMS D",
        strand_id: 2,
        school_year_id: 2,
        teacher_id: 6
      },
      {
        grade_level_id: 1,
        section: "HUMMS 2024 2025",
        strand_id: 2,
        school_year_id: 1,
        teacher_id: 4
      },
      //  {
      //   grade_level_id: 2,
      //   section: "STEM C",
      //   strand_id: 1
      // },
      //  {
      //   grade_level_id: 2,
      //   section: "STEM B",
      //   strand_id: 1
      // },
    ]);

    console.log('✅ Homerooms seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
