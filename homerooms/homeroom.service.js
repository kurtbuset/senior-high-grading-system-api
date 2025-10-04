const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");
const sendEmail = require("../_helpers/send-email");
const db = require("../_helpers/db");

module.exports = {
  getHomerooms,
  getOneHomeroom,
  getConsolidatedSheet,
  create,
};

async function create(params) {
  // ✅ check if teacher_id is valid and has role Teacher
  const teacher = await db.Account.findOne({
    where: { id: params.teacher_id, role: "Teacher" },
  });

  if (!teacher) {
    throw `Account with id ${params.teacher_id} is not a Teacher`;
  }

  // ✅ check if homeroom already exists for same grade_level + section + school_year
  const exists = await db.HomeRoom.findOne({
    where: {
      section: params.section,
      grade_level_id: params.grade_level_id,
      school_year_id: params.school_year_id,
    },
  });

  if (exists) {
    throw `Homeroom "${params.section}" for grade level ${params.grade_level_id} in this school year already exists`;
  }

  // ✅ create new homeroom
  const homeroom = await db.HomeRoom.create(params);
  return homeroom;
}

// services/homeroom.service.js or controller
async function getConsolidatedSheet(homeroomId, { semester }) {
  try {
    // 1️⃣ Fetch homeroom info
    const homeroom = await db.HomeRoom.findOne({
      where: { id: homeroomId },
      include: [
        {
          model: db.Grade_Level,
          as: "grade_level",
          attributes: ["id", "level"],
        },
        { model: db.Strand, as: "strand", attributes: ["id", "code", "name"] },
      ],
      attributes: [
        "id",
        "grade_level_id",
        "strand_id",
        "section",
        "school_year_id",
      ],
    });

    if (!homeroom) throw new Error("Homeroom not found");

    // 2️⃣ Fetch subjects + assigned teachers
    const subjects = await db.Curriculum_Subject.findAll({
      where: {
        grade_level_id: homeroom.grade_level_id,
        strand_id: homeroom.strand_id,
        semester,
        school_year_id: homeroom.school_year_id,
      },
      include: [
        { model: db.Subject, as: "subject", attributes: ["id", "name"] },
        {
          model: db.Teacher_Subject_Assignment,
          as: "assignments",
          required: false,
          where: { homeroom_id: homeroom.id },
          include: [
            {
              model: db.Account,
              as: "teacher",
              attributes: ["id", "firstName", "lastName"],
            },
          ],
        },
      ],
      attributes: ["id", "subject_id"],
    });

    const subjectIdsSet = new Set(subjects.map((s) => s.subject_id));

    const shapedSubjects = subjects.map((s) => {
      const assignment = s.assignments[0];
      return {
        curriculum_subject_id: s.id, // ✅ curriculum_subject.id
        subject: s.subject,
        teacherId: assignment?.teacher?.id || null,
        teacher: assignment?.teacher
          ? `${assignment.teacher.lastName}, ${assignment.teacher.firstName}`
          : null,
      };
    });

    // 3️⃣ Fetch students + enrollments + grades
    const students = await db.Student.findAll({
      where: { homeroom_id: homeroom.id },
      include: [
        { model: db.Account, attributes: ["id", "firstName", "lastName"] },
        {
          model: db.Enrollment,
          as: "enrollments",
          include: [
            {
              model: db.Teacher_Subject_Assignment,
              as: "assignment",
              include: [
                {
                  model: db.Curriculum_Subject,
                  as: "curriculum_subject",
                  attributes: ["id", "subject_id"], // ✅ include id here
                },
              ],
            },
            {
              model: db.Final_Grade,
              as: "final_grades",
              attributes: ["quarter", "final_grade", "locked_at"],
            },
          ],
        },
      ],
      order: [
        [{ model: db.Account, as: "account" }, "lastName", "ASC"],
        [{ model: db.Account, as: "account" }, "firstName", "ASC"],
      ],
      attributes: ["id", "account_id"],
    });

    // 4️⃣ Shape student grades
    const shapedStudents = students.map((student) => {
      const gradesBySubject = {};

      student.enrollments.forEach(({ assignment, final_grades }) => {
        const curriculumSubjId = assignment?.curriculum_subject?.id;
        if (
          !curriculumSubjId ||
          !subjectIdsSet.has(assignment.curriculum_subject.subject_id)
        )
          return;

        const subjectGrades = gradesBySubject[curriculumSubjId] ?? {
          first: null,
          second: null,
          ave: null,
        };

        // get latest per quarter
        const latestByQuarter = {};
        final_grades.forEach(({ quarter, final_grade, locked_at }) => {
          if (
            !latestByQuarter[quarter] ||
            new Date(locked_at) > new Date(latestByQuarter[quarter].locked_at)
          ) {
            latestByQuarter[quarter] = { final_grade, locked_at };
          }
        });

        if (latestByQuarter["First Quarter"]) {
          subjectGrades.first = latestByQuarter["First Quarter"].final_grade;
        }
        if (latestByQuarter["Second Quarter"]) {
          subjectGrades.second = latestByQuarter["Second Quarter"].final_grade;
        }

        // compute SFG if both quarters exist
        if (subjectGrades.first !== null && subjectGrades.second !== null) {
          subjectGrades.ave = Math.round(
            (subjectGrades.first + subjectGrades.second) / 2
          );
        }

        gradesBySubject[curriculumSubjId] = subjectGrades; // ✅ correct key now
      });

      return {
        id: student.id,
        name: `${student.account.lastName}, ${student.account.firstName}`,
        grades: gradesBySubject,
      };
    });

    // 5️⃣ Return combined data
    return { homeroom, subjects: shapedSubjects, students: shapedStudents };
  } catch (error) {
    console.error("Error fetching consolidated sheet:", error);
    throw error;
  }
}


async function getOneHomeroom(homeroomId) {
  const homeroom = await db.HomeRoom.findOne({
    where: { id: homeroomId },
    include: [
      {
        model: db.Grade_Level,
        as: "grade_level",
        attributes: ["level"], // only fetch "level"
      },
      {
        model: db.Strand,
        as: "strand",
        attributes: ["name"], // only fetch "name"
      },
      {
        model: db.School_Year,
        as: "school_year",
        attributes: ["school_year"], // only fetch "name"
      },
    ],
    attributes: ["id", "section"], // only fetch "id" and "section" from homeroom
  });

  if (!homeroom) throw `No homeroom found with id ${id}`;

  return {
    id: homeroom.id,
    grade_level: homeroom.grade_level.level,
    section: homeroom.section,
    strand: homeroom.strand.name,
    school_year: homeroom.school_year.school_year,
  };
}

async function getHomerooms(role, accountId) {
  const whereClause = {};

  if (role === "Teacher") {
    whereClause.teacher_id = accountId; // only their homerooms
  }
  // Registrar or Principal → no filter (all homerooms)
  console.log(role);
  console.log(whereClause);

  const homerooms = await db.HomeRoom.findAll({
    where: whereClause,
    attributes: ["id", "section"],
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
      {
        model: db.School_Year,
        as: "school_year",
        attributes: ["school_year"],
      },
    ],
    raw: true,
    nest: true,
  });

  return homerooms.map((h) => ({
    id: h.id,
    grade_level: h.grade_level.level,
    section: h.section,
    strand: h.strand.name,
    school_year: h.school_year.school_year,
  }));
}
