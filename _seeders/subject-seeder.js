require('dotenv').config();
const { Sequelize } = require('sequelize');
const subjectModel = require('../_models/subject.model');

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
      {
        name: 'Oral Communication',
        type: 'Core'
      },
      {
        name: 'Academic Reading and Writing',
        type: 'Core'
      },
      {
        name: 'Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino',
        type: 'Core'
      },
      {
        name: 'Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik',
        type: 'Core'
      },
      {
        name: 'General Mathematics',
        type: 'Core'
      },
      {
        name: 'Statistics and Probability',
        type: 'Core'
      },
      {
        name: 'Earth and Life Science',
        type: 'Core'
      },
      {
        name: 'Earth Science',
        type: 'Core'
      },
      {
        name: 'Physical Science',
        type: 'Core'
      },
      {
        name: '21st Century Literature from the Philippines and the World',
        type: 'Core'
      },
      {
        name: 'Contemporary Philippine Arts from the Regions',
        type: 'Core'
      },
      {
        name: 'Media and Information Literacy',
        type: 'Core'
      },
      {
        name: 'Disaster Readiness and Risk Reduction',
        type: 'Core'
      },
      {
        name: 'Introduction to the Philosophy of the Human Person',
        type: 'Core'
      },
      {
        name: 'Personal Development',
        type: 'Core'
      },
      {
        name: 'Understanding Culture, Society and Politics',
        type: 'Core'
      },
      {
        name: 'Physical Education and Health 1',
        type: 'Core'
      },
      {
        name: 'Physical Education and Health 2',
        type: 'Core'
      },
      {
        name: 'Physical Education and Health 3',
        type: 'Core'
      },
      {
        name: 'Physical Education and Health 4',
        type: 'Core'
      },
      // APPLIED SUBJECTS
      {
        name: 'English for Academic and Professional Purposes',
        type: 'Applied'
      },
      {
        name: 'Practical Research 1',
        type: 'Applied'
      },
      {
        name: 'Practical Research 2',
        type: 'Applied'
      },
      {
        name: 'Filipino sa Piling Larangan (Akademik)',
        type: 'Applied'
      },
      {
        name: 'Filipino sa Piling Larangan (TVL)',
        type: 'Applied'
      },
      {
        name: 'Empowerment Technologies',
        type: 'Applied'
      },
      {
        name: 'Entrepreneurship',
        type: 'Applied'
      },
      {
        name: 'Inquiries, Investigations, and Immersion',
        type: 'Applied'
      },
      // SPECIALIZED SUBJECTS
      {
        name: 'Applied Economics',
        type: 'Specialized - GAS'
      },
      {
        name: 'Disaster Readiness and Risk Reduction',
        type: 'Specialized - GAS'
      },
      {
        name: 'Discipline and Ideas in the Applied Sciences',
        type: 'Specialized - GAS'
      },
      {
        name: 'Disciplines and Ideas in the Social Sciences',
        type: 'Specialized - GAS'
      },
      {
        name: 'Introduction to World Religions and Belief Systems',
        type: 'Specialized - GAS'
      },
      {
        name: 'Organization and Management',
        type: 'Specialized - GAS'
      },
      {
        name: 'Philippine Politics and Governance',
        type: 'Specialized - GAS'
      },
      {
        name: 'Trends, Networks and Critical Thinking in the 21st Century Cultures',
        type: 'Specialized - GAS'
      },
      {
        name: 'Work Immersion',
        type: 'Specialized - GAS'
      },
      // SPECIALIZED ABM
      {
        name: 'Applied Economics',
        type: 'Specialized - ABM'
      },
      {
        name: 'Business Ethics & Social Responsibility',
        type: 'Specialized - ABM'
      },
      {
        name: 'Fundamentals of ABM 1',
        type: 'Specialized - ABM'
      },
      {
        name: 'Fundamentals of ABM 2',
        type: 'Specialized - ABM'
      },
      {
        name: 'Business Mathematics',
        type: 'Specialized - ABM'
      },
      {
        name: 'Business Finance',
        type: 'Specialized - ABM'
      },
      {
        name: 'Organization and Management',
        type: 'Specialized - ABM'
      },
      {
        name: 'Principles of Marketing',
        type: 'Specialized - ABM'
      },
      {
        name: 'Work Immersion',
        type: 'Specialized - ABM'
      },
      // SPECIALIZED HUMMS
      {
        name: 'Community Engagements, Solidarity & Citizenship',
        type: 'Specialized - HUMMS'
      },
      {
        name: 'Creative Nonfiction',
        type: 'Specialized - HUMMS'
      },
      {
        name: 'Creative Writing',
        type: 'Specialized - HUMMS'
      },
      {
        name: 'Discipline and Ideas in the Applied Sciences',
        type: 'Specialized - HUMMS'
      },
      {
        name: 'Discipline and Ideas in the Social Sciences',
        type: 'Specialized - HUMMS'
      },
      {
        name: 'Introduction to World Religions and Beliefs Systems',
        type: 'Specialized - HUMMS'
      },
      {
        name: 'Philippine Politics and Governance',
        type: 'Specialized - HUMMS'
      },
      {
        name: 'Trends, Networks and Critical Thinking in the 21st Century Culture',
        type: 'Specialized - HUMMS'
      },
      {
        name: 'Work Immersion',
        type: 'Specialized - HUMMS'
      },
      // SPECIALIZED STEM
      {
        name: 'Pre-Calculus',
        type: 'Specialized - STEM'
      },
      {
        name: 'Basic Calculus',
        type: 'Specialized - STEM'
      },
      {
        name: 'General Biology 1',
        type: 'Specialized - STEM'
      },
      {
        name: 'General Biology 2',
        type: 'Specialized - STEM'
      },
      {
        name: 'General Physics 1',
        type: 'Specialized - STEM'
      },
      {
        name: 'General Physics 2',
        type: 'Specialized - STEM'
      },
      {
        name: 'General Chemistry 1',
        type: 'Specialized - STEM'
      },
      {
        name: 'General Chemistry 2',
        type: 'Specialized - STEM'
      },
      {
        name: 'Work Immersion',
        type: 'Specialized - STEM'
      },
      // SPECIALIZED TVT - ICT
      {
        name: 'Computer System Servicing 1',
        type: 'Specialized - TVL - ICT'
      },
      {
        name: 'Computer System Servicing 2',
        type: 'Specialized - TVL - ICT'
      },
      {
        name: 'Computer System Servicing 3',
        type: 'Specialized - TVL - ICT'
      },
      {
        name: 'Computer System Servicing 4',
        type: 'Specialized - TVL - ICT'
      },
      {
        name: 'Computer Programming 1',
        type: 'Specialized - TVL - ICT'
      },
      {
        name: 'Computer Programming 2',
        type: 'Specialized - TVL - ICT'
      },
      {
        name: 'Computer Programming 3',
        type: 'Specialized - TVL - ICT'
      },
      {
        name: 'Computer Programming 4',
        type: 'Specialized - TVL - ICT'
      },
      
    ]);

    console.log('✅ Subjects seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
