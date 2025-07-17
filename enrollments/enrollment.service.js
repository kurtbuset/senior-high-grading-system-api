const db = require("../_helpers/db");

module.exports = {
  create,
  getStudentsByTeacherSubjectId,
  updateStudentEnrollment,
  getEnrolledStudents
};



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
