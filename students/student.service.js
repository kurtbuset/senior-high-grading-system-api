const db = require("../_helpers/db");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Role = require("../_helpers/role");


module.exports = {
  create,
  getStudentInfo,
  getSubjectGrades
};


async function getSubjectGrades(id) {
  
}

async function getStudentInfo(id){
  console.log('account id: ', id)
}


async function create(params) {
  const {
    firstName,
    lastName,
    email,
    sex,
    grade_level,
    strand,
    address,
    guardian_name,
    guardian_contact
  } = params;

  const existing = await db.Account.findOne({ where: { email } });
  if (existing) {
    throw `An account with the email "${email}" already exists.`
  }

  // 1. Generate hashed password (or save plain password for notification before hashing)
  const plainPassword = crypto.randomBytes(4).toString('hex'); // e.g., 'a3f9c2d1'
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // 2. Create the account
  const account = await db.Account.create({
    firstName,
    lastName,
    email,
    passwordHash,
    role: Role.Student,
    isActive: true,
    verified: Date.now(),
    created: Date.now() 
  });

  // 3. Generate school ID
  const school_id = await generateSchoolId();

  // 4. Create the student record and link to account
  const student = await db.Student.create({
    account_id: account.id,
    school_id,
    sex,
    grade_level,
    strand,
    address,
    guardian_name,
    guardian_contact,
  });

  return {
    message: 'Student and account successfully created.',
    student,
    account: {
      email: account.email,
      password: plainPassword, // Send this to admin for the student
    }
  };
}

// helper function
async function generateSchoolId() {
  const year = new Date().getFullYear();

  // Count how many students exist this year
  const latest = await db.Student.findAll({
    where: {
      school_id: {
        [db.Sequelize.Op.like]: `${year}-%`
      }
    },
    order: [['school_id', 'DESC']],
    limit: 1
  });

  let nextNumber = 1;
  if (latest.length) {
    const lastId = latest[0].school_id.split('-')[1]; // e.g. 00001
    nextNumber = parseInt(lastId) + 1;
  }

  return `${year}-${String(nextNumber).padStart(5, '0')}`; // e.g. 2025-00001
}

function basicDetails(student){
  const { id, firstname, lastname } = student
  return { id, firstname, lastname }
}