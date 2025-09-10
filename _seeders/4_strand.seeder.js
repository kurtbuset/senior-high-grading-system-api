require('dotenv').config();
const { Sequelize } = require('sequelize');
const strandModel = require('../_models/strand.model');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const Strand = strandModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await Strand.sync(); // Ensure table exists

    await Strand.bulkCreate([
      {
        code: "STEM",
        name: "Science Technology Engineering and Mathematics"
      },
      {
        code: "HUMMS",
        name: "Humanities and Social Sciences"
      }
    ]);

    console.log('✅ Strands seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
