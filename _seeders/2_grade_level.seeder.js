const gradeLevelModel = require('../_models/grade_level.model');

module.exports = async (sequelize) => {
  const GradeLevel = gradeLevelModel(sequelize);

  await GradeLevel.sync(); // make sure table exists

  const data = [
    { level: 11 },
    { level: 12 },
  ];

  for (const item of data) {
    await GradeLevel.findOrCreate({
      where: { level: item.level },
      defaults: item,
    });
  }

  console.log('✅ GradeLevels seeded!');
};
