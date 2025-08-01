const db = require("../_helpers/db");

module.exports = {
  create,
  getStudentInfo
};


async function getStudentInfo(id){
  console.log('account id: ', id)
}


async function create(params) {
  const student = new db.Student(params)

  await student.save()
  
  return basicDetails(student)
}

function basicDetails(student){
  const { id, firstname, lastname } = student
  return { id, firstname, lastname }
}