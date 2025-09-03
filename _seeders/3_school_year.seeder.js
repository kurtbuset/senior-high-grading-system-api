require('dotenv').config();
const { Sequelize } = require('sequelize');
const schoolYearModel = require('../_models/school_year.model');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const SchoolYear = schoolYearModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await SchoolYear.sync(); // Ensure table exists

    await SchoolYear.bulkCreate([
      {
        school_year: '2024-2025',
        is_active: false,
        start_date: new Date('2024-06-01'),
        end_date: new Date('2025-03-31')
      },
      {
        school_year: '2025-2026',
        is_active: true,
        start_date: new Date('2025-06-01'),
        end_date: new Date('2026-03-31')
      },
    ]);

    console.log('✅ School Year seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
