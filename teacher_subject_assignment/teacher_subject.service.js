const db = require("../_helpers/db");

module.exports = {
  create,
  getSubjectsByTeacherId,
  getOneSubject,
  updatePercentages
};

async function updatePercentages(teacher_subject_id, value) {
  const { custom_ww_percent, custom_pt_percent, custom_qa_percent } = value;
  const total = custom_ww_percent + custom_pt_percent + custom_qa_percent;

  if (total > 100) {
    throw "Total percentage cannot exceed 100%"
  }

  if (total < 100) {
    throw "Total percentage must be exactly 100%"
  }

  // Perform DB update logic here...
  await db.Teacher_Subject_Assignment.update(
    {
      custom_ww_percent,
      custom_pt_percent,
      custom_qa_percent,
    },
    {
      where: { id: teacher_subject_id }
    }
  );

}


// Reusable projection function
function formatSubjectAssignment(x) {
  return {
    id: x.id,
    subjectName: x.subject.name,
    grade_level: x.grade_level,
    section: x.section,
    school_year: x.school_year,
    semester: x.semester,
    custom_ww_percent: x.custom_ww_percent,
    custom_pt_percent: x.custom_pt_percent,
    custom_qa_percent: x.custom_qa_percent
  };
}

async function getOneSubject(id) {
  const subject = await db.Teacher_Subject_Assignment.findOne({
    where: { id },
    include: [{ model: db.Subject }]
  });

  if (!subject) {
    throw new Error(`No subject assignment found with ID ${id}.`);
  }

  return formatSubjectAssignment(subject);
}

async function getSubjectsByTeacherId(teacher_id) {
  const assignments = await db.Teacher_Subject_Assignment.findAll({
    where: { teacher_id },
    include: [{ model: db.Subject }]
  });

  return assignments.map(formatSubjectAssignment);
}

async function create(params) {
  const teacher = await db.Account.findByPk(params.teacher_id);
  if (!teacher || teacher.role !== 'Teacher') {
    throw`Account with ID ${params.teacher_id} is not a teacher.`;
  }

  const subject = await db.Subject.findByPk(params.subject_id);
  if (!subject) {
    throw `Subject with ID ${params.subject_id} does not exist.`
  }

  // const duplicate = await db.Teacher_Subject_Assignment.findOne({
  //   where: {
  //     section: params.section,
  //     grade_level: params.grade_level,
  //     semester: params.semester,
  //     school_year: params.school_year
  //   }
  // });

  // if (duplicate) {
  //   throw`Section "${params.section}" already exists for Grade ${params.grade_level}, ${params.semester}, SY ${params.school_year}.`;
  // }

   const data = {
    ...params,
    custom_ww_percent: params.custom_ww_percent ?? subject.default_ww_percent,
    custom_pt_percent: params.custom_pt_percent ?? subject.default_pt_percent,
    custom_qa_percent: params.custom_qa_percent ?? subject.default_qa_percent,
  };

  const teacherSubject = await db.Teacher_Subject_Assignment.create(data);
  return basicDetails(teacherSubject);
}

function basicDetails(teacherSubject) {
  const {
    id,
    teacher_id,
    subject_id,
    school_year,
    grade_level,
    section,
    semester,
    custom_ww_percent,
    custom_pt_percent,
    custom_qa_percent
  } = teacherSubject;

  return {
    id,
    teacher_id,
    subject_id,
    school_year,
    grade_level,
    section,
    semester,
    custom_ww_percent,
    custom_pt_percent,
    custom_qa_percent
  };
}
