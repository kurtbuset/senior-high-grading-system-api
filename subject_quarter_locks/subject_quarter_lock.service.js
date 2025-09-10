const config = require("../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { Op } = require("sequelize");
const sendEmail = require("../_helpers/send-email");
const db = require("../_helpers/db");

module.exports = {
  lockSubject
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
