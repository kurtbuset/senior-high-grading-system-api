require('dotenv').config();
const { Sequelize } = require('sequelize');
const curriculumSubjectModel = require('../_models/curriculum_subject.model');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const curriculumSubject = curriculumSubjectModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await curriculumSubject.sync(); // Ensure table exists

    await curriculumSubject.bulkCreate([
      { 
        subject_id: 1,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 3,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },  
      {
        subject_id: 5,  
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 7,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 10,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 14,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 17,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 21,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 53,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 51,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },

      // humms 11 2nd sem
      {
        subject_id: 2,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 4,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 6,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 9,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 16,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 18,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 22,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 26,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 49,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 52,
        grade_level_id: 1,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      // 12 humms 1st sem
      {
        subject_id: 11,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 12,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 15,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 19,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 23,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 24,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 48,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 50,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      {
        subject_id: 54,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'FIRST SEMESTER'
      },
      // 12 humms 2nd sem
      {
        subject_id: 20,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 27,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 28,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 47,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
      {
        subject_id: 55,
        grade_level_id: 2,
        strand_id: 2,
        semester: 'SECOND SEMESTER'
      },
    ]);

    console.log('✅ curriculum subjects seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
