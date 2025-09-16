const schoolYearModel = require('../_models/school_year.model');

module.exports = async (sequelize) => {
  const SchoolYear = schoolYearModel(sequelize);

  await SchoolYear.sync(); // Ensure table exists

  const data = [
    {
      school_year: '2024-2025',
      is_active: false,
      start_date: new Date('2024-06-01'),
      end_date: new Date('2025-03-31'),
    },
    {
      school_year: '2025-2026',
      is_active: true,
      start_date: new Date('2025-06-01'),
      end_date: new Date('2026-03-31'),
    },
  ];

  for (const item of data) {
    await SchoolYear.findOrCreate({
      where: { school_year: item.school_year },
      defaults: item,
    });
  }

  console.log('✅ School Years seeded!');
};
