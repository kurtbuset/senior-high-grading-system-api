const { DataTypes } = require('sequelize')

module.exports = model


function model(sequelize){

  const attributes = {
    teacher_subject_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: 'teacher_subject_assignments', // must match the table name
        key: 'id'
      }
    },
    quarter: { type: DataTypes.ENUM('First Quarter', 'Second Quarter'), allowNull: false },
    locked_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    is_locked: { type: DataTypes.BOOLEAN, 
      allowNull: false, 
      defaultValue: false }
  }

  const options = {
    timestamps: false
  } 

  return sequelize.define('assignment_quarter_lock', attributes, options)
}