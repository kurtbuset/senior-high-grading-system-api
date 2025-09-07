const db = require("../_helpers/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Role = require("../_helpers/role");

module.exports = {
  create,
  getSubjectAndGrades,
  getStudentInfo
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
            as: "account",
            attributes: ["id", "firstName", "lastName"],
          },
        ],
      });

      let teacher = null;
      let isEnrolled = false;
      let enrollmentId = null;
      let firstQuarter = null;
      let secondQuarter = null;
      let finalAverage = null;

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
            firstName: assignment.account.firstName,
            lastName: assignment.account.lastName,
          };

          // 🔑 Fetch final grades if locked
          const grades = await db.Final_Grade.findAll({
            where: { enrollment_id: enrollment.id },
            attributes: ["quarter", "final_grade", "locked_at"],
          });

          for (const g of grades) {
            if (g.quarter === "First Quarter" && g.locked_at) {
              firstQuarter = g.final_grade;
            }
            if (g.quarter === "Second Quarter" && g.locked_at) {
              secondQuarter = g.final_grade;
            }
          }

          if (firstQuarter !== null && secondQuarter !== null) {
            finalAverage = Math.round((firstQuarter + secondQuarter) / 2);
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
        finalAverage,
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
    lrn_number
  } = params;

  const homeroom = await db.HomeRoom.findByPk(params.homeroom_id);
  if (!homeroom) {
    throw `Homeroom with id ${params.homeroom_id} not found`;
  }

  const existing = await db.Account.findOne({ where: { email } });
  if (existing) {
    throw `An account with the email "${email}" already exists.`;
  }

  const school_id = await generateSchoolId();

  const plainPassword = school_id;
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  // 2. Create the account
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

  // 4. Create the student record and link to account
  const student = await db.Student.create({
    account_id: account.id,
    school_id,
    sex,
    homeroom_id,
    address,
    lrn_number
  });

  return {
    message: "Student and account successfully created.",
    student,
    account: {
      username: student.school_id,
      password: plainPassword, // Send this to admin for the student
    },
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
