const db = require("../_helpers/db");
const type = require("./type");

module.exports = {
  create,
  getAllSubjects,
};

async function getAllSubjects(req, res, next) {
  const subjects = await db.Subject.findAll({
    attributes: ["id", "code", "name", "type"],
  });
  return subjects; // return array of plain objects
}

async function create(params) {
  const subject = new db.Subject(params);

  await subject.save();

  return basicDetails(subject);
}

function basicDetails(subject) {
  const { id, name, type, code } = subject;

  return {
    id,
    name,
    type,
    code,
  };
}
