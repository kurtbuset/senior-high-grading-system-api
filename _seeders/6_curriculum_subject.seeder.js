const curriculumSubjectModel = require("../_models/curriculum_subject.model");

module.exports = async (sequelize) => {
  const CurriculumSubject = curriculumSubjectModel(sequelize);

  // ✅ Constants
  const GRADE_LEVELS = { G11: 1, G12: 2 };
  const STRANDS = { STEM: 1, HUMMS: 2, ABM: 3, GAS: 4 };
  const SCHOOL_YEAR = { SY_2025_2026: 2 };
  const SEMESTERS = { FIRST: "FIRST SEMESTER", SECOND: "SECOND SEMESTER" };

  // ✅ Subject IDs grouped by strand/semester/grade level
  const subjectMap = {
    HUMMS: {
      [GRADE_LEVELS.G11]: {
        [SEMESTERS.FIRST]: [1, 3, 5, 7, 10, 14, 17, 21, 53, 51],
        [SEMESTERS.SECOND]: [2, 4, 6, 9, 16, 18, 22, 26, 49, 52],
      },
      [GRADE_LEVELS.G12]: {
        [SEMESTERS.FIRST]: [11, 12, 15, 19, 23, 25, 48, 51, 54],
        [SEMESTERS.SECOND]: [20, 27, 28, 47, 55],
      },
    },
    STEM: { 
      [GRADE_LEVELS.G11]: {
        [SEMESTERS.FIRST]: [1, 3, 5, 7, 10, 14, 17, 21, 56, 58],
        [SEMESTERS.SECOND]: [2, 4, 6, 9, 16, 18, 22, 26, 57, 59],  
      },
      [GRADE_LEVELS.G12]: {
        [SEMESTERS.FIRST]: [11, 12, 15, 19, 23, 25, 60, 62],
        [SEMESTERS.SECOND]: [20, 27, 28, 61, 63, 64],  
      },  
    },
    ABM: {
      [GRADE_LEVELS.G11]: {
        [SEMESTERS.FIRST]: [1, 3, 5, 7, 10, 14, 17, 21, 38, 44],
        [SEMESTERS.SECOND]: [2, 4, 6, 9, 16, 18, 22, 26, 40, 42],
      },
      [GRADE_LEVELS.G12]: {
        [SEMESTERS.FIRST]: [11, 12, 15, 19, 23, 25, 41, 43, 45],
        [SEMESTERS.SECOND]: [20, 27, 28, 39, 46],
      },
    },
    GAS: {
      [GRADE_LEVELS.G11]: {
        [SEMESTERS.FIRST]: [1, 3, 5, 7, 10, 14, 17, 21, 35, 34],
        [SEMESTERS.SECOND]: [2, 4, 6, 9, 16, 18, 22, 26, 30, 29],
      },
      [GRADE_LEVELS.G12]: {
        [SEMESTERS.FIRST]: [11, 12, 15, 19, 23, 25, 32, 33, 36],
        [SEMESTERS.SECOND]: [20, 27, 28, 31, 37],
      },
    },
  };

  try {
    const records = [];

    for (const [strandKey, levels] of Object.entries(subjectMap)) {
      for (const [gradeLevel, semesters] of Object.entries(levels)) { 
        for (const [semester, subjects] of Object.entries(semesters)) {
          for (const subject_id of subjects) {
            records.push({
              subject_id,
              grade_level_id: Number(gradeLevel),
              strand_id: STRANDS[strandKey],
              semester,
              school_year_id: SCHOOL_YEAR.SY_2025_2026,
            });
          }
        }
      }
    } 

    await CurriculumSubject.bulkCreate(records, { ignoreDuplicates: true });
    console.log("✅ Curriculum subjects seeded!");
  } catch (error) {
    console.error("❌ Curriculum subjects seeding failed:", error);
  }

  // 🔒 DO NOT close the connection here; seed.js manages it
};
