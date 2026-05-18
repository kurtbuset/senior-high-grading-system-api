const db = require("../_helpers/db");
const bcrypt = require("bcryptjs");
const Role = require("../_helpers/role");

module.exports = {
  create,
  getSubjectAndGrades,
  getStudentInfo,
  getAllStudents,
  update,
  deleteStudent,
};

async function getAllStudents() {
  try {
    const students = await db.Student.findAll({
      attributes: [
        "id",
        "school_id",
        "sex",
        "homeroom_id",
        "address",
        "account_id",
      ], // student table columns
      include: [
        {
          model: db.Account,
          attributes: ["firstName", "lastName", "email"], // from account
        },
        {
          model: db.HomeRoom,
          as: "homeroom",
          attributes: ["section"],
          include: [
            {
              model: db.Grade_Level,
              as: "grade_level",
              attributes: ["level"], // grade_level.level
            },
            {
              model: db.Strand,
              as: "strand",
              attributes: ["name"], // strand.name
            },
          ],
        },
      ],
    });

    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}

async function getStudentInfo(accountId) {
  try {
    const student = await db.Student.findOne({
      where: { account_id: accountId },
      attributes: ["school_id"], // student info
      include: [
        {
          model: db.HomeRoom,
          as: "homeroom",
          attributes: ["section"], // homeroom section
          include: [
            {
              model: db.Grade_Level,
              as: "grade_level",
              attributes: ["level"], // grade level
            },
            {
              model: db.Strand,
              as: "strand",
              attributes: ["name"], // strand name
            },
          ],
        },
      ],
    });

    return student;
  } catch (error) {
    console.error("Error fetching student info:", error);
    throw error;
  }
}

async function getSubjectAndGrades(account_id) {
  // fetch student with homeroom, grade level, strand, school_year
  const student = await db.Student.findOne({
    where: { account_id },
    include: [
      {
        model: db.HomeRoom,
        as: "homeroom",
        include: [
          {
            model: db.Grade_Level,
            as: "grade_level",
            attributes: ["id", "level"],
          },
          {
            model: db.Strand,
            as: "strand",
            attributes: ["id", "code", "name"],
          },
          {
            model: db.School_Year,
            as: "school_year",
            attributes: ["id", "school_year"],
          },
        ],
      },
    ],
  });

  if (!student) {
    throw `No student found for account_id: ${account_id}`;
  }

  const gradeLevelId = student.homeroom.grade_level.id;
  const strandId = student.homeroom.strand.id;
  const homeroomId = student.homeroom.id;
  const schoolYearId = student.homeroom.school_year.id;

  // fetch all curriculum subjects for this grade + strand + school year
  const curriculumSubjects = await db.Curriculum_Subject.findAll({
    where: {
      grade_level_id: gradeLevelId,
      strand_id: strandId,
      school_year_id: schoolYearId,
    },
    include: [
      {
        model: db.Subject,
        as: "subject",
        attributes: ["id", "name", "code"],
      },
    ],
  });

  let hasSecondSemEnrollment = false;

  // check enrollments first to see if student has any 2nd sem subject
  for (const cs of curriculumSubjects) {
    if (cs.semester === "SECOND SEMESTER") {
      const assignment = await db.Teacher_Subject_Assignment.findOne({
        where: {
          curriculum_subject_id: cs.id,
          homeroom_id: homeroomId,
        },
      });

      if (assignment) {
        const enrollment = await db.Enrollment.findOne({
          where: {
            student_id: student.id,
            teacher_subject_id: assignment.id,
            is_enrolled: true,
          },
        });

        if (enrollment) {
          hasSecondSemEnrollment = true;
          break; // we only need to detect at least one
        }
      }
    }
  }

  // ✅ include both semesters if at least 1 second sem enrollment exists
  const filteredSubjects = hasSecondSemEnrollment
    ? curriculumSubjects
    : curriculumSubjects.filter((cs) => cs.semester === "FIRST SEMESTER");

  const results = await Promise.all(
    filteredSubjects.map(async (cs) => {
      // check if subject is assigned to a teacher for this homeroom
      const assignment = await db.Teacher_Subject_Assignment.findOne({
        where: {
          curriculum_subject_id: cs.id,
          homeroom_id: homeroomId,
        },
        include: [
          {
            model: db.Account,
            as: "teacher",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      let teacher = null;
      let isEnrolled = false;
      let enrollmentId = null;
      let firstQuarter = null;
      let secondQuarter = null;

      if (assignment) {
        const enrollment = await db.Enrollment.findOne({
          where: {
            student_id: student.id,
            teacher_subject_id: assignment.id,
          },
        });

        if (enrollment && enrollment.is_enrolled) {
          isEnrolled = true;
          enrollmentId = enrollment.id;
          teacher = {
            firstName: assignment.teacher.firstName,
            lastName: assignment.teacher.lastName,
          };

          // 🔑 Fetch final grades
          const grades = await db.Final_Grade.findAll({
            where: { enrollment_id: enrollment.id },
            attributes: ["quarter", "final_grade", "locked_at"],
            order: [["locked_at", "DESC"]], // make sure newest are first
          });

          // group by quarter and take only the latest
          const latestGrades = {};
          for (const g of grades) {
            if (!latestGrades[g.quarter]) {
              latestGrades[g.quarter] = g; // only take the first (newest) per quarter
            }
          }

          if (
            latestGrades["First Quarter"] &&
            latestGrades["First Quarter"].locked_at
          ) {
            firstQuarter = latestGrades["First Quarter"].final_grade;
          }
          if (
            latestGrades["Second Quarter"] &&
            latestGrades["Second Quarter"].locked_at
          ) {
            secondQuarter = latestGrades["Second Quarter"].final_grade;
          }
        }
      }

      return {
        id: cs.id,
        subjectName: cs.subject.name,
        subjectCode: cs.subject.code,
        semester: cs.semester,
        hasTeacherAssigned: !!assignment,
        teacher,
        isEnrolled,
        enrollmentId,
        firstQuarter,
        secondQuarter,
        finalAverage:
          firstQuarter !== null && secondQuarter !== null
            ? Math.round((firstQuarter + secondQuarter) / 2)
            : null,
      };
    }),
  );

  // ✅ Return school year together with results
  return {
    schoolYear: student.homeroom.school_year.school_year,
    subjects: results,
  };
}

async function create(params) {
  const { firstName, lastName, email, sex, homeroom_id, address, lrn_number } =
    params;

  // 1. Validate homeroom
  const homeroom = await db.HomeRoom.findByPk(homeroom_id);
  if (!homeroom) {
    throw `Homeroom with id ${homeroom_id} not found`;
  }

  // 2. Validate email
  const existing = await db.Account.findOne({ where: { email } });
  if (existing) {
    throw `An account with the email "${email}" already exists.`;
  }

  // 3. Auto-generate school_id
  const school_id = await generateSchoolId();

  // 4. Use school_id as password
  const plainPassword = school_id;
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // 5. Create Account
  const account = await db.Account.create({
    firstName,
    lastName,
    email,
    passwordHash,
    role: Role.Student,
    isActive: true,
    verified: Date.now(),
    created: Date.now(),
  });

  // 6. Create Student
  const student = await db.Student.create({
    account_id: account.id,
    school_id,
    sex,
    homeroom_id,
    address,
    lrn_number,
  });

  // 7. Find all subject assignments for this homeroom
  const assignments = await db.Teacher_Subject_Assignment.findAll({
    where: { homeroom_id },
  });

  // 8. Enroll student in each assignment
  const enrollments = [];
  for (const assignment of assignments) {
    const enrollment = await db.Enrollment.create({
      student_id: student.id,
      teacher_subject_id: assignment.id,
      is_enrolled: true,
    });
    enrollments.push(enrollment);
  }

  return {
    message: "Student, account, and enrollments successfully created.",
    student,
    account: {
      username: student.school_id, // 👈 user logs in with school_id
      password: plainPassword, // 👈 same value as school_id
    },
    enrollments,
  };
}

// helper function to auto-generate school_id
async function generateSchoolId() {
  const year = new Date().getFullYear();

  // Find the latest student with this year's prefix
  const latest = await db.Student.findAll({
    where: {
      school_id: {
        [db.Sequelize.Op.like]: `${year}-%`,
      },
    },
    order: [["school_id", "DESC"]],
    limit: 1,
  });

  let nextNumber = 1;
  if (latest.length > 0) {
    const lastId = latest[0].school_id.split("-")[1]; // e.g. "00001"
    nextNumber = parseInt(lastId, 10) + 1;
  }

  return `${year}-${String(nextNumber).padStart(5, "0")}`; // e.g. "2025-00001"
}

function basicDetails(student) {
  const { id, firstname, lastname } = student;
  return { id, firstname, lastname };
}

async function update(studentId, params) {
  const student = await db.Student.findByPk(studentId);
  if (!student) {
    throw `Student with id ${studentId} not found`;
  }

  // Update account fields if provided
  const accountUpdates = {};
  if (params.firstName) accountUpdates.firstName = params.firstName;
  if (params.lastName) accountUpdates.lastName = params.lastName;
  if (params.email) {
    // Check if email is already taken by another account
    const existingEmail = await db.Account.findOne({
      where: { email: params.email },
    });
    if (existingEmail && existingEmail.id !== student.account_id) {
      throw `Email "${params.email}" is already in use`;
    }
    accountUpdates.email = params.email;
  }

  if (Object.keys(accountUpdates).length > 0) {
    await db.Account.update(accountUpdates, {
      where: { id: student.account_id },
    });
  }

  // Update student fields if provided
  const studentUpdates = {};
  if (params.sex) studentUpdates.sex = params.sex;
  if (params.homeroom_id) {
    // Validate homeroom exists
    const homeroom = await db.HomeRoom.findByPk(params.homeroom_id);
    if (!homeroom) {
      throw `Homeroom with id ${params.homeroom_id} not found`;
    }
    studentUpdates.homeroom_id = params.homeroom_id;
  }
  if (params.address !== undefined) studentUpdates.address = params.address;
  if (params.school_id) {
    // Check if school_id is already taken by another student
    const existingSchoolId = await db.Student.findOne({
      where: { school_id: params.school_id },
    });
    if (existingSchoolId && existingSchoolId.id !== student.id) {
      throw `School ID "${params.school_id}" is already in use`;
    }
    studentUpdates.school_id = params.school_id;
  }

  if (Object.keys(studentUpdates).length > 0) {
    await db.Student.update(studentUpdates, {
      where: { id: studentId },
    });
  }

  // Fetch and return updated student
  const updatedStudent = await db.Student.findByPk(studentId, {
    include: [
      {
        model: db.Account,
        attributes: ["firstName", "lastName", "email"],
      },
      {
        model: db.HomeRoom,
        as: "homeroom",
        attributes: ["section"],
        include: [
          {
            model: db.Grade_Level,
            as: "grade_level",
            attributes: ["level"],
          },
          {
            model: db.Strand,
            as: "strand",
            attributes: ["name"],
          },
        ],
      },
    ],
  });

  return updatedStudent;
}

async function deleteStudent(studentId) {
  const student = await db.Student.findByPk(studentId);
  if (!student) {
    throw `Student with id ${studentId} not found`;
  }

  // Delete enrollments first (foreign key constraint)
  await db.Enrollment.destroy({
    where: { student_id: studentId },
  });

  // Delete student record
  await db.Student.destroy({
    where: { id: studentId },
  });

  // Delete associated account
  await db.Account.destroy({
    where: { id: student.account_id },
  });

  return { message: "Student deleted successfully" };
}
