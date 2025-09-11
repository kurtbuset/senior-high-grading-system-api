const db = require("../_helpers/db");

module.exports = {
  addQuiz,
  getQuizzes,
  updateQuiz,
  getQuarterlyGradeSheet,
  getSemestralFinalGrade,
  deleteQuiz,
};

async function deleteQuiz(id) {
  const quiz = await db.Quiz.findByPk(id);
  if (quiz) await quiz.destroy();
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

  await db.Quiz.create(params);
}

async function updateQuiz(id, params) {
  const quiz = await db.Quiz.findByPk(id);
  if (!quiz) return;
  Object.assign(quiz, params);
  await quiz.save();
}


async function getQuizzes(teacher_subject_id, { quarter, type }) {
  // Run both queries in parallel 🚀
  const [quizzes, lockRecord] = await Promise.all([
    db.Quiz.findAll({
      where: { teacher_subject_id, quarter, type },
      attributes: ["id", "description", "hps", "createdAt"],
      raw: true, // directly return plain objects
    }),
    db.Subject_Quarter_Lock.findOne({
      where: { teacher_subject_id, quarter },
      attributes: ["status"],
      raw: true,
    }),
  ]);

  // Format dates in one pass
  const formattedQuizzes = quizzes.map(({ createdAt, ...rest }) => ({
    ...rest,
    createdAt: new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));

  return {
    quizzes: formattedQuizzes,
    lockStatus: lockRecord?.status || "UNLOCKED", // default to UNLOCKED if null
  };
}




function transmuteGrade(actual) {
  const grade = parseFloat(actual);
  if (isNaN(grade)) return "";
  const match = transmutationTable.find(
    (range) => grade >= range.min && grade <= range.max
  );
  return match ? match.grade : "";
}

async function getQuarterlyGradeSheet(teacher_subject_id, { quarter }) {
  // fetch weight percentages
  const { custom_ww_percent, custom_pt_percent, custom_qa_percent } =
    await db.Teacher_Subject_Assignment.findOne({
      where: { id: teacher_subject_id },
      attributes: [
        "custom_ww_percent",
        "custom_pt_percent",
        "custom_qa_percent",
      ],
    });

  const weightMap = {
    "Written Work": custom_ww_percent / 100,
    "Performance Tasks": custom_pt_percent / 100,
    "Quarterly Assesment": custom_qa_percent / 100,
  };

  const quizTypes = [
    "Written Work",
    "Performance Tasks",
    "Quarterly Assesment",
  ];

  // Fetch HPS and Quiz IDs in parallel
  const [hpsArray, quizIdsArray] = await Promise.all([
    Promise.all(
      quizTypes.map((type) =>
        db.Quiz.sum("hps", { where: { teacher_subject_id, quarter, type } })
      )
    ),
    Promise.all(
      quizTypes.map((type) =>
        db.Quiz.findAll({
          where: { teacher_subject_id, quarter, type },
          attributes: ["id"],
        }).then((quizzes) => quizzes.map((q) => q.id))
      )
    ),
  ]);

  const hpsMap = Object.fromEntries(
    quizTypes.map((type, i) => [type, hpsArray[i] || 0])
  );
  const quizIdsMap = Object.fromEntries(
    quizTypes.map((type, i) => [type, quizIdsArray[i]])
  );

  // fetch students
  const students = await db.Enrollment.findAll({
    where: { teacher_subject_id, is_enrolled: true },
    include: [
      {
        model: db.Student,
        include: [
          {
            model: db.Account,
            attributes: ["firstName", "lastName"],
          },
        ],
      },
    ],
  });

  const computeScores = async (enrollment_id, type) => {
    const totalRaw =
      (await db.Quiz_Score.sum("raw_score", {
        where: {
          enrollment_id,
          quiz_id: quizIdsMap[type],
        },
      })) || 0;

    const hps = hpsMap[type];
    const percent = hps ? (totalRaw / hps) * 100 : 0;
    const weighted = hps ? percent * weightMap[type] : 0;

    return {
      percentage: hps ? percent.toFixed(2) : "",
      weighted: hps ? weighted.toFixed(2) : "",
      totalRaw,
    };
  };

  // Compute results in parallel
  const result = await Promise.all(
    students.map(async (enrollment) => {
      const ww = await computeScores(enrollment.id, "Written Work");
      const pt = await computeScores(enrollment.id, "Performance Tasks");
      const qa = await computeScores(enrollment.id, "Quarterly Assesment");

      const initialGrade = [ww.weighted, pt.weighted, qa.weighted]
        .map(Number)
        .reduce((sum, val) => sum + (isNaN(val) ? 0 : val), 0)
        .toFixed(2);

      const transmutedGrade = transmuteGrade(initialGrade);

      return {
        enrollment_id: enrollment.id,
        firstName: enrollment.student.account.firstName,
        lastName: enrollment.student.account.lastName,
        wwPercentageScore: ww.percentage,
        wwWeightedScore: ww.weighted,
        ptPercentageScore: pt.percentage,
        ptWeightedScore: pt.weighted,
        qaPercentageScore: qa.percentage,
        qaWeightedScore: qa.weighted,
        initialGrade,
        transmutedGrade,
      };
    })
  );

  // sort results
  result.sort((a, b) => {
    if (a.lastName !== b.lastName) {
      return a.lastName.localeCompare(b.lastName);
    }
    return a.firstName.localeCompare(b.firstName);
  });

  // 🔒 check lock status
  const lockRecord = await db.Subject_Quarter_Lock.findOne({
    where: { teacher_subject_id, quarter },
  });

  const isLocked = lockRecord?.status === "LOCKED";
  const lockStatus = lockRecord?.status || null;

  // ⚡ keep return value compatible with getSemestralFinalGrade
  return {
    students: result,
    isLocked,
    lockStatus
  };
}


// O (1) - fastest - using Map
async function getSemestralFinalGrade(teacher_subject_id) {
  const [students, { students: firstQuarterGrades }, { students: secondQuarterGrades }] = await Promise.all(
    [
      db.Enrollment.findAll({
        where: { teacher_subject_id, is_enrolled: true },
        include: [
          {
            model: db.Student,
            include: [
              {
                model: db.Account,
                attributes: ["firstName", "lastName"],
              },
            ],
          },
        ],
      }),
      getQuarterlyGradeSheet(teacher_subject_id, { quarter: "First Quarter" }),
      getQuarterlyGradeSheet(teacher_subject_id, { quarter: "Second Quarter" }),
    ]
  );

  // Create quick lookup maps for both quarters
  const firstQuarterMap = new Map(
    firstQuarterGrades.map((g) => [
      g.enrollment_id,
      parseFloat(g.transmutedGrade),
    ])
  );

  const secondQuarterMap = new Map(
    secondQuarterGrades.map((g) => [
      g.enrollment_id,
      parseFloat(g.transmutedGrade),
    ])
  );
const semestralGrades = students.map(({ id, student }) => {
  const first = firstQuarterMap.get(id);
  const second = secondQuarterMap.get(id);

  const bothHaveGrades = first != null && second != null;
  const average = bothHaveGrades ? Math.round((first + second) / 2) : "";

  let remarks = "", description = "";
  if (bothHaveGrades) {
    remarks = average >= 75 ? "PASSED" : "FAILED";
    description =
      average >= 90
        ? "Outstanding"
        : average >= 85
        ? "Very Satisfactory"
        : average >= 80
        ? "Satisfactory"
        : average >= 75
        ? "Fairly Satisfactory"
        : "Did Not Meet Expectations";
  }

  return {
    enrollment_id: id,
    firstName: student.account.firstName,
    lastName: student.account.lastName,
    firstQuarter: first ?? "",
    secondQuarter: second ?? "",
    average,
    remarks,
    description,
  };
});

// 🔑 sort before returning
semestralGrades.sort((a, b) => {
  if (a.lastName !== b.lastName) {
    return a.lastName.localeCompare(b.lastName);
  }
  return a.firstName.localeCompare(b.firstName);
});

return semestralGrades;
}

const transmutationTable = [
  { min: 100.0, max: 100.0, grade: 100 },
  { min: 98.4, max: 99.99, grade: 99 },
  { min: 96.8, max: 98.39, grade: 98 },
  { min: 95.2, max: 96.79, grade: 97 },
  { min: 93.6, max: 95.19, grade: 96 },
  { min: 92.0, max: 93.59, grade: 95 },
  { min: 90.4, max: 91.99, grade: 94 },
  { min: 88.8, max: 90.39, grade: 93 },
  { min: 87.2, max: 88.79, grade: 92 },
  { min: 85.6, max: 87.19, grade: 91 },
  { min: 84.0, max: 85.59, grade: 90 },
  { min: 82.4, max: 83.99, grade: 89 },
  { min: 80.8, max: 82.39, grade: 88 },
  { min: 79.2, max: 80.79, grade: 87 },
  { min: 77.6, max: 79.19, grade: 86 },
  { min: 76.0, max: 77.59, grade: 85 },
  { min: 74.4, max: 75.99, grade: 84 },
  { min: 72.8, max: 74.39, grade: 83 },
  { min: 71.2, max: 72.79, grade: 82 },
  { min: 69.6, max: 71.19, grade: 81 },
  { min: 68.0, max: 69.59, grade: 80 },
  { min: 66.4, max: 67.99, grade: 79 },
  { min: 64.8, max: 66.39, grade: 78 },
  { min: 63.2, max: 64.79, grade: 77 },
  { min: 61.6, max: 63.19, grade: 76 },
  { min: 60.0, max: 61.59, grade: 75 },
  { min: 56.0, max: 59.99, grade: 74 },
  { min: 52.0, max: 55.99, grade: 73 },
  { min: 48.0, max: 51.99, grade: 72 },
  { min: 44.0, max: 47.99, grade: 71 },
  { min: 40.0, max: 43.99, grade: 70 },
  { min: 36.0, max: 39.99, grade: 69 },
  { min: 32.0, max: 35.99, grade: 68 },
  { min: 28.0, max: 31.99, grade: 67 },
  { min: 24.0, max: 27.99, grade: 66 },
  { min: 20.0, max: 23.99, grade: 65 },
  { min: 16.0, max: 19.99, grade: 64 },
  { min: 12.0, max: 15.99, grade: 63 },
  { min: 8.0, max: 11.99, grade: 62 },
  { min: 4.0, max: 7.99, grade: 61 },
  { min: 0.0, max: 3.99, grade: 60 },
];
