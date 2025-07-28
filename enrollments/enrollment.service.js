const db = require("../_helpers/db");

module.exports = {
  create,
  getStudentsByTeacherSubjectId,
  updateStudentEnrollment,
  getEnrolledStudents,
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
        include: [
          {
            model: db.Account,
            attributes: ["firstName", "lastName"],
          },
        ],
        attributes: [
          "school_id",
          "sex",
          "address",
          "guardian_name",
          "guardian_contact",
        ],
      },
    ],
  });

  console.log(JSON.stringify(students, null, 2));

  return (
    students
      .map((x) => ({
        enrollment_id: x.id,
        firstName: x.student.account.firstName,
        lastName: x.student.account.lastName,
        school_id: x.student.school_id,
        sex: x.student.sex,
        address: x.student.address,
        guardian_name: x.student.guardian_name,
        guardian_contact: x.student.guardian_contact,
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
