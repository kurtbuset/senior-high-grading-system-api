require('dotenv').config();
const { Sequelize } = require('sequelize');
const teacherSubjectAssignmentModel = require('../_models/teacher_subject.model');
const bcrypt = require('bcryptjs')
const role = require('../_helpers/role')

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);

const TeacherSubjectAssignment = teacherSubjectAssignmentModel(sequelize);

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database.');

    await TeacherSubjectAssignment.sync(); // Ensure table exists

    await TeacherSubjectAssignment.bulkCreate([
      {
        teacher_id: 4,
        curriculum_subject_id: 2,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      },
      {
        teacher_id: 4,
        curriculum_subject_id: 3,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      },
      {
        teacher_id: 4,
        curriculum_subject_id: 4,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      },
      {
        teacher_id: 4,
        curriculum_subject_id: 5,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      },
      {
        teacher_id: 4,
        curriculum_subject_id: 6,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      },
      {
        teacher_id: 4,
        curriculum_subject_id: 7,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      },
      {
        teacher_id: 4,
        curriculum_subject_id: 8,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      },
      {
        teacher_id: 4,
        curriculum_subject_id: 9,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      },
      {
        teacher_id: 4,
        curriculum_subject_id: 10,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 5,
        curriculum_subject_id: 11,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 5,
        curriculum_subject_id: 12,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 5,
        curriculum_subject_id: 13,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 5,
        curriculum_subject_id: 14,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 5,
        curriculum_subject_id: 15,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 6,
        curriculum_subject_id: 16,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 6,
        curriculum_subject_id: 17,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 6,
        curriculum_subject_id: 18,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 6,
        curriculum_subject_id: 19,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
      ,
      {
        teacher_id: 6,
        curriculum_subject_id: 20,
        homeroom_id: 1,
        custom_ww_percent: 25,
        custom_pt_percent: 50,
        custom_qa_percent: 25
      }
    ]);

    console.log('✅ TeacherSubjectAssignment seeded!');
    await sequelize.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
