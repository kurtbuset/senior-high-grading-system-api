const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");
const sendEmail = require("../_helpers/send-email");
const db = require("../_helpers/db");

module.exports = {
  create,
  getSubjectsLockingHistory,
};

async function getSubjectsLockingHistory(homeroomId) {
  const grades = await db.Final_Grade.findAll({
    include: [
      {
        model: db.Enrollment,
        as: "enrollment",
        required: true,
        include: [
          {
            model: db.Teacher_Subject_Assignment,
            as: "assignment",
            required: true,
            where: { homeroom_id: homeroomId },
            include: [
              {
                model: db.Curriculum_Subject,
                as: "curriculum_subject",
                include: [{ model: db.Subject, as: "subject" }],
              },
              { model: db.Account, as: "account" },
              {
                model: db.Subject_Quarter_Lock,
                as: "quarter_locks",
                required: false,
              },
            ],
          },
          {
            model: db.Student,
            as: "student",
            include: [{ model: db.Account, as: "account" }],
          },
        ],
      },
    ],
    order: [["locked_at", "DESC"]],
  });

  const subjectMap = new Map();

  for (const grade of grades) {
    const assignment = grade.enrollment?.assignment;
    const student = grade.enrollment?.student;
    if (!assignment || !student || !grade.locked_at) continue;

    const subjectKey = [
      assignment.curriculum_subject?.subject?.name,
      assignment.curriculum_subject?.semester,
      grade.quarter,
      `${assignment.account?.firstName ?? ""} ${assignment.account?.lastName ?? ""}`,
    ].join("|");

    if (!subjectMap.has(subjectKey)) {
      // find matching quarter lock
      const lockRecord = assignment.quarter_locks?.find(
        (l) => l.quarter === grade.quarter
      );

      subjectMap.set(subjectKey, {
        assignment_id: assignment.id,
        subject_name: assignment.curriculum_subject?.subject?.name,
        semester: assignment.curriculum_subject?.semester,
        quarter: grade.quarter,
        teacher_name: `${assignment.account?.firstName ?? ""} ${assignment.account?.lastName ?? ""}`,
        lock_status: lockRecord?.status || null,
        reason_to_unlock: lockRecord?.reason_to_unlock || null,
        locked_batches: [],
      });
    }

    const subjectEntry = subjectMap.get(subjectKey);

    const lockedKey = grade.locked_at.toISOString();
    let batch = subjectEntry.locked_batches.find(
      (b) => b.locked_key === lockedKey
    );

    if (!batch) {
      batch = {
        locked_key: lockedKey,
        locked_at: grade.locked_at,
        students: [],
      };
      subjectEntry.locked_batches.push(batch);
    }

    batch.students.push({
      student_id: student.id,
      lastName: student.account?.lastName,
      firstName: student.account?.firstName,
      final_grade: grade.final_grade,
    });
  }

  // Sort
  for (const entry of subjectMap.values()) {
    for (const batch of entry.locked_batches) {
      batch.students.sort((a, b) =>
        (a.lastName || "").localeCompare(b.lastName || "")
      );
    }
    entry.locked_batches.sort(
      (a, b) => new Date(b.locked_at) - new Date(a.locked_at)
    );
  }

  return Array.from(subjectMap.values());
}



async function create(params) {
  console.log(params);
  const inserted = await db.Final_Grade.bulkCreate(params, { returning: true });

  return inserted;
}
