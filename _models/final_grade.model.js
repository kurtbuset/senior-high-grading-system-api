const { DataTypes } = require('sequelize')

module.exports = model


function model(sequelize){

  const attributes = {
    enrollment_id: {
      type: DataTypes.INTEGER, allowNull: false,
      references: {
        model: 'enrollments', // must match the table name
        key: 'id'
      }
      // You can add validate logic later to enforce role = 'teacher'
    },
    final_grade: { type: DataTypes.INTEGER, allowNull: false },
    quarter: { type: DataTypes.ENUM('First Quarter', 'Second Quarter'), allowNull: false },
    locked_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }

  const options = {
    timestamps: false
  } 

  return sequelize.define('final_grade', attributes, options)
}