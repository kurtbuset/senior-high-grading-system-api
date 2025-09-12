const db = require("../_helpers/db");

module.exports = {
  create
}

async function create(params){
  // check if grade level already exists
  const exists = await db.Grade_Level.findOne({ where: { level: params.level } });
  if (exists) {
    throw `Grade level "${params.level}" already exists`;
  }

  // create new grade level
  const gradeLevel = await db.Grade_Level.create(params);
  return gradeLevel;
}