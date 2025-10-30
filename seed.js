require("dotenv").config();
const { Sequelize } = require("sequelize");

const runSeeds = async () => {
  // 1. Connect DB once
  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: "mysql",
      logging: false,
    }
  );  

  try {
    await sequelize.authenticate();
    console.log("✅ Database connected.");  

    // 2. Import seeds in order
    const accountsSeed = require("./_seeders/1_account.seeder");
    const gradeLevelSeed = require("./_seeders/2_grade_level.seeder");
    const schoolYearSeed = require("./_seeders/3_school_year.seeder");
    const strandSeed = require("./_seeders/4_strand.seeder");
    const subjectSeed = require("./_seeders/5_subject.seeder");
    // const curriculumSubjectSeed = require("./_seeders/6_curriculum_subject.seeder");
    // const homeroomSeed = require("./_seeders/7_homeroom.seeder");

    // 3. Run seeds sequentially (pass sequelize!)
    await accountsSeed(sequelize);  
    await gradeLevelSeed(sequelize);
    await schoolYearSeed(sequelize);
    await strandSeed(sequelize);
    await subjectSeed(sequelize);
    // await curriculumSubjectSeed(sequelize);
    // await homeroomSeed(sequelize) 

    console.log("🌱 All seeds executed successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await sequelize.close();
    console.log("🔒 Database connection closed.");
  }
};

runSeeds();
