const db = require("../_helpers/db");

module.exports = {
  create,
  getByTeacherId
}

async function getByTeacherId(teacher_id){
  const assignments = await db.Teacher_Subject_Assignment.findAll({
    where: { teacher_id },
    include: [{ model: db.Subject }]
  });

  console.log(JSON.stringify(assignments, null, 2))

  return assignments.map(x => ({
    id: x.id,
    subjectName: x.subject.name,
    grade_level: x.grade_level,
    section: x.section,
    school_year: x.school_year,
    semester: x.semester,
    default_ww_percent: x.subject.default_ww_percent,
    default_pt_percent: x.subject.default_pt_percent,
    default_qa_percent: x.subject.default_qa_percent
  }));
}

async function create(params) {
  const teacher = await db.Account.findByPk(params.teacher_id);
  if (!teacher || teacher.role !== 'Teacher') {
    throw(`Account with ID ${params.teacher_id} is not a teacher.`);
  }

  const subject = await db.Subject.findByPk(params.subject_id);
  if (!subject) {
    throw(`Subject with ID ${params.subject_id} does not exist.`);
  }

  const exists = await db.Teacher_Subject_Assignment.findOne({
    where: {
      section: params.section,
      grade_level: params.grade_level,
      semester: params.semester,
      school_year: params.school_year
    }
  })

  if (exists) {
    throw new Error(`Section "${params.section}" already exists for Grade ${params.grade_level}, ${params.semester}, SY ${params.school_year}. Choose another section.`)
  }

  const teacherSubject = new db.Teacher_Subject_Assignment(params)
  await teacherSubject.save()
  return basicDetails(teacherSubject)
}


function basicDetails(teacherSubject){
  const { id, teacher_id, subject_id, school_year, grade_level, section, semester, custom_ww_percent, custom_pt_percent, custom_qa_percent} = teacherSubject
  return { id, teacher_id, subject_id, school_year, grade_level, section, semester, custom_ww_percent, custom_pt_percent, custom_qa_percent }
} 