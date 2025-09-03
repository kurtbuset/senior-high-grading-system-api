const { DataTypes } = require('sequelize')

module.exports = model


function model(sequelize){

  const attributes = {
    subject_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: 'subjects', // must match the table name
        key: 'id'
      }
    },
    grade_level_id: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'grade_levels', // must match the table name
        key: 'id'
      }
    },
    strand_id: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'strands', // must match the table name
        key: 'id'
      } 
    },
    semester: {
      type: DataTypes.ENUM('FIRST SEMESTER', 'SECOND SEMESTER'),
      allowNull: false
    },
    school_year_id: { type: DataTypes.INTEGER, allowNull: false, references: {
        model: 'school_years', // must match the table name
        key: 'id'
      } 
    }
  }
  
  const options = {
    timestamps: false
  }

  return sequelize.define('curriculum_subject', attributes, options)
}