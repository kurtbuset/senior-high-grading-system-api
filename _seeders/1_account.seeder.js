require('dotenv').config();
const { Sequelize } = require('sequelize');
const accountModel = require('../_models/account.model');
const bcrypt = require('bcryptjs');
const role = require('../_helpers/role');

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

    const accounts = [
      {
        firstName: 'prin',
        lastName: "cipal",
        email: "principal@gmail.com",
        passwordHash: await bcrypt.hash('principal123', 10),
        isActive: 1,
        verified: Date.now(),
        role: role.Principal,
        created: Date.now()
      },
      {
        firstName: 'regis',
        lastName: "trar",
        email: "registrar@gmail.com",
        passwordHash: await bcrypt.hash('registrar123', 10),
        isActive: 1,
        verified: Date.now(),
        role: role.Registrar,
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
      {
        firstName: 'Wilson',
        lastName: "Gayo",
        email: "wils@gmail.com",
        passwordHash: await bcrypt.hash('wils123', 10),
        isActive: 1,
        verified: Date.now(),
        role: role.Teacher,
        created: Date.now()
      },
      {
        firstName: 'Juvan',
        lastName: "Teacher",
        email: "juvan@gmail.com",
        passwordHash: await bcrypt.hash('juvan123', 10),
        isActive: 1,
        verified: Date.now(),
        role: role.Teacher,
        created: Date.now()
      },
    ];

    for (const acc of accounts) {
      await Account.findOrCreate({
        where: { email: acc.email },
        defaults: acc
      });
    }

    console.log('✅ Accounts seeded (duplicates skipped)!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
