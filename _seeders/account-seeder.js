require('dotenv').config();
const { Sequelize } = require('sequelize');
const accountModel = require('../accounts/account.model');
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

const Account = accountModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await Account.sync(); // Ensure table exists

    await Account.bulkCreate([
      {
        firstName: 'admin',
        lastName: "istrator",
        email: "admin@gmail.com",
        passwordHash: await bcrypt.hash('admin123', 10),
        isActive: 1,
        verified: Date.now(),
        role: role.Admin,
        created: Date.now()
      },
      {
        firstName: 'yams',
        lastName: "lamelo",
        email: "yams@gmail.com",
        passwordHash: await bcrypt.hash('yams123', 10),
        isActive: 1,
        verified: Date.now(),
        role: role.Teacher,
        created: Date.now()
      },
    ]);

    console.log('✅ Accounts seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
