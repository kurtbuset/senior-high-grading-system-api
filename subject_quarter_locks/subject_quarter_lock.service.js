const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");
const sendEmail = require("../_helpers/send-email");
const db = require("../_helpers/db");

module.exports = {
  lockSubject,
  requestToUnlock,
  updateSubjectStatus,
  getPendingUnlockRequests,
};

async function updateSubjectStatus(id, { status, quarter }) {
  console.log(id);
  console.log(status);
  const record = await db.Subject_Quarter_Lock.findOne({
    where: { teacher_subject_id: id, quarter },
  });

  if (!record) throw "Subject lock record not found";

  record.status = status;
  record.reason_to_unlock = "";
  await record.save();

  console.log(JSON.stringify(record, null, 2));

  return record;
}

async function requestToUnlock(teacher_subject_id, params) {
  const lock = await db.Subject_Quarter_Lock.findOne({
    where: {
      teacher_subject_id,
      quarter: params.quarter,
    },
  });

  if (!lock) throw new Error("No lock record found.");

  lock.status = "PENDING";
  lock.reason_to_unlock = params.reason_to_unlock;

  await lock.save();

  return lock;
}

async function lockSubject({ teacher_subject_id, quarter }) {
  // Check if a record already exists
  let lock = await db.Subject_Quarter_Lock.findOne({
    where: { teacher_subject_id, quarter },
  });

  if (lock) {
    // Update existing record
    lock.status = "LOCKED";
    lock.lock_counts = (lock.lock_counts || 1) + 1;
    await lock.save();
  } else {
    // Create new record
    lock = await db.Subject_Quarter_Lock.create({
      teacher_subject_id,
      quarter,
      lock_counts: 1,
      status: "LOCKED",
    });
  }

  return lock;
}

async function getPendingUnlockRequests() {
  const requests = await db.Subject_Quarter_Lock.findAll({
    where: { status: "PENDING" },
    include: [
      {
        model: db.Teacher_Subject_Assignment,
        as: "assignment",
        include: [
          {
            model: db.Account,
            as: "teacher",
            attributes: ["firstName", "lastName"],
          },
          {
            model: db.Curriculum_Subject,
            as: "curriculum_subject",
            include: [
              {
                model: db.Subject,
                as: "subject",
                attributes: ["name"],
              },
            ],
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
                model: db.School_Year,
                as: "school_year",
                attributes: ["school_year"],
              },
            ],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });

  // Transform the data to match frontend expectations
  return requests.map((request) => ({
    id: request.id,
    teacher_subject_id: request.teacher_subject_id,
    quarter: request.quarter,
    status: request.status,
    reason_to_unlock: request.reason_to_unlock,
    lock_counts: request.lock_counts,
    subject_name:
      request.assignment?.curriculum_subject?.subject?.name || "N/A",
    teacher_name: request.assignment?.teacher
      ? `${request.assignment.teacher.firstName} ${request.assignment.teacher.lastName}`
      : "N/A",
    grade_level: request.assignment?.homeroom?.grade_level?.level || 0,
    section: request.assignment?.homeroom?.section || "N/A",
    school_year:
      request.assignment?.homeroom?.school_year?.school_year || "N/A",
  }));
}
