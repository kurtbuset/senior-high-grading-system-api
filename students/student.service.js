const db = require("../_helpers/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Role = require("../_helpers/role");

module.exports = {
  create,
  getSubjectAndGrades,
  getStudentInfo,
};

async function getStudentInfo(accountId) {
  try {
    const student = await db.Student.findOne({
      where: { account_id: accountId },
      attributes: ["school_id", "address", "lrn_number"], // student info
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
        finalAverage: firstQuarter !== null && secondQuarter !== null
            ? Math.round((firstQuarter + secondQuarter) / 2)
            : null,
      };
    })
  );

  // ✅ Return school year together with results
  return {
    schoolYear: student.homeroom.school_year.school_year,
    subjects: results,
  };
}

async function create(params) {
  const {
    firstName,
    lastName,
    email,
    sex,
    homeroom_id,
    address,
    lrn_number,
    school_id,
  } = params;

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

  // 3. Validate school_id uniqueness
  const existingSchoolId = await db.Student.findOne({ where: { school_id } });
  if (existingSchoolId) {
    throw `Student with school_id "${school_id}" already exists.`;
  }

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
      is_enrolled: false,
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

// helper function
async function generateSchoolId() {
  const year = new Date().getFullYear();

  // Count how many students exist this year
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
  if (latest.length) {
    const lastId = latest[0].school_id.split("-")[1]; // e.g. 00001
    nextNumber = parseInt(lastId) + 1;
  }

  return `${year}-${String(nextNumber).padStart(5, "0")}`; // e.g. 2025-00001
}

function basicDetails(student) {
  const { id, firstname, lastname } = student;
  return { id, firstname, lastname };
}
