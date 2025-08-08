require('dotenv').config();
const bcrypt = require('bcryptjs')
const role = require('../_helpers/role')
const { Sequelize } = require('sequelize');
const accountModel = require('../accounts/account.model');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

module.exports = { superAdminSeed };

const Account = accountModel(sequelize);

async function superAdminSeed(){
  try{
    await sequelize.authenticate()

    await Account.sync()  

     const existing = await Account.findOne({ where: { email: 'superadmin@gmail.com' } });
    if (existing) {
      console.log('✅ Super admin already exists.');
      return;
    }

    await Account.bulkCreate([
      { 
        firstName: "super",
        lastName: "admin",
        email: "superadmin@gmail.com",
        passwordHash: await bcrypt.hash('sadmin123', 10),
        isActive: 1,
        verified: Date.now(),
        role: role.SuperAdmin,
        created: Date.now() 
      }
    ])
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}