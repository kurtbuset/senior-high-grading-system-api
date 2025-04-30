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
  const department = await getDepartment(id)

  Object.assign(department, params)
  department.updatedAt = Date.now()
  await department.save()

  return basicDetails(department)
}

async function getAll(){
  const departments = await db.Department.findAll()
  return departments.map(x => basicDetails(x))
}

async function create(params) {
  const department = new db.Department(params)

  await department.save()

  return basicDetails(department)
}

function basicDetails(department){
  const { id, name, description } = department
  return { id, name, description }
}