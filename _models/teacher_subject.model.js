const { DataTypes } = require('sequelize')

module.exports = model


function model(sequelize){

  const attributes = {
    teacher_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: 'accounts', // must match the table name
        key: 'id'
      }
      // You can add validate logic later to enforce role = 'teacher'
    },
    curriculum_subject_id: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'curriculum_subjects', // must match the table name
        key: 'id'
      }
    },
    school_year: {
      type: DataTypes.ENUM('2024-2025', '2025-2026'),
      allowNull: false
    },
    homeroom_id: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'homerooms', // must match the table name
        key: 'id'
    } 
    },
    custom_ww_percent: {
      type: DataTypes.INTEGER
    },
    custom_pt_percent: {
      type: DataTypes.INTEGER
    },
    custom_qa_percent: {
      type: DataTypes.INTEGER
    }
  }

  const options = {
    timestamps: false
  } 

  return sequelize.define('teacher_subject_assignment', attributes, options)
}