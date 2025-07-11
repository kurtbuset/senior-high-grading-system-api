const db = require("../_helpers/db");

module.exports = {
  create,
  getStudentsByTeacherSubjectId,
  updateStudentEnrollment,
  getEnrolledStudents,
  getQuarterlyGradeSheet,
};

// partial pa ni goi
// get quarterly grade sheet based on params sa frontend whether First or Second Quarter
// fetch also percentage of subject based on teacher_subject_id
async function getQuarterlyGradeSheet(teacher_subject_id) {
  // 1st quarter; WW
  const writtenWorkHPS = await db.Quiz.sum("hps", {
    where: {
      teacher_subject_id,
      quarter: "First Quarter",
      type: "Written Work",
    },
  });

  const quizzes = await db.Quiz.findAll({
    where: {
      teacher_subject_id,
      quarter: "First Quarter",
      type: "Written Work",
    },
    attributes: ["id"],
  });
  // quiz id of WW
  const wwQuizIds = quizzes.map((q) => q.id);

  // students
  const students = await db.Enrollment.findAll({
    where: {
      teacher_subject_id,
      is_enrolled: true,
    },
    include: [
      {
        model: db.Student,
        attributes: ["firstname", "lastname"],
      },
    ],
  });

  const result = [];

  for (const enrollment of students) {
    const totalScore = await db.Quiz_Score.sum("raw_score", {
      where: {
        enrollment_id: enrollment.id,
        quiz_id: wwQuizIds, // only those WW quiz IDs
      },
    });

    result.push({
      enrollment_id: enrollment.id,
      firstName: enrollment.student.firstname,
      lastName: enrollment.student.lastname,
      totalScore: totalScore || 0,
      totalHPS: writtenWorkHPS || 0,
      percentageScore: writtenWorkHPS
        ? ((totalScore / writtenWorkHPS) * 100).toFixed(2)
        : "",
      weightedScore: writtenWorkHPS
        ? (
          // fixed pa ang percentage sa subject
            parseFloat(((totalScore / writtenWorkHPS) * 100).toFixed(2)) * 0.25
          ).toFixed(2)
        : "",
    });
  }

  console.log("result: ", result);

  return result;
}

// return also first, second quarter computed grade
async function getEnrolledStudents(teacher_subject_id) {
  const enrolledStudents = await db.Enrollment.findAll({
    where: {
      teacher_subject_id,
      is_enrolled: true,
    },
    include: [
      {
        model: db.Student,
        attributes: ["id", "firstname", "lastname"],
      },
    ],
  });

  return enrolledStudents.map((x) => ({
    enrollment_id: x.id,
    student_id: x.student.id,
    firstName: x.student.firstname,
    lastName: x.student.lastname,
  }));
}

async function updateStudentEnrollment(teacher_subject_id, params) {
  const enrollmentIds = params.map((e) => e.id);

  if (!enrollmentIds.length) throw "No enrollments to update";

  await db.Enrollment.update(
    { is_enrolled: true },
    {
      where: {
        id: enrollmentIds,
        teacher_subject_id,
      },
    }
  );

  return { message: "Students enrolled successfully :)" };
}

async function getStudentsByTeacherSubjectId(teacher_subject_id) {
  const students = await db.Enrollment.findAll({
    where: {
      teacher_subject_id,
      is_enrolled: false,
    },
    include: [
      {
        model: db.Student,
        attributes: ["id", "firstname", "lastname"],
      },
    ],
  });

  // console.log(JSON.stringify(enrolledStudents, null, 1))

  return (
    students
      // .filter(x => x.Student)
      .map((x) => ({
        enrollment_id: x.id,
        student_id: x.student.id,
        firstName: x.student.firstname,
        lastName: x.student.lastname,
        is_enrolled: x.is_enrolled,
      }))
  );
}

async function create(params) {
  const enrollment = new db.Enrollment(params);

  enrollment.is_enrolled = false;

  await enrollment.save();

  return basicDetails(enrollment);
}

function basicDetails(enrollment) {
  const { id, student_id, teacher_subject_id, is_enrolled } = enrollment;
  return { id, student_id, teacher_subject_id, is_enrolled };
}
