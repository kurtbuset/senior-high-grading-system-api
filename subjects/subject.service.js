const db = require("../_helpers/db");
const type = require("./type");

module.exports = {
  create,
};

async function create(params) {
  const subject = new db.Subject(params);

  await subject.save();

  return basicDetails(subject);
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
