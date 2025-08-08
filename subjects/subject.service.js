const db = require("../_helpers/db");
const type = require("./type");

module.exports = {
  create,
  getAll,
  getById,
  update,
  delete: deleteSubject
};

async function create(params) {
  const subject = new db.Subject(params);

  await subject.save();

  return basicDetails(subject);
}

async function getAll() {
  const subjects = await db.Subject.findAll();

  return subjects.map(basicDetails);
}

async function getById(id) {
  const subject = await db.Subject.findByPk(id);

  if (!subject) throw 'Subject not found';

  return basicDetails(subject);
}

async function update(id, params) {
  const subject = await db.Subject.findByPk(id);

  if (!subject) throw 'Subject not found';

  Object.assign(subject, params);

  await subject.save();

  return basicDetails(subject);
}

async function deleteSubject(id) {
  const subject = await db.Subject.findByPk(id);

  if (!subject) throw 'Subject not found';

  await subject.destroy();
}

function basicDetails(subject) {
  const {
    id,
    name,
    type,
    default_ww_percent,
    default_pt_percent,
    default_qa_percent,
  } = subject;

  return {
    id,
    name,
    type,
    default_ww_percent,
    default_pt_percent,
    default_qa_percent,
  };
}
