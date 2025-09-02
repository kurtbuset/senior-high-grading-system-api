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
        code: 'ENGL1',
        name: 'Oral Communication',
        type: 'Core'
      },
      {
        code: 'ENGL2',
        name: 'Academic Reading and Writing',
        type: 'Core'
      },
      {
        code: 'FIL1',
        name: 'Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino',
        type: 'Core'
      },
      {
        code: 'FIL2',
        name: 'Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik',
        type: 'Core'
      },
      {
        code: 'MATH1',
        name: 'General Mathematics',
        type: 'Core'
      },
      {
        code: 'MATH2',
        name: 'Statistics and Probability',
        type: 'Core'
      },
      {
        code: 'SCI 1A',
        name: 'Earth and Life Science',
        type: 'Core'
      },
      {
        code: 'SCI 1B',
        name: 'Earth Science',
        type: 'Core'
      },
      {
        code: 'SCI2',
        name: 'Physical Science',
        type: 'Core'
      },
      {
        code: 'LIT',
        name: '21st Century Literature from the Philippines and the World',
        type: 'Core'
      },
      {
        code: 'CAR',
        name: 'Contemporary Philippine Arts from the Regions',
        type: 'Core'
      },
      {
        code: 'MIL',
        name: 'Media and Information Literacy',
        type: 'Core'
      },
      {
        code: 'DRRR',
        name: 'Disaster Readiness and Risk Reduction',
        type: 'Core'
      },
      {
        code: 'PPT',
        name: 'Introduction to the Philosophy of the Human Person',
        type: 'Core'
      },
      {
        code: 'PER DEV',
        name: 'Personal Development',
        type: 'Core'
      },
      {
        code: 'UCS',
        name: 'Understanding Culture, Society and Politics',
        type: 'Core'
      },
      {
        code: 'PE1',
        name: 'Physical Education and Health 1',
        type: 'Core'
      },
      {
        code: 'PE2',
        name: 'Physical Education and Health 2',
        type: 'Core'
      },
      {
        code: 'PE3',
        name: 'Physical Education and Health 3',
        type: 'Core'
      },
      {
        code: 'PE4',
        name: 'Physical Education and Health 4',
        type: 'Core'
      },
      // APPLIED SUBJECTS
      {
        code: 'EAPP',
        name: 'English for Academic and Professional Purposes',
        type: 'Applied'
      },
      {
        code: 'RES 1',
        name: 'Practical Research 1',
        type: 'Applied'
      },
      {
        code: 'RES 2',
        name: 'Practical Research 2',
        type: 'Applied'
      },
      {
        code: 'FIL 3A',
        name: 'Filipino sa Piling Larangan (Akademik)',
        type: 'Applied'
      },
      {
        code: 'FIL 3B',
        name: 'Filipino sa Piling Larangan (TVL)',
        type: 'Applied'
      },
      {
        code: 'E-TECH',
        name: 'Empowerment Technologies',
        type: 'Applied'
      },
      {
        code: 'ENTREP',
        name: 'Entrepreneurship',
        type: 'Applied'
      },
      {
        code: '3I',
        name: 'Inquiries, Investigations, and Immersion',
        type: 'Applied'
      },
      // SPECIALIZED SUBJECTS
      {
        code: 'AE',
        name: 'Applied Economics',
        type: 'Specialized - GAS'
      },
      {
        code: 'DRRR',
        name: 'Disaster Readiness and Risk Reduction',
        type: 'Specialized - GAS'
      },
      { 
        code: 'DIASS',
        name: 'Discipline and Ideas in the Applied Sciences',
        type: 'Specialized - GAS'
      },
      {
        code: 'DISS',
        name: 'Disciplines and Ideas in the Social Sciences',
        type: 'Specialized - GAS'
      },
      {
        code: 'WRB',
        name: 'Introduction to World Religions and Belief Systems',
        type: 'Specialized - GAS'
      },
      {
        code: 'OM',
        name: 'Organization and Management',
        type: 'Specialized - GAS'
      },
      {
        code: 'PG',
        name: 'Philippine Politics and Governance',
        type: 'Specialized - GAS'
      },
      {
        code: 'TNCT',
        name: 'Trends, Networks and Critical Thinking in the 21st Century Cultures',
        type: 'Specialized - GAS'
      },
      {
        code: 'WIMM',
        name: 'Work Immersion',
        type: 'Specialized - GAS'
      },
      // SPECIALIZED ABM
      {
        code: 'AE',
        name: 'Applied Economics',
        type: 'Specialized - ABM'
      },
      {
        code: 'ESR',
        name: 'Business Ethics & Social Responsibility',
        type: 'Specialized - ABM'
      },
      {
        code: 'FABM1',
        name: 'Fundamentals of ABM 1',
        type: 'Specialized - ABM'
      },
      {
        code: 'FABM2',
        name: 'Fundamentals of ABM 2',
        type: 'Specialized - ABM'
      },
      {
        code: 'BM',
        name: 'Business Mathematics',
        type: 'Specialized - ABM'
      },
      {
        code: 'BF',
        name: 'Business Finance',
        type: 'Specialized - ABM'
      },
      {
        code: 'OM',
        name: 'Organization and Management',
        type: 'Specialized - ABM'
      },
      {
        code: 'PM',
        name: 'Principles of Marketing',
        type: 'Specialized - ABM'
      },
      {
        code: 'WIMM',
        name: 'Work Immersion',
        type: 'Specialized - ABM'
      },
      // SPECIALIZED HUMMS
      {
        code: 'CSC',
        name: 'Community Engagements, Solidarity & Citizenship',
        type: 'Specialized - HUMMS'
      },
      { 
        code: 'CNF',
        name: 'Creative Nonfiction',
        type: 'Specialized - HUMMS'
      },
      {
        code: 'CW',
        name: 'Creative Writing',
        type: 'Specialized - HUMMS'
      },
      {
        code: 'DIASS',
        name: 'Discipline and Ideas in the Applied Sciences',
        type: 'Specialized - HUMMS'
      },
      {
        code: 'DISS',
        name: 'Discipline and Ideas in the Social Sciences',
        type: 'Specialized - HUMMS'
      },
      {
        code: 'WRB',
        name: 'Introduction to World Religions and Beliefs Systems',
        type: 'Specialized - HUMMS'
      },
      {
        code: 'PG',
        name: 'Philippine Politics and Governance',
        type: 'Specialized - HUMMS'
      },
      {
        code: 'TNCT',
        name: 'Trends, Networks and Critical Thinking in the 21st Century Culture',
        type: 'Specialized - HUMMS'
      },
      {
        code: 'WIMM',
        name: 'Work Immersion',
        type: 'Specialized - HUMMS'
      },
      // SPECIALIZED STEM
      {
        code: 'PRECAL', 
        name: 'Pre-Calculus',
        type: 'Specialized - STEM'
      },
      {
        code: 'SBCAL',
        name: 'Basic Calculus',
        type: 'Specialized - STEM'
      },
      {
        code: 'SBIO 1',
        name: 'General Biology 1',
        type: 'Specialized - STEM'
      },
      {
        code: 'SBIO 2',
        name: 'General Biology 2',
        type: 'Specialized - STEM'
      },
      {
        code: 'SGP 1',
        name: 'General Physics 1',
        type: 'Specialized - STEM'
      },
      {
        code: 'SGP 2',
        name: 'General Physics 2',
        type: 'Specialized - STEM'
      },
      {
        code: 'SGC 1',
        name: 'General Chemistry 1',
        type: 'Specialized - STEM'
      },
      {
        code: 'SGC 2',
        name: 'General Chemistry 2',
        type: 'Specialized - STEM'
      },
      {
        code: 'WIMM',
        name: 'Work Immersion',
        type: 'Specialized - STEM'
      },
      // SPECIALIZED TVT - ICT
      {
        code: '',
        name: 'Computer System Servicing 1',
        type: 'Specialized - TVL - ICT'
      },
      {
        code: '',
        name: 'Computer System Servicing 2',
        type: 'Specialized - TVL - ICT'
      },
      {
        code: '',
        name: 'Computer System Servicing 3',
        type: 'Specialized - TVL - ICT'
      },
      {
        code: '',
        name: 'Computer System Servicing 4',
        type: 'Specialized - TVL - ICT'
      },
      {
        code: '',
        name: 'Computer Programming 1',
        type: 'Specialized - TVL - ICT'
      },
      {
        code: '',
        name: 'Computer Programming 2',
        type: 'Specialized - TVL - ICT'
      },
      {
        code: '',
        name: 'Computer Programming 3',
        type: 'Specialized - TVL - ICT'
      },
      {
        code: '',
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
