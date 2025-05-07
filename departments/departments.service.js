const { fn, col } = require('sequelize')

module.exports = {
  create,
  getAll,
  update,
  getById,
  delete: _delete
}

async function _delete(id) {
  const department = await getDepartment(id)
  await department.destroy()
}

async function getById(id) {
  const department = await getDepartment(id)
  return basicDetails(department)
}

async function getDepartment(id){
  const department = await db.Department.findByPk(id)
  if(!department) throw 'Department not found'

  return department
}

async function update(id, params){
  if(await db.Department.findOne({ where: { name: params.name }})){
    throw `Name '${params.name}' is already existed`
  }
  
  const department = await getDepartment(id)

  Object.assign(department, params)
  department.updatedAt = Date.now()
  await department.save()

  return basicDetails(department)
}

async function getAll(){
  const departments = await db.Department.findAll({
    attributes: {
      include: [
        [fn('COUNT', col('employees.id')), 'employeeCount']
      ]
    },
    include: [
      {
        model: db.Employee,
        attributes: [], // Do not fetch employee details, just count
      }
    ],
    group: ['departments.id']
  })
  
  return departments.map(x => basicDetails(x))
}

async function create(params) {
  if(await db.Department.findOne({ where: { name: params.name }})){
    throw `Name '${params.name}' is already existed`
  }

  const department = new db.Department(params)

  await department.save()

  return basicDetails(department) 
}

function basicDetails(department){
  // console.log(JSON.stringify(department, null, 2))
  const { id, name, description } = department
  const employeeCount = department.get('employeeCount')
  return { id, name, description, employeeCount }
}