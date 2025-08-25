require('dotenv').config();
const bcrypt = require('bcryptjs');
const role = require('../_helpers/role');
const { Sequelize } = require('sequelize');
const accountModel = require('../_models/account.model');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: { connectTimeout: 60000 },
    pool: {
      acquire: 60000,
      idle: 10000
    }
  }
);

const Account = accountModel(sequelize);

async function connectWithRetry(retries = 5, delay = 5000) {
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection established.');
      return;
    } catch (err) {
      console.error(`❌ DB connection failed. Retries left: ${retries - 1}`, err.message);
      retries--;
      if (!retries) throw err;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

async function superAdminSeed() {
  try {
    await connectWithRetry();

    await Account.sync();

    const existing = await Account.findOne({ where: { email: 'superadmin@gmail.com' } });
    if (existing) {
      console.log('✅ Super admin already exists.');
      return;
    }

    await Account.create({
      firstName: "super",
      lastName: "admin",
      email: "superadmin@gmail.com",
      passwordHash: await bcrypt.hash('sadmin123', 10),
      isActive: 1,
      verified: new Date(),
      role: role.SuperAdmin,
      created: new Date()
    });

    console.log('✅ Super admin created.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

module.exports = { superAdminSeed };