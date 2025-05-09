const Status = require('../_helpers/status')

module.exports = {
  create
}

async function create(params) {
  const employee = await db.Employee.findOne({ where: { id: params.employeeId}})

  if(!employee){
    throw `cant find employee ${params.employeeId}`
  }

  
  const request = new db.Request(params)
  request.status = Status.Pending
  await request.save()

  return basicDetails(request)
}

function basicDetails(request){
  const { id, employeeId, type, items, status } = request

  return { id, employeeId, type, items, status }
}