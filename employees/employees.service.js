module.exports = {
  create,
  getAll,
  getById
}

async function getById(id) {
  const employee = await getEmployee(id)
  return basicDetails(employee)
}

async function getEmployee(id){
  const employee = await db.Employee.findByPk(id)
  if(!employee) throw 'Employee not found'

  return employee
}

async function create(params){
  const employee = new db.Employee(params)

  await employee.save()
  // console.log('testing create employee')
  // console.log(JSON.stringify(employee, null, 2))
  return basicDetails(employee)
}

function basicDetails(employee){
  const { id, position, isActive, hireDate, userId, departmentId, account, department } = employee
  // console.log(JSON.stringify(employee, null, 2))
  return { id, position, isActive, hireDate, userId, departmentId, account, department }
}

async function getAll(){
  const employees = await db.Employee.findAll({
    include: [
      { model: db.Account, attributes: ['email']},
      { model: db.Department, attributes: ['name']},
    ]
  })

  return employees.map(x => basicDetails(x))
}