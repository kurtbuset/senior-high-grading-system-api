const strandModel = require('../_models/strand.model');

module.exports = async (sequelize) => {
  const Strand = strandModel(sequelize);

  await Strand.sync(); // Ensure table exists

  const data = [
    {
      code: "STEM",
      name: "Science Technology Engineering and Mathematics",
    },
    {
      code: "HUMMS",
      name: "Humanities and Social Sciences",
    },
    {
      code: "ABM",
      name: "Accountancy and Business Management",
    },
    {
      code: "GAS",
      name: "General Academic Strand",
    },
  ];

  for (const item of data) {
    await Strand.findOrCreate({
      where: { code: item.code }, // avoid duplicate strand codes
      defaults: item,
    });
  }

  console.log('✅ Strands seeded!');
};
