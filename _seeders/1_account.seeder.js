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
    // {
    //   firstName: "Yams",
    //   lastName: "Lamelo",
    //   email: "yams@gmail.com",
    //   passwordHash: await bcrypt.hash("yams123", 10),
    //   isActive: 1,
    //   verified: new Date(),
    //   role: role.Teacher,
    //   created: new Date(),
    // },
    {
      firstName: "Monica",
      lastName: "Mendoza",
      email: "monica@gmail.com",
      passwordHash: await bcrypt.hash("monica123", 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date(),
    },
    {
      firstName: 'Xhara Joyce',
      lastName: "Socorro",
      email: "xhara@gmail.com",
      passwordHash: await bcrypt.hash('xhara123', 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date()
    },
    { 
      firstName: 'Lutchie',
      lastName: "Silva",
      email: "luthie@gmail.com",
      passwordHash: await bcrypt.hash('lutchie123', 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date()
    },
    { 
      firstName: 'Krista',
      lastName: "Mae",
      email: "krista@gmail.com",
      passwordHash: await bcrypt.hash('krista123', 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date()
    },
    { 
      firstName: 'Jessa',
      lastName: "Manatad",
      email: "jessa@gmail.com",
      passwordHash: await bcrypt.hash('jessa123', 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date()
    },
    { 
      firstName: 'Nicasio',
      lastName: "Balbontin",
      email: "nicasio@gmail.com",
      passwordHash: await bcrypt.hash('nicasio123', 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date()
    },
    { 
      firstName: 'Jay Ann',
      lastName: "Lee",
      email: "lee@gmail.com",
      passwordHash: await bcrypt.hash('jayann123', 10),
      isActive: 1,
      verified: new Date(),
      role: role.Teacher,
      created: new Date()
    },
    { 
      firstName: 'Abegail',
      lastName: "Adolfo",
      email: "abegail@gmail.com",
      passwordHash: await bcrypt.hash('abegail123', 10),
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
  