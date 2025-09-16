const bcrypt = require("bcryptjs");
const role = require("../_helpers/role");
const accountModel = require("../_models/account.model");

module.exports = async (sequelize) => {
  const Account = accountModel(sequelize);

  await Account.sync(); // Ensure table exists

  const accounts = [
    {
      firstName: "prin",
      lastName: "cipal",
      email: "principal@gmail.com",
      passwordHash: await bcrypt.hash("principal123", 10),
      isActive: 1,
      verified: new Date(),
      role: role.Principal,
      created: new Date(),
    },
    {
      firstName: "regis",
      lastName: "trar",
      email: "registrar@gmail.com",
      passwordHash: await bcrypt.hash("registrar123", 10),
      isActive: 1,
      verified: new Date(),
      role: role.Registrar,
      created: new Date(),
    },
    {
      firstName: "yams",
      lastName: "lamelo",
      email: "yams@gmail.com",
      passwordHash: await bcrypt.hash("yams123", 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date(),
    },
    {
      firstName: 'Wilson',
      lastName: "Gayo",
      email: "wils@gmail.com",
      passwordHash: await bcrypt.hash('wils123', 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date()
    },
    { 
      firstName: 'Juvan',
      lastName: "Teacher",
      email: "juvan@gmail.com",
      passwordHash: await bcrypt.hash('juvan123', 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date()
    },
  ];

  for (const acc of accounts) {
    const existing = await Account.findOne({ where: { email: acc.email } });

    if (existing) {
      console.log(`⚠️ Account with email ${acc.email} already exists. Skipping.`);
    } else {
      await Account.create(acc);
      console.log(`✅ Created account for ${acc.email}`);
    }
  }

  console.log("🌱 Accounts seeding completed!");
};
