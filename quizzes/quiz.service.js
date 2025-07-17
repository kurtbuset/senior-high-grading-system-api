const db = require("../_helpers/db");

module.exports = {
  addQuiz,
  getQuizzes,
  updateQuiz,
  getQuarterlyGradeSheet,
  getSemestralFinalGrade
};

async function getSemestralFinalGrade(teacher_subject_id) {
  const quarters = ["First Quarter", "Second Quarter"];

  const students = await db.Enrollment.findAll({
    where: { teacher_subject_id, is_enrolled: true },
    include: [{ model: db.Student, attributes: ["firstname", "lastname"] }],
  });

  const results = [];

  for (const enrollment of students) {
    const transmutedGrades = [];

    for (const quarter of quarters) {
      const quarterly = await getQuarterlyGradeSheet(teacher_subject_id, { quarter });

      const studentRecord = quarterly.find(
        (record) => record.enrollment_id === enrollment.id
      );

      const transmuted = studentRecord?.transmutedGrade
        ? parseFloat(studentRecord.transmutedGrade)
        : null;

      transmutedGrades.push(transmuted);
    }

    const [firstQuarter, secondQuarter] = transmutedGrades;
    const average =
      firstQuarter != null && secondQuarter != null
        ? parseFloat(((firstQuarter + secondQuarter) / 2).toFixed(2))
        : null;

    let remarks = "";
    let description = "";

    if (average !== null) {
      remarks = average >= 75 ? "PASSED" : "FAILED";

      if (average >= 90) {
        description = "Outstanding";
      } else if (average >= 85) {
        description = "Very Satisfactory";
      } else if (average >= 80) {
        description = "Satisfactory";
      } else if (average >= 75) {
        description = "Fairly Satisfactory";
      } else {
        description = "Did Not Meet Expectations";
      }
    }

    results.push({
      firstName: enrollment.student.firstname,
      lastName: enrollment.student.lastname,
      firstQuarter,
      secondQuarter,
      average,
      remarks,
      description,
    });
  }

  return results;
}


const transmutationTable = [
  { min: 100.00, max: 100.00, grade: 100 },
  { min: 98.40, max: 99.99, grade: 99 },
  { min: 96.80, max: 98.39, grade: 98 },
  { min: 95.20, max: 96.79, grade: 97 },
  { min: 93.60, max: 95.19, grade: 96 },
  { min: 92.00, max: 93.59, grade: 95 },
  { min: 90.40, max: 91.99, grade: 94 },
  { min: 88.80, max: 90.39, grade: 93 },
  { min: 87.20, max: 88.79, grade: 92 },
  { min: 85.60, max: 87.19, grade: 91 },
  { min: 84.00, max: 85.59, grade: 90 },
  { min: 82.40, max: 83.99, grade: 89 },
  { min: 80.80, max: 82.39, grade: 88 },
  { min: 79.20, max: 80.79, grade: 87 },
  { min: 77.60, max: 79.19, grade: 86 },
  { min: 76.00, max: 77.59, grade: 85 },
  { min: 74.40, max: 75.99, grade: 84 },
  { min: 72.80, max: 74.39, grade: 83 },
  { min: 71.20, max: 72.79, grade: 82 },
  { min: 69.60, max: 71.19, grade: 81 },
  { min: 68.00, max: 69.59, grade: 80 },
  { min: 66.40, max: 67.99, grade: 79 },
  { min: 64.80, max: 66.39, grade: 78 },
  { min: 63.20, max: 64.79, grade: 77 },
  { min: 61.60, max: 63.19, grade: 76 },
  { min: 60.00, max: 61.59, grade: 75 },
  { min: 56.00, max: 59.99, grade: 74 },
  { min: 52.00, max: 55.99, grade: 73 },
  { min: 48.00, max: 51.99, grade: 72 },
  { min: 44.00, max: 47.99, grade: 71 },
  { min: 40.00, max: 43.99, grade: 70 },
  { min: 36.00, max: 39.99, grade: 69 },
  { min: 32.00, max: 35.99, grade: 68 },
  { min: 28.00, max: 31.99, grade: 67 },
  { min: 24.00, max: 27.99, grade: 66 },
  { min: 20.00, max: 23.99, grade: 65 },
  { min: 16.00, max: 19.99, grade: 64 },
  { min: 12.00, max: 15.99, grade: 63 },
  { min: 8.00, max: 11.99, grade: 62 },
  { min: 4.00, max: 7.99, grade: 61 },
  { min: 0.00, max: 3.99, grade: 60 },
];

// helper function
function transmuteGrade(actual) {
  const grade = parseFloat(actual);
  if (isNaN(grade)) return "";
  const match = transmutationTable.find((range) => grade >= range.min && grade <= range.max);
  return match ? match.grade : "";
}

async function getQuarterlyGradeSheet(teacher_subject_id, param) {
  const { quarter } = param;

  // Fetch custom weights from the assignment
  const weights = await db.Teacher_Subject_Assignment.findOne({
    where: { id: teacher_subject_id },
    attributes: ["custom_ww_percent", "custom_pt_percent", "custom_qa_percent"],
  });

  const weightMap = {
    "Written Work": weights.custom_ww_percent / 100,
    "Performance Tasks": weights.custom_pt_percent / 100,
    "Quarterly Assesment": weights.custom_qa_percent / 100,
  };

  // Get total HPS per assessment type
  const types = Object.keys(weightMap);
  const [wwTotalHPS = 0, ptTotalHPS = 0, qaTotalHPS = 0] = await Promise.all(
    types.map((type) =>
      db.Quiz.sum("hps", {
        where: { teacher_subject_id, quarter, type },
      })
    )
  );

  const hpsMap = {
    "Written Work": wwTotalHPS,
    "Performance Tasks": ptTotalHPS,
    "Quarterly Assesment": qaTotalHPS,
  };

  // Helper: Get quiz IDs by type
  const getQuizIds = async (type) => {
    const quizzes = await db.Quiz.findAll({
      where: { teacher_subject_id, quarter, type },
      attributes: ["id"],
    });
    return quizzes.map((q) => q.id);
  };

  const [wwQuizIds, ptQuizIds, qaQuizIds] = await Promise.all([
    getQuizIds("Written Work"),
    getQuizIds("Performance Tasks"),
    getQuizIds("Quarterly Assesment"),
  ]);

  const quizIdsMap = {
    "Written Work": wwQuizIds,
    "Performance Tasks": ptQuizIds,
    "Quarterly Assesment": qaQuizIds,
  };

  // Get all enrolled students
  const students = await db.Enrollment.findAll({
    where: { teacher_subject_id, is_enrolled: true },
    include: [{ model: db.Student, attributes: ["firstname", "lastname"] }],
  });

  // Helper: compute raw, % score, and weighted
  const computeScores = async (enrollment_id, type) => {
    const totalRaw = await db.Quiz_Score.sum("raw_score", {
      where: {
        enrollment_id,
        quiz_id: quizIdsMap[type],
      },
    }) || 0;

    const totalHPS = hpsMap[type];
    const percentage = totalHPS ? ((totalRaw / totalHPS) * 100).toFixed(2) : "";
    const weighted = totalHPS
      ? (parseFloat(percentage) * weightMap[type]).toFixed(2)
      : "";

    return { totalRaw, totalHPS, percentage, weighted };
  };

  const result = [];

  for (const enrollment of students) {
    const ww = await computeScores(enrollment.id, "Written Work");
    const pt = await computeScores(enrollment.id, "Performance Tasks");
    const qa = await computeScores(enrollment.id, "Quarterly Assesment");

    const initialGrade = [
      ww.weighted,
      pt.weighted,
      qa.weighted,
    ]
      .map(Number)
      .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0)
      .toFixed(2);

    const transmutedGrade = transmuteGrade(initialGrade);

    result.push({
      enrollment_id: enrollment.id,
      firstName: enrollment.student.firstname,
      lastName: enrollment.student.lastname,

      // Written Work
      wwTotalRawScore: ww.totalRaw,
      wwTotalHPS: ww.totalHPS,
      wwPercentageScore: ww.percentage,
      wwWeightedScore: ww.weighted,

      // Performance Tasks
      ptTotalRawScore: pt.totalRaw,
      ptTotalHPS: pt.totalHPS,
      ptPercentageScore: pt.percentage,
      ptWeightedScore: pt.weighted,

      // Quarterly Assessment
      qaTotalRawScore: qa.totalRaw,
      qaTotalHPS: qa.totalHPS,
      qaPercentageScore: qa.percentage,
      qaWeightedScore: qa.weighted,

      // Final grade (before transmutation)   
      initialGrade,
      transmutedGrade
    });
  }

  console.log("result:", result);
  return result;
}


async function addQuiz(params) {
  if (params.type === "Quarterly Assesment") {
    const existing = await db.Quiz.findOne({
      where: {
        teacher_subject_id: params.teacher_subject_id,
        quarter: params.quarter,
        type: "Quarterly Assesment",
      },
    });

    if (existing) {
      throw "Only one Quarterly Assessment is allowed per subject and quarter.";
    }
  }

  const quiz = new db.Quiz(params);
  await quiz.save();
}

async function updateQuiz(id, params) {
  const quiz = await db.Quiz.findByPk(id);
  Object.assign(quiz, params);

  await quiz.save();
}

async function getQuizzes(teacher_subject_id, param) {
  const quizzes = await db.Quiz.findAll({
    where: {
      teacher_subject_id,
      quarter: param.quarter,
      type: param.type,
    },
    attributes: ["id", "description", "hps"],
  });

  // console.log(JSON.stringify(quizzes, null, 2))
  return quizzes;
}

function basicDetails(quiz) {
  const { id, teacher_subject_id, type, quarter, description, hps } = quiz;
  return { id, teacher_subject_id, type, quarter, description, hps };
}
