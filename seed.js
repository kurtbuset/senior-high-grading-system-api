const bcrypt = require('bcryptjs')
const role = require('./_helpers/role')
const db = require('./_helpers/db')

async function seed(){
  await db.initialize()

  // await db.Account.create({
  //   email: 'admin@gmail.com',
  //   passwordHash: await bcrypt.hash('admin123', 10),
  //   firstName: 'maria',
  //   lastName: 'teresa',
  //   isActive: 1,
  //   verified: Date.now(),
  //   role: role.Teacher,
  //   created: Date.now()
  // })
  
  // await db.Account.create({
  //   email: 'maria@gmail.com',
  //   passwordHash: await bcrypt.hash('maria123', 10),
  //   firstName: 'maria',
  //   lastName: 'teresa',
  //   isActive: 1,
  //   verified: Date.now(),
  //   role: role.Teacher,
  //   created: Date.now()
  // })
  
  // await db.Account.create({
  //   email: 'juan@gmail.com',
  //   passwordHash: await bcrypt.hash('juan12345', 10),
  //   firstName: 'juan',
  //   lastName: 'reyes',
  //   isActive: 1,
  //   verified: Date.now(),
  //   role: role.Teacher,
  //   created: Date.now()
  // })

  // await db.Subject.create({
  //   name: 'Oral Communication',
  //   type: 'Core Subjects',
  //   default_ww_percent: 25,
  //   default_pt_percent: 50,
  //   default_qa_percent: 25
  // })

  // await db.Subject.create({
  //   name: 'Reading and Writing',
  //   type: 'Core Subject',
  //   default_ww_percent: 25,
  //   default_pt_percent: 50,
  //   default_qa_percent: 25
  // })

  // await db.Student.create({
  //   firstname: "Kurt",
  //   lastname: "Cagulang"
  // })

  // await db.Student.create({
  //   firstname: "Christian",
  //   lastname: "Trangia"
  // })

  // await db.Student.create({
  //   firstname: "Kerbi",
  //   lastname: "Cabagnot"
  // })

  // await db.Student.create({
  //   firstname: "Mams",
  //   lastname: "Jarumay"
  // })

      await db.Enrollment.create({
        student_id: 1,
        teacher_subject_id: 2,
        is_enrolled: false
      })

      await db.Enrollment.create({
        student_id: 2,
        teacher_subject_id: 2,
        is_enrolled: false
      })

      await db.Enrollment.create({
        student_id: 3,
        teacher_subject_id: 2,
        is_enrolled: false
      })

      await db.Enrollment.create({
        student_id: 4,
        teacher_subject_id: 2,
        is_enrolled: false
      })


  console.log('seeder success')
  process.exit()
}


seed().catch(err => {
  console.error('❌ Seed failed arghh:', err)
  process.exit(1)
})  