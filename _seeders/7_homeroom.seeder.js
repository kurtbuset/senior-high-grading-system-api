const homeroomModel = require('../_models/homeroom.model')

module.exports = async (sequelize) => {
  const Homeroom = homeroomModel(sequelize)


  const GRADE_LEVELS = { G11: 1, G12: 2 }
  const STRANDS = { STEM: 1, HUMMS: 2, ABM: 3, GAS: 4 }
  const SCHOOL_YEAR = { SY_2025_2026: 2 }

  const homeroomMap = {
    HUMMS: {
      [GRADE_LEVELS.G11]: [
        { section: "A CONSOLACION", teacher_id: 5 },
        { section: "B COMPOSTELA", teacher_id: 5 },
      ]
    }, 
    ABM: {
      [GRADE_LEVELS.G11]: [
        { section: "A BORBOM", teacher_id: 5 },
        { section: "B BALAMBAM", teacher_id: 5 },
      ]
    },
    GAS: {
      [GRADE_LEVELS.G11]: [
        { section: "DANAO", teacher_id: 5 },
      ]
    },
    STEM: {
      [GRADE_LEVELS.G11]: [
        { section: "A SAN REMEGIO", teacher_id: 5 },
        { section: "B SANTA FE", teacher_id: 5 },
      ],
      [GRADE_LEVELS.G12]: [
        { section: "A CARCAR", teacher_id: 5 }
      ]
    },
  }

  try{
    const records = []

    for(const [strandKey, levels] of Object.entries(homeroomMap)){
      for(const [gradeLevel, homerooms] of Object.entries(levels)){
        for(const homeroom of homerooms){
          records.push({
            grade_level_id: Number(gradeLevel),
            strand_id: STRANDS[strandKey],
            school_year_id: SCHOOL_YEAR.SY_2025_2026,
            section: homeroom.section,
            teacher_id: homeroom.teacher_id
          })
        }
      }
    }

    await Homeroom.bulkCreate(records, { ignoreDuplicates: true })
    console.log("Homerooms seeded!")
  } catch(error) {
    console.error("homeroom seeding failed", error)
  }
}