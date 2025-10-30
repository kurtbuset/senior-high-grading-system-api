const subjectModel = require('../_models/subject.model');

module.exports = async (sequelize) => {
  const Subject = subjectModel(sequelize);

  await Subject.sync(); // Ensure table exists

  const subjects = [
    // 25, 50, 25
    { code: ' ', name: 'Oral Communication', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Reading and Writing', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik', type: 'Core Subject (All Track)' },
    { code: ' ', name: '21st Century Literature from the Philippines and the World', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Contemporary Philippine Arts from he Regions', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Introduction to the Philosophy of the Human Person', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Understanding Culture, Society and Politics', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Media and Information Literacy', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'General Mathematics', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Statistics and Probability', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Earth and Life Science', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Physical Science', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'Personal Development / Pansariling Kaunlaran', type: 'Core Subject (All Track)' },
    { code: ' ', name: 'PE and Health', type: 'Core Subject (All Track)' },

    // 25. 45, 30
    { code: ' ', name: 'English for Academic and Professional Purposes - ACADEMIC', type: 'Academic Track (except Immersion)' },  
    { code: ' ', name: 'Entrepreneurship - ACADEMIC', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Practical Research 1 - ACADEMIC', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Pagsulat sa Filipino sa Piling Larangan - ACADEMIC', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Empowerment Technologies (E-Tech): ICT fpr Professional Tracks - ACADEMIC', type: 'Academic Track (except Immersion)' }, 
    { code: ' ', name: 'Practical Research 2 - ACADEMIC', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Research Project/Culminating Activity - ACADEMIC', type: 'Academic Track (except Immersion)' }, 
    // STEM
    { code: ' ', name: 'Earth Science', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Basic Calculus', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'General Biology 1', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'General Biology 2', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'General Chemistry 1', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'General Chemistry 2', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'General Physics 1', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'General Physics 2', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Pre-Calculus', type: 'Academic Track (except Immersion)' },
    // ABM
    { code: ' ', name: 'Applied Economics', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Business Ethics and Social Responsibility', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Fundamentals of Accountancy, Business, and Management 1', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Fundamentals of Accountancy, Business, and Management 2', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Business Math', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Business Finance', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Organization and Management', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Principles of Marketing', type: 'Academic Track (except Immersion)' },
    // HUMMS
    { code: ' ', name: 'Creative Nonfiction', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Creative Writing/Malikhaing Pagsulat', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Introduction to World Religions and Belief Systems', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Trends, Networks, and Critical Thinking in the 21st Century Culture', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Community Engagement, Solidarity and Citizenship', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Discipline and Ideas in the Applied Sciences', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Discipline and Ideas in the Social Sciences', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Philippine Politics and Governance', type: 'Academic Track (except Immersion)' },
    // GAS
    { code: ' ', name: 'Disaster Readiness and Risk Reduction', type: 'Academic Track (except Immersion)' },
    { code: ' ', name: 'Organization  and Management', type: 'Academic Track (except Immersion)' },
    // { code: ' ', name: '', type: 'subjectType2' },

    // 35, 40, 25
    


    // 20, 60, 20
    
  ];  
  
 for (const subject of subjects) {  
    await Subject.findOrCreate({
      where: { name: subject.name, type: subject.type },
      defaults: subject,      
    });
  }

  const count = await Subject.count();
  console.log(`✅ Subjects seeded successfully! Total: ${count} subjects.`);

};
  