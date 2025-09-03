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
  getSubjectsHistory
};

async function getSubjectsHistory(homeroomId){
  
}


// services/homeroom.service.js or controller
async function getConsolidatedSheet(homeroomId, { semester }) {
  try {
    // 1. Homeroom info
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
      attributes: ["id", "grade_level_id", "strand_id", "section", "school_year_id"],
    });

    if (!homeroom) throw new Error("Homeroom not found");

    // 2. Subjects (by grade + strand + semester)
    const subjects = await db.Curriculum_Subject.findAll({
      where: {
        grade_level_id: homeroom.grade_level_id,
        strand_id: homeroom.strand_id,
        semester,
        school_year_id: homeroom.school_year_id,
      },
      include: [
        { model: db.Subject, as: "subject", attributes: ["id", "name"] },
      ],
      attributes: ["id", "subject_id"],
    });

    // Build quick lookup for subject_ids
    const subjectIds = subjects.map((s) => s.subject_id);

    // 3. Students (accounts + enrollments + grades)
    const students = await db.Student.findAll({
      where: { homeroom_id: homeroom.id },
      include: [
        {
          model: db.Account,
          attributes: ["id", "firstName", "lastName"],
        },
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
                  attributes: ["subject_id"],
                },
              ],
            },
            {
              model: db.Final_Grade,
              as: "final_grades",
              attributes: ["quarter", "final_grade"],
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

    // 4. Shape data (flattened + optimized lookups)
    const shapedStudents = students.map((student) => {
      const gradesBySubject = {};

      for (const { assignment, final_grades } of student.enrollments) {
        const subjId = assignment?.curriculum_subject?.subject_id;
        if (!subjId || !subjectIds.includes(subjId)) continue;

        // Initialize slot if not already
        const subjectGrades = gradesBySubject[subjId] || { first: null, second: null, ave: null };

        for (const { quarter, final_grade } of final_grades) {
          if (quarter === "First Quarter") subjectGrades.first = final_grade;
          else if (quarter === "Second Quarter") subjectGrades.second = final_grade;
        }

        if (subjectGrades.first !== null && subjectGrades.second !== null) {
          subjectGrades.ave = Math.round((subjectGrades.first + subjectGrades.second) / 2);
        }

        gradesBySubject[subjId] = subjectGrades;
      }

      return {
        id: student.id,
        name: `${student.account.lastName}, ${student.account.firstName}`,
        grades: gradesBySubject,
      };
    });

    return { homeroom, subjects, students: shapedStudents };
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
    school_year: homeroom.school_year.school_year
  };
}

async function getHomerooms() {
  const homerooms = await db.HomeRoom.findAll({
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
    nest: true, // so grade_level and strand appear as nested objects
  });

  // Reformat the result
  return homerooms.map((h) => ({
    id: h.id,
    grade_level: h.grade_level.level,
    section: h.section,
    strand: h.strand.name,
    school_year: h.school_year.school_year
  }));
}
