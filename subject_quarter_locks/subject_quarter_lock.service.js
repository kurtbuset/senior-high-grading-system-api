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
  updateSubjectStatus
}

async function updateSubjectStatus(id, { status, quarter }) {
  console.log(id)
  console.log(status)
  const record = await db.Subject_Quarter_Lock.findOne({
    where: { teacher_subject_id: id, quarter  },
  });

  if (!record) throw "Subject lock record not found";

  record.status = status;
  record.reason_to_unlock = ''
  await record.save();

  console.log(JSON.stringify(record, null, 2))

  return record;
}


async function requestToUnlock(teacher_subject_id, params) {
  console.log("Teacher Subject ID:", teacher_subject_id);
  console.log("Params:", params);

  const lock = await db.Subject_Quarter_Lock.findOne({
    where: {
      teacher_subject_id,
      quarter: params.quarter,
    },
  });

  if (!lock) {
    throw new Error("No lock record found for this subject and quarter.");
  }

  lock.reason_to_unlock = params.reason;
  lock.status = "PENDING";

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
    lock.status = 'LOCKED';
    lock.lock_counts = (lock.lock_counts || 1) + 1;
    await lock.save();
  } else {
    // Create new record
    lock = await db.Subject_Quarter_Lock.create({
      teacher_subject_id,
      quarter,
      lock_counts: 1,
      status: 'LOCKED',
    });
  }

  return lock;
}
