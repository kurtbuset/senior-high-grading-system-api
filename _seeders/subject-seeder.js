require('dotenv').config();
const { Sequelize } = require('sequelize');
const subjectModel = require('../subjects/subject.model');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const Subject = subjectModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await Subject.sync(); // Ensure table exists

    await Subject.bulkCreate([
      // CORE SUBJECTS
      // {
      //   name: 'Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: '21st Century Literature from the Philippines and the World',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'Contemporary Philippine Arts from the Regions',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'Introduction to the Philosophy of the Human Person / Pambungad sa Pilosopiya ng Tao',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'Understanding Culture, Society and Politics',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'Media and Information Literacy',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'General Mathematics',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'Statistics and Probability',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'Earth and Life Science',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'Physical Science',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // {
      //   name: 'Personal Development / Pansariling Kaunlaran',
      //   type: 'Core Subject',
      //   default_ww_percent: 25,
      //   default_pt_percent: 50,
      //   default_qa_percent: 25,
      // },
      // APPLIED SUBJECTS (ACADEMIC)
      // {
      //   name: 'English for Academic and Professional Purposes',
      //   type: 'Applied Subject (Academic)',
      //   default_ww_percent: 25,
      //   default_pt_percent: 45,
      //   default_qa_percent: 30,
      // },
      // {
      //   name: 'Entrepreneurship',
      //   type: 'Applied Subject (Academic)',
      //   default_ww_percent: 25,
      //   default_pt_percent: 45,
      //   default_qa_percent: 30,
      // },
      // {
      //   name: 'Practical Research 1',
      //   type: 'Applied Subject (Academic)',
      //   default_ww_percent: 25,
      //   default_pt_percent: 45,
      //   default_qa_percent: 30,
      // },
      // {
      //   name: 'Pagsular sa Filipino sa Piling Larangan',
      //   type: 'Applied Subject (Academic)',
      //   default_ww_percent: 25,
      //   default_pt_percent: 45,
      //   default_qa_percent: 30,
      // },
      // {
      //   name: 'Empowerment Technologies (E-Tech): ICT for Professional Tracks',
      //   type: 'Applied Subject (Academic)',
      //   default_ww_percent: 25,
      //   default_pt_percent: 45,
      //   default_qa_percent: 30,
      // },
      // {
      //   name: 'Practical Research 2',
      //   type: 'Applied Subject (Academic)',
      //   default_ww_percent: 25,
      //   default_pt_percent: 45,
      //   default_qa_percent: 30,
      // },
      // {
      //   name: 'Research Project/Culminating Activity',
      //   type: 'Applied Subject (Academic)',
      //   default_ww_percent: 25,
      //   default_pt_percent: 45,
      //   default_qa_percent: 30,
      // }

      // SPECIALIZED SUBJECTS
      
    ]);

    console.log('✅ Subjects seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
