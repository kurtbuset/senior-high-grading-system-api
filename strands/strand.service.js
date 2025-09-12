const db = require("../_helpers/db");

module.exports = {
  create
}

async function create(params){
  // 🔎 check if code already exists
  const exists = await db.Strand.findOne({ where: { code: params.code } });
  if (exists) {
    throw `Strand code "${params.code}" already exists`;
  }

  // 🔎 check if name already exists
  const nameExists = await db.Strand.findOne({ where: { name: params.name } });
  if (nameExists) {
    throw `Strand name "${params.name}" already exists`;
  }

  // ✅ create strand
  const strand = await db.Strand.create(params);
  return strand;
}