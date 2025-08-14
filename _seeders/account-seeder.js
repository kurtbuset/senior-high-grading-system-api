require('dotenv').config();
const bcrypt = require('bcryptjs')
const role = require('../_helpers/role')
const { Sequelize, Op } = require('sequelize');
const accountModel = require('../accounts/account.model')
const studentModel = require('../students/student.model')

const config = require('../../config.json');

// Use the same fallback logic as the main database connection
const host = process.env.DB_HOST || config.database.host;
const port = process.env.DB_PORT || config.database.port || 3306;
const user = process.env.DB_USER || config.database.user;
const password = process.env.DB_PASS || config.database.password;
const database = process.env.DB_NAME || config.database.database;

const sequelize = new Sequelize(database, user, password, {
  host,
  port,
  dialect: 'mysql',
});

const Account = accountModel(sequelize);
const Student = studentModel(sequelize);

async function generateSchoolId() {
  const year = new Date().getFullYear();

  const latest = await Student.findAll({
    where: {
      school_id: {
        [Op.like]: `${year}-%`,
      },
    },
    order: [['school_id', 'DESC']],
    limit: 1,
  });

  let nextNumber = 1;
  if (latest.length) {
    const lastId = latest[0].school_id.split('-')[1]; // e.g. 00001
    nextNumber = parseInt(lastId) + 1;
  }

  return `${year}-${String(nextNumber).padStart(5, '0')}`;
}


async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await Account.sync(); // Ensure table exists
    await Student.sync();

    const studentSeedData = [
      {
        email: 'ming@gmail.com',
        password: 'ming123',
        firstName: 'ming',
        lastName: 'ming',
        sex: 'F',
        address: 'skina japan',
        guardian_name: 'asd',
        guardian_contact: 'dummy',
      },
      {
        email: 'jane.doe@gmail.com',
        password: 'janedoe123',
        firstName: 'Jane',
        lastName: 'Doe',
        sex: 'F',
        address: 'Cebu City',
        guardian_name: 'Anna Doe',
        guardian_contact: '09123456789',
      },
      {
        email: 'juan.delacruz@gmail.com',
        password: 'juan123',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        sex: 'M',
        address: 'Manila',
        guardian_name: 'Maria Dela Cruz',
        guardian_contact: '09999999999',
      }
    ];

    for (const data of studentSeedData) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const account = await Account.create({
        email: data.email,
        passwordHash: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        isActive: 1,
        verified: Date.now(),
        role: role.Student,
        created: Date.now()
      });

      const school_id = await generateSchoolId();

      await Student.create({
        account_id: account.id,
        school_id,
        sex: data.sex,
        address: data.address,
        guardian_name: data.guardian_name,
        guardian_contact: data.guardian_contact,
      });

      console.log(`✅ Seeded student: ${data.firstName} ${data.lastName}`);
    }

    await sequelize.close();
    // console.log('✅ All students and accounts seeded!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
