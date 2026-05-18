const subjectModel = require("../_models/subject.model");

module.exports = async (sequelize) => {
  const Subject = subjectModel(sequelize);

  await Subject.sync(); // Ensure table exists

  const subjects = [
    // Core Subjects (1-15) - All Tracks
    { code: " ", name: "Oral Communication", type: "Core Subject (All Track)" },
    {
      code: " ",
      name: "Reading and Writing",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "Pagbasa at Pagsusuri ng Ibat-Ibang Teksto Tungo sa Pananaliksik",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "21st Century Literature from the Philippines and the World",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "Contemporary Philippine Arts from he Regions",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "Introduction to the Philosophy of the Human Person",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "Understanding Culture, Society and Politics",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "Media and Information Literacy",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "General Mathematics",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "Statistics and Probability",
      type: "Core Subject (All Track)",
    },
    {
      code: " ",
      name: "Earth and Life Science",
      type: "Core Subject (All Track)",
    },
    { code: " ", name: "Physical Science", type: "Core Subject (All Track)" },
    {
      code: " ",
      name: "Personal Development / Pansariling Kaunlaran",
      type: "Core Subject (All Track)",
    },
    { code: " ", name: "PE and Health", type: "Core Subject (All Track)" },

    // Academic Track Common Subjects (16-22)
    {
      code: " ",
      name: "English for Academic and Professional Purposes - ACADEMIC",
      type: "Academic Track (except Immersion)",
    },
    {
      code: " ",
      name: "Entrepreneurship - ACADEMIC",
      type: "Academic Track (except Immersion)",
    },
    {
      code: " ",
      name: "Practical Research 1 - ACADEMIC",
      type: "Academic Track (except Immersion)",
    },
    {
      code: " ",
      name: "Pagsulat sa Filipino sa Piling Larangan - ACADEMIC",
      type: "Academic Track (except Immersion)",
    },
    {
      code: " ",
      name: "Empowerment Technologies (E-Tech): ICT fpr Professional Tracks - ACADEMIC",
      type: "Academic Track (except Immersion)",
    },
    {
      code: " ",
      name: "Practical Research 2 - ACADEMIC",
      type: "Academic Track (except Immersion)",
    },
    {
      code: " ",
      name: "Research Project/Culminating Activity - ACADEMIC",
      type: "Academic Track (except Immersion)",
    },

    // STEM Specialized Subjects (23-31)
    { code: " ", name: "Earth Science", type: "STEM" },
    { code: " ", name: "Basic Calculus", type: "STEM" },
    { code: " ", name: "General Biology 1", type: "STEM" },
    { code: " ", name: "General Biology 2", type: "STEM" },
    { code: " ", name: "General Chemistry 1", type: "STEM" },
    { code: " ", name: "General Chemistry 2", type: "STEM" },
    { code: " ", name: "General Physics 1", type: "STEM" },
    { code: " ", name: "General Physics 2", type: "STEM" },
    { code: " ", name: "Pre-Calculus", type: "STEM" },

    // ABM Specialized Subjects (32-39)
    { code: " ", name: "Applied Economics", type: "ABM" },
    {
      code: " ",
      name: "Business Ethics and Social Responsibility",
      type: "ABM",
    },
    {
      code: " ",
      name: "Fundamentals of Accountancy, Business, and Management 1",
      type: "ABM",
    },
    {
      code: " ",
      name: "Fundamentals of Accountancy, Business, and Management 2",
      type: "ABM",
    },
    { code: " ", name: "Business Math", type: "ABM" },
    { code: " ", name: "Business Finance", type: "ABM" },
    { code: " ", name: "Organization and Management", type: "ABM" },
    { code: " ", name: "Principles of Marketing", type: "ABM" },

    // HUMMS Specialized Subjects (40-48)
    { code: " ", name: "Creative Nonfiction", type: "HUMMS" },
    { code: " ", name: "Creative Writing/Malikhaing Pagsulat", type: "HUMMS" },
    {
      code: " ",
      name: "Introduction to World Religions and Belief Systems",
      type: "HUMMS",
    },
    {
      code: " ",
      name: "Trends, Networks, and Critical Thinking in the 21st Century Culture",
      type: "HUMMS",
    },
    {
      code: " ",
      name: "Community Engagement, Solidarity and Citizenship",
      type: "HUMMS",
    },
    {
      code: " ",
      name: "Discipline and Ideas in the Applied Sciences",
      type: "HUMMS",
    },
    {
      code: " ",
      name: "Discipline and Ideas in the Social Sciences",
      type: "HUMMS",
    },
    { code: " ", name: "Philippine Politics and Governance", type: "HUMMS" },
    {
      code: " ",
      name: "Disciplines and Ideas in the Humanities",
      type: "HUMMS",
    },

    // GAS Specialized Subjects (49-50)
    { code: " ", name: "Disaster Readiness and Risk Reduction", type: "GAS" },
    { code: " ", name: "Organization and Management - GAS", type: "GAS" },

    // Additional HUMMS subjects (51-55)
    {
      code: " ",
      name: "World Religions and Belief Systems - HUMMS",
      type: "HUMMS",
    },
    {
      code: " ",
      name: "Trends, Networks and Critical Thinking - HUMMS",
      type: "HUMMS",
    },
    {
      code: " ",
      name: "Community Engagement, Solidarity, and Citizenship - HUMMS",
      type: "HUMMS",
    },
    {
      code: " ",
      name: "Philippine Politics and Governance - HUMMS G12",
      type: "HUMMS",
    },
    {
      code: " ",
      name: "Discipline and Ideas in the Humanities - HUMMS",
      type: "HUMMS",
    },

    // Additional STEM subjects (56-64)
    { code: " ", name: "Pre-Calculus - STEM G11", type: "STEM" },
    { code: " ", name: "Basic Calculus - STEM G11", type: "STEM" },
    { code: " ", name: "General Biology 1 - STEM G11", type: "STEM" },
    { code: " ", name: "General Biology 2 - STEM G11", type: "STEM" },
    { code: " ", name: "General Physics 1 - STEM G12", type: "STEM" },
    { code: " ", name: "General Physics 2 - STEM G12", type: "STEM" },
    { code: " ", name: "General Chemistry 1 - STEM G12", type: "STEM" },
    { code: " ", name: "General Chemistry 2 - STEM G12", type: "STEM" },
    { code: " ", name: "Research in Science", type: "STEM" },
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
