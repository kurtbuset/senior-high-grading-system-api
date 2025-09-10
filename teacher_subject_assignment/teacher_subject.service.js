const db = require("../_helpers/db");
const model = require("../_models/account.model");

module.exports = {
  create,
  getSubjectsByTeacherId,
  getOneSubject,
  updatePercentages,
};

async function updatePercentages(teacher_subject_id, value) {
  const { custom_ww_percent, custom_pt_percent, custom_qa_percent } = value;
  const total = custom_ww_percent + custom_pt_percent + custom_qa_percent;

  if (total > 100) {
    throw "Total percentage cannot exceed 100%";
  }

  if (total < 100) {
    throw "Total percentage must be exactly 100%";
  }

  // Perform DB update logic here...
  await db.Teacher_Subject_Assignment.update(
    {
      custom_ww_percent,
      custom_pt_percent,
      custom_qa_percent,
    },
    {
      where: { id: teacher_subject_id },
    }
  );
}

// Reusable projection function
function formatSubjectAssignment(x) {
  return {
    id: x.id,
    subjectName: x.curriculum_subject.subject.name,
    grade_level: x.homeroom?.grade_level?.level || null,
    section: x.homeroom?.section || null,
    school_year: x.curriculum_subject.school_year?.school_year || null,
    semester: x.curriculum_subject.semester,
    custom_ww_percent: x.custom_ww_percent,
    custom_pt_percent: x.custom_pt_percent,
    custom_qa_percent: x.custom_qa_percent,
  };
}


async function getOneSubject(id) {
  const subject = await db.Teacher_Subject_Assignment.findOne({
    where: { id },
    include: [
      {
        model: db.Curriculum_Subject,
        as: "curriculum_subject",
        attributes: ["subject_id", "semester"],
        include: [
          { 
            model: db.Subject,
            as: "subject", // must match your association alias
            attributes: ["name"],
          },
          {
            model: db.School_Year,
            as: "school_year",
            attributes: ["school_year"], // 👈 fetch the school_year string
          },
        ],
      },
      {
        model: db.HomeRoom,
        as: "homeroom",
        attributes: ["section", "grade_level_id"],
        include: [
          { 
            model: db.Grade_Level,
            as: "grade_level", // must match your association alias
            attributes: ["level"],
          }
        ]
      },
    ],
  });

  if (!subject) {
    throw `No subject assignment found with ID ${id}.`;
  }
  return formatSubjectAssignment(subject);
}

async function getSubjectsByTeacherId(teacher_id) {
  const assignments = await db.Teacher_Subject_Assignment.findAll({
    where: { teacher_id },
    include: [
      {
        model: db.Curriculum_Subject,
        as: "curriculum_subject",
        attributes: ["subject_id", "semester"],
        include: [
          {
            model: db.Subject,
            as: "subject", // must match your association alias
            attributes: ["name"],
          },
          {
            model: db.School_Year,
            as: "school_year",
            attributes: ["school_year"], // 👈 fetch the school_year string
          },
        ],
      },
      {
        model: db.HomeRoom,
        as: "homeroom",
        attributes: ["section", "grade_level_id"],
        include: [
          { 
            model: db.Grade_Level,
            as: "grade_level", // must match your association alias
            attributes: ["level"],
          }
        ]
      },
    ],
  });

  // console.log(JSON.stringify(assignments, null, 2))

  return assignments.map(a => formatSubjectAssignment(a));
}


async function create(params) {
  // 1. Validate teacher
  const teacher = await db.Account.findByPk(params.teacher_id);
  if (!teacher || teacher.role !== "Teacher") {
    throw `Account with ID ${params.teacher_id} is not a teacher.`;
  }

  // 2. Validate homeroom
  const homeroom = await db.HomeRoom.findByPk(params.homeroom_id);
  if (!homeroom) {
    throw `Section with id ${params.homeroom_id} not found`;
  }

  // 3. Validate curriculum subject
  const curriculumSubject = await db.Curriculum_Subject.findByPk(params.curriculum_subject_id);
  if (!curriculumSubject) {
    throw `CurriculumSubject with id ${params.curriculum_subject_id} not found`;
  }

  // 4. Check for duplicate assignment
  const existing = await db.Teacher_Subject_Assignment.findOne({
    where: {
      curriculum_subject_id: params.curriculum_subject_id,
      homeroom_id: params.homeroom_id,
    },
  });

  if (existing) {
    throw `This subject is already assigned to the homeroom (id: ${params.homeroom_id}).`;
  }

  // 5. Throw error if grade_level or strand are mismatched
  if (
    homeroom.grade_level_id !== curriculumSubject.grade_level_id ||
    homeroom.strand_id !== curriculumSubject.strand_id
  ) {
    throw `Grade level mismatch!`;
  }

  // 6. Validate percentages
  const total =
    params.custom_ww_percent +
    params.custom_pt_percent +
    params.custom_qa_percent;
  if (total > 100) {
    throw `The sum of WW, PT, and QA percentages must not exceed 100.`;
  }

  // 7. Create the teacher subject assignment
  const teacherSubject = await db.Teacher_Subject_Assignment.create(params);

  // 8. Find all students in that homeroom
  const students = await db.Student.findAll({
    where: { homeroom_id: params.homeroom_id },
  });

  // 9. Auto-enroll each student into enrollments
  const enrollments = [];
  for (const student of students) {
    const enrollment = await db.Enrollment.create({
      student_id: student.id,
      teacher_subject_id: teacherSubject.id,
      is_enrolled: false, // ✅ add if you track enrollment status
    });
    enrollments.push(enrollment);
  }

  // 10. Return summary
  return {
    teacherSubject: basicDetails(teacherSubject),
    enrolled_students: enrollments.length,
  };
}

function basicDetails(teacherSubject) {
  const {
    id,
    teacher_id,
    curriculum_subject_id,
    homeroom_id,
    custom_ww_percent,
    custom_pt_percent,
    custom_qa_percent,
    school_year,
  } = teacherSubject;

  return {
    id,
    teacher_id,
    school_year,
    curriculum_subject_id,
    homeroom_id,
    custom_ww_percent,
    custom_pt_percent,
    custom_qa_percent,
  };
}

