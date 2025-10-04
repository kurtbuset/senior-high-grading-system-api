const { DataTypes } = require('sequelize')

module.exports = model

function model(sequelize){

  const attributes = {
    teacher_subject_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: "teacher_subject_assignments",
        key: "id",
      }
    },
    quarter: { type: DataTypes.ENUM('First Quarter', 'Second Quarter'), allowNull: false },
    lock_counts: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('LOCKED', 'UNLOCKED'), allowNull: false }
  } 
  
  const options = {   
    timestamps: false
  } 

  return sequelize.define('subject_quarter_lock', attributes, options)
}